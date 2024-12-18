import React from 'react'
import ReactDOM from 'react-dom/client'
import { Table } from 'antd'

interface Peptide {
	protein: string
	peptide: string
	PEI: string
}

const peptides: Peptide[] = [
	{ protein: '777', peptide: 'wtf', PEI: 'PEI1' },
	{ protein: '2', peptide: 'Sequence2', PEI: 'PEI2' },
	{ protein: '3', peptide: 'Sequence3', PEI: 'PEI3' }
]

const columns = [
	{
		title: 'protein',
		dataIndex: 'peptideid',
		key: 'peptideid'
	},
	{
		title: 'peptide',
		dataIndex: 'peptideSequence',
		key: 'peptideSequence'
	},
	{
		title: 'PEI',
		dataIndex: 'PEI',
		key: 'PEI'
	}
]

const PeptideList: React.FC = () => {
	return (
		<div>
			<Table
				columns={columns}
				dataSource={peptides}
				rowKey={item => item.protein}
				className='mt-[20px]'
			/>
		</div>
	)
}

// const root = ReactDOM.createRoot(document.getElementById('root')!)
// root.render(<PeptideList />)
export default PeptideList
