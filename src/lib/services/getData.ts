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
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTUwNjk0MTYsImlhdCI6MTY5NDcwOTQxNiwiaXNzIjoiTW9iaWxlaW5zaWdodCIsInVzZXJfaWQiOiJqdmlsYUB0cm9jZ2xvYmFsLmNvbSIsInVwbiI6Imp2aWxhQHRyb2NnbG9iYWwuY29tIiwiZW1haWwiOiJqdmlsYUB0cm9jZ2xvYmFsLmNvbSIsImdpdmVuX25hbWUiOiJKdWFuIiwiZmFtaWx5X25hbWUiOiJWaWxhIiwibmFtZSI6Ikp1YW4gVmlsYSIsImRpc3BsYXlfbmFtZSI6Ikp1YW4gVmlsYSIsImlkIjoianZpbGFAdHJvY2dsb2JhbC5jb20iLCJhdXRoX21ldGhvZCI6ImFkZnMiLCJhdXRoX3Rva2VuIjoiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKU1V6STFOaUlzSW5nMWRDSTZJbU54UW5kdVJrTmlaMjVPZVdrNFNrRlBUekpzZEhWVE56Um9WU0o5LmV5SmhkV1FpT2lKdGFXTnliM052Wm5RNmFXUmxiblJwZEhselpYSjJaWEk2Ym1GMmFXZGhkRzl5WDJSbGRpNWhaR1p6TG1sa1pXNTBhV1pwWlhJaUxDSnBjM01pT2lKb2RIUndjem92TDNOemJ5NTBjbTlqWjJ4dlltRnNMbU52YlM5aFpHWnpMM05sY25acFkyVnpMM1J5ZFhOMElpd2lhV0YwSWpveE5qazBOekE1TkRFeUxDSmxlSEFpT2pFMk9UUTNNVE13TVRJc0ltVnRZV2xzSWpvaWFuWnBiR0ZBZEhKdlkyZHNiMkpoYkM1amIyMGlMQ0puYVhabGJsOXVZVzFsSWpvaVNuVmhiaUlzSW1aaGJXbHNlVjl1WVcxbElqb2lWbWxzWVNJc0ltZHliM1Z3SWpwYklrUnZiV0ZwYmlCVmMyVnljeUlzSWxaUVRpQlZjMlZ5Y3lJc0lrRlhVeTAyTXpjMk5qQXpNRGN5TkRBdFJHRnphR0p2WVhKa0lsMHNJblZ3YmlJNkltcDJhV3hoUUhSeWIyTm5iRzlpWVd3dVkyOXRJaXdpWVd4MFpYSnVZWFJsUlcxaGFXd2lPaUpxYVhacGJHRkFiM1YwYkc5dmF5NWpiMjBpTENKRWFYTndiR0Y1TFU1aGJXVWlPaUpLZFdGdUlGWnBiR0VpTENKaGNIQjBlWEJsSWpvaVVIVmliR2xqSWl3aVlYQndhV1FpT2lKdVlYWnBaMkYwYjNKZlpHVjJMbUZrWm5NdVkyeHBaVzUwWDJsa0lpd2lZWFYwYUcxbGRHaHZaQ0k2SW5WeWJqcHZZWE5wY3pwdVlXMWxjenAwWXpwVFFVMU1Pakl1TURwaFl6cGpiR0Z6YzJWek9sQmhjM04zYjNKa1VISnZkR1ZqZEdWa1ZISmhibk53YjNKMElpd2lZWFYwYUY5MGFXMWxJam9pTWpBeU15MHdPUzB4TkZReE5qb3pOam8xTWk0M01EWmFJaXdpZG1WeUlqb2lNUzR3SWl3aWMyTndJam9pYjNCbGJtbGtJbjAuQVRoaFZFc0FiMGVtY0pnVWZHRDUtM0xha1lDcllIcGg2a0d5NUE1d2h4TnlUZzZBZUFSeTd3d2FpNl9TZm9GV1BZaERxdXpIMTJtT3ZSSzZRZHhnYkxyVTJGdmI4Q1o4QzlDVUJFWXZMYlh2SklMLS1FV3RneXZrbmNyM0FINENaZEQ2YlV0NUp1UlRWZHNsd3hKLVdhNHhoTDJMS1Q3cUI0T3BGclRaTUF5SDE5NGYxeVhWQ19LRFBRV28tejU0WDZaQTVJOVE3X2JoLUQwT2tSNmZScXJpSmo4U3dqSXZnMVJOR3dVVDBGSFk3eWE5bTIzcGZpZWFNNy1fY3Fud251dUY0RU9GVDdLNDNHZ1RUVWVXbzRYMkFBYVlZNHJoaUpkVE1uVDN1eVJkazU5bkhfZV9JMGw0T0hEZVBCNXhDMHZfS01tVlFrb0s2VmdYQWJlNElRIiwidG9rZW5fdHlwZSI6IkJlYXJlciIsInVzZXJuYW1lIjoianZpbGFAdHJvY2dsb2JhbC5jb20ifQ.vb2zc_ERenP9Nmiedz-vnGUGkBlhoxpR4jnsHzboTSM'

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

		const response = await fetch(`${url}`, init)

		if (response?.status === 200) {
			return await response.json()
		}
	} catch (error) {
		throw new Error('Error en la petición')
	}
}
