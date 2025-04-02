import type { Field, RuleGroupType, RuleType } from 'react-querybuilder'
import { toFullOption } from 'react-querybuilder'

export const validator = (r: RuleType) => !!r.value

export const fields = (
	[
		{
			name: 'Protein Entry Name',
			label: 'Protein Entry Name',
			placeholder: 'Enter Entry name',
			defaultOperator: '=',
			validator
		},
		{
			name: 'Neuropeptide name',
			label: 'Neuropeptide name',
			placeholder: 'Enter Neuropeptide name',
			defaultOperator: '=',
			validator
		}
	] satisfies Field[]
)
	// ).map(toFullOption)
	.map(({ defaultOperator, ...rest }) => toFullOption(rest))

export const defaultCase: RuleGroupType = {
	combinator: 'and',
	not: false, //规则是否反转
	rules: [
		{
			field: 'Protein Entry Name',
			value: '',
			operator: '='
		},
		{
			field: 'Neuropeptide name',
			operator: '=',
			value: '',
			valueSource: 'value'
		}
	]
}

export const case1: RuleGroupType = {
	combinator: 'and',
	not: false,
	rules: [
		{
			field: 'Protein Entry Name',
			value: 'Q20275_CAEEL',
			operator: 'equals'
		},
		{
			field: 'Neuropeptide name',
			value: 'FLP-26-2',
			operator: 'equals'
		}
	]
}

export const case2: RuleGroupType = {
	combinator: 'and',
	not: false,
	rules: [
		{
			field: 'Protein Entry Name',
			value: 'Q17478_CAEEL',
			operator: 'equals'
		},
		{
			field: 'Neuropeptide name',
			value: 'pyroNLP-13-3',
			operator: 'equals'
		}
	]
}

export const case3: RuleGroupType = {
	combinator: 'and',
	not: false,
	rules: [
		{
			field: 'Protein Entry Name',
			value: 'Q17478_CAEEL',
			operator: 'equals'
		},
		{
			field: 'Neuropeptide name',
			operator: 'equals',
			value: 'NLP-13-7'
		}
	]
}
