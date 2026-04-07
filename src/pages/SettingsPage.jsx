import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export function SettingsPage() {
  const { user } = useAuth();
  const email = user?.email || "Not available";

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1E293B]">Settings</h1>
        <p className="text-[#475569] mt-2">Manage your account and app preferences.</p>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-[#1E293B] mb-4">Account</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#D6E4FF]/50 rounded-xl border border-primary/5">
              <div>
                <p className="font-bold text-[#1E293B]">Email Address</p>
                <p className="text-sm text-[#475569]">{email}</p>
              </div>
              <Button variant="outline" size="sm">Change</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
