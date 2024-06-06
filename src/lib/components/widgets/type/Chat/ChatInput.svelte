<script lang="ts">
	import { storeUser } from '$lib/stores'
	import { createEventDispatcher } from 'svelte'

	let message, mileage
	let consent = false

	export let program: string
	export let action: string

	const dispatch = createEventDispatcher()

	$: disabled =
		(action === 'add' && (!mileage || mileage < 1 || !consent)) ||
		(action === 'reject' && !message) ||
		(action === 'comments' && !message)

	const btnText = {
		add: 'Submit',
		reject: 'Reject Mileage',
		approve: 'Approve Mileage',
		comments: 'Send Message'
	}
	const messageText = {
		add: 'Message',
		reject: 'Please provide a reason for rejecting the mileage (required)',
		approve: 'Message (optional)',
		comments: 'Leave a Message (required)'
	}
</script>

<div class="flex flex-col gap-2">
	{#if action === 'add'}
		<div class="align-start flex flex-col gap-2">
			<div class="text-lg font-bold">Step 1: Please indicate your actual driven miles:</div>
			<div class="flex w-1/5 flex-col">
				<label for="mileage">Mileage</label>
				<input
					type="number"
					name="mileage"
					bind:value={mileage}
					id="mileage"
					placeholder=""
					class="rounded-lg border-gray-300 bg-gray-50 px-2 py-1 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-md"
				/>
			</div>
			<div class="flex gap-1 rounded-lg bg-amber-100 p-3">
				<input type="checkbox" id="consent" name="consent" bind:value={consent} class="mr-2" />
				<label for="consent"
					>I confirm that the mileage declared is correct and attest that the information provided
					is accurate and truthful to the best of your knowledge, and acknowledge that I will only
					be compensated for the amount of miles that are reimbursable according to state
					regulations and the terms outlined in our business agreements.</label
				>
			</div>
		</div>
		<div class="mt-2 text-lg font-bold">Step 2 (optional): Leave a message to your manager</div>
	{/if}
	<div class="flex-1">
		<div class="flex flex-col">
			<label for="message">{messageText[action]}</label>
			<textarea
				name="message"
				id="message"
				bind:value={message}
				placeholder="Type your message here..."
				class="rounded-lg border-gray-300 bg-gray-50 px-2 py-1 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-md"
			/>
		</div>
	</div>

	<button
		color="primary"
		{disabled}
		class="dark:focus:ring-primary-800 btn-po-save hover:bg-darken inline-flex items-center justify-center rounded-lg bg-primary-700 px-4 py-2 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 dark:bg-primary-600 dark:hover:bg-primary-700"
		on:click={(e) => {
			if (action === 'comments') e.stopPropagation()
			dispatch('input', {
				mileage,
				message,
				type: 'user',
				name: `${$storeUser.first_name} ${$storeUser.last_name}`,
				date: new Date()
			})
			mileage = undefined
			message = undefined
		}}
	>
		{btnText[action]}
	</button>
</div>
