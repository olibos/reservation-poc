import {writable} from 'svelte/store'
import type { Floor } from './models';
export const selectedFloor = writable<Floor>();