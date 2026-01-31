import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { buttonName, companyName, vipId } = body;

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const SALES_EMAIL = 'sales@irunica.com';
        const timestamp = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

        await transporter.sendMail({
            from: `"Irunica Tracker" <${process.env.EMAIL_USER}>`,
            to: SALES_EMAIL,
            subject: `[Click Alert] ${companyName} - ${buttonName}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h3 style="color: #d97706; margin-bottom: 20px;">🔔 Button Click Alert</h3>
                    <table style="border-collapse: collapse; width: 100%; max-width: 400px;">
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Button</td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${buttonName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Company</td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${companyName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">VIP ID</td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">${vipId || companyName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; color: #666;">Time (KST)</td>
                            <td style="padding: 8px;">${timestamp}</td>
                        </tr>
                    </table>
                    <p style="font-size: 12px; color: #888; margin-top: 20px;">
                        This visitor showed high intent. Consider reaching out proactively.
                    </p>
                </div>
            `,
        });

        console.log(`[Track] ${buttonName} clicked by ${companyName}`);
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Track click failed:', error);
        // Don't block user experience even if tracking fails
        return NextResponse.json({ success: false }, { status: 200 });
    }
}
