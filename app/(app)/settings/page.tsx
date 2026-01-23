import { createClient } from "@/lib/supabase-server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SettingsLayout } from "@/components/settings/SettingsLayout";

export default async function SettingsPage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return <SettingsLayout userId={user.id} />;
}
