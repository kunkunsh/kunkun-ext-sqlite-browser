<script lang="ts">
	import { Collapsible, SideBar as Sidebar } from '@kksh/svelte5';
	import GalleryVerticalEnd from 'lucide-svelte/icons/gallery-vertical-end';
	import Minus from 'lucide-svelte/icons/minus';
	import Plus from 'lucide-svelte/icons/plus';
	import type { ComponentProps } from 'svelte';
	import type { ColumnInfo, TableInfo } from '../../types';
	import { dbStore, selectedTable } from '$lib/stores/db';

	let {
		ref = $bindable(null),
		tables,
		tableColumnInfo,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & {
		tables: TableInfo[];
		tableColumnInfo: Record<string, ColumnInfo[]>;
	} = $props();
</script>

<Sidebar.Root bind:ref {...restProps} class="">
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.Menu>
				{#each tables as table (table.name)}
					<Collapsible.Root open={true} class="group/collapsible">
						<Sidebar.MenuItem
							onclick={() => {
								console.log(`select ${table.name}`);
							}}
						>
							<a href={`/table/${table.name}`}>
								<Sidebar.MenuButton isActive={table.name === $selectedTable}>
									{table.name}
								</Sidebar.MenuButton>
							</a>
							<!-- <Collapsible.Trigger>
								{#snippet child({ props })}
									<Sidebar.MenuButton {...props}>
										{table.name}{' '}
										<Plus class="ml-auto group-data-[state=open]/collapsible:hidden" />
										<Minus class="ml-auto group-data-[state=closed]/collapsible:hidden" />
									</Sidebar.MenuButton>
								{/snippet}
							</Collapsible.Trigger> -->
							<!-- {#if tableColumnInfo[table.name]?.length}
								<Collapsible.Content>
									<Sidebar.MenuSub>
										{#each tableColumnInfo[table.name] as item (item.name)}
											<Sidebar.MenuSubItem>
												<Sidebar.MenuSubButton isActive={true}>
													{#snippet child({ props })}
														<a href={`/table/${item.name}`} {...props}>
															{item.name}
														</a>
													{/snippet}
												</Sidebar.MenuSubButton>
											</Sidebar.MenuSubItem>
										{/each}
									</Sidebar.MenuSub>
								</Collapsible.Content>
							{/if} -->
						</Sidebar.MenuItem>
					</Collapsible.Root>
				{/each}
			</Sidebar.Menu>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
