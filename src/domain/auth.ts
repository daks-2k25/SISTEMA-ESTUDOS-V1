export interface AuthCredentials {
  username: string;
  passwordHash: string;
}

export interface LoginInput {
  username: string;
  password: string;
  ip: string;
}

export type LoginOutcome = "success" | "invalid" | "blocked";
