<script lang="ts">
	import Note from '../components/Note.svelte';
	import NoteList from '../components/NoteList.svelte';
	import { UserCircle } from 'phosphor-svelte';
	import user from '../store/user';
	import tokensUsed from '../store/tokensUsed';
	let filter = '';
</script>

<svelte:head><title>NotesVac | Notes</title></svelte:head>

<div class="flex flex-col flex-1 items-stretch h-full">
	<div class="flex flex-1 items-stretch h-full">
		<div class="w-1/3 bg-grayscale-100 self-stretch h-full shadow flex flex-col">
			<div class="flex-1 overflow-y-hidden h-full py-4 ">
				<NoteList />
			</div>
			<div
				class="flex justify-between items-center p-4 bg-grayscale-400 text-xl shadow border-t border-grayscale-300"
			>
				<div class="flex items-center">
					<UserCircle weight="duotone" />
					<span class="ml-2 block"
						>{$user?.first_name}
						{$user?.last_name}</span
					>
				</div>
				<div>
					<div class="flex flex-col items-end">
						{#if typeof $tokensUsed === 'number'}
							<div class="flex flex-col">
								<span class="text-sm">
									{$tokensUsed.toLocaleString()}/{(1000000).toLocaleString()}</span
								>
								<meter
									class="rounded w-full"
									low="0"
									high="800000"
									max="1000000"
									value={$tokensUsed}
								/>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
		<div class="w-2/3 p-4 pb-16 overscroll-none">
			<Note />
		</div>
	</div>
</div>
