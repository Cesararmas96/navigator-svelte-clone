<script lang="ts">
	import { Textarea, Toolbar, ToolbarButton, ToolbarGroup } from 'flowbite-svelte'
	import { getContext, onMount } from 'svelte'
	import Icon from './Icon.svelte'

	import Markdown from 'svelte-exmarkdown'
	import { gfmPlugin } from 'svelte-exmarkdown/gfm'

	const plugins = [gfmPlugin()]

	let widgetSettings: any
	widgetSettings = getContext('widgetSettings')

	let editor: HTMLTextAreaElement
	let activeBtn: string

	onMount(() => {
		editor = document.getElementById('editor') as HTMLTextAreaElement
	})

	const handleBoldFormat = () => {
		if (editor.selectionStart !== editor.selectionEnd) {
			const selectedText = editor.value.substring(editor.selectionStart, editor.selectionEnd)
			const beforeText = editor.value.substring(0, editor.selectionStart)
			const afterText = editor.value.substring(editor.selectionEnd, editor.value.length)
			editor.value = `${beforeText}**${selectedText}**${afterText}`
		} else {
			const beforeText = editor.value.substring(0, editor.selectionStart)
			const afterText = editor.value.substring(editor.selectionEnd, editor.value.length)
			editor.value = `${beforeText}**Bold**${afterText}`
		}
	}

	const handleItalicFormat = () => {
		if (editor.selectionStart !== editor.selectionEnd) {
			const selectedText = editor.value.substring(editor.selectionStart, editor.selectionEnd)
			const beforeText = editor.value.substring(0, editor.selectionStart)
			const afterText = editor.value.substring(editor.selectionEnd, editor.value.length)
			editor.value = `${beforeText}*${selectedText}*${afterText}`
		} else {
			const beforeText = editor.value.substring(0, editor.selectionStart)
			const afterText = editor.value.substring(editor.selectionEnd, editor.value.length)
			editor.value = `${beforeText}*Italic*${afterText}`
		}
	}

	const hableListBulleted = () => {
		if (editor.selectionStart !== editor.selectionEnd) {
			const selectedText = editor.value.substring(editor.selectionStart, editor.selectionEnd)
			const beforeText = editor.value.substring(0, editor.selectionStart)
			const afterText = editor.value.substring(editor.selectionEnd, editor.value.length)
			editor.value = `${beforeText}* ${selectedText}\n* ${afterText}`
		} else {
			const beforeText = editor.value.substring(0, editor.selectionStart)
			const afterText = editor.value.substring(editor.selectionEnd, editor.value.length)
			editor.value = `${beforeText}* List item${afterText}`
		}
	}
</script>

<Textarea
	id="editor"
	rows="8"
	class="mb-4"
	placeholder="Write a Tooltip Help"
	bind:value={$widgetSettings.description}
>
	<Toolbar slot="header" embedded color="gray">
		<ToolbarGroup>
			<ToolbarButton name="Format Bold" class="m-0 flex p-1" on:click={handleBoldFormat}>
				<Icon icon="material-symbols:format-bold" size="20" />
			</ToolbarButton>
			<ToolbarButton name="Format Italic" class="m-0 flex p-1" on:click={handleItalicFormat}>
				<Icon icon="material-symbols:format-italic" size="20" />
			</ToolbarButton>
		</ToolbarGroup>
		<ToolbarGroup>
			<ToolbarButton name="Format List Bulleted" class="m-0 flex p-1" on:click{hableListBulleted}>
				<Icon icon="material-symbols:format-list-bulleted" size="20" />
			</ToolbarButton>
			<ToolbarButton name="Format List Numbered" class="m-0 flex p-1">
				<Icon icon="material-symbols:format-list-numbered" size="20" />
			</ToolbarButton>
		</ToolbarGroup>
		<ToolbarGroup>
			<ToolbarButton name="Add URL Link" class="m-0 flex p-1">
				<Icon icon="material-symbols:link" size="20" />
			</ToolbarButton>
		</ToolbarGroup>
		<ToolbarButton name="View Code" class="m-0 flex p-1" slot="end">
			<Icon icon="material-symbols:code" size="20" />
		</ToolbarButton>
	</Toolbar>
</Textarea>

<Markdown md={$widgetSettings.description} {plugins} />
