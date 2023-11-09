import { writable } from 'svelte/store';

export const storeDashboard = writable<any | null>(null);
export const storeDashboards = writable<any[]>([]);
export const hideDashboardSettings = writable(true);
export const selectedDashboard = writable({description: '', dashboard_id: 0, module_id: 0, attributes: { icon: '', color: '' }});

export const storeCCPDashboard = writable<any | null>(null);
export const storeCCPDashboardBehavior = writable<any | null>(null);

export const storeCCPWidget= writable<any | null>(null);
export const storeCCPWidgetBehavior = writable<any | null>(null);