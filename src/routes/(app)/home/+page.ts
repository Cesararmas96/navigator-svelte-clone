import { getApiData } from "$lib/services/getData"

export const ssr = false;

export const load = async ({params, fetch}) => {
  const programs = await getApiData(`programs`, 'GET', {}, {}, {}, fetch) 
  return { programs }
}