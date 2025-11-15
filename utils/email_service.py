#!/usr/bin/env python3
"""
Email Service for Real Estate CRM
Handles sending emails for various notifications
"""

from flask import current_app
from flask_mail import Message
import logging

def send_employee_welcome_email(employee_email, employee_name, username, password, admin_name="Admin"):
    """
    Send welcome email to new employee with login credentials
    
    Args:
        employee_email (str): Employee's email address
        employee_name (str): Employee's full name
        username (str): Employee's username/email for login
        password (str): Employee's temporary password
        admin_name (str): Name of admin who created the account
    """
    try:
        # Create email message
        msg = Message(
            subject="Welcome to Real Estate CRM - Your Account Details",
            recipients=[employee_email],
            sender=current_app.config['MAIL_DEFAULT_SENDER']
        )
        
        # Email body with HTML formatting
        msg.html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .credentials {{ background: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0; }}
                .credential-item {{ margin: 10px 0; }}
                .label {{ font-weight: bold; color: #555; }}
                .value {{ background: #f0f0f0; padding: 8px; border-radius: 4px; font-family: monospace; }}
                .warning {{ background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 14px; }}
                .button {{ display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏢 Real Estate CRM</h1>
                    <h2>Welcome to the Team!</h2>
                </div>
                
                <div class="content">
                    <p>Dear <strong>{employee_name}</strong>,</p>
                    
                    <p>Welcome to our Real Estate CRM system! Your account has been created by <strong>{admin_name}</strong> and you can now access the system.</p>
                    
                    <div class="credentials">
                        <h3>🔐 Your Login Credentials</h3>
                        <div class="credential-item">
                            <span class="label">Email/Username:</span><br>
                            <span class="value">{username}</span>
                        </div>
                        <div class="credential-item">
                            <span class="label">Temporary Password:</span><br>
                            <span class="value">{password}</span>
                        </div>
                    </div>
                    
                    <div class="warning">
                        <strong>⚠️ Important Security Notice:</strong><br>
                        • Please change your password after your first login<br>
                        • Keep your credentials secure and don't share them<br>
                        • Contact your administrator if you have any issues
                    </div>
                    
                    <p>You can access the system by visiting: <strong>http://localhost:3000</strong></p>
                    
                    <div style="text-align: center;">
                        <a href="http://localhost:3000/login" class="button">Login to CRM</a>
                    </div>
                    
                    <p>If you have any questions or need assistance, please don't hesitate to contact your administrator.</p>
                    
                    <p>Best regards,<br>
                    <strong>Real Estate CRM Team</strong></p>
                </div>
                
                <div class="footer">
                    <p>This is an automated message. Please do not reply to this email.</p>
                    <p>© 2024 Real Estate CRM. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Send email
        from flask_mail import Mail
        mail = Mail(current_app)
        mail.send(msg)
        
        logging.info(f"Welcome email sent successfully to {employee_email}")
        return True
        
    except Exception as e:
        logging.error(f"Failed to send welcome email to {employee_email}: {str(e)}")
        return False

def send_password_reset_email(employee_email, employee_name, reset_token):
    """
    Send password reset email to employee
    
    Args:
        employee_email (str): Employee's email address
        employee_name (str): Employee's full name
        reset_token (str): Password reset token
    """
    try:
        msg = Message(
            subject="Password Reset - Real Estate CRM",
            recipients=[employee_email],
            sender=current_app.config['MAIL_DEFAULT_SENDER']
        )
        
        reset_url = f"http://localhost:3000/reset-password?token={reset_token}"
        
        msg.html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 14px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏢 Real Estate CRM</h1>
                    <h2>Password Reset Request</h2>
                </div>
                
                <div class="content">
                    <p>Dear <strong>{employee_name}</strong>,</p>
                    
                    <p>We received a request to reset your password for your Real Estate CRM account.</p>
                    
                    <div style="text-align: center;">
                        <a href="{reset_url}" class="button">Reset Password</a>
                    </div>
                    
                    <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
                    
                    <p>This link will expire in 24 hours for security reasons.</p>
                    
                    <p>Best regards,<br>
                    <strong>Real Estate CRM Team</strong></p>
                </div>
                
                <div class="footer">
                    <p>This is an automated message. Please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        from flask_mail import Mail
        mail = Mail(current_app)
        mail.send(msg)
        
        logging.info(f"Password reset email sent successfully to {employee_email}")
        return True
        
    except Exception as e:
        logging.error(f"Failed to send password reset email to {employee_email}: {str(e)}")
        return False
