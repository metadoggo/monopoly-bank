<script lang="ts">
	import { addPlayer, adjust, gameStore } from '$lib/game_store';
	import { derived } from 'svelte/store';

	type Player = {
		name: string;
		balance: number;
	};

	const players = derived(gameStore, ($gameStore) => {
		const players: Player[] = [];
		for (const name in $gameStore.players) {
			players.push({ name, balance: $gameStore.players[name] });
		}
		return players;
	});

	const form = {
		name: '',
		balance: 0
	};

	let amount = 0;

	function onAddPlayerFormSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		addPlayer(form.name, form.balance);
	}

	const leadZero = (n: number) => ('0' + n).slice(-2);
</script>

<form class="card bg-base-100 shadow-xl gap-2 w-96 mx-auto my-8 p-4">
	<label class="form-control w-full text-center">
		<span class="label-text">Amount</span>
		<input
			bind:value={amount}
			type="number"
			class="input input-bordered text-center input-lg text-6xl p-12"
		/>
	</label>
	<div class="mx-auto flex space-between gap-8">
		<div class="flex flex-col">
			<button class="btn btn-square" type="button" on:click={() => (amount += 1000)}>+</button>
			<button class="btn btn-square" type="button" on:click={() => (amount -= 1000)}>-</button>
		</div>
		<div class="flex flex-col">
			<button class="btn btn-square" type="button" on:click={() => (amount += 100)}>+</button>
			<button class="btn btn-square" type="button" on:click={() => (amount -= 100)}>-</button>
		</div>
		<div class="flex flex-col">
			<button class="btn btn-square" type="button" on:click={() => (amount += 10)}>+</button>
			<button class="btn btn-square" type="button" on:click={() => (amount -= 10)}>-</button>
		</div>
		<div class="flex flex-col">
			<button class="btn btn-square" type="button" on:click={() => (amount += 1)}>+</button>
			<button class="btn btn-square" type="button" on:click={() => (amount -= 1)}>-</button>
		</div>
	</div>
</form>

<div class="flex gap-4 justify-center">
	{#each $players as player}
		<div class="card w-64 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title justify-center">{player.name}</h2>
				<p class="text-4xl text-center">&pound;{player.balance}</p>
				<div class="card-actions justify-center">
					<button class="btn btn-primary" on:click={() => adjust(player.name, amount)}>Give</button>
					<button class="btn btn-secondary" on:click={() => adjust(player.name, -amount)}
						>Take</button
					>
				</div>
			</div>
		</div>
	{/each}
</div>

<ul class="timeline timeline-vertical m-4">
	{#each $gameStore.logs as log}
		<li>
			<div class="timeline-start">
				{leadZero(log.at.getHours())}:{leadZero(log.at.getMinutes())}:{leadZero(
					log.at.getSeconds()
				)}
			</div>
			<div class="timeline-middle">
				{#if log.amount >= 0}
					✅
				{:else}
					❌
				{/if}
			</div>
			<div class="timeline-end">{log.name}: {log.amount}</div>
			<hr />
		</li>
	{/each}
</ul>

<form class="card w-48 bg-base-100 shadow-xl gap-2 mx-auto" on:submit={onAddPlayerFormSubmit}>
	<label class="form-control w-full">
		<span class="label-text">Name</span>
		<input name="name" bind:value={form.name} class="input input-bordered w-full text-center" />
	</label>
	<label class="form-control w-full">
		<span class="label-text">Balance</span>
		<input
			name="balance"
			bind:value={form.balance}
			type="number"
			class="input input-bordered w-full text-center"
		/>
	</label>
	<button class="btn btn-primary">Add</button>
</form>
