<script lang="ts">
	import { addPlayer, adjustBalance, gameStore, removePlayer } from '$lib/game_store';
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
		balance: 1500
	};

	let amount = 0;
	let currencyPrefix = '£';
	let currencySuffix = '';

	function onAddPlayerFormSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		event.preventDefault();
		addPlayer(form.name, form.balance);
		form.name = '';
	}

	const leadZero = (n: number) => ('0' + n).slice(-2);

	let deleteName: string;
	let confirmDelete: HTMLDialogElement;
	function deletePlayer(name: string) {
		deleteName = name;
		confirmDelete.showModal();
	}

	function reallyDeletePlayer() {
		removePlayer(deleteName);
	}
</script>

<form class="card bg-base-100 shadow-xl gap-2 w-96 mx-auto my-8 p-4 bg-error-600">
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

<dialog bind:this={confirmDelete} class="modal">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Remove {deleteName}?</h3>
		<p class="py-4">Are you sure?</p>
		<form method="dialog" class="flex justify-end gap-4">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
			<button class="btn btn-neutral">Cancel</button>
			<button class="btn btn-outline btn-primary" on:click={() => reallyDeletePlayer()}
				>Remove</button
			>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>Close</button>
	</form>
</dialog>

<div class="flex gap-4 justify-center">
	{#each $players as player}
		<div class="card w-64 bg-base-100 shadow-xl">
			<div class="card-body">
				<div class="card-actions justify-end">
					<button class="btn btn-square btn-sm" on:click={() => deletePlayer(player.name)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/></svg
						>
					</button>
				</div>
				<h2 class="card-title justify-center">{player.name}</h2>
				<p class="text-4xl text-center">{currencyPrefix}{player.balance}{currencySuffix}</p>
				<div class="card-actions justify-center">
					<button class="btn btn-primary" on:click={() => adjustBalance(player.name, amount)}
						>Give</button
					>
					<button class="btn btn-secondary" on:click={() => adjustBalance(player.name, -amount)}
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
				<span class="font-bold">{leadZero(log.at.getHours())}</span>
				:
				<span class="font-bold">{leadZero(log.at.getMinutes())}</span>
				:
				<span class="">{leadZero(log.at.getSeconds())}</span>
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

<form class="card w-96 p-4 bg-base-100 shadow-xl gap-4 mx-auto" on:submit={onAddPlayerFormSubmit}>
	<h2 class="">Add player</h2>
	<label class="form-control w-full">
		<span class="label-text">Name</span>
		<input name="name" bind:value={form.name} class="input input-bordered w-full text-center" />
	</label>
	<label class="form-control w-full">
		<span class="label-text">Starting balance</span>
		<input
			name="balance"
			bind:value={form.balance}
			type="number"
			class="input input-bordered w-full text-center"
		/>
	</label>
	<button class="btn btn-primary self-center">Add</button>
</form>

<form class="card w-96 p-4 bg-base-100 shadow-xl gap-4 mx-auto">
	<h2 class="">Currency symbol</h2>
	<div class="flex gap-4">
		<label class="form-control w-full">
			<span class="label-text">Prefix</span>
			<input bind:value={currencyPrefix} class="input input-bordered w-full text-center" />
		</label>
		<label class="form-control w-full">
			<span class="label-text">Suffix</span>
			<input bind:value={currencySuffix} class="input input-bordered w-full text-center" />
		</label>
	</div>
</form>
