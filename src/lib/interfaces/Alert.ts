export enum AlertType {
  INFO = "info",
  ERROR = "error",
  WARNING = "warning",
  SUCCESS = "success",
}

export interface AlertMessage {
  id?: string,
  type: AlertType,
  title: string,
  message?: string,
  callback1Btn?: string,
  callback1?: () => void,
  callback2Btn?: string,
  callback2?: () => void
}