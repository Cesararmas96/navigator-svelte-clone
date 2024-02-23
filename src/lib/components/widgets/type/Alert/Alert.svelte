<script lang="ts">
	import { Alert, Button } from 'flowbite-svelte'
	import Icon from '../../../common/Icon.svelte'
	import type { AlertMessage } from '$lib/interfaces/Alert'
	import { dismissAlert } from '$lib/helpers/common/alerts'
	import { getContext } from 'svelte'
	import { actionBtnMap } from '$lib/helpers/widget/alert'

	const widget: any = getContext('widget')
	const dashboard: any = getContext('dashboard')

	export let alert: AlertMessage = $widget.format_definition

	type Color = 'red' | 'green' | 'yellow' | 'blue'
	type Type = 'error' | 'success' | 'warning' | 'info'
	type AlertType = { icon: string; color: Color }

	const types: Record<Type, AlertType> = {
		error: { icon: 'mdi:alert-circle-outline', color: 'red' },
		success: { icon: 'mdi:check-circle-outline', color: 'green' },
		warning: { icon: 'mdi:alert-outline', color: 'yellow' },
		info: { icon: 'mdi:information-outline', color: 'blue' }
	}

	$: color = types[alert.type]?.color

	const onClick = () => {
		alert.props = { ...alert.props, dashboard }
		actionBtnMap[alert.callback!](alert.props)
	}

	const onClick1 = () => {
		dismissAlert(alert.id!)
		alert.callback1!()
	}

	const onClick2 = () => {
		dismissAlert(alert.id!)
		alert.callback2!()
	}
</script>

<Alert border {color} class="animate__animated animate__fadeIn mb-2 ml-[5px] mr-[12px] px-4 py-2">
	<div class="flex flex-col justify-between">
		<div class="flex flex-col items-start justify-center">
			<div class="flex items-center gap-3">
				<Icon icon={types[alert.type]?.icon} size="18" />
				<span class="text-lg font-medium">{alert.title}</span>
			</div>
			{#if alert.message}<p class="mb-2 mt-2">{alert.message}</p>{/if}
		</div>

		<div class="flex flex-row justify-end gap-1">
			{#if alert.callbackBtn}
				<Button {color} class="px-4 py-2" on:click={onClick}>{alert.callbackBtn}</Button>
			{/if}
			{#if alert.callback1Btn}
				<Button {color} class="px-4 py-2" on:click={onClick1}>{alert.callback1Btn}</Button>
			{/if}
			{#if alert.callback2Btn}
				<Button {color} outline class="px-4 py-2" on:click={onClick2}>{alert.callback2Btn}</Button>
			{/if}
		</div>
	</div>
</Alert>
