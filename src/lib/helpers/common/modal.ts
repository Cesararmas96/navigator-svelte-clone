import {setContext} from "svelte";
import {writable, type Writable} from "svelte/store";

export function initModal() {
    const modal = writable(null);
    setContext("modal", modal);
}

export const openExportDataModal = (modal: Writable<any>, query_slug: string) => {
    const instanceConfig = {title: "Export Modal", component: "ExportData", props: {query_slug}};
    modal.update((m) => (m = instanceConfig));


};
