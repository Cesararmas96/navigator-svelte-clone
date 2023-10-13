import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user)  throw redirect(302, '/login')
}

export const actions: Actions = {
	create: async ({request}) => {
		try {
			const form = await request.formData();

			/**
			 * TODO: Handle form data and fetch widget settings to database
			 */

			throw new Error("This feature is not yet implemented.");
			return undefined;
		} catch (err: unknown) {
			const message = `Error in /login form: ${err as string}`;
			console.error(message);
			return {
				status: 500,
				error: 'Internal server error',
			}
		}
	}
};