export function sessionStorageMiddleware() {
	return {
		async handle({ request, resolve }) {
			// Access session storage data here
			const sessionData = sessionStorage.getItem('authToken')

			// You can log the session data for debugging purposes

			// Pass the session data to the context for your routes/components
			request.locals.sessionData = sessionData
			console.log('Session Data:', sessionData)

			// Continue with the request
			return await resolve(request)
		}
	}
}
