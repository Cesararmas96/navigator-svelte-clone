<script lang="ts">
	import * as PDFJS from 'pdfjs-dist'
	import { onMount } from 'svelte'

	export let data: string

	let url: string
	$: url = data

	async function loadPDF(node: any, url: any) {
		const loadingTask = PDFJS.getDocument(url)
		const pdf = await loadingTask.promise
		const page = await pdf.getPage(1)
		const scale = 1
		const viewport = page.getViewport({ scale })
		const canvas = node
		const context = canvas.getContext('2d')
		canvas.height = viewport.height
		canvas.width = viewport.width
		const renderContext = {
			canvasContext: context,
			viewport: viewport
		}
		await page.render(renderContext)
	}

	onMount(() => {
		loadPDF(document.getElementById('pdfviewer'), url)
	})
</script>

<canvas id="pdfviewer" />
