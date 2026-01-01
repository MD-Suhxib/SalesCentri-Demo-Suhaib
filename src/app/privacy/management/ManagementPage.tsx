"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DataPrivacyManagementCenter from "./DataPrivacyManagementCenter";

function ManagementPageContent() {
    const params = useSearchParams();

    const userName = params?.get("name") ?? null;
    const status = params?.get("status") ?? null;

    return (
        <DataPrivacyManagementCenter
            userName={userName}
            communicationStatus={status}
        />
    );
}

export function ManagementPage() {
    return (
        <Suspense fallback={<div className="px-4 py-16 text-center text-sm text-slate-600">Loading secure session…</div>}>
            <ManagementPageContent />
        </Suspense>
    );
}

export default ManagementPage;


