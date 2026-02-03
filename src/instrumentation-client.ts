import posthog from 'posthog-js'

console.log('PostHog initializing...')
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: '2025-11-30'
})
