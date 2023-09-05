<script lang="ts">
	import moment from 'moment'
	import Loading from '$lib/components/common/Loading.svelte'
	import { getData } from '$lib/services/getData'
	import { getContext } from 'svelte'

	let widget: any = getContext('widget')
	let widgetActions: any = getContext('widgetActions')

	const urlBase = import.meta.env.VITE_API_URL
	const slug = $widget.query_slug.slug
	const conditionsRaw = $widget.conditions
	const method = $widget.params.ajax.method || $widget.params.ajax.type
	let data: any

	async function fetchData() {
		console.log('SLUG', slug)
		const conditions = buildConditions()
		console.log('CONDITIONS TOTAL', conditions)
		data = getData(`${urlBase}/api/v2/services/queries/${slug}`, method, conditions)
	}

	function buildConditions() {
		const conditions = conditionsRaw

		if (conditions.firstdate) {
			conditions.firstdate = returnValidateDate(conditions.firstdate)
		}

		if (conditions.lastdate) {
			conditions.lastdate = returnValidateDate(conditions.lastdate)
		}

		if (conditions.filterdate && !Array.isArray(conditions.filterdate)) {
			conditions.filterdate = returnValidateDate(conditions.filterdate)
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
				// const variables = useProgramVariables()

				// validateDate = variables[strDate] || strDate
			}
		}

		setMomentWeek(0)

		return validateDate
	}

	function handleOperationalDate() {
		// TODO: handle operational date
		return moment().format('YYYY-MM-DD')
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

	if (!$widgetActions.find((action: any) => action.name === 'reloadFetchData')) {
		const actions = $widgetActions
		actions.push({
			name: 'reloadFetchData',
			action: () => fetchData()
		})
		$widgetActions = actions
	}

	if (!$widgetActions.find((action: any) => action.name === 'exportData')) {
		const actions = $widgetActions
		actions.push({
			name: 'exportData'
			// action: () => fetchData()
		})
		$widgetActions = actions
	}

	if (!$widgetActions.find((action: any) => action.name === 'filterData')) {
		const actions = $widgetActions
		actions.push({
			name: 'filterData'
			// action: () => fetchData()
		})
		$widgetActions = actions
	}

	fetchData()
</script>

{#await data}
	<Loading />
{:then data}
	<slot {data} />
{/await}
