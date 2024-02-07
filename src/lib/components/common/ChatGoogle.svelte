<svelte:head>
	<link
		rel="stylesheet"
		href="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css"
	/>
	<script
		src="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js"
	></script>
</svelte:head>

<df-messenger
	project-id="chatbots-412120"
	agent-id="183be06c-8d38-4435-9d83-b50a94417712"
	language-code="en"
	max-query-length="-1"
>
	<df-messenger-chat-bubble chat-title="Handbook" />
</df-messenger>

<style>
	df-messenger {
		z-index: 999;
		position: fixed;
		bottom: 16px;
		right: 16px;
	}
</style>
