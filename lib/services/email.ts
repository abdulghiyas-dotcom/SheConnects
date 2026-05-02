import { Resend } from "resend"

export const isEmailConfigured = !!process.env.RESEND_API_KEY

let _resend: Resend | null = null
function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY")
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

const FROM = process.env.EMAIL_FROM
  ?? (process.env.RESEND_FROM_EMAIL
      ? `${process.env.RESEND_FROM_NAME ?? "SheConnects"} <${process.env.RESEND_FROM_EMAIL}>`
      : "SheConnects <hello@sheconnects.work>")
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

async function send(to: string, subject: string, html: string) {
  if (!isEmailConfigured) return
  try {
    await getResend().emails.send({ from: FROM, to, subject, html })
  } catch (err) {
    console.error(`[email] Failed to send "${subject}" to ${to}:`, err)
  }
}

// ── Offer events ──────────────────────────────────────────────────────────────

export function emailOfferReceived(to: string, alias: string, clientOrg: string, offerId: string) {
  return send(to, `New offer from ${clientOrg}`, base(
    `You have a new offer, ${alias}`,
    `<b>${clientOrg}</b> has sent you a project offer on SheConnects. Review the details and respond — accept, counter, or decline.`,
    { label: "View offer", url: `${APP_URL}/app/freelancer/offers/${offerId}` }
  ))
}

export function emailOfferAcceptedClient(to: string, clientOrg: string, projectTitle: string, projectId: string) {
  return send(to, "Your offer has been accepted", base(
    "Offer accepted",
    `Great news! The freelancer has accepted your offer for <b>${projectTitle}</b>. Your project is ready to begin — complete payment to kick things off.`,
    { label: "View project", url: `${APP_URL}/app/projects/${projectId}` }
  ))
}

export function emailOfferAcceptedFreelancer(to: string, alias: string, projectTitle: string, projectId: string) {
  return send(to, "You accepted an offer — project created", base(
    `Project created, ${alias}`,
    `You accepted the offer for <b>${projectTitle}</b>. The client will now complete payment to get started.`,
    { label: "View project", url: `${APP_URL}/app/freelancer/projects/${projectId}` }
  ))
}

export function emailCounterReceived(to: string, clientOrg: string, alias: string, offerId: string) {
  return send(to, `Counter-offer from ${alias}`, base(
    "You received a counter-offer",
    `${alias} has sent a counter-offer on your project with <b>${clientOrg}</b>. Review the new terms and accept or withdraw.`,
    { label: "Review counter-offer", url: `${APP_URL}/app/offers/${offerId}` }
  ))
}

export function emailOfferDeclined(to: string, clientOrg: string, alias: string) {
  return send(to, `${alias} declined your offer`, base(
    "Offer declined",
    `${alias} has declined your offer. You can browse other freelancers and send a new offer.`,
    { label: "Browse freelancers", url: `${APP_URL}/app/freelancers` }
  ))
}

// ── Milestone events ──────────────────────────────────────────────────────────

export function emailMilestoneSubmitted(to: string, clientOrg: string, projectTitle: string, milestoneTitle: string, projectId: string) {
  return send(to, `Milestone ready for review — ${projectTitle}`, base(
    "Milestone submitted for your review",
    `The freelancer has submitted <b>${milestoneTitle}</b> on <b>${projectTitle}</b>. Review the work and approve or request a revision.`,
    { label: "Review milestone", url: `${APP_URL}/app/projects/${projectId}` }
  ))
}

export function emailMilestoneApproved(to: string, alias: string, projectTitle: string, milestoneTitle: string, projectId: string) {
  return send(to, `Milestone approved — ${projectTitle}`, base(
    `Great work, ${alias}!`,
    `The client has approved <b>${milestoneTitle}</b> on <b>${projectTitle}</b>.`,
    { label: "View project", url: `${APP_URL}/app/freelancer/projects/${projectId}` }
  ))
}

export function emailMilestoneRevision(to: string, alias: string, projectTitle: string, milestoneTitle: string, projectId: string) {
  return send(to, `Revision requested — ${projectTitle}`, base(
    `Revision requested, ${alias}`,
    `The client has requested a revision on <b>${milestoneTitle}</b> for <b>${projectTitle}</b>. Please review their feedback and resubmit.`,
    { label: "View milestone", url: `${APP_URL}/app/freelancer/projects/${projectId}` }
  ))
}

// ── Payment events ────────────────────────────────────────────────────────────

export function emailPaymentConfirmedClient(to: string, projectTitle: string, projectId: string) {
  return send(to, `Payment confirmed — ${projectTitle}`, base(
    "Payment received",
    `Your payment for <b>${projectTitle}</b> has been confirmed. The freelancer can now begin work.`,
    { label: "View project", url: `${APP_URL}/app/projects/${projectId}` }
  ))
}

export function emailPaymentConfirmedFreelancer(to: string, alias: string, projectTitle: string, projectId: string) {
  return send(to, `Payment received — ${projectTitle}`, base(
    `Payment confirmed, ${alias}`,
    `The client's payment for <b>${projectTitle}</b> has been confirmed. You're good to start working.`,
    { label: "View project", url: `${APP_URL}/app/freelancer/projects/${projectId}` }
  ))
}

// ── Application events ────────────────────────────────────────────────────────

const STATUS_MESSAGES: Record<string, { subject: string; heading: string; body: string }> = {
  SCREENING: {
    subject: "Your application is being reviewed",
    heading: "Application update",
    body: "Good news — your application is moving to the screening stage. Our team will review your profile and may reach out with a few questions.",
  },
  INTERVIEW: {
    subject: "You're invited to an interview",
    heading: "Interview invitation",
    body: "Congratulations! Your application has been shortlisted. Check your email for a link to schedule a call with our team.",
  },
  TRAINING: {
    subject: "You've been accepted — onboarding next",
    heading: "Welcome to SheConnects",
    body: "You've been accepted into our studio! Complete the onboarding training modules to go live on the platform.",
  },
  ACTIVE: {
    subject: "You're live on SheConnects 🎉",
    heading: "You're live!",
    body: "Your profile is now live on SheConnects. Clients can find you, send offers, and start working with you. Log in to set your alias and make sure your profile looks great.",
  },
  REJECTED: {
    subject: "Your SheConnects application",
    heading: "Application update",
    body: "Thank you for applying to SheConnects. After careful review, we're unable to move forward with your application at this time. We appreciate your interest and wish you all the best.",
  },
}

export function emailApplicationStatusChanged(to: string, newStatus: string) {
  const msg = STATUS_MESSAGES[newStatus]
  if (!msg) return Promise.resolve()
  return send(to, msg.subject, base(msg.heading, msg.body, { label: "View dashboard", url: `${APP_URL}/app/freelancer/dashboard` }))
}

// ── Base HTML template ────────────────────────────────────────────────────────

function base(heading: string, body: string, cta?: { label: string; url: string }): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <!-- Logo -->
        <tr><td style="padding-bottom:24px;">
          <span style="font-size:18px;font-weight:700;color:#111827;letter-spacing:-0.5px;">SheConnects</span>
        </td></tr>
        <!-- Card -->
        <tr><td style="background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;padding:32px;">
          <h1 style="margin:0 0 12px;font-size:20px;font-weight:700;color:#111827;line-height:1.3;">${heading}</h1>
          <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">${body}</p>
          ${cta ? `<a href="${cta.url}" style="display:inline-block;background:#6366f1;color:#ffffff;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none;">${cta.label}</a>` : ""}
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding-top:20px;font-size:12px;color:#9ca3af;text-align:center;line-height:1.6;">
          SheConnects SRL · Milan, Italy<br>
          <a href="${APP_URL}" style="color:#9ca3af;">sheconnects.work</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
