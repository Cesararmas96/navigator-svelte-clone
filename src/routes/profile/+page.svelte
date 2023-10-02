<script>

    import {handleAuthorization} from "$lib/helpers/auth/session";
    import {goto} from "$app/navigation";

    import Icon from "$lib/components/common/Icon.svelte";

    import {TabItem, Tabs} from 'flowbite-svelte';
    import Profile from "$lib/components/profile/Profile.svelte";
    import PasswordStrength from "$lib/components/forms/PasswordStrength.svelte";


    let rawSession

    try {
        rawSession = handleAuthorization()
    } catch (e) {
        goto('/login')
    }
    console.log(rawSession)
    let password = ''

</script>


{#await rawSession then session}

    <Tabs>
        <TabItem>
            <div slot="title" class="items-center gap-2 flex">
                <Icon icon="mdi:user" size="20px"/>
                Identities
            </div>
            <div class="flex flex-row">

                <Profile session={session}/>
                <p>
                    <b>Profile:</b>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et
                    dolore magna aliqua.
                </p>
            </div>
        </TabItem>
        <TabItem>

            <div slot="title" class="flex items-center gap-2">
                <Icon icon="mdi:world" size="20px"/>
                Accounts
            </div>

            <div class="flex flex-row">
                <Profile session={session}/>

                <p class="text-sm text-gray-500 dark:text-gray-400">
                    <b>Settings:</b>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et
                    dolore magna aliqua.
                </p>
            </div>
        </TabItem>


        <TabItem open>

            <div slot="title" class="flex items-center gap-2">
                <Icon icon="mdi:lock" size="20px"/>
                Security
            </div>


            <div class="flex flex-row">
                <Profile session={session}/>
                <div class="flex-col">


                    <p class="w-40">Current password</p>
                    <input type="password" class="form-control mb-6 " placeholder="Password"/>


                    <p class="">New password</p>
                    <input type="password" class="form-control" name="password" bind:value={password}/>
                    <div class="mb-6">
                        <PasswordStrength {password}/>
                    </div>


                    <p>Confirm new password</p>
                    <input type="password" class="form-control mb-6" placeholder="Password"/>
                </div>

            </div>


        </TabItem>
    </Tabs>


{/await}
