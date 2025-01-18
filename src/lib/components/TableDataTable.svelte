<script lang="ts">
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import Cell from './cell.svelte';
	import {
		type ColumnDef,
		type ColumnFiltersState,
		type PaginationState,
		type RowSelectionState,
		type SortingState,
		type VisibilityState,
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel
	} from '@tanstack/table-core';
	import { createRawSnippet } from 'svelte';
	import { DataTable, Table, Input, DropdownMenu, Button } from '@kksh/svelte5';
	import DataTableCheckbox from './data-table-checkbox.svelte';
	import DataTableEmailButton from './data-table-email-button.svelte';
	import DataTableActions from './data-table-actions.svelte';
	import type { ColumnInfo, QueryResult } from '../../types';

	const { renderComponent, renderSnippet, createSvelteTable, FlexRender } = DataTable;
	const {
		tableData,
		columnsData
	}: {
		tableData: {
			data: QueryResult[];
			total: number;
			totalPages: number;
		};
		columnsData: ColumnInfo[];
	} = $props();

	let columns: ColumnDef<QueryResult>[] = [
		{
			id: 'select',
			header: ({ table }) =>
				renderComponent(DataTableCheckbox, {
					checked: table.getIsAllPageRowsSelected(),
					indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
					onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
					'aria-label': 'Select all'
				}),
			cell: ({ row }) =>
				renderComponent(DataTableCheckbox, {
					checked: row.getIsSelected(),
					onCheckedChange: (value) => row.toggleSelected(!!value),
					'aria-label': 'Select row'
				}),
			enableSorting: false,
			enableHiding: false
		},
		...columnsData.map((col) => ({
			accessorKey: col.name,
			cell: ({ row }: { row: any }) => {
				// console.log(row);
				// const randomSnippet = createRawSnippet<[string]>((getValue) => {
				// 	return {
				// 		render: () => `<div class="lowercase">${getValue()}</div>`
				// 	};
				// });
				// return renderSnippet(Cell, row.getValue(col.name));
				return renderComponent(Cell, {
					type: col.type,
					value: row.getValue(col.name)
				});
			}
		}))
		// {
		// 	id: 'actions',
		// 	enableHiding: false,
		// 	cell: ({ row }) => renderComponent(DataTableActions, { id: row.original.id })
		// }
	];

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let rowSelection = $state<RowSelectionState>({});
	let columnVisibility = $state<VisibilityState>({});

	const table = $state(
		createSvelteTable({
			get data() {
				return tableData ? tableData.data : [];
			},
			columns,
			state: {
				get pagination() {
					return pagination;
				},
				get sorting() {
					return sorting;
				},
				get columnVisibility() {
					return columnVisibility;
				},
				get rowSelection() {
					return rowSelection;
				},
				get columnFilters() {
					return columnFilters;
				}
			},
			getCoreRowModel: getCoreRowModel(),
			getPaginationRowModel: getPaginationRowModel(),
			getSortedRowModel: getSortedRowModel(),
			getFilteredRowModel: getFilteredRowModel(),
			onPaginationChange: (updater) => {
				if (typeof updater === 'function') {
					pagination = updater(pagination);
				} else {
					pagination = updater;
				}
			},
			onSortingChange: (updater) => {
				if (typeof updater === 'function') {
					sorting = updater(sorting);
				} else {
					sorting = updater;
				}
			},
			onColumnFiltersChange: (updater) => {
				if (typeof updater === 'function') {
					columnFilters = updater(columnFilters);
				} else {
					columnFilters = updater;
				}
			},
			onColumnVisibilityChange: (updater) => {
				if (typeof updater === 'function') {
					columnVisibility = updater(columnVisibility);
				} else {
					columnVisibility = updater;
				}
			},
			onRowSelectionChange: (updater) => {
				if (typeof updater === 'function') {
					rowSelection = updater(rowSelection);
				} else {
					rowSelection = updater;
				}
			}
		})
	);
</script>

<div class="w-full">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger >
			{#snippet child({ props }: { props: any })}
				<Button {...props} variant="outline" class="ml-auto my-2">
					Columns <ChevronDown class="ml-2 size-4" />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			{#each table.getAllColumns().filter((col) => col.getCanHide()) as column}
				<DropdownMenu.CheckboxItem
					class="capitalize"
					controlledChecked
					checked={column.getIsVisible()}
					onCheckedChange={(value: any) => column.toggleVisibility(!!value)}
				>
					{column.id}
				</DropdownMenu.CheckboxItem>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head class="[&:has([role=checkbox])]:pl-3">
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row data-state={row.getIsSelected() && 'selected'}>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell class="[&:has([role=checkbox])]:pl-3">
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end space-x-2 pt-4">
		<div class="flex-1 text-sm text-muted-foreground">
			{table.getFilteredSelectedRowModel().rows.length} of
			{table.getFilteredRowModel().rows.length} row(s) selected.
		</div>
		<div class="space-x-2">
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				Previous
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				Next
			</Button>
		</div>
	</div>
</div>
