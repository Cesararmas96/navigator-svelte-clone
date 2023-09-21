import { getContext, setContext } from "svelte"
import { writable, type Writable } from 'svelte/store';

export const initWidgetActions = () => {
  const widgetActions = writable([])
  setContext('widgetActions', widgetActions)
}

export const addWidgetAction = (widgetActions: Writable<any>, action: any) => {
  widgetActions.update((actions: any) => {
    if (!actions.find((a: any) => a.name === action.name))
      actions.push(action)
    return actions
  })
}

export const getWidgetAction = (actions: any[], actionName: string) => {
  return actions.find((action: any) => action.name === actionName)
}