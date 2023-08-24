import { writable } from "svelte/store";

export const themeMode = writable<string>('light');
export const themeColor = writable<string>('blue');
