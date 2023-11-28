<script lang="ts">
	import moment from 'moment'
	import Loading from '$lib/components/common/Loading.svelte'
	import { getApiData } from '$lib/services/getData'
	import { variablesOperationalProgram } from '$lib/stores/programs'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'
	import { addWidgetAction } from '$lib/helpers'
	import { sendErrorNotification } from '$lib/stores/toast'
	import { setWidgetTop } from '$lib/helpers/widget/widget-top'
	import { page } from '$app/stores'

	export let widget: Writable<any>

	const widgetActions: any = getContext('widgetActions')
	const dashboard: Writable<any> = getContext('dashboard')

	const slug = $widget.query_slug?.slug || $widget.params.query?.slug
	const conditionsRaw = $widget.conditions
	const method = $widget.params?.ajax?.method || $widget.params?.ajax?.type
	let data: any

	async function fetchData() {
		const conditions = buildConditions()

		$widget['filter_conditions'] = conditions || {}
		try {
			data = getApiData(slug, method, conditions)
		} catch (error) {
			sendErrorNotification(error)
		}
	}

	function buildConditions() {
		let conditions = { ...conditionsRaw }

		const dateCondition = $dashboard.where_date_cond

		if (conditions?.firstdate) {
			conditions.firstdate = returnValidateDate(conditions?.firstdate)

			if (dateCondition) {
				conditions.firstdate = dateCondition.split(' - ')[0]
			}
		}

		if (conditions?.lastdate) {
			conditions.lastdate = returnValidateDate(conditions?.lastdate)

			if (dateCondition) {
				const _date = dateCondition.split(' - ')
				conditions.lastdate = _date[1] || _date[0]
			}
		}

		if (conditions?.filterdate && !Array.isArray(conditions?.filterdate)) {
			conditions.filterdate = returnValidateDate(conditions?.filterdate)

			if (dateCondition) {
				const _date = dateCondition.split(' - ')
				conditions.filterdate = _date[1] || _date[0]
			}
		}
		if ($dashboard.where_new_cond && Object.keys($dashboard.where_new_cond).length > 0) {
			conditions.where_cond = { ...$dashboard.where_new_cond }
		}

		return conditions
	}

	function returnValidateDate(strDate: string) {
		const entryDate = handleOperationalDate()

		let validateDate

		// TODO: useFilteringDate
		const filteringDate = {}

		// TODO: useFilterDate start day of week
		const startDayofWeek = 0

		setMomentWeek(startDayofWeek)

		if (isDate(strDate)) {
			validateDate = moment(strDate).format('YYYY-MM-DD')
		} else {
			switch (strDate) {
				case 'NOW':
					validateDate = moment().format('YYYY-MM-DD')
					break
				case 'CURRENT_DATE':
				case 'ENTRY_DATE':
					validateDate = moment(entryDate).format('YYYY-MM-DD')
					break
				case 'YESTERDAY':
					validateDate = moment(entryDate).subtract(1, 'days').format('YYYY-MM-DD')
					break
				case 'PREVIOUS_MONTH':
					validateDate = moment(entryDate).subtract(1, 'month').format('YYYY-MM-DD')
					break
				case 'FDOM':
					validateDate = moment(entryDate).startOf('month').format('YYYY-MM-DD')
					break
				case 'FDOPW':
					if (moment(entryDate).isSame(moment().day(6), 'd')) {
						validateDate = moment(entryDate).startOf('week').format('YYYY-MM-DD')
					} else {
						validateDate = moment(entryDate)
							.subtract(1, 'weeks')
							.startOf('week')
							.format('YYYY-MM-DD')
					}
					break
				case 'LDOPW':
					if (moment(entryDate).isSame(moment().day(6), 'd')) {
						validateDate = moment(entryDate).endOf('week').format('YYYY-MM-DD')
					} else {
						validateDate = moment(entryDate).subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD')
					}
					break
				case 'FDOW':
					validateDate = moment(entryDate).startOf('week').format('YYYY-MM-DD')
					break
				case 'LDOW':
					validateDate = moment(entryDate).format('YYYY-MM-DD')
					break
				case 'LDOM':
					validateDate = moment(entryDate).endOf('month').format('YYYY-MM-DD')
					break
				case 'FDOFM':
					try {
						// validateDate = fiscalMonth(
						//   moment(entryDate).format('YYYY-MM-DD'),
						//   false
						// )[0]
					} catch (error) {
						validateDate = moment(entryDate).startOf('month').format('YYYY-MM-DD')
					}
					break
				case 'LDOFM':
					try {
						// validateDate = fiscalMonth(
						//   moment(entryDate).format('YYYY-MM-DD'),
						//   false
						// )[1]
					} catch (error) {
						validateDate = entryDate
					}
					break
				case 'FDOFFM':
					try {
						// validateDate = fiscalMonth(
						//   moment(entryDate).format('YYYY-MM-DD'),
						//   false,
						//   true
						// )[0]
					} catch (error) {
						validateDate = moment(entryDate).startOf('month').format('YYYY-MM-DD')
					}
					break
				case 'LDOFFM':
					try {
						// validateDate = fiscalMonth(
						//   moment(entryDate).format('YYYY-MM-DD'),
						//   false,
						//   true
						// )[1]
					} catch (error) {
						validateDate = entryDate
					}
					break
				case 'FDOFMQ':
					try {
						// validateDate = fiscalMonthQuarter(
						//   moment(entryDate).format('YYYY-MM-DD'),
						//   false
						// )[0]
					} catch (error) {
						validateDate = moment(entryDate).startOf('month').format('YYYY-MM-DD')
					}
					break
				case 'LDOFMQ':
					try {
						// validateDate = fiscalMonthQuarter(
						//   moment(entryDate).format('YYYY-MM-DD'),
						//   false
						// )[1]
					} catch (error) {
						validateDate = entryDate
					}
					break
				case 'FDOPM':
					validateDate = moment(entryDate)
						.subtract(1, 'months')
						.startOf('month')
						.format('YYYY-MM-DD')
					break
				case 'LDOPM':
					validateDate = moment(entryDate).subtract(1, 'months').endOf('month').format('YYYY-MM-DD')
					break
				case 'FDOY':
					validateDate = moment(entryDate).startOf('year').format('YYYY-MM-DD')
					break
				case 'LDOY':
					validateDate = moment(entryDate).endOf('year').format('YYYY-MM-DD')
					break
				case 'FDOPY':
					validateDate = moment(entryDate).subtract(1, 'year').startOf('year').format('YYYY-MM-DD')
					break
				case 'LDOPY':
					validateDate = moment(entryDate).subtract(1, 'year').endOf('year').format('YYYY-MM-DD')
					break
				default:
					validateDate = $variablesOperationalProgram[strDate as any] || strDate
			}
		}

		setMomentWeek(0)

		return validateDate
	}

	function handleOperationalDate() {
		const module = $page.data.trocModule
		const variables = $variablesOperationalProgram

		let moduleOperationalDate = null
		let dashboardOperationalDate = null
		try {
			moduleOperationalDate =
				module && module.attributes ? module.attributes.operational_date : null
			dashboardOperationalDate =
				$dashboard && $dashboard?.attributes ? $dashboard?.attributes?.operational_date : null
		} catch (error) {
			console.log(error)
		}

		return dashboardOperationalDate && moment(dashboardOperationalDate).isValid()
			? dashboardOperationalDate
			: moduleOperationalDate && moment(moduleOperationalDate).isValid()
			? moduleOperationalDate
			: dashboardOperationalDate && variables[dashboardOperationalDate]
			? variables[dashboardOperationalDate]
			: moduleOperationalDate && variables[moduleOperationalDate]
			? variables[moduleOperationalDate]
			: moment().format('YYYY-MM-DD')
	}

	function isDate(strDate: string) {
		return moment(strDate, 'YYYY-MM-DD', true).isValid()
	}

	function setMomentWeek(value: number) {
		moment.updateLocale('en', {
			week: {
				dow: value
			}
		})
	}

	addWidgetAction(widgetActions, {
		name: 'reloadFetchData',
		action: () => fetchRefreshData()
	})

	const fetchRefreshData = () => {
		$widget.data = null
		$widget.fetch = false
	}

	$: if (!$widget.fetch) {
		if (!$widget.data) {
			fetchData()
		} else {
			data = $widget.data // $dataStore
		}
		$widget.fetch = true
	}

	if ($widget?.params?.filter) {
		const widgetTop = getContext<Writable<any>>('WidgetTop')
		setWidgetTop(widgetTop, 'FilterHeader', {
			// position: 'top',
			widget: $widget
		})
	}
</script>

{#await data}
	<Loading />
{:then data}
	<slot {data} />
{:catch error}
	{sendErrorNotification(error)}
{/await}
