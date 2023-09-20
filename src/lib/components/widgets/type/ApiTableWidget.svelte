<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte'

	export let data: any
</script>

{#if data}
	<!-- Widget Content TableWidget -->
	<Table hoverable={true} divClass="w-full">
		<TableHead>
			{#each Object.keys(data[0]) as key}
				<TableHeadCell>{key}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each data as item}
				<TableBodyRow>
					{#each Object.keys(item) as key}
						<TableBodyCell tdClass="p-1">{item[key]}</TableBodyCell>
					{/each}
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
{/if}
