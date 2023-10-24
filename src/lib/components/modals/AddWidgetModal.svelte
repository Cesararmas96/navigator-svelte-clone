<script lang="ts">


    import {storeUser} from "$lib/stores";
    import {Button, Listgroup, P, TabItem} from "flowbite-svelte";
    import Spinner from "$lib/components/common/Spinner.svelte";
    import {addNewItem, pasteItem} from "$lib/helpers/dashboard/grid";
    import Icon from "$lib/components/common/Icon.svelte";


    export let props;


    const baseUrl = import.meta.env.VITE_API_URL;

    const getTemplateIcon = async (widget) => {
        let rawIcon = widget.attributes && widget.attributes.icon;
        if (rawIcon?.includes(" ")) {
            rawIcon = rawIcon.split(" ")[1];

        }
        return rawIcon;
    };


    const getWidgetTemplates = async () => {


        try {
            // Extract program id
            const {program_id} = props.dashboard;

            const token = $storeUser.token;
            const resp = await fetch(`${baseUrl}/api/v2/widgets-template?program_id=${program_id}`,

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


            return data;
        } catch (error) {
            console.error("An error occurred:", error.message);
            // Handle the error as needed, e.g., display an error message or log it.
        }
    };


    let widgetTypes;
    const getWidgetCategory = async (data) => {

        const uniqueWidgetTypeIds = new Set();

        data.forEach(item => {
            if (item.widget_type_id.includes("api-")) {
                item.widget_type_id = item.widget_type_id.replace("api-", "");
            }
            if (item.widget_type_id.includes("-")) {
                item.widget_type_id = item.widget_type_id.replaceAll("-", " ");
            }

            item.widget_type_id = item.widget_type_id
                .split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");


            uniqueWidgetTypeIds.add(item.widget_type_id);
        });

        const widgetTypes = [...uniqueWidgetTypeIds].sort();

        return widgetTypes;

    };


    let selectedCategoryWidgets;
    const handleCategorySearch = async (category, widgets) => {

        selectedCategoryWidgets = widgets.filter((widget) => widget.widget_type_id === category);

        return selectedCategoryWidgets;
    };


</script>


{#await getWidgetTemplates()}
    <Spinner fullScreen={false}/>

{:then widgets}


    <div class="flex space-x-4">
        <ul class="my-4 space-y-3">


            {#await getWidgetCategory(widgets) then categories}


                <Listgroup active items={categories} let:item class="w-48" on:click={console.log}>

                    <div on:click={() => handleCategorySearch(item, widgets)}
                         class="flex flex-row items-center p-3 text-base font-bold text-gray">

                        {item}
                    </div>
                </Listgroup>
            {/await}

        </ul>
        <ul class="my-4 space-y-3">

            {#if selectedCategoryWidgets}
                {#each selectedCategoryWidgets as widget}
                    {#if (widget.title)}
                        <div
                                class="flex flex-row items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                            {#await getTemplateIcon(widget) then icon}
                            <span style="color:{widget.attributes.fg_color}">
                            <Icon icon={icon} size="25px"/>
                            </span>
                            {/await}
                            <button class="flex-1 ml-3 flex-wrap"
                                    on:click={() => props.handleWidgetInsert(widget.uid, widget.widget_id)}>{widget.title}</button>

                        </div>
                    {/if}
                {/each}

            {:else }
                {#each widgets as widget}
                    {#if (widget.title)}
                        <div
                                class="flex flex-row items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                            {#await getTemplateIcon(widget) then icon}
                            <span style="color:{widget.attributes.fg_color}">
                            <Icon icon={icon} size="25px"/>
                            </span>
                            {/await}
                            <button class="flex-1 ml-3 flex-wrap"
                                    on:click={() => props.handleWidgetInsert(widget.uid, widget.widget_id)}>{widget.title}</button>

                        </div>
                    {/if}
                {/each}
            {/if}

        </ul>

    </div>

{/await}
