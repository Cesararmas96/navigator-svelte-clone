<script lang="ts">
    import {Avatar, Dropdown, DropdownItem} from "flowbite-svelte";
    import {goto} from "$app/navigation";
    import type {User} from "../../../interfaces/session";
    import {getSession, handleLogout} from "$lib/helpers/auth/session";
    import Icon from "$lib/components/common/Icon.svelte";


    const sessionPromise: Promise<User> = getSession();


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

        <div>
            <DropdownItem>
                <div class="flex">

                    <Icon icon="iconamoon:profile" size="20px"/>
                    <a href="/profile" class="mx-2">
                        Profile

                    </a>
                </div>
            </DropdownItem>
        </div>
        <DropdownItem>Dashboard</DropdownItem>
        <DropdownItem>Settings</DropdownItem>
        <!--        <DropdownItem>Earnings</DropdownItem>-->
        <DropdownItem slot="footer" on:click={handleLogout}>Sign out</DropdownItem>
    </Dropdown>
{/await}
