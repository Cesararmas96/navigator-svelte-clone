export async function getData(
	url: string,
	method = 'POST',
	data: any = {},
	headers: any = {},
	extraCondition: any = {}
) {
	try {

		const apiUrl = import.meta.env.VITE_API_URL
		const token = null

		var myHeaders = new Headers()
		myHeaders.append('Authorization', `Bearer ${token}`)
		if (method !== 'GET') myHeaders.append('Content-Type', 'application/json')
		
		let init: RequestInit = {
			method,
			headers: myHeaders,
			redirect: 'follow',
			body: JSON.stringify(data)
		}
		if (method === 'GET') delete init.body

		const response = await fetch(`${apiUrl}/${url}`, init)

		if (response?.status === 200) {
			return await response.json()
		}
	} catch (error) {
		console.error(error)
	}
}
