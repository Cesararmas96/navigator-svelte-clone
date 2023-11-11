import { redirect } from '@sveltejs/kit'
import { users, usergroups } from './[model]/models/users'
import { groups } from './[model]/models/groups'
import { organizations } from './[model]/models/organizations'
import { clients, program_clients, module_clients } from './[model]/models/clients'
import { programs, program_groups, program_categories } from './[model]/models/program'
import { modules, module_groups } from './[model]/models/modules'
import { dashboards } from './[model]/models/dashboards'
import { widgets, widgets_template, widgets_types } from './[model]/models/widgets'

export const load = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/login')

	const reports: any[] = [
		{
			id: 'grafana',
			name: 'Report Grafana',
			description: 'Description Report 1',
			image: '/img/admin/1.jpeg',
			url: 'https://snapshots.raintank.io/dashboard/snapshot/6vmEi6Rc0YvGAgm6tjBKge0f02Qp11Em?orgId=2&refresh=2h'
		},
		{
			id: 'report_2',
			name: 'Report 2',
			description: 'Description Report 2',
			image: '/img/admin/2.jpeg',
			url: 'https://github.com/'
		},
		{
			id: 'report_3',
			name: 'Report 3',
			description: 'Description Report 3',
			image: '/img/admin/3.jpeg',
			url: 'https://github.com/'
		}
	]

	const categories: any[] = [
		// {
		// 	name: 'Manage your Queries',
		// 	icon: 'line-md:account',
		// 	icon2: '',
		// 	models: [
		// 		{
		// 			name: 'Queries',
		// 			model: 'queries',
		// 			wip: true
		// 		}
		// 	]
		// },
		{
			id: 1,
			name: 'Manage your Users',
			icon: 'line-md:account',
			icon2: '',
			models: [
				{
					name: 'Users',
					model: 'users',
					widget: users
				},
				{
					name: 'Users - Groups',
					model: 'usergroups',
					widget: usergroups
				}
			]
		},
		{
			id: 2,
			name: 'Manage your Groups',
			icon: 'line-md:text-box',
			icon2: '',
			models: [
				{
					name: 'Groups',
					model: 'groups',
					widget: groups
				}
			]
		},
		{
			id: 3,
			name: 'Manage your Organizations',
			icon: 'line-md:document-report',
			icon2: '',
			models: [
				{
					name: 'Organizations',
					model: 'organizations',
					widget: organizations
				}
			]
		},
		{
			id: 4,
			name: 'Manage your Clients',
			icon: 'line-md:clipboard-list',
			icon2: '',
			models: [
				{
					name: 'Clients',
					model: 'clients',
					widget: clients
				},

				{
					name: 'Client - Programs',
					model: 'program_clients',
					widget: program_clients
				},
				{
					name: 'Client - Modules',
					model: 'module_clients',
					widget: module_clients
				}
			]
		},
		{
			id: 5,
			name: 'Manage your Programs',
			icon: 'line-md:star',
			icon2: '',
			models: [
				{
					name: 'Programs',
					model: 'programs',
					widget: programs
				},
				{
					name: 'Programs - Clients',
					model: 'program_clients',
					widget: program_clients
				},
				{
					name: 'Programs - Groups',
					model: 'program_groups',
					widget: program_groups
				},
				{
					name: 'Categories',
					model: 'program_categories',
					widget: program_categories
				}
			]
		},
		{
			id: 6,
			name: 'Manage your Modules',
			icon: 'line-md:square-to-confirm-square-transition',
			icon2: '',
			models: [
				{
					name: 'Modules',
					model: 'modules',
					widget: modules
				},

				{
					name: 'Modules - Clients',
					model: 'module_clients',
					widget: module_clients
				},
				{
					name: 'Modules - Groups',
					model: 'module_groups',
					widget: module_groups
				}
			]
		},
		{
			id: 7,
			name: 'Manage your Dashboards',
			icon: 'line-md:computer-twotone',
			icon2: '',
			models: [
				{
					name: 'Dashboards',
					model: 'dashboards',
					widget: dashboards
				}
			]
		},
		{
			id: 8,
			name: 'Manage your Widgets',
			icon: 'line-md:github-loop',
			icon2: '',
			models: [
				{
					name: 'Widgets',
					model: 'widgets',
					widget: widgets
				},
				{
					name: 'Widget Templates',
					model: 'widgets_template',
					widget: widgets_template
				},
				{
					name: 'Widget Types',
					model: 'widgets_types',
					widget: widgets_types
				}
			]
		}
	]

	return { categories, reports, user: locals.user }
}
