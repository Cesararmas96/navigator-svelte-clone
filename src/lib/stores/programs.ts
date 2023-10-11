import { writable } from 'svelte/store'

export const storeProgram = writable<any | null>(null)
export const storePrograms = writable<any[] | null>(null)

export const variablesOperationalProgram = writable<any[]>([])
