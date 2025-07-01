import { writable } from 'svelte/store';

export const user = writable(null);
export const token = writable(null);
export const isAuthenticated = writable(false);
export const alert = writable({
    message: '',
    type: 'success',
    show: false
});