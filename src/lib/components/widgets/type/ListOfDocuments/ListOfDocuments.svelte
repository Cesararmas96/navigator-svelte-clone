<script lang="ts">
	import { Table, TableBody, TableBodyRow, TableHeadCell } from 'flowbite-svelte'
	import Icon from '$lib/components/common/Icon.svelte'
	import jsonData from '../../../../../data/widgetListOfDocuments.json'

	const getWidgetCardData = (jsonData: any) => {
		const data = jsonData
		console.log(data)
		return data
	}

	const data = getWidgetCardData(jsonData)
</script>

<Table class="m-3 h-full w-full">
	<TableBody>
		{#each data as el}
			<TableBodyRow>
				<TableHeadCell>
					<div class="flex flex-row space-x-4 text-primary" style="font-size: 14px">
						<Icon icon={`ph:file-${el.filetype}`} size="20px" />

						<p class="font-medium">{el.title}</p>

						<span class="space-x-1.5" style="margin-left: auto">
							<a href={el.source} target="_blank" rel="noopener noreferrer">
								<Icon icon="ph:eye" size="18px" />
							</a>

							<a href={el.source} target="_blank" download={el.source}>
								<Icon icon="material-symbols:download" size="20px" />
							</a>
						</span>
					</div>
				</TableHeadCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
