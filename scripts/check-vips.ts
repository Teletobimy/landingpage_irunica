import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            process.env[key.trim()] = valueParts.join('=').trim();
        }
    });
}

// Import service account credentials
import creds from '../service-account.json';

const serviceAccountAuth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function checkVIPs() {
    console.log('🔍 Google Sheets VIP 목록 확인 중...\n');

    if (!process.env.GOOGLE_SHEET_ID) {
        console.error('❌ GOOGLE_SHEET_ID가 .env.local에 설정되지 않았습니다.');
        return;
    }

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);

    try {
        await doc.loadInfo();
        console.log(`📄 스프레드시트: ${doc.title}\n`);

        const sheet = doc.sheetsByTitle['History'];
        if (!sheet) {
            console.error('❌ "History" 탭을 찾을 수 없습니다.');
            return;
        }

        const rows = await sheet.getRows();
        console.log(`✅ History 탭에서 ${rows.length}개의 VIP 발견:\n`);
        console.log('=' .repeat(60));

        rows.forEach((row, index) => {
            const company = row.get('상호명') || '(없음)';
            const email = row.get('수신이메일') || '(없음)';
            console.log(`${index + 1}. 상호명: ${company}`);
            console.log(`   이메일: ${email}`);
            console.log('-'.repeat(60));
        });

        console.log('\n📌 테스트 URL 예시:');
        if (rows.length > 0) {
            const firstCompany = rows[0].get('상호명');
            const firstEmail = rows[0].get('수신이메일');
            if (firstCompany) {
                console.log(`   http://localhost:3000/${encodeURIComponent(firstCompany)}`);
            }
            if (firstEmail) {
                console.log(`   http://localhost:3000/${encodeURIComponent(firstEmail)}`);
            }
        }

    } catch (error) {
        console.error('❌ 오류 발생:', error);
    }
}

checkVIPs();
