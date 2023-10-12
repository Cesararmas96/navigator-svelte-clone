import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('session')

  if (!token) {
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
    console.log('hooks', session.session)

    if (session) {
      event.locals.user = session.session
    }
  } catch (error) {
    return await resolve(event)
  }


  // load page as normal
  return await resolve(event)
}
