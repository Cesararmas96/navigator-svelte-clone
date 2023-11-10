<script lang="ts">
	import { storeUser } from '$lib/stores'
	import Widget from '$lib/components/widgets/Widget.svelte'
	import WidgetBox from '$lib/components/widgets/WidgetBox.svelte'
	import Icon from '$lib/components/common/Icon.svelte'

	export let data: any

	$storeUser = data.user

	let widget = {
		widget_id: 'f1184f6e-a109-46b3-b09a-a2c19678179b',
		widget_name: 'Report',
		title: '',
		url: 'https://snapshots.raintank.io/dashboard/snapshot/6vmEi6Rc0YvGAgm6tjBKge0f02Qp11Em?orgId=2&refresh=2h',
		params: {
			settings: {
				appearance: {
					border: false
				}
			}
		},
		attributes: {
			icon: 'material-symbols:iframe',
			color: '#ffffff',
			explorer: 'v3',
			height: 56,
			width: 12,
			fg_color: '#333'
		},
		conditions: {},
		cond_definition: null,
		where_definition: null,
		format_definition: {},
		query_slug: {},
		filtering_show: null,
		master_filtering: true,
		allow_filtering: true,
		save_filtering: false,
		module_id: null,
		program_id: 1,
		dashboard_id: '95f38164-f55f-4881-b7c9-c1df27bed81d',
		widget_slug: null,
		widget_type_id: 'media-iframe',
		description: 'Report',
		widgetcat_id: 1,
		widget_type: 'media-iframe',
		classbase: 'Iframe',
		program_slug: 'troc',
		user_id: null,
		published: true,
		template_id: '20cdd2e6-4234-498c-b103-77e8ad472062',
		like: false,
		pin: false,
		layout: true
	}
</script>

<div class="card m-3 h-screen p-5">
	<div class="mb-4 flex items-center justify-between">
		<h4 class="font-bold leading-none text-heading">Reports</h4>
		<a href="/admin" class="btn h-8 text-primary-500 hover:bg-primary-500/10">
			<Icon icon="tabler:arrow-back-up" size="18" />
			<span class="pl-1 font-bold">Go Back</span>
		</a>
	</div>
	<div class=" h-full pb-10">
		<WidgetBox {widget} resized={false} let:fixed let:isOwner let:isToolbarVisible let:widget>
			<Widget {widget} {fixed} isToolbarVisible={false} {isOwner} />
		</WidgetBox>
		<!-- <div
			class="mt-6 flex items-center rounded border border-light-100 font-bold text-heading dark:border-dark-200"
		/> -->
	</div>
</div>
