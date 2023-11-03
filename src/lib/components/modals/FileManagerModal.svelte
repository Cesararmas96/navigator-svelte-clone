<script lang="ts">
	import FileManager from '../widgets/type/FileManager/FileManager.svelte'

	export let props: {
		path: string
		confirmCallback: (path: string) => void
	}
</script>

<FileManager isModal={true} path={props.path} callback={props.confirmCallback} />
