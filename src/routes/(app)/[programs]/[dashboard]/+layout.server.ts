// import { getApiData } from "$lib/services/getData"

// export const load = async ({params, parent}) => {
//   const urlBase = import.meta.env.VITE_API_URL
//   try {
//     console.log('ENTRO')
//     const p = await parent()

//     // console.log(p.)
//     // const dashboard = p.dashboards.find((item: any) => item.dashboard_name === params.dashboard);
//     // console.log(p.dashboards, params.dashboard)
//     // const widgets = await getApiData(`${urlBase}/api/v2/widgets?dashboard_id=${dashboard?.dashboard_id}`, 'GET')

//     // const modules = await getApiData(`${urlBase}/api/v2/modules?program_slug=${params.programs}`, 'GET')
//     // const trocModule = modules.find((item: any) => item.module_slug === params.programs);
//     // const menu = modules.filter((item: any) => item.program_id === trocModule?.program_id);

//     return {  }
//   } catch (error) {
//     throw new Error(`Request error: ${error}`)
//   }

// }