<script lang="ts">
	export let type = '';
	export let disabled = false;
	export let clickHandler = null;
	export let submitHandler = null;
</script>

<button
	class="btn {type} {disabled ? 'disabled' : ''}"
	on:click={clickHandler}
	on:submit={submitHandler}
	{disabled}
	{type}
>
	<slot />
</button>

<style lang="scss">
	.btn {
		@apply bg-grayscale-900 px-4 py-2 rounded text-grayscale-50 font-bold uppercase text-sm transition-colors duration-200 flex items-center shadow cursor-pointer w-full justify-center;
		&:hover {
			@apply bg-grayscale-700;
		}

		&.primary {
			@apply bg-primary-500 text-primary-900;
			&:hover {
				@apply bg-primary-300;
			}
		}

		&.secondary {
			@apply bg-accent1-300 text-accent1-900;
		}

		&.accent {
			@apply bg-accent2-300 text-accent2-900;
			&:hover {
				@apply bg-accent2-500 text-accent2-100;
			}
		}

		&.submit {
			@apply bg-success-300 text-success-800;
			&:hover {
				@apply bg-success-500;
			}
		}

		&.error {
			@apply bg-error-600 text-error-200;
			&:hover {
				@apply bg-error-300 text-error-800;
			}
		}

		&.disabled {
			@apply bg-grayscale-400 text-grayscale-200 cursor-not-allowed;
		}
	}
</style>
