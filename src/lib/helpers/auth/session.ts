import { goto } from '$app/navigation'

export function validateUser(user) {
	if (!user) return false

	if (
		typeof user.created !== 'number' ||
		typeof user.expires_in !== 'string' ||
		typeof user.id !== 'string' ||
		typeof user.last_visit !== 'number' ||
		typeof user.last_visited !== 'string' ||
		!user.session ||
		typeof user.session.domain !== 'string' ||
		typeof user.session.email !== 'string' ||
		typeof user.session.enabled !== 'boolean' ||
		typeof user.session.first_name !== 'string' ||
		!Array.isArray(user.session.group_id) ||
		!Array.isArray(user.session.groups) ||
		typeof user.session.last_login !== 'string' ||
		typeof user.session.last_name !== 'string' ||
		!Array.isArray(user.session.programs) ||
		typeof user.session.superuser !== 'boolean' ||
		typeof user.session.user !== 'string' ||
		typeof user.session.user_id !== 'number' ||
		typeof user.session.username !== 'string' ||
		(user.session.title && typeof user.session.title !== 'string') ||
		typeof user.token !== 'string' ||
		typeof user.token_type !== 'string' ||
		typeof user.username !== 'string'
	) {
		return false
	}

	return true
}
