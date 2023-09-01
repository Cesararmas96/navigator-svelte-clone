<script lang="ts">
    import {selectedWidgetMaximize} from "$lib/stores/widgets";
    import Widget from "$lib/components/widgets/Widget.svelte";
</script>

{#if $selectedWidgetMaximize?.widget}
    <div class="widget-maximize">
        <Widget widget={$selectedWidgetMaximize?.widget}/>
    </div>
{/if}

<style>
    .widget-maximize {
        z-index: 9999;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw !important;
        height: 100vh !important;
        border-radius: 0;
    }
</style>
