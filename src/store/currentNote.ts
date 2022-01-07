import { writable } from "svelte/store";

const currentNote = writable();

export default currentNote;