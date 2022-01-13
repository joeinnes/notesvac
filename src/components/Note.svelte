<script lang="ts">
	import directus from '$lib/directus';
	import currentNote from '../store/currentNote';
	import Button from './Button.svelte';
	import { CircleWavyCheck, FloppyDisk, MagicWand } from 'phosphor-svelte';
	import { browser } from '$app/env';
	let editMode = false;
	let working = false;
	let correctedNote = '';
	export let filter = '';

	let display = 'ocr';
	if ($currentNote?.ai) display = 'ai';
	if ($currentNote?.corrected) display = 'corrected';
	let auth_token = '';
	if (browser) {
		auth_token = localStorage.getItem('auth_token');
	}
	const enhance = async () => {
		try {
			working = true;

			const result = await fetch('/api/enhance', {
				method: 'POST',
				body: JSON.stringify({ content: $currentNote.ocr }),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const jsonRes = await result.json();
			const updatedNote = await directus.items('notes').updateOne($currentNote.id, {
				ai: jsonRes.data.replace('\n\nCorrected:\n', '')
			});
			$currentNote.ai = jsonRes.data.replace('\n\nCorrected:\n', '');
		} catch (e) {
			console.error(e);
		} finally {
			working = false;
		}
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
	currentNote.subscribe((val) => {
		if (val?.ocr) display = 'ocr';
		if (val?.ai) display = 'ai';
		if (val?.corrected) display = 'corrected';
	});
</script>

{#if $currentNote}
	<div class="flex items-start justify-between">
		<div class="w-full max-w-prose">
			<div class="flex items-center gap-2 justify-start pb-2">
				<div>
					<select bind:value={display}>
						<option disabled={true}>-- Select --</option>
						<option value="ocr">OCR</option>
						<option disabled={!$currentNote?.ai} value="ai">AI</option>
						<option disabled={!$currentNote?.corrected} value="corrected">Corrected</option>
					</select>
				</div>
				<div class="w-full">
					<Button clickHandler={() => enhance()} disabled={!!($currentNote.ai || working)}
						><MagicWand />&nbsp;Submit to AI</Button
					>
				</div>
				<div class="w-full">
					<Button type={editMode ? 'secondary' : ''} clickHandler={toggleEditMode}
						>{#if editMode}<FloppyDisk />{:else}<CircleWavyCheck />{/if}&nbsp;{editMode
							? 'Save'
							: 'Correct Manually'}</Button
					>
				</div>
			</div>
			<div class="bg-yellow-100 shadow rounded p-4">
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
						{@html $currentNote[display] &&
							$currentNote[display].replaceAll(filter, `<span class='bg-accent'>${filter}</span>`)}
					</div>
				{/if}
			</div>
		</div>
		<div class="flex flex-col flex-1 px-8">
			<h3 class="mb-3 text-2xl font-extrabold">Original Scan</h3>
			{#key $currentNote}
				<object
					title="Original Scan"
					data={import.meta.env.VITE_API_URL +
						'/assets/' +
						$currentNote?.original_scan +
						'?access_token=' +
						auth_token +
						'#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&view=Fit'}
					type="application/pdf"
					style="width: 100%; aspect-ratio: 2/3;"
				/>
			{/key}
		</div>
	</div>
{:else}
	<img src="images/digital_nomad.svg" alt="No note selected" class="w-1/2 aspect-square mx-auto" />
	<p class="text-center">Pick a note to get started</p>
{/if}

<style lang="scss">
	select {
		@apply px-4 py-2 rounded border-grayscale-800 border outline-accent2-700;
	}
</style>
