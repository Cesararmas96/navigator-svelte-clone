<script lang="ts">
    import {addWidgetData} from "$lib/helpers/widget/data";
    import {getData} from "$lib/services/getData";
    import {getContext, onMount} from "svelte";
    import {addWidgetAction, storeData} from "$lib/helpers";
    import type {Widget} from "../../../../interfaces";

    let widget: Widget = getContext("widget");
    let widgetActions: any = getContext("widgetActions");

    const url = $widget.query_slug.url;
    const method = $widget.query_slug.method;
    const body = $widget.query_slug.body;

    let data: any;
    let dataStore: any = getContext("widgetData");

    async function fetchData() {
        data = null;
        data = getData(url, method);
        addWidgetData(dataStore, data);
    }

    $widgetActions = addWidgetAction($widgetActions, "maximizeWidget", () => {
        storeData(data, $widget);
    });
    $widgetActions = addWidgetAction($widgetActions, {
        name: "reloadFetchData",
        action: () => fetchData()
    });

    onMount(() => {
        if (!$dataStore) {
            console.log("onMount fetching data", $widget.uid);
            fetchData();
        } else {
            console.log("onMount $dataStore", $widget.uid);
            data = $dataStore;
        }
    });
</script>

{#await data}
    <p>loading</p>
{:then data}
    <slot {data}/>
{/await}
