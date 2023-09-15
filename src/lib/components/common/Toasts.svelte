<script lang="ts">
	import { dismissNotification, toasts } from '$lib/stores/toast'
	import Toast from './Toast.svelte'
</script>

{#if $toasts}
	<section>
		{#each $toasts as toast (toast.id)}
			<Toast
				type={toast.type}
				dismissible={toast.dismissable}
				on:dismiss={() => dismissNotification(toast.id)}>{toast.message}</Toast
			>
		{/each}
	</section>
{/if}

<style>
	section {
		position: fixed;
		top: 60px;
		left: 0;
		right: 0;
		width: 100%;
		display: flex;
		margin-top: 1rem;
		justify-content: center;
		align-items: flex-end;
		flex-direction: column;
		z-index: 1000;
	}
</style>
