<script lang="ts">
	import Dropzone from '../widgets/type/Dropzone/Dropzone.svelte'

	export let props: {
		title: string
		props: any
	}
	console.log(props)
</script>

<Dropzone isModal={true} props={props.props} />
