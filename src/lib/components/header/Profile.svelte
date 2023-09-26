<script lang="ts">
    import {Avatar, Dropdown, DropdownItem} from "flowbite-svelte";
    import {goto} from "$app/navigation";


    interface User {
        created: number;
        expires_in: string;
        id: string;
        last_visit: number;
        last_visited: string;
        session: {
            associate_id?: null | number;
            domain: string;
            email: string;
            enabled: boolean;
            first_name: string;
            group_id: number[];
            groups: string[];
            last_login: string;
            last_name: string;
            programs: string[];
            superuser: boolean;
            title?: string;
            user: string;
            user_id: number;
            username: string;

        };
        token: string;
        token_type: string;
        username: string;
    }


    export function handleLogout() {
        sessionStorage.clear();
        goto("/login");
    }


    const rawSession = sessionStorage.getItem("session");

    const session: User = JSON.parse(rawSession);


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
        <span class="block text-sm text-gray-900 dark:text-white"> {session.session.first_name} {session?.session.last_name}</span>
        <span class="block truncate text-sm font-medium"> {session.session.email} </span>
    </div>
    <DropdownItem>Dashboard</DropdownItem>
    <DropdownItem>Settings</DropdownItem>
    <DropdownItem>Earnings</DropdownItem>
    <DropdownItem slot="footer" on:click={handleLogout}>Sign out</DropdownItem>
</Dropdown>

