# IPR Precheck API

API tecnica per la verifica ex-ante di azioni digitali tramite Identity Primary Record (IPR).

Nessuna azione è eseguibile se non preceduta da un IPR valido e verificabile.
In assenza di prova → blocco automatico (fail-closed).

Questa API:
- NON decide nel merito delle azioni
- NON custodisce identità o dati personali
- NON applica fallback permissivi
- NON riscrive eventi passati

Opera esclusivamente come vincolo tecnico ex-ante.

## Principio operativo

IPR = riferimento
Precheck = misura
Esecuzione = condizionata

Se la verifica fallisce, l’azione non viene eseguita.

## Modalità di funzionamento

Input:
- hash dell’azione
- riferimento IPR
- timestamp

Output:
- PASS → azione eseguibile
- FAIL → azione bloccata

Ogni risposta è auditabile e opponibile nel tempo.

## Regime di sicurezza

- fail-closed
- hash-only
- append-only audit
- nessuna custodia dati

## Allineamento UE

- AI Act: human oversight tecnico ex-ante
- GDPR: minimizzazione, nessun dato personale
- NIS2: prevenzione del rischio
- eIDAS (principi): tracciabilità e opponibilità

## Stato

Repository in fase di inizializzazione tecnica.
Questo progetto dimostra un meccanismo di blocco ex-ante, non una nuova autorità.
