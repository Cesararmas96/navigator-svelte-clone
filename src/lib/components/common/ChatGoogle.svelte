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
	agent-id="8cf9141c-666b-4446-b4e4-8a87704478f8"
	language-code="en"
	max-query-length="-1"
>
	<df-messenger-chat-bubble chat-title="SuperBot" />
</df-messenger>

<style>
	df-messenger {
		z-index: 999;
		position: fixed;
		bottom: 16px;
		right: 16px;
	}
</style>
