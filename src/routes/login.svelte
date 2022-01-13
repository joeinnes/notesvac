<script lang="ts">
	import { goto } from '$app/navigation';
	import user from '../store/user';
	import Button from '../components/Button.svelte';
	import { SignIn } from 'phosphor-svelte';
	import directus from '$lib/directus';
	import { fly } from 'svelte/transition';

	let credentials = {
		email: '',
		password: ''
	};
	let authenticated = false;
	let loading = true;
	let submitting = false;
	let error = null;
	directus.auth
		.refresh()
		.then(() => {
			directus.users.me.read().then((me) => {
				$user = me;
				authenticated = true;
				goto('/notes');
			});
		})
		.catch(() => {
			// Intentional no-op for refresh token failure
		})
		.finally(() => {
			loading = false;
		});
	const handleSubmit = async () => {
		submitting = true;
		try {
			await directus.auth.login(credentials);
			authenticated = true;
			$user = await directus.users.me.read();
			goto('/notes');
		} catch (e) {
			error = e.message || 'An unknown error occurred';
			setTimeout(() => (error = null), 10000);
			console.log(e);
		} finally {
			submitting = false;
			credentials = {
				...credentials,
				password: ''
			};
		}
	};
</script>

<svelte:head><title>NotesVac | Log In</title></svelte:head>
{#if loading}Loading...{:else}
	<div class="mx-auto max-w-5xl mt-8 grid grid-cols-2 gap-4 place-items-center">
		<div class="w-full">
			<h1 class="font-extrabold text-2xl mb-4">Log In</h1>

			<form on:submit|preventDefault={handleSubmit}>
				<div class="form-control">
					<label class="label" for="email">
						<span class="label-text">Email</span>
					</label>
					<input
						type="email"
						id="email"
						placeholder="joe@example.com"
						class="input input-bordered"
						bind:value={credentials.email}
						required
					/>
				</div>

				<div class="form-control mb-4">
					<label class="label" for="password">
						<span class="label-text">Password</span>
					</label>
					<input
						type="password"
						placeholder=""
						id="password"
						class="input input-bordered"
						bind:value={credentials.password}
						required
						minlength="8"
					/>
				</div>
				<Button type="submit" submitHandler={handleSubmit} {submitting}>
					Log In&nbsp;<SignIn weight="duotone" /></Button
				>
			</form>
		</div>
		<div>
			<img src="images/security.svg" alt="Log In illustration" class="w-full aspect-square" />
		</div>
		{#if error}
			<div class="modal">
				<div class="modal-box" transition:fly={{ y: 50, duration: 200 }}>
					<h2 class="font-extrabold text-xl mb-2">Could not log you in!</h2>
					<p>
						{error}
					</p>
					<div class="modal-action">
						<Button type="error" clickHandler={() => (error = null)}>OK</Button>
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}

<style lang="scss">
	input {
		@apply px-4 py-2 rounded border-grayscale-800 border outline-accent2-700;
	}
	.form-control {
		@apply flex flex-col mb-4;
	}
	.modal {
		@apply fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-opacity-80 bg-grayscale-200 p-8;
		&-box {
			@apply relative bg-white rounded-lg shadow-lg w-1/2 max-w-prose p-8 z-20;
		}
		&-action {
			@apply flex justify-end;
		}
	}
</style>
