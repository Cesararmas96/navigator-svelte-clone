import { writable } from 'svelte/store'

export const isAuthenticated = writable<boolean>()
export const sessionData = writable()
