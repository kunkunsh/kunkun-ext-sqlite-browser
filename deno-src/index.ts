import { expose } from '@kunkun/api/runtime/deno';
import { SQLiteBrowser } from './dao.ts';

expose(new SQLiteBrowser());
