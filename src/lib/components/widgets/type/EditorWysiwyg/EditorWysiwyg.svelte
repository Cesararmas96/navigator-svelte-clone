<script lang="ts">
	import type { Editor } from '@tiptap/core'
	import { EditorTheme, SvelteEditor } from '@nextlint/svelte'
	import { getContext } from 'svelte'

	const widget: any = getContext('widget')

	export let html = $widget.format_definition.html
	// import Devtool from './_components/Devtool.svelte'

	console.log(html)
	const showcaseContent = {
		type: 'doc',
		attrs: { align: 'left' },
		content: [
			// { type: 'horizontalRule', attrs: { align: 'left' } },

			{ type: 'paragraph', attrs: { align: 'left' } },
			// {
			// 	type: 'figure',
			// 	attrs: {
			// 		src: 'https://cdn.nextlint.com/users/59e8095b-0d60-4e2a-bf24-83566d10d5c0/25153857-24ec-4fa5-a2ec-776d919c3888.png',
			// 		alt: 'next image',
			// 		title: 'next image',
			// 		direction: 'left'
			// 	},
			// 	content: [{ type: 'text', text: 'next image' }]
			// },
			{
				type: 'heading',
				attrs: { level: 1, align: 'center' },
				content: [{ type: 'text', text: html }]
			}
		]
	}
	let editor: Editor
	let cleaning = true
	let vCard = false

	export let editorModeView: boolean = false

	const onSave = () => {
		const json = editor.getJSON()
		console.log(editor)
		console.log(json)
		// localStorage.setItem('editor', JSON.stringify(json))
	}

	const onClear = () => {
		showcaseContent.content = [
			{
				type: 'heading',
				attrs: { level: 1, align: 'center' },
				content: [{ type: 'text', text: 'Introduce Editor' }]
			}
		]

		cleaning = false

		setTimeout(() => {
			cleaning = true
			console.log(cleaning)
		}, 100)
	}

	const handleUpload = async (file: File) => {
		const blob = new Blob([file])
		const previewUrl = URL.createObjectURL(blob)
		return previewUrl
	}
</script>

<div class="editor">
	<!-- <EditorTheme>
		<div class="container">
			<div class="wrapper">
				<SvelteEditor
					content={showcaseContent}
					placeholder="Write here or press '/' for help"
					onCreated={(createdEditor) => {
						editor = createdEditor
					}}
					onChange={(nextEditor) => {
						editor = nextEditor
					}}
					plugins={{
						selectImage: {
							handleUpload,
							unsplash: {
								accessKey: 'omv67BHUb-gbDEbf9UwFsvGbKdQHwnreJPAzgI0Mz5I'
							}
						}
					}}
				/>
			</div>
		</div>
	</EditorTheme> -->

	{@html html}
</div>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: row;
	}
	.wrapper {
		max-width: 90%;
		width: 100%;
		margin: auto;
		padding: 32px;
		border-radius: 8px;
	}
	.preview {
		max-width: 50%;
		margin: auto;
		margin-top: 120px;
		box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
		padding: 32px;
		border-radius: 8px;
	}
	.editor {
		max-width: 90%;
		width: 100%;
		margin: auto;
	}
</style>
