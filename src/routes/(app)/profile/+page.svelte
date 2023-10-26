<script lang="ts">
	import { storeUser } from '$lib/stores'
	import Icon from '$lib/components/common/Icon.svelte'
	import { TabItem, Tabs } from 'flowbite-svelte'
	import Profile from '$lib/components/profile/Profile.svelte'
	import PasswordStrength from '$lib/components/forms/PasswordStrength.svelte'
	import PasswordInput from '$lib/components/forms/PasswordInput.svelte'

	export let data: any

	const session = data.user ? data.user : $storeUser

	let password = ''
</script>

<Tabs>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			<Icon icon="mdi:user" size="20px" />
			Identities
		</div>
		<div class="flex flex-row">
			<Profile {session} />
			<p>
				<b>Profile:</b>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua.
			</p>
		</div>
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			<Icon icon="mdi:world" size="20px" />
			Accounts
		</div>

		<div class="flex flex-row">
			<Profile {session} />

			<p class="text-sm text-gray-500 dark:text-gray-400">
				<b>Settings:</b>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua.
			</p>
		</div>
	</TabItem>

	<TabItem open>
		<div slot="title" class="flex items-center gap-2">
			<Icon icon="mdi:lock" size="20px" />
			Security
		</div>
		<div class="flex flex-row">
			<Profile {session} />
			<div class="ml-10 flex-col">
				<div class="mb-6">
					<p>Current password</p>
					<PasswordInput />
				</div>

				<p class="">New password</p>

				<div class="mb-6">
					<PasswordInput />
					<PasswordStrength {password} />
				</div>

				<p>Confirm new password</p>
				<PasswordInput />
			</div>
		</div>
	</TabItem>
</Tabs>
