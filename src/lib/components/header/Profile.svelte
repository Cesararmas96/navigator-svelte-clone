<script lang="ts">
    import {Avatar, Dropdown, DropdownItem} from "flowbite-svelte";
    import {goto} from "$app/navigation";
    import type {User} from "../../../interfaces/session";
    import {handleAuthorization, handleLogout} from "$lib/helpers/auth/session";


    const sessionPromise: Promise<User> = handleAuthorization();


</script>

<Avatar
        src="/images/troc.png"
        class="avatarProfile dark:bg-gray-0 bg-white/0 hover:bg-white/10 dark:hover:bg-gray-600"
        rounded
        border={false}
        size={'sm'}
/>
{#await sessionPromise then session}
    <Dropdown triggeredBy=".avatarProfile" containerClass="">
        <div slot="header" class="px-4 py-2">
            <span class="block text-sm text-gray-900 dark:text-white"> {session.session.first_name} {session?.session.last_name}</span>
            <span class="block truncate text-sm font-medium"> {session.session.email} </span>
        </div>
        <DropdownItem>Dashboard</DropdownItem>
        <DropdownItem>Settings</DropdownItem>
        <DropdownItem>Earnings</DropdownItem>
        <DropdownItem slot="footer" on:click={handleLogout}>Sign out</DropdownItem>
    </Dropdown>
{/await}
