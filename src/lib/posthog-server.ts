import { PostHog } from 'posthog-node'

/**
 * Creates a new PostHog client instance for server-side tracking.
 * Remember to call `await posthog.shutdown()` when done to ensure events are flushed.
 * 
 * @example
 * ```ts
 * const posthog = getPostHogClient()
 * posthog.capture({
 *   distinctId: 'user_id',
 *   event: 'event_name',
 *   properties: { key: 'value' }
 * })
 * await posthog.shutdown()
 * ```
 */
export function getPostHogClient(): PostHog {
    return new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        host: process.env.NEXT_PUBLIC_POSTHOG_HOST
    })
}

/**
 * Captures a server-side event and automatically shuts down the client.
 * Use this for one-off event tracking in API routes or server actions.
 * 
 * @example
 * ```ts
 * await captureServerEvent({
 *   distinctId: 'user_id',
 *   event: 'purchase_completed',
 *   properties: { amount: 99 }
 * })
 * ```
 */
export async function captureServerEvent(params: {
    distinctId: string
    event: string
    properties?: Record<string, any>
}): Promise<void> {
    const posthog = getPostHogClient()

    posthog.capture({
        distinctId: params.distinctId,
        event: params.event,
        properties: params.properties
    })

    await posthog.shutdown()
}
