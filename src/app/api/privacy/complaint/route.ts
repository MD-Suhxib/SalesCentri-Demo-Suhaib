import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INTERNAL_NOTIFY_EMAIL = "no-reply@salescentri.com";

function assertSmtpConfig() {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw new Error("SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS.");
    }
}

function sanitize(input: unknown): string {
    if (typeof input !== "string") return "";
    return input.trim();
}

function buildUserConfirmationEmail(email: string, fullName: string, submittedAt: string) {
    const fromEmail = process.env.SMTP_FROM_EMAIL ?? process.env.SMTP_USER ?? INTERNAL_NOTIFY_EMAIL;
    const fromName = process.env.SMTP_FROM_NAME ?? "SalesCentri Privacy";
    const siteUrl = process.env.PRIVACY_SITE_URL ?? "https://salescentri.com";
    const logoUrl = process.env.PRIVACY_LOGO_URL ?? "https://salescentri.com/saleslogo.png";
    const supportEmail = process.env.PRIVACY_SUPPORT_EMAIL ?? "privacy@salescentri.com";

    const subject = "Your Privacy Complaint Has Been Received";

    const textBody = [
        `Dear ${fullName},`,
        "",
        "Thank you for contacting SalesCentri Privacy Center.",
        "",
        "We have received your privacy complaint or rectification request. Our privacy team takes all concerns seriously and will review your submission promptly.",
        "",
        "What happens next:",
        "- Our Data Protection Officer will review your complaint within 5 business days.",
        "- We may contact you at the email address provided to request additional information or clarification.",
        "- We will investigate the matter and respond with our findings and any actions taken.",
        "- You will receive updates on the status of your complaint via email.",
        "",
        "If you have any questions or need to provide additional information, please contact us at privacy@salescentri.com and reference your complaint submission.",
        "",
        `Request submitted: ${new Date(submittedAt).toLocaleString()}`,
        "",
        "Thank you for bringing this matter to our attention.",
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
        `<h2 style="color: #58A6FF; margin-top: 0;">Your Privacy Complaint Has Been Received</h2>`,
        `<p style="line-height: 1.7; font-size: 15px;">Dear ${fullName},</p>`,
        `<p style="line-height: 1.7; font-size: 15px;">Thank you for contacting SalesCentri Privacy Center.</p>`,
        `<p style="line-height: 1.7; font-size: 15px;">We have received your privacy complaint or rectification request. Our privacy team takes all concerns seriously and will review your submission promptly.</p>`,
        `<h3 style="margin-top: 24px; color: #58A6FF;">What happens next:</h3>`,
        `<ul style="line-height: 1.7; padding-left: 22px; margin: 16px 0;">`,
        `<li style="margin-bottom: 6px;">Our Data Protection Officer will review your complaint within 5 business days.</li>`,
        `<li style="margin-bottom: 6px;">We may contact you at the email address provided to request additional information or clarification.</li>`,
        `<li style="margin-bottom: 6px;">We will investigate the matter and respond with our findings and any actions taken.</li>`,
        `<li style="margin-bottom: 6px;">You will receive updates on the status of your complaint via email.</li>`,
        `</ul>`,
        `<p style="line-height: 1.7; font-size: 15px;">If you have any questions or need to provide additional information, please contact us at <a href="mailto:${supportEmail}" style="color: #58A6FF;">${supportEmail}</a> and reference your complaint submission.</p>`,
        `<div style="margin-top: 24px; padding: 16px; background: rgba(88,166,255,0.08); border-radius: 12px; border-left: 3px solid #58A6FF;">`,
        `<p style="margin: 0; font-size: 13px; color: #8B949E;">Request submitted: ${new Date(submittedAt).toLocaleString()}</p>`,
        `</div>`,
        `<p style="margin-top: 24px; line-height: 1.7; font-size: 15px;">Thank you for bringing this matter to our attention.</p>`,
        `<p style="margin-top: 16px; line-height: 1.7; font-size: 15px;"><strong>SalesCentri Privacy Team</strong></p>`,
        `</div>`,
        `<p style="margin-top: 24px; font-size: 12px; color: #8B949E; text-align: center;">© ${new Date().getFullYear()} ${fromName}. All rights reserved.</p>`,
        `</div>`,
    ].join("");

    return { subject, textBody, htmlBody, fromEmail, fromName };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const fullName = sanitize(body?.fullName);
        const email = sanitize(body?.email);
        const phone = sanitize(body?.phone);
        const mailingAddress = sanitize(body?.mailingAddress);
        const role = sanitize(body?.role);
        const company = sanitize(body?.company);
        const userId = sanitize(body?.userId);
        const incidentDescription = sanitize(body?.incidentDescription);
        const incidentDates = sanitize(body?.incidentDates);
        const dataInvolved = sanitize(body?.dataInvolved);
        const servicesInvolved = sanitize(body?.servicesInvolved);
        const concernReason = sanitize(body?.concernReason);
        const desiredOutcome = sanitize(body?.desiredOutcome);
        const evidence = sanitize(body?.evidence);
        const previousSteps = sanitize(body?.previousSteps);
        const declarationAccepted = Boolean(body?.declarationAccepted);

        if (!fullName) {
            return NextResponse.json({ error: "Please provide your full name." }, { status: 400 });
        }
        if (!email || !emailRegex.test(email)) {
            return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
        }
        if (!mailingAddress) {
            return NextResponse.json({ error: "Please provide a mailing address." }, { status: 400 });
        }
        if (!incidentDescription) {
            return NextResponse.json({ error: "Please describe the incident." }, { status: 400 });
        }
        if (!incidentDates) {
            return NextResponse.json({ error: "Please specify when the incident occurred." }, { status: 400 });
        }
        if (!dataInvolved) {
            return NextResponse.json({ error: "Please mention the type of data involved." }, { status: 400 });
        }
        if (!servicesInvolved) {
            return NextResponse.json({ error: "Please specify the SalesCentri service involved." }, { status: 400 });
        }
        if (!concernReason) {
            return NextResponse.json({ error: "Please explain why this is a privacy concern." }, { status: 400 });
        }
        if (!desiredOutcome) {
            return NextResponse.json({ error: "Please state your desired outcome." }, { status: 400 });
        }
        if (!declarationAccepted) {
            return NextResponse.json({ error: "Please confirm that the information provided is accurate." }, { status: 400 });
        }

        assertSmtpConfig();

        const submittedAt = new Date().toISOString();

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

        // Send user confirmation email
        const { subject: userSubject, textBody: userTextBody, htmlBody: userHtmlBody, fromEmail: userFromEmail, fromName: userFromName } = buildUserConfirmationEmail(email, fullName, submittedAt);
        await transporter.sendMail({
            from: `${userFromName} <${userFromEmail}>`,
            to: email,
            subject: userSubject,
            text: userTextBody,
            html: userHtmlBody,
        });

        // Send internal notification
        const subject = "Privacy Center Submission: Complaint / Rectification Request";

        const sections = [
            "Complainant Information",
            `• Full Name: ${fullName}`,
            `• Email: ${email}`,
            `• Phone: ${phone || "Not provided"}`,
            `• Mailing Address: ${mailingAddress}`,
            `• Role/Title: ${role || "Not provided"}`,
            `• Company: ${company || "Not provided"}`,
            `• Account Credentials / User ID: ${userId || "Not provided"}`,
            "",
            "Details of the Privacy Concern",
            `• Incident Description: ${incidentDescription}`,
            `• Incident Dates / Timeframe: ${incidentDates}`,
            `• Data Involved: ${dataInvolved}`,
            `• SalesCentri Services Involved: ${servicesInvolved}`,
            `• Why this is a Privacy Concern: ${concernReason}`,
            `• Desired Outcome: ${desiredOutcome}`,
            "",
            "Supporting Information",
            `• Evidence: ${evidence || "Not provided"}`,
            `• Previous Steps Taken: ${previousSteps || "Not provided"}`,
            "",
            `Declaration Confirmed: ${declarationAccepted ? "Yes" : "No"}`,
            `Submitted At: ${submittedAt}`,
        ];

        const textBody = sections.join("\n");
        const htmlBody = sections
            .map((line) => {
                if (!line) return "<br>";
                if (line === "Complainant Information" || line === "Details of the Privacy Concern" || line === "Supporting Information") {
                    return `<h3 style="margin-top: 16px; margin-bottom: 8px; font-size: 16px;">${line}</h3>`;
                }
                return `<p style="margin: 2px 0; font-size: 14px; line-height: 1.5;">${line}</p>`;
            })
            .join("");

        await transporter.sendMail({
            from: `${fromName} <${fromEmail}>`,
            to: recipient,
            subject,
            text: textBody,
            html: `<div style="font-family: Arial, sans-serif; color: #0F172A;">${htmlBody}</div>`,
        });

        return NextResponse.json({
            success: true,
            message: "Complaint received. Our privacy team will review it shortly.",
        });
    } catch (error) {
        console.error("Failed to process complaint:", error);
        return NextResponse.json({ error: "Failed to submit complaint. Please try again later." }, { status: 500 });
    }
}


