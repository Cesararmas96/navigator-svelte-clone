<script lang="ts">
    import "../app.scss";
    import "../app.postcss";
    import "iconify-icon";
    import "simplebar";
    import "simplebar/dist/simplebar.min.css";
    import Toasts from "$lib/components/common/Toasts.svelte";
    import Modal from "$lib/components/common/Modal.svelte";
    import {initModal} from "$lib/helpers/common/modal";
    import WidgetSettings from "$lib/components/widgets/Settings.svelte";
    import {goto} from "$app/navigation";
    import {
        checkLocalStorageForTokenAndCopy,
        copyToken,
        handleAuthorization,
        pasteToken
    } from "$lib/helpers/auth/session";
    import {onMount} from "svelte";

    initModal();


    onMount(() => {

        checkLocalStorageForTokenAndCopy();

    });


</script>

{#await handleAuthorization() then _}
    <div on:pointerleave={copyToken} on:focus={pasteToken}>
        <slot/>
        <Toasts/>
        <Modal/>
        <WidgetSettings/>
    </div>
{/await}
