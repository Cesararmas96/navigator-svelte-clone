import { writable } from "svelte/store";

export const hideWidgetSettings = writable(true);
export const selectedWidgetSettings = writable<any | null>(null);
export const selectedWidgetMaximize = writable<any | null>(null);
export const storeWidgets = writable<any[]>([]);