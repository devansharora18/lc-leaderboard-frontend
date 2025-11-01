"use client"

import { useUserProfile } from '../../hooks';
import { useMemo } from 'react';
import { useDailyQuestion } from '@/hooks/useDailyQuestion';

export function DaySelector() {
  const { user, loading } = useUserProfile();
  const { question, loading: dqLoading, error: dqError } = useDailyQuestion();

  // Generate days array based on current date
  const days = useMemo(() => {
    const today = new Date();
    const daysArray = [];
    
    // Generate 17 days: 8 before today, today, and 8 after today
    for (let i = -8; i <= 8; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = date.getDate().toString();
      const isToday = i === 0;
      const isPast = i < 0;
      const isFuture = i > 0;
      
      // For demonstration, mark some past days as completed based on streak
      // In a real app, this would come from actual user activity data
      const isCompleted = isPast && user?.streak && Math.abs(i) <= user.streak;
      
      daysArray.push({
        day: dayName,
        date: dayNumber,
        completed: isCompleted,
        active: isToday,
        future: isFuture,
      });
    }
    
    return daysArray;
  }, [user?.streak]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4">
      {/* Card 1: Current Streak - 1 colspan */}
      <div className="col-span-12 md:col-span-2 order-3 md:order-1 flex flex-col items-center justify-center bg-zinc-900 rounded-lg p-4 h-28">
        <div className="flex flex-col items-center gap-2 mb-1">
          <div className="text-2xl">🔥</div>
          <div className="text-2xl font-bold text-white">
            {loading ? '...' : (user?.streak || 0)}
          </div>
        </div>
        <div className="text-xs text-gray-400 uppercase tracking-wide">days</div>
        <div className="text-xs text-gray-500">Current Streak</div>
      </div>

      {/* Card 2: Date Selector - 7 colspan */}
      <div className="col-span-12 md:col-span-7 order-2 md:order-2 flex items-center bg-zinc-900 rounded-lg p-4 h-28 min-w-0">
        <div className="flex items-center justify-between w-full min-w-0">
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-gray-300">
              {new Date().toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </div>
          </div>
          
          {/* Horizontal scroller for days on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto md:overflow-visible pl-1 -mr-1 md:pl-0 md:mr-0">
            {/* Left Navigation Arrow */}
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-zinc-800 hover:text-white shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            {/* Day circles */}
            <div className="flex gap-1 shrink-0">
              {days.map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                      day.completed
                        ? "bg-green-500 text-white"
                        : day.active
                        ? "bg-amber-500 text-black font-medium"
                        : day.future
                        ? "bg-gray-600 text-gray-400"
                        : "bg-zinc-800 text-white hover:bg-zinc-700"
                    }`}
                  >
                    {day.completed ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-3 w-3"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      <span className="text-xs font-medium">{day.date}</span>
                    )}
                  </div>
                  <span className="text-[8px] text-gray-400 mt-0.5">{day.day}</span>
                </div>
              ))}
            </div>

            {/* Right Navigation Arrow */}
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-zinc-800 hover:text-white shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Card 3: Daily Question - 3 colspan */}
      <div className="col-span-12 md:col-span-3 order-1 md:order-3 flex flex-col justify-between bg-zinc-900 rounded-lg p-4 h-28">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-wide text-gray-400">Daily Question</div>
          {question?.difficulty && (
            <div className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] text-gray-300">
              {question.difficulty}
            </div>
          )}
        </div>
        <div className="line-clamp-2 text-sm font-medium text-white">
          {dqLoading ? 'Loading…' : dqError ? 'Unavailable' : (question?.title || '—')}
        </div>
        <div className="flex items-center gap-2">
          {question?.link ? (
            <a
              href={question.link}
              target="_blank"
              rel="noreferrer noopener"
              className="px-3 py-1 text-xs font-medium text-amber-500 bg-zinc-800 rounded hover:bg-zinc-700"
            >
              Open →
            </a>
          ) : (
            <button
              disabled
              className="px-3 py-1 text-xs font-medium text-gray-500 bg-zinc-800 rounded"
            >
              Open →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
