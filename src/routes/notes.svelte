<script lang="ts">
	import Note from '../components/Note.svelte';
	import directus from '$lib/directus';
	import type { Note as NoteType } from '$lib/directus';
	import user from '../store/user';
	import currentNote from '../store/currentNote';
	import { goto } from '$app/navigation';
	let notes = [];
	let filter = '';

	const loadNotes = async () => {
		let authenticated = false;
		try {
			// Try to authenticate with token if exists
			await directus.auth.refresh();
			$user = await directus.users.me.read();
			authenticated = true;
			const fetchedData = await directus.items('notes').readMany({
				sort: ['-date_created']
			});
			notes = fetchedData.data;
		} catch (e) {
			goto('/login');
			console.log(e);
		}
	};
	loadNotes();
	const ONE_MINUTE = 60 * 1000;
	setInterval(loadNotes, ONE_MINUTE);

	$: {
		// TODO: This will slam on the server, debounce please.
		if (filter) {
			directus
				.items('notes')
				.readMany({ search: filter })
				.then((data) => {
					notes = data.data;
				});
		}
	}
</script>

<svelte:head><title>NotesVac | Notes</title></svelte:head>

<div class="h-full">
	<div class="flex">
		<div class="w-1/3 p-4">
			<h2 class="text-2xl font-extrabold mb-4">Your Notes</h2>
			<input
				type="text"
				class="input input-sm input-bordered w-full mb-2"
				placeholder="Search"
				bind:value={filter}
			/>
			{#if notes.length}
				{#each notes as note}
					<div class="px-2" on:click={() => ($currentNote = note)}>
						<h3 class="text-lg">{note.title}</h3>
						<small class="font-extralight text-base-content text-xs">
							{new Date(note.date_created).toLocaleString('en-GB', {
								weekday: 'short',
								year: 'numeric',
								month: 'short',
								day: '2-digit',
								hour: 'numeric',
								minute: '2-digit',
								hourCycle: 'h11'
							})}
						</small>
						<p class="truncate text-sm">
							{note.corrected?.split('\n')[1] ??
								note.ai?.split('\n')[1] ??
								note.ocr?.split('\n')[1]}
						</p>
					</div>
					<div class="divider" />
				{/each}
			{:else}
				You haven't taken any notes yet!
			{/if}
		</div>
		<div class="w-2/3 p-4 pb-16">
			<Note {filter} />
		</div>
	</div>
</div>
