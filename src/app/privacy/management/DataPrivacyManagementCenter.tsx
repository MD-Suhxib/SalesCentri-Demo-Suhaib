"use client";

import { useCallback, useMemo, useState, useRef, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Ban, Trash2, Search, FileEdit, ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ActionId = "optout" | "erase" | "sar" | "complaint";

type SubmitActionId = Exclude<ActionId, "complaint">;

type PrivacyAction = {
    id: ActionId;
    title: string;
    description: string;
    icon: LucideIcon;
    iconColor: string;
    endpoint?: string;
    successCopy?: string;
    requiresConfirmation?: boolean;
    ctaLabel?: string;
};

const PRIVACY_ACTIONS: PrivacyAction[] = [
    {
        id: "optout",
        title: "Stop All Future Communication",
        description:
            "Right to Opt-Out: Immediately stops all sales and marketing outreach. You will remain in the database but marked as Do Not Contact.",
        icon: Ban,
        iconColor: "text-red-500",
        endpoint: "/api/privacy/optout",
        successCopy: "You have successfully opted out of all future communication.",
    },
    {
        id: "erase",
        title: "Remove My Information (Erasure)",
        description:
            "Right to Be Forgotten: Initiates a formal request to permanently delete all personal identifying data. Requires explicit confirmation.",
        icon: Trash2,
        iconColor: "text-slate-500",
        endpoint: "/api/privacy/delete",
        successCopy: "We have received your erasure request. Our privacy team will begin processing it immediately.",
        requiresConfirmation: true,
    },
    {
        id: "sar",
        title: "Understand What Data Is Used",
        description:
            "Right to Access: Requests a detailed report of every piece of professional data we hold about you. Delivered via email within 30 days.",
        icon: Search,
        iconColor: "text-purple-500",
        endpoint: "/api/privacy/sar",
        successCopy: "Your data access request has been logged. Expect a comprehensive report via email within 30 days.",
    },
    {
        id: "complaint",
        title: "Raise a Complaint or Correction",
        description:
            "Right to Rectification/Complaint: Submit a secure form to correct inaccurate data or file a formal complaint with our DPO.",
        icon: FileEdit,
        iconColor: "text-amber-500",
        endpoint: "/api/privacy/complaint",
        successCopy: "Your complaint has been submitted. Our privacy office will contact you with next steps.",
        ctaLabel: "Open Secure Form",
    },
];

type RequestExecutor = (params: { endpoint: string; email: string; action: SubmitActionId }) => Promise<Response>;

const defaultExecutor: RequestExecutor = async ({ endpoint, email, action }) => {
    return fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, action }),
        cache: "no-store",
    });
};

export type DataPrivacyManagementCenterProps = {
    userName?: string | null;
    communicationStatus?: string | null;
    requestExecutor?: RequestExecutor;
};

type UiState = {
    loadingAction: ActionId | null;
    successAction: PrivacyAction | null;
    errorMessage: string | null;
    confirmationTarget: PrivacyAction | null;
    flippedCard: ActionId | null;
    emailInputs: Record<ActionId, string>;
    complaintForm: ComplaintFormState;
};

const INITIAL_STATE: UiState = {
    loadingAction: null,
    successAction: null,
    errorMessage: null,
    confirmationTarget: null,
    flippedCard: null,
    emailInputs: {
        optout: "",
        erase: "",
        sar: "",
        complaint: "",
    },
    complaintForm: {
        fullName: "",
        email: "",
        phone: "",
        mailingAddress: "",
        role: "",
        company: "",
        userId: "",
        incidentDescription: "",
        incidentDates: "",
        dataInvolved: "",
        servicesInvolved: "",
        concernReason: "",
        desiredOutcome: "",
        evidence: "",
        previousSteps: "",
        declarationAccepted: false,
    },
};

const statusClassMap: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
    paused: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
    inactive: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
};

const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

type ComplaintFormState = {
    fullName: string;
    email: string;
    phone: string;
    mailingAddress: string;
    role: string;
    company: string;
    userId: string;
    incidentDescription: string;
    incidentDates: string;
    dataInvolved: string;
    servicesInvolved: string;
    concernReason: string;
    desiredOutcome: string;
    evidence: string;
    previousSteps: string;
    declarationAccepted: boolean;
};

const validateComplaintForm = (form: ComplaintFormState): string | null => {
    if (!form.fullName.trim()) return "Please provide your full name.";
    if (!isValidEmail(form.email)) return "Please provide a valid email address.";
    if (!form.mailingAddress.trim()) return "Please provide a mailing address.";
    if (!form.incidentDescription.trim()) return "Please describe the incident.";
    if (!form.incidentDates.trim()) return "Please specify when the incident occurred.";
    if (!form.dataInvolved.trim()) return "Please mention the type of data involved.";
    if (!form.servicesInvolved.trim()) return "Please specify the SalesCentri service involved.";
    if (!form.concernReason.trim()) return "Please explain why this is a privacy concern.";
    if (!form.desiredOutcome.trim()) return "Please state your desired outcome.";
    if (!form.declarationAccepted) return "Please confirm that the information provided is accurate.";
    return null;
};

export function DataPrivacyManagementCenter({
    userName,
    communicationStatus,
    requestExecutor,
}: DataPrivacyManagementCenterProps) {
    const [uiState, setUiState] = useState<UiState>(INITIAL_STATE);
    const emailInputRefs = useRef<Record<ActionId, HTMLInputElement | null>>({
        optout: null,
        erase: null,
        sar: null,
        complaint: null,
    });

    const resolvedName = useMemo(() => {
        if (!userName) return "there";
        const trimmed = userName.trim();
        return trimmed.length ? trimmed : "there";
    }, [userName]);

    const statusLabel = useMemo(() => {
        if (!communicationStatus) return "Active";
        const value = communicationStatus.trim();
        return value.length ? value : "Active";
    }, [communicationStatus]);

    const statusToneKey = statusLabel.toLowerCase();
    const statusClasses = statusClassMap[statusToneKey] ?? statusClassMap.active;

    const executor = requestExecutor ?? defaultExecutor;
    const complaintAction = useMemo(
        () => PRIVACY_ACTIONS.find((action) => action.id === "complaint") ?? PRIVACY_ACTIONS[0],
        []
    );

    useEffect(() => {
        if (uiState.flippedCard) {
            const inputRef = emailInputRefs.current[uiState.flippedCard];
            if (inputRef) {
                setTimeout(() => inputRef.focus(), 300);
            }
        }
    }, [uiState.flippedCard]);

    // Force dark theme for Privacy Management Center
    useEffect(() => {
        // Set data attribute on document to force dark theme
        document.documentElement.setAttribute("data-privacy-theme", "dark");
        document.documentElement.style.colorScheme = "dark";
        
        // Force dark mode CSS variables
        const root = document.documentElement;
        root.style.setProperty("--background", "#010409");
        root.style.setProperty("--foreground", "#E2F1FF");
        root.style.setProperty("--border-color", "rgba(88, 166, 255, 0.18)");
        root.style.setProperty("--subtle-background", "rgba(12, 25, 46, 0.6)");
        root.style.setProperty("--muted-foreground", "#7DA6D9");
        root.style.setProperty("--primary", "#3B82F6");
        root.style.setProperty("--accent", "#2563EB");
        root.style.setProperty("--success", "#4ADE80");
        root.style.setProperty("--warning", "#FACC15");
        root.style.setProperty("--danger", "#F87171");
        root.style.setProperty("--surface", "rgba(10, 21, 40, 0.5)");
        root.style.setProperty("--surface-strong", "rgba(13, 23, 45, 0.65)");
        root.style.setProperty("--card", "rgba(12, 25, 46, 0.55)");
        root.style.setProperty("--card-foreground", "#E2F1FF");
        root.style.setProperty("--secondary", "rgba(22, 44, 84, 0.45)");
        root.style.setProperty("--muted", "rgba(18, 33, 60, 0.5)");
        root.style.setProperty("--border", "rgba(88, 166, 255, 0.25)");
        root.style.setProperty("--input", "rgba(19, 37, 70, 0.6)");
        root.style.setProperty("--ring", "#3B82F6");
        root.style.setProperty("--glass-shadow", "0 18px 40px rgba(3, 10, 24, 0.45)");
        root.style.setProperty("--glass-blur", "18px");
        
        // Force meta theme-color for mobile browsers
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (!themeColorMeta) {
            themeColorMeta = document.createElement("meta");
            themeColorMeta.setAttribute("name", "theme-color");
            document.head.appendChild(themeColorMeta);
        }
        themeColorMeta.setAttribute("content", "#0D1117");
        
        // Cleanup function to restore if component unmounts
        return () => {
            document.documentElement.removeAttribute("data-privacy-theme");
            document.documentElement.style.colorScheme = "";
            // Remove inline style overrides to restore CSS variable defaults
            const root = document.documentElement;
            root.style.removeProperty("--background");
            root.style.removeProperty("--foreground");
            root.style.removeProperty("--border-color");
            root.style.removeProperty("--subtle-background");
            root.style.removeProperty("--muted-foreground");
            root.style.removeProperty("--primary");
            root.style.removeProperty("--accent");
            root.style.removeProperty("--success");
            root.style.removeProperty("--warning");
            root.style.removeProperty("--danger");
            root.style.removeProperty("--surface");
            root.style.removeProperty("--card");
            root.style.removeProperty("--card-foreground");
            root.style.removeProperty("--secondary");
            root.style.removeProperty("--muted");
            root.style.removeProperty("--border");
            root.style.removeProperty("--input");
            root.style.removeProperty("--ring");
        };
    }, []);

    const handlePostAction = useCallback(
        async (action: PrivacyAction, email: string) => {
            if (!action.endpoint || !email || !isValidEmail(email)) {
                setUiState((prev) => ({
                    ...prev,
                    errorMessage: "Please enter a valid email address.",
                    loadingAction: null,
                    confirmationTarget: null,
                }));
                return;
            }

            setUiState((prev) => ({
                ...prev,
                loadingAction: action.id,
                errorMessage: null,
                flippedCard: null,
            }));

            try {
                const normalizedEmail = email.trim().toLowerCase();
                
                // Parallelize both requests to reduce delay
                const collectPromise = fetch("/api/privacy/collect", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: normalizedEmail,
                        selection: action.id,
                    }),
                    cache: "no-store",
                });

                const requestPromise = executor({
                    endpoint: action.endpoint,
                    email: normalizedEmail,
                    action: action.id as SubmitActionId,
                });

                const [collectResponse, response] = await Promise.all([collectPromise, requestPromise]);

                if (!collectResponse.ok) {
                    let message = "Unable to submit your request. Please try again.";
                    try {
                        const data = await collectResponse.json();
                        if (data?.error && typeof data.error === "string") {
                            message = data.error;
                        }
                    } catch {
                        // ignore JSON parse failure
                    }
                    throw new Error(message);
                }

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                setUiState({
                    loadingAction: null,
                    successAction: action,
                    errorMessage: null,
                    confirmationTarget: null,
                    flippedCard: null,
                    emailInputs: INITIAL_STATE.emailInputs,
                    complaintForm: INITIAL_STATE.complaintForm,
                });
            } catch (error) {
                console.error(error);
                setUiState((prev) => ({
                    ...prev,
                    loadingAction: null,
                    errorMessage:
                        "⚠️ Error: Unable to process request. Please refresh or contact privacy@salescentri.com.",
                    confirmationTarget: null,
                }));
            }
        },
        [executor]
    );

    const handleCardClick = useCallback(
        (action: PrivacyAction) => {
            if (uiState.loadingAction || uiState.successAction) return;

            if (uiState.flippedCard === action.id) {
                setUiState((prev) => ({ ...prev, flippedCard: null }));
                return;
            }

            setUiState((prev) => ({
                ...prev,
                flippedCard: action.id,
                errorMessage: null,
            }));
        },
        [uiState.loadingAction, uiState.successAction, uiState.flippedCard]
    );

    const handleComplaintFieldChange = useCallback(<K extends keyof ComplaintFormState>(field: K, value: ComplaintFormState[K]) => {
        setUiState((prev) => ({
            ...prev,
            complaintForm: {
                ...prev.complaintForm,
                [field]: value,
            },
            errorMessage: null,
        }));
    }, []);

    const closeComplaintForm = useCallback(() => {
        setUiState((prev) => ({
            ...prev,
            flippedCard: null,
        }));
    }, []);

    const handleEmailSubmit = useCallback(
        (action: PrivacyAction, email: string) => {
            if (!isValidEmail(email)) {
                setUiState((prev) => ({
                    ...prev,
                    errorMessage: "Please enter a valid email address.",
                }));
                return;
            }

            if (action.requiresConfirmation) {
                setUiState((prev) => ({
                    ...prev,
                    confirmationTarget: action,
                    errorMessage: null,
                }));
                return;
            }

            void handlePostAction(action, email);
        },
        [handlePostAction]
    );

    const handleEmailChange = useCallback((actionId: ActionId, value: string) => {
        setUiState((prev) => ({
            ...prev,
            emailInputs: {
                ...prev.emailInputs,
                [actionId]: value,
            },
            errorMessage: null,
        }));
    }, []);

    const handleComplaintSubmit = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const form = uiState.complaintForm;
            const validationMessage = validateComplaintForm(form);
            if (validationMessage) {
                setUiState((prev) => ({
                    ...prev,
                    errorMessage: validationMessage,
                }));
                return;
            }

            setUiState((prev) => ({
                ...prev,
                loadingAction: "complaint",
                errorMessage: null,
            }));

            try {
                const normalizedEmail = form.email.trim().toLowerCase();
                
                // Parallelize both requests to reduce delay
                const collectPromise = fetch("/api/privacy/collect", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: normalizedEmail,
                        selection: "complaint",
                    }),
                    cache: "no-store",
                });

                const responsePromise = fetch(complaintAction.endpoint ?? "/api/privacy/complaint", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...form,
                        email: normalizedEmail,
                    }),
                    cache: "no-store",
                });

                const [collectResponse, response] = await Promise.all([collectPromise, responsePromise]);

                if (!collectResponse.ok) {
                    let message = "Unable to submit your complaint. Please try again.";
                    try {
                        const data = await collectResponse.json();
                        if (data?.error && typeof data.error === "string") {
                            message = data.error;
                        }
                    } catch {
                        // ignore parse errors
                    }
                    throw new Error(message);
                }

                if (!response.ok) {
                    let message = "Unable to submit your complaint. Please try again.";
                    try {
                        const data = await response.json();
                        if (data?.error && typeof data.error === "string") {
                            message = data.error;
                        }
                    } catch {
                        // ignore parse errors
                    }
                    throw new Error(message);
                }

                setUiState({
                    loadingAction: null,
                    successAction: complaintAction,
                    errorMessage: null,
                    confirmationTarget: null,
                    flippedCard: null,
                    emailInputs: INITIAL_STATE.emailInputs,
                    complaintForm: INITIAL_STATE.complaintForm,
                });
            } catch (error) {
                console.error(error);
                setUiState((prev) => ({
                    ...prev,
                    loadingAction: null,
                    errorMessage:
                        error instanceof Error ? error.message : "Unable to submit your complaint. Please try again.",
                }));
            }
        },
        [complaintAction, uiState.complaintForm]
    );

    const closeModal = useCallback(() => {
        setUiState((prev) => ({ ...prev, confirmationTarget: null }));
    }, []);

    const confirmModal = useCallback(() => {
        if (uiState.confirmationTarget) {
            const email = uiState.emailInputs[uiState.confirmationTarget.id];
            void handlePostAction(uiState.confirmationTarget, email);
        }
    }, [handlePostAction, uiState.confirmationTarget, uiState.emailInputs]);

    const resetUiState = useCallback(() => {
        setUiState(INITIAL_STATE);
    }, []);

    if (uiState.successAction) {
        return (
            <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
                <div
                    className="rounded-3xl border p-10 text-center shadow-sm"
                    style={{
                        borderColor: "var(--success)",
                        background: "rgba(86, 211, 100, 0.1)",
                    }}
                >
                    <div className="text-5xl" aria-hidden="true">
                        ✅
                    </div>
                    <h2 className="mt-4 text-2xl font-semibold" style={{ color: "var(--success)" }}>
                        Request Confirmed
                    </h2>
                    <p className="mt-4 text-base" style={{ color: "var(--foreground)" }}>
                        {uiState.successAction.successCopy}
                    </p>
                    <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                        <button
                            type="button"
                            onClick={resetUiState}
                            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                            style={{
                                background: "var(--primary)",
                                outlineColor: "var(--primary)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = "0.9";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = "1";
                            }}
                        >
                            Submit Another Request
                        </button>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                            style={{
                                background: "var(--success)",
                                outlineColor: "var(--success)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = "0.9";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = "1";
                            }}
                        >
                            Return to SalesCentri Homepage
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main
            style={{
                background: "radial-gradient(circle at top, rgba(37, 99, 235, 0.18), rgba(1, 4, 9, 0.9) 45%, rgba(1, 4, 9, 1))",
                minHeight: "100vh",
            }}
        >
            <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
                <header className="space-y-6">
                    <div className="space-y-3">
                        <h1 className="text-3xl font-semibold sm:text-4xl" style={{ color: "var(--foreground)" }}>
                            Data & Privacy Management Center
                        </h1>
                        <h2 className="text-xl" style={{ color: "var(--muted-foreground)" }}>
                            Hello, <span className="font-medium" style={{ color: "var(--foreground)" }}>{resolvedName}</span>!
                        </h2>
                    </div>
                    <div
                        className="rounded-3xl border p-5 shadow-lg"
                        style={{
                            borderColor: "var(--border)",
                            background: "linear-gradient(145deg, rgba(12, 30, 60, 0.45), rgba(6, 18, 36, 0.65))",
                            backdropFilter: "blur(var(--glass-blur))",
                            WebkitBackdropFilter: "blur(var(--glass-blur))",
                            boxShadow: "var(--glass-shadow)",
                        }}
                    >
                        <p className="text-sm" style={{ color: "var(--primary)" }}>
                            Manage your privacy preferences securely. Click on any action card below to get started.
                        </p>
                    </div>
                </header>

                <section className="mt-10 space-y-6">
                    <div className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium ${statusClasses}`}>
                        <span className="mr-2 h-2 w-2 rounded-full bg-current" aria-hidden="true" />
                        Your Current Communication Status: {statusLabel}
                    </div>

                    {uiState.errorMessage ? (
                        <div
                            className="rounded-2xl border p-5 text-sm"
                            role="alert"
                            style={{
                                borderColor: "rgba(250, 204, 21, 0.4)",
                                background: "rgba(34, 26, 5, 0.55)",
                                backdropFilter: "blur(var(--glass-blur))",
                                WebkitBackdropFilter: "blur(var(--glass-blur))",
                                color: "var(--warning)",
                                boxShadow: "var(--glass-shadow)",
                            }}
                        >
                            {uiState.errorMessage}
                        </div>
                    ) : null}

                    <div className="grid gap-6 md:grid-cols-2" data-testid="privacy-action-grid">
                        {PRIVACY_ACTIONS.map((action) => {
                            const isLoading = uiState.loadingAction === action.id;
                            const isDisabled = Boolean(uiState.loadingAction) || Boolean(uiState.successAction);
                            const isFlipped = uiState.flippedCard === action.id;
                            const emailValue = uiState.emailInputs[action.id];
                            const IconComponent = action.icon;

                            if (action.id === "complaint") {
                                const isActive = uiState.flippedCard === "complaint";

                                return (
                                    <div key={action.id} className="relative h-full">
                                        <button
                                            type="button"
                                            onClick={() => handleCardClick(action)}
                                            disabled={isDisabled && !isActive}
                                            className="flex h-full w-full flex-col rounded-3xl border p-6 text-left shadow-lg transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                                            style={{
                                                borderColor: isActive ? "rgba(59, 130, 246, 0.55)" : "var(--border)",
                                                background: isActive
                                                    ? "linear-gradient(155deg, rgba(29, 78, 216, 0.6), rgba(17, 24, 39, 0.85))"
                                                    : "linear-gradient(160deg, rgba(14, 32, 60, 0.55), rgba(6, 20, 40, 0.8))",
                                                backdropFilter: "blur(var(--glass-blur))",
                                                WebkitBackdropFilter: "blur(var(--glass-blur))",
                                                outlineColor: "var(--primary)",
                                                boxShadow: "var(--glass-shadow)",
                                            }}
                                        >
                                            <IconComponent className={`${action.iconColor} mb-4`} size={32} strokeWidth={1.5} />
                                            <h3 className="mt-4 text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                                                {action.title}
                                            </h3>
                                            <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
                                                {action.description}
                                            </p>
                                            <div className="mt-6 flex items-center text-sm font-medium" style={{ color: "var(--primary)" }}>
                                                <span>{action.ctaLabel ?? "Open Secure Form"} →</span>
                                            </div>
                                        </button>
                                    </div>
                                );
                            }

                            return (
                                <div
                                    key={action.id}
                                    className="relative h-full min-h-[280px]"
                                    style={{ perspective: "1000px" }}
                                >
                                    <motion.div
                                        className="relative h-full w-full"
                                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                                        transition={{ duration: 0.6, ease: "easeInOut" }}
                                        style={{ transformStyle: "preserve-3d" }}
                                    >
                                        {/* Front of card */}
                                        <div
                                            className={`absolute inset-0 w-full h-full ${
                                                isFlipped ? "pointer-events-none" : ""
                                            }`}
                                            style={{
                                                backfaceVisibility: "hidden",
                                                WebkitBackfaceVisibility: "hidden",
                                            }}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => handleCardClick(action)}
                                                disabled={isDisabled}
                                                className="flex h-full w-full flex-col rounded-3xl border p-6 text-left shadow-lg transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                                                style={{
                                                    borderColor: "var(--border)",
                                                    background: "linear-gradient(160deg, rgba(14, 32, 60, 0.55), rgba(6, 20, 40, 0.8))",
                                                    backdropFilter: "blur(var(--glass-blur))",
                                                    WebkitBackdropFilter: "blur(var(--glass-blur))",
                                                    outlineColor: "var(--primary)",
                                                    boxShadow: "var(--glass-shadow)",
                                                }}
                                            >
                                                <IconComponent className={action.iconColor} size={32} strokeWidth={1.5} />
                                                <h3 className="mt-4 text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                                                    {action.title}
                                                </h3>
                                                <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
                                                    {action.description}
                                                </p>
                                                <div className="mt-6 flex items-center text-sm font-medium" style={{ color: "var(--primary)" }}>
                                                    <span>Get Started →</span>
                                                </div>
                                            </button>
                                        </div>

                                        {/* Back of card - Email Input */}
                                        <div
                                            className={`absolute inset-0 w-full h-full ${
                                                !isFlipped ? "pointer-events-none" : ""
                                            }`}
                                            style={{
                                                backfaceVisibility: "hidden",
                                                WebkitBackfaceVisibility: "hidden",
                                                transform: "rotateY(180deg)",
                                            }}
                                        >
                                            <div
                                                className="flex h-full w-full flex-col rounded-2xl border p-6 shadow-lg"
                                                style={{
                                                    borderColor: "rgba(59, 130, 246, 0.35)",
                                                    background: "linear-gradient(160deg, rgba(22, 46, 90, 0.65), rgba(8, 20, 36, 0.85))",
                                                    backdropFilter: "blur(calc(var(--glass-blur) + 6px))",
                                                    WebkitBackdropFilter: "blur(calc(var(--glass-blur) + 6px))",
                                                    boxShadow: "var(--glass-shadow)",
                                                }}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => handleCardClick(action)}
                                                    className="mb-4 self-start transition"
                                                    style={{ color: "var(--muted-foreground)" }}
                                                    aria-label="Go back"
                                                >
                                                    <ArrowLeft className="h-5 w-5" />
                                                </button>
                                                <IconComponent className={`${action.iconColor} mb-4`} size={32} strokeWidth={1.5} />
                                                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                                                    {action.title}
                                                </h3>
                                                <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
                                                    Enter your email address to proceed with this request.
                                                </p>
                                                <div className="flex-1 flex flex-col justify-end">
                                                    <label htmlFor={`email-${action.id}`} className="sr-only">
                                                        Email address
                                                    </label>
                                                    <input
                                                        ref={(el) => {
                                                            emailInputRefs.current[action.id] = el;
                                                        }}
                                                        id={`email-${action.id}`}
                                                        type="email"
                                                        value={emailValue}
                                                        onChange={(e) => handleEmailChange(action.id, e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter" && emailValue.trim()) {
                                                                handleEmailSubmit(action, emailValue.trim());
                                                            }
                                                        }}
                                                        placeholder="your.email@example.com"
                                                        className="w-full rounded-lg border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-0 placeholder:text-slate-400"
                                                        style={{
                                                            borderColor: "var(--border)",
                                                            background: "rgba(9, 20, 36, 0.7)",
                                                            color: "var(--foreground)",
                                                            backdropFilter: "blur(var(--glass-blur))",
                                                            WebkitBackdropFilter: "blur(var(--glass-blur))",
                                                        }}
                                                        onFocus={(e) => {
                                                            e.currentTarget.style.borderColor = "var(--primary)";
                                                            e.currentTarget.style.setProperty("--tw-ring-color", "var(--primary)");
                                                        }}
                                                        onBlur={(e) => {
                                                            e.currentTarget.style.borderColor = "var(--border)";
                                                        }}
                                                        disabled={isLoading}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEmailSubmit(action, emailValue.trim())}
                                                        disabled={isLoading || !emailValue.trim()}
                                                        className="mt-4 w-full rounded-lg px-4 py-3 text-sm font-semibold text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        style={{
                                                            background: "var(--primary)",
                                                            outlineColor: "var(--primary)",
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (!e.currentTarget.disabled) {
                                                                e.currentTarget.style.background = "var(--accent)";
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            if (!e.currentTarget.disabled) {
                                                                e.currentTarget.style.background = "var(--primary)";
                                                            }
                                                        }}
                                                    >
                                                        {isLoading ? (
                                                            <span className="flex items-center justify-center gap-2">
                                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
                                                                Processing...
                                                            </span>
                                                        ) : (
                                                            "Submit Request"
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>

                    {uiState.flippedCard === "complaint" ? (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
                            style={{
                                background: "rgba(3, 8, 18, 0.75)",
                                backdropFilter: "blur(18px)",
                                WebkitBackdropFilter: "blur(18px)",
                            }}
                        >
                            <div
                                className="relative w-full max-w-4xl max-h-[88vh] overflow-hidden rounded-3xl border shadow-xl"
                                style={{
                                    borderColor: "rgba(59, 130, 246, 0.35)",
                                    background: "linear-gradient(165deg, rgba(18, 40, 76, 0.8), rgba(7, 19, 36, 0.95))",
                                    backdropFilter: "blur(calc(var(--glass-blur) + 6px))",
                                    WebkitBackdropFilter: "blur(calc(var(--glass-blur) + 6px))",
                                    boxShadow: "0 24px 55px rgba(0, 0, 0, 0.55)",
                                }}
                            >
                                <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "rgba(59, 130, 246, 0.25)" }}>
                                    <div>
                                        <h2 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
                                            Submit a Privacy Complaint
                                        </h2>
                                        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                                            Fill out the form below with all relevant information so our privacy office can respond promptly.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={closeComplaintForm}
                                        className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                                        style={{
                                            borderColor: "rgba(148, 163, 184, 0.35)",
                                            color: "var(--muted-foreground)",
                                        }}
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back
                                    </button>
                                </div>

                                <div className="max-h-[calc(88vh-96px)] overflow-y-auto px-6 py-6 pr-8">
                                    <form className="space-y-5" onSubmit={handleComplaintSubmit}>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <label className="flex flex-col text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                                                Full Name<span className="text-red-400">*</span>
                                                <input
                                                    type="text"
                                                    value={uiState.complaintForm.fullName}
                                                    onChange={(e) => handleComplaintFieldChange("fullName", e.target.value)}
                                                    className="mt-2 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                                                    style={{
                                                        borderColor: "var(--border-color)",
                                                        background: "rgba(9, 20, 36, 0.7)",
                                                        color: "var(--foreground)",
                                                    }}
                                                    required
                                                />
                                            </label>
                                            <label className="flex flex-col text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                                                Email Address<span className="text-red-400">*</span>
                                                <input
                                                    type="email"
                                                    value={uiState.complaintForm.email}
                                                    onChange={(e) => handleComplaintFieldChange("email", e.target.value)}
                                                    className="mt-2 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                                                    style={{
                                                        borderColor: "var(--border-color)",
                                                        background: "rgba(9, 20, 36, 0.7)",
                                                        color: "var(--foreground)",
                                                    }}
                                                    required
                                                />
                                            </label>
                                            <label className="flex flex-col text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                                                Phone Number
                                                <input
                                                    type="tel"
                                                    value={uiState.complaintForm.phone}
                                                    onChange={(e) => handleComplaintFieldChange("phone", e.target.value)}
                                                    className="mt-2 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                                                    style={{
                                                        borderColor: "var(--border-color)",
                                                        background: "rgba(9, 20, 36, 0.7)",
                                                        color: "var(--foreground)",
                                                    }}
                                                />
                                            </label>
                                            <label className="flex flex-col text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                                                Mailing Address<span className="text-red-400">*</span>
                                                <input
                                                    type="text"
                                                    value={uiState.complaintForm.mailingAddress}
                                                    onChange={(e) => handleComplaintFieldChange("mailingAddress", e.target.value)}
                                                    className="mt-2 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                                                    style={{
                                                        borderColor: "var(--border-color)",
                                                        background: "rgba(9, 20, 36, 0.7)",
                                                        color: "var(--foreground)",
                                                    }}
                                                    required
                                                />
                                            </label>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <label className="flex flex-col text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                                                Role / Title
                                                <input
                                                    type="text"
                                                    value={uiState.complaintForm.role}
                                                    onChange={(e) => handleComplaintFieldChange("role", e.target.value)}
                                                    className="mt-2 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                                                    style={{
                                                        borderColor: "var(--border-color)",
                                                        background: "rgba(9, 20, 36, 0.7)",
                                                        color: "var(--foreground)",
                                                    }}
                                                />
                                            </label>
                                            <label className="flex flex-col text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                                                Company
                                                <input
                                                    type="text"
                                                    value={uiState.complaintForm.company}
                                                    onChange={(e) => handleComplaintFieldChange("company", e.target.value)}
                                                    className="mt-2 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                                                    style={{
                                                        borderColor: "var(--border-color)",
                                                        background: "rgba(9, 20, 36, 0.7)",
                                                        color: "var(--foreground)",
                                                    }}
                                                />
                                            </label>
                                        </div>

                                        <label className="flex flex-col text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                                            Account Credentials / User ID
                                            <input
                                                type="text"
                                                value={uiState.complaintForm.userId}
                                                onChange={(e) => handleComplaintFieldChange("userId", e.target.value)}
                                                className="mt-2 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                                                style={{
                                                    borderColor: "var(--border-color)",
                                                    background: "rgba(9, 20, 36, 0.7)",
                                                    color: "var(--foreground)",
                                                }}
                                            />
                                        </label>

                                        <label className="flex flex-col text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                                            Description of the Incident<span className="text-red-400">*</span>
                                            <textarea
                                                value={uiState.complaintForm.incidentDescription}
                                                onChange={(e) => handleComplaintFieldChange("incidentDescription", e.target.value)}
                                                className="mt-2 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                                                rows={3}
                                                style={{
                                                    borderColor: "var(--border-color)",
                                                    background: "rgba(9, 20, 36, 0.7)",
                                                    color: "var(--foreground)",
                                                }}
                                                required
                                            />
                                        </label>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <label className="flex flex-col text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                                                Specific Dates / Timeframe<span className="text-red-400">*</span>
                                                <textarea
                                                    value={uiState.complaintForm.incidentDates}
                                                    onChange={(e) => handleComplaintFieldChange("incidentDates", e.target.value)}
                                                    className="mt-2 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                                                    rows={2}
                                                    style={{
                                                        borderColor: "var(--border-color)",
                                                        background: "rgba(9, 20, 36, 0.7)",
                                                        color: "var(--foreground)",
                                                    }}
                                                    required
                                                />
                                            </label>
                                            <label className="flex flex-col text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                                                Type of Data Involved<span className="text-red-400">*</span>
                                                <textarea
                                                    value={uiState.complaintForm.dataInvolved}
                                                    onChange={(e) => handleComplaintFieldChange("dataInvolved", e.target.value)}
                                                    className="mt-2 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                                                    rows={2}
                                                    style={{
                                                        borderColor: "var(--border-color)",
                                                        background: "rgba(9, 20, 36, 0.7)",
                                                        color: "var(--foreground)",
                                                    }}
                                                    required
                                                />
                                            </label>
                                        </div>

                                        <label className="flex flex-col text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                                            SalesCentri Services Involved<span className="text-red-400">*</span>
                                            <textarea
                                                value={uiState.complaintForm.servicesInvolved}
                                                onChange={(e) => handleComplaintFieldChange("servicesInvolved", e.target.value)}
                                                className="mt-2 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                                                rows={2}
                                                style={{
                                                    borderColor: "var(--border-color)",
                                                    background: "rgba(9, 20, 36, 0.7)",
                                                    color: "var(--foreground)",
                                                }}
                                                required
                                            />
                                        </label>

                                        <label className="flex flex-col text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                                            Why is this a Privacy Concern?<span className="text-red-400">*</span>
                                            <textarea
                                                value={uiState.complaintForm.concernReason}
                                                onChange={(e) => handleComplaintFieldChange("concernReason", e.target.value)}
                                                className="mt-2 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                                                rows={3}
                                                style={{
                                                    borderColor: "var(--border-color)",
                                                    background: "rgba(9, 20, 36, 0.7)",
                                                    color: "var(--foreground)",
                                                }}
                                                required
                                            />
                                        </label>

                                        <label className="flex flex-col text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                                            Desired Outcome<span className="text-red-400">*</span>
                                            <textarea
                                                value={uiState.complaintForm.desiredOutcome}
                                                onChange={(e) => handleComplaintFieldChange("desiredOutcome", e.target.value)}
                                                className="mt-2 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                                                rows={3}
                                                style={{
                                                    borderColor: "var(--border-color)",
                                                    background: "rgba(9, 20, 36, 0.7)",
                                                    color: "var(--foreground)",
                                                }}
                                                required
                                            />
                                        </label>

                                        <label className="flex flex-col text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                                            Supporting Evidence (describe attachments or links)
                                            <textarea
                                                value={uiState.complaintForm.evidence}
                                                onChange={(e) => handleComplaintFieldChange("evidence", e.target.value)}
                                                className="mt-2 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                                                rows={3}
                                                style={{
                                                    borderColor: "var(--border-color)",
                                                    background: "rgba(9, 20, 36, 0.7)",
                                                    color: "var(--foreground)",
                                                }}
                                            />
                                        </label>

                                        <label className="flex flex-col text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                                            Previous Steps Taken
                                            <textarea
                                                value={uiState.complaintForm.previousSteps}
                                                onChange={(e) => handleComplaintFieldChange("previousSteps", e.target.value)}
                                                className="mt-2 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                                                rows={3}
                                                style={{
                                                    borderColor: "var(--border-color)",
                                                    background: "rgba(9, 20, 36, 0.7)",
                                                    color: "var(--foreground)",
                                                }}
                                            />
                                        </label>

                                        <label className="flex items-start gap-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
                                            <input
                                                type="checkbox"
                                                checked={uiState.complaintForm.declarationAccepted}
                                                onChange={(e) => handleComplaintFieldChange("declarationAccepted", e.target.checked)}
                                                className="mt-1 h-4 w-4 rounded border border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                                                required
                                            />
                                            <span>
                                                I confirm that the information provided is accurate and submitted in good faith. I understand that SalesCentri may contact me to verify this complaint.
                                            </span>
                                        </label>

                                        <div className="flex justify-end gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={closeComplaintForm}
                                                className="rounded-lg border px-5 py-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                                                style={{
                                                    borderColor: "rgba(148, 163, 184, 0.35)",
                                                    color: "var(--muted-foreground)",
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={uiState.loadingAction === "complaint"}
                                                className="rounded-lg px-5 py-2 text-xs font-semibold text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                                style={{
                                                    background: "linear-gradient(135deg, var(--primary), var(--accent))",
                                                    outlineColor: "var(--primary)",
                                                }}
                                            >
                                                {uiState.loadingAction === "complaint" ? "Submitting..." : "Submit Complaint"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </section>
            </section>

            {uiState.confirmationTarget ? (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="erasure-confirmation-title"
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                    style={{ background: "rgba(0, 0, 0, 0.4)" }}
                >
                    <div
                        className="w-full max-w-md rounded-2xl border p-6 shadow-xl"
                        style={{
                            borderColor: "var(--border)",
                            background: "var(--card)",
                        }}
                    >
                        <h3 id="erasure-confirmation-title" className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                            Confirm Data Erasure
                        </h3>
                        <p className="mt-3 text-sm" style={{ color: "var(--muted-foreground)" }}>
                            This action is irreversible and will permanently remove your personal identifying data from our systems. Are you sure you want to continue?
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                                style={{
                                    borderColor: "var(--border)",
                                    background: "var(--card)",
                                    color: "var(--foreground)",
                                    outlineColor: "var(--muted-foreground)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "var(--muted)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "var(--card)";
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmModal}
                                className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                                style={{
                                    background: "var(--danger)",
                                    outlineColor: "var(--danger)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = "0.9";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = "1";
                                }}
                            >
                                Yes, Remove My Data
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </main>
    );
}

export default DataPrivacyManagementCenter;


