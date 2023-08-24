<script lang="ts">
	import FooterLike from './footer/Like.svelte'
	import FooterComment from './footer/Comment.svelte'
	import FooterShare from './footer/Share.svelte'

	export let isToolbarVisible: boolean
</script>

<div
	class="widget-footer flex cursor-auto justify-between space-x-8"
	class:hidden={!isToolbarVisible}
	on:pointerdown={(event) => {
		event.preventDefault()
		event.stopPropagation()
	}}
>
	<div class="flex">
		<FooterLike />
		<FooterComment />
	</div>
	<div class="flex text-sm">
		<FooterShare />
	</div>
</div>
