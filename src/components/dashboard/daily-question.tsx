"use client";

import { BookOpen } from 'lucide-react';
import { useDailyQuestion } from '@/hooks/useDailyQuestion';

export function DailyQuestion() {
  const { question, loading, error } = useDailyQuestion();

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
      <div className="mb-4 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-amber-400" />
        <h3 className="text-lg font-semibold text-white">Daily LeetCode Question</h3>
      </div>

      {loading && (
        <p className="text-gray-400">Fetching daily question…</p>
      )}
      {error && !loading && (
        <p className="text-red-400">{error}</p>
      )}
      {!loading && !error && question && (
        <div>
          <div className="mb-2 text-white">{question.title}</div>
          {question.difficulty && (
            <div className="mb-3 text-xs text-gray-400">Difficulty: {question.difficulty}</div>
          )}
          {question.link && (
            <a
              className="inline-block rounded bg-blue-600 px-3 py-1 text-sm hover:bg-blue-700"
              href={question.link}
              target="_blank"
              rel="noreferrer noopener"
            >
              View on LeetCode
            </a>
          )}
        </div>
      )}
      {!loading && !error && !question && (
        <p className="text-gray-400">No daily question available right now.</p>
      )}
    </div>
  );
}
