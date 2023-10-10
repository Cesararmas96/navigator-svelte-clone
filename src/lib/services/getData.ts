import { handleError } from '$lib/helpers/common/errors'
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

const token =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTcyMzU1MTYsImlhdCI6MTY5Njg3NTUxNiwiaXNzIjoiTW9iaWxlaW5zaWdodCIsInVzZXJfaWQiOiJyZ2lhbm5vdHRpQHRyb2NnbG9iYWwuY29tIiwidXBuIjoicmdpYW5ub3R0aUB0cm9jZ2xvYmFsLmNvbSIsImVtYWlsIjoicmdpYW5ub3R0aUB0cm9jZ2xvYmFsLmNvbSIsImdpdmVuX25hbWUiOiJSaWNhcmRvIiwiZmFtaWx5X25hbWUiOiJHaWFubm90dGkiLCJuYW1lIjoiUmljYXJkbyBHaWFubm90dGkiLCJkaXNwbGF5X25hbWUiOiJSaWNhcmRvIEdpYW5ub3R0aSIsImlkIjoicmdpYW5ub3R0aUB0cm9jZ2xvYmFsLmNvbSIsImF1dGhfbWV0aG9kIjoiYWRmcyIsImF1dGhfdG9rZW4iOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpTVXpJMU5pSXNJbmcxZENJNkltTnhRbmR1UmtOaVoyNU9lV2s0U2tGUFR6SnNkSFZUTnpSb1ZTSjkuZXlKaGRXUWlPaUp0YVdOeWIzTnZablE2YVdSbGJuUnBkSGx6WlhKMlpYSTZibUYyYVdkaGRHOXlYMlJsZGk1aFpHWnpMbWxrWlc1MGFXWnBaWElpTENKcGMzTWlPaUpvZEhSd2N6b3ZMM056Ynk1MGNtOWpaMnh2WW1Gc0xtTnZiUzloWkdaekwzTmxjblpwWTJWekwzUnlkWE4wSWl3aWFXRjBJam94TmprMk9EYzFOVEUxTENKbGVIQWlPakUyT1RZNE56a3hNVFVzSW1WdFlXbHNJam9pY21kcFlXNXViM1IwYVVCMGNtOWpaMnh2WW1Gc0xtTnZiU0lzSW1kcGRtVnVYMjVoYldVaU9pSlNhV05oY21Sdklpd2labUZ0YVd4NVgyNWhiV1VpT2lKSGFXRnVibTkwZEdraUxDSm5jbTkxY0NJNld5SkViMjFoYVc0Z1ZYTmxjbk1pTENKV1VFNGdWWE5sY25NaUxDSkJWMU10TmpNM05qWXdNekEzTWpRd0xVUmhjMmhpYjJGeVpDSmRMQ0oxY0c0aU9pSnlaMmxoYm01dmRIUnBRSFJ5YjJObmJHOWlZV3d1WTI5dElpd2lZV3gwWlhKdVlYUmxSVzFoYVd3aU9pSm5hV0Z1YjJ0QVoyMWhhV3d1WTI5dElpd2lSR2x6Y0d4aGVTMU9ZVzFsSWpvaVVtbGpZWEprYnlCSGFXRnVibTkwZEdraUxDSmhjSEIwZVhCbElqb2lVSFZpYkdsaklpd2lZWEJ3YVdRaU9pSnVZWFpwWjJGMGIzSmZaR1YyTG1Ga1puTXVZMnhwWlc1MFgybGtJaXdpWVhWMGFHMWxkR2h2WkNJNkluVnlianB2WVhOcGN6cHVZVzFsY3pwMFl6cFRRVTFNT2pJdU1EcGhZenBqYkdGemMyVnpPbEJoYzNOM2IzSmtVSEp2ZEdWamRHVmtWSEpoYm5Od2IzSjBJaXdpWVhWMGFGOTBhVzFsSWpvaU1qQXlNeTB4TUMwd09WUXhPRG94T0Rvek5TNDBNVEZhSWl3aWRtVnlJam9pTVM0d0lpd2ljMk53SWpvaWIzQmxibWxrSW4wLnMxU0ZTdEN6Y19BTXB1V1pjYmVoVjNSRll2V3JtNWpJR180Sl9NN242bVlqYmxTVWtrVURLbVlKOXNkVTd2ZDZ6c2FNNG9mTXlTTWs4MjJKUHV1cWhSYjVTdGQtN295TTdpLThZcUN3U3V5LVlaaW5Fc0R3YUZUVTc5bjFwX2VzdkE4dWZzQnJYcTFHQzFDRVFFSjdOZWNKckVuc2hnMkV6M01BbkFJUzhyV3R3RUNycTBZT1pCNWhBVld4Qkw4RUk0SWN4TzZCenNCeDg3MmtYQ0VfUkotWlFhWDFyVUdWb3IyTS1QREQxcWVfYklfWHFsVGNpQTl3Z0Z6UThGWDJ5WXVXdWktY3ppRGlwU01wSDVZS2F6WFB5YnBkV1Z1RHZDZjdsSzZydUxMOG1ndzJDUjZ2SWVFQ1RWeS04QjJ1ZDVqLTZXU0M5d3NlUFFQSF96TkZ2ZyIsInRva2VuX3R5cGUiOiJCZWFyZXIiLCJ1c2VybmFtZSI6InJnaWFubm90dGlAdHJvY2dsb2JhbC5jb20ifQ.aNJLWWoC2iy-GOdAW3kdJv4bL8d35pyRX6kSDBxXavo'
	// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTcyMTc4NzIsImlhdCI6MTY5Njg1Nzg3MiwiaXNzIjoiTW9iaWxlaW5zaWdodCIsInVzZXJfaWQiOiJyZ2lhbm5vdHRpQHRyb2NnbG9iYWwuY29tIiwidXBuIjoicmdpYW5ub3R0aUB0cm9jZ2xvYmFsLmNvbSIsImVtYWlsIjoicmdpYW5ub3R0aUB0cm9jZ2xvYmFsLmNvbSIsImdpdmVuX25hbWUiOiJSaWNhcmRvIiwiZmFtaWx5X25hbWUiOiJHaWFubm90dGkiLCJuYW1lIjoiUmljYXJkbyBHaWFubm90dGkiLCJkaXNwbGF5X25hbWUiOiJSaWNhcmRvIEdpYW5ub3R0aSIsImlkIjoicmdpYW5ub3R0aUB0cm9jZ2xvYmFsLmNvbSIsImF1dGhfbWV0aG9kIjoiYWRmcyIsImF1dGhfdG9rZW4iOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpTVXpJMU5pSXNJbmcxZENJNkltTnhRbmR1UmtOaVoyNU9lV2s0U2tGUFR6SnNkSFZUTnpSb1ZTSjkuZXlKaGRXUWlPaUp0YVdOeWIzTnZablE2YVdSbGJuUnBkSGx6WlhKMlpYSTZibUYyYVdkaGRHOXlYMlJsZGk1aFpHWnpMbWxrWlc1MGFXWnBaWElpTENKcGMzTWlPaUpvZEhSd2N6b3ZMM056Ynk1MGNtOWpaMnh2WW1Gc0xtTnZiUzloWkdaekwzTmxjblpwWTJWekwzUnlkWE4wSWl3aWFXRjBJam94TmprMk9EVTNPRGN3TENKbGVIQWlPakUyT1RZNE5qRTBOekFzSW1WdFlXbHNJam9pY21kcFlXNXViM1IwYVVCMGNtOWpaMnh2WW1Gc0xtTnZiU0lzSW1kcGRtVnVYMjVoYldVaU9pSlNhV05oY21Sdklpd2labUZ0YVd4NVgyNWhiV1VpT2lKSGFXRnVibTkwZEdraUxDSm5jbTkxY0NJNld5SkViMjFoYVc0Z1ZYTmxjbk1pTENKV1VFNGdWWE5sY25NaUxDSkJWMU10TmpNM05qWXdNekEzTWpRd0xVUmhjMmhpYjJGeVpDSmRMQ0oxY0c0aU9pSnlaMmxoYm01dmRIUnBRSFJ5YjJObmJHOWlZV3d1WTI5dElpd2lZV3gwWlhKdVlYUmxSVzFoYVd3aU9pSm5hV0Z1YjJ0QVoyMWhhV3d1WTI5dElpd2lSR2x6Y0d4aGVTMU9ZVzFsSWpvaVVtbGpZWEprYnlCSGFXRnVibTkwZEdraUxDSmhjSEIwZVhCbElqb2lVSFZpYkdsaklpd2lZWEJ3YVdRaU9pSnVZWFpwWjJGMGIzSmZaR1YyTG1Ga1puTXVZMnhwWlc1MFgybGtJaXdpWVhWMGFHMWxkR2h2WkNJNkluVnlianB2WVhOcGN6cHVZVzFsY3pwMFl6cFRRVTFNT2pJdU1EcGhZenBqYkdGemMyVnpPbEJoYzNOM2IzSmtVSEp2ZEdWamRHVmtWSEpoYm5Od2IzSjBJaXdpWVhWMGFGOTBhVzFsSWpvaU1qQXlNeTB4TUMwd09WUXhNem95TkRvek1DNDFPVEZhSWl3aWRtVnlJam9pTVM0d0lpd2ljMk53SWpvaWIzQmxibWxrSW4wLnJRS1VXT2RocktabERvYWY1d21laFhCLWx3aG1ua0FrTS1CT0NsSkxCRE1SMjNwR1FoaWlRekhRaFNNaE51VFhtNy1pckpyQVNWTFFFM2xNVmR1VmJQQmFJeUlqMUItR0p4amptc1RPVGJKWmpGcC1CMVp0Z1M4SnR0RFI2VF9FbEhqNlJ1SUFnS292NUVyOWhuQXdSYUNQZkJzTXRhemtoa09kS3ZPUXVoR2NoQ0tScW9sM2VubGdsOWUwa1ZQWTJIREdxVUFKVzhqT2tZcFlTY3pxaTJZcGhJS3ROTENhQ2YxY3k3cDBPZUx0a0RJRTdWYkhNd3p3NUtkbG5XdUptYVQ3T0l6bE40Wm9iNzJQMU5Hd0R2Vm5PcHNLX002cWwtbXhGQTRoZHAtSkVKaHo3RDdmS2dpcGxUU0hINGxiOFpBS244S3FRLTNTa2VSU3hZZUEtZyIsInRva2VuX3R5cGUiOiJCZWFyZXIiLCJ1c2VybmFtZSI6InJnaWFubm90dGlAdHJvY2dsb2JhbC5jb20ifQ.caIMl_6jvc2LRvCm2yhRELqHFpfsIUt3s63FneRm14E'

export async function getApiData(
	url: string,
	method = 'POST',
	payload: Record<string, any> = {},
	queryParams: Record<string, any> = {},
	options: Record<string, any> = {},
	myFetch?: any
) {
	if (!options.authorization) {
		// const token = sessionStorage.getItem('token') || localStorage.getItem('token')
		const headers = { authorization: `Bearer ${token}` }
		options = { ...options, headers }
	}
	const response = await getData(getQuerySlug(url), method, payload, queryParams, options, myFetch)
	return response
}

export async function patchData(url: string, payload: Record<string, any> = {}) {
	const headers = { authorization: `Bearer ${token}` }
	console.log('url', getQuerySlug(url), payload)
	//const response = await getData(getQuerySlug(url), 'PATCH', paload, {}, headers)
	return { data: 1 }
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
