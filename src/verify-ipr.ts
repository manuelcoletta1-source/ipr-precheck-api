/**
 * verify-ipr.ts
 *
 * Modulo di verifica tecnica ex-ante dell’Identity Primary Record (IPR).
 * Questo modulo:
 * - NON decide nel merito
 * - NON custodisce dati personali
 * - verifica solo condizioni minime di eseguibilità
 *
 * Regime: FAIL-CLOSED
 */

export type IPRVerificationResult =
  | { valid: true; evidence_hash: string }
  | { valid: false; reason_code: string };

export function verifyIPR(ipr_ref: string): IPRVerificationResult {
  // Controllo minimo di coerenza sintattica
  if (!ipr_ref || typeof ipr_ref !== "string") {
    return { valid: false, reason_code: "IPR_MALFORMED" };
  }

  // Stub tecnico:
  // Qui in futuro verrà collegata la verifica reale (hash, manifest, anchor, ecc.)
  // In assenza di prova verificabile → BLOCCO
  return { valid: false, reason_code: "IPR_NOT_VERIFIABLE" };
}
