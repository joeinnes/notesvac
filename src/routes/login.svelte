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
	directus.auth
		.refresh()
		.then(() => {
			directus.users.me.read().then((me) => {
				$user = me;
			});
			authenticated = true;
			goto('/notes');
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
		} catch (e) {
			console.log(e);
		} finally {
			submitting = false;
		}
	};
</script>

<h1>Log In</h1>

<form on:submit|preventDefault={handleSubmit}>
	<div class="form-control">
		<label class="label" for="email">
			<span class="label-text">Email</span>
		</label>
		<input
			type="text"
			id="email"
			placeholder="joe@example.com"
			class="input input-bordered"
			bind:value={credentials.email}
		/>
	</div>

	<div class="form-control">
		<label class="label" for="password">
			<span class="label-text">Password</span>
		</label>
		<input
			type="password"
			placeholder=""
			id="password"
			class="input input-bordered"
			bind:value={credentials.password}
		/>
	</div>
	<button type="submit" class="btn">Log In</button>
</form>
<pre>
  {JSON.stringify(credentials, null, 2)}
	{JSON.stringify({ authenticated, submitting, $user }, null, 2)}
</pre>
