<script lang="ts">
    import {getContext, onMount} from "svelte";
    import {selectedWidgetMaximize} from "$lib/stores/widgets";
    import {addWidgetAction, fetchData, reloadData, storeData} from "$lib/helpers/widgets/actions";

    let widget: any = getContext("widget");

    let widgetActions: any = getContext("widgetActions");

    const url = $widget.query_slug.url;
    const method = $widget.query_slug.method;
    const body = $widget.query_slug.body;
    let data: any;


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
