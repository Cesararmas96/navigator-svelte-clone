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

	const redirecURI = $page.url.origin

	let showPassword: boolean = false

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
	<main>
		<div class="main-container dark:text-white-dark min-h-screen text-black">
			<div class="flex min-h-screen bg-white">
				<div class="hidden w-full flex-col text-white dark:text-black lg:!flex lg:!w-4/5">
					<Carousel images={images.slideshowCarouselData} />
				</div>
				<div class="relative flex w-full items-center justify-center lg:!w-2/5">
					<div class="w-96 md:p-10">
						<!--                    <h2 class="mb-3 text-3xl font-bold">Navigator</h2>-->
						<img
							src={images.logoClientUrl}
							alt="{images.client}-logo"
							style="max-width: 200px"
							class="ml-auto mr-auto flex"
						/>

						<form id="form" class="mt-4 space-y-5" action="?/login" method="POST" use:enhance>
							<p class="mb-7">Sign in with Basic User/Password authentication</p>

							<div>
								<Label for="email" class="mb-1 !text-gray-900">Email</Label>
								<Input
									type="text"
									id="email"
									defaultClass="block w-full p-2.5 !focus:border-primary-500 !focus:ring-primary-500 !bg-gray-50 !text-gray-900 !border-gray-300 text-sm rounded-lg"
									name="email"
									placeholder="email@email.com"
									required
									on:keydown={keyDownEnter}
								/>
							</div>
							<div>
								<Label for="password" class="mb-1 !text-gray-900">Password</Label>
								<Input
									id="password"
									type={showPassword ? 'text' : 'password'}
									defaultClass="block w-full p-2.5 !focus:border-primary-500 !focus:ring-primary-500 !bg-gray-50 !text-gray-900 !border-gray-300 text-sm rounded"
									name="password"
									placeholder="**********"
									required
									on:keydown={keyDownEnter}
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

							{#if form?.invalid}
								<p class="error">Username and password is required.</p>
							{/if}

							{#if form?.credentials}
								<p class="error">
									{errorCodes[form?.message?.status]
										? errorCodes[form?.message?.status]
										: form?.message?.reason}
								</p>
							{/if}

							<div class="flex justify-end">
								<a class="text-sm" href="/">Forgot your password?</a>
							</div>

							<Button color="blue" class="w-full" type="submit">SIGN IN</Button>
						</form>

						<div
							class="relative my-7 flex h-5 flex-col text-center before:absolute before:inset-0 before:m-auto before:h-[1px] before:w-full before:bg-[#ebedf2] dark:before:bg-[#253b5c]"
						>
							<div class="text-white-dark relative z-[1] inline-block px-2 font-bold">
								<span class="bg-white px-2">OR sign in with SSO</span>
							</div>
						</div>

						<ul class="grid w-full gap-4 sm:gap-5">
							{#if filteredObject}
								{#each Object.values(filteredObject) as method}
									{#if method.name === 'ADFSAuth'}
										<Button
											href={`${apiUrl}${method.uri}?redirect_uri=${redirecURI}`}
											outline
											color={method.color || 'light'}
											class="ml-auto mr-auto flex w-full"
										>
											<P weight="medium">Sign in with SSO</P>
										</Button>
									{:else}
										<li>
											<Button
												href={`${apiUrl}${method.uri}?redirect_uri=${redirecURI}`}
												outline
												color={method.color || 'light'}
												class="ml-auto mr-auto flex w-full"
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
					</div>
				</div>
			</div>
		</div>
	</main>
{/if}

<style>
	.error {
		width: 100%;
		background-color: rgba(255, 0, 0, 0.1);
		border-color: red;
		color: red;
		padding: 0.5rem;
		border-radius: 5px;
		max-width: fit-content;
	}
</style>
