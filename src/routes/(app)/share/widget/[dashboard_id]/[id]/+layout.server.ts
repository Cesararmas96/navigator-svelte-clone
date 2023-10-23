import {getApiData} from "$lib/services/getData";

export const load = async ({params, url, locals, fetch}) => {
    const urlBase = import.meta.env.VITE_API_URL;
    try {
        const token = url.searchParams.get("token") || locals.user?.token;
        const headers = token ? {authorization: `Bearer ${token}`} : {};
        const widgets = await getApiData(`${urlBase}/api/v2/widgets?dashboard_id=${params.dashboard_id}`, "GET", {}, {}, {headers}, fetch);
        const widget = widgets.find((item: any) => item.widget_id === params.id);
        return { widget, user: locals.user };
    } catch (error) {
        throw new Error(`Request error: ${error}`);
    }
};
