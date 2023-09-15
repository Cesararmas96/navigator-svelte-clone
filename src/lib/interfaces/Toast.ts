export enum ToastType {
  INFO = "info",
  ERROR = "error",
  WARNING = "warning",
  SUCCESS = "success",
}

export interface Toast {
  id: number,
  type: ToastType,
  message: string,
  dismissable?: boolean,
  timeout?: number,
}