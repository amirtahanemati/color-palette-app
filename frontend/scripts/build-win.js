const { execSync } = require("child_process");
const path = require("path");
require("dotenv").config();

process.env.CSC_LINK = path.resolve(
  __dirname,
  "..",
  "certs",
  "certificate.pfx",
);
process.env.CSC_KEY_PASSWORD = process.env.WIN_CSC_KEY_PASSWORD;
process.env.WIN_SIGN_TIMESTAMP_SERVER = "http://timestamp.sectigo.com";

execSync("vite build && electron-builder --win", {
  stdio: "inherit",
  env: process.env,
});
