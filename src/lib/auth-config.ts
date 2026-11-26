import type { AuthCredentials } from "@/domain/auth";

export const AUTH_CREDENTIALS: AuthCredentials = {
  username: "freitasthiago",
  passwordHash: "3189b83111c0072cd0fbfa263f398680:d998000e2c446e1f96bdb1999982728c44d4386a15293b57495a0b60cfd8f19d57e69f7d69bb35e6ea1105c2bb208cb6a6c84698f4547bcee112fc929aa15b83",
};

export const SESSION_COOKIE_NAME = "devjr120_session";
const HOUR_MS = 60 * 60 * 1000;

export const SHORT_SESSION_MS = 12 * HOUR_MS;
export const REMEMBERED_SESSION_MS = 30 * 24 * HOUR_MS;
