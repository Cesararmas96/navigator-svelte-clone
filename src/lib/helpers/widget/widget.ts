/* eslint-disable @typescript-eslint/no-non-null-assertion */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const contentHeight = (id: string): any => {
	const widgetHeight = document.getElementById(`widget-${id}`)!.offsetHeight
	const headerHeight = document.getElementById(`widget-header-${id}`)!.offsetHeight
	const contentHeight = widgetHeight - headerHeight - 8
	return `${contentHeight}px`
}

export const setContentHeight = (id: string) => {
	const mainContent: HTMLElement = document.querySelector(`#widget-main-${id}`)!
	mainContent.style.height = contentHeight(id)
}

// const instanceContentHeight = (id: string): any => {
//   const widgetHeight = document.getElementById(`widget-${id}`)!.offsetHeight
//   const headerHeight = document.getElementById(`widget-header-${id}`)!.offsetHeight
//   const mainHeight = document.getElementById(`widget-main-content-${id}`)!.offsetHeight
//   const contentHeight = widgetHeight - headerHeight - mainHeight - 8
//   return `${contentHeight}px`
// }

export const setInstanceContentHeight = (id: string) => {
	const instancesContent: HTMLElement = document.querySelector(`#widget-instances-${id}`)!
	const header = 28
	const contentTop = 58
	const grid = 314
	instancesContent.style['min-height'] = header + contentTop + grid + 'px'
}

export const resetContentHeight = (id: string) => {
	const main: HTMLElement = document.querySelector(`#widget-main-${id}`)!
	const mainContentHeight = document.getElementById(`widget-main-content-${id}`)!.offsetHeight
	main.style.height = `${mainContentHeight}px`
}
