<script lang="ts">
	import directus from '$lib/directus';
	let notes = [];
	let me = {};
	const loadNotes = async () => {
		let authenticated = false;

		// Try to authenticate with token if exists
		await directus.auth.refresh();
		authenticated = true;
		const fetchedData = await directus.items('notes').readMany();
		notes = fetchedData.data;

		me = await directus.users.me.read();
	};
	loadNotes();
	const logout = () => {
		directus.auth.logout();
	};
</script>

<button class="btn" on:click={logout}>Logout</button>
<pre>
  {JSON.stringify(notes, null, 2)}
  {JSON.stringify(me, null, 2)}
</pre>
