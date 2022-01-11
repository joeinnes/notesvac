<script lang="ts">
	import { goto } from '$app/navigation';
	import directus from '$lib/directus';
	import user from '../store/user';

	let loading = false;
	const logout = async () => {
		loading = true;
		await directus.auth.logout();
		$user = null;
		goto('/');
		loading = false;
	};
</script>

<div class="grid grid-cols-3 items-center px-10 py-6 bg-primary text-center">
	<div />
	<h1 class="font-bold text-4xl"><a href={$user ? '/notes' : '/'}>NotesVac</a></h1>
	<div class="text-right">
		{#if $user}
			<div class="flex">
				<div class="mr-2">
					<span class="block">{$user.first_name} {$user.last_name}</span>
					<span class="block">{$user.email}</span>
				</div>

				<button class="btn" on:click={logout}>Log Out</button>
			</div>
		{:else}
			<button class="btn" on:click={() => goto('/login')}>Log In</button>
		{/if}
	</div>
</div>
