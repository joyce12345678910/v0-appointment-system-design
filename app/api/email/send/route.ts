import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { templateName, recipientEmail, recipientName, variables } = await request.json()

    if (!templateName || !recipientEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Fetch email template
    const { data: template, error: templateError } = await supabase
      .from("email_templates")
      .select("*")
      .eq("template_name", templateName)
      .single()

    if (templateError || !template) {
      console.error("Template not found:", templateError)
      return NextResponse.json({ error: "Email template not found" }, { status: 404 })
    }

    // Replace variables in template
    let subject = template.subject
    let body = template.body

    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        subject = subject.replace(`{{${key}}}`, String(value))
        body = body.replace(`{{${key}}}`, String(value))
      })
    }

    // In production, integrate with SendGrid, Mailgun, or AWS SES
    // For now, log the email (Supabase can be configured to send emails)
    console.log(`Email sent from ${template.sender_name} <${template.sender_email}> to ${recipientEmail}`)
    console.log(`Subject: ${subject}`)
    console.log(`Body: ${body}`)

    // TODO: Integrate with actual email service provider
    // const emailResult = await sendEmailViaProvider({
    //   from: `${template.sender_name} <${template.sender_email}>`,
    //   to: recipientEmail,
    //   subject,
    //   body
    // })

    return NextResponse.json({
      success: true,
      message: "Email queued for sending",
      email: {
        from: `${template.sender_name} <${template.sender_email}>`,
        to: recipientEmail,
        subject,
      },
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
