<script lang="ts">
	import { getContext } from 'svelte'
	import moment from 'moment'
	import Icon from '$lib/components/common/Icon.svelte'

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

<!-- <div class="mx-auto p-4"> -->
<!-- <div
		class="mb-10 w-max rounded border-2 border-current p-3 text-lg font-bold uppercase leading-none"
	>
		{ticket.title}
	</div> -->

<!-- <div class="mb-4 flex items-start border-b border-light-300 pb-4 dark:border-dark-200">
		<div class="flex-1">
			<span class="mb-1 text-xl font-bold">{ticket?.title}</span><br /> -->
<!-- <div class="mb-1 font-bold text-heading">Ticket #{ticket.number}</div> -->
<!-- <div>Agent: {ticket?.owner_id}</div>
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
	</table> -->

<!-- <div class="mb-3 font-bold">Terms & Conditions</div>
	<div>
		Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam
		quis risus eget urna mollis ornare vel eu leo. Donec ullamcorper nulla non metus auctor
		fringilla. Donec sed odio dui.
	</div> -->
<!-- </div> -->

<div class="mx-auto p-4">
	<img class="-mtp-20 mx-auto mb-2 h-20 w-20 p-1" src="/images/icons/tickets.png" alt="" />

	<div class="mb-4 text-center">
		<div class="text-lg font-bold text-heading">{ticket?.title}</div>
		<div class="text-muted">
			Ticket #{ticket.number} - Created at {moment(ticket?.created_at).format('YYYY-MM-DD')}
		</div>
	</div>

	<div class="mb-6 flex items-center">
		<div
			class="icon mr-3 grid h-9 w-9 place-content-center rounded-full bg-light-200 font-light dark:bg-dark-200"
		>
			<Icon icon="tabler:user" size="18" />
		</div>
		<div class="flex-1 pr-3">
			<div class="text-sm text-muted">Agent</div>
		</div>
		<div class="font-bold text-heading">{ticket?.owner_id}</div>
		<!-- <a href="" class="icon font-light hover:opacity-75">
			<Icon icon="tabler:copy" size="18" />
		</a> -->
	</div>

	<div class="mb-6 flex items-center">
		<div
			class="icon mr-3 grid h-9 w-9 place-content-center rounded-full bg-light-200 font-light dark:bg-dark-200"
		>
			<Icon icon="tabler:chart-arrows" size="18" />
		</div>
		<div class="flex-1 pr-3">
			<div class="text-sm text-muted">Type</div>
		</div>
		<div class="font-bold text-heading">{ticket?.type}</div>
		<!-- <a href="" class="icon font-light hover:opacity-75">
			<Icon icon="tabler:copy" size="18" />
		</a> -->
	</div>

	<div class="mb-6 flex items-center">
		<div
			class="icon mr-3 grid h-9 w-9 place-content-center rounded-full bg-light-200 font-light dark:bg-dark-200"
		>
			<Icon icon="tabler:binary-tree-2" size="18" />
		</div>
		<div class="flex-1 pr-3">
			<div class="text-sm text-muted">Following</div>
		</div>
		<div class="font-bold text-heading">{ticket?.following}</div>
		<!-- <a href="" class="icon font-light hover:opacity-75">
			<Icon icon="tabler:copy" size="18" />
		</a> -->
	</div>

	<div class="mb-6 flex items-center">
		<div
			class="icon mr-3 grid h-9 w-9 place-content-center rounded-full bg-light-200 font-light dark:bg-dark-200"
		>
			<Icon icon="tabler:status-change" size="18" />
		</div>
		<div class="flex-1 pr-3">
			<div class="text-sm text-muted">State</div>
		</div>
		<div class="font-bold text-heading">{status[ticket?.state_id]}</div>
		<!-- <a href="" class="icon font-light hover:opacity-75">
			<Icon icon="tabler:copy" size="18" />
		</a> -->
	</div>

	<!-- <div class="flex items-start">
		<div
			class="icon mr-3 grid h-9 w-9 place-content-center rounded-full bg-light-200 font-light dark:bg-dark-200"
		>
			sticky_note_2
		</div>
		<div class="flex-1">
			<div class="text-sm text-muted">Notes</div>
			<div>
				Nulla vitae elit libero, a pharetra augue. Duis mollis, est non commodo luctus, nisi erat
				porttitor ligula, eget lacinia odio sem nec elit. Vestibulum id ligula porta felis euismod
				semper. Nullam quis risus eget urna mollis ornare vel eu leo. Cras justo odio, dapibus ac
				facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus.
			</div>
		</div>
	</div> -->
</div>
