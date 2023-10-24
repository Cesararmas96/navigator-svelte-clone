<script lang="ts">
	import { Avatar, Dropdown, DropdownItem } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { enhance } from '$app/forms'

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
			<div class="flex cursor-pointer flex-row items-center">
				<Icon icon="line-md:account" size="20px" />
				<a href="/profile" class="mx-2"> Profile </a>
			</div>
		</DropdownItem>
		<DropdownItem>
			<div class="flex cursor-pointer flex-row items-center">
				<Icon icon="line-md:clipboard-check" size="20px" />
				<a href="/admin" class="mx-2"> Admin </a>
			</div>
		</DropdownItem>
		<DropdownItem slot="footer">
			<div class="flex cursor-pointer">
				<form action="/logout" method="POST" use:enhance>
					<button type="submit" class="flex flex-row items-center">
						<Icon icon="line-md:arrow-align-left" size="20px" />
						<span class="mx-2">Log Out</span>
					</button>
				</form>
			</div>
		</DropdownItem>
	</div>
</Dropdown>
