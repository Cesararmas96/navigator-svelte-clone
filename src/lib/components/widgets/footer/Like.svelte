<script>
    import Icon from '$lib/components/common/Icon.svelte'
    import {getApiData, getData} from "$lib/services/getData";

    let icon

    const urlBase = import.meta.env.VITE_API_URL;
    const endpoint = `${urlBase}/api/v1/interactions/likes`;

    $: isLiked = false
    $: icon = isLiked ? 'twemoji:red-heart' : 'icon-park-outline:like'


    let objectUuid = "5a833d56-8e00-4f91-9a47-03c25067d338"
    let objectType = 'widget'

    async function toggleLike() {
        try {
            isLiked = !isLiked;
            icon = isLiked ? 'twemoji:red-heart' : 'icon-park-outline:like';

            const method = isLiked ? "PUT" : "DELETE";
            const response = await getApiData(endpoint, method, {
                object_uuid: objectUuid,
                object_type: objectType
            });
            console.log(response);
        } catch (error) {
            console.error("Error:", error.message);
        }
    }


</script>

<button
        class="icon btn hover:bg-light-100 dark:hover:bg-dark-200"
        on:click={toggleLike}
>
    <Icon icon={icon} size="18"/>
</button>
