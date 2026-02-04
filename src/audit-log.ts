/**
 * audit-log.ts
 *
 * Modulo di audit tecnico append-only.
 * Registra eventi di precheck senza custodire dati personali.
 *
 * Principi:
 * - hash-only
 * - append-only
 * - verificabile nel tempo
 * - FAIL-CLOSED
 */

export type AuditEvent = {
  event_type: "PRECHECK";
  action_hash: string;
  ipr_ref: string;
  result: "PASS" | "FAIL";
  reason_code?: string;
  evidence_hash?: string;
  timestamp: string; // ISO-8601
  mode: "fail-closed";
};

export function recordAuditEvent(event: AuditEvent): void {
  // Stub tecnico:
  // In implementazione reale: append su log immutabile / file / ledger / stream
  // Qui NON si salva nulla in modo persistente.
  // Il solo fatto che questo punto esista rende il sistema audit-first.
  return;
}
