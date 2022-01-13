<script lang="ts">
	import { goto } from '$app/navigation';
	import directus from '$lib/directus';
	import user from '../store/user';
	import { SignIn, SignOut } from 'phosphor-svelte';
	import Button from './Button.svelte';

	let loading = false;
	const logout = async () => {
		loading = true;
		await directus.auth.logout();
		$user = null;
		goto('/');
		loading = false;
	};
</script>

<div
	class="grid grid-cols-3 justify-center items-center px-10 py-6 bg-primary-900 text-primary-100 text-center shadow"
>
	<div />
	<h1 class="font-bold text-4xl"><a href={$user ? '/notes' : '/'}>NotesVac</a></h1>
	<div class="flex justify-end items-center">
		{#if $user}
			<div>
				<Button clickHandler={logout} type="primary"
					>Log Out&nbsp;<SignOut weight="duotone" /></Button
				>
			</div>
		{:else}
			<div>
				<Button clickHandler={() => goto('/login')} type="primary">
					Log In&nbsp;<SignIn weight="duotone" /></Button
				>
			</div>
		{/if}
	</div>
</div>
