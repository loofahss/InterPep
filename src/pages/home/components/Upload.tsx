import { InboxOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'
import { Upload, message } from 'antd'
import { useAppSelector } from 'store/redux-hooks'
import { selectLanguage } from 'store/slicers/appSlice'

const { Dragger } = Upload

export interface MyFile extends UploadFile {
	value: string
	raw: string
	seqName: string
}

export default function MyUpload({
	value,
	onChange,
	status = 'default'
}: {
	value: MyFile | null
	onChange: (value: MyFile) => void
	status?: string
}) {
	const [messageApi, contextHolder] = message.useMessage()
	const lang = useAppSelector(selectLanguage)
	const props: UploadProps = {
		name: 'file',
		multiple: false,
		beforeUpload: file => {
			const reader = new FileReader()
			reader.readAsText(file)
			reader.onload = () => {
				if (typeof reader.result !== 'string') {
					messageApi.error(
						lang === 'en' ? 'File content format error' : '文件内容格式错误'
					)
					return
				}
				let seqName = '',
					value = ''
				if (reader.result.trim().startsWith('>')) {
					const lines = reader.result.split('\n')
					seqName = lines[0].trim().slice(1)
					value = lines
						.slice(1)
						.map(s => s.trim())
						.join('')
				} else {
					seqName = file.name.split('.')[0]
					value = reader.result
						.split('\n')
						.map(s => s.trim())
						.join('')
				}

				const f: MyFile = Object.assign(file, {
					value,
					seqName,
					raw: reader.result
				})

				onChange(f)
			}
			return Upload.LIST_IGNORE
		},
		maxCount: 1,
		accept: '.pdb',
		fileList: value ? [value] : []
	}

	return (
		<>
			{contextHolder}
			<Dragger
				style={{ borderColor: status === 'error' ? '#dc4446' : '#424242' }}
				{...props}
			>
				<p className='ant-upload-drag-icon'>
					<InboxOutlined />
				</p>
				<p className='ant-upload-text'>
					Click or drag file to this area to upload
				</p>
				<p className='ant-upload-hint'>Only support for a PDB file upload.</p>
			</Dragger>
		</>
	)
}
