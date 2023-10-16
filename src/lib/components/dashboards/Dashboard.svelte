<script lang="ts">
    import Grid, {GridItem, type GridController} from "svelte-grid-extended";
    import Widget from "../widgets/Widget.svelte";
    import WidgetBox from "../widgets/WidgetBox.svelte";
    import {
        loadV2Locations,
        loadV3Locations,
        resizeItem,
        cloneItem,
        removeItem,
        addNewItem,
        pasteItem
    } from "$lib/helpers/dashboard/grid";
    import {getApiData} from "$lib/services/getData";
    import Alerts from "../widgets/type/Alert/Alerts.svelte";
    import {sendAlert} from "$lib/helpers/common/alerts";
    import {AlertType, type AlertMessage} from "$lib/interfaces/Alert";
    import {storeCCPWidget, storeCCPWidgetBehavior} from "$lib/stores/dashboards";
    import {storeUser} from "$lib/stores";
    import {onMount} from "svelte";
    import Spinner from "$lib/components/common/Spinner.svelte";

    import {Button, Card, Table, TableBodyCell, TableBodyRow, TableHeadCell, Modal, P} from "flowbite-svelte";
    import Icon from "$lib/components/common/Icon.svelte";

    export let dashboard: any;
    const baseUrl = import.meta.env.VITE_API_URL;

    const cols = 12;
    const itemSize = {height: 10};

    let innerWidth: number;
    let gridItems: any[] = [];
    let gridController: GridController;

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
        resizedUID = item.uid;
    };

    $: {
        gridItems = [];
        getGridItems(dashboard.dashboard_id).then((items: any) => {
            gridItems = items;
        });
    }

    const handleWidgetPaste = async () => {
        try {
            const copiedWidget = $storeCCPWidget;

            const {program_id, dashboard_id} = dashboard; // Assuming dashboard is defined somewhere
            const widget_id = copiedWidget.widget_id; // TODO: Check if widget_id is defined
            const tempTitle = "Temp Title";

            const item = gridItems.find((item: any) => item.uid === copiedWidget.uid);
            const newItem = structuredClone(item);
            const position = addNewItem(newItem, gridController);
            newItem.data = copiedWidget;
            newItem.x = position.x;
            newItem.y = position.y;

            gridItems = pasteItem(newItem, gridItems);

            // 3. Build the payload
            const payload = {
                program_id,
                dashboard_id,
                title: tempTitle,
                widget_id,
                user_id: $storeUser.user_id
            };
            // 4. Insert the widget
            // const response = await getApiData(`${baseUrl}/api/v2/widgets`, 'PUT', payload)
            // 4.2 Insert the widget into widgets store
            // console.log($storeWidgets)
            // $storeWidgets.push(response.data)
            // console.log($storeWidgets)
            // 5. Check if behavior was "cut" to remove the widget
            const behavior = $storeCCPWidgetBehavior;
            // if (behavior === 'cut') {
            // 	await getApiData(`${baseUrl}/api/v2/widgets/${copiedWidget.uid}`, 'DELETE')
            // }
        } catch (error: any) {
            console.error(`An error occurred: ${error.message}`);
            // TODO: Handle error and display an appropriate message to the user if needed.
        }
    };
    const addWidgetCopyAlert = () => {
        const behavior = $storeCCPWidgetBehavior;
        const alert: AlertMessage = {
            id: "widget-copied",
            title: `Widget ${behavior === "copy" ? "copied" : "cut"}`,
            message: `You have a widget ${
                behavior === "copy" ? "copied" : "cut"
            } in clipboard. Use Paste Widget button to paste it`,
            type: AlertType.INFO,
            callback1Btn: "Paste Widget",
            callback1: handleWidgetPaste,
            callback2Btn: "Clear",
            callback2: clearCopyWidget
        };
        sendAlert(alert);
    };

    const clearCopyWidget = () => {
        storeCCPWidget.set(null);
        storeCCPWidgetBehavior.set(null);
    };

    $: if ($storeCCPWidget) addWidgetCopyAlert();


    let displayModal = false;

    const getWidgetTemplates = async () => {
        displayModal = true;

        try {
            // Extract program id
            const {program_id} = dashboard;

            const token = $storeUser.token;
            const resp = await fetch(`https://api.dev.navigator.mobileinsight.com/api/v2/widgets-template?program_id=${program_id}`,

                {
                    method: "GET",
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


    const handleWidgetInsert = async (widgetUid: string) => {
        const token = $storeUser.token


        try {

            const payload = {widget_name: 'New widget'}
            const resp = await fetch(`https://api.dev.navigator.mobileinsight.com/api/v2/widgets-template/${widgetUid}`,
            // const resp = await fetch(`https://api.dev.navigator.mobileinsight.com/api/v2/widgets-template/b13b619a-847e-4734-a3d2-fa198f0531b7`,
                {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                  body: JSON.stringify(payload)
                }
            )

            if (!resp.ok) {
                const errorMessage = `Failed to fetch data: ${resp.status} - ${resp.statusText}`;
                throw new Error(errorMessage);
            }
            const widget = await resp.json();

            widget.resize_load = true
            const newItem = Object.create({})
            newItem.data = widget;
            newItem.w = 6
            newItem.h = 12
            const position = addNewItem(newItem, gridController);
            newItem.x = position.x;
            newItem.y = position.y;


            console.log(newItem)

           gridItems = pasteItem(newItem, gridItems);







            displayModal = false
            return widget;
        } catch (error) {
            console.error("An error occurred:", error.message);
            // Handle the error as needed, e.g., display an error message or log it.
        }

    };


const getTemplateIcon = async(widget) => {
    let rawIcon = widget.attributes && widget.attributes.icon


    if (rawIcon.includes(' ')){
        rawIcon = rawIcon.split(' ')[1]

    }


return rawIcon
}



</script>

<svelte:window bind:innerWidth/>

<button on:click={() => displayModal = true}><Icon icon={"material-symbols:add"} size="18"></Icon>Add Widget</button>


{#if (displayModal)}
    {#await getWidgetTemplates()}
        <Spinner fullScreen={false}/>

    {:then widgets}



<div class="z-30">

        <Modal bind:open={displayModal} placement={"bottom-center"}>
            <P size={"3xl"}>All Widgets</P>
            <ul class="my-4 space-y-3">
                {#each widgets as widget}
                    {#if (widget.title)}
                    <div
                       class="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                        {#await getTemplateIcon(widget) then icon}
                            <span style="color:{widget.attributes.fg_color}">

                        <Icon icon={icon} size="25px"/>
                            </span>
                            {/await}
                        <button class="flex-1 ml-3 whitespace-nowrap" on:click={() => handleWidgetInsert(widget.uid)}>{widget.title}</button>

                    </div>
                    {/if}
                {/each}
            </ul>

        </Modal>

</div>

    {/await}

{/if}

<Alerts/>

<Grid
        {itemSize}
        class="grid-container"
        gap={5}
        {cols}
        collision="compress"
        bind:controller={gridController}
>
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
