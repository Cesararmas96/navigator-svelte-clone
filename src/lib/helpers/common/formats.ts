function fnValidationNumber(value: any, execute: any, fallback = '') {
	return isNaN(value) || (!value && value !== 0) ? fallback : execute
}

const formatCurrency = (val: number, decimals: number) =>
	'$' +
	val?.toLocaleString(undefined, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	})

const formatPercentage = (val: number, decimals: number) =>
	(val * 100).toLocaleString(undefined, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	}) + '%'

function fnFormatNumber(value: any, fallback = '0', decimal = 2) {
	return fnValidationNumber(
		value,
		Intl.NumberFormat('en-US').format(parseFloat(value).toFixed(decimal) as any),
		fallback
	)
}

function fnFormatNumberOne(value: any, fallback = '0', decimal = 1) {
	return fnValidationNumber(
		value,
		Intl.NumberFormat('en-US').format(parseFloat(value).toFixed(decimal) as any),
		fallback
	)
}

export function fnFormatPercent(value: any, fallback = '0%', decimal = 2) {
	return fnValidationNumber(value, (parseFloat(value) * 100).toFixed(decimal) + '%', fallback)
}

function fnFormatPercentOne(value: any, fallback = '0%', decimal = 1) {
	return fnValidationNumber(value, (parseFloat(value) * 100).toFixed(decimal) + '%', fallback)
}

function fnFormatInteger(value: any, fallback = '0') {
	return fnValidationNumber(value, parseInt(value), fallback)
}

function fnFormatNumberInteger(value: any, fallback = '0') {
	return fnValidationNumber(
		value,
		Intl.NumberFormat('en-US').format(parseFloat(value).toFixed(0) as any),
		fallback
	)
}

function fnFormatOneHundred(value: any, fallback = '0%', decimal = 2) {
	return fnValidationNumber(value, (parseFloat(value) * 100).toFixed(decimal) as any, fallback)
}

function fnFormatOneHundredOne(value: any, fallback = '0%', decimal = 1) {
	return fnValidationNumber(value, (parseFloat(value) * 100).toFixed(decimal) as any, fallback)
}

function fnFormatOneHundredZero(value: any, fallback = '0%', decimal = 0) {
	return fnValidationNumber(value, (parseFloat(value) * 100).toFixed(decimal) as any, fallback)
}

function fnFormatZeroToEmpty(value: any, fallback = '0') {
	return fnValidationNumber(
		value,
		Intl.NumberFormat('en-US').format(parseFloat(value).toFixed(0) as any),
		fallback
	)
}

function fnFormatPercentPlain(value: any, fallback = '0%') {
	return fnValidationNumber(value, parseFloat(value).toFixed(2) + '%', fallback)
}

function fnFormatPercentPlainOne(value: any, fallback = '0%') {
	return fnValidationNumber(value, parseFloat(value).toFixed(1) + '%', fallback)
}

export function fnFormatMoney(value: any, fallback = '$0') {
	return fnValidationNumber(value, formatCurrency(value, 2), fallback) as any
}

export function fnFormatMoneyInteger(value: any, fallback = '$0') {
	return fnValidationNumber(
		value,
		// @ts-ignore
		formatCurrency(value, 0),
		fallback
	)
}

function capitalize(value: any) {
	try {
		if (!value) return ''
		value = value.toString()
		value = value.charAt(0).toUpperCase() + value.slice(1)
		return (value = value.split('_').join(' '))
	} catch (error) {
		return value
	}
}

function toUpperCase(value: any) {
	try {
		if (!value) return ''
		value = value.toUpperCase()
		return (value = value.split('_').join(' '))
	} catch (error) {
		return value
	}
}

function colHidden() {
	return null
}

export const formats: Record<string, any> = {
	fnValidationNumber: fnValidationNumber,
	fnFormatNumber: fnFormatNumber,
	fnFormatNumberOne: fnFormatNumberOne,
	fnFormatPercent: fnFormatPercent,
	fnFormatPercentOne: fnFormatPercentOne,
	fnFormatInteger: fnFormatInteger,
	fnFormatNumberInteger: fnFormatNumberInteger,
	fnFormatOneHundred: fnFormatOneHundred,
	fnFormatOneHundredOne: fnFormatOneHundredOne,
	fnFormatOneHundredZero: fnFormatOneHundredZero,
	fnFormatZeroToEmpty: fnFormatZeroToEmpty,
	fnFormatPercentPlain: fnFormatPercentPlain,
	fnFormatPercentPlainOne: fnFormatPercentPlainOne,
	fnFormatMoney: fnFormatMoney,
	fnFormatMoneyInteger: fnFormatMoneyInteger,
	capitalize: capitalize,
	toUpperCase: toUpperCase,
	// news
	number: fnFormatNumber,
	integer: fnFormatInteger,
	colHidden: colHidden,
	fnFormaNumber: fnFormatNumber
}
