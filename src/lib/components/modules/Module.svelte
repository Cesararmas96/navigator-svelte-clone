<script lang="ts">
    import {Tabs, TabItem, Modal, Button, Dropdown, DropdownItem, MenuButton, P} from "flowbite-svelte";
    import Dashboard from "../dashboards/Dashboard.svelte";
    import {
        hideDashboardSettings,
        selectedDashboard,
        storeCCPDashboard,
        storeCCPDashboardBehavior,
        storeDashboards
    } from "$lib/stores/dashboards";
    import Icon from "../common/Icon.svelte";
    import {openConfirmModal, openModal} from "$lib/helpers/common/modal";
    import {getApiData, patchData} from "$lib/services/getData";
    import {page} from "$app/stores";
    import {sendErrorNotification, sendSuccessNotification} from "$lib/stores/toast";
    import {clearAlerts, sendAlert, sendInfoAlert} from "$lib/helpers/common/alerts";
    import Alerts from "../widgets/type/Alert/Alerts.svelte";
    import {AlertType, type AlertMessage} from "$lib/interfaces/Alert";
    import {storeUser} from "$lib/stores";
    import Spinner from "$lib/components/common/Spinner.svelte";
    import {addNewItem, pasteItem} from "$lib/helpers/dashboard/grid";

     import Grid, {GridItem, type GridController} from "svelte-grid-extended";


    export let trocModule: any;
    export let dashboards: any;

    const baseUrl = import.meta.env.VITE_API_URL;

    let pastedDashboard: any;

    let dropdownOpen = false;

    clearAlerts();

    $: currentDashboard = dashboards && dashboards.length > 0 ? {...dashboards[0]} : {};
    $: if (!dashboards || dashboards?.length === 0)
        sendInfoAlert(
            "There are no dashboards here yet. But you can start to add them by clicking on the \"New tab\" buttom above"
        );

    $: userId = currentDashboard?.user_id;

    $: if (pastedDashboard) {
        dashboards = [...dashboards, pastedDashboard];
    }

    // $: {
    // 	dashboards = $storeDashboards.filter((item) => item.module_id === trocModule?.module_id)
    // 	currentDashboard = { ...dashboards[0] }
    // }

    let popupRemoveModal = false;
    let selectedDashboardId: number;

    function handleNewDashboard(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        const dashboardId = new Date().getTime();
        const tab = {
            dashboard_id: dashboardId,
            description: "New tab",
            attributes: {
                icon: "mdi:tab",
                color: ""
            },
            module_id: trocModule.module
        };
        $storeDashboards = [...$storeDashboards, tab];
    }

    const showRemoveIcon = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.children.length === 0) return;
        const icon = target.children[0].children[1];
        if (icon) icon.classList.remove("invisible");
    };

    const hideRemoveIcon = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const icon = target.children[0].children[1];
        const menu = target.children[0].children[2];
        if (icon && !menu) icon.classList.add("invisible");
    };

    const handleDashboardSettings = (event: any, dashboard: any) => {
        $hideDashboardSettings = false;
        $selectedDashboard = dashboard;
    };
    const handleDashboardRemove = (dashboardId: number) => {
        selectedDashboardId = dashboardId;
        popupRemoveModal = true;
    };
    const handleRemoveConfirm = () => {
        dashboards = dashboards.filter((d: any) => d.dashboard_id !== selectedDashboardId);
        $storeDashboards = dashboards;
    };

    const confirmCustomize = async (impersonation: boolean) => {
        try {
            const resp = await patchData(`${import.meta.env.VITE_API_URL}/api/v2/dashboards`, {
                dashboard_id: currentDashboard.dashboard_id,
                impersonation
            });
            if (resp.data && resp.data.dashboard_id) {
                currentDashboard = {...resp.data};
                dashboards = dashboards.map((item) => {
                    if (item.dashboard_id === currentDashboard.dashboard_id) {
                        return currentDashboard;
                    }
                    return item;
                });
                sendSuccessNotification(resp.message);
            } else {
                // useNotify('Could not remove widget.')
            }
        } catch (e: any) {
            sendErrorNotification(e.message);
        }
    };

    const handleCustomize = async () => {
        let impersonation = true;
        let description =
            "Are you sure that you want to customizable this dashboard?\nThis action cannot be undone.";

        if (currentDashboard.user_id) {
            impersonation = false;
            description =
                "Are you sure that you want to publish this dashboard?\nThis action cannot be undone.";
        }

        openConfirmModal({
            title: "",
            description,
            type: "warning",
            confirmCallback: () => confirmCustomize(impersonation)
        });
    };

    const handleConvertToModule = async () => {
        openModal("Convert To Module", "ConvertToModule", {
            modules: $page.data.menu,
            dashboard: currentDashboard
        });
    };

    const handleDashboardCopy = (behavior: string) => {
        storeCCPDashboard.set(currentDashboard);
        storeCCPDashboardBehavior.set(behavior);
        addDashboardCopyAlert();
        dropdownOpen = false;
    };

    const handleDashboardPaste = async () => {
        // 1. Get dashboard from session storage
        let copiedDashboard: any = $storeCCPDashboard;
        // TODO if widget does not exist, a modal should appear telling the user nothing was copied
        if (!copiedDashboard) return;
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
            pastedDashboard = copiedDashboard;
            clearCopyDashboard();

            await getApiData(`${baseUrl}/api/v2/dashboard/clone`, "POST", payload).then((d) => {
                // 4.2 Insert the widget into widgets store
                clearCopyDashboard();
                $storeDashboards.push(d.data);
                console.log($storeDashboards);
            });
        } catch (e: any) {
            console.log(`There was an error: ${e.message}`);
        }
        if ($storeCCPDashboardBehavior === "cut") {
            await getApiData(`${baseUrl}/api/v2/dashboards/${currentDashboard.uid}`, "DELETE");
        }
    };

    const clearCopyDashboard = () => {
        storeCCPDashboard.set(null);
        storeCCPDashboardBehavior.set(null);
    };

    const addDashboardCopyAlert = () => {
        const behavior = $storeCCPDashboardBehavior;
        const alert: AlertMessage = {
            id: "top-dashboard-copied",
            title: `Dashboard ${behavior === "copy" ? "copied" : "cut"}`,
            message: `You have a dashboard ${
                behavior === "copy" ? "copied" : "cut"
            } in clipboard. Use Paste Dashboard button to paste it`,
            type: AlertType.INFO,
            callback1Btn: "Paste Dashboard",
            callback1: handleDashboardPaste,
            callback2Btn: "Clear",
            callback2: clearCopyDashboard
        };
        sendAlert(alert);
    };

    $: if ($storeCCPDashboard) addDashboardCopyAlert();




    // let displayModal: boolean
    //
    //  const getWidgetTemplates = async () => {
    //     displayModal = true;
    //
    //     try {
    //         // Extract program id
    //         const {program_id} = currentDashboard
    //
    //         const token = $storeUser.token;
    //         const resp = await fetch(`https://api.dev.navigator.mobileinsight.com/api/v2/widgets-template?program_id=${program_id}`,
    //
    //             {
    //                 method: "GET",
    //                 headers: {
    //                     "Authorization": `Bearer ${token}`
    //                 }
    //             }
    //         );
    //
    //         if (!resp.ok) {
    //             const errorMessage = `Failed to fetch data: ${resp.status} - ${resp.statusText}`;
    //             throw new Error(errorMessage);
    //         }
    //
    //
    //         const data = await resp.json();
    //         console.log(data);
    //
    //
    //
    //         return data;
    //     } catch (error) {
    //         console.error("An error occurred:", error.message);
    //         // Handle the error as needed, e.g., display an error message or log it.
    //     }
    // };
    //
    //     const handleWidgetInsert = async (widgetUid: string) => {
    //     const token = $storeUser.token
    //
    //     try {
    //         const payload = {widget_name: 'New widget'}
    //         // const resp = await fetch(`https://api.dev.navigator.mobileinsight.com/api/v2/widgets-template/${widgetUid}`,
    //         const resp = await fetch(`https://api.dev.navigator.mobileinsight.com/api/v2/widgets-template/b13b619a-847e-4734-a3d2-fa198f0531b7`,
    //             {
    //                 method: "PATCH",
    //                 headers: {
    //                     "Authorization": `Bearer ${token}`,
    //                     "Content-Type": "application/json",
    //                 },
    //               body: JSON.stringify(payload)
    //             }
    //         )
    //
    //         if (!resp.ok) {
    //             const errorMessage = `Failed to fetch data: ${resp.status} - ${resp.statusText}`;
    //             throw new Error(errorMessage);
    //         }
    //         const widget = await resp.json();
    //
    //         const newItem = structuredClone(widget)
    //         const position = addNewItem(newItem, gridController);
    //         newItem.data = widget;
    //         newItem.x = position.x;
    //         newItem.y = position.y;
    //
    //        gridItems = pasteItem(newItem, gridItems);
    //
    //
    //
    //
    //
    //
    //
    //         console.log(widget)
    //         displayModal = false
    //         return widget;
    //     } catch (error) {
    //         console.error("An error occurred:", error.message);
    //         // Handle the error as needed, e.g., display an error message or log it.
    //     }
    //
    // };





</script>

<Alerts position="top"/>


<!--{#if (displayModal)}-->
<!--    {#await getWidgetTemplates()}-->
<!--        <Spinner fullScreen={false}/>-->

<!--    {:then widgets}-->

<!--        <Modal bind:open={displayModal}>-->


<!--<div class="mt-12 text-primary">-->
<!--            <P size={"3xl"}>All Widgets</P>-->
<!--</div>-->
<!--            <ul class="my-4 space-y-3">-->
<!--                {#each widgets as widget}-->
<!--                    <div-->
<!--                       class="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">-->
<!--                        <button class="flex-1 ml-3 whitespace-nowrap text-primary" on:click={() => handleWidgetInsert(widget.uid)} >{widget.widget_name}</button>-->
<!--                    </div>-->
<!--                {/each}-->
<!--            </ul>-->

<!--        </Modal>-->


<!--    {/await}-->

<!--{/if}-->








<Tabs style="pill" contentClass="p-0 mt-2">
    <div class="card ml-[5px] mr-[10px] w-full p-1">
        <div class="nav-scroll gap-1 overflow-visible font-bold text-heading">
            {#if dashboards}
                {#each dashboards as dashboard}
                    <TabItem
                            open={dashboard.dashboard_id === currentDashboard.dashboard_id}
                            on:mouseover={showRemoveIcon}
                            on:mouseleave={hideRemoveIcon}
                            defaultClass="hover:nav-hover"
                            on:click={() => (currentDashboard = { ...dashboard })}
                    >
                        <div slot="title" class="flex flex-row items-center gap-2">
                            <Icon icon={dashboard.attributes.icon} size="20px"/>
                            <p title={dashboard?.dashboard_id}>
                                {dashboard.name}
                            </p>
                            <div
                                    class:hidden={currentDashboard.dashboard_id !== dashboard.dashboard_id}
                                    class="flex items-center"
                            >
                                <Icon
                                        icon="tabler:chevron-down"
                                        size="20px"
                                        on:click={() => (dropdownOpen = !dropdownOpen)}
                                />
                                <Dropdown bind:open={dropdownOpen} id={dashboard.dashboard_id.toString()}>
                                    <!-- <DropdownItem
                                        on:click={($event) => handleDashboardSettings($event, dashboard)}
                                        defaultClass="flex flex-row font-medium py-2 pl-2 pr-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                                    >
                                        <Icon icon="tabler:settings" size="18" classes="mr-1" />
                                        Settings</DropdownItem
                                    > -->

                                    <DropdownItem

                                            defaultClass="flex flex-row font-medium py-2 pl-2 pr-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                                    >
                                        <Icon icon="zondicons:add-outline" size="18" classes="mr-1"/>
                                        Insert Widget
                                    </DropdownItem
                                    >


                                    <DropdownItem
                                            on:click={() => handleDashboardCopy('copy')}
                                            defaultClass="flex flex-row font-medium py-2 pl-2 pr-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                                    >
                                        <Icon icon="mdi:content-copy" size="18" classes="mr-1"/>
                                        Copy dashboard
                                    </DropdownItem
                                    >
                                    <DropdownItem
                                            on:click={() => handleDashboardCopy('cut')}
                                            defaultClass="flex flex-row font-medium py-2 pl-2 pr-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                                    >
                                        <Icon icon="mdi:content-cut" size="18" classes="mr-1"/>
                                        Cut dashboard
                                    </DropdownItem
                                    >
                                    <!-- {#if user!.superuser && currentDashboard.is_system} -->
                                    <DropdownItem
                                            on:click={handleCustomize}
                                            defaultClass="flex flex-row font-medium py-2 pl-2 pr-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                                    >
                                        <Icon
                                                icon={!userId ? 'mdi:file-edit-outline' : 'mdi:publish'}
                                                size="18"
                                                classes="mr-1"
                                        />
                                        {!userId ? 'Customize' : 'Publish'}</DropdownItem
                                    >
                                    <!-- {/if} -->
                                    <DropdownItem
                                            on:click={handleConvertToModule}
                                            defaultClass="flex flex-row font-medium py-2 pl-2 pr-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                                    >
                                        <Icon icon="fluent:convert-range-20-regular" size="18" classes="mr-1"/>
                                        Convert to Module
                                    </DropdownItem
                                    >
                                    <DropdownItem
                                            on:click={() => handleDashboardRemove(dashboard.dashboard_id)}
                                            defaultClass="flex flex-row text-red-500 font-medium py-2 pl-2 pr-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                                    >
                                        <Icon icon="tabler:trash" size="18" classes="mr-1"/>
                                        Remove
                                    </DropdownItem
                                    >
                                </Dropdown>
                            </div>
                        </div>
                        <Dashboard {dashboard}/>
                    </TabItem>
                {/each}
            {/if}
            <TabItem on:click={handleNewDashboard} open={!dashboards}>
                <div slot="title" class="flex items-center gap-2">
                    <Icon icon="gala:add" size="20px"/>
                    New tab
                </div>
                <div>
                    <Alerts/>
                </div>
            </TabItem>
        </div>
    </div>
</Tabs>

<Modal bind:open={popupRemoveModal} size="xs" autoclose>
    <div class="text-center">
        <Icon
                icon="line-md:alert-circle"
                size="70px"
                classes="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"
        />
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this dashboard?
        </h3>
        <Button color="red" class="mr-2" on:click={handleRemoveConfirm}>Yes, I'm sure</Button>
        <Button color="alternative">No, cancel</Button>
    </div>
</Modal>
