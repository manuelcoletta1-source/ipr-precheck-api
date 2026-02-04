/**
 * IPR Precheck API — core stub (ex-ante, fail-closed)
 *
 * Questo file definisce la logica minima di valutazione:
 * - input: action_hash, ipr_ref, timestamp
 * - output: PASS|FAIL + evidence_hash/reason_code
 *
 * Nota: non implementa custodia dati personali.
 * Nota: non decide nel merito dell'azione.
 */

export type PrecheckRequest = {
  action_hash: string;
  ipr_ref: string;
  timestamp: string; // ISO-8601
};

export type PrecheckResponse =
  | { status: "PASS"; evidence_hash: string; mode: "fail-closed" }
  | { status: "FAIL"; reason_code: string; mode: "fail-closed" };

export function precheck(req: PrecheckRequest): PrecheckResponse {
  // FAIL-CLOSED: se manca qualcosa di minimo → blocco
  if (!req?.action_hash || !req?.ipr_ref || !req?.timestamp) {
    return { status: "FAIL", reason_code: "MALFORMED_REQUEST", mode: "fail-closed" };
  }

  // Stub: qui andrà la verifica IPR reale (verify-ipr.ts)
  // Per ora: blocco di default per evitare comportamenti permissivi.
  return { status: "FAIL", reason_code: "IPR_NOT_VERIFIABLE", mode: "fail-closed" };
}
