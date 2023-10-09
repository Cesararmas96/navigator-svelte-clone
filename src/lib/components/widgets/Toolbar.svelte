<script lang="ts">
    import {Dropdown, Tooltip} from "flowbite-svelte";
    import ToolbarReload from "./toolbar/Reload.svelte";
    import ToolbarSettings from "./toolbar/Settings.svelte";
    import ToolbarPin from "./toolbar/Pin.svelte";
    import ToolbarHelp from "./toolbar/Help.svelte";
    import ToolbarScreenshot from "./toolbar/Screenshot.svelte";
    import ToolbarExportData from "./toolbar/ExportData.svelte";
    import Icon from "../common/Icon.svelte";
    import {getContext} from "svelte";
    import ToolbarFilter from "./toolbar/Filter.svelte";
    import ToolbarClone from "./toolbar/Clone.svelte";
    import ToolbarMaximize from "./toolbar/Maximize.svelte";
    import ToolbarClose from "./toolbar/Close.svelte";
    import ToolbarCollapse from "./toolbar/Collapse.svelte";
    import {getData} from "$lib/services/getData";
    import {getSession} from "$lib/helpers/auth/session";

    export let isToolbarVisible: boolean;

    const patternUrl =
        /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/;

    const widget: any = getContext("widget");
    let isWidgetOwner: boolean = getContext("isWidgetOwner");
    let menuOpen = false;

    let bg: string;
    let toolbar: any;
    $: bg = $widget?.params?.settings?.appearance?.background;
    $: toolbar = $widget?.params?.settings?.toolbar;


    const cwidget = getContext("widget");


    // TODO get session from session storage

    const handleWidgetCopyorCut = (widget: any, action: string) => {
        sessionStorage.setItem("copiedWidget", JSON.stringify($widget));
        sessionStorage.setItem("behavior", action);
    };

</script>

<div
        style:background-color={patternUrl.test(bg) ? 'transparent' : bg}
        class={isToolbarVisible ? `absolute right-2 mt-1 rounded-md bg-white dark:bg-dark-100` : 'hidden'}
        on:pointerdown={(event) => {
		event.preventDefault()
		event.stopPropagation()
	}}
>
    <div class="flex flex-row justify-end pl-0">
        {#if toolbar.reload}
            <ToolbarReload/>
        {/if}
        {#if toolbar.filtering}
            <ToolbarFilter/>
        {/if}
        {#if toolbar.clone}
            <ToolbarClone/>
        {/if}
        <ToolbarCollapse/>
        {#if toolbar.max}
            <ToolbarMaximize/>
        {/if}
        {#if toolbar.pin}
            <ToolbarPin/>
        {/if}
        {#if toolbar.help && $widget.description}
            <ToolbarHelp helpText={$widget.description}/>
        {/if}
        <!--Trying copy widget-->
        <button class="icon btn hover:bg-light-100 dark:hover:bg-dark-200"
                on:click={() => handleWidgetCopyorCut(widget, 'copy')}>
            <Icon
                    icon={'ph:copy-bold'}
                    size="18"
            />

        </button>
        <Tooltip placement="left">Copy</Tooltip>

        {#await getSession() then session}
            {#if (session.session.groups.includes("superuser"))}
                <button class="icon btn hover:bg-light-100 dark:hover:bg-dark-200"
                        on:click={() => handleWidgetCopyorCut(widget, 'cut')}>
                    <Icon
                            icon={'ion:cut-sharp'}
                            size="18"
                    />

                </button>
                <Tooltip placement="left">Cut</Tooltip>

            {/if}
        {/await}


        <Tooltip placement="left" triggeredBy="#more-actions">More</Tooltip>
        <button
                id="more-actions"
                type="button"
                class="icon btn hover:bg-light-100 dark:hover:bg-dark-200"
                aria-expanded="false"
                aria-haspopup="true"
        >
            <Icon icon="tabler:dots-vertical" size="18"/>
        </button>
        <Dropdown class="w-36" bind:open={menuOpen}>
            {#if toolbar.screenshot}
                <ToolbarScreenshot on:itemClick={() => (menuOpen = !menuOpen)}/>
            {/if}
            {#if toolbar.export}
                <ToolbarExportData on:itemClick={() => (menuOpen = !menuOpen)}/>
            {/if}
            {#if isWidgetOwner}
                <ToolbarSettings on:itemClick={() => (menuOpen = !menuOpen)}/>
            {/if}
        </Dropdown>

        {#if isWidgetOwner}
            <ToolbarClose/>
        {/if}
    </div>
</div>
