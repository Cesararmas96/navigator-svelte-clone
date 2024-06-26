import { getApiData, postData } from '$lib/services/getData'
import { sendErrorNotification, sendSuccessNotification } from '$lib/stores/toast'
import { openModal } from '$lib/helpers/common/modal'
import { merge } from 'lodash-es'
import { addInstance, clearInstances } from '$lib/helpers/widget/instances'
import { storeUser } from '$lib/stores'
import { get } from 'svelte/store'

let $defs
let $endSchema
let $baseURL
const $boolYesOrNot: string[] = []

export const getJsonSchema = async (jsonSchema, $widget, credentials) => {
	$baseURL = credentials?.baseUrl

	jsonSchema = merge({}, jsonSchema, $widget?.params?.model?.schema || {})
	jsonSchema['noHeader'] = true

	if ($widget?.params?.model?.schema?.$withoutDefs && jsonSchema?.$defs) {
		$defs = jsonSchema.$defs
		delete jsonSchema.$defs
	}

	Object.keys(jsonSchema.properties).map((property) => {
		if (jsonSchema.properties[property]?.enum_type?.type) {
			if (jsonSchema.properties[property]['ui:bool']) {
				$boolYesOrNot.push(property)
			}

			delete jsonSchema.properties[property]?.enum_type?.type
		}

		if (jsonSchema.properties[property]?.type === 'array') {
			jsonSchema.properties[property].type = 'select'
		}

		if (
			jsonSchema.properties[property]?.$ref?.api &&
			['object', 'select', 'dropdown'].includes(jsonSchema.properties[property]?.type) &&
			jsonSchema.properties[property]?.['ui:widget'] !== 'adv-search'
		) {
			jsonSchema.properties[property].type =
				jsonSchema.properties[property].type === 'dropdown' ? 'dropdown' : 'select'

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
				headers: !credentials?.apikey
					? { authorization: `Bearer ${credentials?.token}` }
					: { 'x-api-key': credentials?.token }
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
				headers: !credentials?.apikey
					? { authorization: `Bearer ${credentials?.token}` }
					: { 'x-api-key': credentials?.token },
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

		// if (jsonSchema.properties[property]?.type === 'datetime') {
		// 	jsonSchema.properties[property].attrs.visible = false
		// }

		if (
			jsonSchema.properties[property]?.['ui:widget'] === 'ImageUploader' ||
			jsonSchema.properties[property]?.['ui:widget'] === 'dropzone'
		) {
			// TODO: improve
			jsonSchema.properties[property].type = 'upload'

			delete jsonSchema.properties[property].attrs.placeholder

			jsonSchema.properties[property].attrs['fetching'] = {
				url: `${credentials?.baseUrl}/services/files/static/images/badges/`,
				method: 'PUT',
				payload: 'file_name',
				headers: !credentials?.apikey
					? { authorization: `Bearer ${credentials?.token}` }
					: { 'x-api-key': credentials?.token }
			}

			if (jsonSchema.properties[property]?.['ui:help'])
				jsonSchema.properties[property].attrs.help = jsonSchema.properties[property]?.['ui:help']
		}
	})

	// console.log(JSON.stringify(jsonSchema))
	return jsonSchema
}

export const getSchemaComputed = async (jsonSchema: Record<string, unknown>, $widget) => {
	jsonSchema = merge({}, jsonSchema, $widget?.params?.model?.schema || {})

	// if ($widget?.params?.model?.schema?.$withoutDefs && jsonSchema?.$defs) {
	// 	$defs = jsonSchema.$defs
	// 	delete jsonSchema.$defs
	// }

	if ($widget?.params?.model?.schema?.required) {
		jsonSchema['required'] = $widget?.params?.model?.schema?.required
	}

	if (
		$widget?.params?.model?.callback?.preRender &&
		utilFunctionsMap[$widget?.params?.model?.callback?.preRender]
	) {
		jsonSchema = await utilFunctionsMap[$widget?.params?.model?.callback?.preRender]({
			jsonSchema,
			$widget
		})
	}

	$endSchema = jsonSchema

	return jsonSchema
}

export const handleSubmitForm = async (handleValidateForm: any, type: string, $widget, extra) => {
	const payload = handleValidateForm()

	// console.log(payload)
	if (!Array.isArray(payload)) {
		let filteredPayload = { ...$widget?.params?.model?.defaults, ...payload }
		$widget?.params?.model?._ignore?.forEach((item) => {
			if (item.includes('.')) {
				const recursive = item.split('.')

				filteredPayload[recursive[0]] &&
					filteredPayload[recursive[0]].forEach((recurs) => {
						if (recurs?.data) recurs.data = recurs.data.split('base64,')[1]

						delete recurs[recursive[1]]
					})
			}

			delete filteredPayload[item]
		})

		if ($boolYesOrNot.length > 0) {
			filteredPayload = utilFunctionsMap['handleFunctionBooleanYesOrNot']({
				data: filteredPayload,
				params: $widget.params.model,
				extra: {
					extra,
					widget: $widget
				}
			})
		}

		if (
			$widget?.params?.model?.callback?.preFetch &&
			utilFunctionsMap[$widget?.params?.model?.callback?.preFetch]
		) {
			filteredPayload = utilFunctionsMap[$widget.params.model.callback.preFetch]({
				data: filteredPayload,
				params: $widget.params.model,
				extra: {
					extra,
					widget: $widget
				}
			})
		}

		if (extra.tokenCaptcha) {
			filteredPayload = { ...filteredPayload, ctoken: extra.tokenCaptcha }
		}

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
	let callback = extra?.options?.callbackNew

	if (type === 'update') {
		url = `${url}${extra.primaryKey}`
		method = 'POST'
		message = 'Successfully updated'
		callback = extra?.options?.callbackUpdate
	}

	if (extra?.method) method = extra.method
	if (extra?.message) message = extra.message
	if (extra?.queryparams) {
		extra.queryparams.map((item) => {
			url = url.concat(
				!url.includes('?') ? `?${item}=${payload[item]}` : `&${item}=${payload[item]}`
			)
		})
	}

	try {
		const dataModel = await getApiData(url, method, payload)

		if (dataModel) {
			if (callback) {
				callback({
					rowId: extra?.options?.rowId,
					dataModel: Array.isArray(dataModel)
						? dataModel[0]
						: $widget?.params?.model?.response?.model
						? dataModel[$widget?.params?.model?.response?.model]
						: dataModel
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

		if (error?.message?.includes('already exists')) {
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
	supportTicketBose: supportTicketBose,
	getAlertEmailGraduate: getAlertEmailGraduate,
	handleSupportTicketsWithPin: handleSupportTicketsWithPin,
	handleSupportTicketsWithPinForm: handleSupportTicketsWithPinForm,
	handleFormEditGraduade: handleFormEditGraduade,
	handleActiveDrilldown: handleActiveDrilldown,
	handleCloseFormBottom: handleCloseFormBottom,
	handlePreRenderMileageSearchStores: handlePreRenderMileageSearchStores,
	handleFunctionMileageSearchStores: handleFunctionMileageSearchStores,
	handlePreRenderProServicesSearchEmployee: handlePreRenderProServicesSearchEmployee,
	handlePreRenderWeProtectUforPublic: handlePreRenderWeProtectUforPublic,
	handleFunctionProServicesSearchEmployees: handleFunctionProServicesSearchEmployees,
	handleFunctionCallbackPrePayloadTicketForBose: handleFunctionCallbackPrePayloadTicketForBose,
	handleFunctionCallbackPrePayloadRequiredInHide: handleFunctionCallbackPrePayloadRequiredInHide,
	handleFunctionBooleanYesOrNot: handleFunctionBooleanYesOrNot
}

export function supportTicket(params) {
	// let message = `${params?.response?.message} <br> Ticket ID	${params?.response?.ticket_number}  `
	let message = `Your report was submitted, and a case was opened under <strong>Ticket ID	${params?.response?.ticket_number}</strong>, please take note of this number in case you want to follow up on this case later. We will promptly review and investigate your submission, and we will make every effort to contact you if you choose to provide your contact information. Your commitment to maintaining a safe and ethical workplace is highly valued. Thank you for your courage in coming forward.`

	if (params?.response?.login_information?.login)
		message = message.concat(
			`<br><br> <strong>Login:</strong> ${params?.response?.login_information?.login}`
		)

	if (params?.response?.login_information?.email)
		message = message.concat(
			`<br><br> <strong>Email:</strong> ${params?.response?.login_information?.email}`
		)

	return message
}

export function supportTicketBose(params) {
	// let message = `${params?.response?.message} <br> Ticket ID	${params?.response?.ticket_number} `
	const message = `Your report was submitted, and a case was opened under <strong>Ticket ID ${params?.response?.ticket_number}</strong>, please take note of this number in case you want to follow up on this ticket later.`

	return message
}

export function getAlertEmailGraduate(params) {
	return `Please review your personal profile information, and complete any fields that you consider outdated or are empty.`
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

function handleFormEditGraduade(params) {
	return {
		params: {
			model: {
				url: '/',
				meta: 'polestar/api/v1/graduate_updates',
				primaryKey: 'title',
				responseAlert: true,
				callback: {
					form: 'handleCloseFormBottom'
				},
				extras: {
					message: 'Your profile information has been updated successfully.'
				},
				schema: {
					required: [
						'first_name',
						'last_name',
						'city',
						'state',
						'postal_code',
						'country',
						'street_address',
						'phone'
					],
					properties: {
						email_address: {
							order: 1,
							readOnly: true,
							attrs: {
								visible: true
							},
							default: params?.data?.email_address
						},
						first_name: {
							grid: 6,
							order: 1.5,
							default: params?.data?.first_name
						},
						last_name: {
							grid: 6,
							order: 2,
							default: params?.data?.last_name
						},
						city: {
							grid: 6,
							order: 5,
							default: params?.data?.city
						},
						state: {
							grid: 6,
							order: 4,
							default: params?.data?.state
						},
						postal_code: {
							grid: 6,
							order: 6,
							default: params?.data?.postal_code
						},
						country: {
							order: 3,
							grid: 6,
							default: params?.data?.country
						},
						street_address: {
							order: 8,
							default: params?.data?.street_address
						},
						phone: {
							type: 'integer',
							order: 7,
							default: Number(params?.data?.phone)
						}
					}
				},
				defaults: {
					graduate_id: params?.data?.graduate_id
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

	if (!user?.superuser) {
		params.jsonSchema.properties.program_slug.attrs.visible = false
		params.jsonSchema.properties.associate_oid.attrs.visible = false
		params.jsonSchema['required'] = []

		params.$widget.params.model.defaults = {
			program_slug: user?.first_name,
			associate_oid: user?.domain
		}
	}

	return params.jsonSchema
}

function handleFunctionMileageSearchStores(params) {
	const dashboard = params.extra.extra.dashboard

	dashboard.update((dashboardItem: any) => {
		dashboardItem.gridItemsData = {
			stores: [
				{
					store_id: 3397,
					store_name: 'Miami Gardens-WM - #3397',
					latitude: 25.935725,
					longitude: -80.207676
				},
				{
					store_id: 2814,
					store_name: 'HIALEAH-WM - #2814',
					latitude: 25.858609,
					longitude: -80.325508
				},
				{
					store_id: 6397,
					store_name: 'MIAMI-WM-#6397',
					latitude: 25.623903,
					longitude: -80.395205
				},
				{
					store_id: 1680,
					store_name: 'KENDALL-WM  - #1680',
					latitude: 25.685314,
					longitude: -80.448545
				}
			]
		}

		return dashboardItem
	})
}

function handlePreRenderProServicesSearchEmployee(params) {
	// TODO:
	const user = get(storeUser)
	if (!user?.superuser) {
		params.jsonSchema.properties.program_slug.attrs.visible = false
		params.jsonSchema.properties.associate_oid.attrs.visible = false
		params.jsonSchema['required'] = []

		params.$widget.params.model.defaults = {
			program_slug: user?.first_name,
			associate_oid: user?.domain
		}
	}

	return params.jsonSchema
}

async function handlePreRenderWeProtectUforPublic(params) {
	const user = get(storeUser)

	if (user?.apikey) {
		const dataUsersGuests = await getApiData('troc_guest_users', 'GET')
		const userFind = dataUsersGuests.find((item) => item.username === user.username)

		if (userFind) {
			params.jsonSchema.properties.custom_radio.items.enum =
				params.jsonSchema.properties.custom_radio.items.enum.filter(
					(item) => item.value !== 'non_anonymous'
				)
		}
	}

	return params.jsonSchema
}

function handleFunctionProServicesSearchEmployees(params) {
	const dashboard = params.extra.extra.dashboard

	dashboard.update((dashboardItem: any) => {
		dashboardItem.gridItemsData = {
			employees: [
				{
					employee_id: 3397,
					fullname: 'Ricardio Giannotti',
					address: 'Miami Gardens-WM'
				},
				{
					employee_id: 2814,
					fullname: 'Jose Mendoza',
					address: 'HIALEAH-WM'
				},
				{
					employee_id: 6397,
					fullname: 'Jesus Lara',
					address: 'MIAMI-WM'
				},
				{
					employee_id: 1680,
					fullname: 'Eduardo Santaella',
					address: 'KENDALL-WM'
				}
			],
			message:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
		}

		return dashboardItem
	})
}

function handleFunctionCallbackPrePayloadTicketForBose(params) {
	const formData = params.data

	switch (formData?.bose_sla_tier) {
		case '1.Platinum': {
			formData['priority_id'] = '3 high'
			break
		}
		case '2.Gold': {
			formData['priority_id'] = '2 normal'
			break
		}
		case '3.Silver': {
			formData['priority_id'] = '1 low'
			break
		}
	}

	if (!formData?.bose_parts_needed) {
		delete formData['bose_how_many_parts']
		for (let i = 1; i <= 8; i++) {
			delete formData[`bose_part${i}`]
			delete formData[`bose_part${i}_backorder`]
			delete formData[`bose_part${i}_order`]
			delete formData[`bose_part${i}_order_date`]
			delete formData[`bose_part${i}_shipped`]
			delete formData[`bose_part${i}_tracking`]
		}
	}

	return formData
}

function handleFunctionCallbackPrePayloadRequiredInHide(params) {
	const formData = params.data

	params?.params?.callback?.defaults.forEach((item) => {
		formData[item] = params?.extra?.widget?.modelByID[item]
	})

	return formData
}

function handleFunctionBooleanYesOrNot(params) {
	const formData = params.data

	Object.keys(formData).forEach((item) => {
		if ($boolYesOrNot.includes(item)) {
			const $enum = $endSchema.properties[item]?.items?.enum?.find(
				(itemEnum) => itemEnum.value === formData[item]
			)

			if ($enum) {
				formData[item] = $enum
			}
		}
	})

	return formData
}
