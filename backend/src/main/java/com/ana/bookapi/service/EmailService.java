package com.ana.bookapi.service;

import com.ana.bookapi.config.BrevoConfig;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender sender;
    private final BrevoConfig br;

    public EmailService(JavaMailSender sender, BrevoConfig br) {
        this.sender = sender;
        this.br = br;
    }

    public void sendEmail(String to, String subject, String username, String link) throws MessagingException {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("Pages ń Parchment<pagesnparchments@gmail.com>");
        message.setTo(to);
        message.setSubject(subject);

        String plainText = """
                My deareast %s,
                
                We are most gratifed to welcome you into our quiet fellowship.
                Please confirm your email by visiting: %s
                
                This link expires in 15 minutes.
                """.formatted(username, link);
        message.setText(plainText);

        //html template
        String htmlText = String.format("""
                 <!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            </head>
                            <body style="margin: 0; padding: 0; font-family: 'Georgia', 'Times New Roman', serif; background-color: #f5f1e9; color: #2c241a;">
                                <div style="max-width: 600px; margin: 0 auto; padding: 30px 20px; background-color: #fffcf7; border: 1px solid #e6d9cc; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                
                                    <!-- Header with Victorian border -->
                                    <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #d4b68a;">
                                        <h1 style="font-family: 'Georgia', serif; color: #5e3c28; font-weight: normal; letter-spacing: 2px; margin: 0; font-size: 28px;">Pages & Parchment</h1>
                                        <p style="color: #8b6f4c; font-style: italic; margin: 5px 0 0 0; font-size: 14px;">A Quiet Fellowship of Readers</p>
                                    </div>
                
                                    <!-- Content -->
                                    <div style="padding: 30px 20px; line-height: 1.8; color: #3e3329;">
                                        <p style="font-size: 16px; margin-bottom: 25px;">My dearest <strong style="color: #5e3c28;">%s</strong>,</p>
                
                                        <p style="font-size: 16px; margin-bottom: 20px;">We are most gratified to welcome you into our quiet fellowship. Before you may cross our threshold, we humbly ask that you confirm the validity of your correspondence address.</p>
                
                                        <div style="text-align: center; margin: 40px 0;">
                                            <a href="%s" style="background-color: #8b6f4c; color: #fffcf7; padding: 14px 32px; text-decoration: none; font-family: 'Georgia', serif; letter-spacing: 1px; font-size: 15px; border-radius: 4px; border: 1px solid #5e3c28; display: inline-block;">Confirm Your Email</a>
                                        </div>
                
                                        <p style="font-size: 14px; color: #6b5a4a; font-style: italic; margin-bottom: 20px;">This invitation shall expire in 15 minutes, as is the custom of our society.</p>
                
                                        <p style="font-size: 14px; color: #6b5a4a; margin-bottom: 10px;">Should the button above fail to open, you may copy and paste this passage into your browser:</p>
                                        <p style="font-size: 13px; background-color: #f5f1e9; padding: 12px; border-left: 3px solid #d4b68a; font-family: monospace; word-break: break-all; color: #5e3c28;">%s</p>
                                    </div>
                
                                    <!-- Footer with Victorian flourish -->
                                    <div style="text-align: center; padding-top: 25px; border-top: 1px solid #e6d9cc; font-size: 12px; color: #8b7a66;">
                                        <p style="margin: 5px 0;">Pages & Parchment — A Sanctuary for the Literary Soul</p>
                                        <p style="margin: 5px 0; font-style: italic;">"In the company of books, we find ourselves"</p>
                                        <p style="margin: 15px 0 5px 0; font-size: 11px;">© 2026 Pages & Parchment. All rights reserved.</p>
                                    </div>
                                </div>
                            </body>
                            </html>
                """, username, link, link);

        MimeMessage mimeMessage = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        try {
            helper.setFrom("Pages ń Parchment<pagesnparchments@gmail.com>");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(plainText, htmlText); // true = html

            // Replace with your full HTML template from VerificationTokenService
            String html = """
                    <html>
                    <!-- your full Victorian HTML here -->
                    </html>
                    """.formatted(username, link);

            helper.setText(plainText, htmlText);
            sender.send(mimeMessage);
            System.out.println("Verification email sent successfully to:" + to);
        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Failed to send email: " + e.getMessage());
        }
    }
}
