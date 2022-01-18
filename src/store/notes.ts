import { writable } from "svelte/store";
import type { Note } from '$lib/directus';
const notes = writable<Note[]>([]);

export default notes;