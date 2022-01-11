<script lang="ts">
	import directus from '$lib/directus';
	import type { Note } from '$lib/directus';
	import currentNote from '../store/currentNote';
	let displayScan = false;
	let editMode = false;
	let correctedNote = '';
	export let filter = '';

	let display = 'ocr';
	if ($currentNote?.ai) display = 'ai';
	if ($currentNote?.corrected) display = 'corrected';

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
</script>

{#if $currentNote}
	<div class="flex justify-between">
		<div class="bg-yellow-200 max-w-prose shadow rounded p-4">
			<h3 class="text-3xl mb-4 font-extrabold">{$currentNote.title}</h3>
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
		</div>
		<div class="flex flex-col flex-1 px-8">
			<div class="w-full">
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
			<h3 class="mb-2">Original Scan</h3>
			<object
				title="Original Scan"
				data={import.meta.env.VITE_API_URL +
					'/assets/' +
					$currentNote.original_scan +
					'#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&view=Fit'}
				type="application/pdf"
				style="width: 100%; aspect-ratio: 30/44; background-color: blue;"
			/>
		</div>
	</div>
{:else}
	<img src="images/coffee.svg" alt="No note selected" class="w-1/2 aspect-square mx-auto" />
	<p class="text-center">Pick a note to get started</p>
{/if}
