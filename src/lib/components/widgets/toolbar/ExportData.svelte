<script lang="ts">
    import {DropdownItem, Modal, Select, Input, Checkbox, Label} from "flowbite-svelte";
    import Icon from "$lib/components/common/Icon.svelte";
    import {createEventDispatcher, getContext} from "svelte";
    import {openExportDataModal} from "$lib/helpers/common/modal";

    const dispatch = createEventDispatcher();

    let modal: any = getContext("modal");
    let widgetActions: any = getContext("widgetActions");

    $: exportData = $widgetActions.find((action: any) => action.name === "exportData");


    const widget = getContext("widget");

    function onClick() {
        openExportDataModal(modal, $widget.query_slug.slug);
        // openExportData = true
        // dispatch('itemClick', { click: true })
    }
</script>

{#if exportData}
    <DropdownItem class="flex items-center gap-2" on:click={onClick}>
        <Icon icon="tabler:file-export" size="18"/>
        Export Data
    </DropdownItem>
{/if}
