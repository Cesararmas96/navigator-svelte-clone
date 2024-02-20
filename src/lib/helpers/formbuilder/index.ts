import { getApiData } from '$lib/services/getData'
import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
import { openModal } from '$lib/helpers/common/modal'
import { merge } from 'lodash-es'

export const getJsonSchema = async (jsonSchema, $widget, credentials) => {
	jsonSchema = getSchemaComputed(jsonSchema, $widget)
	jsonSchema['noHeader'] = true

	Object.keys(jsonSchema.properties).map((property) => {
		if (
			jsonSchema.properties[property]?.$ref?.api &&
			['object', 'select'].includes(jsonSchema.properties[property]?.type)
		) {
			jsonSchema.properties[property].type = 'select'

			jsonSchema.properties[property].$ref['_fetch'] = {
				baseUrl: `${credentials?.baseUrl}/${
					$widget?.params?.model?.schema?.properties &&
					$widget?.params?.model?.schema?.properties[property] &&
					$widget?.params?.model?.schema?.properties[property]?.$ref?.url
						? $widget?.params?.model?.schema?.properties[property]?.$ref?.url
						: 'api/v1/'
				}`,
				headers: {
					authorization: `Bearer ${credentials?.token}`
				}
			}

			delete jsonSchema.properties[property]?.$ref?.$ref
		}

		if (jsonSchema.properties[property]?.type === 'search') {
			jsonSchema.properties[property]['_fetch'] = {
				url: `${credentials?.baseUrl}/${
					$widget?.params?.model?.schema?.properties &&
					$widget?.params?.model?.schema?.properties[property] &&
					$widget?.params?.model?.schema?.properties[property]?._fetch?.url
						? $widget?.params?.model?.schema?.properties[property]?._fetch?.url
						: `api/v1/${$widget?.params?.model?.schema?.properties[property]?._fetch?.api}`
				}`,
				headers: {
					authorization: `Bearer ${credentials?.token}`
				}
			}
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
	if ($widget?.params?.model?.schema?.$withoutDefs && jsonSchema?.$defs) {
		delete jsonSchema.$defs
	}

	return merge({}, jsonSchema, $widget?.params?.model?.schema || {})
}

export const handleSubmitForm = async (handleValidateForm: any, type: string, $widget, extra) => {
	const payload = handleValidateForm()
	console.log(payload)

	if (!Array.isArray(payload)) {
		const filteredPayload = { ...payload, ...$widget?.params?.model?.defaults }
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
					params: $widget.params.model
				})
			}

			sendSuccessNotification(dataModel?.message || message)

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
	handleSupportTicketsWithPin: handleSupportTicketsWithPin
}

export function supportTicket(params) {
	let message = `${params?.response?.message} <br> ID de ticket ${params?.response?.ticket_number}  `

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
								disabled: true,
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
