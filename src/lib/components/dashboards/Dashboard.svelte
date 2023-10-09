<script lang="ts">
    import Grid, {GridItem, type GridController} from "svelte-grid-extended";
    import Widget from "../widgets/Widget.svelte";
    import WidgetBox from "../widgets/WidgetBox.svelte";
    import {
        loadV2Locations,
        loadV3Locations,
        resizeItem,
        cloneItem,
        removeItem
    } from "$lib/helpers/dashboard/grid";
    import {getApiData} from "$lib/services/getData";
    import {storeWidgets} from "$lib/stores/widgets";
    import {storeDashboards} from "$lib/stores/dashboards";
    import Icon from "$lib/components/common/Icon.svelte";

    export let dashboard: any;
    const baseUrl = import.meta.env.VITE_API_URL;

    const cols = 12;
    const itemSize = {height: 10};

    let innerWidth: number;
    let gridItems: any[] = [];
    // let gridController: GridController

    const isMobile = (): boolean => {
        return window.innerWidth < 500;
    };

    const getGridItems = async (dashboardId: string) => {
        const widgets = await getApiData(
            `${import.meta.env.VITE_API_URL}/api/v2/widgets?dashboard_id=${dashboardId}`,
            "GET"
        );
        return dashboard.attributes.explorer === "v3" ||
        !dashboard.widget_location ||
        Object.keys(dashboard.widget_location).length === 0
            ? loadV3Locations(dashboard, widgets, cols, false)
            : loadV2Locations(dashboard, widgets, cols, false);
    };

    $: handleResizable = (item: any) => {
        gridItems = resizeItem(item, gridItems);
    };
    $: handleCloning = (item: any) => {
        gridItems = cloneItem(item, gridItems);
    };
    $: handleRemove = (item: any) => {
        // item.data.component.$destroy()
        gridItems = removeItem(item, gridItems);
        // gridItems.map((item: any) => {
        // 	delete item.data.loaded
        // 	return item
        // })
    };

    let resizedUID = "";
    $: changeItemSize = (item: any) => {
        console.log("changeItemSize", item);
        resizedUID = item.uid;
    };

    $: getGridItems(dashboard.dashboard_id).then((items: any) => {
        gridItems = items;
    });


    const handleWidgetPaste = () => {

        // 1. Get widget from session storage
        let copiedWidget = sessionStorage.getItem("copiedWidget");
        // TODO if widget does not exist, a modal should appear telling the user nothing was copied
        if (!copiedWidget) return;
        copiedWidget = JSON.parse(copiedWidget);

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


        // 2. Extract data
        const {program_id, dashboard_id} = dashboard; // Get program_id and dashboard_id from current dashboard
        const widget_id = 278; // Set default widget_id template
        const tempTitle = "Temp Title"; // Choose a title
        const userId = session.session.user_id; // Get the user_id from session, to assign the widget

        // 3. Build the payload
        const payload = {program_id, dashboard_id, title: tempTitle, widget_id, user_id: userId};


        // 4. Insert the widget
        try {
            // 4.1 Make API request to insert the widget
            console.log($storeWidgets);
            getApiData(`${baseUrl}/api/v2/widgets`, "PUT", payload).then((w) => {
                console.log($storeWidgets);
                // 4.2 Insert the widget into widgets store
                $storeWidgets.push(w.data);
            });
        } catch (e: any) {
            console.log(`There was an error: ${e.message}`);
        }


        // 5. Check if behavior was cut to remove widget
        const behavior = sessionStorage.getItem("behavior");
        if (behavior === "cut") {
            try {
                getApiData(`${baseUrl}/api/v2/widgets/${copiedWidget.uid}`, "DELETE");
            } catch (e) {
                console.log(e.message);
            }

        }
    };


    const handleDashboardCopy = () => {
        sessionStorage.setItem("copiedDashboard", JSON.stringify(dashboard));
    };


    const handleDashboardPaste = () => {

        // 1. Get dashboard from session storage
        let copiedDashboard = sessionStorage.getItem("copiedDashboard");
        // TODO if widget does not exist, a modal should appear telling the user nothing was copied
        if (!copiedDashboard) return;
        copiedDashboard = JSON.parse(copiedDashboard);

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


        // 2. Extract data
        const {duid, module_id} = copiedDashboard;


        // 3. Build the payload
        const payload = {duid, module_id};
        console.log(payload);
        // 4. Clone the dashboard
        try {
            // 4.1 Make API request to insert the widget
            console.log($storeDashboards);
            getApiData(`${baseUrl}/api/v2/dashboard/clone`, "POST", payload).then((d) => {
                // 4.2 Insert the widget into widgets store
                $storeDashboards.push(d.data);
                console.log($storeDashboards);

            });
        } catch (e: any) {
            console.log(`There was an error: ${e.message}`);
        }

    };


</script>

<svelte:window bind:innerWidth/>


<button on:click={handleWidgetPaste} class="mx-4">
    <Icon icon={"ic:round-content-paste"}/>
    <span>Paste widget</span>
</button>

<button on:click={handleDashboardCopy} class="mx-4">
    <Icon icon={'pixelarticons:copy'}/>
    <span>Copy Dashboard</span>
</button>
<button on:click={handleDashboardPaste} class="mx-4">
    <Icon icon={"ic:round-content-paste"}/>
    <span>Paste Dashboard</span>
</button>

<Grid {itemSize} class="grid-container" gap={5} {cols} collision="compress">
    {#each gridItems as item}
        <GridItem
                x={item.x}
                y={item.y}
                w={item.w}
                h={item.h}
                class="grid-item"
                activeClass="grid-item-active"
                previewClass="bg-red-500 rounded"
                on:change={(e) => {
				changeItemSize(item)
			}}
                let:active
        >
            <WidgetBox
                    widget={item.data}
                    resized={resizedUID === item.uid && !active}
                    let:fixed
                    let:isOwner
                    let:isToolbarVisible
                    let:widget
                    on:handleResize={() => handleResizable(item)}
                    on:handleCloning={() => handleCloning(item)}
                    on:handleRemove={() => handleRemove(item)}
                    on:handleResizable={(e) => {
					item.data.params.settings.resizable = e.detail.resizable && !e.detail.fixed
				}}
            >
                <!-- bind:this={item.component} -->
                <Widget
                        {widget}
                        {fixed}
                        {isToolbarVisible}
                        {isOwner}
                        on:handleInstanceResize={() => handleResizable(item)}
                />
            </WidgetBox>
        </GridItem>
    {/each}
</Grid>
