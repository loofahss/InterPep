import * as mol from '3dmol'
import Icon from '@ant-design/icons'
import { Button, Radio, Space } from 'antd'
import { TableData } from 'app_models/search'
import ExportSvg from 'assets/icons/Export.svg?react'
import { useEffect, useRef, useState } from 'react'

export default function Structure({
	data,
	handleExport
}: {
	data: TableData | undefined
	handleExport: (uri: string, t: string) => void
}) {
	const molRef = useRef<HTMLDivElement>(null)
	const viewer = useRef<any>(null)
	useEffect(() => {
		if (!data || !molRef.current) return
		viewer.current = mol.createViewer(molRef.current)
		console.log('structure:', data, 'data.neuropeptide:', data.neuropeptide)
		viewer.current.addModel(data.neuropeptide, 'pdb') // 使用传入的 PDB 数据
		viewer.current.zoomTo()
		viewer.current.render()
		viewer.current.setStyle({ chain: 'A' }, { cartoon: { color: 'spectrum' } })
		viewer.current.setStyle(
			{ chain: 'B' },
			{ stick: { colorscheme: 'orangeCarbon' } }
		)
		viewer.current.setStyle(
			{ chain: 'C' },
			{ sphere: { colorscheme: 'white' } }
		)
		viewer.current.zoom(1.1, 1000)
	}, [data])

	const [style, setStyle] = useState<string>('complex')
	const setting: any = {
		stick: { colorscheme: 'orangeCarbon', hidden: true },
		sphere: { colorscheme: 'white', hidden: true },
		cartoon: { color: 'spectrum', hidden: true },
		surface: { opacity: 0.7, color: 'white', hidden: true }
	}
	const handleStyleChange = (e: any) => {
		setStyle(e.target.value)
		if (e.target.value !== 'complex') {
			if (e.target.value === 'surface') {
				viewer.current.addSurface(
					'surface',
					{
						type: 'VDW', // 表面类型：VDW（范德华表面）、SAS（溶剂可及表面）、MS（分子表面）
						opacity: 0.7, // 透明度（0-1）
						color: 'spectrum' // 颜色或颜色映射函数
					},
					{ chain: 'A' }
				)
				viewer.current.addSurface(
					'surface',
					{
						type: 'VDW', // 表面类型：VDW（范德华表面）、SAS（溶剂可及表面）、MS（分子表面）
						opacity: 0.7, // 透明度（0-1）
						color: 'red' // 颜色或颜色映射函数
					},
					{ chain: 'B' }
				)
			}

			setting[e.target.value].hidden = false
			viewer.current.setStyle({ resi: '1-9999999' }, setting)
		} else {
			viewer.current.setStyle(
				{ chain: 'A' },
				{ cartoon: { color: 'spectrum' } }
			)
			viewer.current.setStyle(
				{ chain: 'B' },
				{ stick: { colorscheme: 'orangeCarbon' } }
			)
		}
		viewer.current.render()
	}

	return (
		<div className='flex h-[70vh]   w-[80vw] flex-col bg-white md:h-[90vh] md:w-[80vw] md:flex-row '>
			<div ref={molRef} className='relative flex-1' />
			<div className='flex w-[200px] flex-col justify-between py-[20px] '>
				<div className='top md:order-1'>
					<p>Change style</p>
					<Radio.Group onChange={handleStyleChange} value={style}>
						<Space direction='vertical'>
							<Radio value='complex'>complex</Radio>
							<Radio value='cartoon'>cartoon</Radio>
							<Radio value='stick'>stick</Radio>
							<Radio value='sphere'>sphere</Radio>
							<Radio value='surface'>surface</Radio>
						</Space>
					</Radio.Group>
				</div>
				<div className='bottom md:order-2'>
					<Button
						type='link'
						onClick={() => {
							const uri = viewer.current.pngURI()
							handleExport(uri, style)
						}}
					>
						<Icon component={ExportSvg}></Icon>Export current image
					</Button>
				</div>
			</div>
		</div>
	)
}
