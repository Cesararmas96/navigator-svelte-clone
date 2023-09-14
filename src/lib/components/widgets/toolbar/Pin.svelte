<script lang="ts">
    import {Tooltip} from "flowbite-svelte";
    import Icon from "$lib/components/common/Icon.svelte";
    import {getData} from "$lib/services/getData";

    $: isPinned = false;
    let widgetId = 18724;
    let userId = 35;

    let icon;

    const urlBase = import.meta.env.VITE_API_URL;
    const endpoint = `${urlBase}/api/v1/interactions/pin`;

    $: icon = isPinned ? "tabler:pinned-off" : "tabler:pinned";

    async function togglePin() {
        try {
            isPinned = !isPinned;
            icon = isPinned ? "tabler:pinned" : "tabler:pinned-off";

            
            const method = isPinned ? "DELETE" : "PUT";
            const response = await getData(endpoint, method, {
                widget_id: widgetId,
                user_id: userId,
            });
            console.log(response);
        } catch (error: any) {
            console.error("Error:", error.message);
        }
    }
</script>

<button
        class="icon btn hover:bg-light-100 dark:hover:bg-dark-200"
        on:click={togglePin}
>
    <Icon {icon} size="18"/>
</button>
<Tooltip placement="left">{isPinned ? 'Remove pin' : 'Pin'}</Tooltip>
