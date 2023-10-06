<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import {
        DarkMode,
        Navbar,
        NavBrand,
        NavHamburger,
        Avatar,
        Dropdown,
        DropdownItem
    } from "flowbite-svelte";
    import Search from "../header/Search.svelte";

    export let modeHome: boolean = false;
    let darkmodebtn =
        "mr-6 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-lg p-1 z-50";

    const dispatch = createEventDispatcher();
    const toggleDrawer = () => {
        dispatch("handleDrawerHidden", false);
    };
</script>

<Navbar
        navClass="relative z-20 h-16 flex-shrink-0 items-center rounded-b-lg bg-theme text-white shadow-md shadow-theme/20 print:hidden"
>
    {#if !modeHome}
        <NavHamburger on:click={toggleDrawer} btnClass="lg:hidden"/>
        <NavBrand href="/home" class="lg:ml-64">
			<span
                    class="self-center whitespace-nowrap text-xl font-semibold dark:text-white lg:hidden lg:pl-10"
            >
				<img src="/images/header-logo-troc.png" alt="Navigator" width="120"/>
			</span>
        </NavBrand>
    {:else}
        <NavBrand href="/home" class="">
			<span class="ml-4 self-center whitespace-nowrap text-xl font-semibold dark:text-white">
				<img src="/images/header-logo-troc.png" alt="Navigator" width="120"/>
			</span>
        </NavBrand>
    {/if}

    <Search/>

    <div class="flex items-center md:order-2">
        <DarkMode btnClass={darkmodebtn}/>
        <Avatar
                src="/images/troc.png"
                class="avatarProfile mr-4 h-8 w-8 rounded-full bg-gray-100 p-1 text-gray-600 ring-2 ring-green-400 dark:bg-gray-600 dark:text-gray-300  dark:ring-green-400"
        />
        <Dropdown triggeredBy=".avatarProfile">
            <div slot="header" class="px-4 py-2">
                <span class="block text-sm text-gray-900 dark:text-white"> example </span>
                <span class="block truncate text-sm font-medium"> example@trocglobal.com </span>
            </div>
            <DropdownItem>{modeHome}</DropdownItem>
            <DropdownItem>Dashboard</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
            <!--			<DropdownItem>Earnings</DropdownItem>-->
            <DropdownItem slot="footer">Sign out</DropdownItem>
        </Dropdown>
    </div>
</Navbar>
