<script lang="ts">
    import Card from "$lib/components/home/Card.svelte";
    import {storePrograms} from "$lib/stores/programs";
    import {storeUser} from "$lib/stores/session.js";
    import {goto} from "$app/navigation";
    import Spinner from "$lib/components/common/Spinner.svelte";
    import {filterPrograms, sortPrograms} from "$lib/helpers/programs";

    export let data;
    $storePrograms = data.programs;
    $storeUser = data.user;



const allowedPrograms = sortPrograms(filterPrograms(data.programs, $storeUser.programs));

// If there is only one program, redirect to it
allowedPrograms.length === 1 && goto(`/${allowedPrograms[0].program_slug}`);

</script>


{#if allowedPrograms.length === 1}
    <Spinner fullScreen={false}/>


{:else if allowedPrograms}
    <ul class="grid grid-cols-2 gap-4 p-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {#each allowedPrograms as program}
            <Card {program}/>
        {/each}
    </ul>
{/if}
