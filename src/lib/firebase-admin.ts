import * as admin from 'firebase-admin';

// Initialize Firebase Admin (Singleton pattern)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(), // Uses GOOGLE_APPLICATION_CREDENTIALS or Cloud Run identity
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    });
}

const db = admin.firestore();

export const checkVipCache = async (vipId: string) => {
    const docRef = db.collection('vip_pages').doc(vipId);
    const doc = await docRef.get();

    if (doc.exists) {
        return doc.data();
    }
    return null;
};

export const cacheVipResult = async (vipId: string, data: any) => {
    const docRef = db.collection('vip_pages').doc(vipId);
    await docRef.set({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        vipId
    });
};

export const logVisitor = async (vipId: string) => {
    await db.collection('visitor_logs').add({
        vipId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        userAgent: 'server-side-detected'
    });
};
