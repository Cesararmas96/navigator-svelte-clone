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

		// Add the authentication token if authenticated
		if (loggedIn) options.headers.authorization = options.headers.authorization || null

		const headers = new Headers(options.headers)

		const configRequest: RequestInit = {
			method,
			headers: headers,
			// mode: 'no-cors',
			// redirect: 'follow',
			body: JSON.stringify(payload)
		}

		if (method === 'GET') delete configRequest.body

		const response = await fetch(`${urlWithParams}`, configRequest)

		// const validResponseStatus = [200, 202]
		// if (validResponseStatus.includes(response?.status)) {

		if (response.ok) {
			return await response.json()
		} else {
			// Handle specific status code errors here
			console.log(response)
			throw new Error(`Request error: ${response.status}`)
		}
	} catch (error) {
		// Handle general errors here
		console.log(error)
		throw new Error(`Request error: ${error}`)
	}
}

export async function getApiData(
	url: string,
	method = 'POST',
	payload: Record<string, any> = {},
	queryParams: Record<string, any> = {},
	options: Record<string, any> = {}
) {
	const token =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTUxNDM3OTgsImlhdCI6MTY5NDc4Mzc5OCwiaXNzIjoiTW9iaWxlaW5zaWdodCIsInVzZXIiOjE1Nzc5LCJ1c2VybmFtZSI6ImptZW5kb3phMUB0cm9jZ2xvYmFsLmNvbSIsInVzZXJfaWQiOjE1Nzc5LCJpZCI6ImptZW5kb3phMUB0cm9jZ2xvYmFsLmNvbSJ9.cL6aOd93tjeYXnQqym3g2CABnzyhL3vGM9ddpTCMeic'
	const headers = {
		authorization: `Bearer ${token}`,
		// origin: 'https://navigator.mobileinsight.com',
		accept: 'application/json, text/plain, */*'
	}

	return await getData(url, method, payload, queryParams, { ...options, headers })
}
