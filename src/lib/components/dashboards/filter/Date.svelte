<script lang="ts">
	import { onMount, getContext } from 'svelte'
	// import Flatpickr from 'svelte-flatpickr'
	// import Flatpickr from 'flatpickr'
	import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect'
	import { variablesOperationalProgram } from '$lib/stores/programs'
	import Flatpickr from './Flatpickr.svelte'
	import { Label, Dropdown, Select, DropdownItem } from 'flowbite-svelte'
	import { merge } from 'lodash-es'
	import moment from 'moment'
	import 'flatpickr/dist/plugins/monthSelect/style.css'
	import { page } from '$app/stores'

	let selected
	let updateDate
	let countries = [
		{ value: 'us', name: 'United States' },
		{ value: 'ca', name: 'Canada' },
		{ value: 'fr', name: 'France' }
	]
	// const date = ref<string>(modelValue || '')

	let flatpickr
	let params: Record<string, any> = {
		period: 'mtd',
		dateRange: ['mtd', 'current_week', 'daily', 'fullMonth', 'custom']
	}
	const operationalDate: any = handleOperationalDate()
	let date: any = ['2023-09-01', '2023-09-09']
	let changeAux: boolean = false
	let config: Record<string, any> = {}
	const configDefault: Record<string, any> = {
		// wrap: true,
		// inline: true,
		mode: 'range',
		minDate: '2016-10-01',
		weekNumbers: true,
		dateFormat: 'Y-m-d',
		locale: {
			rangeSeparator: ' - '
		},
		maxDate: operationalDate || moment().format('YYYY-MM-DD'),
		// defaultDate: [
		// 	moment(operationalDate).startOf('month').format('YYYY-MM-DD'),
		// 	operationalDate || moment().format('YYYY-MM-DD')
		// ],
		onChange: handleOnChangeMtd,
		// onReady: handleOnReadyMtd,
		getWeek: getWeek
	}
	let configAux: Record<string, any> = {}
	let visible: boolean = false
	let settings: Record<string, any> = {
		rangeCompare: params && params.rangeCompare ? params.rangeCompare : 'prev',
		comparison: true,
		period: params.period || 'custom'
	}

	onMount(() => {
		configDatepicker()

		console.log(document.querySelector('#flacpickr'))
	})

	// $: console.log(flatpickr, date)

	function configDatepicker() {
		setMomentWeek(true)

		if (params.defaultDate) {
			const splitDate = params.defaultDate.split(' - ')
			if (splitDate[1] === 'today') {
				params.default = `${splitDate[0]} - ${moment().format('YYYY-MM-DD')}`
			}
		}

		configure()

		if (params.default) {
			date = params.default
		} else if (params.defaultDate) {
			date = params.defaultDate
		} else if (settings.period === 'daily') {
			date = Array.isArray(config.defaultDate) ? config.defaultDate[1] : config.defaultDate
		} else if (settings.period === 'fullMonthLast') {
			const startDate = moment(config.defaultDate[0])
				.subtract(1, 'months')
				.startOf('month')
				.format('YYYY-MM-DD')
			const endDate = moment(config.defaultDate[1])
				.subtract(1, 'months')
				.endOf('month')
				.format('YYYY-MM-DD')

			date = `${startDate} - ${endDate}`
		} else if (settings.period === 'fiscalMonth') {
			// const fiscalMonths = fiscalMonth(operationalDate, false)
			// date = `${fiscalMonths[0]} - ${fiscalMonths[1]}`
		} else if (settings.period === 'fullFiscalMonthLast') {
			// const fiscalMonths = fiscalMonth(operationalDate, false, true)
			// date = `${fiscalMonths[0]} - ${fiscalMonths[1]}`
		} else if (settings.period === 'quarter' || settings.period === 'quarterFM') {
			// const fiscalMonth = fiscalMonthQuarter(operationalDate, false)
			// date = `${fiscalMonth[0]} - ${fiscalMonth[1]}`
		} else {
			date = `${date[0]} - ${date[1]}`
		}

		setMomentWeek(false)
	}

	function showDatepicker(e) {
		// if (e.detail) {
		// 	// configDatepicker()
		// 	setTimeout(() => {
		// 		// flatpickr = Flatpickr('#flatpickr', config)
		// 	}, 10)
		// }
	}

	function configure(changeSelect = false) {
		try {
			changeAux = changeSelect
			configAux = {}
			let options = {}

			console.log('PERIOD', settings.period)
			switch (settings.period) {
				case 'custom':
					options = {
						onChange() {},
						onClose: handleOnCloseCustom,
						onReady: handleOnReadyMtd
					}
					break
				case 'current_week':
					options = {
						defaultDate: handleDefaultDateCurrentWeek,
						onReady: handleOnReadyCurrentWeek,
						onChange: handleOnChangeCurrentWeek
					}
					break
				case 'daily':
					options = {
						mode: 'single',
						defaultDate: operationalDate || moment().format('YYYY-MM-DD'),
						onChange() {},
						onReady() {}
					}
					date = `${operationalDate}`
					break
				case 'fullMonth':
					options = {
						mode: 'single',
						minDate: '2016-10-01',
						maxDate: moment(
							moment(operationalDate).startOf('month').subtract(1, 'days').format('YYYY-MM-DD')
						)
							.add(1, 'month')
							.format('YYYY-MM-DD'),
						altInput: true,
						weekNumbers: false,
						conjunction: ' - ',
						// onChange: handleOnChangeFullMonth,
						// onReady: handleOnReadyFullMonth,
						locale: {
							rangeSeparator: ' - '
						},
						plugins: [
							// @ts-ignore
							new monthSelectPlugin({
								shorthand: true,
								dateFormat: 'Y-m-d',
								altFormat: 'F Y'
							})
						]
					}
					break
				case 'fullMonthLast':
					options = {
						mode: '',
						minDate: '2016-10-01',
						maxDate: moment(operationalDate)
							.subtract(1, 'months')
							.endOf('month')
							.format('YYYY-MM-DD'),
						altInput: true,
						weekNumbers: false,
						conjunction: ' - ',
						// onChange: handleOnChangeFullMonth,
						// onReady: handleOnReadyFullMonthLast,
						locale: {
							rangeSeparator: ' - '
						},
						plugins: [
							// @ts-ignore
							new monthSelectPlugin({
								shorthand: true,
								dateFormat: 'Y-m-d',
								altFormat: 'F Y'
							})
						]
					}
					break

				case 'fiscalMonth':
					options = {
						mode: '',
						minDate:
							params &&
							params.fiscalMonth &&
							params.fiscalMonth.range &&
							params.fiscalMonth.range.initial
								? params.fiscalMonth.range.initial
								: '2018-02-04',
						maxDate:
							params &&
							params.fiscalMonth &&
							params.fiscalMonth.range &&
							params.fiscalMonth.range.end
								? params.fiscalMonth.range.end
								: '2030-12-31',
						altInput: true,
						weekNumbers: false,
						conjunction: ' - ',
						// onChange: handleOnChangeFiscalMonth,
						// onReady: handleOnReadyFiscalMonth,
						locale: {
							rangeSeparator: ' - '
						},
						plugins: [
							// @ts-ignore
							new monthSelectPlugin({
								shorthand: true,
								dateFormat: 'Y-m-d',
								altFormat: 'F Y'
							})
						]
					}
					break
				case 'fullFiscalMonthLast':
					options = {
						mode: '',
						minDate:
							params &&
							params.fiscalMonth &&
							params.fiscalMonth.range &&
							params.fiscalMonth.range.initial
								? params.fiscalMonth.range.initial
								: '2018-02-04',
						// maxDate:
						// 	params &&
						// 	params.fiscalMonth &&
						// 	params.fiscalMonth.range &&
						// 	params.fiscalMonth.range.end
						// 		? params.fiscalMonth.range.end
						// 		: fiscalMonth(operationalDate, false, true)[1],
						altInput: true,
						weekNumbers: false,
						conjunction: ' - ',
						// onChange: handleOnChangeFiscalMonth,
						// onReady: handleOnReadyFiscalMonth,
						locale: {
							rangeSeparator: ' - '
						},
						plugins: [
							// @ts-ignore
							new monthSelectPlugin({
								shorthand: true,
								dateFormat: 'Y-m-d',
								altFormat: 'F Y'
							})
						]
					}
					break
				case 'mtd':
					options = {
						onReady: handleOnReadyMtd
					}
					break
				case 'monthly':
					options = {
						// defaultDate: handleDefaultDateMonthly,
						// onReady: handleOnReadyMonthly,
						// onChange: handleOnChangeMonthly
					}
					break
				case 'yearly':
					options = {
						// defaultDate: handleDefaultDateYearly,
						// onReady: handleOnReadyYearly,
						// onChange: handleOnChangeYearly
					}
					break
				case 'weekly':
					options = {
						// defaultDate: handleDefaultDateWeek,
						// onChange: handleOnChangeWeekly,
						// onReady: handleOnReadyWeekly
					}
					break
				case 'quarter':
				case 'quarterFM':
					options = {
						minDate:
							params &&
							params.fiscalMonth &&
							params.fiscalMonth.range &&
							params.fiscalMonth.range.initial
								? params.fiscalMonth.range.initial
								: '2018-02-04',
						maxDate:
							params &&
							params.fiscalMonth &&
							params.fiscalMonth.range &&
							params.fiscalMonth.range.end
								? params.fiscalMonth.range.end
								: '2030-12-31'
					}
					break
				default:
					console.log('Error Period Datepicker')
			}

			config = merge({}, configDefault, configAux, options, params.picker || {})

			console.log('config', config)
			if (changeSelect) {
				// visible = false
				// setTimeout(() => {
				// 	visible = true
				// }, 400)
			}
		} catch (error) {
			console.log(error)
		}
	}

	function handleOnCloseCustom(selectedDates: any, dateStr: any, instance: any) {
		if (selectedDates.length === 1) {
			flatpickr.pickr.setDate([dateStr, dateStr])
			date = `${dateStr} - ${dateStr}`
		}
	}

	function handleOnChangeMtd(selectedDates: any, dateStr: any, instance: any) {
		if (selectedDates.length === 1) {
			instance.setDate([moment(dateStr).startOf('month').format('YYYY-MM-DD'), dateStr])
			// date = [moment(dateStr).startOf('month').format('YYYY-MM-DD'), dateStr]
		} else if (selectedDates.length === 2) {
			instance.setDate([moment(date[0]).startOf('month').format('YYYY-MM-DD'), date[1]])
			// const datee = dateStr.split(' - ')
			// date = [moment(datee[0]).startOf('month').format('YYYY-MM-DD'), datee[1]]
		}
	}

	function handleOnReadyMtd() {
		console.log('handleOnReadyMtd', changeAux)
		if (changeAux) {
			setTimeout(() => {
				flatpickr.pickr.setDate([
					moment(operationalDate).startOf('month').format('YYYY-MM-DD'),
					operationalDate
				])
				date = `${moment(operationalDate)
					.startOf('month')
					.format('YYYY-MM-DD')} - ${operationalDate}`
			}, 50)
			changeAux = false
		}
	}

	// function handleDefaultDateCurrentWeek() {
	// 	let date = []
	// 	if (
	// 		moment(moment(operationalDate).endOf('week').format('YYYY-MM-DD')).isAfter(operationalDate)
	// 	) {
	// 		date = [
	// 			moment(operationalDate).startOf('week').format('YYYY-MM-DD'),
	// 			moment(operationalDate).format('YYYY-MM-DD')
	// 		]
	// 	} else {
	// 		date = [
	// 			moment(operationalDate).startOf('week').format('YYYY-MM-DD'),
	// 			moment(operationalDate).endOf('week').format('YYYY-MM-DD')
	// 		]
	// 	}
	// 	return date
	// }

	function handleOnReadyCurrentWeek() {
		if (changeAux) {
			let initial = ''
			let end = ''
			setTimeout(() => {
				if (
					moment(moment(operationalDate).endOf('week').format('YYYY-MM-DD')).isAfter(
						operationalDate
					)
				) {
					initial = moment(operationalDate).startOf('week').format('YYYY-MM-DD')
					end = moment(operationalDate).format('YYYY-MM-DD')
					flatpickr.pickr.setDate([initial, end])
				} else {
					initial = moment(operationalDate).startOf('week').format('YYYY-MM-DD')
					end = moment(operationalDate).endOf('week').format('YYYY-MM-DD')
					flatpickr.pickr.setDate([initial, end])
				}
				date = `${initial} - ${end}`
			}, 50)
		}
		changeAux = false
	}

	function handleDefaultDateCurrentWeek() {
		let date = []
		if (
			moment(moment(operationalDate).endOf('week').format('YYYY-MM-DD')).isAfter(operationalDate)
		) {
			date = [
				moment(operationalDate).startOf('week').format('YYYY-MM-DD'),
				moment(operationalDate).format('YYYY-MM-DD')
			]
		} else {
			date = [
				moment(operationalDate).startOf('week').format('YYYY-MM-DD'),
				moment(operationalDate).endOf('week').format('YYYY-MM-DD')
			]
		}
		return date
	}

	function handleOnChangeCurrentWeek(selectedDates: any, dateStr: any, instance: any) {
		console.log(selectedDates)
		console.log(dateStr)
		console.log(instance)
		if (dateStr.split(' - ').length < 2) {
			if (moment(moment(dateStr).endOf('week').format('YYYY-MM-DD')).isAfter(operationalDate)) {
				flatpickr.pickr.setDate([
					moment(dateStr).startOf('week').format('YYYY-MM-DD'),
					moment(operationalDate).format('YYYY-MM-DD')
				])
			} else {
				flatpickr.pickr.setDate([
					moment(dateStr).startOf('week').format('YYYY-MM-DD'),
					moment(dateStr).endOf('week').format('YYYY-MM-DD')
				])
			}
		}
	}

	function setMomentWeek(value: any) {
		moment.locale('en', {
			week: {
				dow:
					value && params?.picker?.locale?.firstDayOfWeek
						? params?.picker?.locale?.firstDayOfWeek
						: 0
			}
		})
	}

	function getWeek(dateObj: any) {
		const offset = params && params.weekOffset ? moment(params.weekOffset, 'MM-DD').week() - 1 : 0
		let date = moment(dateObj, 'YYYY-MM-DD').week() - offset
		date =
			Math.sign(date) === -1
				? moment().weeksInYear() + date
				: Math.sign(date) === 0
				? moment().weeksInYear()
				: date
		return date
	}

	function handleOperationalDate() {
		const module = $page.data.trocModule
		const dashboard = getContext('dashboard')
		const variables = $variablesOperationalProgram

		console.log('module', module)
		console.log('dashboard', dashboard)
		console.log('variables', variables)
		console.log('variablesOperationalProgram', variablesOperationalProgram)

		// let moduleOperationalDate = null
		// let dashboardOperationalDate = null
		// try {
		// 	moduleOperationalDate =
		// 		module && module.attributes ? module.attributes.operational_date : null
		// 	dashboardOperationalDate =
		// 		dashboard && dashboard?.attributes ? dashboard?.attributes.operational_date : null
		// } catch (error) {
		// 	console.log(error)
		// }

		// return dashboardOperationalDate && moment(dashboardOperationalDate).isValid()
		// 	? dashboardOperationalDate
		// 	: moduleOperationalDate && moment(moduleOperationalDate).isValid()
		// 	? moduleOperationalDate
		// 	: dashboardOperationalDate && variables[dashboardOperationalDate]
		// 	? variables[dashboardOperationalDate]
		// 	: moduleOperationalDate && variables[moduleOperationalDate]
		// 	? variables[moduleOperationalDate]
		// 	: moment().format('YYYY-MM-DD')

		return moment().format('YYYY-MM-DD')
	}

	function newValue(_date) {
		if (_date && Array.isArray(_date)) {
			return _date?.join(' - ')
		} else {
			return _date
		}
	}

	function handleChange(selectedDates, dateString, instance) {
		console.log(selectedDates)
	}
</script>

<main>
	<Label class="block text-left ">Pick a date range</Label>
	<input
		type="text"
		value={newValue(date)}
		readonly
		on:click={() => {
			visible = !visible
		}}
		class=" w-full cursor-pointer !rounded border-gray-300 bg-gray-50 px-2 py-1 pr-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
	/>
	<!-- {#if visible} -->
	<Dropdown class="flatpickr-container w-full space-y-1 p-3">
		<!-- on:show={showDatepicker} -->
		<div class="grid grid-cols-2 gap-4">
			<div>
				<Flatpickr
					bind:value={date}
					{config}
					bind:updateDate
					bind:this={flatpickr}
					class="w-full cursor-pointer !rounded border-gray-300 bg-gray-50 px-2 py-1 pr-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
				/>
				<!-- <Flatpickr options={config} bind:value={date} bind:this={flatpickr} name="date" /> -->
			</div>
			<div>
				<Label>
					Date Range
					<Select class="mt-2 w-72" size="sm" items={countries} bind:value={selected} />
				</Label>
			</div>
		</div>
	</Dropdown>
	<!-- {/if} -->
</main>
