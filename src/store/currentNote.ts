import { writable } from "svelte/store";
import type { Note } from '$lib/directus';
const currentNote = writable<Note>();

export default currentNote;