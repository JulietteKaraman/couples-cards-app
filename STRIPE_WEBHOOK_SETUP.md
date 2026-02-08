# Stripe Webhook Setup for Local Development

## The Problem
Stripe webhooks cannot reach `localhost:3000` directly because Stripe's servers are on the internet and your local machine is not. You need to use Stripe CLI to forward webhooks to your local server.

## Quick Setup (Using Stripe CLI)

### 1. Install Stripe CLI
```bash
# macOS with Homebrew
brew install stripe/stripe-cli/stripe

# Or download from: https://stripe.com/docs/stripe-cli
```

### 2. Login to Stripe
```bash
stripe login
```
This will open a browser window to authenticate.

### 3. Forward Webhooks to Localhost
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 4. Copy the Webhook Secret
The CLI will output something like:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxxxxx (^C to quit)
```

**IMPORTANT:** Update your `.env.local` file:
```bash
# Use the secret from the CLI, NOT from Stripe Dashboard
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx
```

The CLI secret is different from the Dashboard secret - they are not interchangeable!

### 5. Test Webhook Delivery
In a separate terminal window, trigger a test event:
```bash
stripe trigger checkout.session.completed
```

You should see logs in your Next.js terminal showing the webhook being received.

## Alternative: Using ngrok

If you can't use Stripe CLI:

```bash
# Install ngrok
brew install ngrok

# Start tunnel
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)

# Configure webhook in Stripe Dashboard:
# https://dashboard.stripe.com/test/webhooks
# Add endpoint: https://abc123.ngrok.io/api/stripe/webhook
# Select event: checkout.session.completed
# Copy the "Signing secret" from Dashboard
```

## Debugging Checklist

If webhooks aren't working:

- [ ] Is `npm run dev` running? Check with `curl http://localhost:3000`
- [ ] Is Stripe CLI running and showing "Ready!"?
- [ ] Is `STRIPE_WEBHOOK_SECRET` in `.env.local` the one from CLI (not Dashboard)?
- [ ] Did you restart Next.js after updating `.env.local`?
- [ ] Check terminal logs - webhooks should show "WEBHOOK START" messages
- [ ] Run `stripe trigger checkout.session.completed` to test manually

## Common Issues

### Issue: "No signature found"
**Cause:** Webhook secret is wrong or missing
**Fix:** Use the secret from `stripe listen` command, not Dashboard

### Issue: Webhook received but no database record
**Cause:** Database error or missing columns
**Fix:** Check terminal logs for "DATABASE ERROR" messages

### Issue: "Cannot connect to localhost"
**Cause:** Stripe can't reach your local server
**Fix:** Must use Stripe CLI or ngrok tunnel

## Production Note

In production (Vercel, etc.), webhooks work automatically:
1. Configure webhook URL in Stripe Dashboard pointing to your production domain
2. Use the Dashboard webhook secret (not CLI secret)
3. No tunnel needed - Stripe can reach your production server directly
