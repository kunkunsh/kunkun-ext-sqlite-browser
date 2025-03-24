import { Database } from 'jsr:@db/sqlite@0.12';
import * as v from 'valibot';
import {
	TableInfoSchema,
	ColumnInfoSchema,
	PaginationParamsSchema,
	QueryResultSchema,
	TableInfo,
	PaginationParams,
	QueryResult,
	ColumnInfo
} from '../src/types.ts';

export class SQLiteBrowser {
	private db: Database | null = null;

	/**
	 * Initialize the database connection
	 * @param dbPath Path to the SQLite database file
	 */
	init(dbPath: string): void {
		if (this.db) {
			throw new Error('Database is already initialized');
		}
		this.db = new Database(dbPath);
		console.error('db initialized', this.db);
	}

	/**
	 * Close the database connection
	 */
	close(): void {
		if (!this.db) {
			throw new Error('Database is not initialized');
		}
		this.db.close();
		this.db = null;
	}

	/**
	 * Get all table names from the database
	 */
	getTables(): TableInfo[] {
		this.ensureConnection();
		const results = this.db!.prepare(
			`
      SELECT name, type
      FROM sqlite_master 
      WHERE type='table'
      ORDER BY name;
    `
		).all();

		return results.map((result) => v.parse(TableInfoSchema, result));
	}

	/**
	 * Get column information for a specific table
	 * @param tableName Name of the table
	 */
	getTableColumns(tableName: string): ColumnInfo[] {
		this.ensureConnection();
		this.validateTableName(tableName);
		const results = this.db!.prepare(`PRAGMA table_info(${tableName})`).all();

		return results.map((result) => v.parse(ColumnInfoSchema, result));
	}

	/**
	 * Get data from a table with pagination
	 * @param tableName Name of the table
	 * @param pagination Pagination parameters
	 */
	getTableData(
		tableName: string,
		pagination: PaginationParams
	): {
		data: QueryResult[];
		total: number;
		totalPages: number;
	} {
		this.ensureConnection();
		this.validateTableName(tableName);

		// Validate pagination params
		const validatedPagination = v.parse(PaginationParamsSchema, pagination);
		const { page, pageSize } = validatedPagination;

		const offset = (page - 1) * pageSize;
		const result = this.db!.prepare(`SELECT COUNT(*) as count FROM ${tableName}`).get() as {
			count: number;
		};
		const total = result.count;
		const totalPages = Math.ceil(total / pageSize);

		const rawData = this.db!.prepare(`SELECT * FROM ${tableName} LIMIT ?1 OFFSET ?2`).all(
			pageSize,
			offset
		);

		const data = rawData.map((row) => v.parse(QueryResultSchema, row));

		return {
			data,
			total,
			totalPages
		};
	}

	/**
	 * Execute a raw SQL query
	 * @param query SQL query string with optional parameters (e.g. "SELECT * FROM table WHERE id = ?1")
	 */
	executeQuery(query: string): QueryResult[] {
		this.ensureConnection();
		const results = this.db!.prepare(query).all();

		return results.map((result) => v.parse(QueryResultSchema, result));
	}

	/**
	 * Insert a new record into a table
	 * @param tableName Name of the table
	 * @param data Record data
	 */
	// insert(tableName: string, data: Record<string, unknown>): number {
	// 	this.ensureConnection();
	// 	this.validateTableName(tableName);

	// 	const columns = Object.keys(data);
	// 	const values = Object.values(data);
	// 	const placeholders = columns.map((_, i) => `?${i + 1}`).join(', ');

	// 	const query = `
	//   INSERT INTO ${tableName} (${columns.join(', ')})
	//   VALUES (${placeholders})
	// `;

	// 	const result = this.db!.prepare(query).run(...values);
	// 	return result.lastInsertId;
	// }

	// /**
	//  * Update records in a table
	//  * @param tableName Name of the table
	//  * @param data Update data
	//  * @param whereClause WHERE clause for the update
	//  * @param whereParams Parameters for the WHERE clause
	//  */
	// update(
	// 	tableName: string,
	// 	data: Record<string, unknown>,
	// 	whereClause: string,
	// 	whereParams: unknown[] = []
	// ): number {
	// 	this.ensureConnection();
	// 	this.validateTableName(tableName);

	// 	const setClause = Object.entries(data)
	// 		.map(([column], index) => `${column} = ?${index + 1}`)
	// 		.join(', ');

	// 	const query = `
	//   UPDATE ${tableName}
	//   SET ${setClause}
	//   WHERE ${whereClause}
	// `;

	// 	const params = [...Object.values(data), ...whereParams];
	// 	const result = this.db!.prepare(query).run(...params);
	// 	return result.changes;
	// }

	// /**
	//  * Delete records from a table
	//  * @param tableName Name of the table
	//  * @param whereClause WHERE clause for the deletion
	//  * @param whereParams Parameters for the WHERE clause
	//  */
	// delete(tableName: string, whereClause: string, whereParams: unknown[] = []): number {
	// 	this.ensureConnection();
	// 	this.validateTableName(tableName);

	// 	const query = `DELETE FROM ${tableName} WHERE ${whereClause}`;
	// 	const result = this.db!.prepare(query).run(...whereParams);
	// 	return result.changes;
	// }

	/**
	 * Create a new table
	 * @param tableName Name of the table
	 * @param columns Column definitions
	 */
	createTable(tableName: string, columns: string): void {
		this.ensureConnection();
		this.validateTableName(tableName);

		const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;
		this.db!.prepare(query).run();
	}

	private ensureConnection(): void {
		if (!this.db) {
			throw new Error('Database is not initialized');
		}
	}

	private validateTableName(tableName: string): void {
		// Basic SQL injection prevention
		if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
			throw new Error('Invalid table name');
		}
	}
}
