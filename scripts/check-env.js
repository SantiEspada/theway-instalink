const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const envFilePath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envFilePath });

const envExampleFilePath = path.resolve(__dirname, '../.env.example');
const requiredEnvVariables = dotenv.parse(fs.readFileSync(envExampleFilePath));

for (const envVariable of Object.keys(requiredEnvVariables)) {
  if (!(envVariable in process.env)) {
    throw new Error(`Missing ${envVariable} in env`);
  }
}
