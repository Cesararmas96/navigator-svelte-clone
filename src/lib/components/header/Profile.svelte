<script lang="ts">
	import { Avatar, Dropdown, DropdownItem } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { enhance } from '$app/forms'
	import { storeUser } from '$lib/stores'

	const handleLogout = () => {}
</script>

<Avatar
	src="/images/troc.png"
	class="avatarProfile dark:bg-gray-0 cursor-pointer bg-white/0 hover:bg-white/10 dark:hover:bg-gray-600"
	rounded
	border={false}
	size={'sm'}
/>

<Dropdown triggeredBy=".avatarProfile" containerClass="min-w-[150px]">
	<div>
		<DropdownItem>
			<a href="/profile">
				<div class="mx-2 flex cursor-pointer flex-row items-center">
					<Icon icon="line-md:account" size="20px" classes="mr-3" />
					Profile
				</div>
			</a>
		</DropdownItem>
		{#if !$storeUser.next}
			<DropdownItem>
				<a href="/admin">
					<div class="mx-2 flex cursor-pointer flex-row items-center">
						<Icon icon="line-md:clipboard-check" size="20px" classes="mr-3" />
						Admin
					</div>
				</a>
			</DropdownItem>
		{/if}
		<DropdownItem slot="footer">
			<form action="/logout" method="POST" use:enhance>
				<button type="submit" class="mx-2 flex cursor-pointer flex-row items-center">
					<Icon icon="line-md:arrow-align-left" size="20px" classes="mr-3" />
					Log Out
				</button>
			</form>
		</DropdownItem>
	</div>
</Dropdown>
