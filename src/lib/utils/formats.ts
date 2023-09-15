/* eslint-disable @typescript-eslint/no-explicit-any */
// const accounting = require('accounting')
import accounting from 'accounting'

function fnValidationNumber(value: any, execute: any, fallback = '') {
	return isNaN(value) || (!value && value !== 0) ? fallback : execute
}

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

function fnFormatPercent(value: any, fallback = '0%', decimal = 2) {
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

function fnFormatMoney(value: any, fallback = '$0') {
	return fnValidationNumber(
		value,
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		accounting.formatMoney(
			parseFloat(value),
			[(accounting.settings.currency.symbol = '$ ')],
			[(accounting.settings.currency.precision = 2)],
			[(accounting.settings.currency.thousand = ',')],
			[(accounting.settings.currency.decimal = '.')]
		),
		fallback
	) as any
}

function fnFormatMoneyInteger(value: any, fallback = '$0') {
	return fnValidationNumber(
		value,
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		accounting.formatMoney(
			parseFloat(value),
			[(accounting.settings.currency.symbol = '$ ')],
			[(accounting.settings.currency.precision = 0)],
			[(accounting.settings.currency.thousand = ',')],
			[(accounting.settings.currency.decimal = '.')]
		) as any,
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

const formats: Record<string, any> = {
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
	integer: fnFormatInteger
}

export function fnFormats(value: any, functionName: string, ...params: any[]) {
	if (formats[functionName]) {
		return formats[functionName](value, ...params)
	}

	return value
}
