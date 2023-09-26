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


    const sessionEndpoint = 'https://api.dev.navigator.mobileinsight.com/api/v1/user/session'


    const handleAuthentication = async () => {
        const token = sessionStorage.getItem('token')

        if (token) {
            try {

                const rawSession = await fetch(sessionEndpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                const session = await rawSession.json()
                console.log(session)
            } catch (error) {
                sessionStorage.clear()
                goto('/login')
            }
        }
        if (!token) {
            await goto('/login')
            sessionStorage.clear()
        }

    }


</script>

{#await handleAuthentication() then auth}
    <slot/>
    <Toasts/>
    <Modal/>
    <WidgetSettings/>
{/await}
