import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { admin } from "./firebase";
//npm run build && npx firebase deploy --only functions
export const logStatusViagens = onDocumentUpdated(
  {
    region: "southamerica-east1",
    document: "VIAGENS/{idViagem}",
  },
  async (event) => {
    const before = event.data?.before?.data();
    const after = event.data?.after?.data();

    if (!before || !after) return;

    const prev = before.status;
    const next = after.status;
    const uuid = after.uuid || null; // Captando o uuid passado pelo cliente

    // Só loga se mudou e se ambos existem
    if (prev === next || prev === undefined || next === undefined) return;

    const db = admin.firestore();

    await db.collection("LOG_VIAGENS").add({
      valorAnt: prev,
      valorAtt: next,
      dateTime: admin.firestore.FieldValue.serverTimestamp(),
      idViagem: event.params.idViagem,
      uuid: uuid,
    });
  }
);
