export interface TableData {
	id: string
	sequence: string
	length: number
	neuropeptide: string
}

export interface Info {
	submissionId: string
	id: number
	seqName: string
	status: string
	sequence: string
	create: number
	username: string
	result: {
		type: string
		cutoff: number
		domains: string
		domainNum: number
		dcdomains: string
		dcdomainNum: number
	} | null
}

export interface User {
	id: number
	username: string
	create: number
	time: number
	role: string
}

export interface Job {
	id: string
}

export interface Loc {
	x1: number
	x2: number
	y1: number
	y2: number
}
