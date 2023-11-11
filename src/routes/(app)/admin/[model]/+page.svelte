<script lang="ts">
	import { storeUser } from '$lib/stores'
	import Widget from '$lib/components/widgets/Widget.svelte'
	import WidgetBox from '$lib/components/widgets/WidgetBox.svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import { merge } from 'lodash-es'

	export let data: any

	$storeUser = data.user

	const { model } = data

	console.log('MODEL', model)

	let widget = merge(
		{},
		{
			widget_id: 'f1184f1e-a109-46b3-b09a-a2c09678179b',
			widget_name: 'Model',
			title: 'List',
			url: null,
			params: {
				settings: {
					appearance: {
						border: false
					}
				},
				ajax: {
					method: 'GET'
				},
				// model: {
				// 	meta: `api/v1/${model.model}`,
				// 	primaryKey: model.model
				// },
				pqgrid: {
					pageModel: {
						rPP: 500,
						type: 'local',
						rPPOptions: [10, 50, 100, 500, 1000]
					}
				},
				actions: {
					btns: ['edit', 'delete'],
					postRender: 'postRenderFormBuilder'
				},
				btnsActions: {
					top: {
						createModelWithFormBuilder: {
							icon: 'fa fa-plus',
							class: 'pull-right',
							title: 'New Model',
							method: 'createModelWithFormBuilder',
							classMain: 'mr-7'
						}
					},
					topClass: 'pull-right'
				},
				toolbar_items: ['filter', 'export_raw'],
				hiddenCheckbox: true
			},
			attributes: {
				icon: 'fa fa-table',
				color: '#ffffff',
				explorer: 'v2',
				fg_color: '#333'
			},
			conditions: {},
			cond_definition: null,
			where_definition: null,
			format_definition: {
				actions: {
					order: 10,
					title: 'Actions'
				}
			},
			// query_slug: {
			// 	slug: `{BASE_URL_API}/api/v1/${model.model}`
			// },
			filtering_show: null,
			master_filtering: true,
			allow_filtering: true,
			save_filtering: false,
			module_id: null,
			program_id: 1,
			dashboard_id: '95f38164-f55f-4881-b7c9-c1df27bed80d',
			widget_slug: null,
			widget_type_id: 'api-selectPqTable',
			description: 'Model List Template',
			widgetcat_id: 1,
			widget_type: 'api-selectPqTable',
			classbase: 'selectpqtableWidget',
			program_slug: 'troc',
			user_id: null,
			published: true,
			template_id: '8620dfd4-23de-425f-8c97-607e68a34466',
			like: false,
			pin: false,
			layout: true
		},
		model?.widget
	)

	console.log(JSON.stringify(widget))
</script>

<div class="card m-3 h-screen p-5">
	<div class="mb-4 flex items-center justify-between">
		<h4 class="flex items-center justify-center font-bold leading-none text-heading">
			<Icon icon="line-md:clipboard-list" size="16" classes="pr-1" />
			{model.name}
		</h4>
		<a href="/admin" class="btn h-8 text-primary-500 hover:bg-primary-500/10">
			<Icon icon="tabler:arrow-back-up" size="18" />
			<span class="pl-1 font-bold">Go Back</span>
		</a>
	</div>
	<div class=" h-full pb-12">
		<WidgetBox {widget} resized={false} let:fixed let:isOwner let:isToolbarVisible let:widget>
			<Widget {widget} {fixed} isToolbarVisible={false} {isOwner} />
		</WidgetBox>

		<!-- <div
			class="mt-auto flex items-center rounded border border-light-100 font-bold text-heading dark:border-dark-200"
		/> -->
	</div>
	<!-- <div
		class="mt-auto flex items-center rounded border border-light-100 font-bold text-heading dark:border-dark-200"
	/> -->
</div>
