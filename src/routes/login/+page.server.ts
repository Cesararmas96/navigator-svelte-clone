import { fail, redirect } from '@sveltejs/kit'
import type { Action, Actions, PageServerLoad } from './$types'
import { encrypt } from '$lib/helpers/auth/auth'

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) throw redirect(302, '/')
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
		const half = Math.ceil(data.token.length / 2)
		const token1 = data.token.slice(0, half)
		const token2 = data.token.slice(half)

		cookies.set('_session1', encrypt(token1), {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: true, //import.meta.env.ENV === 'production',
			maxAge: 60 * 60 * 24 * 30
		})
		cookies.set('_session2', encrypt(token2), {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
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
