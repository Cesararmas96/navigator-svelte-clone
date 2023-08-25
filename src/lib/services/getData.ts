export async function getData(
	url: string,
	method = 'POST',
	data: any = {},
	headers: any = {},
	extraCondition: any = {}
) {
	const patternUrl =
		/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/
	
	try {
		const token =
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTA2NzIxNDksImlhdCI6MTY5MDMxMjE0OSwiaXNzIjoidXJuOk5hdmlnYXRvciIsInVzZXIiOjMyNzExLCJ1c2VybmFtZSI6InJnaWFubm90dGlAdHJvY2dsb2JhbC5jb20iLCJ1c2VyX2lkIjozMjcxMSwiaWQiOiJvaWszbmpjd2E4bGl3aWFnY2MyZ2Z5a3VjMDZkaHprMyJ9.NBav3aRFcz-zBWFXfxplXjTo-22uDB_YCcRJ-CHx4uE'

		var myHeaders = new Headers()
		//myHeaders.append('Authorization', `Bearer ${token}`)
		if (method !== 'GET') myHeaders.append('Content-Type', 'application/json')
		
		let init: RequestInit = {
			method,
			headers: myHeaders,
			redirect: 'follow',
			body: JSON.stringify(data)
		}
		if (method === 'GET') delete init.body

		const response = await fetch(`${url}`, init)

		if (response?.status === 200) {
			return await response.json()
		}
	} catch (error) {
		throw new Error("Error en la petición");
	}
}
