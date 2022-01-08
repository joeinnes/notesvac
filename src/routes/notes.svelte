<script lang="ts">
	import directus from '$lib/directus';
	import type { Note } from '$lib/directus';
	import user from '../store/user';
	import currentNote from '../store/currentNote';
	let notes = [];
	let filter = '';
	let display = 'ocr';
	let displayScan = false;
	let editMode = false;
	let correctedNote = '';

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
			console.log(e);
		}
	};
	loadNotes();
	const ONE_MINUTE = 60 * 1000;
	setInterval(loadNotes, ONE_MINUTE);

	const setCurrentNote = (note: Note) => {
		$currentNote = note;
		display = 'ocr';
		if ($currentNote.ai) display = 'ai';
		if ($currentNote.corrected) display = 'corrected';
	};

	const enhance = async () => {
		const result = await fetch('/api/enhance', {
			method: 'POST',
			body: $currentNote.ocr,
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const jsonRes = await result.json();
		const updatedNote = await directus.items('notes').updateOne($currentNote.id, {
			ai: jsonRes.data.replace('\n\nCorrected:\n', '')
		});
		$currentNote.ai = jsonRes.data.replace('\n\nCorrected:\n', '');
	};

	const toggleEditMode = async () => {
		if (editMode) {
			// Post to server
			directus.items('notes').updateOne($currentNote.id, {
				corrected: correctedNote
			});
			editMode = false;
			$currentNote.corrected = correctedNote;
			display = 'corrected';
		} else {
			correctedNote = $currentNote[display];
			editMode = true;
		}
	};
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
					<div class="px-2" on:click={() => setCurrentNote(note)}>
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
			{#if $currentNote}
				<div class="flex justify-between">
					<h3 class="text-3xl mb-4 font-extrabold">{$currentNote.title}</h3>
					<div>
						<select class="select select-bordered mb-4 select-sm" bind:value={display}>
							<option disabled={true}>-- Select --</option>
							<option value="ocr">OCR</option>
							<option disabled={!$currentNote.ai} value="ai">AI</option>
							<option disabled={!$currentNote.corrected} value="corrected">Corrected</option>
						</select>
						<button class="btn btn-sm" on:click={() => enhance()} disabled={!!$currentNote.ai}
							>Submit to AI</button
						>
						<button class="btn btn-sm {editMode ? 'btn-secondary' : ''}" on:click={toggleEditMode}
							>{editMode ? 'Save' : 'Correct Manually'}</button
						>
					</div>
				</div>
				<div class="mb-4 font-extralight text-base-content text-xs">
					{new Date($currentNote.date_created).toLocaleString('en-GB', {
						weekday: 'short',
						year: 'numeric',
						month: 'short',
						day: '2-digit',
						hour: 'numeric',
						minute: '2-digit',
						hourCycle: 'h11'
					})}
				</div>
				{#if editMode}
					<div class="border rounded border-neutral max-w-prose">
						<div
							class="font-light whitespace-pre-line inline outline-none"
							contenteditable="true"
							bind:textContent={correctedNote}
						>
							{$currentNote[display]}
						</div>
					</div>
				{:else}
					<div class="whitespace-pre-line font-light max-w-prose">
						{@html $currentNote[display].replaceAll(
							filter,
							`<span class='bg-accent'>${filter}</span>`
						)}
					</div>
				{/if}
				<div
					class="absolute top-1/2 right-0 transform transition-transform -translate-y-1/2 w-1/3 p-4 bg-neutral rounded-l-xl {displayScan
						? ''
						: 'translate-x-full'}"
				>
					<div
						class="absolute top-1/2 left-0 transform -translate-y-1/2 rounded-l-2xl bg-neutral text-neutral-content p-2 -translate-x-full cursor-pointer"
						on:click={() => (displayScan = !displayScan)}
					>
						<div class="transform transition-transform {displayScan && 'rotate-180'}">
							&larr;<br />&larr;<br />&larr;<br />
						</div>
					</div>
					<h3 class="text-neutral-content mb-2">Original Scan</h3>
					<embed
						src={'/api/assets/' +
							$currentNote.original_scan +
							'#toolbar=0&navpanes=0&scrollbar=0&view=Fit'}
						type="application/pdf"
						style="width: 100%; aspect-ratio: 30/44"
					/>
				</div>
			{:else}
				<img src="images/coffee.svg" alt="No note selected" class="w-1/2 aspect-square mx-auto" />
				<p class="text-center">Pick a note to get started</p>
			{/if}
		</div>
	</div>
</div>
