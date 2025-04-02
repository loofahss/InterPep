import { useQuery } from '@tanstack/react-query'
import { useLocalStorageState } from 'ahooks'
import { Button, Input, Typography, message } from 'antd'
import session from 'api/sys/session'
import { TableData } from 'app_models/search'
import axios from 'axios' // 引入 axios
import pako from 'pako'
import { createContext, Fragment, useState } from 'react'
import { RuleGroupType, formatQuery } from 'react-querybuilder'
import 'react-querybuilder/dist/query-builder.scss'
import { parseSQL } from 'react-querybuilder/parseSQL'
import { useNavigate } from 'react-router-dom'
import type { Peptide, peptidedata } from '../result'
import { case1, case2, case3, defaultCase } from './fields'
import './index.less'
import { useEntryStore, useNeuropepStore } from 'store/index'
const { Link } = Typography
// const EntryNameContext = createContext<{
// 	entryName: string
// 	setEntryName: (value: string) => void
// }>({
// 	entryName: '',
// 	setEntryName: () => {}
// })
const Search = () => {
	const navigate = useNavigate()
	const [query, setQuery] = useState<RuleGroupType>(defaultCase)

	// const [entryName, setEntryName] = useState<string>('') // Entry name状态
	const { entryName, setEntryName } = useEntryStore()
	// const [neuropeptideName, setNeuropeptideName] = useState<string>('') // Neuropeptide name状态
	const { neuropeptideName, setNeuropeptideName } = useNeuropepStore()
	const [proteinSequence, setProteinSequence] = useState<string>('') // 保存返回的蛋白质序列
	const [pdbData, setPdbData] = useState<TableData | null>(null)

	const [peptidedata, setPeptides] = useState<peptidedata[] | null>(null)

	const searchProteinSequence = async () => {
		console.log('searchclick', entryName, neuropeptideName)
		console.log('type_entryName:', Object.prototype.toString.call(entryName))
		if (entryName) {
			try {
				console.log('entryName:', entryName)
				const response = await axios.post(
					'/query/proteinsequence',
					{
						protein_id: entryName
					},
					{
						headers: {
							'Accept-Encoding': 'gzip'
						},
						responseType: 'arraybuffer' // 设置响应类型为arraybuffer
					}
				)

				// 将ArrayBuffer转换为Uint8Array
				const uint8Array = new Uint8Array(response.data)
				// 使用pako库解压缩数据
				const decompressedData = pako.inflate(uint8Array)
				// 将解压缩后的数据转换为字符串
				const jsonString = new TextDecoder().decode(decompressedData)
				// 解析JSON数据
				const data = JSON.parse(jsonString)

				console.log('response:', data)
				const peptides: Peptide[] = (data.peptides || []).map(
					(peptide: any) => ({
						id: peptide.peptideid,
						sequence: peptide.peptideSequence,
						pei: peptide.PEI,
						pdb: peptide.pdb
					})
				)

				console.log('peptides0:', peptides[0])

				const proteinSequence = data.proteinsequence
				console.log('proteinSequence:', proteinSequence)

				setProteinSequence(data.proteinsequence)
				setPeptides(peptides)
				navigate('/result', { state: { peptidedata: peptides } })
			} catch (error) {
				message.error('Error fetching data')
				console.error('Error:', error)
			}
		}
		if (neuropeptideName) {
			try {
				console.log('neuropeptideName:', neuropeptideName)
				const response = await axios.post(
					'/query/peptidesequence',
					{
						protein_id: neuropeptideName // 使用 entryName 作为 protein_id
					},
					{
						headers: {
							'Accept-Encoding': 'gzip'
						},
						responseType: 'arraybuffer' // 设置响应类型为arraybuffer
					}
				)
				const uint8Array = new Uint8Array(response.data)
				const decompressedData = pako.inflate(uint8Array)
				const jsonString = new TextDecoder().decode(decompressedData)
				const data = JSON.parse(jsonString)
				console.log('response:', data)
				const peptides: Peptide[] = (data.peptides || []).map(
					(peptide: any) => ({
						id: peptide.peptideid,
						sequence: peptide.peptideSequence,
						pei: peptide.PEI,
						pdb: peptide.pdb
					})
				)

				console.log('peptides0:', peptides[0])

				const proteinSequence = response.data.proteinsequence
				console.log('proteinSequence:', proteinSequence)

				setProteinSequence(response.data.proteinsequence)
				setPeptides(peptides)
				navigate('/result', { state: { peptidedata: peptides } })
				// message.success('Protein sequence retrieved successfully!')
			} catch (error) {
				message.error('Error fetching data')
				console.error('Error:', error)
			}
		}
	}

	const searchPdbData = async () => {
		try {
			const response = await axios.post('/query/pdbdata', {
				proteinid: entryName,
				peptideid: neuropeptideName
			})
			console.log('response:', response)
			const pdbDataArray = response.data.pdbdata.pdbData
			// const pei = response.data.pdbdata.PEI
			console.log('pdbDataArray:', pdbDataArray)
			const pdbString = pdbDataArray
			const tableData: TableData = {
				id: entryName,
				sequence: proteinSequence || '',
				length: pdbString[1] || 0,
				neuropeptide: pdbString[0]
			}
			setPdbData(tableData)
			console.log('PDB Data:', tableData)
			if (tableData.id) {
				navigate('/result', { state: { tableData } })
				// message.success('PDB data retrieved successfully!')
			} else {
				message.error('Error fetching data')
			}
		} catch (error) {
			message.error('Error fetching data')
			console.error('Error:', error)
		}
	}

	const search = () => {
		// setQuery()
		console.log('enrtyName:', entryName)
		console.log('neuropeptideName:', neuropeptideName)
		if (!neuropeptideName) {
			console.log('searchProteinSequence')
			searchProteinSequence()
		} else if (!entryName) {
			console.log('searchProteinSequence')
			searchProteinSequence()
		} else if (entryName && neuropeptideName) {
			console.log('searchPdbData')
			searchPdbData()
		}
	}
	const cases = [case1, case2, case3]

	return (
		<div className='query-page py-[20px]'>
			<div className='header-wrapper flex'>
				<div className='left flex-1'>
					<h2>
						Search examples:
						{cases.map((c, i) => (
							<Fragment key={i}>
								<Button
									type='link'
									className='p-[2px]'
									onClick={() => {
										if (i === 0) {
											// Case 1: 设置 Entry name 和 Neuropeptide name
											setEntryName('Q17478_CAEEL')
											setNeuropeptideName('NLP-13-5')
										} else if (i === 1) {
											// Case 2
											setEntryName('Q17478_CAEEL')
											setNeuropeptideName('')
										} else if (i === 2) {
											// Case 3
											setEntryName('')
											setNeuropeptideName('NLP-13-5')
										}
									}}
								>
									case{i + 1}
								</Button>
								{i !== cases.length - 1 && <span> </span>}
							</Fragment>
						))}
					</h2>

					{/* 查询搜索框 */}
					{/* Entry name输入框 */}
					<div style={{ marginBottom: 16 }}>
						<Typography.Text>ProteinEntry name:</Typography.Text>
						<Input
							value={entryName}
							onChange={e => setEntryName(e.target.value)}
							placeholder='Enter entry name'
							style={{ width: 200, marginLeft: 10 }}
						/>
					</div>
					{/* Neuropeptide name输入框 */}
					<div style={{ marginBottom: 16 }}>
						<Typography.Text>Neuropeptide name:</Typography.Text>
						<Input
							value={neuropeptideName}
							onChange={e => setNeuropeptideName(e.target.value)}
							placeholder='Enter neuropeptide name'
							style={{ width: 200, marginLeft: 10 }}
						/>
					</div>

					<div>
						<Button
							type='primary'
							size='large'
							disabled={!query}
							// onClick={search}
							onClick={() => {
								search()
							}}
						>
							Submit
						</Button>
						<Button
							size='large'
							className='ml-[10px]'
							onClick={() => {
								setEntryName('')
								setNeuropeptideName('')
							}}
						>
							Reset
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Search
