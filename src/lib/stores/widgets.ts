import { writable } from "svelte/store";

export const hideWidgetSettings = writable(true);
export const selectedWidgetSettings = writable<any | null>(null);
export const selectedWidgetMaximize = writable<any | null>(null);
export const storeWidgets = writable<any[]>([]);
export const storeWidgetInstances = writable<any[]>([]);

export const hideFormBuilderDrawer = writable(true);
export const selectedFormBuilderWidget = writable<any | null>(null);
export const selectedFormBuilderRecord = writable<any | null>(null);
