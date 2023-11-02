// import {selectedWidgetMaximize} from "$lib/stores/widgets";
// import {getData} from "$lib/services/getData";
// import type {WidgetAction} from "../../../interfaces/widgets/actions";

// export async function fetchData(selectedWidget: any, url, method) {
//     return (selectedWidget?.data) ? selectedWidget.data : getData(url, method);
// }

// export async function reloadData(url, method): Promise<any> {
//     return getData(url, method);
// }

// export function storeData(data, widget): void {
//     selectedWidgetMaximize.set({
//         data, widget: widget
//     });
// }

// export function addWidgetAction(
//     widgetActions: WidgetAction[],
//     name: string,
//     action: () => void
// ): WidgetAction[] {
//     const existingAction = widgetActions.find((action) => action.name === name);
//     if (!existingAction) {
//         widgetActions.push({
//             name,
//             action,
//         });
//     } else {
//         existingAction.action = action;
//     }
//     return widgetActions;
// }

const baseUrl = import.meta.env.VITE_API_URL

export async function insertWidget(token: string, data: object) {
	const url = `${baseUrl}/api/v2/widgets`
	const accessToken = token // Replace with your actual access token

	const headers = {
		Authorization: `Bearer ${accessToken}`,
		'Content-Type': 'application/json'
	}

	const requestOptions = {
		method: 'PUT',
		headers: headers,
		body: JSON.stringify(data)
	}

	try {
		const response = await fetch(url, requestOptions)
		if (!response.ok) {
			throw new Error('Network response was not ok')
		}
		const responseData = await response.json()
		console.log('Response data:', responseData)
	} catch (error) {
		console.error('Error:', error)
	}
}

export const getWidgetCategories = async (templates) => {
	const uniqueIds = new Set()

	templates.forEach((item) => {
		if (item.widget_type_id.includes('api-')) {
			item.widget_type_id = item.widget_type_id.replace('api-', '')
		}
		if (item.widget_type_id.includes('-')) {
			item.widget_type_id = item.widget_type_id.replaceAll('-', ' ')
		}

		item.widget_type_id = item.widget_type_id
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')

		uniqueIds.add(item.widget_type_id)
	})

	const categories = [...uniqueIds].sort()

	console.log(categories)

	return categories
}

export const getWidgetCategory = (template) => {
	let widgetTypeId = template.widget_type_id

	if (widgetTypeId.includes('api-')) {
		widgetTypeId = widgetTypeId.replace('api-', '')
	}
	if (widgetTypeId.includes('-')) {
		widgetTypeId = widgetTypeId.replaceAll('-', ' ')
	}

	widgetTypeId = widgetTypeId
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')

	return widgetTypeId
}
