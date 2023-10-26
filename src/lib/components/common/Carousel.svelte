<script>
	import { onMount } from 'svelte'

	export let images = []
	let currentImageIndex = 0

	onMount(() => {
		const interval = setInterval(() => {
			currentImageIndex = (currentImageIndex + 1) % images.length
		}, 3000) // Cambia la imagen cada 1 segundo

		return () => clearInterval(interval) // Limpia el intervalo al destruir el componente
	})
</script>

<div class="carousel">
	{#each images as image, index}
		<img src={image} alt="Image {index + 1}" class={currentImageIndex === index ? 'active' : ''} />
	{/each}
</div>

<style>
	.carousel {
		width: 100%;
		height: 100vh;
		overflow: hidden;
		position: relative;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: fill;
		position: absolute;
		transition: opacity 0.5s;
		opacity: 0;
	}

	img.active {
		opacity: 1;
	}
</style>
