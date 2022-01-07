<script lang="ts">
	import directus from '$lib/directus';
	import user from '../store/user';
	import currentNote from '../store/currentNote';
	let notes = [];
	let filter = '';
	let display = 'ocr';
	let displayScan = false;
	const loadNotes = async () => {
		let authenticated = false;
		try {
			// Try to authenticate with token if exists
			await directus.auth.refresh();
			$user = await directus.users.me.read();
			authenticated = true;
			const fetchedData = await directus.items('notes').readMany();
			notes = fetchedData.data;
		} catch (e) {
			console.log(e);
		}
	};
	loadNotes();

	const setCurrentNote = (note) => {
		$currentNote = note;
		if ($currentNote.ai) display = 'ai';
		if ($currentNote.corrected) display = 'corrected';
	};

	// Debounce the search
	const debounce = (func, timeout = 200) => {
		let timer;
		return (...args) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				func.apply(this, args);
			}, timeout);
		};
	};
	const enhance = async () => {
		const result = await fetch('/api/enhance', {
			method: 'POST',
			body: JSON.stringify({
				text: $currentNote.ocr
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const jsonRes = await result.json();
		console.log(jsonRes);
		const updatedNote = await directus.items('notes').updateOne($currentNote.id, {
			ai: jsonRes.data.replace('\n\nCorrected:\n', '')
		});
		$currentNote = updatedNote;
	};
	$: {
		debounce(() => {
			directus
				.items('notes')
				.readMany({ search: filter })
				.then((data) => {
					notes = data.data;
				});
		});
	}
</script>

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
						<p class="truncate text-sm">{note.corrected ?? note.ai ?? note.ocr}</p>
					</div>
					<div class="divider" />
				{/each}
			{:else}
				You haven't taken any notes yet!
			{/if}
		</div>
		<div class="w-2/3 p-4">
			{#if $currentNote}
				<h3 class="text-3xl mb-4 font-extrabold">{$currentNote.title}</h3>

				<div class="flex justify-between">
					<select class="select select-bordered mb-4" bind:value={display}>
						<option disabled="disabled" selected="selected">-- Select --</option>
						<option value="ocr">OCR</option>
						<option disabled={!$currentNote.ai} value="ai">AI</option>
						<option disabled={!$currentNote.corrected} value="corrected">Corrected</option>
					</select>
					<button class="btn" on:click={() => enhance()} disabled={$currentNote.ai}
						>Submit to AI</button
					>
				</div>

				<div class="whitespace-pre font-light">
					{$currentNote[display]}
				</div>
				<div
					class="fixed top-1/2 right-0 transform transition-transform -translate-y-1/2 w-1/3 p-4 bg-neutral rounded-l-xl {displayScan
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
						src={'https://api.traist.co.uk/assets/' +
							$currentNote.original_scan +
							'#toolbar=0&navpanes=0&scrollbar=0&view=Fit'}
						type="application/pdf"
						style="width: 100%; aspect-ratio: 30/44"
					/>
				</div>
			{/if}
		</div>
	</div>
</div>
