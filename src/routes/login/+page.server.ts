/* eslint-disable @typescript-eslint/no-explicit-any */
import { fail, redirect } from '@sveltejs/kit'
import type { Action, Actions, PageServerLoad } from './$types'
import { encrypt } from '$lib/helpers/auth/auth'
import { buildImageUrls, filterAuthMethods, removeBasicAuth } from '$lib/helpers/login/login'
import { getApiData } from '$lib/services/getData'

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) throw redirect(302, '/')

	const apiUrl = import.meta.env.VITE_API_URL
	const tenant = url.hostname.split('.')[0]
	const rootLink = `${import.meta.env.VITE_API_URL_IMAGES}/api/v2/services/images/`

	const resp = await getApiData(`${apiUrl}/api/v1/clients?subdomain_prefix=${tenant}`, 'GET')
	const data = resp[0]

	const images = buildImageUrls(data, rootLink)
	const { authMethods } = images

	let filteredObject: Record<string, any> = {}

	const totalAuthMethods = await getApiData(`${apiUrl}/api/v1/auth/methods`, 'GET')
	filteredObject = filterAuthMethods(totalAuthMethods, authMethods)
	filteredObject = removeBasicAuth(filteredObject)

	return {
		filteredObject,
		images
	}
}

const login: Action = async ({ cookies, request }) => {
	const data = await request.formData()
	const username = data.get('email')
	const password = data.get('password')

	if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
		return fail(400, { invalid: true })
	}

	const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/login`, {
		method: 'POST',
		headers: {
			'x-auth-method': 'BasicAuth',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ username, password })
	})

	if (response.ok) {
		const data = await response.json()
		const length = Math.ceil(data.token.length / 3)
		const token1 = encrypt(data.token.substring(0, length))
		const token2 = encrypt(data.token.substring(length, 2 * length))
		const token3 = encrypt(data.token.substring(2 * length))

		cookies.set('_session1', token1, {
			path: '/',
			httpOnly: true,
			sameSite: 'none',
			secure: true, //import.meta.env.ENV === 'production',
			maxAge: 60 * 60 * 24 * 30
		})
		cookies.set('_session2', token2, {
			path: '/',
			httpOnly: true,
			sameSite: 'none',
			secure: true, //import.meta.env.ENV === 'production',
			maxAge: 60 * 60 * 24 * 30
		})
		cookies.set('_session3', token3, {
			path: '/',
			httpOnly: true,
			sameSite: 'none',
			secure: true, //import.meta.env.ENV === 'production',
			maxAge: 60 * 60 * 24 * 30
		})
		cookies.delete('_program')
	} else {
		return fail(400, { credentials: true, message: await response.json() })
	}
	// redirect the user
	throw redirect(302, '/')
}

export const actions: Actions = { login }
