import { writable } from "svelte/store";

const tokensUsed = writable(0);

export default tokensUsed;