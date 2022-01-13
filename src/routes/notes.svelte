<script lang="ts">
	import { onMount } from 'svelte';
	import Note from '../components/Note.svelte';
	import directus from '$lib/directus';
	import { SpinnerGap, UserCircle } from 'phosphor-svelte';
	import user from '../store/user';
	import currentNote from '../store/currentNote';
	import { goto } from '$app/navigation';
	let notes = [];
	let filter = '';
	let loading = true;
	const loadNotes = async () => {
		let authenticated = false;
		try {
			// Try to authenticate with token if exists
			await directus.auth.refresh();
			$user = await directus.users.me.read();
			authenticated = true;
			const fetchedData = await directus.items('notes').readMany({
				filter: {
					from_user: $user.email
				},
				sort: ['-date_created']
			});
			notes = fetchedData.data;
		} catch (e) {
			goto('/login');
			console.log(e);
		} finally {
			loading = false;
		}
	};
	onMount(() => {
		loadNotes();
		const ONE_MINUTE = 60 * 1000;
		const interval = setInterval(loadNotes, ONE_MINUTE);
		return () => clearInterval(interval);
	});

	$: {
		// TODO: This will slam on the server, debounce please.
		if (filter && filter.length > 2) {
			directus
				.items('notes')
				.readMany({
					search: filter,
					filter: {
						from_user: $user.email
					}
				})
				.then((data) => {
					notes = data.data;
				});
		}
	}
</script>

<svelte:head><title>NotesVac | Notes</title></svelte:head>

<div class="flex flex-col flex-1 items-stretch">
	<div class="flex flex-1 items-stretch">
		<div class="w-1/3 py-4 px-8 bg-grayscale-100 self-stretch border-r  shadow">
			<h2 class="text-2xl font-extrabold">Your Notes</h2>
			<div class="mr-2 flex items-center">
				<UserCircle weight="duotone" />
				<span class="ml-2 block">{$user?.first_name} {$user?.last_name}</span>
			</div>

			<input type="text" placeholder="Search" bind:value={filter} class="w-full" />
			{#if loading}
				<div class="w-full	flex items-center justify-center pt-8">
					<span class="animate-spin">
						<SpinnerGap size={52} weight="duotone" />
					</span>
				</div>
			{:else if notes.length}
				<div>
					{#each notes as note, index}
						<div
							class="py-2 {index < notes.length - 1 ? 'border-b' : ''}"
							on:click={() => ($currentNote = note)}
						>
							<h3 class="text-lg flex items-center">
								{note.title}
							</h3>
							<small class="text-grayscale-600 text-xs">
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
							<p class="truncate text-sm mt-2">
								{note.corrected?.split('\n')[0] ??
									note.ai?.split('\n')[0] ??
									note.ocr?.split('\n')[0]}
							</p>
						</div>
					{/each}
				</div>
			{:else}
				<div>You haven't taken any notes yet!</div>
			{/if}
		</div>
		<div class="w-2/3 p-4 pb-16">
			<Note {filter} />
		</div>
	</div>
</div>

<style lang="scss">
	input {
		@apply px-4 py-2 my-2 rounded border-grayscale-800 border outline-accent2-700;
	}
</style>
