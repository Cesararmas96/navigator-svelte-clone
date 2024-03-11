import { getApiData } from '$lib/services/getData'
import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
import { openModal } from '$lib/helpers/common/modal'
import { merge } from 'lodash-es'
import { addInstance, clearInstances } from '$lib/helpers/widget/instances'
import { storeUser } from '$lib/stores'
import { get } from 'svelte/store'

let $defs

export const getJsonSchema = async (jsonSchema, $widget, credentials) => {
	jsonSchema = merge({}, jsonSchema, $widget?.params?.model?.schema || {})
	jsonSchema['noHeader'] = true

	Object.keys(jsonSchema.properties).map((property) => {
		if (
			jsonSchema.properties[property]?.$ref?.api &&
			['object', 'select'].includes(jsonSchema.properties[property]?.type) &&
			jsonSchema.properties[property]?.['ui:widget'] !== 'adv-search'
		) {
			jsonSchema.properties[property].type = 'select'

			if (jsonSchema.properties[property]?.endpoint)
				jsonSchema.properties[property].$ref.api = jsonSchema.properties[property].endpoint

			jsonSchema.properties[property].$ref['_fetch'] = {
				baseUrl: `${credentials?.baseUrl}/${
					$widget?.params?.model?.schema?.properties &&
					$widget?.params?.model?.schema?.properties[property] &&
					$widget?.params?.model?.schema?.properties[property]?.$ref?.url
						? $widget?.params?.model?.schema?.properties[property]?.$ref?.url &&
						  $widget?.params?.model?.schema?.properties[property]?.$ref?.url === ' '
							? ''
							: $widget?.params?.model?.schema?.properties[property]?.$ref?.url
						: 'api/v1/'
				}`,
				headers: {
					authorization: `Bearer ${credentials?.token}`
				}
			}

			delete jsonSchema.properties[property]?.$ref?.$ref
		}

		if (
			jsonSchema.properties[property]?.type === 'search' ||
			jsonSchema.properties[property]?.['ui:widget'] === 'adv-search'
		) {
			jsonSchema.properties[property].type = 'search'

			jsonSchema.properties[property]['_fetch'] = {
				url: `${credentials?.baseUrl}/${
					$widget?.params?.model?.schema?.properties &&
					$widget?.params?.model?.schema?.properties[property] &&
					$widget?.params?.model?.schema?.properties[property]?._fetch?.url
						? $widget?.params?.model?.schema?.properties[property]?._fetch?.url
						: `api/v1/${jsonSchema.properties[property]?.$ref?.api}`
				}`,
				headers: {
					authorization: `Bearer ${credentials?.token}`
				},
				id: jsonSchema.properties[property]?.$ref?.id,
				label: jsonSchema.properties[property]?.$ref?.value
			}

			if ($defs && $defs[property] && jsonSchema.properties[property]['ui:widget:filterby']) {
				const _schema = {
					type: 'object',
					title: '',
					noHeader: true,
					properties: {},
					description: ''
				}
				jsonSchema.properties[property]['ui:widget:filterby'].map((item) => {
					if ($defs[property]?.properties[item]) {
						_schema.properties[item] = $defs[property].properties[item]
					}
				})

				jsonSchema.properties[property]['_schema'] = _schema
			}

			// jsonSchema.properties[property]['_result'] = {}
			delete jsonSchema.properties[property]?.$ref
		}

		if (jsonSchema.properties[property]?.enum_type) {
			jsonSchema.properties[property].items = jsonSchema.properties[property]?.enum_type
			delete jsonSchema.properties[property]?.enum_type
		}

		if (
			jsonSchema.properties[property]?.type === 'text' ||
			jsonSchema.properties[property]?.['ui:widget'] === 'textarea'
		) {
			jsonSchema.properties[property].type = 'string'
			jsonSchema.properties[property]['format'] = 'textarea'
		}

		if (jsonSchema.properties[property]?.type === 'datetime') {
			jsonSchema.properties[property].attrs.visible = false
		}

		if (jsonSchema.properties[property]?.['ui:widget'] === 'ImageUploader') {
			// TODO: improve
			jsonSchema.properties[property].type = 'upload'

			delete jsonSchema.properties[property].attrs.placeholder

			jsonSchema.properties[property].attrs['fetching'] = {
				url: `${credentials?.baseUrl}/services/files/static/images/badges/`,
				method: 'PUT',
				payload: 'file_name',
				headers: {
					authorization: `Bearer ${credentials?.token}`
				}
			}

			if (jsonSchema.properties[property]?.['ui:help'])
				jsonSchema.properties[property].attrs.help = jsonSchema.properties[property]?.['ui:help']
		}
	})

	// console.log(JSON.stringify(jsonSchema))
	return jsonSchema
}

export const getSchemaComputed = (jsonSchema: Record<string, unknown>, $widget) => {
	jsonSchema = merge({}, jsonSchema, $widget?.params?.model?.schema || {})

	if ($widget?.params?.model?.schema?.$withoutDefs && jsonSchema?.$defs) {
		$defs = jsonSchema.$defs
		delete jsonSchema.$defs
	}

	if ($widget?.params?.model?.schema?.required) {
		jsonSchema['required'] = $widget?.params?.model?.schema?.required
	}

	if (
		$widget?.params?.model?.callback?.preRender &&
		utilFunctionsMap[$widget?.params?.model?.callback?.preRender]
	) {
		utilFunctionsMap[$widget?.params?.model?.callback?.preRender]({
			jsonSchema,
			$widget
		})
	}

	return jsonSchema
}

export const handleSubmitForm = async (handleValidateForm: any, type: string, $widget, extra) => {
	const payload = handleValidateForm()
	console.log(payload)
	if (!Array.isArray(payload)) {
		const filteredPayload = { ...$widget?.params?.model?.defaults, ...payload }
		$widget?.params?.model?._ignore?.forEach((item) => delete filteredPayload[item])

		return await handleSubmit(filteredPayload, type, $widget, extra)
	} else {
		sendErrorNotification('Please review your form responses and complete the required fields.')
	}
}

async function handleSubmit(payload: any, type: string, $widget, extra) {
	const endpoint = extra.endpoint

	let url = `${extra.baseUrl}/${endpoint}`
	let method = 'PUT'
	let message = 'Successfully created'
	let callback = $widget.callbackNew

	if (type === 'update') {
		url = `${url}${extra.primaryKey}`
		method = 'POST'
		message = 'Successfully updated'
		callback = $widget.callbackUpdate
	}

	if (extra?.method) method = extra.method
	if (extra?.message) message = extra.message

	try {
		const dataModel = await getApiData(url, method, payload)

		if (dataModel) {
			if (callback) {
				callback({
					rowId: $widget?.rowId,
					dataModel
				})
			}

			if (
				$widget?.params?.model?.callback?.fn &&
				utilFunctionsMap[$widget?.params?.model?.callback?.fn]
			) {
				utilFunctionsMap[$widget.params.model.callback.fn]({
					data: dataModel,
					params: $widget.params.model,
					extra: {
						extra,
						widget: $widget
					}
				})
			}

			sendSuccessNotification($widget?.params?.model?.message || dataModel?.message || message)

			return { response: dataModel || message }
		} else {
			console.log('Error here', dataModel)
			sendErrorNotification('There has been a problem...')
			return false
		}
	} catch (error: any) {
		console.log(error)

		if (error?.message.includes('already exists')) {
			extra?.handleSetFormErrors([
				{
					message: error?.message.split('<br> ')[1] || error,
					raw: {
						path: ['login']
					}
				}
			])
		}

		return false
	}
}

export const utilFunctionsMap: { [key: string]: (params: any) => any } = {
	supportTicket: supportTicket,
	handleSupportTicketsWithPin: handleSupportTicketsWithPin,
	handleSupportTicketsWithPinForm: handleSupportTicketsWithPinForm,
	handleActiveDrilldown: handleActiveDrilldown,
	handleCloseFormBottom: handleCloseFormBottom,
	handlePreRenderMileageSearchStores: handlePreRenderMileageSearchStores
}

export function supportTicket(params) {
	let message = `${params?.response?.message} <br> Ticket ID	${params?.response?.ticket_number}  `

	if (params?.response?.login_information?.login)
		message = message.concat(`<br> Login: ${params?.response?.login_information?.login}`)

	if (params?.response?.login_information?.email)
		message = message.concat(`<br> Email: ${params?.response?.login_information?.email}`)

	return message
}

function handleSupportTicketsWithPin(params) {
	openModal('Security', 'FormBuilder', {
		model: {
			params: {
				model: {
					url: '/',
					meta: 'support/api/v1/protect_ticket',
					primaryKey: 'title',
					responseAlert: true,
					schema: {
						properties: {
							ticket_id: {
								readonly: true,
								readOnly: true,
								default: params?.data?.ticket?.id
							}
						}
					},
					defaults: {
						ticket: {
							number: params?.data?.ticket?.number,
							title: params?.data?.ticket?.title,
							owner_id: params?.data?.ticket?.owner_id,
							customer_id: params?.data?.ticket?.customer_id
						}
					}
				}
			}
		}
	})
}

function handleSupportTicketsWithPinForm(params) {
	return {
		params: {
			model: {
				url: '/',
				meta: 'support/api/v1/protect_ticket',
				primaryKey: 'title',
				responseAlert: true,
				callback: {
					form: 'handleCloseFormBottom'
				},
				schema: {
					properties: {
						ticket_id: {
							readonly: true,
							readOnly: true,
							default: params?.data?.ticket?.id
						}
					}
				},
				defaults: {
					ticket: {
						number: params?.data?.ticket?.number,
						title: params?.data?.ticket?.title,
						owner_id: params?.data?.ticket?.owner_id,
						customer_id: params?.data?.ticket?.customer_id
					}
				}
			}
		}
	}
}

async function handleActiveDrilldown(params) {
	await clearInstances(params.extra?.extra?.widgetContext)

	addInstance(params.extra?.extra?.widgetContext, {
		// title: `Ticket #${params.data.number}`,
		title: 'Ticket Status',
		attributes: {
			icon: 'iconoir:stats-report'
		},
		classbase: 'TicketZammad',
		program_id: params.extra.widget.program_id,
		module_id: params.extra.module_id,
		dashboard_id: params.extra.widget.dashboard_id,
		widget_type_id: 'media-ticket-zammad',
		parent: params.extra.widget.widget_id,
		params: {
			settings: merge(
				{},
				params.extra.widget.params.settings,
				params.extra.widget.params.drilldowns.params?.settings
			)
		},
		...params.extra.widget.params.drilldowns,
		ticket: params.data
	})
}

function handleCloseFormBottom(params) {
	return 'CloseFormBottom'
}

function handlePreRenderMileageSearchStores(params) {
	// TODO:
	const user = get(storeUser)

	if (user?.superuser) {
		params.jsonSchema.properties.program_slug.attrs.visible = false
		params.jsonSchema.properties.associate_oid.attrs.visible = false
		params.jsonSchema['required'] = []

		params.$widget.params.model.defaults = {
			program_slug: user?.first_name,
			associate_oid: user?.domain
		}
	}
}
