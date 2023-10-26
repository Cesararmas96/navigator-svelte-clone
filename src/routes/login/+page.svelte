<script lang="ts">
	import { Button, Input, Label, P, Tooltip } from 'flowbite-svelte'
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import {
		buildImageUrls,
		extractSubdomain,
		filterAuthMethods,
		removeBasicAuth
	} from '$lib/helpers/login/login'
	import type { ActionData } from './$types'
	import Carousel from '$lib/components/common/Carousel.svelte'
	import { getApiData } from '$lib/services/getData'

	export let form: ActionData

	const apiUrl = import.meta.env.VITE_API_URL

	//TODO: Agregar esta variable en las variables de entorno
	const baseProdUrl = 'https://api.trocdigital.io'

	const getLoginData = async () => {
		try {
			const subdomain = extractSubdomain()
			const rootLink = `${baseProdUrl}/api/v2/services/images/`

			const [data] = await getApiData(
				`${apiUrl}/api/v1/clients?subdomain_prefix=${subdomain}`,
				'GET'
			)
			return buildImageUrls(data, rootLink)
		} catch (error) {
			console.error('Failed to fetch company data:', error)
			return null
		}
	}

	let filteredObject: Record<string, any> = {}
	const importLoginMethods = async (data: any) => {
		const { authMethods } = data
		try {
			const totalAuthMethods = await getApiData(`${apiUrl}/api/v1/auth/methods`, 'GET')
			filteredObject = filterAuthMethods(totalAuthMethods, authMethods)
			filteredObject = removeBasicAuth(filteredObject)
			return filteredObject
		} catch (error) {
			console.error('Failed to fetch login methods:', error)
			return null
		}
	}
	let data: any
	onMount(async () => {
		data = await getLoginData()
		importLoginMethods(data)
	})
</script>

{#if data}
	<main>
		<div class="main-container dark:text-white-dark min-h-screen text-black">
			<div class="flex min-h-screen bg-white">
				<div
					class=" width-full w-4/5 flex-col items-center justify-center text-white dark:text-black lg:flex"
				>
					<Carousel images={data.slideshowCarouselData} />
				</div>
				<div class="relative flex w-full items-center justify-center lg:w-2/5">
					<div class="w-auto md:p-10">
						<!--                    <h2 class="mb-3 text-3xl font-bold">Navigator</h2>-->
						<img
							src={data.logoClientUrl}
							alt="{data.client}-logo"
							style="max-width: 200px"
							class="ml-auto mr-auto flex"
						/>

						<form class="mt-4 space-y-5" action="?/login" method="POST" use:enhance>
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
								/>
							</div>
							<div>
								<Label for="password" class="mb-1 !text-gray-900">Password</Label>
								<Input
									type="password"
									id="password"
									defaultClass="block w-full p-2.5 !focus:border-primary-500 !focus:ring-primary-500 !bg-gray-50 !text-gray-900 !border-gray-300 text-sm rounded-lg"
									name="password"
									placeholder="**********"
									required
								/>
							</div>

							{#if form?.invalid}
								<p class="error">Username and password is required.</p>
							{/if}

							{#if form?.credentials}
								<p class="error">You have entered the wrong credentials.</p>
							{/if}

							<div class="flex justify-end">
								<a class="text-sm" href="/">Forgot your password?</a>
							</div>

							<Button color="blue" class="w-full" type="submit">SIGN IN</Button>
						</form>

						<div
							class="relative my-7 h-5 text-center before:absolute before:inset-0 before:m-auto before:h-[1px] before:w-full before:bg-[#ebedf2] dark:before:bg-[#253b5c]"
						>
							<div class="text-white-dark relative z-[1] inline-block px-2 font-bold">
								<span>OR</span>
							</div>
						</div>

						<ul class="grid w-full gap-4 sm:gap-5">
							{#if filteredObject}
								{#each Object.values(filteredObject) as method}
									{#if method.name === 'ADFSAuth'}
										<Button
											href={`${apiUrl}${method.uri}`}
											outline
											color={method.color || 'light'}
											class="ml-auto mr-auto flex w-full"
										>
											<P weight="medium">Sign in with SSO</P>
										</Button>
									{:else}
										<li>
											<Button
												href={`${apiUrl}${method.uri}`}
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
	}
</style>
