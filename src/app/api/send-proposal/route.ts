import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, name, phone, message, companyName, imageUrls, step } = body;

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

        if (step === 1) {
            // [Step 1] Send Assets to Customer + BCC Admin
            // Construct image grid html
            const imageGrid = imageUrls && imageUrls.length > 0
                ? `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px;">
            ${imageUrls.map((url: string) => `<img src="${url}" width="100%" style="border-radius:10px; object-fit: cover; aspect-ratio: 1/1;"/>`).join('')}
           </div>`
                : '';

            await transporter.sendMail({
                from: `"Irunica Sales Team" <${ADMIN_EMAIL}>`,
                to: email,
                bcc: 'sales@irunica.com',
                subject: `[IRUNICA] Private Label Assets for ${companyName}`,
                html: `
          <div style="font-family: sans-serif; color: #333;">
            <h2>Your Custom Visuals are Ready</h2>
            <p>Hello,</p>
            <p>Thank you for your interest in <strong>${companyName}</strong> private labeling solutions by Irunica.</p>
            <p>We have successfully rendered your brand assets. Please find the preview below:</p>
            
            ${imageGrid}

            <p style="margin-top: 30px;">
                <strong>Next Steps:</strong><br/>
                Our team handles everything from formulation to global logistics. 
                If you haven't already, please complete the inquiry form to discuss MOQ and Lead Time.
            </p>
            <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;"/>
            <p style="font-size: 12px; color: #888;">Irunica Co., Ltd. | K-Beauty ODM/OEM Expert</p>
          </div>
        `,
            });
            console.log(`[Email] Step 1 sent to ${email} (BCC: ${ADMIN_EMAIL})`);

        } else if (step === 2) {
            // [Step 2] Admin Notification Only
            await transporter.sendMail({
                from: `"Web Lead System" <${ADMIN_EMAIL}>`,
                to: ADMIN_EMAIL, // Send to self
                subject: `[New Lead] ${companyName} - ${name}`,
                html: `
          <div style="font-family: sans-serif;">
            <h3 style="color: #d97706;">New Landing Page Inquiry</h3>
            <p><strong>Company:</strong> ${companyName}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Message:</strong><br/>${message ? message.replace(/\n/g, '<br/>') : 'No message'}</p>
            <p style="font-size: 12px; color: #888; margin-top: 20px;">Source: VIP Conversion Funnel</p>
          </div>
        `,
            });
            console.log(`[Email] Step 2 lead alert sent to ${ADMIN_EMAIL}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Email sending failed:', error);
        // Even if it fails, we return 200 to not break the frontend flow (as requested "No loading")
        // In critical production, we might want to log this to Firestore as backup.
        return NextResponse.json({ success: false, error: 'Email service error' }, { status: 500 });
    }
}
