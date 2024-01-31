import { getApiData } from '$lib/services/getData'
import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
import { merge } from 'lodash-es'

export const getJsonSchema = async (jsonSchema, $widget, credentials) => {
	jsonSchema['noHeader'] = true

	Object.keys(jsonSchema.properties).map((property) => {
		if (
			jsonSchema.properties[property]?.$ref?.api &&
			jsonSchema.properties[property]?.type === 'object'
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
		$widget?.params?.model?._ignore?.forEach((item) => delete payload[item])

		return await handleSubmit(payload, type, $widget, extra)
	} else {
		sendErrorNotification('There has been a problem...')
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

	const dataModel = await getApiData(url, method, payload)

	if (dataModel) {
		if (callback) {
			callback({
				rowId: $widget?.rowId,
				dataModel
			})
		}

		sendSuccessNotification(dataModel?.message || message)

		return { response: dataModel || message }
	} else {
		console.log('Error here', dataModel)
		sendErrorNotification('There has been a problem...')
		return false
	}
}

export const utilFunctionsMap: { [key: string]: (params: any) => any } = {
	supportTicket: supportTicket
}

export function supportTicket(params) {
	console.log('paramsparamsparams', params)
	let message = `${params?.response?.message} <br> ID de ticket ${params?.response?.ticket_number}  `

	if (params?.response?.login_information?.login)
		message = message.concat(`<br> Login: ${params?.response?.login_information?.login}`)

	if (params?.response?.login_information?.email)
		message = message.concat(`<br> Email: ${params?.response?.login_information?.email}`)

	return message
}
