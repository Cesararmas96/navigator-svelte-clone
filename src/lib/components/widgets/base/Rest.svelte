<script lang="ts">
    import {getData} from "$lib/services/getData";
    import {getContext} from "svelte";
    import {selectedWidgetMaximize} from "$lib/stores/widgets";

    let widget: any = getContext("widget");

    let widgetActions: any = getContext("widgetActions");

    const url = $widget.query_slug.url;
    const method = $widget.query_slug.method;
    const body = $widget.query_slug.body;

    let data: any;

    async function fetchData() {
        data = ($selectedWidgetMaximize?.data) ? $selectedWidgetMaximize.data : getData(url, method);
    }

    function storeData() {
        selectedWidgetMaximize.set({
            data, widget: $widget
        });
    }


    if (!$widgetActions.find((action: any) => action.name === "reloadFetchData")) {
        const actions = $widgetActions;
        actions.push({
            name: "reloadFetchData",
            action: () => fetchData()
        });
        $widgetActions = actions;
    }
    if (!$widgetActions.find((action: any) => action.name === "maximizeWidget")) {
        const actions = $widgetActions;
        actions.push({
            name: "maximizeWidget",
            action: () => storeData()
        });
        $widgetActions = actions;
    }


    fetchData();

</script>

{#await data}
    <p>loading</p>
{:then data}
    <slot {data}/>
{/await}
