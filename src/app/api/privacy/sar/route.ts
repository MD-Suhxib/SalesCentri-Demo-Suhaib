import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_LEGAL_ENTITY_NAME = "Sales Centri AI LLC";
const DEFAULT_PRIMARY_OFFICE =
    "Sales Centri AI LLC\n1309 Coffeen Avenue, STE 1200\nSheridan, Wyoming 82801\nUnited States";
const DEFAULT_REGISTERED_OFFICE =
    "Sales Centri AI LLC\n1209 Orange Street,\nWilmington, Delaware 19801\nCounty of New Castle\nUnited States";
const DEFAULT_HOSTING_REGIONS = "United States (primary), European Union (replica)";
const DEFAULT_UNSUBSCRIBE_LINK = "https://salescentri.com/privacy/unsubscribe";
const DEFAULT_BRAND_NAME = "SalesCentri";
const DEFAULT_LOGO_URL = "https://salescentri.com/saleslogo.png";
const DEFAULT_SITE_URL = "https://salescentri.com";
const DEFAULT_PRIVACY_CENTER_URL = "https://salescentri.com/privacy/management";
const DEFAULT_SUPPORT_EMAIL = "privacy@salescentri.com";

function assertSmtpConfig() {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw new Error("SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS.");
    }
}

function buildEmailContent() {
    const legalEntity = process.env.PRIVACY_LEGAL_ENTITY_NAME ?? DEFAULT_LEGAL_ENTITY_NAME;
    const primaryOffice = process.env.PRIVACY_PRIMARY_ADDRESS ?? DEFAULT_PRIMARY_OFFICE;
    const registeredOffice = process.env.PRIVACY_REGISTERED_ADDRESS ?? DEFAULT_REGISTERED_OFFICE;
    const hostingRegions = process.env.PRIVACY_HOSTING_REGIONS ?? DEFAULT_HOSTING_REGIONS;
    const unsubscribeLink = process.env.PRIVACY_UNSUBSCRIBE_LINK ?? DEFAULT_UNSUBSCRIBE_LINK;
    const fromEmail = process.env.SMTP_FROM_EMAIL ?? process.env.PRIVACY_FROM_EMAIL ?? "noreply@salescentri.com";
    const fromName = process.env.SMTP_FROM_NAME ?? process.env.PRIVACY_FROM_NAME ?? DEFAULT_BRAND_NAME;
    const logoUrl = process.env.PRIVACY_LOGO_URL ?? DEFAULT_LOGO_URL;
    const siteUrl = process.env.PRIVACY_SITE_URL ?? DEFAULT_SITE_URL;
    const privacyCenterUrl = process.env.PRIVACY_CENTER_URL ?? DEFAULT_PRIVACY_CENTER_URL;
    const supportEmail = process.env.PRIVACY_SUPPORT_EMAIL ?? DEFAULT_SUPPORT_EMAIL;

    const subject = "Notice on Processing of Business Contact Data (Not an ad)";

    const linesText = [
        "We prioritize privacy and clarity. This message informs you that your professional contact details appear in our business-to-business database. Below we explain how we handle them and what choices you have.",
        "",
        "Who we are",
        "",
        "SalesCentri provides sales automation and AI-powered prospecting tools to help organizations reach relevant B2B contacts.",
        "",
        `Registered entity: ${legalEntity}`,
        "Primary Office:",
        primaryOffice,
        "",
        "Registered Office:",
        registeredOffice,
        "Data Protection Officer: privacy@salescentri.com",
        "",
        "Why we process your data and our legal grounds",
        "",
        "We handle professional contact data to help customers:",
        "- Identify and qualify potential B2B prospects and keep records accurate.",
        "- Conduct lawful direct outreach for sales, marketing, and recruiting.",
        "- Enrich CRM systems, score and route leads, and streamline go-to-market operations.",
        "- Deliver AI-driven recommendations and personalization to improve relevance.",
        "",
        "Legal bases depend on jurisdiction, including our legitimate business interests and those of our customers, balanced against your rights. In some U.S. states, use of this data may be considered a “sale,” “share,” or “targeted advertising”; you can opt out. In India, we rely on consent or legitimate uses as applicable under the Digital Personal Data Protection Act, 2023.",
        "",
        "What we collect",
        "",
        "We focus on professional or work-related details:",
        "- Name.",
        "- Business email and phone number (including freemail domains used for work).",
        "- Company, job title, department/seniority, and office location.",
        "- Public professional profiles and links.",
        "- Employment history and education where publicly available.",
        "- Signals and derived insights, such as potential interest in certain B2B offerings.",
        "",
        "We do not knowingly collect sensitive personal information for these purposes.",
        "",
        "Where we obtain data",
        "",
        "We compile and validate data from:",
        "- Features within our services where users contribute business contact info consistent with our terms.",
        "- Public sources and openly available web pages discovered through large-scale web indexing.",
        "- Reputable third-party data providers and partners.",
        "- Customer submissions and integrations.",
        "- Internal quality checks and model-driven normalization.",
        "",
        "How we share information",
        "",
        "Under contracts and applicable law, we may disclose business-contact data to:",
        "- Customers for lawful B2B sales, marketing, and recruiting activities.",
        "- Service providers acting on our instructions to operate and secure our platform.",
        "- Integration partners that help deliver our services.",
        "",
        "Recipients must safeguard the data and use it only for permitted purposes.",
        "",
        "Use of AI and automation",
        "",
        "We apply machine learning to:",
        "- Clean, enrich, and deduplicate records; improve completeness and accuracy.",
        "- Suggest relevant contacts, timing, and message variants for outreach.",
        "- Assist with lead scoring, routing, and campaign optimization.",
        "",
        "These automations support prospecting only and are not used to make decisions with legal or similarly significant impact. Human review governs consequential outcomes.",
        "",
        "International transfers and safeguards",
        "",
        `We may process and store data in ${hostingRegions}. Where required, we use appropriate transfer tools (such as Standard Contractual Clauses) and implement technical and organizational safeguards, including encryption and access controls.`,
        "",
        "Your rights and options",
        "",
        "Depending on your location, you may be able to:",
        "- Access, correct, or delete your data.",
        "- Object to or restrict processing.",
        "- Opt out of “sale,” “sharing,” or targeted advertising.",
        "- Opt out of certain profiling for marketing.",
        "- Request a copy (portability).",
        "- Complain to your relevant supervisory authority.",
        "",
        "How to exercise your rights",
        "",
        "The quickest route is our Privacy Center on our website. If you cannot use it, email privacy@salescentri.com with your request and the email address(es) to locate your record. We will verify your identity and respond within required timeframes. Authorized agents may submit requests where permitted.",
        "",
        "Retention",
        "",
        "We keep business-contact data only as long as needed for the purposes above or to comply with legal obligations. If you request deletion or object, we will act unless we must retain limited data (for example, in a do-not-contact or suppression list) to honor your preferences.",
        "",
        "Learn more",
        "",
        "See our Privacy Policy and Privacy/Trust Center on our website, or contact privacy@salescentri.com with questions.",
        "",
        "Unsubscribe",
        "",
        `To stop receiving notices or opt out of sale/sharing/targeted advertising, use the unsubscribe option below or email privacy@salescentri.com with “UNSUBSCRIBE” in the subject line.`,
        unsubscribeLink,
    ];

    const textBody = linesText.join("\n");

    const linesHtml = [
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
        `<p style="line-height: 1.7; font-size: 15px;">We prioritize privacy and clarity. This message informs you that your professional contact details appear in our business-to-business database. Below we explain how we handle them and what choices you have.</p>`,
        `<h2 style="margin-top: 24px; color: #58A6FF;">Who we are</h2>`,
        `<p style="line-height: 1.7;">SalesCentri provides sales automation and AI-powered prospecting tools to help organizations reach relevant B2B contacts.</p>`,
        `<div style="line-height: 1.7; white-space: pre-line; background: rgba(240,246,252,0.04); border-left: 3px solid #58A6FF; padding: 16px; border-radius: 12px;">`,
        `<strong>Registered entity:</strong> ${legalEntity}\n\n`,
        `<strong>Primary Office</strong>\n${primaryOffice}\n\n`,
        `<strong>Registered Office</strong>\n${registeredOffice}\n\n`,
        `<strong>Data Protection Officer:</strong> <a href="mailto:${supportEmail}" style="color: #58A6FF;">${supportEmail}</a>`,
        `</div>`,
        `<h3 style="margin-top: 24px; color: #58A6FF;">Why we process your data and our legal grounds</h3>`,
        `<ul style="line-height: 1.7; padding-left: 22px; margin: 16px 0;">`,
        `<li style="margin-bottom: 6px;">Identify and qualify potential B2B prospects and keep records accurate.</li>`,
        `<li style="margin-bottom: 6px;">Conduct lawful direct outreach for sales, marketing, and recruiting.</li>`,
        `<li style="margin-bottom: 6px;">Enrich CRM systems, score and route leads, and streamline go-to-market operations.</li>`,
        `<li style="margin-bottom: 6px;">Deliver AI-driven recommendations and personalization to improve relevance.</li>`,
        `</ul>`,
        `<p style="line-height: 1.7;">Legal bases depend on jurisdiction, including our legitimate business interests and those of our customers, balanced against your rights. In some U.S. states, use of this data may be considered a “sale,” “share,” or “targeted advertising”; you can opt out. In India, we rely on consent or legitimate uses as applicable under the Digital Personal Data Protection Act, 2023.</p>`,
        `<h3 style="margin-top: 24px; color: #58A6FF;">What we collect</h3>`,
        `<ul style="line-height: 1.7; padding-left: 22px; margin: 16px 0;">`,
        `<li style="margin-bottom: 6px;">Name.</li>`,
        `<li style="margin-bottom: 6px;">Business email and phone number (including freemail domains used for work).</li>`,
        `<li style="margin-bottom: 6px;">Company, job title, department/seniority, and office location.</li>`,
        `<li style="margin-bottom: 6px;">Public professional profiles and links.</li>`,
        `<li style="margin-bottom: 6px;">Employment history and education where publicly available.</li>`,
        `<li style="margin-bottom: 6px;">Signals and derived insights, such as potential interest in certain B2B offerings.</li>`,
        `</ul>`,
        `<p style="line-height: 1.7;">We do not knowingly collect sensitive personal information for these purposes.</p>`,
        `<h3 style="margin-top: 24px; color: #58A6FF;">Where we obtain data</h3>`,
        `<ul style="line-height: 1.7; padding-left: 22px; margin: 16px 0;">`,
        `<li style="margin-bottom: 6px;">Features within our services where users contribute business contact info consistent with our terms.</li>`,
        `<li style="margin-bottom: 6px;">Public sources and openly available web pages discovered through large-scale web indexing.</li>`,
        `<li style="margin-bottom: 6px;">Reputable third-party data providers and partners.</li>`,
        `<li style="margin-bottom: 6px;">Customer submissions and integrations.</li>`,
        `<li style="margin-bottom: 6px;">Internal quality checks and model-driven normalization.</li>`,
        `</ul>`,
        `<h3 style="margin-top: 24px; color: #58A6FF;">How we share information</h3>`,
        `<p style="line-height: 1.7;">Under contracts and applicable law, we may disclose business-contact data to:</p>`,
        `<ul style="line-height: 1.7; padding-left: 22px; margin: 16px 0;">`,
        `<li style="margin-bottom: 6px;">Customers for lawful B2B sales, marketing, and recruiting activities.</li>`,
        `<li style="margin-bottom: 6px;">Service providers acting on our instructions to operate and secure our platform.</li>`,
        `<li style="margin-bottom: 6px;">Integration partners that help deliver our services.</li>`,
        `</ul>`,
        `<p style="line-height: 1.7;">Recipients must safeguard the data and use it only for permitted purposes.</p>`,
        `<h3 style="margin-top: 24px; color: #58A6FF;">Use of AI and automation</h3>`,
        `<ul style="line-height: 1.7; padding-left: 22px; margin: 16px 0;">`,
        `<li style="margin-bottom: 6px;">Clean, enrich, and deduplicate records; improve completeness and accuracy.</li>`,
        `<li style="margin-bottom: 6px;">Suggest relevant contacts, timing, and message variants for outreach.</li>`,
        `<li style="margin-bottom: 6px;">Assist with lead scoring, routing, and campaign optimization.</li>`,
        `</ul>`,
        `<p style="line-height: 1.7;">These automations support prospecting only and are not used to make decisions with legal or similarly significant impact. Human review governs consequential outcomes.</p>`,
        `<h3 style="margin-top: 24px; color: #58A6FF;">International transfers and safeguards</h3>`,
        `<p style="line-height: 1.7;">We may process and store data in ${hostingRegions}. Where required, we use appropriate transfer tools (such as Standard Contractual Clauses) and implement technical and organizational safeguards, including encryption and access controls.</p>`,
        `<h3 style="margin-top: 24px; color: #58A6FF;">Your rights and options</h3>`,
        `<ul style="line-height: 1.7; padding-left: 22px; margin: 16px 0;">`,
        `<li style="margin-bottom: 6px;">Access, correct, or delete your data.</li>`,
        `<li style="margin-bottom: 6px;">Object to or restrict processing.</li>`,
        `<li style="margin-bottom: 6px;">Opt out of “sale,” “sharing,” or targeted advertising.</li>`,
        `<li style="margin-bottom: 6px;">Opt out of certain profiling for marketing.</li>`,
        `<li style="margin-bottom: 6px;">Request a copy (portability).</li>`,
        `<li style="margin-bottom: 6px;">Complain to your relevant supervisory authority.</li>`,
        `</ul>`,
        `<h3 style="margin-top: 24px; color: #58A6FF;">How to exercise your rights</h3>`,
        `<p style="line-height: 1.7;">The quickest route is our Privacy Center on our website. If you cannot use it, email <a href="mailto:${supportEmail}" style="color: #58A6FF;">${supportEmail}</a> with your request and the email address(es) to locate your record. We will verify your identity and respond within required timeframes. Authorized agents may submit requests where permitted.</p>`,
        `<div style="text-align: center; margin: 28px 0;">`,
        `<a href="${privacyCenterUrl}" style="display: inline-block; padding: 14px 32px; border-radius: 999px; background: linear-gradient(135deg, #58A6FF 0%, #A5A2FF 100%); color: #0D1117; font-weight: 600; text-decoration: none; box-shadow: 0 12px 30px rgba(88,166,255,0.35);">Open Privacy Center</a>`,
        `</div>`,
        `<h3 style="margin-top: 24px; color: #58A6FF;">Retention</h3>`,
        `<p style="line-height: 1.7;">We keep business-contact data only as long as needed for the purposes above or to comply with legal obligations. If you request deletion or object, we will act unless we must retain limited data (for example, in a do-not-contact or suppression list) to honor your preferences.</p>`,
        `<h3 style="margin-top: 24px; color: #58A6FF;">Learn more</h3>`,
        `<p style="line-height: 1.7;">See our Privacy Policy and Privacy/Trust Center on our website, or contact <a href="mailto:${supportEmail}" style="color: #58A6FF;">${supportEmail}</a> with questions.</p>`,
        `<h3 style="margin-top: 24px; color: #58A6FF;">Unsubscribe</h3>`,
        `<p style="line-height: 1.7;">To stop receiving notices or opt out of sale/sharing/targeted advertising, use the unsubscribe option below or email <a href="mailto:${supportEmail}" style="color: #58A6FF;">${supportEmail}</a> with “UNSUBSCRIBE” in the subject line.</p>`,
        `<p style="line-height: 1.6;"><a href="${unsubscribeLink}" style="color: #58A6FF;">${unsubscribeLink}</a></p>`,
        `<div style="margin-top: 32px; padding: 18px; background: rgba(88,166,255,0.08); border-radius: 16px; text-align: center;">`,
        `<p style="margin: 0; font-weight: 600; color: #58A6FF;">${fromName} Privacy Office</p>`,
        `<p style="margin: 6px 0 0 0; color: #8B949E; font-size: 13px;">This email was generated automatically in response to a data-access request submitted through our Privacy Center.</p>`,
        `</div>`,
        `</div>`,
        `</div>`,
        `<p style="margin-top: 24px; font-size: 12px; color: #8B949E; text-align: center;">© ${new Date().getFullYear()} ${fromName}. All rights reserved.</p>`,
        `</div>`,
    ];

    const htmlBody = linesHtml.join("");

    return { subject, textBody, htmlBody, fromEmail, fromName };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const email = typeof body?.email === "string" ? body.email.trim() : "";

        if (!email || !emailRegex.test(email)) {
            return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
        }

        assertSmtpConfig();

        const { subject, textBody, htmlBody, fromEmail, fromName } = buildEmailContent();

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

        await transporter.sendMail({
            from: `${fromName} <${fromEmail}>`,
            to: email,
            subject,
            text: textBody,
            html: htmlBody,
        });

        return NextResponse.json({
            success: true,
            message: "Data access request received. A detailed email notice has been sent to your inbox.",
        });
    } catch (error) {
        console.error("Failed to process data access request:", error);
        return NextResponse.json({ error: "Failed to submit request. Please try again later." }, { status: 500 });
    }
}


