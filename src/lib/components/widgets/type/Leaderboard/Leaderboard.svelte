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
</script>

{#if rewards.length > 0}
	<div class="container">
		<div class="scoreboard">
			<div class="scoreboard__podiums mb-2 mt-2">
				<div class="scoreboard_podiums_Container">
					<div class="mb-3 flex flex-col items-center">
						<div class="mb-1 w-8">
							<svg
								class=""
								fill="#d4d4d4"
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

						<img
							alt=""
							class="scoreboard_podiums_Container-numberTop w-20 rounded-full border-4 border-gray-300 object-scale-down p-2 shadow"
							loading="lazy"
							src="https://cdn-icons-png.flaticon.com/512/2583/2583279.png"
						/>
					</div>
					<div class="scoreboard__podium rounded-tl-lg rounded-tr-lg shadow">
						<div
							class="scoreboard__podium-base scoreboard__podium-base--second flex flex-col items-center justify-start pt-4"
							style="height: 200px;"
						>
							<div
								class="scoreboard__podium-rank flex h-8 w-8 items-center justify-center rounded-full bg-white text-center text-2xl shadow-lg"
							>
								{rewards[1].num_badges}
							</div>

							<div
								class="scoreboard__podium-name sm w-20 pt-3 text-center text-base font-semibold text-white"
							>
								{rewards[1].display_name}
							</div>
						</div>
					</div>
				</div>
				<div class="scoreboard_podiums_Container">
					<div class="mb-3 flex flex-col items-center">
						<div class="mb-1 w-10">
							<svg
								class=""
								fill="#faca15"
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

						<img
							class="scoreboard_podiums_Container-numberTop w-24 rounded-full border-4 border-yellow-300 object-scale-down p-2 shadow"
							loading="lazy"
							src="https://cdn-icons-png.flaticon.com/512/2583/2583259.png"
							alt=""
						/>
					</div>
					<div class="scoreboard__podium rounded-tl-lg rounded-tr-lg shadow">
						<div
							class="scoreboard__podium-base scoreboard__podium-base--first flex flex-col items-center justify-start pt-4"
							style="height: 250px;"
						>
							<div
								class="scoreboard__podium-rank flex h-8 w-8 items-center justify-center rounded-full bg-white text-center text-2xl shadow-lg"
							>
								{rewards[0].num_badges}
							</div>

							<div
								class="scoreboard__podium-name w-20 pt-3 text-center text-base font-semibold text-white"
							>
								{rewards[0].display_name}
							</div>
						</div>
					</div>
				</div>
				<div class="scoreboard_podiums_Container">
					<div class="mb-3 flex flex-col items-center">
						<div class="mb-1 w-8 shadow">
							<svg
								class=""
								fill="#fb923c"
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

						<img
							class="scoreboard_podiums_Container-numberTop w-20 rounded-full border-4 border-orange-300 object-scale-down p-2 shadow"
							loading="lazy"
							src="https://cdn-icons-png.flaticon.com/512/2583/2583398.png"
							alt=""
						/>
					</div>
					<div class="scoreboard__podium rounded-tl-lg rounded-tr-lg shadow">
						<div
							class="scoreboard__podium-base scoreboard__podium-base--third flex flex-col items-center justify-start pt-4"
							style="height: 150px;"
						>
							<div
								class="scoreboard__podium-rank flex h-8 w-8 items-center justify-center rounded-full bg-white text-center text-2xl shadow-lg"
							>
								{rewards[2].num_badges}
							</div>

							<div
								class="scoreboard__podium-name w-20 pt-3 text-center text-base font-semibold text-white"
							>
								{rewards[2].display_name}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="playerslist">
			<table class="rounded-table table table-auto">
				<thead>
					<tr class="text-base text-gray-500">
						<th class="w-0">#</th>
						<th class="">Names</th>
						<th class="text-center">Points</th>
					</tr>
				</thead>
				<tbody>
					{#each rewards as reward, rewardIdx}
						{#if rewardIdx > 2}
							<tr>
								<td class="rounded-table-td font-semibold">{rewardIdx + 1}</td>
								<td class="rounded-table-td">
									<div class="flex items-center">
										<!-- svelte-ignore a11y-missing-attribute -->
										<img
											class=""
											src="https://cdn-icons-png.flaticon.com/512/2583/2583290.png"
											width="30"
										/><span class="font-semibold">{reward.display_name}</span>
									</div>
								</td>
								<td class="rounded-table-td text-center font-semibold">{reward.num_badges}</td>
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
		max-width: 700px;
		margin: auto;
	}

	.rounded-table tr td:nth-child(2) {
		border-radius: 17px 0 0 17px;
	}

	.rounded-table tr td:nth-child(3) {
		border-radius: 0 17px 17px 0;
	}

	.rounded-table tr:hover td:nth-child(2) {
		border-radius: 17px 0 0 17px;
	}

	.rounded-table tr:hover td:nth-child(3) {
		border-radius: 0 17px 17px 0;
	}

	.scoreboard {
		display: flex;
		margin: 0 0;
		flex-direction: column;
	}

	.scoreboard__podiums {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		min-height: 350px;
		align-items: flex-end;
	}

	.scoreboard_podiums_Container:nth-child(2) .scoreboard__podium {
		background: rgb(157, 100, 8);
		background: linear-gradient(180deg, rgba(157, 100, 8, 1) 15%, rgba(176, 121, 50, 1) 100%);
	}
	.scoreboard__podium {
		background: rgb(194, 140, 53);
		background: linear-gradient(47deg, rgba(194, 140, 53, 1) 15%, rgba(235, 171, 87, 1) 100%);
	}

	.scoreboard__podiums .scoreboard__podium {
		display: flex;
		flex-direction: column;
		align-self: flex-end;
		flex-wrap: wrap;
		flex: 1;
	}

	.scoreboard__podium-base {
		width: 150px;
	}

	.scoreboard__podiums .scoreboard__podium-base {
		max-width: 150px;
		border-radius: 10px 10px 0 0;
	}

	@media (max-width: 767px) {
		.scoreboard__podium-rank {
			width: 30px;
			font-size: 15px;
			width: 24px;
		}

		.scoreboard__podium-name {
			font-size: 10px;
			padding-left: 2px;
			padding-right: 2px;
		}

		.scoreboard_podiums_Container-numberTop {
			width: 70px;
		}

		.scoreboard_podiums_Container:nth-child(2) .scoreboard_podiums_Container-numberTop {
			width: 80px;
		}

		.scoreboard__podium {
			display: flex;
			flex-direction: row;
		}

		.scoreboard__podium-base {
			max-width: 100px;
			width: auto;
		}
	}
</style>
