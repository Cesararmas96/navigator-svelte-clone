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
    const session = {
        "session": {
            "user_id": 15779,
            "username": "jmendoza1@trocglobal.com",
            "first_name": "Jose",
            "last_name": "Mendoza",
            "email": "jmendoza1@trocglobal.com",
            "enabled": true,
            "superuser": true,
            "last_login": "2022-11-16T15:01:45.971224Z",
            "title": null,
            "associate_id": null,
            "group_id": [
                1
            ],
            "groups": [
                "superuser"
            ],
            "programs": [
                "walmart",
                "mso",
                "epson",
                "xfinity",
                "wm_assembly",
                "wm_reset",
                "troc",
                "trendmicro",
                "viba",
                "flexroc",
                "cricket",
                "us_cellular",
                "totalplay",
                "tcl",
                "worp",
                "romeo",
                "hisense",
                "tro_charter",
                "tro_xfinity",
                "bose",
                "viba_demo",
                "wsp_viba",
                "usc_wm",
                "tmobile",
                "usc_viba",
                "verizon",
                "mso_viba",
                "tro_xfinity_viba",
                "venu",
                "polestar",
                "directv",
                "troc_financial",
                "samsclub",
                "monstermex",
                "smartjobs"
            ],
            "user": "jmendoza1",
            "domain": "trocglobal.com"
        },
        "username": "jmendoza1@trocglobal.com",
        "id": "jmendoza1@trocglobal.com",
        "expires_in": "2023-10-07T17:46:52.591394Z",
        "token_type": "Bearer",
        "created": 1696340812.7020254,
        "last_visit": 1696340812.7020254,
        "last_visited": "Last visited: 1696340812.7020254"
    };


    const isSuperuser = session.session.groups.includes("superuser");


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


        {#if (isSuperuser)}
            <button class="icon btn hover:bg-light-100 dark:hover:bg-dark-200"
                    on:click={() => handleWidgetCopyorCut(widget, 'cut')}>
                <Icon
                        icon={'ion:cut-sharp'}
                        size="18"
                />

            </button>
            <Tooltip placement="left">Cut</Tooltip>

        {/if}


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
