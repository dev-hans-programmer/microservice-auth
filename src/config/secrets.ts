import fs from 'fs/promises';
import Config from './index';
import path from 'path';

const loadSecrets = async () => {
  if (Config.USE_SECRET_MANAGER) {
    // Example: Load from AWS Secrets Manager
    // const client = new SecretsManagerClient({});
    // const secret = await client.send(new GetSecretValueCommand({ SecretId: "myApp/jwt" }));
    // return JSON.parse(secret.SecretString || "{}");
    throw new Error('Secret manager not implemented yet');
  }

  // fallback: load from files
  const [privateKey, publicKey] = await Promise.all([
    fs.readFile(path.resolve('certs/private.pem')),
    fs.readFile(path.resolve('certs/public.pem')),
  ]);

  return { privateKey, publicKey };
};

export default loadSecrets;
