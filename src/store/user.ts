import { writable } from "svelte/store";
import type { UserItem, PartialItem } from "@directus/sdk";

const user = writable<PartialItem<UserItem<unknown>>>();

export default user;