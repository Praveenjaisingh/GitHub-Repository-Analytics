const fs = require('fs');
const path = require('path');

const targets = [
  { example: 'backend/.env.example', target: 'backend/.env' },
  { example: 'frontend/.env.example', target: 'frontend/.env' },
  { example: '.env.example', target: '.env' },
];

for (const { example, target } of targets) {
  const examplePath = path.join(__dirname, '..', example);
  const targetPath = path.join(__dirname, '..', target);

  if (!fs.existsSync(examplePath)) continue;

  if (fs.existsSync(targetPath)) {
    console.log(`skip  ${target} (already exists)`);
    continue;
  }

  fs.copyFileSync(examplePath, targetPath);
  console.log(`created ${target}`);
}

console.log('\nDone. Review backend/.env and frontend/.env, then run: npm run dev');
