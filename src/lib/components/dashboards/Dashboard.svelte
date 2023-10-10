<script lang="ts">
    import {Grid, GridItem} from "svelte-grid-extended";
    import Widget from "../widgets/Widget.svelte";
    import WidgetBox from "../widgets/WidgetBox.svelte";
    import {cloneItem, loadV2Locations, loadV3Locations, removeItem, resizeItem} from "$lib/helpers/dashboard/grid";
    import {getApiData} from "$lib/services/getData";
    import {storeWidgets} from "$lib/stores/widgets";
    import {storeDashboards} from "$lib/stores/dashboards";
    import Icon from "$lib/components/common/Icon.svelte";
    import {getSession} from "$lib/helpers/auth/session";
    import {Button, Modal, Table, TableBodyCell, TableBodyRow, TableHeadCell} from "flowbite-svelte";
    import Spinner from "$lib/components/common/Spinner.svelte";


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


    const handleWidgetPaste = async () => {
        try {
            // 1. Get copied widget from session storage
            const copiedWidget = JSON.parse(sessionStorage.getItem("copiedWidget"));

            // Check if widget exists
            if (!copiedWidget) return;

            // TODO: Display a modal to inform the user that nothing was copied.


            // 2. Get session
            const session = await getSession();
            const {program_id, dashboard_id} = dashboard; // Assuming dashboard is defined somewhere
            const widget_id = 278;
            const tempTitle = "Temp Title";
            const userId = session.session.user_id;

            // 3. Build the payload
            const payload = {program_id, dashboard_id, title: tempTitle, widget_id, user_id: userId};

            // 4. Insert the widget
            const response = await getApiData(`${baseUrl}/api/v2/widgets`, "PUT", payload);

            // 4.2 Insert the widget into widgets store
            console.log($storeWidgets);
            $storeWidgets.push(response.data);
            console.log($storeWidgets);

            // 5. Check if behavior was "cut" to remove the widget
            const behavior = sessionStorage.getItem("behavior");
            if (behavior === "cut") {
                await getApiData(`${baseUrl}/api/v2/widgets/${copiedWidget.uid}`, "DELETE");
            }
        } catch (error) {
            console.error(`An error occurred: ${error.message}`);
            // TODO: Handle error and display an appropriate message to the user if needed.
        }
    };


    const handleDashboardCopy = (behavior: string) => {
        sessionStorage.setItem("copiedDashboard", JSON.stringify(dashboard));
        sessionStorage.setItem("dashboardBehavior", behavior);

    };


    const handleDashboardPaste = async () => {

        // 1. Get dashboard from session storage
        let copiedDashboard = sessionStorage.getItem("copiedDashboard");
        // TODO if widget does not exist, a modal should appear telling the user nothing was copied
        if (!copiedDashboard) return;
        console.log(copiedDashboard);
        copiedDashboard = JSON.parse(copiedDashboard);

        // TODO get session from session storage

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


        const behavior = sessionStorage.get("dashboardBehavior");
        if (behavior === "cut") {
            await getApiData(`${baseUrl}https://api.dev.navigator.mobileinsight.com/api/v2/dashboards/${dashboard.uid}`, "DELETE");
        }

    };


    let displayModal = false;

    const getWidgetTemplates = async () => {
        displayModal = true;

        try {
            // Extract program id
            const {program_id} = dashboard;

            const token = sessionStorage.getItem("token");
            const resp = await fetch(`https://api.dev.navigator.mobileinsight.com/api/v2/widgets-template?program_id=${program_id}`,

                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            // getApiData(`https://api.dev.navigator.mobileinsight.com/api/v2/widgets-template`, "GET", "");

            if (!resp.ok) {
                const errorMessage = `Failed to fetch data: ${resp.status} - ${resp.statusText}`;
                throw new Error(errorMessage);
            }


            const data = await resp.json();
            console.log(data);

            return data;
        } catch (error) {
            console.error("An error occurred:", error.message);
            // Handle the error as needed, e.g., display an error message or log it.
        }
    };


    const handleWidgetInsert = async (widgetUid: string) => {
        const token = sessionStorage.getItem("token");
        try {

            const resp = await fetch(`https://api.dev.navigator.mobileinsight.com/api/v2/widgets-template/${widgetUid}`,

                {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!resp.ok) {
                const errorMessage = `Failed to fetch data: ${resp.status} - ${resp.statusText}`;
                throw new Error(errorMessage);
            }
            const data = await resp.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error("An error occurred:", error.message);
            // Handle the error as needed, e.g., display an error message or log it.
        }

    };

</script>

<svelte:window bind:innerWidth/>

{#if displayModal}
    {#await getWidgetTemplates()}
        <Spinner fullScreen={false}/>

    {:then widgets}
        <Modal title="Insert Widget" bind:open={displayModal} style="padding-top:50px">


            <Table hoverable={true}>

                <TableHeadCell>All Widgets</TableHeadCell>

                {#each widgets as widget}
                    <TableBodyRow>
                        <TableBodyCell>
                            <Button on:click={() => handleWidgetInsert(widget.uid)}>
                                {widget.widget_name}
                            </Button>
                        </TableBodyCell>
                    </TableBodyRow>
                {/each}

            </Table>


        </Modal>

    {/await}
{/if}


<button on:click={getWidgetTemplates}>Insert Widget</button>

{#await getSession() then session}

    <button on:click={handleWidgetPaste} class="mx-4">
        <Icon icon={"ic:round-content-paste"}/>
        <span>Paste widget</span>
    </button>

    <button on:click={() => handleDashboardCopy('copy')} class="mx-4">
        <Icon icon={'pixelarticons:copy'}/>
        <span>Copy Dashboard</span>
    </button>
    {#if (session.session.groups.includes("superuser"))}
        <button on:click={() => handleDashboardCopy('cut')} class="mx-4">
            <Icon icon={'pixelarticons:cut'}/>
            <span>Cut Dashboard</span>
        </button>
    {/if}
    <button on:click={handleDashboardPaste} class="mx-4">
        <Icon icon={"ic:round-content-paste"}/>
        <span>Paste Dashboard</span>
    </button>
{/await}

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
