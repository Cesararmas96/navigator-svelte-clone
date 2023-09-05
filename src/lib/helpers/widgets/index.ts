import {selectedWidgetMaximize} from "$lib/stores/widgets";
import {getData} from "$lib/services/getData";


export async function fetchData(selectedWidget: any, url, method) {
    return (selectedWidget?.data) ? selectedWidget.data : getData(url, method);
}

export async function reloadData(url, method): Promise<any> {
    return getData(url, method);
}

export function storeData(data, widget): void {
    selectedWidgetMaximize.set({
        data, widget: widget
    });
}
