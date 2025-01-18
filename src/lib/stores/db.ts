import { writable } from 'svelte/store';
import type { ColumnInfo, TableInfo } from '../../types';

export const dbPath = writable<string | null>(null);
export const selectedTable = writable<string | null>(null);
interface DB {
	tables: TableInfo[];
	columnInfo: Record<string, ColumnInfo[]>;
}

export function createDbStore() {
	const db = writable<DB>({ tables: [], columnInfo: {} });

	return {
		...db,
		setTables: (tables: TableInfo[]) => {
			db.update((state) => ({ ...state, tables }));
		},
		setColumnInfo: (columnInfo: Record<string, ColumnInfo[]>) => {
			db.update((state) => ({ ...state, columnInfo }));
		}
	};
}
export const dbStore = createDbStore();
