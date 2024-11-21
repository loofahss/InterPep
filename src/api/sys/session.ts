import { TableData } from 'app_models/search'
import $axios from 'utils/axios'

export default {
	search: (params: any): Promise<TableData[] | TableData> =>
		$axios.get('/data', params)
}
