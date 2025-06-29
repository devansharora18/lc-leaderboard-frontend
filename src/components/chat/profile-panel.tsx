"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { 
  X,
  Trophy,
  Users,
  Calendar,
  Star,
  Crown
} from "lucide-react"

interface ProfilePanelProps {
  onClose: () => void
}

export function ProfilePanel({ onClose }: ProfilePanelProps) {
  return (
    <div className="w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col fixed right-0 top-0 h-full z-50">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Profile</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Profile Info */}
      <div className="p-6 border-b border-zinc-800">
        <div className="text-center">
          <Avatar className="h-20 w-20 mx-auto mb-4">
            <AvatarFallback className="bg-zinc-700 text-white text-xl">
              PV
            </AvatarFallback>
          </Avatar>
          
          <h3 className="text-xl font-semibold text-white mb-1">Penny Valeria</h3>
          <div className="flex items-center justify-center mb-2">
            <Crown className="h-4 w-4 text-amber-500 mr-1" />
            <span className="text-amber-500 font-medium">19</span>
          </div>
          <p className="text-gray-400 text-sm">Online</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-6 border-b border-zinc-800">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">Sets</div>
            <div className="text-gray-400 text-sm">Medal</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">Files</div>
            <div className="text-gray-400 text-sm">Special</div>
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="p-6 border-b border-zinc-800">
        <h4 className="text-white font-medium mb-4">Activity</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-300 text-sm">Friends for:</span>
            </div>
            <span className="text-white text-sm">3 MONTHS</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-300 text-sm">Rank:</span>
            </div>
            <div className="flex items-center">
              <Crown className="h-4 w-4 text-amber-500 mr-1" />
              <span className="text-white text-sm">Gold</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-300 text-sm">Currently on:</span>
            </div>
            <span className="text-white text-sm">1-day-1</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Trophy className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-300 text-sm">Number of Duels:</span>
            </div>
            <span className="text-white text-sm">15</span>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="p-6 flex-1">
        <h4 className="text-white font-medium mb-4">Activity Overview</h4>
        
        {/* Circular Progress Chart */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgb(63, 63, 70)"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgb(245, 158, 11)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${70 * 2.51} ${100 * 2.51}`}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-white font-bold text-lg">Penny</div>
            <div className="bg-amber-500 text-black text-xs px-2 py-1 rounded font-medium">
              You
            </div>
          </div>
        </div>
        
        <div className="text-center text-gray-400 text-sm">
          Daily activity completion
        </div>
      </div>
    </div>
  )
}
