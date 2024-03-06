<script lang="ts">
	import { Button, Input, Label, P, Tooltip } from 'flowbite-svelte'
	import { enhance } from '$app/forms'
	import type { ActionData } from './$types'
	import Carousel from '$lib/components/common/Carousel.svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { page } from '$app/stores'

	export let data
	const { filteredObject, images } = data

	export let form: ActionData

	const apiUrl = import.meta.env.VITE_API_URL

	const redirecURI = `${$page.url.origin}/login/callback`

	const apiUrl2 = import.meta.env.VITE_API_URL

	const redirecURI2 = `${$page.url.origin}/login/callback`

	let showPassword: boolean = false

	let year = new Date().getFullYear()

	const errorCodes = {
		'400':
			'Bad Request. Please double-check your credentials and try again. For persistent issues contact support.',
		'401':
			'User Not Found: The email you entered does not exist. Please check your entry for any errors and try again.',
		'403': 'Incorrect Password: Please double-check your credentials and try again.'
	}

	const keyDownEnter = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			document.getElementById('form')?.dispatchEvent(new Event('submit'))
		}
	}
</script>

{#if images}
	<main class="">
		<div class="dark:text-white-dark text-black">
			<div class="flex bg-white">
				<div class="hidden w-full flex-col text-white dark:text-black lg:!flex lg:!w-3/5">
					<Carousel images={images.slideshowCarouselData} />
				</div>
				<div class="flex w-full justify-center lg:!w-2/5">
					<div class="flex w-full flex-col p-4 sm:p-4">
						<div class="mb-8">
							<img src={images.logoClientUrl} alt="{images.client}-logo" style="max-width: 80px" />
						</div>

						<div class=" text-center text-xl font-semibold">Welcome Back</div>

						<div class="mb-8 text-center text-lg text-gray-600">
							Please select how you want to connect with us
						</div>

						<ul class="grid w-full gap-4 sm:gap-5">
							{#if filteredObject}
								{#each Object.values(filteredObject) as method}
									{#if method.name === 'ADFSAuth'}
										<Button
											href={`${apiUrl}${method.uri}?redirect_uri=${redirecURI}`}
											outline
											color={method.color || 'light'}
											class="  flex w-full border border-blue-600 text-base text-black  shadow"
											title="Authenticate with ADFSAuth"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												x="0px"
												y="0px"
												width="24"
												height="24"
												viewBox="0 0 48 48"
											>
												<path
													d="M 30 5 C 22.838262 5 17 10.838262 17 18 C 17 18.882345 17.182742 19.703331 17.351562 20.527344 L 5.4394531 32.439453 A 1.50015 1.50015 0 0 0 5 33.5 L 5 41.5 A 1.50015 1.50015 0 0 0 6.5 43 L 14.5 43 A 1.50015 1.50015 0 0 0 16 41.5 L 16 39 L 19.5 39 A 1.50015 1.50015 0 0 0 21 37.5 L 21 34 L 24.5 34 A 1.50015 1.50015 0 0 0 26 32.5 L 26 30.294922 C 27.271145 30.709396 28.595703 31 30 31 C 37.161738 31 43 25.161738 43 18 C 43 10.838262 37.161738 5 30 5 z M 30 8 C 35.540262 8 40 12.459738 40 18 C 40 23.540262 35.540262 28 30 28 C 28.262518 28 26.639202 27.56058 25.21875 26.785156 A 1.50015 1.50015 0 0 0 23 28.101562 L 23 31 L 19.5 31 A 1.50015 1.50015 0 0 0 18 32.5 L 18 36 L 14.5 36 A 1.50015 1.50015 0 0 0 13 37.5 L 13 40 L 8 40 L 8 34.121094 L 19.988281 22.132812 A 1.50015 1.50015 0 0 0 20.373047 20.669922 C 20.133878 19.809089 20 18.919659 20 18 C 20 12.459738 24.459738 8 30 8 z M 32 13 A 3 3 0 0 0 32 19 A 3 3 0 0 0 32 13 z"
												/>
											</svg>
											<p class="ml-2">Sign in with SSO</p>
										</Button>

										<Button
											href={`${apiUrl2}${method.uri}?redirect_uri=${redirecURI2}`}
											outline
											color={method.color || 'light'}
											class=" ml-auto mr-auto flex w-full border  border-blue-600 text-base shadow"
											title="Authenticate with Microsoft"
										>
											<img src="/images/icons/microsoft-logo.png" alt="microsoft" class="w-6" />
											<p class="ml-2 text-black">Sign in with Microsoft</p>
										</Button>
									{:else}
										<li>
											<Button
												href={`${apiUrl}${method.uri}?redirect_uri=${redirecURI}`}
												outline
												color={method.color || 'light'}
												class=" ml-auto mr-auto flex bg-red-400"
											>
												<img
													src="images/auth/{method.name}.png"
													style="max-width: 150px"
													alt={method.name}
												/>
											</Button>
											<Tooltip>{method.description}</Tooltip>
										</li>
									{/if}
								{/each}
							{/if}
						</ul>

						<div class="mt-6 flex items-center">
							<div class="h-px flex-grow bg-gray-400 opacity-20" />
							<span class="flex-shrik px-4 text-gray-600">Or Continue With</span>
							<div class="h-px flex-grow bg-gray-400 opacity-20" />
						</div>

						<form id="form" class="mt-4" action="?/login" method="POST" use:enhance>
							<div>
								<Label for="email" class="mb-1 font-semibold">Email</Label>
								<Input
									type="text"
									id="email"
									defaultClass="block w-full mb-4 p-2.5 !focus:border-primary-500 !focus:ring-primary-500 !bg-gray-50 !text-gray-900 !border-gray-300 !text-base rounded"
									name="email"
									placeholder="Email@email.com"
									required
									on:keydown={keyDownEnter}
									maxlength="100"
								/>
							</div>
							<div>
								<Label for="password" class="mb-1 font-semibold">Password</Label>
								<Input
									id="password"
									type={showPassword ? 'text' : 'password'}
									defaultClass="block w-full p-2.5 !focus:border-primary-500 !focus:ring-primary-500 !bg-gray-50 !text-gray-900 !border-gray-300 !text-base rounded"
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

							<div class="mt-2 flex items-center justify-between text-gray-500">
								<div class="">
									<input type="checkbox" class="" id="remember" value="TER" />
									<label class="l" for="remember">Remember me</label>
								</div>
								<a class="" href="/">Forgot your password?</a>
							</div>

							{#if form?.invalid}
								<p class="error mb-4 mt-4">Username and password is required.</p>
							{/if}

							{#if form?.credentials}
								<p
									class="mb-4 mt-4 w-full rounded-md border bg-red-100 p-2 text-center text-red-500"
								>
									{errorCodes[form?.message?.status]
										? errorCodes[form?.message?.status]
										: form?.message?.reason}
								</p>
							{/if}

							<Button color="blue" class="mt-6 w-full text-lg shadow" type="submit">Login</Button>
						</form>
						<div class="footer-copyright mt-auto">
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
