<script lang="ts">
	import '../app.css';
	import { dbPath, dbStore } from '@/stores/db';
	import { ModeWatcher } from 'mode-watcher';
	import {
		ThemeWrapper,
		updateTheme,
		SideBar as Sidebar,
		Separator,
		Input,
		Button
	} from '@kksh/svelte5';
	import {
		dialog,
		clipboard,
		notification,
		ui,
		toast,
		shell,
		fs,
		path,
		RPCChannel,
		Child,
		event
	} from '@kksh/api/ui/custom';
	import { X } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { type SQLiteBrowser } from '../../deno-src/dao';
	import AppSidebar from '@/components/app-sidebar.svelte';
	import type { DenoCommand } from '@kksh/api/ui/template';
	import type { ColumnInfo } from '../types';
	import { apiStore } from '@/stores/api';
	import { goto } from '$app/navigation';

	const { children } = $props();
	type PromisifiedSQLiteBrowser = {
		[K in keyof SQLiteBrowser]: SQLiteBrowser[K] extends (...args: infer A) => infer R
			? (...args: A) => Promise<R>
			: SQLiteBrowser[K];
	};
	// const dbPathForDev =
	// 	'/Users/hk/Dev/KunkunExtensions/extensions/sqlite-browser/deno-src/kk.dev.db';

	onMount(async () => {
		ui.registerDragRegion();
		ui.showBackButton('bottom-right');
		ui.hideRefreshButton();
		ui.getTheme().then((theme) => {
			updateTheme(theme);
		});
		apiStore.init();

		event.onDragDrop((evt) => {
			if (evt.paths && evt.paths.length > 0) {
				dbPath.set(evt.paths[0]);
			}
		});
	});

	$effect(() => {
		$dbPath;
		(async () => {
			console.log('dbPath changed', $dbPath);
			if (!$dbPath || !$apiStore.rpcChannel) {
				console.warn('dbPath or rpcChannel is not set');
				return;
			}
			const api = $apiStore.rpcChannel.getAPI();
			await api.init($dbPath);
			api
				.getTables()
				.then((tables) => {
					console.log('tables', tables);
					dbStore.setTables(tables);
					let columnInfo: Record<string, ColumnInfo[]> = {};
					// get column info for each table and merge to columnInfo
					tables.forEach((table) => {
						api.getTableColumns(table.name).then((columns) => {
							columnInfo[table.name] = columns;
						});
					});
					dbStore.setColumnInfo(columnInfo);
				})
				.catch((err) => {
					console.error(err);
					toast.error('Failed to get tables', {
						description: err.message
					});
				});
		})();
	});
</script>

<svelte:window
	on:keydown={async (e) => {
		if (e.key === 'Escape' && document.activeElement === document.body) {
			await apiStore.destroy();
			ui.goBack();
		}
	}}
/>
<ModeWatcher />
<ThemeWrapper>
	<Sidebar.Provider>
		<AppSidebar tables={$dbStore.tables} tableColumnInfo={$dbStore.columnInfo} />
		<div class="w-full overflow-hidden">
			<header class="flex h-16 shrink-0 items-center gap-2 border-b px-4" data-kunkun-drag-region>
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 h-4" />
				<Input bind:value={$dbPath} disabled />
				<Button
					variant="outline"
					class="shrink-0"
					size="icon"
					onclick={() => {
						goto('/');
						dbPath.set(null);
					}}><X /></Button
				>
				<Button
					onclick={(e) => {
						dialog
							.open({
								title: 'Pick DB'
							})
							.then(async (path?: string) => {
								if (path && (await fs.exists(path))) {
									dbPath.set(path);
								}
							});
					}}
				>
					Pick DB
				</Button>
			</header>
			<!-- <pre>{$page.url.pathname}</pre> -->
			{@render children()}
		</div>
	</Sidebar.Provider>
</ThemeWrapper>
