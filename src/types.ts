import * as v from 'valibot';

export const QueryResultSchema = v.record(v.string(), v.unknown());

export const PaginationParamsSchema = v.object({
	page: v.number(),
	pageSize: v.number()
});

export const TableInfoSchema = v.object({
	name: v.string(),
	type: v.string()
});

export const ColumnInfoSchema = v.object({
	cid: v.number(),
	name: v.string(),
	type: v.string(),
	notnull: v.number(),
	dflt_value: v.unknown(),
	pk: v.number()
});

export type QueryResult = v.InferOutput<typeof QueryResultSchema>;
export type PaginationParams = v.InferOutput<typeof PaginationParamsSchema>;
export type TableInfo = v.InferOutput<typeof TableInfoSchema>;
export type ColumnInfo = v.InferOutput<typeof ColumnInfoSchema>;
