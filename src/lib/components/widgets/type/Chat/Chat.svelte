<script lang="ts">
	import { afterUpdate, onMount } from 'svelte'
	import ChatInput from './ChatInput.svelte'
	import Comment from './Comment.svelte'

	export let props: {
		action: string
		data: any
		callback?: any
	}
	const { action, data, callback } = props

	export let program: string

	let conversation = data && data.conversation ? data.conversation : []

	onMount(() => {
		scroolToBottom()
	})

	afterUpdate(() => {
		scroolToBottom()
	})

	const scroolToBottom = () => {
		const comments = document.querySelector('.ag-comments')
		if (!comments) return
		comments.scrollTop = comments.scrollHeight
	}

	const handleNewComment = (event) => {
		conversation = [...conversation, event.detail]
		if (callback) callback(event.detail)
	}
</script>

{#if action === 'comments'}
	<div class="mb-2 text-lg font-bold">Convesation:</div>
	<div class="ag-comments flex flex-col gap-2">
		{#if conversation && conversation.length > 0}
			{#each conversation as comment}
				<Comment {comment} />
			{/each}
		{:else}
			<div class="text-center">No messages yet</div>
		{/if}
	</div>
{/if}
<ChatInput {action} {program} on:input={handleNewComment} />

<style>
	.ag-comments {
		max-height: 300px;
		overflow-y: auto;
		border: 1px solid #eee;
	}
</style>
