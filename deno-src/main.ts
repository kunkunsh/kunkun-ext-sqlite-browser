import { SQLiteBrowser } from './dao.ts';

const browser = new SQLiteBrowser();
browser.init('kk.dev.db');

// Get all tables
const tables = browser.getTables();
console.log('Tables in database:', tables);

// Get extensions table columns
const extensionColumns = browser.getTableColumns('extensions');
console.log('Extension columns:', extensionColumns);

// Get extensions data with pagination
const extensionsData = browser.getTableData('extensions', { page: 1, pageSize: 10 });
console.log('Extensions:', extensionsData);

browser.close();
