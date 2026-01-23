"use client";

import { ProfileSettings } from "./ProfileSettings";
import { PreferenceSettings } from "./PreferenceSettings";

interface SettingsLayoutProps {
    userId: string;
}

export function SettingsLayout({ userId }: SettingsLayoutProps) {
    return (
        <div className="mx-4 px-4 mt-4 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage your account settings and preferences.
                </p>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProfileSettings userId={userId} />
                <PreferenceSettings />
            </div>
        </div>
    );
}
