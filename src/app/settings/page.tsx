'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { Sidebar } from '@/components/dashboard/sidebar';
import { UserHeader } from '@/components/dashboard/user-header';
import { LeetCodeConnectForm } from '@/components/settings/leetcode-connect-form';

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-black text-white">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* User Header */}
          <UserHeader />

          {/* Settings Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-gray-400 mt-1">
                  Manage your account settings and integrations.
                </p>
              </div>

              <div className="space-y-6">
                {/* LeetCode Connection Section */}
                <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-white">Connect LeetCode</h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Link your LeetCode account to track your progress and participate in leaderboards.
                    </p>
                  </div>
                  
                  <LeetCodeConnectForm />
                </div>

                {/* Future sections can be added here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
