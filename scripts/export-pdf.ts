import { spawn, type ChildProcess } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { createServer } from "node:net";
import { resolve } from "node:path";

import { chromium } from "playwright";

import { loadResumeData, resolveVariant, ResumeDataError } from "../src/lib/resume";
import { pdfFileNameForVariant } from "../src/lib/resume/pdf";
import { assertPdfSmoke, inspectPdf } from "./pdf-smoke";

const args = process.argv.slice(2);
const variantId = readRequiredVariant(args);
const { resume, variants } = loadResumeData();
const knownVariantIds = variants.variants.map(({ id }) => id);

if (!knownVariantIds.includes(variantId)) {
  throw new ResumeDataError(
    `Unknown variant "${variantId}". Choose one of: ${knownVariantIds.join(", ")}`,
  );
}

const model = resolveVariant(resume, variants, variantId);
const outputDirectory = resolve("dist");
const outputPath = resolve(outputDirectory, pdfFileNameForVariant(variantId));
await mkdir(outputDirectory, { recursive: true });

const configuredBaseUrl = process.env.CV_BASE_URL?.replace(/\/$/, "");
const server = configuredBaseUrl ? undefined : await startLocalServer();
const baseUrl = configuredBaseUrl ?? server?.baseUrl;

if (!baseUrl) throw new Error("Unable to determine the CV server URL");

try {
  await waitForCvPage(`${baseUrl}/cv/${variantId}`);
  await exportPdf(`${baseUrl}/cv/${variantId}`, outputPath, variantId);
  const inspection = await inspectPdf(outputPath);
  assertPdfSmoke(inspection, model);
  console.log(
    `Created ${outputPath} (${inspection.pageCount} page(s), ${inspection.byteLength} bytes).`,
  );
} finally {
  await stopServer(server?.process);
}

async function exportPdf(url: string, outputPath: string, expectedVariant: string) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
  });
  const browserErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  try {
    const response = await page.goto(url, { waitUntil: "networkidle" });
    if (!response?.ok()) {
      throw new Error(`CV page returned HTTP ${response?.status() ?? "unknown"}`);
    }

    await page.waitForSelector(
      `.resume-document[data-variant="${expectedVariant}"][data-render-complete="true"]`,
    );
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: "print" });

    if (browserErrors.length) {
      throw new Error(`Browser rendering errors:\n${browserErrors.join("\n")}`);
    }

    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
  } finally {
    await browser.close();
  }
}

async function startLocalServer(): Promise<{
  baseUrl: string;
  process: ChildProcess;
}> {
  const port = await findAvailablePort();
  const nextBinary = resolve(
    "node_modules",
    ".bin",
    process.platform === "win32" ? "next.cmd" : "next",
  );
  const child = spawn(
    nextBinary,
    ["dev", "--hostname", "127.0.0.1", "--port", String(port)],
    {
      cwd: process.cwd(),
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  let serverLog = "";
  child.stdout?.on("data", (chunk: Buffer) => {
    serverLog += chunk.toString();
  });
  child.stderr?.on("data", (chunk: Buffer) => {
    serverLog += chunk.toString();
  });

  child.once("exit", (code) => {
    if (code && code !== 0) {
      console.error(`Local Next.js server exited with code ${code}.\n${serverLog}`);
    }
  });

  return { baseUrl: `http://127.0.0.1:${port}`, process: child };
}

async function waitForCvPage(url: string): Promise<void> {
  const deadline = Date.now() + 60_000;
  let lastError: unknown;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok && (await response.text()).includes("data-cv-app")) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 400));
  }

  throw new Error(`CV server did not become ready at ${url}: ${String(lastError ?? "timeout")}`);
}

async function findAvailablePort(): Promise<number> {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Unable to allocate a local port"));
        return;
      }
      server.close(() => resolvePort(address.port));
    });
  });
}

async function stopServer(child?: ChildProcess): Promise<void> {
  if (!child || child.killed || child.exitCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([
    new Promise<void>((resolveExit) => child.once("exit", () => resolveExit())),
    new Promise<void>((resolveTimeout) => setTimeout(resolveTimeout, 2_000)),
  ]);
}

function readRequiredVariant(args: string[]): string {
  const inline = args.find((argument) => argument.startsWith("--variant="));
  if (inline) return inline.slice("--variant=".length);
  const index = args.indexOf("--variant");
  const value = index >= 0 ? args[index + 1] : undefined;
  if (!value) {
    throw new Error(
      "Missing variant. Usage: npm run pdf -- --variant software",
    );
  }
  return value;
}
