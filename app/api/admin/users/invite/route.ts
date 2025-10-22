import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, name, role, message } = await request.json();

    // Validate required fields
    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create user with temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await import("bcryptjs").then(bcrypt => 
      bcrypt.hash(tempPassword, 12)
    );

    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        password: hashedPassword,
        role: role as "ADMIN" | "SERVICE_PROVIDER" | "USER",
        emailVerified: new Date(), // Auto-verify for invited users
      },
    });

    // Send invitation email
    try {
      await sendEmail({
        to: email,
        subject: "Welcome to Sustainable Tourism Platform",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669;">Welcome to Sustainable Tourism Platform!</h2>
            <p>Hello ${name || "there"},</p>
            <p>You have been invited to join our sustainable tourism platform as a <strong>${role.toLowerCase().replace('_', ' ')}</strong>.</p>
            <p>Your account has been created with the following details:</p>
            <ul>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Temporary Password:</strong> ${tempPassword}</li>
              <li><strong>Role:</strong> ${role.toLowerCase().replace('_', ' ')}</li>
            </ul>
            <p>Please log in and change your password immediately for security reasons.</p>
            ${message ? `<p><strong>Personal Message:</strong> ${message}</p>` : ''}
            <div style="margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/auth/signin" 
                 style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Log In Now
              </a>
            </div>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>The Sustainable Tourism Team</p>
          </div>
        `,
      });

      return NextResponse.json({
        success: true,
        message: `Invitation sent to ${email}`,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (emailError) {
      console.error("Error sending invitation email:", emailError);
      
      // User was created but email failed - still return success but with warning
      return NextResponse.json({
        success: true,
        message: `User created but invitation email failed. Please contact ${email} manually.`,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        warning: "Email delivery failed",
      });
    }
  } catch (error) {
    console.error("Error inviting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
