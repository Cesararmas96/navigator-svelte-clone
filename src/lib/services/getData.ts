import { sendErrorNotification } from "$lib/stores/toast"

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
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTU1MjAzNzYsImlhdCI6MTY5NTE2MDM3NiwiaXNzIjoiTW9iaWxlaW5zaWdodCIsInVzZXJfaWQiOiJyZ2lhbm5vdHRpQHRyb2NnbG9iYWwuY29tIiwidXBuIjoicmdpYW5ub3R0aUB0cm9jZ2xvYmFsLmNvbSIsImVtYWlsIjoicmdpYW5ub3R0aUB0cm9jZ2xvYmFsLmNvbSIsImdpdmVuX25hbWUiOiJSaWNhcmRvIiwiZmFtaWx5X25hbWUiOiJHaWFubm90dGkiLCJuYW1lIjoiUmljYXJkbyBHaWFubm90dGkiLCJkaXNwbGF5X25hbWUiOiJSaWNhcmRvIEdpYW5ub3R0aSIsImlkIjoicmdpYW5ub3R0aUB0cm9jZ2xvYmFsLmNvbSIsImF1dGhfbWV0aG9kIjoiYWRmcyIsImF1dGhfdG9rZW4iOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpTVXpJMU5pSXNJbmcxZENJNkltTnhRbmR1UmtOaVoyNU9lV2s0U2tGUFR6SnNkSFZUTnpSb1ZTSjkuZXlKaGRXUWlPaUp0YVdOeWIzTnZablE2YVdSbGJuUnBkSGx6WlhKMlpYSTZibUYyYVdkaGRHOXlYMlJsZGk1aFpHWnpMbWxrWlc1MGFXWnBaWElpTENKcGMzTWlPaUpvZEhSd2N6b3ZMM056Ynk1MGNtOWpaMnh2WW1Gc0xtTnZiUzloWkdaekwzTmxjblpwWTJWekwzUnlkWE4wSWl3aWFXRjBJam94TmprMU1UWXdNemMxTENKbGVIQWlPakUyT1RVeE5qTTVOelVzSW1WdFlXbHNJam9pY21kcFlXNXViM1IwYVVCMGNtOWpaMnh2WW1Gc0xtTnZiU0lzSW1kcGRtVnVYMjVoYldVaU9pSlNhV05oY21Sdklpd2labUZ0YVd4NVgyNWhiV1VpT2lKSGFXRnVibTkwZEdraUxDSm5jbTkxY0NJNld5SkViMjFoYVc0Z1ZYTmxjbk1pTENKV1VFNGdWWE5sY25NaUxDSkJWMU10TmpNM05qWXdNekEzTWpRd0xVUmhjMmhpYjJGeVpDSmRMQ0oxY0c0aU9pSnlaMmxoYm01dmRIUnBRSFJ5YjJObmJHOWlZV3d1WTI5dElpd2lZV3gwWlhKdVlYUmxSVzFoYVd3aU9pSm5hV0Z1YjJ0QVoyMWhhV3d1WTI5dElpd2lSR2x6Y0d4aGVTMU9ZVzFsSWpvaVVtbGpZWEprYnlCSGFXRnVibTkwZEdraUxDSmhjSEIwZVhCbElqb2lVSFZpYkdsaklpd2lZWEJ3YVdRaU9pSnVZWFpwWjJGMGIzSmZaR1YyTG1Ga1puTXVZMnhwWlc1MFgybGtJaXdpWVhWMGFHMWxkR2h2WkNJNkluVnlianB2WVhOcGN6cHVZVzFsY3pwMFl6cFRRVTFNT2pJdU1EcGhZenBqYkdGemMyVnpPbEJoYzNOM2IzSmtVSEp2ZEdWamRHVmtWSEpoYm5Od2IzSjBJaXdpWVhWMGFGOTBhVzFsSWpvaU1qQXlNeTB3T1MweE9WUXlNVG8xTWpvMU5DNDVOVEJhSWl3aWRtVnlJam9pTVM0d0lpd2ljMk53SWpvaWIzQmxibWxrSW4wLkxqLUc5Z2JoSDQyZi1EZWF0TkY0eS1EZmdqODV0U1cyMEhYdjVvXzJ1NXVYWDRDNFdCU3lQZEFOb3FUaGJCREhUbEJ6YU5DQUtXcUZXOFU0dWVMVzZlZzJoTHkySnJMWXRUc3RQUU9VNkV2Sms5RkxZdFI2bk9MYmFBUE9VX3djTEpuVVBLcTlnRnBNNGhyNFdWNDVwdWhjdnRmVFFmbXNtUFlvWk9QQzRDUHFLWDg2dEstaDJFbkR4NWF5WFRrd3o0R2NTNlo1RW9UTXpTZFR3b3ZoMUpjMUVzMWdPY2g1X0pLS0E2MWRHc25wcUhPa2lTZlRDenlCRV9SQ2gxYXNma2h3eF82WFRSMEtYWGRZdnM1eWU5dFdWdVBVMmxGZ3lEVUFkTlR2TFl5ZklNTVUteHBpOGpIVm5PMHZIREpDOHYtYzktTVZaLXZITmFHemZKTndaUSIsInRva2VuX3R5cGUiOiJCZWFyZXIiLCJ1c2VybmFtZSI6InJnaWFubm90dGlAdHJvY2dsb2JhbC5jb20ifQ.9TJ2g7vJggAYBCKHlSolP-BPi2NDQZ7vK50hAZvbgnQ'
		const headers = { authorization: `Bearer ${token}` }
		options = { ...options, headers }
	}	
	let response = await getData(url, method, payload, queryParams, options)
	return response
}
