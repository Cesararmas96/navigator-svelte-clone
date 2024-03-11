// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			//user: UserInfo; // Your type here
			theme: {
				mode: string
				color: string
			}
			client: any
			module: any
			user: any
			token: string
			tenant: string
		}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {}
