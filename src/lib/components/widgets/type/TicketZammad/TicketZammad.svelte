<script lang="ts">
	import { getContext } from 'svelte'
	import moment from 'moment'

	const widget: any = getContext('widget')
	const ticket = $widget?.ticket
	const status = {
		1: 'New',
		2: 'Open',
		3: 'Pending Reminder',
		4: 'Pending Action',
		5: 'Closed',
		6: 'Merged',
		7: 'Removed'
	}
</script>

<div class="mx-auto p-4">
	<!-- <div
		class="mb-10 w-max rounded border-2 border-current p-3 text-lg font-bold uppercase leading-none"
	>
		{ticket.title}
	</div> -->

	<div class="mb-4 flex items-start border-b border-light-300 pb-4 dark:border-dark-200">
		<div class="flex-1">
			<span class="mb-1 text-xl font-bold">{ticket?.title}</span><br />
			<!-- <div class="mb-1 font-bold text-heading">Ticket #{ticket.number}</div> -->
			<div>Agent: {ticket?.owner_id}</div>
			<div>{moment(ticket?.created_at).format('YYYY-MM-DD')}</div>
		</div>
		<div class="text-2xl font-bold text-heading">
			Ticket #{ticket?.number}
		</div>
	</div>

	<table class=" table">
		<thead>
			<tr class="text-sm text-muted">
				<th class="6/12">Type</th>
				<th class="3/12 text-right">Following</th>
				<th class="3/12 text-right">State</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td class="4/12">{ticket?.type}</td>
				<td class="3/12 text-right">{ticket?.following}</td>
				<td class="3/12 text-right">{status[ticket?.state_id]}</td>
			</tr>
		</tbody>
	</table>

	<!-- <div class="mb-3 font-bold">Terms & Conditions</div>
	<div>
		Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam
		quis risus eget urna mollis ornare vel eu leo. Donec ullamcorper nulla non metus auctor
		fringilla. Donec sed odio dui.
	</div> -->
</div>
