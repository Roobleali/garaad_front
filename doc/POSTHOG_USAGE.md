# PostHog Usage Guide

This document explains how to use PostHog analytics in the Garaad application.

## Overview

PostHog is integrated into the application for tracking user behavior, events, and analytics. The integration supports both client-side and server-side tracking.

## Client-Side Tracking

PostHog is automatically initialized on the client-side via `instrumentation-client.ts`. Once initialized, you can use PostHog anywhere in your client components.

### Automatic Tracking

PostHog automatically tracks:
- **Pageviews**: Every page navigation
- **Clicks**: User interactions with elements
- **Form submissions**: Form interactions
- **Session recordings**: User session replays (if enabled in PostHog dashboard)

### Manual Event Tracking

To track custom events in client components:

```tsx
'use client'

import posthog from 'posthog-js'

export default function MyComponent() {
  function handleAction() {
    posthog.capture('custom_event_name', {
      property1: 'value1',
      property2: 'value2'
    })
  }

  return <button onClick={handleAction}>Click me</button>
}
```

### User Identification

Identify users to track their journey across sessions:

```tsx
import posthog from 'posthog-js'

// When user logs in
posthog.identify(
  'user_id', // Unique user identifier
  {
    email: 'user@example.com',
    name: 'User Name',
    // Add any other user properties
  }
)

// When user logs out
posthog.reset()
```

### Feature Flags

Check feature flags to enable/disable features:

```tsx
import posthog from 'posthog-js'

function MyComponent() {
  const isFeatureEnabled = posthog.isFeatureEnabled('feature-flag-key')
  
  return (
    <div>
      {isFeatureEnabled && <NewFeature />}
    </div>
  )
}
```

## Server-Side Tracking

For tracking events in API routes or server actions, use the server-side utilities.

### API Routes (App Router)

```tsx
import { NextRequest, NextResponse } from 'next/server'
import { captureServerEvent } from '@/lib/posthog-server'

export async function POST(request: NextRequest) {
  // Your API logic here
  
  // Track the event
  await captureServerEvent({
    distinctId: 'user_id',
    event: 'api_action_completed',
    properties: {
      endpoint: '/api/example',
      status: 'success'
    }
  })
  
  return NextResponse.json({ success: true })
}
```

### Server Actions

```tsx
'use server'

import { captureServerEvent } from '@/lib/posthog-server'

export async function myServerAction(userId: string) {
  // Your server action logic here
  
  // Track the event
  await captureServerEvent({
    distinctId: userId,
    event: 'server_action_completed',
    properties: {
      action: 'myServerAction'
    }
  })
}
```

### Advanced Server-Side Usage

If you need more control (e.g., multiple events in one request):

```tsx
import { getPostHogClient } from '@/lib/posthog-server'

export async function POST(request: NextRequest) {
  const posthog = getPostHogClient()
  
  try {
    // Capture multiple events
    posthog.capture({
      distinctId: 'user_id',
      event: 'event_1'
    })
    
    posthog.capture({
      distinctId: 'user_id',
      event: 'event_2'
    })
    
    return NextResponse.json({ success: true })
  } finally {
    // Always shutdown to flush events
    await posthog.shutdown()
  }
}
```

## Event Naming Conventions

Follow these conventions for consistent event tracking:

- Use **snake_case** for event names: `purchase_completed`, `lesson_started`
- Use descriptive names that clearly indicate the action
- Group related events with prefixes: `lesson_started`, `lesson_completed`, `lesson_paused`

## Common Events to Track

Here are some suggested events for the Garaad application:

### Course & Lesson Events
- `course_viewed`: User views a course page
- `lesson_started`: User starts a lesson
- `lesson_completed`: User completes a lesson
- `lesson_progress_updated`: User makes progress in a lesson
- `quiz_submitted`: User submits a quiz
- `quiz_passed`: User passes a quiz
- `quiz_failed`: User fails a quiz

### User Events
- `user_registered`: New user signs up
- `user_logged_in`: User logs in
- `user_logged_out`: User logs out
- `profile_updated`: User updates their profile

### Payment Events
- `checkout_initiated`: User starts checkout
- `payment_completed`: Payment successful
- `payment_failed`: Payment failed
- `subscription_started`: User subscribes
- `subscription_cancelled`: User cancels subscription

### Engagement Events
- `feedback_submitted`: User submits feedback
- `search_performed`: User searches for content
- `notification_clicked`: User clicks a notification

## Environment Variables

Make sure these environment variables are set:

```bash
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

## Testing

To verify PostHog is working:

1. Start the development server: `npm run dev`
2. Open the application in your browser
3. Navigate through a few pages
4. Check the PostHog dashboard to see if events are being received
5. Check the browser console for any PostHog errors

## Resources

- [PostHog Documentation](https://posthog.com/docs)
- [PostHog Next.js Integration](https://posthog.com/docs/libraries/next-js)
- [PostHog API Reference](https://posthog.com/docs/api)
