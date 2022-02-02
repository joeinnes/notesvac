<script lang="ts">
	import directus from '$lib/directus';
	import currentNote from '../store/currentNote';
	import search from '../store/search';
	import Button from './Button.svelte';
	import { CircleWavyCheck, FloppyDisk, MagicWand } from 'phosphor-svelte';
	import { browser } from '$app/env';
	import tokensUsed from '../store/tokensUsed';
	let editMode = false;
	let working = false;
	let correctedNote = {
		corrected: '',
		title: '',
		date_created: null
	};

	let display = 'ocr';
	if ($currentNote?.ai) display = 'ai';
	if ($currentNote?.corrected) display = 'corrected';
	let auth_token = '';
	const enhance = async () => {
		try {
			working = true;
			const access_token = directus.auth.token;

			const result = await fetch('/api/enhance', {
				method: 'POST',
				body: JSON.stringify({ content: $currentNote.ocr, access_token }),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const jsonRes = await result.json();
			const updatedNote = await directus.items('notes').updateOne($currentNote.id, {
				ai: jsonRes.data.replace('\n\nCorrected:\n', '')
			});
			$currentNote.ai = jsonRes.data.replace('\n\nCorrected:\n', '');
			$tokensUsed += jsonRes.tokensUsed;
		} catch (e) {
			console.error(e);
		} finally {
			working = false;
		}
	};

	const toggleEditMode = async () => {
		if (editMode) {
			// Post to server
			directus.items('notes').updateOne($currentNote.id, correctedNote);
			editMode = false;
			$currentNote = {...$currentNote, ...correctedNote};
			display = 'corrected';
		} else {
			let date_created = new Date($currentNote.date_created);
			correctedNote.title = $currentNote.title;
			correctedNote.date_created = date_created.toISOString().substr(0,date_created.toISOString().indexOf("."));
			correctedNote.corrected = $currentNote[display];
			editMode = true;
		}
	};
	currentNote.subscribe((val) => {
		editMode = false;
		if (val?.ocr) display = 'ocr';
		if (val?.ai) display = 'ai';
		if (val?.corrected) display = 'corrected';
		// Reload the token
		if (browser) {
			auth_token = localStorage.getItem('auth_token');
		}
	});
</script>

{#if $currentNote}
	<div class="flex items-start justify-between h-full">
		<div class="w-full max-w-prose h-full">
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
			<div
				class="bg-yellow-100 shadow rounded p-4 max-h-full overflow-y-auto"
				style="scrollbar-gutter: stable"
			>
				{#if editMode}
					<h3
						class="text-3xl font-extrabold outline-none outline-accent2-700 p-2 rounded py-1"
						contenteditable="true"
						bind:textContent={correctedNote.title}
					>
						{$currentNote.title}
					</h3>
					<div class="font-extralight text-base-content text-xs h-12 flex flex-col justify-center">
					<div class="relative">
					<label for="date_created" class="hidden">Date:&nbsp;</label>
						<input type="datetime-local" bind:value={correctedNote.date_created} id="date_created" class="bg-transparent outline-none outline-accent2-700 py-1 rounded text-right" /></div>
					</div>
					<div class="outline-none p-2 rounded outline-accent2-700 max-w-prose py-1">
						<div
							class="font-light whitespace-pre-line inline outline-none"
							contenteditable="true"
							bind:textContent={correctedNote.corrected}
						>
							{$currentNote[display]}
						</div>
					</div>
				{:else}
					<h3 class="text-3xl font-extrabold p-2 py-1">{$currentNote.title}</h3>

					<div class="font-extralight text-base-content text-xs p-2 py-1 h-12 flex flex-col justify-center">
					<div>
					<span class="py-1">
						{new Date($currentNote.date_created).toLocaleString('en-GB', {
							weekday: 'short',
							year: 'numeric',
							month: 'short',
							day: '2-digit',
							hour: 'numeric',
							minute: '2-digit',
							hourCycle: 'h11'
						})}
						</span>
						</div>
					</div>
					<div class="whitespace-pre-line font-light max-w-prose p-2 py-1">
						{@html $currentNote[display] &&
							$currentNote[display].replaceAll($search, `<mark>${$search}</mark>`)}
					</div>
				{/if}
			</div>
		</div>
		<div class="flex flex-col flex-1 px-8 h-full">
			<h3 class="mb-3 text-2xl font-extrabold">Original Scan</h3>
			{#key $currentNote}
				<!-- note that the aspect ratio here probably won't work because the space on the page will probably be taller and narrower -->
				<object
					title="Original Scan"
					data={import.meta.env.VITE_API_URL +
						'/assets/' +
						$currentNote?.original_scan +
						'?access_token=' +
						auth_token +
						'#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&view=FitH'}
					type="application/pdf"
					class="w-full max-h-full overscroll-none"
					style="aspect-ratio: 2/3;"
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
	input[type="datetime-local"] {
		&::-webkit-calendar-picker-indicator{
			
			position: absolute;
			/* This next line is essentially unsetting the padding */
			left: -1.5rem;
		}

	}
</style>
