<script>
	import Header from '../components/Header.svelte';
	import Footer from '../components/Footer.svelte';
	import '../app.css';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	if (browser) {
		const urlParams = new URLSearchParams(window.location.hash.slice(1));
		if (urlParams.get('type') === 'recovery') {
			goto('/password-reset#access_token=' + urlParams.get('access_token'));
		}
	}
</script>

<svelte:head><title>NotesVac</title></svelte:head>

<div>
	<div class="min-h-screen">
		<Header />
		<slot />
	</div>
	<Footer />
</div>
