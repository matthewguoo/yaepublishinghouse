import { execSync } from 'node:child_process';

function run(command) {
  execSync(command, {
    stdio: 'inherit',
    env: process.env,
  });
}

run('npx prisma generate');

if (process.env.POSTGRES_URL) {
  run('npx prisma db push');
  run('node prisma/seed.mjs');
} else {
  console.log('POSTGRES_URL not set, skipping prisma db push and seed.');
}

run('next build');
