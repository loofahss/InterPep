import Icon from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import {
	Button,
	Descriptions,
	DescriptionsProps,
	Divider,
	Typography
} from 'antd'
import session from 'api/sys/session'
import { TableData } from 'app_models/search'
import InformationSvg from 'assets/icons/Information.svg?react'
import { getQuery } from 'assets/js/publicFunc'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import Structure from './components/Structure'
import { Table } from 'antd/lib'
import './index.less'
export interface peptidedata {
	peptideid: string
	peptideSequence: string
	PEI: string
	pdb: string
}
const ResultPage = () => {
	const [t] = useTranslation()
	const location = useLocation()
	const pdbdata = location.state?.tableData
	// const initialPdbData = location.state?.tableData.neuropeptide
	// const [pdbdata, setPdbdata] = useState(initialPdbData)
	// const handleViewStructure = (pdb: string) => {
	// 	console.log('pdb:', pdb)
	// 	setPdbdata(pdb)
	// }
	// console.log('resultpage_pdbdata', pdbdata)
	const peptides = location.state?.peptidedata
	console.log('resultpage_peptides', peptides)
	const query = getQuery()
	const fetchScreenData = useCallback(async () => {
		if (!query.id) return undefined
		const data: any = await session.search({ id: query.id })
		return data || undefined
	}, [query])

	const { isLoading, data } = useQuery<TableData>({
		queryKey: ['searchId', query],
		queryFn: fetchScreenData
	})
	const { isLoading: isPeptideLoading, data: peptidedata } = useQuery<Peptide>({
		queryKey: ['searchId', query],
		queryFn: fetchScreenData
	})

	const exportImage = (uri: string, t: string) => {
		const a = document.createElement('a')
		a.href = uri
		a.download = `${query.id}_${t}.png`
		a.click()
	}

	if (isLoading) {
		return <div>loading...</div>
	}
	if (isPeptideLoading) {
		return <div>loading...</div>
	}

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id'
		},
		{
			title: 'Sequence',
			dataIndex: 'sequence',
			key: 'sequence'
		},
		{
			title: 'PEI',
			dataIndex: 'pei',
			key: 'PEI'
		},
		{
			title: '3D Structure',
			key: 'pdb',
			dataIndex: 'pdb'
		}
		// {
		// 	title: '3D Structure',
		// 	key: 'pdb',
		// 	dataIndex: 'pdb',
		// 	render: (text: any, record: { pdb: string }) => (
		// 		<Button onClick={() => handleViewStructure(record.pdb)}>
		// 			View 3D Structure
		// 		</Button>
		// 	)
		// }
	]

	// const PeptideList: React.FC = () => {
	// 	return (
	// 		<div>
	// 			<Table
	// 				columns={columns}
	// 				dataSource={descriptionpeptides}
	// 				rowKey={item => item.peptideid}
	// 				className='mt-[20px]'
	// 			/>
	// 		</div>
	// 	)
	// }

	return (
		<div className='result-page py-[20px]'>
			<div className='content'>
				<div>
					<Table
						columns={columns}
						dataSource={peptides}
						rowKey={item => item.id}
						className='mt-[20px]'
					/>
				</div>
				<Typography.Title level={5} className='header'>
					3D Structure
				</Typography.Title>
				<div className='content-wrapper'>
					<p className='m-0 text-lg font-bold'>{query.id}</p>
					<Divider className='my-[12px]' />
					<p>
						Basic information&nbsp;
						<Icon component={InformationSvg}></Icon>
					</p>
					{/* <Descriptions
						column={1}
						className='bg-white'
						bordered
						items={descriptionItems}
					/> */}
					<Divider className='my-[12px]' />
					<p>
						Structure&nbsp;
						<Icon component={InformationSvg}></Icon>
					</p>
					<Structure data={pdbdata} handleExport={exportImage} />
				</div>
			</div>
		</div>
	)
}

export default ResultPage
