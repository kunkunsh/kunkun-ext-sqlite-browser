import { get, writable } from 'svelte/store';
import type { SQLiteBrowser } from '../../../deno-src/dao';
import { type Child, type RPCChannel, type DenoCommand, shell } from '@kksh/api/ui/custom';

type PromisifiedSQLiteBrowser = {
	[K in keyof SQLiteBrowser]: SQLiteBrowser[K] extends (...args: infer A) => infer R
		? (...args: A) => Promise<R>
		: SQLiteBrowser[K];
};

interface State {
	rpcChannel?: RPCChannel<object, PromisifiedSQLiteBrowser>;
	process?: Child;
	command?: DenoCommand<string>;
}
export function createApiStore() {
	const apiStore = writable<State>({});
	async function init() {
		const { rpcChannel, process, command } = await shell.createDenoRpcChannel<
			object,
			PromisifiedSQLiteBrowser
		>(
			'$EXTENSION/deno-src/index.ts',
			[],
			{
				allowEnv: ['DENO_SQLITE_PATH', 'DENO_SQLITE_LOCAL', 'DENO_DIR', 'HOME'],
				allowAllRead: true,
				allowAllFfi: true,
				allowAllWrite: true
			},
			{}
		);
		command.stderr.on('data', (data) => {
			console.warn(data);
		});
		apiStore.set({
			rpcChannel,
			process,
			command
		});
	}
	async function destroy() {
		const _apiStore = get(apiStore);
		_apiStore.rpcChannel?.freeCallbacks();
		_apiStore.process?.kill();
	}
	return {
		...apiStore,
		init,
		destroy
	};
}

export const apiStore = createApiStore();
