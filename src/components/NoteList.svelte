<script lang="ts">
	import directus from '$lib/directus';
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { SpinnerGap } from 'phosphor-svelte';

	import { debounce } from '$lib/debounce';
	import user from '../store/user';
	import search from '../store/search';

	import Button from './Button.svelte';
	import NotePreview from './NotePreview.svelte';

	const limit = 7;
	let page = 1;
	let formerSearch = '';
	const config = {
		limit,
		sort: ['-date_created'],
		meta: 'filter_count',
		from_user: '',
		page,
		search: ''
	};
	let authFailed = false;

	const getNotes = async (page: number, searchString: string) => {
		try {
			$user = await directus.users.me.read();
			if (!$user) throw 'No user';
			authFailed = false;
			if (searchString && formerSearch !== '') {
				page = 0;
			}
			config.from_user = $user.email;
			config.page = page;
			config.search = searchString;
		} catch (e) {
			if (authFailed) {
				console.log('Auth failed and could not refresh. Routing to login');

				if (browser) goto('/login');
				return;
			}
			authFailed = true;
			await directus.auth.refresh();
			getNotes(page, $search);
			return null;
		}
		if (authFailed) {
			console.log('Auth failed and could not refresh.');
			return null;
		}

		try {
			const fetchedData = await directus.items('notes').readMany(config);
			return fetchedData;
		} catch (e) {
			console.error("Couldn't get Notes");
			return null;
		}
	};

	// I need to use a function to debounce, and this won't return the kind of promise I can await in an #await block.
	const handleInput = debounce((e: KeyboardEvent) => {
		$search = e.target.value;
		formerSearch = $search;
	}, 300);

	$: getNotes(page, $search);
</script>

<h2 class="text-2xl font-extrabold">Your Notes</h2>

<input
	type="text"
	placeholder="Search..."
	on:input={handleInput}
	class="w-full hover:scale-105 transition-transform duration-200"
/>
{#await getNotes(page, $search)}
	<div class="w-full flex items-center justify-center pt-8">
		<span class="animate-spin">
			<SpinnerGap size={52} weight="duotone" />
		</span>
	</div>
{:then fetchedData}
	{@const { meta } = fetchedData}
	{@const notes = fetchedData.data}
	{#each notes as note, index}
		<NotePreview {note} hasBorder={index !== notes.length - 1} />
	{/each}
	<div class="flex justify-between items-center text-center">
		{#if fetchedData.meta.filter_count > limit}
			<div>
				<Button type="accent" disabled={page === 1} clickHandler={() => page--}>Previous</Button>
			</div>
			<div class="flex-1">
				<span>{page} of {Math.ceil(meta.filter_count / limit)}</span>
			</div>
			<div>
				<Button
					type="accent"
					disabled={page === Math.ceil(meta.filter_count / limit)}
					clickHandler={() => page++}>Next</Button
				>
			</div>
		{/if}
	</div>
{:catch e}
	<pre>{e}</pre>
{/await}

<style lang="scss">
	input {
		@apply px-4 py-2 my-2 rounded border-grayscale-800 border outline-accent2-700;
	}
</style>
