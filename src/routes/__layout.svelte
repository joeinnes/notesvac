<script>
	import Header from '../components/Header.svelte';
	import Footer from '../components/Footer.svelte';
	let showFooter = false;
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
<div class="max-h-screen relative overflow-y-hidden">
	<div class="flex flex-col relative h-screen bg-grayscale-50">
		<Header />
		<div class="flex-1 h-full overflow-y-hidden">
			<slot />
		</div>
	</div>
	<div
		class="absolute w-full transform bottom-0 {showFooter
			? ''
			: 'translate-y-full'} transition-transform duration-200"
		on:click={() => (showFooter = !showFooter)}
	>
		<div
			class="absolute transform -translate-y-full bg-grayscale-700 text-grayscale-100 inline-block ml-2 px-4 rounded-t-xl cursor-pointer right-4"
		>
			Footer
		</div>
		<Footer />
	</div>
</div>

<style>
	:global(body) {
		font-family: 'Inconsolata', monospace;
	}
	:global(h1, h2, h3, h4, h5, h6) {
		font-family: 'Karla', serif;
	}
</style>
