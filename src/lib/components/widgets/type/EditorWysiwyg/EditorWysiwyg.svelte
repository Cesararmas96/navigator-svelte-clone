<script lang="ts">
	import type { Editor } from '@tiptap/core'
	import { EditorTheme, SvelteEditor } from '@nextlint/svelte'
	import { renderHTML } from '@nextlint/core'

	// import Devtool from './_components/Devtool.svelte'
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
				content: [{ type: 'text', text: 'Introduce Editor' }]
			},
			{ type: 'horizontalRule', attrs: { align: 'left' } },

			{
				type: 'heading',
				attrs: { level: 3, align: 'left' },
				content: [{ type: 'text', text: '❇️ BubbleMenu' }]
			},
			{
				type: 'paragraph',
				attrs: { align: 'left' },
				content: [
					{
						type: 'text',
						text: 'The Bubble Menu is a graphical user interface (GUI) element that appears as a floating menu or toolbar around the selected text or editor content. It provides quick access to various formatting and styling options for the selected text or the content at the current cursor position.'
					}
				]
			},
			{
				type: 'figure',
				attrs: {
					src: 'https://cdn.nextlint.com/users/59e8095b-0d60-4e2a-bf24-83566d10d5c0/7bac49cc-7a47-42a2-9b39-5e1933ec6156.png',
					alt: '2023-06-30T09:59:37,139771895+07:00.png',
					title: 'next image',
					direction: 'left'
				},
				content: [{ type: 'text', text: '2023-06-30T09:59:37,139771895+07:00.png' }]
			},
			{
				type: 'heading',
				attrs: { level: 3, align: 'left' },
				content: [
					{ type: 'text', text: '😎 ' },
					{ type: 'text', marks: [{ type: 'bold' }], text: 'Formatting ' }
				]
			},
			{
				type: 'paragraph',
				attrs: { align: 'left' },
				content: [
					{
						type: 'text',
						text: 'Users can apply formatting options like bold, italics, underline, strikethrough, code blocks, or inline code to their text:'
					}
				]
			},
			{
				type: 'paragraph',
				attrs: { align: 'center' },
				content: [
					{ type: 'text', marks: [{ type: 'bold' }], text: 'Bold' },
					{ type: 'text', text: ' ' },
					{ type: 'text', marks: [{ type: 'italic' }], text: 'Italic' },
					{ type: 'text', text: ' ' },
					{
						type: 'text',
						marks: [
							{
								type: 'highlight',
								attrs: {
									preset: {
										backgroundColor: '#dda15e',
										textColor: '#000',
										isSelect: false
									}
								}
							}
						],
						text: 'Highlight'
					},
					{ type: 'text', text: ' ' },
					{
						type: 'text',
						marks: [
							{
								type: 'link',
								attrs: {
									href: 'https://nextlint.com',
									target: '_blank',
									class: null
								}
							}
						],
						text: 'Link'
					},
					{ type: 'text', text: ' ' },
					{ type: 'text', marks: [{ type: 'strike' }], text: 'strike' },
					{ type: 'text', text: '  ' },
					{ type: 'text', marks: [{ type: 'code' }], text: 'code' }
				]
			},
			{
				type: 'paragraph',
				attrs: { align: 'left' },
				content: [
					{
						type: 'text',
						marks: [
							{
								type: 'highlight',
								attrs: {
									preset: {
										backgroundColor: '#f7f1e3',
										textColor: '#000',
										isSelect: false
									}
								}
							}
						],
						text: 'Text Align Left'
					}
				]
			},
			{
				type: 'paragraph',
				attrs: { align: 'center' },
				content: [
					{
						type: 'text',
						marks: [
							{
								type: 'highlight',
								attrs: {
									preset: {
										backgroundColor: '#8ecae6',
										textColor: '#000',
										isSelect: false
									}
								}
							}
						],
						text: 'Text Align Center'
					}
				]
			},
			{
				type: 'paragraph',
				attrs: { align: 'right' },
				content: [
					{
						type: 'text',
						marks: [
							{
								type: 'highlight',
								attrs: {
									preset: {
										backgroundColor: '#c8b6ff',
										textColor: '#000',
										isSelect: false
									}
								}
							}
						],
						text: 'Text Align Right'
					}
				]
			},
			{
				type: 'paragraph',
				attrs: { align: 'left' },
				content: [
					{
						type: 'text',
						text: 'Bulleted lists, numbered lists, and nested lists:'
					}
				]
			},
			{
				type: 'orderedList',
				attrs: { start: 1, align: 'left' },
				content: [
					{
						type: 'listItem',
						attrs: { align: 'left' },
						content: [
							{
								type: 'paragraph',
								attrs: { align: 'left' },
								content: [{ type: 'text', text: 'Todo 1' }]
							}
						]
					},
					{
						type: 'listItem',
						attrs: { align: 'left' },
						content: [
							{
								type: 'paragraph',
								attrs: { align: 'left' },
								content: [{ type: 'text', text: 'Todo 2' }]
							}
						]
					}
				]
			},
			{ type: 'horizontalRule', attrs: { align: 'left' } },
			{
				type: 'bulletList',
				attrs: { align: 'left' },
				content: [
					{
						type: 'listItem',
						attrs: { align: 'left' },
						content: [
							{
								type: 'paragraph',
								attrs: { align: 'left' },
								content: [{ type: 'text', text: 'Bulleted item 1' }]
							},
							{
								type: 'bulletList',
								attrs: { align: 'left' },
								content: [
									{
										type: 'listItem',
										attrs: { align: 'left' },
										content: [
											{
												type: 'paragraph',
												attrs: { align: 'left' },
												content: [{ type: 'text', text: 'Bulletd Child' }]
											}
										]
									},
									{
										type: 'listItem',
										attrs: { align: 'left' },
										content: [
											{
												type: 'paragraph',
												attrs: { align: 'left' },
												content: [
													{
														type: 'text',
														marks: [
															{
																type: 'highlight',
																attrs: {
																	preset: {
																		backgroundColor: '#218c74',
																		textColor: '#fff',
																		isSelect: false
																	}
																}
															}
														],
														text: 'Press Tab'
													},
													{ type: 'text', text: ' to create nested list' }
												]
											}
										]
									}
								]
							}
						]
					},
					{
						type: 'listItem',
						attrs: { align: 'left' },
						content: [
							{
								type: 'paragraph',
								attrs: { align: 'left' },
								content: [{ type: 'text', text: 'Bulleted item 2' }]
							}
						]
					}
				]
			},
			{ type: 'horizontalRule', attrs: { align: 'left' } },
			{
				type: 'orderedList',
				attrs: { start: 1, align: 'left' },
				content: [
					{
						type: 'listItem',
						attrs: { align: 'left' },
						content: [
							{
								type: 'paragraph',
								attrs: { align: 'left' },
								content: [{ type: 'text', text: 'Item 1' }]
							},
							{
								type: 'orderedList',
								attrs: { start: 1, align: 'left' },
								content: [
									{
										type: 'listItem',
										attrs: { align: 'left' },
										content: [
											{
												type: 'paragraph',
												attrs: { align: 'left' },
												content: [{ type: 'text', text: 'child 1' }]
											}
										]
									},
									{
										type: 'listItem',
										attrs: { align: 'left' },
										content: [
											{
												type: 'paragraph',
												attrs: { align: 'left' },
												content: [{ type: 'text', text: 'child 2' }]
											},
											{
												type: 'orderedList',
												attrs: { start: 1, align: 'left' },
												content: [
													{
														type: 'listItem',
														attrs: { align: 'left' },
														content: [
															{
																type: 'paragraph',
																attrs: { align: 'left' },
																content: [
																	{
																		type: 'text',
																		text: 'still want more child'
																	}
																]
															}
														]
													},
													{
														type: 'listItem',
														attrs: { align: 'left' },
														content: [
															{
																type: 'paragraph',
																attrs: { align: 'left' },
																content: [
																	{
																		type: 'text',
																		marks: [
																			{
																				type: 'highlight',
																				attrs: {
																					preset: {
																						backgroundColor: '#218c74',
																						textColor: '#fff',
																						isSelect: false
																					}
																				}
																			}
																		],
																		text: 'Press Tab'
																	},
																	{
																		type: 'text',
																		text: ' to create nested list'
																	}
																]
															}
														]
													}
												]
											}
										]
									}
								]
							}
						]
					}
				]
			},
			{
				type: 'heading',
				attrs: { level: 3, align: 'left' },
				content: [{ type: 'text', text: '🔥 Slash (/) Menu ' }]
			},
			{
				type: 'paragraph',
				attrs: { align: 'left' },
				content: [
					{
						type: 'text',
						text: 'The Slash Menu is a convenient way to quickly access and insert various types of content or perform actions within a page. It is accessed by typing "/" (forward slash) in the editor, which triggers a menu to appear. The Slash Menu offers a wide range of options that users can choose from to add specific elements or perform actions.'
					}
				]
			},
			{
				type: 'figure',
				attrs: {
					src: 'https://cdn.nextlint.com/users/59e8095b-0d60-4e2a-bf24-83566d10d5c0/ec89b565-8cb2-4614-89fa-fb1c48ed4337.png',
					alt: '2023-06-30T11:03:06,568064744+07:00.png',
					title: 'next image',
					direction: 'left'
				},
				content: [{ type: 'text', text: '2023-06-30T11:03:06,568064744+07:00.png' }]
			},
			{ type: 'paragraph', attrs: { align: 'left' } },

			{
				type: 'heading',
				attrs: { level: 3, align: 'left' },
				content: [{ type: 'text', text: '✨ Custom Block Content' }]
			},
			{
				type: 'paragraph',
				attrs: { align: 'left' },
				content: [{ type: 'text', text: 'BlockCode:' }]
			},
			{
				type: 'codeBlock',
				attrs: { align: 'left' },
				content: [
					{
						type: 'text',
						text: '#[derive(Debug, Deserialize, Serialize, Clone, SmartDefault)]\npub struct Jwt {\n    #[default(30)]\n    pub expire_days: i64,\n\n    #[default("change default key here")]\n    pub key: String,\n}'
					}
				]
			},
			{
				type: 'paragraph',
				attrs: { align: 'left' },
				content: [{ type: 'text', text: 'Blockquote:' }]
			},
			{
				type: 'blockquote',
				attrs: { align: 'left' },
				content: [
					{
						type: 'paragraph',
						attrs: { align: 'left' },
						content: [
							{
								type: 'text',
								text: 'Editor is a WYSIWYG (What You See Is What You Get) editor built using the "@tiptap" library and developed with Svelte. It provides a user-friendly interface for editing and formatting text, allowing users to create rich content effortlessly.'
							}
						]
					}
				]
			},
			{
				type: 'paragraph',
				attrs: { align: 'left' },
				content: [{ type: 'text', text: 'Figure:' }]
			},
			{
				type: 'figure',
				attrs: {
					src: 'https://cdn.nextlint.com/users/59e8095b-0d60-4e2a-bf24-83566d10d5c0/2df6773c-23ba-4d00-bf5e-5f369d7cf9ef.png',
					alt: 'image alt',
					title: 'next image',
					direction: 'left'
				},
				content: [{ type: 'text', text: 'image alt' }]
			},
			{
				type: 'paragraph',
				attrs: { align: 'left' },
				content: [
					{
						type: 'text',
						text: 'You can create a block figure by triggering the '
					},
					{ type: 'text', marks: [{ type: 'code' }], text: 'Image' },
					{
						type: 'text',
						text: ' command in Slash Menu. The editor also recognizes image links and automatically converts them into a figure block.'
					}
				]
			},
			{
				type: 'figure',
				attrs: {
					src: 'https://cdn.nextlint.com/users/59e8095b-0d60-4e2a-bf24-83566d10d5c0/cacb681d-a481-421e-87f9-020810a0875e.png',
					alt: '2023-06-30T10:34:14,980841133+07:00.png',
					title: 'next image',
					direction: 'left'
				},
				content: [{ type: 'text', text: '2023-06-30T10:34:14,980841133+07:00.png' }]
			},
			{
				type: 'paragraph',
				attrs: { align: 'left' },
				content: [{ type: 'text', text: 'Image insert from unsplash' }]
			},
			{
				type: 'figure',
				attrs: {
					src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTg5Mjd8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODgxMDk4MDZ8&ixlib=rb-4.0.3&q=80&w=1080',
					alt: 'Unsplash: Christopher Gower',
					title: 'Unsplash: Christopher Gower',
					direction: 'left'
				},
				content: [{ type: 'text', text: 'Unsplash: Christopher Gower' }]
			},
			{
				type: 'heading',
				attrs: { level: 3, align: 'left' },
				content: [{ type: 'text', text: '🫶 Support markdown' }]
			},
			{
				type: 'paragraph',
				attrs: { align: 'left' },
				content: [
					{
						type: 'text',
						text: 'Markdown is a lightweight markup language that allows you to write formatted text using a simple and intuitive syntax. Here are some guidelines to follow when using Markdown in Editor'
					}
				]
			},
			{
				type: 'paragraph',
				attrs: { align: 'left' },
				content: [
					{ type: 'text', marks: [{ type: 'bold' }], text: 'Headers' },
					{
						type: 'text',
						text: ': Use hash (#) symbols to create headers. The number of hash symbols determines the level of the header, with one hash symbol (#) indicating the highest level (H1) and six hash symbols (######) indicating the lowest level (H6).'
					}
				]
			},
			{
				type: 'paragraph',
				attrs: { align: 'left' },
				content: [{ type: 'text', text: 'Example:' }]
			},
			{
				type: 'codeBlock',
				attrs: { align: 'left' },
				content: [{ type: 'text', text: '# Heading 1\n## Heading 2\n### Heading 3' }]
			},
			{
				type: 'paragraph',
				attrs: { align: 'left' },
				content: [
					{ type: 'text', marks: [{ type: 'bold' }], text: 'Emphasis' },
					{
						type: 'text',
						text: ': Add emphasis to text using asterisks (*) or underscores (_). Surround the text with a single asterisk or underscore for italic style, and with double asterisks or underscores for bold style.'
					}
				]
			},
			{
				type: 'paragraph',
				attrs: { align: 'left' },
				content: [{ type: 'text', text: 'Example: ' }]
			},
			{
				type: 'codeBlock',
				attrs: { align: 'left' },
				content: [
					{
						type: 'text',
						text: '*Italic Text*\n_Italic Text_\n\n**Bold Text**\n__Bold Text__'
					}
				]
			},
			{
				type: 'paragraph',
				attrs: { align: 'left' },
				content: [
					{ type: 'text', marks: [{ type: 'bold' }], text: 'Lists' },
					{
						type: 'text',
						text: ': Create ordered (numbered) or unordered (bullet) lists by starting each line with a number and a period for ordered lists, or a hyphen, plus sign, or asterisk for unordered lists.'
					}
				]
			},
			{
				type: 'paragraph',
				attrs: { align: 'left' },
				content: [{ type: 'text', text: 'Example:' }]
			},
			{
				type: 'codeBlock',
				attrs: { align: 'left' },
				content: [
					{
						type: 'text',
						text: '1. First item\n2. Second item\n3. Third item\n\n- First item\n- Second item\n- Third item'
					}
				]
			},
			{
				type: 'paragraph',
				attrs: { align: 'left' },
				content: [
					{ type: 'text', marks: [{ type: 'bold' }], text: 'Code' },
					{
						type: 'text',
						text: ': Indicate code or inline code by wrapping it with backticks (`). For code blocks, use triple backticks (```) before and after the code block. You can specify the programming language after the opening triple backticks for syntax highlighting.'
					}
				]
			},
			{
				type: 'paragraph',
				attrs: { align: 'left' },
				content: [{ type: 'text', text: 'Example:' }]
			},
			{
				type: 'codeBlock',
				attrs: { align: 'left' },
				content: [
					{
						type: 'text',
						text: '`Inline code`\n\n```python\ndef hello_world():\n    print("Hello, World!")'
					}
				]
			},
			{
				type: 'paragraph',
				attrs: { align: 'left' },
				content: [
					{
						type: 'text',
						marks: [{ type: 'bold' }],
						text: 'Horizontal Rule'
					},
					{
						type: 'text',
						text: ': Insert a horizontal rule by using three or more hyphens (-), asterisks (*), or underscores (_) on a separate line.'
					}
				]
			},
			{
				type: 'paragraph',
				attrs: { align: 'left' },
				content: [{ type: 'text', text: 'Example:' }]
			},
			{
				type: 'codeBlock',
				attrs: { align: 'left' },
				content: [{ type: 'text', text: '---' }]
			},
			{
				type: 'paragraph',
				attrs: { align: 'left' },
				content: [
					{
						type: 'text',
						text: 'Explore further by writing your first article on Editor.'
					}
				]
			},

			{ type: 'heading', attrs: { level: 4, align: 'left' } }
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
	<!-- {#if editorModeView} -->
	<!-- <Button
					class="mb-2 w-full rounded p-2 text-sm "
					on:click={() => {
						onSave()
					}}
				>
					Save
				</Button> -->
	<!-- <Button
			class="mb-2 w-full rounded p-2 text-sm "
			outline
			on:click={() => {
				onClear()
			}}
		>
			Clear
		</Button> -->
	<EditorTheme>
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
	</EditorTheme>
	<!-- {:else} -->
	<!-- <EditorTheme>
			<div class="container">
				<div class="wrapper">
					<SvelteEditor
						content={showcaseContent}
						placeholder=""
						onCreated={(createdEditor) => {
							editor = createdEditor
						}}
						onChange={(nextEditor) => {
							editor = nextEditor
						}}
					/>
				</div>
			</div>
		</EditorTheme> -->
	<!-- {/if} -->
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
