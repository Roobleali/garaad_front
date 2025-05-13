export const measurePerformance = (name: string) => {
  if (typeof window === "undefined") return;

  const start = performance.now();
  return {
    end: () => {
      const end = performance.now();
      const duration = end - start;
      console.log(`Performance [${name}]: ${duration.toFixed(2)}ms`);
      return duration;
    },
  };
};

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
}

export const trackWebVitals = () => {
  if (typeof window === "undefined") return;

  // Track Largest Contentful Paint (LCP)
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log("LCP:", lastEntry.startTime);
  }).observe({ entryTypes: ["largest-contentful-paint"] });

  // Track First Input Delay (FID)
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries() as FirstInputEntry[];
    entries.forEach((entry) => {
      console.log("FID:", entry.processingStart - entry.startTime);
    });
  }).observe({ entryTypes: ["first-input"] });

  // Track Cumulative Layout Shift (CLS)
  new PerformanceObserver((entryList) => {
    let cls = 0;
    entryList.getEntries().forEach((entry) => {
      const layoutShiftEntry = entry as LayoutShiftEntry;
      if (!layoutShiftEntry.hadRecentInput) {
        cls += layoutShiftEntry.value;
      }
    });
    console.log("CLS:", cls);
  }).observe({ entryTypes: ["layout-shift"] });
};
