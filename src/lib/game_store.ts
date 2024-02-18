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
	gameStore.update((s) => {
		s.players[name] = balance;
		return s;
	});
}

export function removePlayerAt(name: string) {
	gameStore.update((s) => {
		delete s.players[name];
		return s;
	});
}

export function adjust(name: string, amount: number) {
	gameStore.update((s) => {
		if (s.players[name]) {
			s.players[name] += amount;
			s.logs.unshift({ name, at: new Date(), amount });
		}
		return s;
	});
}
