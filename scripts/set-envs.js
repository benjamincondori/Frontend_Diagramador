const { writeFileSync, mkdirSync } = require('fs');
require('dotenv').config();

const targetPath = './src/environments/environment.ts';

const envConfigFile = `
  export const environment = {
    baseUrl: "${process.env.API_URL}",
    wsUrl: "${process.env.WS_URL}",
  }
`;

mkdirSync('./src/environments', { recursive: true });
writeFileSync(targetPath, envConfigFile);


