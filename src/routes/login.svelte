<script lang="ts">
	import { goto } from '$app/navigation';
	import user from '../store/user';

	import directus from '$lib/directus';
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

<div class="mx-auto max-w-5xl mt-4 grid grid-cols-2 gap-4">
	<div>
		<h1 class="font-extrabold text-2xl">Log In</h1>

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
			<button type="submit" class="btn">Log In</button>
		</form>
	</div>
	<div>
		<img src="images/skateboard.svg" alt="Log In illustration" class="w-full aspect-square" />
	</div>
	<div class="modal {error ? 'modal-open' : ''}">
		<div class="modal-box">
			<h2 class="font-extrabold text-xl mb-2">Could not log you in!</h2>
			<p>
				{error}
			</p>
			<div class="modal-action">
				<button class="btn btn-primary" on:click={() => (error = null)}>OK</button>
			</div>
		</div>
	</div>
</div>
