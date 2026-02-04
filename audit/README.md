# Audit (append-only)

Questo repository adotta un regime audit-first.

Ogni richiesta di precheck produce una traccia tecnica:
- riproducibile
- verificabile nel tempo
- indipendente dal sistema esecutivo
- senza custodia di dati personali

## Principio

In assenza di prova verificabile ex-ante → nessuna esecuzione.
Il sistema opera in modalità FAIL-CLOSED.

## Eventi minimi registrabili

Per ogni richiesta /precheck, il sistema può produrre un evento auditabile con campi hash-only.

Esempio (schema logico):

- event_type: PRECHECK
- action_hash: sha256:...
- ipr_ref: IPR-...
- result: PASS | FAIL
- reason_code: (solo se FAIL)
- evidence_hash: (solo se PASS)
- timestamp: ISO-8601
- mode: fail-closed

## Reason codes (minimi)

- IPR_NOT_VERIFIABLE
- IPR_EXPIRED
- IPR_MISMATCH
- POLICY_FAIL_CLOSED
- MALFORMED_REQUEST

Nota:
I reason_code descrivono una condizione tecnica verificabile.
Non esprimono giudizi sul merito dell’azione.

## Nessuna custodia dati

Questo progetto non richiede:
- identità in chiaro
- dati personali
- contenuti dell’azione

Solo riferimenti hash-only e metadati tecnici essenziali.
