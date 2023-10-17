import { storeUser } from '$lib/stores';
import { onDestroy } from 'svelte';
import { get } from 'svelte/store';

/**
 * Perform an HTTP request using the fetch API.
 *
 * @param {string} url - The URL to send the request to.
 * @param {string} method - The HTTP method (e.g., "GET", "POST").
 * @param {Object} payload - The data to send in the request body.
 * @param {Object} queryParams - The URL parameters as key-value pairs.
 * @param {Object} options - Additional options for the request.
 * @returns {Promise<Object>} - A promise that resolves to the JSON response.
 * @throws {Error} - If the request fails or encounters an error.
 */
export async function getData(
	url: string,
	method = 'POST',
	payload: Record<string, any> = {},
	queryParams: Record<string, any> = {},
	options: Record<string, any> = {},
	myFetch?: any
) {

	try {
		// Validate that 'url' is a non-empty string
		if (typeof url !== 'string' || url.trim() === '') {
			throw new Error('The provided URL is not valid.')
		}

		// Validate that 'method' is a valid HTTP method
		const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
		if (!validMethods.includes(method.toUpperCase())) {
			throw new Error('The provided HTTP method is not valid.')
		}

		// Build URL if continue with query parameters
		const searchParams = new URLSearchParams(queryParams).toString()
		const urlWithParams = searchParams ? `${url}?${searchParams}` : url

		// Add authentication token handling here
		const loggedIn = true
		// Temporarily

		options.headers = options.headers || {}

		// Configure the "Content-Type" header
		if (method !== 'GET')
			options.headers['Content-Type'] =
				options.headers['Content-Type'] || 'application/json; charset=utf-8'

		options.headers['Origin'] = 'https://navigator.com'
		// Add the authentication token if authenticated
		if (loggedIn) options.headers.authorization = options.headers.authorization || null

		const headers = new Headers(options.headers)

		const configRequest: RequestInit = {
			method,
			headers: headers,
			body: JSON.stringify(payload)
		}
		if (method === 'GET') delete configRequest.body

		let response: any
		if (myFetch) {
			response = await myFetch(`${urlWithParams}`, configRequest)
		} else {
			response = (await fetch(`${urlWithParams}`, configRequest)) || {}
		} 

		// const validResponseStatus = [200, 202]
		// if (validResponseStatus.includes(response?.status)) {

		if (response?.status === 204) return null

		if (!response?.ok) {
			let statusText = response.statusText || 'Request error'
			statusText = response.statusText.includes('reason')
				? JSON.parse(response.statusText).reason
				: statusText
			throw new Error(`Request error: ${response.status} ${statusText}`)
		}
		return await response.json()
	} catch (error) {
		console.log('error', error)
		throw error
	}
}

export async function getApiData(
	url: string,
	method = 'POST',
	payload: Record<string, any> = {},
	queryParams: Record<string, any> = {},
	options: Record<string, any> = {},
	myFetch?: any
) {
	if (!options.headers?.authorization) {
		const user = get(storeUser)
		if (user?.token) {
			const headers = { authorization: `Bearer ${user?.token}` }
			options = { ...options, headers }
		}
	}
	const response = await getData(getQuerySlug(url), method, payload, queryParams, options, myFetch)
	return response
}

export async function patchData(url: string, payload: Record<string, any> = {}) {
	let options	
	const user = get(storeUser)
	if (user?.token) {
		const headers = { authorization: `Bearer ${user?.token}` }
		options = { ...options, headers }
	}

	const response = await getData(getQuerySlug(url), 'PATCH', payload, {}, options)
	return { ...response }
}

export async function postData(url: string, payload: Record<string, any> = {}) {
	let options	
	const user = get(storeUser)
	if (user?.token) {
		const headers = { authorization: `Bearer ${user?.token}` }
		options = { ...options, headers }
	}
	
	const response = await getData(getQuerySlug(url), 'POST', payload, {}, options)
	return { ...response }
}

export async function putData(url: string, payload: Record<string, any> = {}) {
	let options	
	const user = get(storeUser)
	if (user?.token) {
		const headers = { authorization: `Bearer ${user?.token}` }
		options = { ...options, headers }
	}
	
	const response = await getData(getQuerySlug(url), 'PUT', payload, {}, options)
	return { ...response }
}

export async function deleteData(url: string) {
	let options	
	const user = get(storeUser)
	if (user?.token) {
		const headers = { authorization: `Bearer ${user?.token}` }
		options = { ...options, headers }
	}
	
	const response = await getData(getQuerySlug(url), 'DELETE', {}, {}, options)
	return { ...response }
}

const getQuerySlug = (widgetSlug: any) => {
	let slugQuery = widgetSlug

	if (Array.isArray(slugQuery)) {
		slugQuery = Object.values(slugQuery[0])[0]
		slugQuery = slugQuery.slug || slugQuery
	}

	let slugNew = ''
	if (slugQuery && slugQuery.includes('{BASE_URL_API}')) {
		slugNew = slugQuery.replace('{BASE_URL_API}', import.meta.env.VITE_API_URL)
	} else if (slugQuery && slugQuery.includes('{BASE_URL_DATA}')) {
		slugNew = slugQuery.replace('{BASE_URL_DATA}', import.meta.env.VITE_DATA_URL)
	} else {
		slugNew =
			slugQuery && slugQuery.includes('http')
				? slugQuery
				: `${import.meta.env.VITE_API_URL}/api/v2/services/queries/${slugQuery}`
	}

	return slugNew
}
