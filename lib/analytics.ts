'use client';

import { track } from '@vercel/analytics';

// Custom event types for better type safety
export type AnalyticsEvent =
  | 'fact_check_started'
  | 'fact_check_completed'
  | 'fact_check_error'
  | 'page_view'
  | 'feature_used';

// Properties interface for type safety
export interface AnalyticsProperties {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Track a custom event with Vercel Analytics
 * @param event The event name to track
 * @param properties Optional properties to include with the event
 */
// Debug mode for development
const DEBUG_ANALYTICS = process.env.NODE_ENV === 'development';

export function trackEvent(event: AnalyticsEvent, properties?: AnalyticsProperties) {
  try {
    // Always track in production, but make it optional in development
    if (process.env.NODE_ENV === 'production' || !DEBUG_ANALYTICS) {
      track(event, properties);
    }

    // Log analytics events in development for debugging
    if (DEBUG_ANALYTICS) {
      console.log(`%cAnalytics: ${event}`, 'color: purple; font-weight: bold', properties);
    } else {
      console.log(`Analytics event tracked: ${event}`);
    }
  } catch (error) {
    console.error('Error tracking analytics event:', error);
  }
}

/**
 * Track a page view event
 * @param pageName The name of the page being viewed
 */
export function trackPageView(pageName: string) {
  trackEvent('page_view', { page: pageName });
}

/**
 * Track a feature usage event
 * @param featureName The name of the feature being used
 * @param successful Whether the feature usage was successful
 */
export function trackFeatureUsage(featureName: string, successful: boolean = true) {
  trackEvent('feature_used', {
    feature: featureName,
    successful
  });
}

/**
 * Track fact-checking events
 * @param status The status of the fact-checking process
 * @param details Additional details about the fact-checking
 */
export function trackFactCheck(
  status: 'started' | 'completed' | 'error',
  details?: {
    textLength?: number;
    apiUsed?: string;
    processingTime?: number;
    errorMessage?: string;
    hasFile?: boolean;
    factCount?: number;
  }
) {
  const event: AnalyticsEvent = `fact_check_${status}` as AnalyticsEvent;
  trackEvent(event, details);
}
