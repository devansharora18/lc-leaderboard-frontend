import { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboard.service';

export interface DailyQuestionData {
  title: string;
  titleSlug?: string;
  difficulty?: string;
  link?: string;
}

export const useDailyQuestion = () => {
  const [question, setQuestion] = useState<DailyQuestionData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchIt = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await dashboardService.getDailyQuestion();
        if (!cancelled && res?.success) {
          const dq = res.data?.dailyQuestion || {};
          const qn = dq?.question || {};
          const title: string = dq?.title || dq?.questionTitle || qn?.title || qn?.questionTitle || 'Daily Question';
          const titleSlug: string | undefined =
            dq?.titleSlug || dq?.questionTitleSlug || dq?.slug || qn?.titleSlug || qn?.slug;
          const difficulty: string | undefined = dq?.difficulty || qn?.difficulty || dq?.level;
          const directLink: string | undefined = dq?.questionLink || dq?.link || dq?.url || qn?.link || qn?.url;
          const link = directLink || (titleSlug ? `https://leetcode.com/problems/${titleSlug}/` : undefined);
          setQuestion({ title, titleSlug, difficulty, link });
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to fetch daily question');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchIt();
    return () => { cancelled = true; };
  }, []);

  return { question, loading, error };
};
