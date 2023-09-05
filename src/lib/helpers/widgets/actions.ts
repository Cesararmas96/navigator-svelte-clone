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


interface WidgetAction {
    name: string;
    action: () => void;
}

export function addWidgetAction(
    widgetActions: WidgetAction[],
    name: string,
    action: () => void
): WidgetAction[] {
    const existingAction = widgetActions.find((action) => action.name === name);
    if (!existingAction) {
        widgetActions.push({
            name,
            action,
        });
    } else {
        existingAction.action = action;
    }
    return widgetActions;
}




