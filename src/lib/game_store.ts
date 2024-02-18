import { writable } from 'svelte/store';

export type PlayerStore = {
	players: Record<string, number>;
	logs: LogEntry[];
};

export type LogEntry = {
	at: Date;
	name: string;
	amount: number;
};

export const gameStore = writable<PlayerStore>({
	players: {},
	logs: []
});

export function addPlayer(name: string, balance: number) {
	if (!name) {
		return;
	}
	gameStore.update((s) => {
		if (!s.players[name]) {
			s.players[name] = balance;
		}
		return s;
	});
}

export function removePlayer(name: string) {
	gameStore.update((s) => {
		delete s.players[name];
		return s;
	});
}

export function adjustBalance(name: string, amount: number) {
	if (!amount) {
		return;
	}
	gameStore.update((s) => {
		if (s.players[name]) {
			s.players[name] += amount;
			s.logs.unshift({ name, at: new Date(), amount });
		}
		return s;
	});
}
