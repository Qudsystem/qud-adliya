
import { AnalyticsEvent, UsageStats } from '../types';

const STORAGE_KEY = 'adliya_analytics_v1';

export const trackEvent = (type: AnalyticsEvent['type'], feature: string, category?: string) => {
  const events: AnalyticsEvent[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const newEvent: AnalyticsEvent = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    type,
    feature,
    category
  };
  events.push(newEvent);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  console.log(`[Analytics] Tracked: ${feature} (${type})`);
};

export const getUsageStats = (): UsageStats => {
  const events: AnalyticsEvent[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  
  const featureCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  
  events.forEach(e => {
    featureCounts[e.feature] = (featureCounts[e.feature] || 0) + 1;
    if (e.category) {
      categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
    }
  });

  const topFeatures = Object.entries(featureCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const categoryDistribution = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    topFeatures,
    categoryDistribution,
    sessionDepth: events.length > 0 ? Math.round(events.length / 5) : 0, // Simulated depth
    totalInteractions: events.length
  };
};
