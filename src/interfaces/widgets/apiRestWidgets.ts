interface WidgetAction {
    name: string;
    action: () => void;
}

interface ApiRestWidget {
    data: any;
    url: string;
    method: string;
}

export interface widgetActions {
    fetchData: (selectedWidget: ApiRestWidget) => Promise<any>;
    reloadData: (url: string, method: string) => Promise<any>;
    storeData: (data: any, widget: ApiRestWidget) => void;
    addWidgetAction: (widgetActions: WidgetAction[], name: string, action: () => void) => WidgetAction[];
}
