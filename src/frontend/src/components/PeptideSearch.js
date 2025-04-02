const handleSearch = async () => {
	try {
		const response = await fetch(
			'http://localhost:5000/query/peptidesequence',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept-Encoding': 'gzip' // 告诉服务器我们接受gzip压缩的数据
				},
				body: JSON.stringify({
					protein_id: searchId
				})
			}
		)

		if (!response.ok) {
			throw new Error('Network response was not ok')
		}

		// 获取压缩的数据
		const compressedData = await response.arrayBuffer()

		// 将ArrayBuffer转换为Uint8Array
		const uint8Array = new Uint8Array(compressedData)

		// 使用pako库解压缩数据
		const decompressedData = pako.inflate(uint8Array)

		// 将解压缩后的数据转换为字符串
		const jsonString = new TextDecoder().decode(decompressedData)

		// 解析JSON数据
		const data = JSON.parse(jsonString)

		setSearchResults(data)
		setLoading(false)
	} catch (error) {
		console.error('Error:', error)
		setError('搜索失败，请重试')
		setLoading(false)
	}
}
