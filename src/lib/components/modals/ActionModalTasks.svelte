<script lang="ts">
	import { postData } from '$lib/services/getData'
	import {
		sendErrorNotification,
		sendSuccessNotification,
		sendWarningNotification
	} from '$lib/stores/toast'
	import { Button } from 'flowbite-svelte'

	export let props: {
		data: any
	}
	const { data } = props
	let active = true
	let loading = false
	let environment = 'dev'
	let conditions = {}
	let isQueue = true
	let selectEnvironment = false

	const executeTask = () => {
		console.log('executeTask', data)
		if (data.is_queued) {
			active = false
			runTask()
			sendSuccessNotification('Task Running')
		} else {
			isQueue = false
			runTask()
			sendWarningNotification('Please wait while the task is processed')
		}
	}

	const runTask = async () => {
		console.log(conditions)

		// const url = `${import.meta.env.VITE_API_URL}/api/v2/task/${data.program_slug}/${
		// 	data.task
		// }?long_running=true`
		// console.log(url)
		// const response = await postData(url, {
		// 	...{
		// 		environment: selectEnvironment ? environment : null
		// 	},
		// 	...conditions
		// 	// ...this.args,
		// }).catch((error) => {
		// 	active = false
		// 	sendErrorNotification(error)
		// })

		// if (response && response.status) {
		// 	active = false
		// 	if (response.status === 200) {
		//     sendSuccessNotification(response.data.message)
		// 		// $('.widget-reload').click()
		// 	} else {
		//     sendWarningNotification(response.data.message)
		// 	}
		// }
	}
</script>

<div class="flex flex-col">
	<div>
		The task will be executed:
		<strong>{props.data.program_slug}</strong>
		<strong>{props.data.task}</strong>.
	</div>
	<div class="flex justify-end"><Button class="mr-2" on:click={executeTask}>Execute</Button></div>
</div>
