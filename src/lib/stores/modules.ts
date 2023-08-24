import { writable } from "svelte/store";

export const storeModule = writable<any | null>(null);
export const storeModules = writable([{module_name: '', module_id: 0}]);
