<script>
	import Icon from '$lib/components/common/Icon.svelte'

	let isLike = false
</script>

<button
	class="icon btn hover:bg-light-100 dark:hover:bg-dark-200"
	on:click={(event) => (isLike = !isLike)}
>
	<Icon icon={isLike ? 'twemoji:red-heart' : 'icon-park-outline:like'} size="18" />
</button>
