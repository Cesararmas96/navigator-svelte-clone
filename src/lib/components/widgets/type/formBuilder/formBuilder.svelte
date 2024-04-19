<script lang="ts">
	import { getContext, onMount } from 'svelte'
	import { getWidgetAction } from '$lib/helpers'
	import type { Writable } from 'svelte/store'
	import { Form } from '@mixoo/form'
	import Loading from '$lib/components/common/Loading.svelte'
	import { Alert, Spinner } from 'flowbite-svelte'
	import { getApiData } from '$lib/services/getData'
	import { storeUser } from '$lib/stores'
	import { sendErrorNotification } from '$lib/stores/toast'
	import Icon from '$lib/components/common/Icon.svelte'
	import {
		getJsonSchema,
		getSchemaComputed,
		handleSubmitForm,
		utilFunctionsMap
	} from '$lib/helpers/formbuilder/index'
	import { Recaptcha, recaptcha, observer } from 'svelte-recaptcha-v2'
	import {
		onCaptchaClose,
		onCaptchaError,
		onCaptchaExpire,
		onCaptchaReady
	} from '$lib/helpers/login/login'

	export let data: any
	const widget: any = getContext('widget')
	const dashboard = getContext<Writable<any>>('dashboard')
	const widgetActions = getContext<Writable<any[]>>('widgetActions')
	const resizeAction = getWidgetAction($widgetActions, 'resize')
	let title: string = ''
	let description: string = ''
	let schema: any
	let schemaBottom: any
	let formBottomWidget: any
	let loadButton = false
	const baseUrl = import.meta.env.VITE_API_URL
	const token = $storeUser?.token
	const apikey = $storeUser?.apikey
	let responseServer = null
	let recaptchaToken

	let State = {
		idle: 'idle',
		requesting: 'requesting',
		success: 'success'
	}
	let state = State.idle

	function onSubmit() {
		state = State.requesting
		doRecaptcha()
	}

	function doRecaptcha() {
		grecaptcha.ready(function () {
			console.log('ready')
			grecaptcha
				.execute(import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY, { action: 'submit' })
				.then(function (t) {
					console.log('token', t)
					state = State.success
					recaptchaToken = t
				})
		})
	}

	const onCaptchaSuccess = (event) => {
		recaptchaToken = event.detail.token
	}

	async function handleSubmitFormLocal(
		handleValidateForm: any,
		type: string,
		handleResetForm,
		handleSetFormErrors
	) {
		onSubmit()

		loadButton = true
		const reference = type === 'formBottom' ? formBottomWidget : $widget
		const endpoint = `${reference?.endpoint || reference?.params?.model?.meta}`

		const response = await handleSubmitForm(handleValidateForm, type, reference, {
			baseUrl,
			endpoint,
			handleSetFormErrors,
			widgetContext: widget,
			...reference?.params?.model?.extras,
			dashboard
		})

		if (response) {
			if (reference?.params?.model?.responseAlert) {
				responseServer = null

				if (
					reference?.params?.model?.responseAlert?.callback &&
					utilFunctionsMap[reference?.params?.model?.responseAlert?.callback]
				) {
					responseServer =
						utilFunctionsMap[reference?.params?.model?.responseAlert?.callback](response)
				} else {
					responseServer = response?.response?.message
				}
			}

			if (
				reference?.params?.model?.callback?.form &&
				utilFunctionsMap[reference?.params?.model?.callback?.form]
			) {
				formBottomWidget = utilFunctionsMap[reference.params.model.callback.form]({
					data: response.response,
					params: reference.params.model
				})

				schemaBottom = null

				if (formBottomWidget !== 'CloseFormBottom') {
					getModel(formBottomWidget, 'bottom')
				}
			}
			recaptchaToken = null
			handleResetForm()
		}

		loadButton = false
	}

	async function getModel(reference, _type = 'default') {
		const prepareJsonSchema = await getApiData(
			`${baseUrl}/${reference?.params?.model?.meta}:meta`,
			'GET'
		)
		if (prepareJsonSchema) {
			const jsonSchema = await getJsonSchema(prepareJsonSchema, reference, {
				baseUrl,
				token,
				apikey
			})

			if (_type === 'bottom') {
				schemaBottom = getSchemaComputed(jsonSchema, reference)
			} else {
				schema = getSchemaComputed(jsonSchema, reference)
			}

			if (_type === 'default') {
				title = `${jsonSchema?.title}`
				description = jsonSchema?.description
			}
		} else {
			sendErrorNotification('The form could not be loaded')
		}
	}

	onMount(() => {
		if ($dashboard?.attributes?.explorer === 'v2') {
			console.log('resizeAction')
			resizeAction.action()
		}

		getModel($widget)
	})
</script>

<svelte:head>
	<script
		src="https://www.google.com/recaptcha/api.js?render={import.meta.env
			.VITE_GOOGLE_RECAPTCHA_SITE_KEY}"
		async
		defer
	></script>
</svelte:head>

{#if data}
	<div class="m-2 gap-1">
		<div class="" />
		{#if $widget?.params?.model?.static?.top}
			{@html $widget.params.model.static.top}
		{/if}
		<div>state: {state}</div>
		token:<br />{recaptchaToken}
		{#if schema}
			<div class="px-4 pb-4">
				{#if !$widget?.params?.model?.static?.hideTitle}
					<div class="mb-2 flex items-center">
						<h5 class=" inline-flex items-center text-base font-semibold">
							<Icon icon="mdi:widgets-outline" classes="mr-1" size="16px" />
							{title}
						</h5>
					</div>
					<div class="px-2 pb-2 text-md font-bold text-heading">
						{description}
					</div>
				{/if}

				<Form {schema}>
					<div
						class="w-full"
						slot="buttons-footer"
						let:handleValidateForm
						let:handleResetForm
						let:handleSetFormErrors
					>
						<!-- {#if $widget?.params?.model?.recaptcha && !recaptchaToken}
							<div class="recaptcha my-2 flex justify-center">
								<Recaptcha
									sitekey={import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY}
									size={'normal'}
									on:success={onCaptchaSuccess}
									on:error={onCaptchaError}
									on:expired={onCaptchaExpire}
									on:close={onCaptchaClose}
									on:ready={onCaptchaReady}
								/>
							</div>
						{/if} -->

						<div class="flex items-end justify-end">
							{#if loadButton}
								<button class="btn btn-form text-md" disabled>
									<Spinner class="me-3" size="4" color="white" />Loading ...
								</button>
							{:else}
								<button
									class="btn btn-form text-md disabled:text-gray-400 disabled:hover:cursor-not-allowed dark:text-white"
									on:click={() =>
										handleSubmitFormLocal(
											handleValidateForm,
											'formSaved',
											handleResetForm,
											handleSetFormErrors
										)}
								>
									<Icon icon="tabler:plus" classes="mr-2" />

									{schema && schema.settings && schema.settings.SubmitLabel
										? schema.settings.SubmitLabel
										: 'Save changes'}
								</button>
							{/if}
						</div>
					</div>
				</Form>

				{#if responseServer}
					<div class="pt-6">
						<Alert
							color="blue"
							dismissable
							on:close={() => {
								responseServer = null
							}}
						>
							{@html responseServer}
						</Alert>
					</div>
				{/if}

				{#if schemaBottom}
					<div class="mt-2 flex items-center">
						<h5 class=" inline-flex items-center text-base font-semibold">
							<Icon icon="mdi:widgets-outline" classes="mr-1" size="16px" />
							{schemaBottom?.title}
						</h5>
					</div>
					<div class="px-2 text-md font-bold text-heading">
						{schemaBottom?.description}
					</div>

					<Form schema={schemaBottom}>
						<div
							class="w-full"
							slot="buttons-footer"
							let:handleValidateForm
							let:handleResetForm
							let:handleSetFormErrors
						>
							<div class="flex items-end justify-end">
								{#if loadButton}
									<button class="btn btn-form text-md" disabled>
										<Spinner class="me-3" size="4" color="white" />Loading ...
									</button>
								{:else}
									<button
										class="btn btn-form text-md"
										on:click={() =>
											handleSubmitFormLocal(
												handleValidateForm,
												'formBottom',
												handleResetForm,
												handleSetFormErrors
											)}
									>
										<Icon icon="tabler:plus" classes="mr-2" />

										{schemaBottom && schemaBottom.settings && schemaBottom.settings.SubmitLabel
											? schemaBottom.settings.SubmitLabel
											: 'Save changes'}
									</button>
								{/if}
							</div>
						</div>
					</Form>
				{/if}
			</div>
		{:else}
			<Loading />
		{/if}
	</div>
{/if}
