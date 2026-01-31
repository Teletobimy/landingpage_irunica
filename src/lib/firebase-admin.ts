import * as admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

const STORAGE_BUCKET = process.env.GOOGLE_CLOUD_PROJECT_ID + '-vip-images';

// Initialize Firebase Admin (Singleton pattern)
if (!admin.apps.length) {
    try {
        // Try to load service account from file first (local dev)
        const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account.json';
        const absolutePath = path.resolve(process.cwd(), serviceAccountPath);

        if (fs.existsSync(absolutePath)) {
            const serviceAccount = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: serviceAccount.project_id,
                storageBucket: STORAGE_BUCKET,
            });
            console.log('[Firebase] Initialized with service account file');
        } else {
            // Fall back to application default credentials (Cloud Run)
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
                projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
                storageBucket: STORAGE_BUCKET,
            });
            console.log('[Firebase] Initialized with application default credentials');
        }
    } catch (error) {
        console.error('[Firebase] Initialization error:', error);
        // Last resort fallback
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
            storageBucket: STORAGE_BUCKET,
        });
    }
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Upload base64 image to Cloud Storage and return public URL
export const uploadImageToStorage = async (
    vipId: string,
    imageId: string,
    base64Data: string
): Promise<string> => {
    try {
        // Extract base64 content (remove data:image/xxx;base64, prefix)
        const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            console.error('[Storage] Invalid base64 format');
            return base64Data; // Return original if invalid
        }

        const mimeType = matches[1];
        const base64Content = matches[2];
        const extension = mimeType.split('/')[1] || 'png';
        const buffer = Buffer.from(base64Content, 'base64');

        const filePath = `vip-images/${vipId}/${imageId}.${extension}`;
        const file = bucket.file(filePath);

        await file.save(buffer, {
            metadata: {
                contentType: mimeType,
                cacheControl: 'public, max-age=31536000', // 1 year cache
            },
        });

        // Make file publicly readable
        await file.makePublic();

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
        console.log(`[Storage] Uploaded ${imageId} → ${publicUrl}`);
        return publicUrl;
    } catch (error) {
        console.error('[Storage] Upload error:', error);
        return base64Data; // Fallback to base64 if upload fails
    }
};

// Upload multiple images and return array with URLs
export const uploadImagesToStorage = async (
    vipId: string,
    images: { id: string; url: string }[]
): Promise<{ id: string; url: string }[]> => {
    const results = await Promise.all(
        images.map(async (img) => {
            // Only upload base64 images, skip already-hosted URLs
            if (img.url.startsWith('data:')) {
                const url = await uploadImageToStorage(vipId, img.id, img.url);
                return { id: img.id, url };
            }
            return img;
        })
    );
    return results;
};

export const checkVipCache = async (vipId: string) => {
    try {
        const docRef = db.collection('vip_pages').doc(vipId);
        const doc = await docRef.get();

        if (doc.exists) {
            console.log(`[Cache HIT] Found cached content for ${vipId}`);
            return doc.data();
        }
        console.log(`[Cache MISS] No cached content for ${vipId}`);
        return null;
    } catch (error) {
        console.error('[Cache] Error checking cache:', error);
        return null;
    }
};

export const cacheVipResult = async (vipId: string, data: any) => {
    try {
        const docRef = db.collection('vip_pages').doc(vipId);
        await docRef.set({
            ...data,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            vipId
        });
        console.log(`[Cache] Saved content for ${vipId}`);
    } catch (error) {
        console.error('[Cache] Error saving cache:', error);
    }
};

export const logVisitor = async (vipId: string) => {
    try {
        await db.collection('visitor_logs').add({
            vipId,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            userAgent: 'server-side-detected'
        });
        console.log(`[Visitor] Logged visit for ${vipId}`);
    } catch (error) {
        console.error('[Visitor] Error logging visit:', error);
    }

    // Send notification email to admin
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const ADMIN_EMAIL = process.env.EMAIL_USER;
        const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

        await transporter.sendMail({
            from: `"VIP Page Alert" <${ADMIN_EMAIL}>`,
            to: ADMIN_EMAIL,
            subject: `[방문 알림] ${vipId}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2 style="color: #d97706;">VIP 페이지 방문 알림</h2>
                    <p><strong>방문자:</strong> ${vipId}</p>
                    <p><strong>시간:</strong> ${now}</p>
                    <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;"/>
                    <p style="font-size: 12px; color: #888;">Irunica VIP Landing Page System</p>
                </div>
            `,
        });
        console.log(`[Email] Visit notification sent for ${vipId}`);
    } catch (error) {
        console.error('[Email] Failed to send visit notification:', error);
    }
};
