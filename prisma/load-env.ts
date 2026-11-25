export function loadLocalEnv(): void {
  try {
    process.loadEnvFile(".env");
  } catch {
    return;
  }
}
