const handlers = [
	{
		url: '/data',
		method: 'get',
		response({ query }: any) {
			console.log(query)
			if (query.id)
				return {
					code: 0,
					data: {
						id: 'Q9N4W0',
						sequence: 'SADPNFLRF',
						length: 8,
						family: 'Tachykinin',
						name: 'Substance P',
						receptor: ['FLP-3-3', 'FLP-3-4']
					}
				}
			return {
				code: 0,
				data: [
					{
						id: 'Q9N4W0',
						sequence: 'SADPNFLRF',
						length: 8,
						family: 'Tachykinin',
						name: 'Substance P',
						receptor: ['FLP-3-3', 'FLP-3-4']
					}
				]
			}
		}
	},
	{
		url: '/task',
		method: 'post',
		response() {
			return {
				code: 0,
				data: {
					id: 'T100010010',
					status: 'success'
				}
			}
		}
	}
]

export default handlers
