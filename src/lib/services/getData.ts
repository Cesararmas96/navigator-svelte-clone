export async function getData(
	url: string,
	method = 'POST',
	conditions: unknown = {},
	headers: HeadersInit = {}
	// extraCondition: unknown = {}
) {
	try {
		const myHeaders = new Headers()
		//myHeaders.append('Authorization', `Bearer ${token}`)
		if (method !== 'GET') myHeaders.append('Content-Type', 'application/json')

		const init: RequestInit = {
			method,
			headers: headers,
			redirect: 'follow',
			body: JSON.stringify(conditions)
		}
		if (method === 'GET') delete init.body

		const response = await fetch(`${url}`, init)

		if (response?.status === 200) {
			return await response.json()
		}
	} catch (error) {
		throw new Error('Error en la petición')
	}
}
