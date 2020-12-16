const path = require('path');
const dotenv = require('dotenv');
const childProcess = require('child_process');
const perfHooks = require('perf_hooks');

function loadEnv(envFilename) {
  const envFilepath = path.resolve(__dirname, `../../${envFilename}`);

  const { error, parsed } = dotenv.config({
    path: envFilepath,
  });

  if (error) {
    throw error;
  }

  return parsed;
}

function parseArgs() {
  const runtimeArgs = process.argv.slice(2);

  let [prefix, envFilename = '.env'] = runtimeArgs;

  if (!prefix) {
    throw new Error('Usage: node update-secrets.js <prefix> [envFileName]');
  }

  return {
    prefix,
    envFilename,
  };
}

async function exec(command) {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (error) => {
      if (error) {
        reject(error);
      }

      resolve();
    });
  });
}

async function updateSecret({ prefix, name, value }) {
  const secretName = `${prefix}__${name.replace(/[ _]/g, '-').toLowerCase()}`;

  const commands = [
    `vercel secrets rm ${secretName} -y`,
    `vercel secrets add ${secretName} "${value.replace(/"/g, '/"')}"`,
  ];

  for (const command of commands) {
    try {
      await exec(command);
    } catch (err) {
      const isNotFoundError = err.message.toLowerCase().includes('not found');

      if (!isNotFoundError) {
        throw err;
      }
    }
  }

  console.log(`Added ${secretName}=${value}`);
}

async function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function main() {
  const startTimeMillisecs = perfHooks.performance.now();

  const { prefix, envFilename } = parseArgs();
  const envVariables = loadEnv(envFilename);

  console.log(
    `Updating secrets for ${prefix} getting values from ${envFilename}\n`
  );

  await sleep(3 * 1000);

  for (const [name, value] of Object.entries(envVariables)) {
    await updateSecret({
      prefix,
      name,
      value,
    });
  }

  const endTimeMillisecs = perfHooks.performance.now();

  const ellapsedTimeSecs = (endTimeMillisecs - startTimeMillisecs) / 1000;

  console.log(`\nDone in ${ellapsedTimeSecs.toFixed(3)} secs`);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
