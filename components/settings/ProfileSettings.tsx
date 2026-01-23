"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { User, Camera, Check, Upload } from "lucide-react";

interface ProfileSettingsProps {
    userId: string;
}

export function ProfileSettings({ userId }: ProfileSettingsProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                // Get auth user for email
                const { data: { user } } = await supabase.auth.getUser();
                if (user?.email) {
                    setEmail(user.email);
                }

                // Get profile from users table
                const { data, error } = await supabase
                    .from("users")
                    .select("name, avatar_url")
                    .eq("id", userId)
                    .single();

                if (error) throw error;

                if (data) {
                    setName(data.name || "");
                    setAvatarUrl(data.avatar_url || "");
                }
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setError("Failed to load profile");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please upload an image file");
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setError("Image must be less than 2MB");
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            // Create unique file name
            const fileExt = file.name.split(".").pop();
            const fileName = `${userId}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: true,
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from("avatars")
                .getPublicUrl(filePath);

            setAvatarUrl(publicUrl);

            // Auto-save to database
            const { error: updateError } = await supabase
                .from("users")
                .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
                .eq("id", userId);

            if (updateError) throw updateError;

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error("Failed to upload avatar:", err);
            setError("Failed to upload avatar. Make sure the 'avatars' bucket exists in Supabase Storage.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        setSaveSuccess(false);

        try {
            const { error } = await supabase
                .from("users")
                .update({ name, avatar_url: avatarUrl, updated_at: new Date().toISOString() })
                .eq("id", userId);

            if (error) throw error;

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error("Failed to save profile:", err);
            setError("Failed to save profile");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="space-y-4">
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-300 text-white shadow-teal-md">
                    <User size={20} />
                </div>
                <h2 className="text-lg font-bold text-foreground">Profile Information</h2>
            </div>

            <div className="space-y-5">
                {/* Avatar Upload */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt="Avatar"
                                className="h-16 w-16 rounded-full object-cover border-2 border-gray-100"
                            />
                        ) : (
                            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="h-8 w-8 text-gray-400" />
                            </div>
                        )}
                        <label className="absolute -bottom-1 -right-1 h-6 w-6 bg-teal-300 rounded-full flex items-center justify-center border-2 border-white cursor-pointer hover:bg-teal-400 transition-colors">
                            {isUploading ? (
                                <div className="typing-indicator !w-4 !h-2 scale-50">
                                    <div className="typing-circle"></div>
                                    <div className="typing-circle"></div>
                                    <div className="typing-circle"></div>
                                </div>
                            ) : (
                                <Camera className="h-3 w-3 text-white" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="hidden"
                                disabled={isUploading}
                            />
                        </label>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Profile Photo</p>
                        <p className="text-xs text-gray-400 mt-0.5">Click the camera icon to upload a new photo</p>
                        <p className="text-xs text-gray-400">JPG, PNG, GIF up to 2MB</p>
                    </div>
                </div>

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Display Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent text-foreground focus:border-teal-300 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                    />
                </div>

                {/* Email (Read-only) */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-3d btn-3d-teal w-full mt-2"
                >
                    <span className="btn-3d-shadow"></span>
                    <span className="btn-3d-edge"></span>
                    <span className="btn-3d-front gap-2 px-4 py-3 justify-center">
                        {isSaving ? (
                            <div className="typing-indicator !w-12 !h-6">
                                <div className="typing-circle"></div>
                                <div className="typing-circle"></div>
                                <div className="typing-circle"></div>
                                <div className="typing-shadow"></div>
                                <div className="typing-shadow"></div>
                                <div className="typing-shadow"></div>
                            </div>
                        ) : saveSuccess ? (
                            <>
                                <Check className="h-5 w-5" />
                                <span className="font-bold">Saved!</span>
                            </>
                        ) : (
                            <span className="font-bold">Save Changes</span>
                        )}
                    </span>
                </button>
            </div>
        </div>
    );
}
