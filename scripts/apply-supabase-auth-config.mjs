#!/usr/bin/env node
// Applies ONLY these Supabase Auth settings to the hosted project:
//   - Site URL
//   - Redirect URLs (merged with whatever is already there, nothing is removed)
//   - Email OTP expiry
//   - "Confirm signup" email subject and HTML template (read from this repo)
// It never touches SMTP settings or anything else.
//
// Usage (run in your own terminal; the token must never be committed or pasted into chat):
//   read -s SUPABASE_ACCESS_TOKEN; export SUPABASE_ACCESS_TOKEN
//   node scripts/apply-supabase-auth-config.mjs            # preview only, changes nothing
//   node scripts/apply-supabase-auth-config.mjs --apply    # apply the changes
//
// Get a token at https://supabase.com/dashboard/account/tokens

import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const API = process.env.SUPABASE_API_URL || "https://api.supabase.com/v1";

export const DESIRED = {
  siteUrl: "https://topreasonsco.com",
  redirectUrls: [
    "https://topreasonsco.com/**",
    "https://www.topreasonsco.com/**",
    "http://localhost:3000/**",
  ],
  otpExpirySeconds: 86400,
  confirmSubject: "Confirm your Top Reasons account",
};

export function parseProjectRef(toml) {
  const match = toml.match(/^\s*project_id\s*=\s*"([^"]+)"/m);
  return match ? match[1] : null;
}

export function parseRefFromUrl(url) {
  const match = (url || "").trim().replace(/^["']|["']$/g, "").match(/^https?:\/\/([a-z0-9]+)\.supabase\.co/i);
  return match ? match[1] : null;
}

function readEnvLocalUrl() {
  try {
    const line = readFileSync(resolve(root, ".env.local"), "utf8")
      .split("\n")
      .find((l) => l.startsWith("NEXT_PUBLIC_SUPABASE_URL="));
    return line ? line.slice(line.indexOf("=") + 1) : null;
  } catch {
    return null;
  }
}

// The project to configure is the one the live site actually talks to, so prefer that
// over supabase/config.toml (which can go stale).
function resolveProject() {
  const tomlRef = parseProjectRef(readFileSync(resolve(root, "supabase/config.toml"), "utf8"));
  let found = null;
  if (process.env.SUPABASE_PROJECT_REF) {
    found = { ref: process.env.SUPABASE_PROJECT_REF.trim(), source: "SUPABASE_PROJECT_REF" };
  } else if (parseRefFromUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)) {
    found = { ref: parseRefFromUrl(process.env.NEXT_PUBLIC_SUPABASE_URL), source: "NEXT_PUBLIC_SUPABASE_URL" };
  } else if (parseRefFromUrl(readEnvLocalUrl())) {
    found = { ref: parseRefFromUrl(readEnvLocalUrl()), source: ".env.local (the project the site uses)" };
  } else if (tomlRef) {
    found = { ref: tomlRef, source: "supabase/config.toml" };
  }
  if (!found) throw new Error("Could not work out the Supabase project id (checked env, .env.local and supabase/config.toml)");
  return { ...found, tomlRef };
}

// Keeps every existing entry and appends only the ones that are missing.
export function mergeAllowList(existing, wanted) {
  const merged = (existing || "").split(",").map((s) => s.trim()).filter(Boolean);
  const seen = new Set(merged);
  for (const url of wanted) {
    if (!seen.has(url)) {
      merged.push(url);
      seen.add(url);
    }
  }
  return merged.join(",");
}

const fingerprint = (text) =>
  `${(text ?? "").length} chars, #${createHash("sha256").update(text ?? "").digest("hex").slice(0, 10)}`;

async function callApi(method, ref, token, body) {
  const response = await fetch(`${API}/projects/${ref}/config/auth`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}
  if (!response.ok) {
    const detail = (json && (json.message || json.error)) || text.slice(0, 200);
    if (response.status === 401) {
      throw new Error("Supabase rejected the token (401). Create a fresh personal access token at https://supabase.com/dashboard/account/tokens");
    }
    if (response.status === 403 || response.status === 404) {
      throw new Error(`Supabase says this token can't access project ${ref} (${response.status}). Use a token from an account that owns or administers the project.`);
    }
    throw new Error(`Supabase API ${method} failed (${response.status}): ${detail}`);
  }
  return json;
}

function buildDesired(current, template) {
  return {
    site_url: DESIRED.siteUrl,
    uri_allow_list: mergeAllowList(current.uri_allow_list, DESIRED.redirectUrls),
    mailer_otp_exp: DESIRED.otpExpirySeconds,
    mailer_subjects_confirmation: DESIRED.confirmSubject,
    mailer_templates_confirmation_content: template,
  };
}

function describe(field, value) {
  return field === "mailer_templates_confirmation_content" ? fingerprint(value) : JSON.stringify(value);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    console.log("Usage: node scripts/apply-supabase-auth-config.mjs [--apply]\nPreview by default; --apply makes the changes. Needs SUPABASE_ACCESS_TOKEN.");
    return;
  }
  const apply = args.includes("--apply");

  const token = process.env.SUPABASE_ACCESS_TOKEN;
  if (!token) {
    console.error("SUPABASE_ACCESS_TOKEN is not set.\n\nIn your own terminal:\n  read -s SUPABASE_ACCESS_TOKEN; export SUPABASE_ACCESS_TOKEN\n(paste the token, press Enter), then run this script again.\nCreate a token at https://supabase.com/dashboard/account/tokens");
    process.exit(1);
  }

  const { ref, source, tomlRef } = resolveProject();

  const template = readFileSync(resolve(root, "supabase/templates/confirm_signup.html"), "utf8");
  for (const required of ["{{ .TokenHash }}", "{{ .SiteURL }}", "{{ .Token }}"]) {
    if (!template.includes(required)) {
      throw new Error(`Refusing to push: confirm_signup.html is missing ${required}`);
    }
  }

  console.log(`Project: ${ref}   (from ${source})`);
  if (tomlRef && tomlRef !== ref) {
    console.log(`WARNING: supabase/config.toml says project_id = ${tomlRef}, which differs from the project above.`);
  }
  console.log(`Mode: ${apply ? "APPLY" : "preview (no changes will be made)"}\n`);

  const current = await callApi("GET", ref, token);
  const desired = buildDesired(current, template);

  const changes = {};
  for (const [field, value] of Object.entries(desired)) {
    if (current[field] !== value) changes[field] = value;
  }

  for (const [field, value] of Object.entries(desired)) {
    const changed = field in changes;
    console.log(`${changed ? "CHANGE" : "ok    "}  ${field}`);
    if (changed) {
      console.log(`          now: ${describe(field, current[field])}`);
      console.log(`          new: ${describe(field, value)}`);
    }
  }

  console.log(`\nNot touched: SMTP (host: ${current.smtp_host || "not set"}, sender: ${current.smtp_admin_email || "not set"}) and every other auth setting.`);

  if (Object.keys(changes).length === 0) {
    console.log("\nEverything is already up to date.");
    return;
  }
  if (!apply) {
    console.log("\nPreview only. Nothing was changed. Run again with --apply to make these changes.");
    return;
  }

  await callApi("PATCH", ref, token, changes);

  const after = await callApi("GET", ref, token);
  let allGood = true;
  console.log("\nApplied. Re-reading from Supabase to confirm:");
  for (const [field, value] of Object.entries(changes)) {
    const good = after[field] === value;
    allGood = allGood && good;
    console.log(`  ${good ? "OK  " : "FAIL"}  ${field}`);
  }
  if (!allGood) {
    console.error("\nSome values did not match after saving. Check Authentication settings in the dashboard.");
    process.exit(1);
  }
  console.log("\nDone. Next: sign up with a fresh real address and check the email.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`\nError: ${error.message}`);
    process.exit(1);
  });
}
