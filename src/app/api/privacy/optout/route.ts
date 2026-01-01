import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INTERNAL_NOTIFY_EMAIL = "no-reply@salescentri.com";

function assertSmtpConfig() {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw new Error("SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS.");
    }
}

function buildUserConfirmationEmail(email: string, submittedAt: string) {
    const fromEmail = process.env.SMTP_FROM_EMAIL ?? process.env.SMTP_USER ?? INTERNAL_NOTIFY_EMAIL;
    const fromName = process.env.SMTP_FROM_NAME ?? "SalesCentri Privacy";
    const siteUrl = process.env.PRIVACY_SITE_URL ?? "https://salescentri.com";
    const logoUrl = process.env.PRIVACY_LOGO_URL ?? "https://salescentri.com/saleslogo.png";
    const supportEmail = process.env.PRIVACY_SUPPORT_EMAIL ?? "privacy@salescentri.com";

    const subject = "Your Opt-Out Request Has Been Received";

    const textBody = [
        "Thank you for contacting SalesCentri Privacy Center.",
        "",
        "We have received your request to stop all future communication from SalesCentri.",
        "",
        "What happens next:",
        "- Your email address will be marked as 'Do Not Contact' in our database.",
        "- You will no longer receive sales or marketing communications from us.",
        "- Your request will be processed within 5 business days.",
        "",
        "Please note: Your information will remain in our database but will be flagged to prevent any future outreach.",
        "",
        "If you have any questions or need to update your preferences, please contact us at privacy@salescentri.com.",
        "",
        `Request submitted: ${new Date(submittedAt).toLocaleString()}`,
        "",
        "Thank you for your patience.",
        "",
        "SalesCentri Privacy Team",
    ].join("\n");

    const htmlBody = [
        `<div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background-color: #0D1117; color: #F0F6FC; padding: 32px;">`,
        `<div style="text-align: center; margin-bottom: 24px;">`,
        `<a href="${siteUrl}" style="display: inline-flex; align-items: center; gap: 12px; text-decoration: none;">`,
        `<span style="display: inline-block; background: radial-gradient(circle at top, rgba(88,166,255,0.25), rgba(10,21,40,0.6)); border-radius: 12px; padding: 12px;">`,
        `<img src="${logoUrl}" alt="${fromName} logo" style="height: 48px; width: auto;" />`,
        `</span>`,
        `<span style="font-size: 24px; font-weight: 700; color: #F0F6FC;">${fromName}</span>`,
        `</a>`,
        `</div>`,
        `<div style="background: linear-gradient(145deg, rgba(22,27,34,0.95), rgba(13,17,23,0.95)); border-radius: 20px; padding: 28px; border: 1px solid rgba(88,166,255,0.18); box-shadow: 0 20px 45px rgba(0,0,0,0.45);">`,
        `<h2 style="color: #58A6FF; margin-top: 0;">Your Opt-Out Request Has Been Received</h2>`,
        `<p style="line-height: 1.7; font-size: 15px;">Thank you for contacting SalesCentri Privacy Center.</p>`,
        `<p style="line-height: 1.7; font-size: 15px;">We have received your request to stop all future communication from SalesCentri.</p>`,
        `<h3 style="margin-top: 24px; color: #58A6FF;">What happens next:</h3>`,
        `<ul style="line-height: 1.7; padding-left: 22px; margin: 16px 0;">`,
        `<li style="margin-bottom: 6px;">Your email address will be marked as 'Do Not Contact' in our database.</li>`,
        `<li style="margin-bottom: 6px;">You will no longer receive sales or marketing communications from us.</li>`,
        `<li style="margin-bottom: 6px;">Your request will be processed within 5 business days.</li>`,
        `</ul>`,
        `<div style="margin: 24px 0; padding: 16px; background: rgba(250, 204, 21, 0.1); border-left: 3px solid #FACC15; border-radius: 8px;">`,
        `<p style="margin: 0; line-height: 1.7; font-size: 14px; color: #FACC15;"><strong>Please note:</strong> Your information will remain in our database but will be flagged to prevent any future outreach.</p>`,
        `</div>`,
        `<p style="line-height: 1.7; font-size: 15px;">If you have any questions or need to update your preferences, please contact us at <a href="mailto:${supportEmail}" style="color: #58A6FF;">${supportEmail}</a>.</p>`,
        `<div style="margin-top: 24px; padding: 16px; background: rgba(88,166,255,0.08); border-radius: 12px; border-left: 3px solid #58A6FF;">`,
        `<p style="margin: 0; font-size: 13px; color: #8B949E;">Request submitted: ${new Date(submittedAt).toLocaleString()}</p>`,
        `</div>`,
        `<p style="margin-top: 24px; line-height: 1.7; font-size: 15px;">Thank you for your patience.</p>`,
        `<p style="margin-top: 16px; line-height: 1.7; font-size: 15px;"><strong>SalesCentri Privacy Team</strong></p>`,
        `</div>`,
        `<p style="margin-top: 24px; font-size: 12px; color: #8B949E; text-align: center;">© ${new Date().getFullYear()} ${fromName}. All rights reserved.</p>`,
        `</div>`,
    ].join("");

    return { subject, textBody, htmlBody, fromEmail, fromName };
}

async function sendNotification(email: string, submittedAt: string) {
    assertSmtpConfig();

    const fromEmail = process.env.SMTP_FROM_EMAIL ?? process.env.SMTP_USER ?? INTERNAL_NOTIFY_EMAIL;
    const fromName = process.env.SMTP_FROM_NAME ?? "SalesCentri Privacy";
    const recipient = process.env.PRIVACY_NOTIFY_EMAIL ?? INTERNAL_NOTIFY_EMAIL;

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.office365.com",
        port: parseInt(process.env.SMTP_PORT || "587", 10),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        tls: {
            ciphers: "SSLv3",
            rejectUnauthorized: false,
        },
    });

    const subject = "Privacy Center Submission: Opt-Out Request";
    const textBody = [
        "A new opt-out request has been submitted via the Privacy Center.",
        "",
        `User Email: ${email}`,
        "Requested Action: Stop All Future Communication (Opt-Out)",
        `Submitted At: ${submittedAt}`,
    ].join("\n");

    await transporter.sendMail({
        from: `${fromName} <${fromEmail}>`,
        to: recipient,
        subject,
        text: textBody,
        html: textBody.replace(/\n/g, "<br>"),
    });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const email = typeof body?.email === "string" ? body.email.trim() : "";

        if (!email || !emailRegex.test(email)) {
            return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
        }

        const submittedAt = new Date().toISOString();
        
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.office365.com",
            port: parseInt(process.env.SMTP_PORT || "587", 10),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                ciphers: "SSLv3",
                rejectUnauthorized: false,
            },
        });

        // Send user confirmation email
        const { subject, textBody, htmlBody, fromEmail, fromName } = buildUserConfirmationEmail(email, submittedAt);
        await transporter.sendMail({
            from: `${fromName} <${fromEmail}>`,
            to: email,
            subject,
            text: textBody,
            html: htmlBody,
        });

        // Send internal notification
        await sendNotification(email, submittedAt);

        return NextResponse.json({
            success: true,
            message: "Opt-out request received. Our privacy team will mark your profile as Do Not Contact.",
        });
    } catch (error) {
        console.error("Failed to process opt-out request:", error);
        return NextResponse.json({ error: "Failed to submit request. Please try again later." }, { status: 500 });
    }
}


