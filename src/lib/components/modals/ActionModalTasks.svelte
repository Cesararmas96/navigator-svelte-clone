<script lang="ts">
	import { closeModal, openModal } from '$lib/helpers/common/modal'
	import { postData } from '$lib/services/getData'
	import { loading } from '$lib/stores/preferences'
	import {
		sendErrorNotification,
		sendSuccessNotification,
		sendWarningNotification
	} from '$lib/stores/toast'
	import { Button } from 'flowbite-svelte'

	export let props: {
		action: string
		data: any
		callback?: () => void
	}
	const { action, data, callback } = props
	let active = true
	// let loading = false
	let environment = 'dev'
	let conditions = {}
	let isQueue = true
	let selectEnvironment = false

	enum Actions {
		PLAY = 'The task will be executed',
		UPLOAD = 'Upload for the task'
	}
	enum ActionsBtn {
		PLAY = 'Execute',
		UPLOAD = 'Create Upload'
	}

	const executeTask = async () => {
		if (action === 'PLAY') {
			if (data.is_queued) {
				active = false
				runTask()
				sendSuccessNotification('Task Running')
			} else {
				isQueue = false
				runTask()
				sendWarningNotification('Please wait while the task is processed')
			}
		} else {
			$loading = true
			try {
				createUpload()
			} catch (error) {
				sendErrorNotification(error)
			} finally {
				$loading = false
			}
		}
	}

	const runTask = async () => {
		const url = `${import.meta.env.VITE_API_URL}/api/v2/task/${data.program_slug}/${
			data.task
		}?long_running=true`
		const response = await postData(url, {
			...{
				environment: selectEnvironment ? environment : null
			},
			...conditions
			// ...this.args,
		}).catch((error) => {
			active = false
			sendErrorNotification(error)
		})

		if (response && response.status) {
			active = false
			if (response.status === 200) {
				sendSuccessNotification(response.data.message)
				// $('.widget-reload').click()
			} else {
				sendWarningNotification(response.data.message)
			}
			callback && callback()
		}
	}

	const createUpload = async () => {
		let file: any = {}
		if (
			(data.file_id && !data.filename) ||
			(data.attributes && data.attributes.file_id && !data.filename)
		) {
			const response = await postData(
				`${process.env.BASE_URL_API}/api/v2/services/queries/troc_files`,
				{
					fields: [
						'file_id',
						'file_uid',
						'file_slug',
						'mimetype',
						'filename',
						'module_id',
						'program_id',
						'program_slug',
						'params'
					],
					where_cond: {
						file_id: data.file_id || data.attributes.file_id
					}
				}
			)

			if (response && response[0]) {
				file = response[0]
			}
		} else if (data.filename) {
			file = data
		} else {
			file = data.attributes.task_config
		}

		document.querySelectorAll('.widget-container-temp').forEach(function (target) {
			target.remove()
		})

		let fileExt =
			data.attributes && data.attributes.task_config && data.attributes.task_config.filename
				? data.attributes.task_config.filename.name.split('.').slice(-1)[0]
				: file.mimetype
		let title = data.task
		if (file.filename && file.filename.name) {
			fileExt = file.filename.name.split('.').slice(-1)[0]
			title = file.filename.name
		}
		closeModal()
		setTimeout(() => {
			openModal('File Upload', 'DropzoneModal', {
				size: 'lg',
				path: '/',
				props: {
					subtitle: `Upload [${file.program_slug}] Filename: ${title}`,
					runTask: {
						task_name: file.params && file.params.task_id ? file.params.task_id : null,
						status:
							file.params && file.params.status_load_data ? file.params.status_load_data : false,
						url: `/api/v2/task/${file.program_slug}/`,
						method: 'post',
						statusCode: null,
						message: null
					},
					dropzoneOptions: {
						mimetype: file.mimetype,
						file_slug: file.file_slug,
						acceptedFiles: `.${fileExt}`,
						dontShowAcceptedFiles: true
					}
				}
			})
		}, 200)
		// this.datae.createWidget(
		// 	{
		// 		panel: 'top',
		// 		classbase: 'Dropzone',
		// 		title: `Upload [${file.program_slug}] Filename: ${title}`,
		// 		params: {
		// 			buttonClose: false,
		// 			show: true,
		// 			preview: true,
		// 			hideElement: ['title', 'pop', 'reload', 'collapse', 'expand', 'others'],
		// 			hideToolbar: false,
		// 			runTask: {
		// 				task_name: file.params && file.params.task_id ? file.params.task_id : null,
		// 				status:
		// 					file.params && file.params.status_load_data ? file.params.status_load_data : false,
		// 				url: `/api/v2/task/${file.program_slug}/`,
		// 				method: 'post',
		// 				statusCode: null,
		// 				message: null
		// 			},
		// 			lastUploaded: { status: false },
		// 			labelExtras: [
		// 				{
		// 					text: "Don't execute task after upload",
		// 					type: 'checkbox',
		// 					label: 'task',
		// 					value: false
		// 				},
		// 				{
		// 					text: 'Return inmediately (No wait for task completion)',
		// 					type: 'checkbox',
		// 					label: 'long_running',
		// 					value: false
		// 				}
		// 			],
		// 			dropzoneOptions: {
		// 				mimetype: file.mimetype,
		// 				file_slug: file.file_slug,
		// 				acceptedFiles: `.${fileExt}`,
		// 				dontShowAcceptedFiles: true
		// 			},
		// 			xhrData: {
		// 				// environment: this.environment,
		// 				module_id: file.module_id,
		// 				program_slug: file.program_slug
		// 			}
		// 		}
		// 	},
		// 	this.datae.ui
		// )

		active = false
	}
</script>

<div class="flex flex-col">
	<div>
		{Actions[action]}:
		<strong>{props.data.task}</strong>.
	</div>
	<div class="flex justify-end">
		<Button class="mr-2" on:click={executeTask}>{ActionsBtn[action]}</Button>
	</div>
</div>
