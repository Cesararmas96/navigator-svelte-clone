<script>
    import Icon from "$lib/components/common/Icon.svelte";

    export let session

</script>

<div class="px-5" style="max-width: 400px">

    <div class="card max-w-md text-center mx-3 " style="min-height: 200px">
        <div>

            <h5 class="text-xl" style="font-size: 50px ;margin-top: 60px">
                {session.session.first_name[0] + session.session.last_name[0]}
            </h5>
        </div>
    </div>

    <div class="px-5">

        <div class="flex items-center font-bold text-heading mx-3 mt-2" style="font-size: 22px">
            {session.session.first_name} {session.session.last_name}

            <i class="ml-auto h-2 w-2 rounded-full bg-green-500"></i>
        </div>

        <div class="mb-3 text-sm text-muted mx-3">{session.username}</div>


        <div class="flex py-1.5  mx-1">
            <Icon icon="ic:outline-email" size="20px"/>
            <p class="pl-1.5">{session.session.email}</p>
        </div>

        <div class="flex py-1.5  mx-1">
            <Icon icon="clarity:group-solid" size="20px"/>
            <p class="pl-1.5">{session.session.groups[0].charAt(0).toUpperCase()}{session.session.groups[0].slice(1)}</p>
        </div>


        {#if session.session.enabled}
            <div class="flex py-1.5  mx-1">
                <Icon icon="fluent:person-available-16-regular" size="20px"/>
                <p class="pl-1.5">Enabled</p>
            </div>

        {:else}
            <div class="flex py-1.5  mx-1">
                <Icon icon="mingcute:user-x-fill" size="20px"/>
                <p class="pl-1.5">Disabled</p>
            </div>

        {/if}


    </div>
</div>
