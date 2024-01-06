<script lang="ts">
	import { onMount } from 'svelte'

	export let reward: any
	export let badge: any

	let image = `${import.meta.env.VITE_BASE_URL}/assets/img/troc/troc.png`

	onMount(() => {
		if (badge) {
			image = `${import.meta.env.VITE_API_URL}/static/images/badges/${badge.filename}`
		}
	})
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="" on:click>
	<div class="gap-4" class:cursor-pointer={reward.rewards > 0}>
		<div class="flex flex-col items-center justify-center align-middle">
			<!-- svelte-ignore a11y-missing-attribute -->
			<img src={image} width="124" />
			<span class="text-h5 font-weight-medium py-2">{reward.reward}</span>
			<span
				class={`badge rounded-pill p-2 px-4 font-bold 
        ${reward.rewards !== 0 ? 'badge-primary font-weight-bold ' : 'badge-dark'}`}
				>{reward.rewards}</span
			>
		</div>
	</div>
</div>
