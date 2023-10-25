import { fail, redirect } from '@sveltejs/kit'
import type { Action, Actions, PageServerLoad } from './$types'
import { encrypt } from '$lib/helpers/auth/auth';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) throw redirect(302, '/')
}

const login: Action = async ({ cookies, request }) => {
  const data = await request.formData()
  const username = data.get('email')
  const password = data.get('password')

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    !username ||
    !password
  ) {
    return fail(400, { invalid: true })
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/login`, {
    method: "POST",
    headers: {
      "x-auth-method": "BasicAuth",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({username, password})
  });

  if (response.ok) {
    const data = await response.json();
    const token = encrypt(data.token);

    cookies.set('_session', token, {
      // send cookie for every page
      path: '/',
      // server side only cookie so you can't use `document.cookie`
      httpOnly: true,
      // only requests from same site can send cookies
      // https://developer.mozilla.org/en-US/docs/Glossary/CSRF
      sameSite: 'strict',
      // only sent over HTTPS in production
      secure: true, //import.meta.env.ENV === 'production',
      // set cookie to expire after a month
      maxAge: 60 * 60 * 24 * 30,
    })
  } else {
    return fail(400, { credentials: true })
  }
  // redirect the user
  throw redirect(302, '/')
}


export const actions: Actions = { login }
