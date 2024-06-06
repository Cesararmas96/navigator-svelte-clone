<script lang="ts">
	import Chat from '../widgets/type/Chat/Chat.svelte'

	export let props: {
		action: string
		data: any
		callback?: any
	}
</script>

<Chat {props} program="mileage" on:input={() => console.log('input')} />
