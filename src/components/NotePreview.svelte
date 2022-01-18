<script lang="ts">
	import currentNote from '../store/currentNote';
	import type { Note as NoteType } from '../lib/directus';
	export let hasBorder = true;
	export let note: NoteType;
</script>

<div
	class="cursor-pointer py-2 transform hover:scale-105 transition-transform duration-200 {hasBorder
		? 'border-b'
		: ''}"
	on:click={() => ($currentNote = note)}
>
	<h3 class="text-lg flex items-center font-semibold">
		<a id={note.title}>
			{note.title}
		</a>
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
		{note.corrected?.split('\n')[0] ?? note.ai?.split('\n')[0] ?? note.ocr?.split('\n')[0]}
	</p>
</div>
