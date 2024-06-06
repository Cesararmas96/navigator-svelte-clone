<script lang="ts">
	import moment from 'moment'
	export let comment
</script>

<div class="flex {comment.type === 'boss' ? 'justify-end' : ''}">
	<div class="ag-comment-box {comment.type}">
		<div class="ag-comment-user">{comment.name}</div>
		{comment.message}
		<div class="ag-comment-date mt-2 text-right">
			{moment(comment.date).format('YYYY-MM-DD HH:MM')}
		</div>
	</div>
</div>
