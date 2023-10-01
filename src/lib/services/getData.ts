import { sendErrorNotification } from '$lib/stores/toast'

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
	options: Record<string, any> = {}
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

		const response = await fetch(`${urlWithParams}`, configRequest)

		// const validResponseStatus = [200, 202]
		// if (validResponseStatus.includes(response?.status)) {

		if (response.ok) {
			return await response.json()
		} else {
			console.log(response)
			throw new Error(`Request error: ${response.status} ${response.statusText}`)
		}
	} catch (error) {
		sendErrorNotification(error)
	}
}

export async function getApiData(
	url: string,
	method = 'POST',
	payload: Record<string, any> = {},
	queryParams: Record<string, any> = {},
	options: Record<string, any> = {}
) {
	if (!options.authorization) {
		const token =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTY1Mjk4MzEsImlhdCI6MTY5NjE2OTgzMSwiaXNzIjoiTW9iaWxlaW5zaWdodCIsInVzZXJfaWQiOiJqdmlsYUB0cm9jZ2xvYmFsLmNvbSIsInVwbiI6Imp2aWxhQHRyb2NnbG9iYWwuY29tIiwiZW1haWwiOiJqdmlsYUB0cm9jZ2xvYmFsLmNvbSIsImdpdmVuX25hbWUiOiJKdWFuIiwiZmFtaWx5X25hbWUiOiJWaWxhIiwibmFtZSI6Ikp1YW4gVmlsYSIsImRpc3BsYXlfbmFtZSI6Ikp1YW4gVmlsYSIsImlkIjoianZpbGFAdHJvY2dsb2JhbC5jb20iLCJhdXRoX21ldGhvZCI6ImFkZnMiLCJhdXRoX3Rva2VuIjoiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKU1V6STFOaUlzSW5nMWRDSTZJbU54UW5kdVJrTmlaMjVPZVdrNFNrRlBUekpzZEhWVE56Um9WU0o5LmV5SmhkV1FpT2lKdGFXTnliM052Wm5RNmFXUmxiblJwZEhselpYSjJaWEk2Ym1GMmFXZGhkRzl5WDJSbGRpNWhaR1p6TG1sa1pXNTBhV1pwWlhJaUxDSnBjM01pT2lKb2RIUndjem92TDNOemJ5NTBjbTlqWjJ4dlltRnNMbU52YlM5aFpHWnpMM05sY25acFkyVnpMM1J5ZFhOMElpd2lhV0YwSWpveE5qazJNVFk1T0RNd0xDSmxlSEFpT2pFMk9UWXhOek0wTXpBc0ltVnRZV2xzSWpvaWFuWnBiR0ZBZEhKdlkyZHNiMkpoYkM1amIyMGlMQ0puYVhabGJsOXVZVzFsSWpvaVNuVmhiaUlzSW1aaGJXbHNlVjl1WVcxbElqb2lWbWxzWVNJc0ltZHliM1Z3SWpwYklrUnZiV0ZwYmlCVmMyVnljeUlzSWxaUVRpQlZjMlZ5Y3lJc0lrRlhVeTAyTXpjMk5qQXpNRGN5TkRBdFJHRnphR0p2WVhKa0lsMHNJblZ3YmlJNkltcDJhV3hoUUhSeWIyTm5iRzlpWVd3dVkyOXRJaXdpWVd4MFpYSnVZWFJsUlcxaGFXd2lPaUpxYVhacGJHRkFiM1YwYkc5dmF5NWpiMjBpTENKRWFYTndiR0Y1TFU1aGJXVWlPaUpLZFdGdUlGWnBiR0VpTENKaGNIQjBlWEJsSWpvaVVIVmliR2xqSWl3aVlYQndhV1FpT2lKdVlYWnBaMkYwYjNKZlpHVjJMbUZrWm5NdVkyeHBaVzUwWDJsa0lpd2lZWFYwYUcxbGRHaHZaQ0k2SW5WeWJqcHZZWE5wY3pwdVlXMWxjenAwWXpwVFFVMU1Pakl1TURwaFl6cGpiR0Z6YzJWek9sQmhjM04zYjNKa1VISnZkR1ZqZEdWa1ZISmhibk53YjNKMElpd2lZWFYwYUY5MGFXMWxJam9pTWpBeU15MHhNQzB3TVZReE1qb3dOem8xTlM0d016UmFJaXdpZG1WeUlqb2lNUzR3SWl3aWMyTndJam9pYjNCbGJtbGtJbjAubm53NnlUSS1DUkRMYVh6N1dXOUdDZkRfbWJ2b0xxbVZKNW1tOWIxNDBmbG00WjhLNk15RmdMRXkzekFRX1YzblRVMU9zOFJ6clJzUnZVdUlLNDRIRzdDYl83d01aU3VSeElrRDVpUEtvNWRiWHF3WTdFTzFZZTBPWjJHYWpPZ3F4SVRGWUVCYXpGOG5TOFVMUEJMX0ItanJBUWZ6ejdfaXRIZExjSVFHOFpnbThVZXhoYVRBRS1uY1V1bGVMOF9ub3BMbFRvREg4Q3pUejZZMFVrOGxOOHNxNmdJVTdvc1p1VEwxemlrX2IyM3lxMUE4NmpQemNZc0NSejZmc011bm1jaWpOZmV0UjFRc1p2WlpqaGdJbU1aVnFpTjcxN3FVZTBEbkRrczhzVWpNeFBNRmhoTU5EZG1GbGVERVN0VkwxOFd0THlpVExfYjh5MjQ2Y2M3R3JRIiwidG9rZW5fdHlwZSI6IkJlYXJlciIsInVzZXJuYW1lIjoianZpbGFAdHJvY2dsb2JhbC5jb20ifQ.2uuQ0OXBQbHzYhgCap2Xi_gFDmYsHIvg5wxQ5CtGOOc'
		const headers = { authorization: `Bearer ${token}` }
		options = { ...options, headers }
	}
	let response = await getData(url, method, payload, queryParams, options)
	return response
}
