"use client";

import { useState } from "react";
// import { Search } from "lucide-react";
// import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/dashboard/sidebar";
import { UserHeader } from "@/components/dashboard/user-header";
import { DaySelector } from "@/components/dashboard/day-selector";
import { Leaderboard } from "@/components/dashboard/leaderboard";
import { ActivityList } from "@/components/dashboard/activity-list";
// import { ActivityGauge } from "@/components/dashboard/activity-gauge";
// import { WeeklySummary } from "@/components/dashboard/weekly-summary";
// import { MonthlyStats } from "@/components/dashboard/monthly-stats";
// import { ActivityCalendar } from "@/components/dashboard/activity-calendar";
// import { YearlyActivity } from "@/components/dashboard/yearly-activity";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* User Header */}
        <UserHeader />

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Day Selector */}
          <DaySelector />

          

          {/* Leaderboard */}
          <div className="mb-6">
            <Leaderboard />
          </div>

          {/* Activity Section */}
          <div className="mb-6">
            <ActivityList />
            {/* <ActivityGauge />
            <WeeklySummary /> */}
          </div>

          {/* Monthly Stats */}
          {/* <div className="mb-6">
            <MonthlyStats />
          </div> */}

          {/* Calendar - Two Column Layout
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ActivityCalendar />
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Placeholder Content</h3>
              <p className="text-gray-400">This is a temporary dummy column. Content to be determined.</p>
            </div>
          </div>

          
          <div className="mb-6">
            <YearlyActivity />
          </div> 
          */}
        </div>
      </div>
    </div>
  );
}
