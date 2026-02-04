/**
 * server.ts
 *
 * Server HTTP minimale (senza framework) per esporre:
 * POST /precheck
 *
 * Regime: FAIL-CLOSED
 * - Se qualcosa non è verificabile → FAIL
 * - Nessun fallback permissivo
 */

import http from "node:http";
import { createHash } from "node:crypto";
import { precheck, type PrecheckRequest, type PrecheckResponse } from "./precheck.js";
import { verifyIPR } from "./verify-ipr.js";
import { recordAuditEvent } from "./audit-log.js";

function json(res: http.ServerResponse, statusCode: number, body: unknown) {
  const payload = JSON.stringify(body);
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload).toString(),
  });
  res.end(payload);
}

function sha256(input: string): string {
  return "sha256:" + createHash("sha256").update(input, "utf8").digest("hex");
}

async function readJson(req: http.IncomingMessage): Promise<any> {
  return await new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error("INVALID_JSON"));
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  // Health
  if (req.method === "GET" && req.url === "/") {
    return json(res, 200, { status: "OK", mode: "fail-closed" });
  }

  // Precheck
  if (req.method === "POST" && req.url === "/precheck") {
    let body: any = {};
    try {
      body = await readJson(req);
    } catch {
      const out = { status: "FAIL", reason_code: "MALFORMED_REQUEST", mode: "fail-closed" };
      // audit (best effort)
      recordAuditEvent({
        event_type: "PRECHECK",
        action_hash: "sha256:INVALID",
        ipr_ref: "IPR:INVALID",
        result: "FAIL",
        reason_code: "MALFORMED_REQUEST",
        timestamp: new Date().toISOString(),
        mode: "fail-closed",
      });
      return json(res, 200, out);
    }

    const input: PrecheckRequest = {
      action_hash: body?.action_hash,
      ipr_ref: body?.ipr_ref,
      timestamp: body?.timestamp,
    };

    // Gate minimo (fail-closed)
    const gated: PrecheckResponse = precheck(input);

    // Se già FAIL → audit e risposta
    if (gated.status === "FAIL") {
      recordAuditEvent({
        event_type: "PRECHECK",
        action_hash: input.action_hash || "sha256:INVALID",
        ipr_ref: input.ipr_ref || "IPR:INVALID",
        result: "FAIL",
        reason_code: gated.reason_code,
        timestamp: new Date().toISOString(),
        mode: "fail-closed",
      });
      return json(res, 200, gated);
    }

    // Se PASS dallo stub (oggi non accade), facciamo comunque verifica IPR reale (stub fail-closed)
    const v = verifyIPR(input.ipr_ref);

    if (!v.valid) {
      const out = { status: "FAIL", reason_code: v.reason_code, mode: "fail-closed" as const };
      recordAuditEvent({
        event_type: "PRECHECK",
        action_hash: input.action_hash,
        ipr_ref: input.ipr_ref,
        result: "FAIL",
        reason_code: v.reason_code,
        timestamp: new Date().toISOString(),
        mode: "fail-closed",
      });
      return json(res, 200, out);
    }

    // PASS finale (evidence deterministica hash-only)
    const evidence_hash = v.evidence_hash || sha256(`${input.action_hash}|${input.ipr_ref}|${input.timestamp}`);

    const out = { status: "PASS", evidence_hash, mode: "fail-closed" as const };
    recordAuditEvent({
      event_type: "PRECHECK",
      action_hash: input.action_hash,
      ipr_ref: input.ipr_ref,
      result: "PASS",
      evidence_hash,
      timestamp: new Date().toISOString(),
      mode: "fail-closed",
    });

    return json(res, 200, out);
  }

  // Default: 404
  return json(res, 404, { error: "NOT_FOUND" });
});

const PORT = Number(process.env.PORT || 8080);
server.listen(PORT, () => {
  // log minimale
  console.log(`IPR Precheck API listening on http://localhost:${PORT}`);
});
