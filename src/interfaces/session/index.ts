export interface User {
	created: number
	expires_in: string
	id: string
	last_visit: number
	last_visited: string
	session: {
		associate_id?: null | number
		domain: string
		email: string
		enabled: boolean
		first_name: string
		group_id: number[]
		groups: string[]
		last_login: string
		last_name: string
		programs: string[]
		superuser: boolean
		title?: string
		user: string
		user_id: number
		username: string
	}
	token: string
	token_type: string
	username: string
}
