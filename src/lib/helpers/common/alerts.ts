import { AlertType, type AlertMessage } from "$lib/interfaces/Alert";
import { writable } from "svelte/store";

export const alerts = writable<AlertMessage[]>([]);

export const sendAlert = (alert: AlertMessage) => {
  if (!alert.id) alert.id = generateId()
  console.log(alert)
  alerts.update((all) => {
    const exists = all.some(a => a.id === alert.id);
    if (exists) return all;
    return [{...alert}, ...all];
  });
};

const generateId = () => Math.floor(Math.random() * 10000).toString();

export const dismissAlert = (id: string) => {
  alerts.update((all) => all.filter((t: AlertMessage) => t.id !== id));
};

export const sendSuccessAlert = (title: string, message?: string, callback1Btn?: string, callback1?: () => void, callback2Btn?: string, callback2?: () => void) => {
  sendAlert({
    id: generateId(),
    type: AlertType.SUCCESS,
    title,
    message,
    callback1Btn,
    callback1,
    callback2Btn,
    callback2
  });
}

export const sendWarningAlert = (title: string, message?: string, callback1Btn?: string, callback1?: () => void, callback2Btn?: string, callback2?: () => void) => {
  sendAlert({
    id: generateId(),
    type: AlertType.WARNING,
    title,
    message,
    callback1Btn,
    callback1,
    callback2Btn,
    callback2
  });
}

export const sendErrorAlert = (title: string, error: any, callback1Btn?: string, callback1?: () => void, callback2Btn?: string, callback2?: () => void) => {
  let message = error.message || error
  sendAlert({
    id: generateId(),
    type: AlertType.ERROR,
    title,
    message,
    callback1Btn,
    callback1,
    callback2Btn,
    callback2
  });
}

export const sendInfoAlert = (title: string, message?: string, callback1Btn?: string, callback1?: () => void, callback2Btn?: string, callback2?: () => void) => {
  sendAlert({
    id: generateId(),
    type: AlertType.INFO,
    title,
    message,
    callback1Btn,
    callback1,
    callback2Btn,
    callback2
  });
}

export const clearAlerts = () => {
  alerts.set([]);
}