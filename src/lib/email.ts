import { Resend } from 'resend'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    throw new Error('RESEND_API_KEY environment variable is not set')
  }
  return new Resend(key)
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@tallinn-tours.com'
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@tallinn-tours.com'
const APP_BASE_URL = process.env.APP_BASE_URL || 'https://tallinn-tours.com'

const brandStyles = `
  <style>
    body { margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif; background-color: #f4f1eb; }
    .wrapper { background-color: #f4f1eb; padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 4px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.12); }
    .header { background-color: #1a1f2e; padding: 36px 40px; text-align: center; }
    .header-logo { color: #c9a84c; font-size: 24px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 4px; }
    .header-tagline { color: #8a8fa0; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin: 0; }
    .body { padding: 40px; color: #2c2c2c; }
    .greeting { font-size: 22px; color: #1a1f2e; margin: 0 0 20px; font-weight: normal; }
    .lead { font-size: 16px; line-height: 1.7; color: #444; margin: 0 0 28px; }
    .card { background-color: #1a1f2e; border-radius: 4px; padding: 28px 32px; margin: 0 0 28px; }
    .card-title { color: #c9a84c; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 20px; font-family: Arial, sans-serif; }
    .card-row { display: flex; margin-bottom: 12px; border-bottom: 1px solid #2d3347; padding-bottom: 12px; }
    .card-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    .card-label { color: #8a8fa0; font-size: 13px; font-family: Arial, sans-serif; width: 160px; flex-shrink: 0; padding-top: 2px; }
    .card-value { color: #ffffff; font-size: 15px; font-family: Arial, sans-serif; flex: 1; }
    .code-box { background-color: #f8f5ef; border: 2px dashed #c9a84c; border-radius: 4px; padding: 20px; text-align: center; margin: 0 0 28px; }
    .code-label { color: #888; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-family: Arial, sans-serif; margin: 0 0 8px; }
    .code-value { color: #1a1f2e; font-size: 24px; font-family: 'Courier New', monospace; font-weight: bold; letter-spacing: 4px; margin: 0; }
    .btn { display: inline-block; background-color: #c9a84c; color: #1a1f2e !important; text-decoration: none; padding: 14px 32px; border-radius: 3px; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin: 4px 0; }
    .btn-outline { display: inline-block; border: 2px solid #c9a84c; color: #c9a84c !important; text-decoration: none; padding: 12px 30px; border-radius: 3px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin: 4px 0; }
    .divider { border: none; border-top: 1px solid #e8e4db; margin: 28px 0; }
    .small { font-size: 13px; color: #888; line-height: 1.6; font-family: Arial, sans-serif; }
    .footer { background-color: #1a1f2e; padding: 28px 40px; text-align: center; }
    .footer-text { color: #555d75; font-size: 12px; font-family: Arial, sans-serif; line-height: 1.8; margin: 0; }
    .footer-brand { color: #c9a84c; font-weight: bold; }
  </style>
`

function buildFooter() {
  return `
    <div class="footer">
      <p class="footer-text">
        <span class="footer-brand">Tallinn Tours</span><br>
        Old Town, Tallinn, Estonia<br>
        <a href="${APP_BASE_URL}" style="color: #8a8fa0; text-decoration: none;">${APP_BASE_URL}</a>
      </p>
    </div>
  `
}

export async function sendBookingConfirmation(data: {
  to: string
  name: string
  tourTitle: string
  tourDate: string
  tourTime: string
  meetingLocation: string
  groupSize: number
  confirmationCode: string
  cancellationUrl: string
}): Promise<void> {
  const firstName = data.name.split(' ')[0]

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Booking Confirmed — Tallinn Tours</title>${brandStyles}</head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <p class="header-logo">Tallinn Tours</p>
            <p class="header-tagline">Discover the Medieval Heart of Estonia</p>
          </div>
          <div class="body">
            <h1 class="greeting">You're booked, ${firstName}!</h1>
            <p class="lead">
              Your spot on <strong>${data.tourTitle}</strong> is confirmed. We can't wait to show you the best of Tallinn. Please save this email — your confirmation code is below.
            </p>

            <div class="card">
              <p class="card-title">Booking Details</p>
              <div class="card-row">
                <span class="card-label">Tour</span>
                <span class="card-value">${data.tourTitle}</span>
              </div>
              <div class="card-row">
                <span class="card-label">Date</span>
                <span class="card-value">${data.tourDate}</span>
              </div>
              <div class="card-row">
                <span class="card-label">Meeting time</span>
                <span class="card-value">${data.tourTime}</span>
              </div>
              <div class="card-row">
                <span class="card-label">Meeting point</span>
                <span class="card-value">${data.meetingLocation}</span>
              </div>
              <div class="card-row">
                <span class="card-label">Group size</span>
                <span class="card-value">${data.groupSize} ${data.groupSize === 1 ? 'person' : 'people'}</span>
              </div>
            </div>

            <div class="code-box">
              <p class="code-label">Your confirmation code</p>
              <p class="code-value">${data.confirmationCode}</p>
            </div>

            <p class="lead" style="font-size:15px;">
              Please arrive <strong>5–10 minutes before the tour starts</strong>. Your guide will be at the meeting point holding a yellow Tallinn Tours flag.
            </p>

            <hr class="divider">

            <p class="small">
              Need to cancel? We understand plans change. You can cancel your booking at any time using the link below:
            </p>
            <p style="text-align:center; margin: 20px 0;">
              <a href="${data.cancellationUrl}" class="btn-outline">Cancel My Booking</a>
            </p>

            <hr class="divider">

            <p class="small">
              Questions? Reply to this email or visit <a href="${APP_BASE_URL}" style="color: #c9a84c;">${APP_BASE_URL}</a>. We reply within a few hours on weekdays.
            </p>
          </div>
          ${buildFooter()}
        </div>
      </div>
    </body>
    </html>
  `

  await getResend().emails.send({
    from: `Tallinn Tours <${FROM_EMAIL}>`,
    to: data.to,
    subject: `Booking confirmed — ${data.tourTitle} on ${data.tourDate}`,
    html,
  })
}

export async function sendBookingCancellation(data: {
  to: string
  name: string
  tourTitle: string
  tourDate: string
}): Promise<void> {
  const firstName = data.name.split(' ')[0]

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Booking Cancelled — Tallinn Tours</title>${brandStyles}</head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <p class="header-logo">Tallinn Tours</p>
            <p class="header-tagline">Discover the Medieval Heart of Estonia</p>
          </div>
          <div class="body">
            <h1 class="greeting">Booking cancelled, ${firstName}</h1>
            <p class="lead">
              Your booking for <strong>${data.tourTitle}</strong> on <strong>${data.tourDate}</strong> has been successfully cancelled. We're sorry to see you go!
            </p>

            <div class="card">
              <p class="card-title">Cancelled Booking</p>
              <div class="card-row">
                <span class="card-label">Tour</span>
                <span class="card-value">${data.tourTitle}</span>
              </div>
              <div class="card-row">
                <span class="card-label">Date</span>
                <span class="card-value">${data.tourDate}</span>
              </div>
              <div class="card-row">
                <span class="card-label">Status</span>
                <span class="card-value" style="color: #e07070;">Cancelled</span>
              </div>
            </div>

            <p class="lead" style="font-size:15px;">
              If you'd like to join us another time, we'd love to have you. Browse our upcoming tours and book your next Tallinn adventure below.
            </p>
            <p style="text-align:center; margin: 20px 0;">
              <a href="${APP_BASE_URL}/tours" class="btn">Browse Upcoming Tours</a>
            </p>

            <hr class="divider">
            <p class="small">
              If you cancelled by mistake or have any questions, please reply to this email and we'll do our best to help.
            </p>
          </div>
          ${buildFooter()}
        </div>
      </div>
    </body>
    </html>
  `

  await getResend().emails.send({
    from: `Tallinn Tours <${FROM_EMAIL}>`,
    to: data.to,
    subject: `Booking cancelled — ${data.tourTitle}`,
    html,
  })
}

export async function sendAdminNotification(data: {
  tourTitle: string
  guestName: string
  groupSize: number
  email: string
  tourDate: string
}): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>New Booking — ${data.tourTitle}</title>${brandStyles}</head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <p class="header-logo">Tallinn Tours</p>
            <p class="header-tagline">Admin Notification</p>
          </div>
          <div class="body">
            <h1 class="greeting">New booking received</h1>
            <p class="lead">
              A new booking has just been made for <strong>${data.tourTitle}</strong>.
            </p>

            <div class="card">
              <p class="card-title">Booking Details</p>
              <div class="card-row">
                <span class="card-label">Tour</span>
                <span class="card-value">${data.tourTitle}</span>
              </div>
              <div class="card-row">
                <span class="card-label">Tour date</span>
                <span class="card-value">${data.tourDate}</span>
              </div>
              <div class="card-row">
                <span class="card-label">Guest name</span>
                <span class="card-value">${data.guestName}</span>
              </div>
              <div class="card-row">
                <span class="card-label">Email</span>
                <span class="card-value">${data.email}</span>
              </div>
              <div class="card-row">
                <span class="card-label">Group size</span>
                <span class="card-value">${data.groupSize} ${data.groupSize === 1 ? 'person' : 'people'}</span>
              </div>
            </div>

            <p style="text-align:center; margin: 20px 0;">
              <a href="${APP_BASE_URL}/admin" class="btn">View in Admin Panel</a>
            </p>
          </div>
          ${buildFooter()}
        </div>
      </div>
    </body>
    </html>
  `

  await getResend().emails.send({
    from: `Tallinn Tours <${FROM_EMAIL}>`,
    to: ADMIN_NOTIFICATION_EMAIL,
    subject: `New booking: ${data.guestName} (${data.groupSize}p) — ${data.tourTitle}`,
    html,
  })
}
