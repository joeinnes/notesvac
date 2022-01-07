<script lang="ts">
	import directus from '$lib/directus';
	import user from '../store/user';
	const logout = () => {
		directus.auth.logout();
	};
</script>

{#if $user}
	<div class="flex justify-between items-center px-4 py-6 bg-primary">
		<h1 class="font-black text-4xl">NotesVac</h1>
		<div class="flex">
			<div class="mr-2">
				<span class="block">{$user.first_name} {$user.last_name}</span>
				<span class="block">{$user.email}</span>
			</div>

			<button class="btn" on:click={logout}>Logout</button>
		</div>
	</div>
{/if}
