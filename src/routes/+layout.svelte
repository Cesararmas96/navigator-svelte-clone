<script>
    import '../app.scss'
    import '../app.postcss'
    import 'iconify-icon'
    import 'simplebar'
    import 'simplebar/dist/simplebar.min.css'
    import Toasts from '$lib/components/common/Toasts.svelte'
    import Modal from '$lib/components/common/Modal.svelte'
    import {initModal} from '$lib/helpers/common/modal'
    import WidgetSettings from '$lib/components/widgets/Settings.svelte'
    import {isAuthenticated} from "$lib/stores/";
    import {goto} from "$app/navigation";
    import {onMount} from "svelte";
    import {validateUser} from "$lib/helpers/auth/session.ts";

    initModal()

    const handleAuthentication = async () => {

        const rawSession = sessionStorage.getItem('session')
        const user = JSON.parse(rawSession)

        const validatedUser = validateUser(user)


        if (!validatedUser) goto('/login')
    }


</script>


{#await handleAuthentication() then auth}
    <slot/>
    <Toasts/>
    <Modal/>
    <WidgetSettings/>

{/await}


