<script lang="ts">
	import { Button, Input, Label, P, Tooltip } from 'flowbite-svelte'
	import { enhance } from '$app/forms'
	import type { ActionData } from './$types'
	import Carousel from '$lib/components/common/Carousel.svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { page } from '$app/stores'
	import { errorCodes } from '$lib/helpers/auth/error-codes'

	export let data
	const { filteredObject, images } = data

	export let form: ActionData

	const apiUrl = import.meta.env.VITE_API_URL

	const redirecURI = `${$page.url.origin}/login/callback`

	let showPassword: boolean = false

	let year = new Date().getFullYear()

	const keyDownEnter = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			document.getElementById('form')?.dispatchEvent(new Event('submit'))
		}
	}

	const authMethods = {
		AzureAuth: {
			description: 'Sign in with Microsoft',
			external: true,
			headers: { 'x-auth-method': 'AzureAuth' },
			icon: 'images/auth/Microsoft.png',
			class: 'auth-microsoft',
			name: 'Microsoft',
			uri: '/api/v1/auth/azure/',
			url: `${apiUrl}/api/v1/auth/azure/?redirect_uri=${redirecURI}`
		},
		ADFSAuth: {
			description: 'Sign in with SSO',
			external: true,
			headers: { 'x-auth-method': 'ADFSAuth' },
			icon: 'images/auth/ADFS.png',
			class: 'auth-adfs',
			name: 'ADFSAuth',
			url: `${apiUrl}/api/v1/auth/adfs/?redirect_uri=${redirecURI}`
		}
	}
</script>

{#if images}
	<main class="h-screen">
		<div class="dark:text-white-dark text-black">
			<div class="flex bg-white">
				<div
					class="hidden w-full flex-col !justify-center text-white dark:text-black lg:!flex lg:!w-3/5"
				>
					<Carousel images={images.slideshowCarouselData} />
					<div class="absolute bottom-1 ml-2">
						<div
							class="mt-10 flex flex-col items-center justify-center text-center text-xs text-gray-500 lg:flex-row lg:justify-center"
						>
							<span class="lg:border-r lg:border-gray-400 lg:pr-1"
								>Copyright &copy; {year} Navigator by T-ROC.</span
							>
							<span class="lg:border-r lg:border-gray-400 lg:pl-1 lg:pr-1">
								All rights Reserved.
							</span>
							<span class=" pl-1"> Privacy Policy Terms and Conditions Cookies </span>
						</div>
					</div>
				</div>
				<div class="flex w-full items-center justify-center lg:!w-2/5">
					<div class=" m-2 flex w-full flex-col items-center justify-center pl-2 pr-2 sm:p-4">
						<div class="mb-5 self-start">
							<img src={images.logoClientUrl} alt="{images.client}-logo" style="max-width: 80px" />
						</div>

						<div class="text-center text-2xl font-semibold">Welcome Back</div>

						<div class="mb-8 text-center text-lg text-gray-600">
							Please select how you want to connect with us
						</div>

						<ul class="grid w-full gap-4 sm:gap-5">
							{#if filteredObject}
								{#each Object.values(filteredObject) as method}
									<li>
										<Button
											href={authMethods[method.name].url}
											weight="24"
											outline
											color={method.color}
											class="ml-auto mr-auto flex w-4/5 border text-gray-600 hover:bg-slate-100 hover:text-gray-700 {authMethods[
												method.name
											].class} border-blue-600 p-2 text-base shadow"
										>
											<img
												src={authMethods[method.name].icon}
												style="max-width: 25px"
												class="mr-2"
												alt={authMethods[method.name].name}
											/>
											{authMethods[method.name].description}
										</Button>
										<Tooltip>{authMethods[method.name].description}</Tooltip>
									</li>
								{/each}
							{/if}
						</ul>

						<div class="mt-6 flex w-4/5 items-center justify-center">
							<div class="h-px flex-grow bg-gray-400 opacity-20" />
							<span class="flex-shrik px-4 text-gray-600">Or Continue With</span>
							<div class="h-px flex-grow bg-gray-400 opacity-20" />
						</div>

						<form
							id="form"
							class="mt-4 flex w-4/5 flex-col items-center"
							action="?/login"
							method="POST"
							use:enhance
						>
							<div class="w-full">
								<Label for="email" class="mb-1 font-semibold">Email</Label>
								<Input
									type="text"
									id="email"
									defaultClass="block w-full mb-4 p-2.5  !bg-gray-50 !text-gray-900 !border-gray-300 !text-base rounded"
									name="email"
									placeholder="Email@email.com"
									required
									on:keydown={keyDownEnter}
									maxlength="100"
								/>
							</div>
							<div class="w-full">
								<Label for="password" class="mb-1 font-semibold">Password</Label>
								<Input
									id="password"
									type={showPassword ? 'text' : 'password'}
									defaultClass="block w-full  !bg-gray-50 !text-gray-900 !border-gray-300 !text-base rounded"
									name="password"
									placeholder="**********"
									required
									on:keydown={keyDownEnter}
									maxlength="100"
								>
									<button
										slot="right"
										on:click|preventDefault={() => (showPassword = !showPassword)}
										class="pointer-events-auto mt-1"
									>
										{#if showPassword}
											<Icon icon="mdi:eye-outline" size="18" />
										{:else}
											<Icon icon="mdi:eye-off-outline" size="18" />
										{/if}
									</button>
								</Input>
							</div>

							<div class="mt-2 flex w-full items-center justify-between text-gray-500">
								<div class="flex items-center">
									<input
										type="checkbox"
										class="mr-2 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
										id="remember"
										value="TER"
									/>
									<label for="remember">Remember me</label>
								</div>
								<a class=" text-blue-600 hover:underline" href="/">Forgot your password?</a>
							</div>

							{#if form?.invalid}
								<p
									class="mb-2 mt-2 w-full rounded-md border bg-red-100 p-2 text-center text-red-500"
								>
									Username and password is required.
								</p>
							{/if}

							{#if form?.credentials}
								<p
									class="mb-2 mt-2 w-full rounded-md border bg-red-100 p-2 text-center text-red-500"
								>
									{@html errorCodes[form?.message?.status]
										? `${errorCodes[form?.message?.status].title}. ${
												errorCodes[form?.message?.status].message
										  }`
										: form?.message?.reason}
								</p>
							{/if}

							<div class="mt-5 w-full">
								<Button
									color="blue"
									class="w-full rounded bg-blue-600 text-sm font-semibold text-white shadow-xl hover:bg-blue-700 focus:outline-none"
									type="submit">Login</Button
								>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</main>
{/if}

<style>
	@media (max-width: 768px) {
		.footer-copyright {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
		}
	}
</style>
