import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import creds from '../../service-account.json'; // Ensure this path is correct and file exists

// Initialize auth - use service account
const serviceAccountAuth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
    ],
});

export const getVIPData = async (vipIdInput: string) => {
    const vipId = decodeURIComponent(vipIdInput);
    if (!process.env.GOOGLE_SHEET_ID) {
        throw new Error('GOOGLE_SHEET_ID is not defined in environment variables');
    }

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);

    try {
        await doc.loadInfo();

        // User specified "History" tab
        const sheet = doc.sheetsByTitle['History'];
        if (!sheet) {
            console.error("Sheet 'History' not found");
            return null;
        }

        const rows = await sheet.getRows();

        // Safe normalization helper
        const normalize = (str: any) => String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const target = normalize(vipId);

        // Find match in '수신이메일' (Recipient Email) or '상호명' (Company Name)
        const row = rows.find((r) => {
            const email = normalize(r.get('수신이메일'));
            const company = normalize(r.get('상호명'));
            return email.includes(target) || company.includes(target);
        });

        if (!row) {
            console.log(`VIP ID '${vipId}' not found in 'History' tab rows.`);
            return null;
        }

        return {
            companyName: row.get('상호명'),
            email: row.get('수신이메일'),
            // Map other fields from 'History' if needed for the UI
            // '조사내용', '생성상태', '생성제목', '생성본문', '언어', '생성일시'
            generatedTitle: row.get('생성제목'),
            generatedBody: row.get('생성본문'),
        };
    } catch (error) {
        console.error('Error fetching VIP data:', error);
        return null; // Return null to trigger 404
    }
};
