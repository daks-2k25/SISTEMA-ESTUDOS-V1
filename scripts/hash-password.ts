import { createInterface } from "node:readline/promises";
import { hashPassword } from "../src/services/password-hash";

const MIN_PASSWORD_LENGTH = 8;

async function askPassword(): Promise<string> {
  const terminal = createInterface({ input: process.stdin, output: process.stdout });
  const password = await terminal.question("Digite a nova senha: ");
  terminal.close();
  return password;
}

async function main(): Promise<void> {
  const password = await askPassword();
  if (password.length < MIN_PASSWORD_LENGTH) {
    console.error("A senha precisa ter pelo menos " + MIN_PASSWORD_LENGTH + " caracteres.");
    process.exitCode = 1;
    return;
  }

  console.log("\nCole este valor em passwordHash, no arquivo src/lib/auth-config.ts:\n");
  console.log(hashPassword(password));
}

main();
