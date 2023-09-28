<script>

    import {handleAuthorization} from "$lib/helpers/auth/session";
    import {goto} from "$app/navigation";
    import {Card} from "flowbite-svelte";


    let rawSession

    try {
        rawSession = handleAuthorization()
    } catch (e) {
        goto('/login')
    }
    console.log(rawSession)


</script>


{#await rawSession then session}
    <img src="/images/troc.gif" alt="troc logo" class="flex mr-auto ml-auto mb-3.5">
    <Card class="flex ml-auto mr-auto">
        <h6 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">First name</h6>
        <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">{session.session.first_name}</p>

        <h6 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">Last name</h6>
        <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">{session.session.last_name}</p>


        <h6 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">Email</h6>
        <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">{session.session.email}</p>


        <h6 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">Groups</h6>
        <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">{session.session.groups}</p>

        <h6 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">User</h6>
        <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">{session.session.user}</p>


        <h6 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">Programs assigned</h6>


        {#each session.session.programs as program}

            <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">{program}</p>

        {/each}

    </Card>


{/await}
