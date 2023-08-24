import { error, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
	create: async ({ request }) => {
		try {
			const form = await request.formData();

			/**
			 * TODO: Handle form data and fetch widget settings to database
			 */
			
			return undefined;
		} catch (err: unknown) {
			const message = `Error in /login form: ${err as string}`;
			console.error(message);
			return error(500, message);
		}
	}
};