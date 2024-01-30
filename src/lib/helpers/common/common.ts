import { themeMode } from '$lib/stores/preferences'
import { get } from 'svelte/store'

export const isUrl = (url: string): boolean => {
	const patternUrl =
		/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/

	return patternUrl.test(url)
}

export const isDarkMode = (): boolean => {
	return get(themeMode) === 'dark'
}

export const capitalizeWord = (str: string): string => {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export const generateUID = (): string => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0,
			v = c === 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})
}

export const deepClone = (obj: any) => {
	if (obj === null) return null
	const clone = Object.assign({}, obj)
	Object.keys(clone).forEach(
		(key) => (clone[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
	)
	if (Array.isArray(obj)) {
		clone.length = obj.length
		return Array.from(clone)
	}
	return clone
}

export const generateUniqueSlug = (str: string, widgets: any[]): string => {
	const baseSlug = generateSlug(str)

	let uniqueSlug = baseSlug
	let suffix = 1

	while (widgets.some((e) => e.widget_slug === uniqueSlug)) {
		uniqueSlug = `${baseSlug}-${suffix}`
		suffix++
	}

	return uniqueSlug
}

export const generateSlug = (str: string): string => {
	const slug = str
		.trim()
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '')

	return slug
}

export const generateRandomString = (numOfChar = 5) => {
	let result = ''
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const charactersLength = characters.length
	for (let i = 0; i < numOfChar; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}
	return result
}

export const compare = (obj1: Record<string, any>, obj2: Record<string, any>) => {
	if (obj1 === obj2) {
		return true
	}
	if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
		return false
	}
	const keys1 = Object.keys(obj1)
	const keys2 = Object.keys(obj2)
	if (keys1.length !== keys2.length) {
		return false
	}
	for (const key of keys1) {
		if (!keys2.includes(key) || !compare(obj1[key], obj2[key])) {
			return false
		}
	}
	return true
}

export const iconColor = (themeColor: string | null) => {
	const color = themeColor && (themeColor === 'yellow' || themeColor === 'cyan') ? '' : '-white'
	return isDarkMode() ? '-white' : color
}

export const isIconWhite = (themeColor: string | null) => {
	const isYellow = themeColor && themeColor === 'yellow'
	return isDarkMode() || !isYellow
}
