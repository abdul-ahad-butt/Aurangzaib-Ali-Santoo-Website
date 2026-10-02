const fs = require('fs');
const path = require('path');

const wranglerBin = path.join(__dirname, '..', 'node_modules', 'wrangler', 'bin', 'wrangler.js');

if (fs.existsSync(wranglerBin)) {
  let content = fs.readFileSync(wranglerBin, 'utf8');
  if (!content.includes('// auto-redirect-pages-to-worker')) {
    const target = '...process.argv.slice(2),';
    const replacement = `// auto-redirect-pages-to-worker\n\t\t\t...(process.argv.includes("pages") && process.argv.includes("deploy") ? (process.argv.includes("--dry-run") ? ["deploy", "--dry-run"] : ["deploy"]) : process.argv.slice(2)),`;
    if (content.includes(target)) {
      content = content.replace(target, replacement);
      fs.writeFileSync(wranglerBin, content, 'utf8');
      console.log('[setup-deploy] Configured wrangler deploy shim.');
    }
  }
}
