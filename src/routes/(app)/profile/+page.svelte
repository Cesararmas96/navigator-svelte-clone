<script lang="ts">
	import { storeUser } from '$lib/stores'
	import Icon from '$lib/components/common/Icon.svelte'
	import { TabItem, Tabs } from 'flowbite-svelte'
	import Profile from '$lib/components/profile/Profile.svelte'
	import PasswordStrength from '$lib/components/forms/PasswordStrength.svelte'
	import PasswordInput from '$lib/components/forms/PasswordInput.svelte'
	import Widget from '$lib/components/widgets/Widget.svelte'
	import { writable } from 'svelte/store'
	import WidgetBox from '$lib/components/widgets/WidgetBox.svelte'

	export let data: any

	$storeUser = data.user
	const session = data.user ? data.user : $storeUser

	let password = ''

	let widget = {
		widget_id: 'f5484f6e-a109-46b3-b09a-a2c09678179b',
		widget_name: 'Model List Template',
		title: 'Organization List',
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
			model: {
				meta: 'api/v1/organizations',
				primaryKey: 'org_id'
			},
			query: {
				slug: '{BASE_URL_API}/api/v1/organizations'
			},
			pqgrid: {
				pageModel: {
					rPP: 500,
					type: 'local',
					rPPOptions: [10, 50, 100, 500, 1000]
				},
				sortModel: {
					sorter: [
						{
							dir: 'down',
							dataIndx: 'org_id'
						}
					]
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
						title: 'New Organization',
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
			oid: {
				hidden: true
			},
			org_id: {
				align: 'left',
				order: 1,
				title: 'ID',
				format: '####'
			},
			actions: {
				order: 10,
				title: 'Actions'
			},
			org_slug: {
				order: 3,
				title: 'Organization Slug'
			},
			is_active: {
				align: 'center',
				order: 8,
				title: 'Active',
				render: 'isActive'
			},
			attributes: {
				order: 6,
				title: 'Attributes',
				render: 'jsonPretty',
				minWidth: '220'
			},
			created_at: {
				hidden: true
			},
			created_by: {
				hidden: true
			},
			updated_at: {
				align: 'center',
				order: 9,
				title: 'Updated At',
				render: 'dateAndTime'
			},
			description: {
				order: 4,
				title: 'Description'
			},
			organization: {
				order: 2,
				title: 'Name'
			}
		},
		query_slug: {
			slug: '{BASE_URL_API}/api/v1/organizations'
		},
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
	}
</script>

<div class="flex flex-1">
	<Profile {session} />

	<div class="flex-auto">
		<Tabs style="pill" contentClass="p-0 mt-2 w-full flex-auto">
			<div class="card mx-3 w-full p-1">
				<div class="nav-scroll gap-1 overflow-visible font-bold text-heading">
					<TabItem open>
						<div slot="title" class="flex w-full items-center gap-2">
							<Icon icon="mdi:user" size="20px" />
							Identities
						</div>
						<div class="card m-3 p-5">
							<div class="mb-4 flex items-start">
								<div class="flex-1">
									<div class="font-bold text-heading">Identity List</div>
									<div class="text-sm text-muted">Description here</div>
								</div>
							</div>
							<WidgetBox
								{widget}
								resized={false}
								let:fixed
								let:isOwner
								let:isToolbarVisible
								let:widget
							>
								<Widget {widget} {fixed} isToolbarVisible={false} {isOwner} />
							</WidgetBox>
							<div
								class="mt-6 flex items-center rounded border border-light-100 font-bold text-heading dark:border-dark-200"
							/>
						</div>
					</TabItem>
					<TabItem>
						<div slot="title" class="flex w-full items-center gap-2">
							<Icon icon="mdi:world" size="20px" />
							Accounts
						</div>
						<div class="card m-3 p-5">
							<div class="mb-4 flex items-start">
								<div class="flex-1">
									<div class="font-bold text-heading">Account List</div>
									<div class="text-sm text-muted">Description here</div>
								</div>
							</div>
							<div />
							<div
								class="mt-6 flex items-center rounded border border-light-100 font-bold text-heading dark:border-dark-200"
							/>
						</div>
					</TabItem>

					<TabItem>
						<div slot="title" class="flex w-full items-center gap-2">
							<Icon icon="mdi:lock" size="20px" />
							Security
						</div>
						<div class="card m-3 p-5">
							<div class="mb-4 flex items-start">
								<div class="flex-1">
									<div class="font-bold text-heading">Security List</div>
									<div class="text-sm text-muted">Description here</div>
								</div>
							</div>
							<div>
								<div class="ml-10 flex-col">
									<div class="mb-6">
										<p>Current password</p>
										<PasswordInput />
									</div>

									<p class="">New password</p>

									<div class="mb-6">
										<PasswordInput />
										<PasswordStrength {password} />
									</div>

									<p>Confirm new password</p>
									<PasswordInput />
								</div>
							</div>
							<div
								class="mt-6 flex items-center rounded border border-light-100 font-bold text-heading dark:border-dark-200"
							/>
						</div>
					</TabItem>
				</div>
			</div>
		</Tabs>
	</div>
</div>
