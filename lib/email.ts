export interface EmailOptions {
  templateName: string
  recipientEmail: string
  recipientName?: string
  variables?: Record<string, string | number>
}

export async function sendBrandedEmail(options: EmailOptions): Promise<void> {
  try {
    const response = await fetch("/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to send email")
    }

    console.log(`Email sent to ${options.recipientEmail}`)
  } catch (error) {
    console.error("Error sending email:", error)
    // Don't throw - email failures shouldn't block the main operation
  }
}

export function formatAppointmentDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
