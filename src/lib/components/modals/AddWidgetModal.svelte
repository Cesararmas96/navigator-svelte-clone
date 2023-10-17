<script lang="ts">


    import {storeUser} from "$lib/stores";
    import {P} from "flowbite-svelte";
    import Spinner from "$lib/components/common/Spinner.svelte";
    import {addNewItem, pasteItem} from "$lib/helpers/dashboard/grid";
    import Icon from "$lib/components/common/Icon.svelte";


    export let props;


    const baseUrl = import.meta.env.VITE_API_URL

    const getTemplateIcon = async (widget) => {
        let rawIcon = widget.attributes && widget.attributes.icon;
        if (rawIcon.includes(" ")) {
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
            console.log(data);

            return data;
        } catch (error) {
            console.error("An error occurred:", error.message);
            // Handle the error as needed, e.g., display an error message or log it.
        }
    };


</script>


{#await getWidgetTemplates()}
    <Spinner fullScreen={false}/>

{:then widgets}
    <ul class="my-4 space-y-3">
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
                            on:click={() => props.handleWidgetInsert(widget.uid)}>{widget.title}</button>

                </div>
            {/if}
        {/each}
    </ul>

{/await}
