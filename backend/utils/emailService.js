import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kaushanibhagya9@gmail.com",
    pass: "vfoauymphkhxqlil",  
  },
});

export const sendResetEmail = async (to, resetLink) => {
  await transporter.sendMail({
    from: `"LOOPI Security" <kaushanibhagya9@gmail.com>`,
    to,
    subject: "Reset Your Password",
    html: `
            <div style="margin:0;padding:0;background:#F5F7FA;font-family:'Inter',Arial,sans-serif;">
              <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.08);overflow:hidden;">
                
                <!-- TOP BRAND BAR -->
                <div style="height:4px;background:linear-gradient(to right,#1B5E20,#1976D2);"></div>

                <div style="padding:32px; text-align:center;">

                  <!-- ICON -->
                  <div style="width:56px;height:56px;background:#1B5E20;border-radius:14px;margin:0 auto 16px auto;display:flex;align-items:center;justify-content:center;">
                    <span style="font-size:24px;color:white; margin-top:10px; margin-left:13px;">🔐</span>
                  </div>

                  <!-- TITLE -->
                  <h2 style="margin:0;font-size:20px;color:#111827;font-weight:600;">
                    Reset Your Password
                  </h2>

                  <!-- SUBTEXT -->
                  <p style="margin-top:8px;font-size:13px;color:#6B7280;line-height:1.5;">
                    Secure your account by setting a new password. Click the button below to continue.
                  </p>

                  <!-- BUTTON -->
                  <div style="margin-top:24px;">
                    <a href="${resetLink}" 
                      style="
                        background:#1B5E20;
                        color:white;
                        padding:12px 26px;
                        border-radius:10px;
                        font-size:14px;
                        font-weight:600;
                        text-decoration:none;
                        display:inline-block;
                        box-shadow:0 4px 12px rgba(27,94,32,0.25);
                      ">
                      Reset Password
                    </a>
                  </div>

                  <!-- ALT TEXT -->
                  <p style="margin-top:20px;font-size:12px;color:#9CA3AF;">
                    If the button doesn’t work, copy and paste this link:
                  </p>

                  <!-- LINK -->
                  <p style="font-size:12px;color:#2563EB;word-break:break-all;">
                    ${resetLink}
                  </p>

                  <!-- EXPIRY -->
                  <p style="margin-top:16px;font-size:12px;color:#9CA3AF;">
                    This link will expire in <strong>15 minutes</strong>.
                  </p>

                  <!-- DIVIDER -->
                  <div style="margin:24px 0;border-top:1px solid #E5E7EB;"></div>

                  <!-- FOOTER -->
                  <p style="font-size:11px;color:#9CA3AF;line-height:1.4;">
                    If you did not request this password reset, you can safely ignore this email.
                  </p>

                  <!-- BRAND -->
                  <p style="margin-top:10px;font-size:11px;color:#6B7280;">
                    © LOOPI Security
                  </p>

                </div>
              </div>
            </div>
            `
  });
};