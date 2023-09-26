<script>
    import {Avatar, Dropdown, DropdownItem} from 'flowbite-svelte'
    import {goto} from "$app/navigation";


    export function handleLogout() {
        sessionStorage.removeItem('token')
        goto('/login')
    }


</script>

<Avatar
        src="/images/troc.png"
        class="avatarProfile dark:bg-gray-0 bg-white/0 hover:bg-white/10 dark:hover:bg-gray-600"
        rounded
        border={false}
        size={'sm'}
/>
<Dropdown triggeredBy=".avatarProfile" containerClass="">
    <div slot="header" class="px-4 py-2">
        <span class="block text-sm text-gray-900 dark:text-white"> Name Lastname </span>
        <span class="block truncate text-sm font-medium"> example@trocglobal.com </span>
    </div>
    <DropdownItem>Dashboard</DropdownItem>
    <DropdownItem>Settings</DropdownItem>
    <DropdownItem>Earnings</DropdownItem>
    <DropdownItem slot="footer" on:click={handleLogout}>Sign out</DropdownItem>
</Dropdown>
