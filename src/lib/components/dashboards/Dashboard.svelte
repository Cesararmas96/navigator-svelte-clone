<script lang="ts">
    import Grid, {GridItem, type GridController} from "svelte-grid-extended";
    import Widget from "../widgets/Widget.svelte";
    import {storeWidgets} from "$lib/stores/widgets";
    import WidgetBox from "../widgets/WidgetBox.svelte";

    import {getContext, onMount} from "svelte";
    import {selectedDashboard, storeDashboards} from "$lib/stores/dashboards";
    import {insertWidget} from "$lib/helpers/widgets/actions";
    import {getApiData} from "$lib/services/getData";

    const baseUrl = import.meta.env.VITE_API_URL;
    export let dashboard: any;

    const cols = 12;
    const itemSize = {height: 40};

    let innerWidth: number;
    let gridItems: any[];
    // let gridController: GridController

    const loadV2Locations = (_dashboard: any) => {
        let widgets: any[] = [];
        let x: number = 0;
        let y: number = 0;
        const locations = _dashboard.attributes.cols.split(",") || [_dashboard.attributes.cols];
        Object.keys(_dashboard.widget_location).forEach(function callback(value: any, index: number) {
            const uid = Object.keys(_dashboard.widget_location[value])[0];
            const data = $storeWidgets.find((item) => item.uid === uid) || {};
            const w = parseInt(locations[index]) * (cols / 12);
            if (w + x > cols) {
                x = 0;
                y += 4;
            }
            widgets.push({uid, x, y, w, h: 4, data});
            x += w;
        });
        return widgets;
    };

    const loadV3Locations = (_dashboard: any) => {
        if (isMobile()) {
            let row = 0;
            return _dashboard.widget_location.map((widget: any) => {
                const data = $storeWidgets.find((item) => item.uid === widget.uid) || {};
                widget.x = 0;
                widget.y = row;
                widget.w = cols;
                row += widget.h;
                return {...widget, ...data};
            });
        }
        return _dashboard.widget_location.map((widget: any) => {
            const data = $storeWidgets.find((item) => item.uid === widget.uid) || {};
            return {...widget, ...data};
        });
    };

    $: gridItems = dashboard.attributes.cols ? loadV2Locations(dashboard) : loadV3Locations(dashboard);

    // function addNewItem() {
    // 	const w = 4
    // 	const h = 4
    // 	const newPosition = gridController.getFirstAvailablePosition(w, h)
    // 	gridItems = newPosition
    // 		? [...gridItems, { uid: generateUID(), x: newPosition.x, y: newPosition.y, w, h, data: {} }]
    // 		: gridItems
    // }

    function resizeItem(item: any) {
        const header = document.getElementById(`widget-header-${item.uid}`)?.clientHeight || 0;
        const content = document.getElementById(`widget-main-content-${item.uid}`)?.clientHeight || 0;
        const widgetInstances =
            document.getElementById(`widget-instances-${item.uid}`)?.clientHeight || 0;
        const height = header + content + widgetInstances;
        const prevousHeight = maxHeight(item.y);
        item.h = Math.ceil(height / 40);
        reorderAfterResize(item, prevousHeight);
    }

    function maxHeight(yPos: number) {
        const items = gridItems;
        return Math.max(...items.filter((i) => i.y === yPos).map((i) => i.h));
    }

    function reorderAfterResize(item: any, prevousHeight: number) {
        const items = gridItems;
        const height = maxHeight(item.y) - prevousHeight;
        items.map((i) => {
            if (i.y > item.y) i.y += height;
            return i;
        });
        gridItems = [...items];
    }

    const isMobile = (): boolean => {
        return window.innerWidth < 500;
    };


    const handleDashboardPaste = () => {

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


</script>

<svelte:window bind:innerWidth/>

<button on:click={handleDashboardPaste}>PASTE</button>


<Grid {itemSize} class="grid-container" gap={5} {cols} collision="compress">
    {#each gridItems as item, i}
        <GridItem
                x={item.x}
                y={item.y}
                w={item.w}
                h={item.h}
                class="grid-item"
                activeClass="grid-item-active"
                previewClass="bg-red-500 rounded"
                movable={item.data.params?.settings?.draggable && !item.data.params?.settings?.fixed}
                resizable={item.data.params?.settings?.resizable && !item.data.params?.settings?.fixed}
        >
            <WidgetBox
                    widget={item.data}
                    let:fixed
                    let:isOwner
                    let:isToolbarVisible
                    on:handleResize={() => resizeItem(item)}
                    on:handleResizable={(e) => {
					item.data.params.settings.resizable = e.detail.resizable && !e.detail.fixed
				}}
            >
                <Widget
                        {fixed}
                        {isToolbarVisible}
                        {isOwner}
                        on:handleInstanceResize={() => resizeItem(item)}
                />
            </WidgetBox>
        </GridItem>
    {/each}
</Grid>
