"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logStatusViagens = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const firebase_1 = require("./firebase");
//npm run build && npx firebase deploy --only functions
exports.logStatusViagens = (0, firestore_1.onDocumentUpdated)({
    region: "southamerica-east1",
    document: "VIAGENS/{idViagem}",
}, async (event) => {
    const before = event.data?.before?.data();
    const after = event.data?.after?.data();
    if (!before || !after)
        return;
    const prev = before.status;
    const next = after.status;
    const uuid = after.uuid || null; // Captando o uuid passado pelo cliente
    // Só loga se mudou e se ambos existem
    if (prev === next || prev === undefined || next === undefined)
        return;
    const db = firebase_1.admin.firestore();
    await db.collection("LOG_VIAGENS").add({
        valorAnt: prev,
        valorAtt: next,
        dateTime: firebase_1.admin.firestore.FieldValue.serverTimestamp(),
        idViagem: event.params.idViagem,
        uuid: uuid,
    });
});
