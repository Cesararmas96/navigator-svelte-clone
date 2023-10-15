import { setContext } from "svelte"
import { writable, type Writable } from 'svelte/store';

type Action = {
  name: string,
  action: () => void
}

export const initWidgetActions = (): Writable<any[]> => {
  const widgetActions = writable([])
  setContext('widgetActions', widgetActions)
  return widgetActions
}

export const addWidgetAction = (widgetActions: Writable<any>, action: Action) => {
  widgetActions.update((actions: any) => {
    if (!actions.find((a: any) => a.name === action.name))
      actions.push(action)
    return actions
  })
}

export const getWidgetAction = (actions: any[], actionName: string) => {
  return actions.find((action: any) => action.name === actionName)
}