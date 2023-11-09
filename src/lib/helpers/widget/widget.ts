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

