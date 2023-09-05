<script lang="ts">
    import {getContext, onMount} from "svelte";
    import {selectedWidgetMaximize} from "$lib/stores/widgets";
    import {addWidgetAction, fetchData, reloadData, storeData} from "$lib/helpers";
    import type {Widget} from "../../../../interfaces/widgets/widgets";
    import type {WidgetAction} from "../../../../interfaces";
    import type {Writable} from "svelte/store";

    let widget: Widget = getContext("widget");

    let widgetActions = getContext("widgetActions");

    const url = $widget.query_slug.url;
    const method = $widget.query_slug.method;
    let data: Array<object> | undefined;


    $widgetActions = addWidgetAction($widgetActions, "reloadFetchData", () => {
        data = reloadData(url, method);
    });

    $widgetActions = addWidgetAction($widgetActions, "maximizeWidget", () => {
        storeData(data, $widget);
    });


    onMount(() => {
        data = fetchData($selectedWidgetMaximize, url, method);
    });

</script>

{#await data}
    <p>loading</p>
{:then data}
    <slot {data}/>
{/await}
