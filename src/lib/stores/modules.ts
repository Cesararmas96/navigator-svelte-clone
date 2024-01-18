import { writable } from "svelte/store";

export const storeModule = writable<any | null>(null);
export const storeModules = writable<any | null>(null);
export const storeStores = writable<any | null>(null);
