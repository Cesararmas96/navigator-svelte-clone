import { decrypt } from '$lib/helpers/auth/auth';
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  let token = ''

  try {
    if (!event.cookies.get('_session')) return await resolve(event)
    const decoded = decrypt(event.cookies.get('_session'));
    if (!decoded) return await resolve(event)
    token = decoded
  } catch (error) {
    return await resolve(event)
  }

  try {
    const rawSession = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/session`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    const session = await rawSession.json()

    if (session) {
      event.locals.user = session.session
      event.locals.user.token = token
    }
  } catch (error) {

    console.log('hooks', error)
    return await resolve(event)
  }

  return await resolve(event)
}

