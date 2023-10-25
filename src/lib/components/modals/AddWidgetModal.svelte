<script lang="ts">
    import {storeUser} from "$lib/stores";
    import Spinner from "$lib/components/common/Spinner.svelte";
    import Icon from "$lib/components/common/Icon.svelte";
    import Help from "$lib/components/widgets/toolbar/Help.svelte";
    import {Popover} from "flowbite-svelte";
    import {fade, slide} from "svelte/transition";


    export let props;


    const baseUrl = import.meta.env.VITE_API_URL;

    const getTemplateIcon = async (template) => {
        let rawIcon = template.attributes && template.attributes.icon;
        if (rawIcon?.includes(" ")) {
            rawIcon = rawIcon.split(" ")[1];

        }
        return rawIcon;
    };


    const fetchWidgetTemplates = async () => {

        try {
            // Extract program id
            const {program_id} = props.currentDashboard;

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
    const getWidgetCategories = async (templates) => {

        const uniqueIds = new Set();

        templates.forEach(item => {
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


            uniqueIds.add(item.widget_type_id);
        });

        const categories = [...uniqueIds].sort();

        console.log(categories);

        return categories;

    };


    let filteredTemplates;
    const handleCategorySearch = async (category, templates) => {

        filteredTemplates = templates.filter((widget) => widget.widget_type_id === category);

        return filteredTemplates;
    };


</script>


{#await fetchWidgetTemplates()}
    <Spinner fullScreen={false}/>

{:then widgets}


    <div class="flex space-x-4">
        <ul class="my-4 space-y-3">


            {#await getWidgetCategories(widgets) then categories}

                <div
                        class="flex flex-row items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                    <a href="#" class="flex-1 ml-3 flex-wrap btn" on:click={() => {filteredTemplates = null}}>
                        All
                    </a>

                </div>
                {#each categories as category}

                    <div
                            class="flex flex-row items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">


                        <a href="#" class="flex-1 ml-3 flex-wrap btn min-w-max"
                           on:click={() => handleCategorySearch(category, widgets)}>
                            {category}
                            <a/>


                    </div>


                {/each}
            {/await}

        </ul>
        <ul class="my-4 space-y-3">

            {#if filteredTemplates}
                {#each filteredTemplates as widget}
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
                            <button class="flex-1 ml-3 flex-wrap" id="template-button"
                                    on:click={() => props.handleWidgetInsert(widget.uid, widget.widget_id)}>{widget.title}</button>

                                <Popover class="w-64 text-sm font-light " placement="top"
                                       transition={fade} params={{ duration: 200 }}>
                            {#if widget.description}
                                    {widget.description}
                            {:else}
                                {widget.title}
                            {/if}
                                </Popover>

                        </div>
                    {/if}
                {/each}
            {/if}

        </ul>

    </div>

{/await}
