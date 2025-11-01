"use client";
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

  return (
    <div className="flex h-screen bg-black text-white pb-16 md:pb-0">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* User Header */}
        <UserHeader />

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Day Selector */}
          <div className="-mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto sm:overflow-visible mb-6 sm:mb-8">
            <DaySelector />
          </div>

          

          {/* Leaderboard */}
          <div className="mb-6 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto sm:overflow-visible">
            <div className="min-w-0">
              <Leaderboard />
            </div>
          </div>

          {/* Activity Section */}
          <div className="mb-6 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto sm:overflow-visible">
            <div className="min-w-0">
              <ActivityList />
            </div>
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
