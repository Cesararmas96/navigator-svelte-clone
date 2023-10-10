<script lang="ts">
    import {Tooltip} from "flowbite-svelte";
    import Icon from "$lib/components/common/Icon.svelte";
    import {getContext, setContext} from "svelte";
    import type {Writable} from "svelte/store";

    const widget = getContext<Writable<any>>("widget");
    const widgets = getContext<Writable<any>>("widgets");

    const handleClick = () => {
        if ($widget.temp) {
            $widget.close_instance = true;
        } else {
            $widget.remove = true;
        }
    };


    const urlBase = import.meta.env.VITE_API_URL;
    const endpoint = `${urlBase}/api/v2/widgets/${$widget.uid}`;
    const method = "DELETE";
    export let component;


    // Temporal variable
    const isClonedWidget = false;
    const removeWidgetFromDOM = () => {

        const widgetsToSet = $widgets.filter(widget => widget.uid !== $widget.uid);
        console.log(widgetsToSet);
        setContext("widgets", widgetsToSet);


    };


    async function closeWidget() {
        // Removes DOM element and DELETE request if not cloned
        if (!isClonedWidget) {
            try {
                // const response = await getData(endpoint, method);
                removeWidgetFromDOM();

            } catch (e) {
                console.log(e.message);
            }
        } else removeWidgetFromDOM();


    }


</script>

<button on:click={closeWidget} class="icon btn hover:bg-light-100 dark:hover:bg-dark-200">
    <Icon icon="tabler:x" size="18"/>
</button>
<Tooltip placement="left">Remove</Tooltip>
