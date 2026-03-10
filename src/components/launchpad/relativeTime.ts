/**
 * Simple relative time in Somali for Launchpad cards.
 * e.g. "3 maalmood ka hor", "1 saac ka hor", "dhowaan"
 */
export function relativeTimeSomali(isoDate: string): string {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "dhowaan";
    if (diffMins < 60) return `${diffMins} daqiiqo ka hor`;
    if (diffHours < 24) return `${diffHours} saac ka hor`;
    if (diffDays === 1) return "1 maalin ka hor";
    if (diffDays < 7) return `${diffDays} maalmood ka hor`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} toddobaad ka hor`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} bil ka hor`;
    return `${Math.floor(diffDays / 365)} sano ka hor`;
}
