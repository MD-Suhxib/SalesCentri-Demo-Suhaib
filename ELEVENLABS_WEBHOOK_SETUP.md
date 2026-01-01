# ElevenLabs Webhook Setup Guide

## Overview

This application uses ElevenLabs webhooks to receive transcript data when voice calls end, without displaying transcripts in the UI. The webhook endpoint processes `post_call_transcription` events and forwards them to the DemandIntellect backend.

## Webhook Endpoint

**URL:** `https://your-domain.com/api/elevenlabs/webhook`

**Method:** `POST`

**Event Type:** `post_call_transcription`

## Configuration Steps

### 1. Configure Webhook in ElevenLabs Dashboard

1. Log in to [ElevenLabs Agents Platform](https://elevenlabs.io/app/agents)
2. Navigate to your agent settings
3. Go to **Webhooks** section (or **Advanced** → **Webhooks**)
4. Add a new webhook:
   - **URL:** `https://your-production-domain.com/api/elevenlabs/webhook`
   - **Events:** Select `post_call_transcription`
   - **Status:** Enable the webhook

### 2. Environment Variables

Ensure these are set in your production environment:

```env
SALESCENTRI_BASE_URL=https://app.demandintellect.com/app/api
SALESCENTRI_CLIENT_API_KEY=your_api_key_here
```

### 3. Webhook Payload Structure

The webhook expects a payload with the following structure (adjust based on actual ElevenLabs payload):

```json
{
  "type": "post_call_transcription",
  "event_timestamp": 1739537297,
  "data": {
    "agent_id": "agent_7701kbcrdr3zemzajc9ct39m2q9y",
    "conversation_id": "conv_7301kc2fzv44edyaea7tbqsy44jy",
    "status": "done",
    "transcript": [
      {
        "role": "agent",
        "message": "Hey there! How are you?",
        "tool_calls": null,
        "tool_results": null,
        "feedback": null,
        "time_in_call_secs": 0,
        "conversation_turn_metrics": null
      },
      {
        "role": "user",
        "message": "Tell me a fun fact about 11Labs",
        "tool_calls": null
      }
    ]
  }
}
```

**Key Fields:**

- `type`: Always `"post_call_transcription"` for transcript events
- `event_timestamp`: Unix timestamp when event occurred
- `data.agent_id`: ID of the agent that handled the call (store for tracking)
- `data.conversation_id`: Unique identifier for this conversation (store for tracking)
- `data.status`: Call status (e.g., "done")
- `data.transcript[]`: Array of conversation turns, each with:
  - `role`: "agent" or "user"
  - `message`: The actual text spoken
  - `time_in_call_secs`: Time offset in seconds
  - `tool_calls`, `tool_results`, `feedback`: Optional tool/feedback data

**User Data (email/phone/subject):**
These are NOT included in the standard webhook payload. They must be:

- Passed via widget data attributes (`data-email`, `data-phone`, `data-subject`)
- Stored in conversation metadata via ElevenLabs API
- Retrieved separately using conversation_id

The webhook handler attempts to extract user data from:

- `data.email` or `data.user_email` or `data.metadata.email` or `data.custom_data.email`
- `data.phone` or `data.user_phone` or `data.metadata.phone` or `data.custom_data.phone`
- `data.subject` or `data.metadata.subject` or `data.metadata.objective` or `data.custom_data.subject`

### 4. User Data Association

**Important:** The webhook needs to associate transcripts with user data (email, phone, subject). This can be done in two ways:

#### Option A: Pass via Widget Data Attributes (Recommended)

When initializing the ElevenLabs widget, pass user data as data attributes:

```typescript
widget.setAttribute("data-email", formData.email);
widget.setAttribute("data-phone", formData.phone);
widget.setAttribute("data-subject", formData.objective);
```

ElevenLabs should include these in the webhook payload metadata.

#### Option B: Store in Conversation Metadata

Use ElevenLabs API to set conversation metadata when the call starts, which will be included in the webhook payload.

### 5. Testing

#### Test Webhook Locally (using ngrok or similar)

1. Start your local dev server: `npm run dev`
2. Expose localhost with ngrok: `ngrok http 3000`
3. Configure webhook URL in ElevenLabs: `https://your-ngrok-url.ngrok.io/api/elevenlabs/webhook`
4. Make a test call and verify webhook is received

#### Test Webhook Endpoint Directly

```bash
curl -X POST http://localhost:3000/api/elevenlabs/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "post_call_transcription",
    "event_timestamp": 1739537297,
    "data": {
      "conversation_id": "conv_test123",
      "agent_id": "agent_7701kbcrdr3zemzajc9ct39m2q9y",
      "status": "done",
      "transcript": [
        {
          "role": "agent",
          "message": "Hi, how can I help you today?",
          "time_in_call_secs": 0
        },
        {
          "role": "user",
          "message": "I am interested in pricing",
          "time_in_call_secs": 5
        }
      ],
      "email": "test@example.com",
      "phone": "+15551234567",
      "subject": "Pricing inquiry"
    }
  }'
```

## Webhook Processing Flow

1. **ElevenLabs sends webhook** → `POST /api/elevenlabs/webhook`
2. **Extract data** from webhook payload (transcript, summary, user info)
3. **Forward to DemandIntellect** → `POST /ai-call.php/register` with:
   - `email` (required)
   - `phone` (required)
   - `subject` (optional)
   - `transcript` (optional)
   - `summary` (optional)
   - `metadata` (includes conversation_id, agent_id, duration, etc.)

## Troubleshooting

### Webhook Not Received

- Check ElevenLabs dashboard webhook status
- Verify webhook URL is accessible (not behind firewall)
- Check server logs for incoming requests

### Missing User Data (email/phone)

- Ensure widget data attributes are set when initializing
- Check if ElevenLabs includes user data in webhook payload
- May need to use conversation metadata API to store user info

### Backend Forwarding Fails

- Verify `SALESCENTRI_CLIENT_API_KEY` is set correctly
- Check backend endpoint is accessible
- Review webhook logs for error details

## Security Notes

### Webhook Signature Verification

ElevenLabs supports optional HMAC signature verification. To enable:

1. **Set environment variable:**

   ```env
   ELEVENLABS_WEBHOOK_SECRET=your_webhook_secret_from_elevenlabs_dashboard
   ```

2. **Configure in ElevenLabs dashboard:**
   - Go to Webhooks settings
   - Set "Webhook Auth Method" to "HMAC"
   - Copy the secret and set it in `ELEVENLABS_WEBHOOK_SECRET`

3. **Signature verification is optional** - ElevenLabs does not enforce it, but it's recommended for production security.

The webhook handler checks for signatures in these headers:

- `x-elevenlabs-signature`
- `x-signature`
- `signature`
- `x-hub-signature-256`

### Other Security Best Practices

- Validate webhook payload structure before processing
- Log webhook events for debugging (without sensitive data)
- Store `conversation_id` and `agent_id` in metadata for tracking/correlation

## Related Files

- `src/app/api/elevenlabs/webhook/route.ts` - Webhook endpoint handler
- `src/app/components/LeadCaptureModal.tsx` - Widget initialization with data attributes
