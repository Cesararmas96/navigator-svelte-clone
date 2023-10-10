<script>
    import CardWidgetTemp from "$lib/components/widgets/CardWidgetTemp.svelte";
    import LinkWidgetTemp from "$lib/components/widgets/LinkWidgetTemp.svelte";
</script>

<!--<script lang="ts">-->
<!--    import {page} from "$app/stores";-->
<!--    import Card from "$lib/components/home/Card.svelte";-->
<!--    import {programs} from "../../../data/programs";-->
<!--    import {goto} from "$app/navigation";-->
<!--    import {copyToken, pasteToken} from "$lib/helpers/auth/session";-->
<!--    import {onMount} from "svelte";-->

<!--    const allPrograms = programs.sort(function (program: any, program2: any) {-->
<!--        return program.program_name.localeCompare(program2.program_name);-->
<!--    });-->


<!--</script>-->

<!--{#if programs}-->
<!--    <ul class="grid grid-cols-2 gap-4 p-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">-->
<!--        {#each allPrograms as program}-->
<!--            <Card {program}/>-->
<!--        {/each}-->
<!--    </ul>-->
<!--{/if}-->

<LinkWidgetTemp/>
