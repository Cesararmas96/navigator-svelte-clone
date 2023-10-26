import { sendErrorNotification } from "$lib/stores/toast";

export function handleError(error: unknown): void {
  const errorMessage = error instanceof Error ? error.message : error;

  console.error(errorMessage);
  sendErrorNotification(errorMessage, 6000);
}