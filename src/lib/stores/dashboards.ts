import { writable } from 'svelte/store';

export const storeDashboards = writable([{description: '', dashboard_id: 0, module_id: 0, attributes: { icon: '', color: '' }}]);
export const hideDashboardSettings = writable(true);
export const selectedDashboard = writable({description: '', dashboard_id: 0, module_id: 0, attributes: { icon: '', color: '' }});
