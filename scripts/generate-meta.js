import { writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import pkg from '../package.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const meta = {
    version: pkg.version,
    buildDate: new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
};

writeFileSync(resolve(__dirname, '../public/meta.json'), JSON.stringify(meta, null, 2));

console.log('✅ meta.json сгенерирован:', meta);
