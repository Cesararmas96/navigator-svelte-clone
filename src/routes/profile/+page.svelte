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
    <div style={"display: flex; flex-direction: row"}>
        <Profile session={session}/>

        <Tabs>
            <TabItem>


                <div slot="title" class="items-center gap-2 flex">
                    <Icon icon="mdi:user" size="20px"/>
                    Identities
                </div>
                <p>
                    <b>Profile:</b>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et
                    dolore magna aliqua.
                </p>
            </TabItem>
            <TabItem>

                <div slot="title" class="flex items-center gap-2">
                    <Icon icon="mdi:world" size="20px"/>
                    Accounts
                </div>


                <p class="text-sm text-gray-500 dark:text-gray-400">
                    <b>Settings:</b>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et
                    dolore magna aliqua.
                </p>
            </TabItem>


            <TabItem open>

                <div slot="title" class="flex items-center gap-2">
                    <Icon icon="mdi:lock" size="20px"/>
                    Security
                </div>


                <div id="content">
                    <!--                    <div class="p-5" data-simplebar>-->
                    <!--                        <div class="mx-auto max-sm">-->
                    <div class="card mb-5 p-5 max-w-sm flex">
                        <p class="pb-1">Current password</p>
                        <input type="password" class="form-control mb-6 " placeholder="Password"/>

                    </div>

                    <div class="card mb-5 p-5 max-w-8xl mb-10">

                        <p class="pb-1 px-3">New password</p>
                        <input style="min-width: 2000px" type="password" name="password" bind:value={password}/>
                        <PasswordStrength {password}/>


                        <p class="pb-1 px-3 pt-3">Confirm new password</p>
                        <input type="password" class="form-control mb-6" placeholder="Password"/>

                    </div>


                    <!--                        </div>-->
                    <!--                    </div>-->
                </div>


            </TabItem>
        </Tabs>
    </div>
{/await}
