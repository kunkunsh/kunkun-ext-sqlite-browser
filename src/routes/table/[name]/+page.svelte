<script lang="ts">
	import { goto } from '$app/navigation';
	import TableDataTable from '@/components/TableDataTable.svelte';
	import { apiStore } from '@/stores/api.js';
	import { onMount } from 'svelte';
	import type { ColumnInfo, QueryResult } from '../../../types.js';

	const { data } = $props();
	let tableData = $state<{
		data: QueryResult[];
		total: number;
		totalPages: number;
	}>();
	let columns = $state<ColumnInfo[]>();

	$effect(() => {
		columns = [];
		tableData = undefined;
		console.log('page ', data.name);
		(async () => {
			if (!$apiStore.rpcChannel) {
				goto('/');
			}
			const api = $apiStore.rpcChannel?.getAPI();
			columns = (await api?.getTableColumns(data.name)) ?? [];
			tableData = await api?.getTableData(data.name, { page: 0, pageSize: 10 });
			console.log('columns', columns);
			console.log('tableData', tableData);
		})();
	});
</script>

<div class="container">
	{#if columns != undefined && tableData != undefined}
		<TableDataTable columnsData={columns} {tableData} />
	{/if}
</div>
