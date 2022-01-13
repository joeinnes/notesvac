<script>
	import Header from '../components/Header.svelte';
	import Footer from '../components/Footer.svelte';
	import '@fontsource/inconsolata';
	import '@fontsource/karla';
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

<div class="flex flex-col relative min-h-screen bg-grayscale-50">
	<Header />
	<div class="flex-1 h-full">
		<slot />
	</div>
</div>
<Footer />

<style>
	:global(body) {
		font-family: 'Inconsolata', monospace;
	}
	:global(h1, h2, h3, h4, h5, h6) {
		font-family: 'Karla', serif;
	}
</style>
