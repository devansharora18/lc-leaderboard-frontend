import { useEffect, useState } from 'react';
import { dashboardService } from '@/services/dashboard.service';

export type ActivityStatus = 'success' | 'warning' | 'error';

export interface ActivityItem {
  title: string;
  time: string;
  status: ActivityStatus;
  progress: number; // 0-100
}

interface RawSubmission {
  title?: string;
  titleSlug?: string;
  timestamp?: number | string;
  time?: string | number;
  submissionTime?: number | string;
  status?: string;
  statusDisplay?: string;
  status_display?: string;
  verdict?: string;
}

export const useActivities = (limit = 10) => {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const normalize = (s: RawSubmission): ActivityItem => {
      const title: string = s?.title || s?.titleSlug?.toString()?.replace(/-/g, ' ') || 'Unknown';
      const ts: number | string | undefined = s?.timestamp ?? s?.time ?? s?.submissionTime;
      const timestamp = typeof ts === 'number' ? ts * 1000 : (typeof ts === 'string' ? Date.parse(ts) : Date.now());
      const time = isNaN(timestamp as number) ? new Date().toLocaleString() : new Date(timestamp as number).toLocaleString();

      const rawStatus: string = (s?.status || s?.statusDisplay || s?.status_display || s?.verdict || '').toString();
      let status: ActivityStatus = 'warning';
      if (/accept/i.test(rawStatus)) status = 'success';
      else if (/wrong|time limit|memory limit|runtime|compile|error|fail/i.test(rawStatus)) status = 'error';

      return { title, time, status, progress: 100 };
    };

    const fetchIt = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await dashboardService.getSubmissions(limit);
        if (!cancelled && res?.success) {
          const normalized = (res.data?.submissions || []).map(normalize);
          setItems(normalized);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to fetch submissions');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchIt();
    return () => { cancelled = true; };
  }, [limit]);

  return { items, loading, error };
};
