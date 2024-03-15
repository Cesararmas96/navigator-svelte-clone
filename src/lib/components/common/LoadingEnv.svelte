<script>
	import { onMount } from 'svelte'

	let textEnvironments = null

	onMount(() => {
		const env = import.meta.env.VITE_ENV

		if (env && (env === 'dev' || env === 'staging')) {
			textEnvironments =
				env === 'dev' ? 'This is the DEV environment' : 'This is the QA environment'
		}
	})
</script>

{#if textEnvironments}
	<div class="progress-bar-repeat">
		<div class="progress-bar-repeat-text">{textEnvironments}</div>
	</div>
{/if}

<style>
	@keyframes barberpole {
		0% {
			background-position: -190px 0;
		}
		to {
			background-position: 0 0;
		}
	}

	.progress-bar-repeat {
		width: calc(100vw + 190px);
		margin: 0 auto;
		background-size: 100% 88px;
		background: repeating-linear-gradient(
				-25deg,
				#f5706f,
				#f5706f 20px,
				#f2403f 0,
				#f2403f 40px,
				#f5706f 0,
				#f5706f 60px,
				#f45857 0,
				#f45857 80px
			)
			repeat-y 0 0;
		-webkit-animation: barberpole 4s linear infinite;
		animation: barberpole 4s linear infinite;
	}

	.progress-bar-repeat-text {
		font-weight: bold;
		font-size: 0.8rem;
		color: #fff;
		text-transform: uppercase;
		width: 100vw;
		text-align: center;
	}
</style>
