<script lang="ts">
    import {Tooltip} from "flowbite-svelte";
    import Icon from "$lib/components/common/Icon.svelte";
    import {getContext} from "svelte";
    import {selectedWidgetMaximize} from "$lib/stores/widgets";

    const widget = getContext("widget");
    let widgetActions: any = getContext("widgetActions");

    $: isMaximize = Boolean($selectedWidgetMaximize);
    $: maximize = $widgetActions.find((action: any) => action.name === "maximizeWidget");
    const handleMaximize = () => {
        isMaximize = !isMaximize;
        maximize.action();
    };


</script>

<button class="icon btn hover:bg-light-100 dark:hover:bg-dark-200" on:click={handleMaximize}>
    <Icon
            icon={isMaximize ? 'tabler:arrows-diagonal-minimize-2' : 'tabler:arrows-diagonal'}
            size="18"
    />
</button>
<Tooltip placement="left">{isMaximize ? 'Restore' : 'Fullscreen'}</Tooltip>
