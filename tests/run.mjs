// Lints SKILL.md and runs the skill's own test. Exit 77 from the test = skipped (missing optional tool).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const name = 'social-video-gate';
const md = fs.readFileSync(path.join(root, 'skills', name, 'SKILL.md'), 'utf8').replace(/\r\n/g, '\n');
const fm = md.match(/^---\n([\s\S]*?)\n---\n/);
const get = (k) => (fm && (fm[1].match(new RegExp('^' + k + ':\\s*(.*)$', 'm')) || [])[1] || '').replace(/^"|"$/g, '');
const problems = [];
if (get('name') !== name) problems.push('front matter name must be ' + name);
if (!/^[a-z0-9-]{1,64}$/.test(get('name'))) problems.push('bad name');
const desc = get('description');
if (!desc || desc.length > 1024 || /<[a-z][^>]*>/i.test(desc)) problems.push('description missing, too long or has XML tags');
if (md.split('\n').length > 500) problems.push('SKILL.md longer than 500 lines');
if (problems.length) { console.log('LINT FAIL\n' + problems.join('\n')); process.exit(1); }
console.log('lint ok: ' + name);
const r = spawnSync('node', [path.join(root, 'skills', name, 'tests', 'test.mjs')], { encoding: 'utf8', stdio: 'inherit' });
if (r.status === 77) { console.log('test skipped (optional tool missing)'); process.exit(process.env.CI ? 1 : 0); }
process.exit(r.status);
