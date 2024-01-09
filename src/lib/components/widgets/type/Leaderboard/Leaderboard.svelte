<script lang="ts">
	import { Indicator } from 'flowbite-svelte'
	import { onMount } from 'svelte'

	export let data: any

	let rewards: any[] = data
	let badges: any[]

	const getBadge = (reward) => {
		return badges.find((item) => {
			if (typeof item === 'string') return false

			const image = item?.filename.split('.png' || '.jpg')

			if (image[0] === reward.reward) return item
		})
	}

	onMount(() => {
		const leader1 = document.getElementById('leader-1')!
		leader1.parentElement?.classList.add('!top-3')
		leader1.parentElement?.classList.add('!w-9')
		leader1.parentElement?.classList.add('!h-9')
		leader1.parentElement?.classList.add('!right-2')

		const leader2 = document.getElementById('leader-2')!
		leader2.parentElement?.classList.add('!top-2')
		leader2.parentElement?.classList.add('!w-8')
		leader2.parentElement?.classList.add('!h-8')
		leader2.parentElement?.classList.add('!right-1')
		leader2.parentElement?.style.setProperty('background-color', '#d4d4d4')

		const leader3 = document.getElementById('leader-3')!
		leader3.parentElement?.classList.add('!top-2')
		leader3.parentElement?.classList.add('!w-8')
		leader3.parentElement?.classList.add('!h-8')
		leader3.parentElement?.classList.add('!right-1')
		leader3.parentElement?.style.setProperty('background-color', '#ab6528')
	})
</script>

{#if rewards.length > 0}
	<div class="container">
		<div
			class="topLeadersList"
			style:--leader-0={'20'}
			style:--leader-1={rewards[1].num_badges}
			style:--leader-2={rewards[2].num_badges}
		>
			<div class="leader">
				<div class="">
					<!-- svelte-ignore a11y-missing-attribute -->
					<img
						class="image gold"
						loading="lazy"
						src="https://cdn-icons-png.flaticon.com/512/2583/2583259.png"
					/>
					<div class="crown">
						<svg
							id="crown1"
							fill="#0f74b5"
							data-name="Layer 1"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 100 50"
						>
							<polygon
								class="cls-1"
								points="12.7 50 87.5 50 100 0 75 25 50 0 25.6 25 0 0 12.7 50"
							/>
						</svg>
					</div>
					<div class="leaderName">{rewards[0].display_name}</div>
					<Indicator color="yellow" border size="xl" placement="top-right">
						<span id="leader-1" class="text-lg font-bold">{rewards[0].num_badges}</span>
					</Indicator>
				</div>
			</div>
			<div class="leader">
				<div class="">
					<!-- svelte-ignore a11y-missing-attribute -->
					<img
						class="image silver"
						loading="lazy"
						src="https://cdn-icons-png.flaticon.com/512/2583/2583279.png"
					/>
					<div class="crown">
						<svg
							id="crown1"
							fill="#0f74b5"
							data-name="Layer 1"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 100 50"
						>
							<polygon
								class="cls-1"
								points="12.7 50 87.5 50 100 0 75 25 50 0 25.6 25 0 0 12.7 50"
							/>
						</svg>
					</div>
					<div class="leaderName">{rewards[1].display_name}</div>
					<Indicator color="blue" border size="xl" placement="top-right">
						<span id="leader-2" class="text-lg font-bold">{rewards[1].num_badges}</span>
					</Indicator>
				</div>
			</div>
			<div class="leader">
				<div class="">
					<!-- svelte-ignore a11y-missing-attribute -->
					<img
						class="image bronze"
						loading="lazy"
						src="https://cdn-icons-png.flaticon.com/512/2583/2583398.png"
					/>
					<div class="crown">
						<svg
							id="crown1"
							fill="#0f74b5"
							data-name="Layer 1"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 100 50"
						>
							<polygon
								class="cls-1"
								points="12.7 50 87.5 50 100 0 75 25 50 0 25.6 25 0 0 12.7 50"
							/>
						</svg>
					</div>
					<div class="leaderName">{rewards[2].display_name}</div>
					<Indicator color="blue" border size="xl" placement="top-right">
						<span id="leader-3" class="text-lg font-bold">{rewards[2].num_badges}</span>
					</Indicator>
				</div>
			</div>
		</div>
		<div class="playerslist">
			<table class="table-striped table-hover table-responsive-sm table">
				<tbody>
					{#each rewards as reward, rewardIdx}
						{#if rewardIdx > 2}
							<tr>
								<th scope="row">{rewardIdx + 1}</th>
								<td class="w-auto">
									<div class="flex items-center">
										<!-- svelte-ignore a11y-missing-attribute -->
										<img
											class="rounded-circle"
											src="https://cdn-icons-png.flaticon.com/512/2583/2583290.png"
											width="30"
										/><span class="ml-2">{reward.display_name}</span>
									</div>
								</td>
								<td>{reward.num_badges}</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}

<style>
	.container {
		max-width: 750px;
		margin: auto;
	}
	.container .leader {
		display: flex;
	}
	.container .crown {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}
	.container .crown svg {
		width: 3rem;
	}
	.container .image {
		height: 80px;
		object-fit: cover;
		width: 80px;
		/* background-color: black; */
		border-radius: 50%;
	}
	.container .topLeadersList {
		display: flex;
		position: relative;
		min-height: 120px;
		/* padding-top: 3rem; */
	}
	.container .topLeadersList .image {
		border-radius: 50%;
	}
	.container .topLeadersList .image.gold {
		border: 3px solid gold;
	}
	.container .topLeadersList .image.silver {
		border: 3px solid silver;
	}
	.container .topLeadersList .image.bronze {
		border: 3px solid #ab6528;
	}

	.container .topLeadersList .leader:nth-child(1) {
		color: black;
		background-color: var(--leader-0, '');
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}
	.container .topLeadersList .leader:nth-child(1) .image {
		width: 150px;
		height: 150px;
		padding: 6px;
	}
	.container .topLeadersList .leader:nth-child(1) .crown {
		top: -20%;
	}
	.container .topLeadersList .leader:nth-child(1) .crown svg {
		fill: #ffc500;
	}
	.container .topLeadersList .leader:nth-child(2) {
		color: black;
		position: absolute;
		left: 15%;
		transform: translateX(-15%);
		bottom: -20%;
	}
	.container .topLeadersList .leader:nth-child(2) .image {
		min-width: 110px;
		min-height: 110px;
		padding: 6px;
	}
	.container .topLeadersList .leader:nth-child(2) .crown {
		top: -25%;
	}
	.container .topLeadersList .leader:nth-child(2) .crown svg {
		fill: #d4d4d4;
	}
	.container .topLeadersList .leader:nth-child(3) {
		color: black;
		position: absolute;
		left: 85%;
		transform: translateX(-85%);
		bottom: -20%;
	}
	.container .topLeadersList .leader:nth-child(3) .image {
		min-width: 110px;
		min-height: 110px;
		padding: 6px;
	}
	.container .topLeadersList .leader:nth-child(3) .crown {
		top: -25%;
	}
	.container .topLeadersList .leader:nth-child(3) .crown svg {
		fill: #ab6528;
	}
	.container .leaderName {
		position: absolute;
		text-align: center;
		left: 50%;
		font-weight: bold;
		transform: translateX(-50%);
		font-size: 18px;
		line-height: 1.2;
		margin-top: 0.5rem;
	}
	.container .player {
		background-color: #330b7775;
		display: grid;
		grid-template-columns: 0.4fr 3fr 1fr 1fr 1fr 1fr 1fr 1fr;
		align-items: center;
		min-height: 42px;
		text-align: center;
		padding-right: 0.4rem;
	}
	.container .player .image {
		width: 28px;
		height: 28px;
		border: 1.5px solid white;
	}
	.container .table {
		margin-right: 0.1rem;
		/* display: grid; */
		font-size: 14px;
		/* grid-template-columns: 0.4fr 3fr 1fr 1fr 1fr 1fr 1fr 1fr; */
		text-align: center;
	}
	.container .table div:nth-child(2) {
		text-align: left;
		margin-left: 5px;
	}
	.container .table .image {
		width: 20px;
		height: 20px;
	}
	.container .playerslist {
		margin-top: 7rem;
		overflow: hidden;
	}
	.container .playerslist .player:nth-child(odd) {
		background-color: #b159ffcc;
		align-items: center;
	}
	.container .user {
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.container .list {
		overflow: scroll;
		height: 20rem;
		overflow-x: hidden;
	}
</style>
