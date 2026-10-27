// Run with: ELECTRON_RUN_AS_NODE=1 "<DSH exe>" tests/compat-check.mjs [profile]
// Uses dshmarket's own analyzer (when installed) so the reported peer risk
// matches what the market banner shows.
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const profile = process.argv[2] || 'C:/Users/24537/.dsh/profiles/desktop';
const marketLib = `${profile}/node_modules/dshmarket/lib/compatibility.js`;
if (!existsSync(marketLib)) {
  console.log(JSON.stringify({ skipped: 'dshmarket not installed at this profile' }));
  process.exit(0);
}
const { assessCompatibility } = await import(pathToFileURL(marketLib).href);
const options = process.env.DSH_INSTALL_DIR ? { dshInstallDir: process.env.DSH_INSTALL_DIR } : {};
const result = assessCompatibility(profile, options);
console.log(JSON.stringify({ risks: result.risks, warnings: result.warnings, duplicateNames: result.duplicateNames }, null, 2));
