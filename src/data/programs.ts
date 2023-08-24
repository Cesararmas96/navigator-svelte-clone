export const programs = [
	{
		program_id: 7,
		program_name: 'OPERATIONS',
		program_slug: 'operations',
		active: true,
		image_url: 'images/Promociones_Apple.jpg',
		description: '',
		visible: true,
		program_type_id: 2,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 58,
		program_name: 'WSP VIBA',
		program_slug: 'wsp_viba',
		active: true,
		image_url: '',
		description: 'wsp_viba',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: {
			filtering: {
				date: {
					name: 'Pick a date range',
					type: 'date',
					order: 0,
					params: {
						dateRange: ['custom', 'mtd', 'weekly']
					},
					hierarchy: false
				},
				store: {
					id: 'store_id',
					name: 'Store',
					order: 4,
					value: 'store_name',
					format: 'string',
					hierarchy: true
				},
				projects: {
					id: 'project_id',
					name: 'Project',
					slug: 'wsp_viba_projects',
					order: 1,
					value: 'project_name',
					hierarchy: false
				},
				retailer: {
					id: 'account_id',
					name: 'Retailer',
					order: 3,
					value: 'account_name',
					hierarchy: true
				},
				product_name: {
					id: 'product_name',
					jump: true,
					name: 'Product',
					slug: 'wsp_viba_products',
					order: 5,
					value: 'product_name',
					format: 'string',
					operator: 'OR',
					hierarchy: false
				}
			},
			filteringadv: {
				test_call: {
					id: 'hide_test_calls',
					name: 'Hide Test Calls',
					type: 'checkbox',
					order: 1,
					value: 'hide_test_calls',
					options: {
						test_call: {
							id: 'hide_test_calls',
							text: '',
							value: true
						}
					},
					selected: true,
					hierarchy: false
				},
				agent_name: {
					id: 'user_id',
					name: 'Agent Name',
					slug: 'wsp_viba_agents',
					order: 0,
					value: 'full_name',
					hierarchy: false
				}
			}
		},
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: null,
		media: null
	},
	{
		program_id: 13,
		program_name: 'badger',
		program_slug: 'badger',
		active: true,
		image_url: 'apps/badger/images/badger-logo.png',
		description: '',
		visible: true,
		program_type_id: 2,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 5,
		program_name: 'Apple',
		program_slug: 'apple',
		active: true,
		image_url: 'images/troc/logo-apple.png',
		description: '',
		visible: true,
		program_type_id: 2,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 14,
		program_name: 'Best Buy',
		program_slug: 'best_buy',
		active: false,
		image_url: '-',
		description: '',
		visible: false,
		program_type_id: 2,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 15,
		program_name: 'Camping World',
		program_slug: 'camping_world',
		active: false,
		image_url: '-',
		description: '',
		visible: false,
		program_type_id: 2,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 16,
		program_name: 'Walmart External',
		program_slug: 'wm',
		active: true,
		image_url: 'apps/wm/images/wm-logo.png',
		description: '',
		visible: true,
		program_type_id: 2,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 59,
		program_name: 'USC WM',
		program_slug: 'usc_wm',
		active: true,
		image_url: '',
		description: 'usc_wm',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 8,
		program_name: 'Retail',
		program_slug: 'retail',
		active: true,
		image_url: 'apps/retail/images/demo_logo_02.png',
		description: '',
		visible: true,
		program_type_id: 2,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 9,
		program_name: 'Brand Ambassador',
		program_slug: 'next',
		active: true,
		image_url: 'apps/next/images/demo_logo_01.png',
		description: '',
		visible: true,
		program_type_id: 2,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 25,
		program_name: 'HR',
		program_slug: 'hr',
		active: true,
		image_url: 'images/hr.jpg',
		description: '',
		visible: true,
		program_type_id: 2,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 20,
		program_name: 'Merchandising',
		program_slug: 'merchandising',
		active: true,
		image_url: 'apps/merchandising/images/demo_logo_03.png',
		description: '',
		visible: true,
		program_type_id: 2,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 23,
		program_name: 'WM Assembly',
		program_slug: 'wm_assembly',
		active: true,
		image_url: 'images/troc/walmart-logo-600x600.png',
		description: null,
		visible: true,
		program_type_id: 2,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 24,
		program_name: 'WM Reset',
		program_slug: 'wm_reset',
		active: true,
		image_url: 'images/troc/walmart-logo-600x600.png',
		description: '',
		visible: true,
		program_type_id: 2,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 12,
		program_name: 'MI Places',
		program_slug: 'trocplaces',
		active: true,
		image_url: 'apps/trocplaces/images/mi-logo.png',
		description: '',
		visible: true,
		program_type_id: 2,
		allow_filtering: null,
		filtering_show: null,
		conditions: {
			fdate: true,
			store: {
				fields: [
					'company_id',
					'program_id',
					'state_code',
					'city_id',
					'zipcode',
					'store_type',
					'store_id',
					'adp_location_code',
					'store_number',
					'company_name',
					'program_slug',
					'state',
					'city',
					'zipcode',
					'store_type_desc',
					'store_name',
					'adp_location_code',
					'store_number'
				]
			}
		},
		attributes: null,
		media: null
	},
	{
		program_id: 61,
		program_name: 'tmobile',
		program_slug: 'tmobile',
		active: true,
		image_url: '/',
		description: 'tmobile',
		visible: true,
		program_type_id: 4,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 21,
		program_name: 'Xfinity',
		program_slug: 'xfinity',
		active: true,
		image_url: 'apps/xfinity/images/xfinity-logo.png',
		description: null,
		visible: true,
		program_type_id: 2,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 6,
		program_name: 'Loreal',
		program_slug: 'loreal',
		active: true,
		image_url: 'images/loreal_logo_VXTttTu.png',
		description: null,
		visible: true,
		program_type_id: 4,
		allow_filtering: null,
		filtering_show: null,
		conditions: {
			hideToolbar: ['filtering'],
			hideToolbarWidget: ['filtering', 'clone']
		},
		attributes: null,
		media: null
	},
	{
		program_id: 56,
		program_name: 'bose',
		program_slug: 'bose',
		active: true,
		image_url: '',
		description: 'bose',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 27,
		program_name: 'AT&T',
		program_slug: 'att',
		active: true,
		image_url: 'apps/att/images/att-logo.png',
		description: 'Human Resources',
		visible: false,
		program_type_id: 4,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 43,
		program_name: 'WORP',
		program_slug: 'worp',
		active: true,
		image_url: 'logo.png',
		description: 'worp',
		visible: true,
		program_type_id: 4,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 41,
		program_name: 'US Cellular',
		program_slug: 'us_cellular',
		active: true,
		image_url: 'logo.png',
		description: 'us_cellular',
		visible: true,
		program_type_id: 4,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 1,
		program_name: 'Self Service',
		program_slug: 'troc',
		active: true,
		image_url: '-',
		description: null,
		visible: true,
		program_type_id: 4,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 4,
		program_name: 'MSO',
		program_slug: 'mso',
		active: true,
		image_url: 'images/troc/mso-logo-600x600.jpg',
		description: null,
		visible: true,
		program_type_id: 2,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 11,
		program_name: 'Lets Talk Mobile',
		program_slug: 'ltm',
		active: true,
		image_url: '-',
		description: null,
		visible: true,
		program_type_id: 2,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 10,
		program_name: 'Samsung',
		program_slug: 'samsung',
		active: true,
		image_url: 'apps/samsung/images/Samsung-Logo.jpg',
		description: null,
		visible: true,
		program_type_id: 2,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 19,
		program_name: 'Epson',
		program_slug: 'epson',
		active: true,
		image_url: 'apps/epson/images/epson-logo.png',
		description: null,
		visible: true,
		program_type_id: 4,
		allow_filtering: null,
		filtering_show: null,
		conditions: {
			placeholderSelectR: 'All'
		},
		attributes: {
			hierarchy: [
				'territory_id',
				'region_id',
				'cluster_id',
				'market_id',
				'store_id',
				'retailer_slug',
				'store_type'
			],
			description: 'user_role',
			users_table: 'users',
			role_attribute: 'user_role',
			user_attribute: 'username'
		},
		media: null
	},
	{
		program_id: 57,
		program_name: 'VIBA Demo',
		program_slug: 'viba_demo',
		active: true,
		image_url: '',
		description: 'viba_demo',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: {
			filtering: {
				date: {
					name: 'Pick a date range',
					type: 'date',
					order: 0,
					params: {
						dateRange: ['custom', 'mtd', 'weekly']
					},
					hierarchy: false
				},
				store: {
					id: 'store_id',
					name: 'Store',
					order: 4,
					value: 'store_name',
					format: 'string',
					hierarchy: true
				},
				projects: {
					id: 'project_id',
					name: 'Project',
					slug: 'viba_demo_projects',
					order: 1,
					value: 'project_name',
					hierarchy: false
				},
				retailer: {
					id: 'account_id',
					name: 'Retailer',
					order: 3,
					value: 'account_name',
					hierarchy: true
				},
				product_name: {
					id: 'product_name',
					jump: true,
					name: 'Product',
					slug: 'viba_demo_products',
					order: 5,
					value: 'product_name',
					format: 'string',
					operator: 'OR',
					hierarchy: false
				}
			},
			filteringadv: {
				test_call: {
					id: 'hide_test_calls',
					name: 'Hide Test Calls',
					type: 'checkbox',
					order: 1,
					value: 'hide_test_calls',
					options: {
						test_call: {
							id: 'hide_test_calls',
							text: '',
							value: true
						}
					},
					selected: true,
					hierarchy: false
				},
				agent_name: {
					id: 'user_id',
					name: 'Agent Name',
					slug: 'viba_demo_agents',
					order: 0,
					value: 'full_name',
					hierarchy: false
				}
			}
		},
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: null,
		media: null
	},
	{
		program_id: 35,
		program_name: 'Hit Network',
		program_slug: 'hit_network',
		active: true,
		image_url: 'logo.png',
		description: 'hit_network',
		visible: true,
		program_type_id: 4,
		allow_filtering: null,
		filtering_show: null,
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: null,
		media: null
	},
	{
		program_id: 18,
		program_name: 'Oculus',
		program_slug: 'facebook',
		active: true,
		image_url: 'images/Facebook-Logo.jpg',
		description: null,
		visible: true,
		program_type_id: 4,
		allow_filtering: null,
		filtering_show: null,
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: null,
		media: null
	},
	{
		program_id: 44,
		program_name: 'VIBA Marketing',
		program_slug: 'vibamarketing',
		active: true,
		image_url: '.',
		description: 'vibamarketing',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: null,
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: null,
		media: null
	},
	{
		program_id: 40,
		program_name: 'TCL',
		program_slug: 'tcl',
		active: true,
		image_url: 'logo.png',
		description: 'tcl',
		visible: true,
		program_type_id: 4,
		allow_filtering: null,
		filtering_show: null,
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: null,
		media: null
	},
	{
		program_id: 36,
		program_name: 'Entel Peru',
		program_slug: 'entel_peru',
		active: true,
		image_url: 'logo.png',
		description: 'entel_peru',
		visible: true,
		program_type_id: 4,
		allow_filtering: null,
		filtering_show: null,
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: null,
		media: null
	},
	{
		program_id: 39,
		program_name: 'Claro Chile',
		program_slug: 'claro_chile',
		active: true,
		image_url: 'logo.png',
		description: 'claro_chile',
		visible: true,
		program_type_id: 4,
		allow_filtering: null,
		filtering_show: null,
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: null,
		media: null
	},
	{
		program_id: 48,
		program_name: 'Spectrum',
		program_slug: 'tro_charter',
		active: true,
		image_url: 'logo.png',
		description: 'Spectrum',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: null,
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: null,
		media: null
	},
	{
		program_id: 49,
		program_name: 'tro_xfinity',
		program_slug: 'tro_xfinity',
		active: true,
		image_url: '',
		description: 'tro_xfinity',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 52,
		program_name: 'boost',
		program_slug: 'boost',
		active: true,
		image_url: '',
		description: 'boost',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 47,
		program_name: 'Hisense',
		program_slug: 'hisense',
		active: true,
		image_url: 'photo.png',
		description: 'hisense',
		visible: true,
		program_type_id: 4,
		allow_filtering: null,
		filtering_show: {
			filtering: {
				date: {
					jump: false,
					name: 'Pick a date range',
					type: 'date',
					order: 0,
					params: {
						period: 'mtd',
						dateRange: ['mtd', 'weekly', 'custom']
					},
					hierarchy: false
				},
				store: {
					id: 'store_id',
					name: 'Store Number',
					order: 6,
					value: 'store_name',
					format: 'string',
					hierarchy: true
				},
				market: {
					id: 'market_id',
					name: 'Market',
					order: 5,
					value: 'market_name',
					format: 'string',
					hierarchy: true
				},
				region: {
					id: 'region_id',
					name: 'Region',
					order: 3,
					value: 'region_name',
					format: 'string',
					hierarchy: true
				},
				cluster: {
					id: 'district_id',
					name: 'Cluster',
					order: 4,
					value: 'district_name',
					format: 'string',
					hierarchy: true
				},
				coverage: {
					id: 'store_type',
					jump: true,
					name: 'Coverage Type',
					order: 2,
					value: 'store_type',
					format: 'string',
					hierarchy: true
				},
				retailer: {
					id: 'account_id',
					name: 'Retailer',
					order: 1,
					value: 'account_name',
					hierarchy: true
				}
			}
		},
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: null,
		media: null
	},
	{
		program_id: 60,
		program_name: 'King Water',
		program_slug: 'kingwater_viba',
		active: true,
		image_url: '',
		description: 'kingwater_viba',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: {
			filtering: {
				date: {
					name: 'Pick a date range',
					type: 'date',
					order: 0,
					params: {
						dateRange: ['custom', 'mtd', 'weekly']
					},
					hierarchy: false
				},
				store: {
					id: 'store_id',
					name: 'Store',
					order: 4,
					value: 'store_name',
					format: 'string',
					hierarchy: true
				},
				projects: {
					id: 'project_id',
					name: 'Project',
					slug: 'kingwater_viba_projects',
					order: 1,
					value: 'project_name',
					hierarchy: false
				},
				retailer: {
					id: 'account_id',
					name: 'Retailer',
					order: 3,
					value: 'account_name',
					hierarchy: true
				},
				product_name: {
					id: 'product_name',
					jump: true,
					name: 'Product',
					slug: 'kingwater_viba_products',
					order: 5,
					value: 'product_name',
					format: 'string',
					operator: 'OR',
					hierarchy: false
				}
			},
			filteringadv: {
				test_call: {
					id: 'hide_test_calls',
					name: 'Hide Test Calls',
					type: 'checkbox',
					order: 1,
					value: 'hide_test_calls',
					options: {
						test_call: {
							id: 'hide_test_calls',
							text: '',
							value: true
						}
					},
					selected: true,
					hierarchy: false
				},
				agent_name: {
					id: 'user_id',
					name: 'Agent Name',
					slug: 'kingwater_viba_agents',
					order: 0,
					value: 'full_name',
					hierarchy: false
				}
			}
		},
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: null,
		media: null
	},
	{
		program_id: 26,
		program_name: 'Cricket',
		program_slug: 'cricket',
		active: true,
		image_url: 'images/logo-cricket.png',
		description: 'Cricket',
		visible: true,
		program_type_id: 4,
		allow_filtering: true,
		filtering_show: {
			filtering: {
				date: {
					jump: true,
					name: 'Pick a date range',
					type: 'date',
					order: 0,
					params: {
						period: 'mtd'
					},
					hierarchy: false
				},
				store: {
					id: 'store_id',
					name: 'Store',
					order: 7,
					value: 'store_name',
					hierarchy: true
				},
				market: {
					id: 'market_id',
					name: 'Market',
					order: 6,
					value: 'market_name',
					hierarchy: true
				},
				region: {
					id: 'region_id',
					name: 'Region',
					order: 4,
					value: 'region_name',
					hierarchy: true
				},
				district: {
					id: 'district_id',
					name: 'Area',
					order: 5,
					value: 'district_name',
					hierarchy: true
				},
				rep_name: {
					id: 'rep_name',
					jump: true,
					name: 'Rep Name',
					order: 3,
					value: 'rep_name',
					hierarchy: true
				},
				retailer: {
					id: 'retailer_slug',
					name: 'Retailer',
					order: 1,
					value: 'account_name',
					hierarchy: true
				},
				regional_manager: {
					id: 'regional_manager',
					name: 'Regional Manager',
					order: 2,
					value: 'regional_manager',
					hierarchy: true
				}
			}
		},
		conditions: {
			moduleRedirect: {
				fieldactivity: ['superuser', 'cricket']
			}
		},
		attributes: null,
		media: null
	},
	{
		program_id: 37,
		program_name: 'Totalplay',
		program_slug: 'totalplay',
		active: true,
		image_url: '.',
		description: 'totalplay',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: null,
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: null,
		media: null
	},
	{
		program_id: 53,
		program_name: 'tro_survey',
		program_slug: 'tro_survey',
		active: true,
		image_url: '',
		description: 'tro_survey',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 54,
		program_name: 'Meta VIBA',
		program_slug: 'meta_viba',
		active: true,
		image_url: '',
		description: 'meta_viba',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: {
			filtering: {
				date: {
					name: 'Pick a date range',
					type: 'date',
					order: 0,
					params: {
						dateRange: ['custom', 'mtd', 'weekly']
					},
					hierarchy: false
				},
				store: {
					id: 'store_id',
					name: 'Store',
					order: 4,
					value: 'store_name',
					format: 'string',
					hierarchy: true
				},
				projects: {
					id: 'project_id',
					name: 'Project',
					slug: 'meta_viba_projects',
					order: 1,
					value: 'project_name',
					hierarchy: false
				},
				retailer: {
					id: 'account_id',
					name: 'Retailer',
					order: 3,
					value: 'account_name',
					hierarchy: true
				},
				product_name: {
					id: 'product_name',
					jump: true,
					name: 'Product',
					slug: 'meta_viba_products',
					order: 5,
					value: 'product_name',
					format: 'string',
					operator: 'OR',
					hierarchy: false
				}
			},
			filteringadv: {
				test_call: {
					id: 'hide_test_calls',
					name: 'Hide Test Calls',
					type: 'checkbox',
					order: 1,
					value: 'hide_test_calls',
					options: {
						test_call: {
							id: 'hide_test_calls',
							text: '',
							value: true
						}
					},
					selected: true,
					hierarchy: false
				},
				agent_name: {
					id: 'user_id',
					name: 'Agent Name',
					slug: 'meta_viba_agents',
					order: 0,
					value: 'full_name',
					hierarchy: false
				}
			}
		},
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: null,
		media: null
	},
	{
		program_id: 55,
		program_name: 'Walmart Mexico',
		program_slug: 'walmart_mexico_viba',
		active: true,
		image_url: '',
		description: 'walmart_mexico_viba',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: {
			filtering: {
				date: {
					name: 'Pick a date range',
					type: 'date',
					order: 0,
					params: {
						dateRange: ['custom', 'mtd', 'weekly']
					},
					hierarchy: false
				},
				store: {
					id: 'store_id',
					name: 'Store',
					order: 4,
					value: 'store_name',
					format: 'string',
					hierarchy: true
				},
				projects: {
					id: 'project_id',
					name: 'Project',
					slug: 'walmart_mexico_viba_projects',
					order: 1,
					value: 'project_name',
					hierarchy: false
				},
				retailer: {
					id: 'account_id',
					name: 'Retailer',
					order: 3,
					value: 'account_name',
					hierarchy: true
				},
				product_name: {
					id: 'product_name',
					jump: true,
					name: 'Product',
					slug: 'walmart_mexico_viba_products',
					order: 5,
					value: 'product_name',
					format: 'string',
					operator: 'OR',
					hierarchy: false
				}
			},
			filteringadv: {
				test_call: {
					id: 'hide_test_calls',
					name: 'Hide Test Calls',
					type: 'checkbox',
					order: 1,
					value: 'hide_test_calls',
					options: {
						test_call: {
							id: 'hide_test_calls',
							text: '',
							value: true
						}
					},
					selected: true,
					hierarchy: false
				},
				agent_name: {
					id: 'user_id',
					name: 'Agent Name',
					slug: 'walmart_mexico_viba_agents',
					order: 0,
					value: 'full_name',
					hierarchy: false
				}
			}
		},
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: null,
		media: null
	},
	{
		program_id: 63,
		program_name: 'Cypress',
		program_slug: 'cypress',
		active: true,
		image_url: 'null',
		description: 'cypress',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: {
			filtering: {
				date: {
					name: 'Pick a date range',
					type: 'date',
					order: 0,
					params: {
						dateRange: ['custom', 'mtd', 'weekly']
					},
					hierarchy: false
				},
				store: {
					id: 'store_id',
					name: 'Store',
					order: 4,
					value: 'store_name',
					format: 'string',
					hierarchy: true
				},
				projects: {
					id: 'project_id',
					name: 'Project',
					slug: 'cypress_projects',
					order: 1,
					value: 'project_name',
					hierarchy: false
				},
				retailer: {
					id: 'account_id',
					name: 'Retailer',
					order: 3,
					value: 'account_name',
					hierarchy: true
				},
				product_name: {
					id: 'product_name',
					jump: true,
					name: 'Product',
					slug: 'cypress_products',
					order: 5,
					value: 'product_name',
					format: 'string',
					operator: 'OR',
					hierarchy: false
				}
			},
			filteringadv: {
				test_call: {
					id: 'hide_test_calls',
					name: 'Hide Test Calls',
					type: 'checkbox',
					order: 1,
					value: 'hide_test_calls',
					options: {
						test_call: {
							id: 'hide_test_calls',
							text: '',
							value: true
						}
					},
					selected: true,
					hierarchy: false
				},
				agent_name: {
					id: 'user_id',
					name: 'Agent Name',
					slug: 'cypress_agents',
					order: 0,
					value: 'full_name',
					hierarchy: false
				}
			}
		},
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: null,
		media: null
	},
	{
		program_id: 46,
		program_name: 'Banco de Chile',
		program_slug: 'banco_chile',
		active: true,
		image_url: '""',
		description: 'banco_chile',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: null,
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: null,
		media: null
	},
	{
		program_id: 30,
		program_name: 'SimpliSafe',
		program_slug: 'flexroc',
		active: true,
		image_url: 'images/logo-flexroc.png',
		description: 'SimpliSafe',
		visible: true,
		program_type_id: 4,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: {
			hierarchy: [
				'company_id',
				'territory_id',
				'region_id',
				'district_id',
				'market_id',
				'store_id'
			],
			description: 'role_name',
			users_table: 'users',
			role_attribute: 'role_id',
			user_attribute: 'user_id'
		},
		media: null
	},
	{
		program_id: 64,
		program_name: 'Verizon',
		program_slug: 'verizon',
		active: true,
		image_url: '',
		description: 'verizon',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 42,
		program_name: 'Lider',
		program_slug: 'lider',
		active: true,
		image_url: 'logo.png',
		description: 'lider',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: null,
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: null,
		media: null
	},
	{
		program_id: 29,
		program_name: 'VIBA',
		program_slug: 'viba',
		active: true,
		image_url: 'images/logo-viba.png',
		description: 'VIBA',
		visible: true,
		program_type_id: 4,
		allow_filtering: null,
		filtering_show: null,
		conditions: {
			store: {
				fields: [
					'account_id',
					'account_name',
					'store_id',
					'store_name',
					'market_id',
					'market_name',
					'district_id',
					'region_id',
					'district_name',
					'region_name'
				]
			}
		},
		attributes: null,
		media: null
	},
	{
		program_id: 45,
		program_name: 'Romeo',
		program_slug: 'romeo',
		active: true,
		image_url: 'logo.png',
		description: 'romeo',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: null,
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: null,
		media: null
	},
	{
		program_id: 66,
		program_name: 'MSO VIBA',
		program_slug: 'mso_viba',
		active: true,
		image_url: '',
		description: 'mso_viba',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: {
			filtering: {
				date: {
					name: 'Pick a date range',
					type: 'date',
					order: 0,
					params: {
						dateRange: ['custom', 'mtd', 'weekly']
					},
					hierarchy: false
				},
				store: {
					id: 'store_id',
					name: 'Store',
					order: 4,
					value: 'store_name',
					format: 'string',
					hierarchy: true
				},
				projects: {
					id: 'project_id',
					name: 'Project',
					slug: 'mso_viba_projects',
					order: 1,
					value: 'project_name',
					hierarchy: false
				},
				retailer: {
					id: 'account_id',
					name: 'Retailer',
					order: 3,
					value: 'account_name',
					hierarchy: true
				},
				product_name: {
					id: 'product_name',
					jump: true,
					name: 'Product',
					slug: 'mso_viba_products',
					order: 5,
					value: 'product_name',
					format: 'string',
					operator: 'OR',
					hierarchy: false
				}
			},
			filteringadv: {
				test_call: {
					id: 'hide_test_calls',
					name: 'Hide Test Calls',
					type: 'checkbox',
					order: 1,
					value: 'hide_test_calls',
					options: {
						test_call: {
							id: 'hide_test_calls',
							text: '',
							value: true
						}
					},
					selected: true,
					hierarchy: false
				},
				agent_name: {
					id: 'user_id',
					name: 'Agent Name',
					slug: 'mso_viba_agents',
					order: 0,
					value: 'full_name',
					hierarchy: false
				}
			}
		},
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: null,
		media: null
	},
	{
		program_id: 67,
		program_name: 'Tro Xfinity VIBA',
		program_slug: 'tro_xfinity_viba',
		active: true,
		image_url: 'null',
		description: 'tro_xfinity_viba',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: {
			filtering: {
				date: {
					name: 'Pick a date range',
					type: 'date',
					order: 0,
					params: {
						dateRange: ['custom', 'mtd', 'weekly']
					},
					hierarchy: false
				},
				store: {
					id: 'store_id',
					name: 'Store',
					order: 4,
					value: 'store_name',
					format: 'string',
					hierarchy: true
				},
				projects: {
					id: 'project_id',
					name: 'Project',
					slug: 'tro_xfinity_viba_projects',
					order: 1,
					value: 'project_name',
					hierarchy: false
				},
				retailer: {
					id: 'account_id',
					name: 'Retailer',
					order: 3,
					value: 'account_name',
					hierarchy: true
				},
				product_name: {
					id: 'product_name',
					jump: true,
					name: 'Product',
					slug: 'tro_xfinity_viba_products',
					order: 5,
					value: 'product_name',
					format: 'string',
					operator: 'OR',
					hierarchy: false
				}
			},
			filteringadv: {
				test_call: {
					id: 'hide_test_calls',
					name: 'Hide Test Calls',
					type: 'checkbox',
					order: 1,
					value: 'hide_test_calls',
					options: {
						test_call: {
							id: 'hide_test_calls',
							text: '',
							value: true
						}
					},
					selected: true,
					hierarchy: false
				},
				agent_name: {
					id: 'user_id',
					name: 'Agent Name',
					slug: 'tro_xfinity_viba_agents',
					order: 0,
					value: 'full_name',
					hierarchy: false
				}
			}
		},
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: null,
		media: null
	},
	{
		program_id: 68,
		program_name: 'VENU',
		program_slug: 'venu',
		active: true,
		image_url: '',
		description: 'venu',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 69,
		program_name: 'Provectis',
		program_slug: 'provectis',
		active: true,
		image_url: '',
		description: 'provectis',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 70,
		program_name: 'Provectis Claro-VTR',
		program_slug: 'provectis_claro_vtr',
		active: true,
		image_url: '',
		description: 'provectis_claro_vtr',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 33,
		program_name: 'Echelon',
		program_slug: 'echelon',
		active: true,
		image_url: 'logo.png',
		description: 'echelon',
		visible: true,
		program_type_id: 4,
		allow_filtering: null,
		filtering_show: null,
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: {
			hierarchy: [
				'company_id',
				'territory_id',
				'region_id',
				'district_id',
				'market_id',
				'store_id'
			],
			description: 'role_name',
			users_table: 'users',
			role_attribute: 'role_id',
			user_attribute: 'user_id'
		},
		media: null
	},
	{
		program_id: 72,
		program_name: 'Provectis Caja 18',
		program_slug: 'provectis_caja18',
		active: true,
		image_url: '',
		description: 'provectis_caja18',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 76,
		program_name: 'Polestar',
		program_slug: 'polestar',
		active: true,
		image_url: '',
		description: 'polestar',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 31,
		program_name: 'PlayStation',
		program_slug: 'playstation_legacy',
		active: true,
		image_url: 'images/logo-playstation.png',
		description: 'PlayStation',
		visible: true,
		program_type_id: 4,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 79,
		program_name: 'harman',
		program_slug: 'harman',
		active: true,
		image_url: '',
		description: 'harman',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 82,
		program_name: 'TROC Expenses Monitoring',
		program_slug: 'troc_financial',
		active: true,
		image_url: 'null',
		description: 'troc_financial',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: null,
		conditions: null,
		attributes: null,
		media: null
	},
	{
		program_id: 80,
		program_name: 'DirecTV',
		program_slug: 'directv',
		active: true,
		image_url: '',
		description: 'directv',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: {
			filtering: {
				date: {
					name: 'Pick a date range',
					type: 'date',
					order: 0,
					params: {
						dateRange: ['custom', 'mtd', 'weekly']
					},
					hierarchy: false
				},
				store: {
					id: 'store_id',
					name: 'Store',
					order: 4,
					value: 'store_name',
					format: 'string',
					hierarchy: true
				},
				projects: {
					id: 'project_id',
					name: 'Project',
					slug: 'directv_projects',
					order: 1,
					value: 'project_name',
					hierarchy: false
				},
				retailer: {
					id: 'account_id',
					name: 'Retailer',
					order: 3,
					value: 'account_name',
					hierarchy: true
				},
				product_name: {
					id: 'product_name',
					jump: true,
					name: 'Product',
					slug: 'directv_products',
					order: 5,
					value: 'product_name',
					format: 'string',
					operator: 'OR',
					hierarchy: false
				}
			},
			filteringadv: {
				test_call: {
					id: 'hide_test_calls',
					name: 'Hide Test Calls',
					type: 'checkbox',
					order: 1,
					value: 'hide_test_calls',
					options: {
						test_call: {
							id: 'hide_test_calls',
							text: '',
							value: true
						}
					},
					selected: true,
					hierarchy: false
				},
				agent_name: {
					id: 'user_id',
					name: 'Agent Name',
					slug: 'directv_agents',
					order: 0,
					value: 'full_name',
					hierarchy: false
				}
			}
		},
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: null,
		media: null
	},
	{
		program_id: 83,
		program_name: 'Sams Club VIBA',
		program_slug: 'samsclub',
		active: true,
		image_url: '',
		description: 'samsclub',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: {
			filtering: {
				date: {
					name: 'Pick a date range',
					type: 'date',
					order: 0,
					params: {
						dateRange: ['custom', 'mtd', 'weekly']
					},
					hierarchy: false
				},
				store: {
					id: 'store_id',
					name: 'Store',
					order: 4,
					value: 'store_name',
					format: 'string',
					hierarchy: true
				},
				projects: {
					id: 'project_id',
					name: 'Project',
					slug: 'samsclub_projects',
					order: 1,
					value: 'project_name',
					hierarchy: false
				},
				retailer: {
					id: 'account_id',
					name: 'Retailer',
					order: 3,
					value: 'account_name',
					hierarchy: true
				},
				product_name: {
					id: 'product_name',
					jump: true,
					name: 'Product',
					slug: 'samsclub_products',
					order: 5,
					value: 'product_name',
					format: 'string',
					operator: 'OR',
					hierarchy: false
				}
			},
			filteringadv: {
				test_call: {
					id: 'hide_test_calls',
					name: 'Hide Test Calls',
					type: 'checkbox',
					order: 1,
					value: 'hide_test_calls',
					options: {
						test_call: {
							id: 'hide_test_calls',
							text: '',
							value: true
						}
					},
					selected: true,
					hierarchy: false
				},
				agent_name: {
					id: 'user_id',
					name: 'Agent Name',
					slug: 'samsclub_agents',
					order: 0,
					value: 'full_name',
					hierarchy: false
				}
			}
		},
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: null,
		media: null
	},
	{
		program_id: 62,
		program_name: 'USC VIBA',
		program_slug: 'usc_viba',
		active: true,
		image_url: '',
		description: 'usc_viba',
		visible: true,
		program_type_id: 1,
		allow_filtering: null,
		filtering_show: {
			filtering: {
				date: {
					name: 'Pick a date range',
					type: 'date',
					order: 0,
					params: {
						dateRange: ['custom', 'mtd', 'weekly']
					},
					hierarchy: false
				},
				store: {
					id: 'store_id',
					name: 'Store',
					order: 4,
					value: 'store_name',
					format: 'string',
					hierarchy: true
				},
				projects: {
					id: 'project_id',
					name: 'Project',
					slug: 'usc_viba_projects',
					order: 1,
					value: 'project_name',
					hierarchy: false
				},
				retailer: {
					id: 'account_id',
					name: 'Retailer',
					order: 3,
					value: 'account_name',
					hierarchy: true
				},
				product_name: {
					id: 'product_name',
					jump: true,
					name: 'Product',
					slug: 'usc_viba_products',
					order: 5,
					value: 'product_name',
					format: 'string',
					operator: 'OR',
					hierarchy: false
				}
			},
			filteringadv: {
				test_call: {
					id: 'hide_test_calls',
					name: 'Hide Test Calls',
					type: 'checkbox',
					order: 1,
					value: 'hide_test_calls',
					options: {
						test_call: {
							id: 'hide_test_calls',
							text: '',
							value: true
						}
					},
					selected: true,
					hierarchy: false
				},
				agent_name: {
					id: 'user_id',
					name: 'Agent Name',
					slug: 'usc_viba_agents',
					order: 0,
					value: 'full_name',
					hierarchy: false
				}
			}
		},
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: null,
		media: null
	},
	{
		program_id: 3,
		program_name: 'Walmart',
		program_slug: 'walmart',
		active: true,
		image_url: 'images/troc/walmart-logo-600x600.png',
		description: null,
		visible: true,
		program_type_id: 4,
		allow_filtering: null,
		filtering_show: {
			filtering: {
				date: {
					jump: true,
					name: 'Pick a date range',
					type: 'date',
					order: 1,
					params: {
						period: 'mtd'
					},
					hierarchy: false
				},
				store: {
					id: 'store_id',
					name: 'Store',
					order: 6,
					value: 'store_name',
					hierarchy: true
				},
				market: {
					id: 'market_id',
					name: 'Area',
					order: 5,
					value: 'market_name',
					hierarchy: true
				},
				region: {
					id: 'region_id',
					name: 'Region',
					order: 3,
					value: 'region_name',
					hierarchy: true
				},
				territory: {
					id: 'territory_id',
					name: 'Division',
					order: 2,
					value: 'territory_name',
					hierarchy: true
				}
			}
		},
		conditions: {
			store: {
				fields: [
					'territory_id',
					'region_id',
					'market_id',
					'store_id',
					'store_type',
					'launch_group',
					'store_tier',
					'territory_name',
					'region_name',
					'market_name',
					'store_name',
					'store_type',
					'launch_group',
					'store_tier',
					'district_id',
					'district_name'
				]
			}
		},
		attributes: {
			hierarchy: [
				'company_id',
				'territory_id',
				'region_name',
				'district_id',
				'market_id',
				'store_id',
				'launch_group',
				'store_tier'
			],
			description: 'job_title_description',
			users_table: 'vw_employees',
			role_attribute: 'job_code',
			user_attribute: 'associate_id'
		},
		media: null
	},
	{
		program_id: 34,
		program_name: 'Team Direct',
		program_slug: 'teamdirect',
		active: true,
		image_url: 'logo.png',
		description: 'teamdirect',
		visible: true,
		program_type_id: 4,
		allow_filtering: null,
		filtering_show: null,
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: {
			hierarchy: [
				'company_id',
				'territory_id',
				'region_id',
				'district_id',
				'market_id',
				'store_id'
			],
			description: 'role_name',
			users_table: 'users',
			role_attribute: 'role_id',
			user_attribute: 'user_id'
		},
		media: null
	},
	{
		program_id: 32,
		program_name: 'PlayStation',
		program_slug: 'playstation',
		active: true,
		image_url: 'logo.png',
		description: 'PlayStation',
		visible: true,
		program_type_id: 4,
		allow_filtering: null,
		filtering_show: null,
		conditions: {
			extraConditionsFile: 'viba'
		},
		attributes: {
			hierarchy: [
				'company_id',
				'territory_id',
				'region_id',
				'district_id',
				'market_id',
				'store_id'
			],
			description: 'role_name',
			users_table: 'users',
			role_attribute: 'role_id',
			user_attribute: 'user_id'
		},
		media: null
	},
	{
		program_id: 28,
		program_name: 'TrendMicro',
		program_slug: 'trendmicro',
		active: true,
		image_url: 'apps/trendmicro/images/trendmicro-logo.png',
		description: 'Human Resources',
		visible: true,
		program_type_id: 2,
		allow_filtering: null,
		filtering_show: {
			filtering: {
				date: {
					name: 'Pick a date range',
					type: 'date',
					order: 1,
					params: {
						period: 'fiscalMonth',
						dateRange: ['weekly', 'mtd', 'custom', 'fiscalMonth']
					},
					hierarchy: false
				},
				store_id: {
					id: 'store_id',
					name: 'Store',
					order: 6,
					value: 'store_name',
					format: 'string',
					hierarchy: true
				},
				market_id: {
					id: 'market_id',
					name: 'District',
					order: 5,
					value: 'market_name',
					hierarchy: true
				},
				region_id: {
					id: 'region_id',
					name: 'Territory',
					order: 3,
					value: 'region_name',
					hierarchy: true
				},
				district_id: {
					id: 'district_id',
					name: 'Market',
					order: 4,
					value: 'district_name',
					hierarchy: true
				},
				store_description: {
					id: 'store_description',
					jump: true,
					name: 'Territory Manager',
					order: 2,
					value: 'store_description',
					hierarchy: false
				}
			},
			filteringadv: {
				store_type: {
					id: 'store_type',
					name: 'Store Type',
					order: 9,
					value: 'store_type',
					hierarchy: false
				},
				account_name: {
					id: 'account_name',
					name: 'Retailer',
					order: 7,
					value: 'account_name',
					hierarchy: false
				},
				store_designation: {
					id: 'store_designation',
					name: 'Store Designation',
					order: 8,
					value: 'store_designation',
					hierarchy: false
				}
			}
		},
		conditions: null,
		attributes: {
			hierarchy: [
				'company_id',
				'territory_id',
				'region_id',
				'district_id',
				'market_id',
				'store_id'
			],
			description: 'role_name',
			users_table: 'users',
			role_attribute: 'role_id',
			user_attribute: 'user_id'
		},
		media: null
	}
]
