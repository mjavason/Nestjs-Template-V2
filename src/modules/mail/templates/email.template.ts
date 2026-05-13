import { APP_NAME } from '@configs/constants/constants';

const emailTemplates = {
  welcomeAfter8hrs: (name: string) => {
    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to ${APP_NAME}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        color: #333333;
                        line-height: 1.6;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background-color: #f3f3f3;
                        padding: 20px;
                        text-align: center;
                    }
                    .header h1 {
                        color: #333333;
                        font-size: 24px;
                    }
                    .content {
                        padding: 20px;
                        background-color: #ffffff;
                    }
                    .content h2 {
                        color: #444444;
                        font-size: 20px;
                    }
                    .footer {
                        padding: 20px;
                        text-align: center;
                        font-size: 12px;
                        color: #777777;
                        background-color: #f3f3f3;
                    }
                    .footer p {
                        margin: 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Thank You!</h1>
                        <p>From Bola Edwards, Co-Founder</p>
                    </div>

                    <div class="content">
                        <p>Dear ${name},</p>

                        <p>We are thrilled to personally welcome you to <strong>${APP_NAME}</strong> and express our heartfelt gratitude for being an integral part of our beta community. As the founders, we are humbled by your trust and enthusiasm in embracing our vision.</p>

                        <p>Your involvement at this early stage is invaluable as we shape the future of your child or ward’s development together. Your feedback, insights, and experiences will play a pivotal role in guiding our platform's development and ensuring that we deliver a solution that truly meets your needs.</p>

                        <p>After more than 15 years of hands-on experience working with children in the realm of creative arts and storytelling, we have witnessed firsthand the profound impact these methods have on a child's developmental journey. Our in-person initiatives have touched the lives of numerous children over the years. Recognizing the potential to extend our impact to a broader audience, we embarked on the journey to leverage technology. The <strong>${APP_NAME}</strong> solution is born out of our passion to assist parents in nurturing their children into the exceptional individuals they are meant to be. Our goal is to provide support to parents as they navigate the formative years of their children's lives, guiding them through self-discovery and skill acquisition.</p>

                        <p>During this beta phase, we encourage you to explore the features, test functionalities, and share your thoughts openly with us. Your input will not only help us improve but also create a platform that empowers you and others in our community to achieve great things.</p>

                        <p>We are here to listen, learn, and collaborate with you every step of the way. Your journey with <strong>${APP_NAME}</strong> is not just about using a solution; it's about co-creating an experience that resonates with you on a personal level.</p>

                        <p>Thank you for joining us on this exciting adventure. Together, we can redefine what is possible and shape a future where “${APP_NAME}” becomes more than a solution—it becomes a transformative tool to help your children grow into the amazing leaders that they can be.</p>

                        <p>If you have any questions, insights, or feedback, please don't hesitate to connect with us directly at <a href="mailto:founders@proudafricanroots.com">founders@proudafricanroots.com</a>. Your voice matters, and we are here to ensure that it is heard.</p>

                        <p>With sincere love and appreciation,</p>

                        <p>Bola & Patrick Edwards<br>
                        Co-Founders, Proud African Roots</p>
                    </div>

                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
  },
  welcome: (name: string) => {
    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to ${APP_NAME}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        color: #333333;
                        line-height: 1.6;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background-color: #f3f3f3;
                        padding: 20px;
                        text-align: center;
                    }
                    .header h1 {
                        color: #333333;
                        font-size: 24px;
                    }
                    .content {
                        padding: 20px;
                        background-color: #ffffff;
                    }
                    .content h2 {
                        color: #444444;
                        font-size: 20px;
                    }
                    .footer {
                        padding: 20px;
                        text-align: center;
                        font-size: 12px;
                        color: #777777;
                        background-color: #f3f3f3;
                    }
                    .footer p {
                        margin: 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome!</h1>
                    </div>

                    <div class="content">
                        <p>Dear ${name},</p>

                        <p>Welcome to <strong>${APP_NAME}</strong>! We are thrilled to have you on board and excited to partner with you on your journey towards getting the best version of your child. Get ready to unlock a world of fun, adventure, and learning for your child.</p>

                        <h3>Here's a quick guide to help you get started:</h3>
                        <ul>
                            <li><strong>Add your child or ward:</strong> Add your child to begin tracking their progress. See content completed, badges won, and certificates awarded.</li>
                            <li><strong>Set a control PIN:</strong> Add a control PIN to your child’s or ward’s profile to ensure parental control and safety.</li>
                            <li><strong>Subscribe to a plan:</strong> Subscribe to a plan for one or multiple children to ensure they have access at all times.</li>
                            <li><strong>Add a card:</strong> Add a payment method to ease your future payments.</li>
                        </ul>

                        <p>Once again, welcome to “${APP_NAME}.” We are excited to partner with you on your child's or ward’s development journey and look forward to hearing about the positive impact the ${APP_NAME} platform will have.</p>
                        
                        <p>If you have any questions or need further assistance, please don't hesitate to reach out by simply replying to this email.</p>

                        <p>Warm Regards,<br>
                        The Proud African Roots Team</p>
                    </div>

                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
  },
  verifyEmail: (name: string, verificationLink: string) => {
    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verify Your Email</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        color: #333333;
                        line-height: 1.6;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background-color: #f3f3f3;
                        padding: 20px;
                        text-align: center;
                    }
                    .header h1 {
                        color: #333333;
                        font-size: 24px;
                    }
                    .content {
                        padding: 20px;
                        background-color: #ffffff;
                    }
                    .content h2 {
                        color: #444444;
                        font-size: 20px;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        margin: 20px 0;
                        font-size: 16px;
                        color: #ffffff;
                        background-color: #007BFF;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                    .footer {
                        padding: 20px;
                        text-align: center;
                        font-size: 12px;
                        color: #777777;
                        background-color: #f3f3f3;
                    }
                    .footer p {
                        margin: 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Email Verification</h1>
                    </div>

                    <div class="content">
                        <p>Dear ${name},</p>

                        <p>Welcome to <strong>${APP_NAME}</strong>! To complete your registration and gain access to all our features, please verify your email address by clicking the button below.</p>

                        <a href="${verificationLink}" class="button">Verify Email</a>

                        <p>If the button above doesn't work, please copy and paste the following link into your web browser:</p>
                        <p><a href="${verificationLink}">${verificationLink}</a></p>

                        <p>Thank you for joining us! We’re excited to help you and your child unlock a world of learning, adventure, and growth.</p>

                        <p>Warm Regards,<br>
                        The ${APP_NAME} Team</p>
                    </div>

                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
  },
  forgotPassword: (name: string, resetLink: string) => {
    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Your Password</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        color: #333333;
                        line-height: 1.6;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background-color: #f3f3f3;
                        padding: 20px;
                        text-align: center;
                    }
                    .header h1 {
                        color: #333333;
                        font-size: 24px;
                    }
                    .content {
                        padding: 20px;
                        background-color: #ffffff;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        margin: 20px 0;
                        font-size: 16px;
                        color: #ffffff;
                        background-color: #FF6347;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                    .footer {
                        padding: 20px;
                        text-align: center;
                        font-size: 12px;
                        color: #777777;
                        background-color: #f3f3f3;
                    }
                    .footer p {
                        margin: 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Reset Request</h1>
                    </div>

                    <div class="content">
                        <p>Dear ${name},</p>

                        <p>We received a request to reset the password for your <strong>${APP_NAME}</strong> account. If you made this request, please click the button below to set a new password:</p>

                        <a href="${resetLink}" class="button">Reset Password</a>

                        <p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>

                        <p>If the button above doesn't work, please copy and paste the following link into your web browser:</p>
                        <p><a href="${resetLink}">${resetLink}</a></p>

                        <p>For any further assistance, feel free to reach out by replying to this email.</p>

                        <p>Warm Regards,<br>
                        The ${APP_NAME} Team</p>
                    </div>

                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
  },
  subscriptionExpiring: (parentName: string) => {
    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Your Subscription is About to Expire</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        color: #333333;
                        line-height: 1.6;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background-color: #f3f3f3;
                        padding: 20px;
                        text-align: center;
                    }
                    .header h1 {
                        color: #333333;
                        font-size: 24px;
                    }
                    .content {
                        padding: 20px;
                        background-color: #ffffff;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        margin: 20px 0;
                        font-size: 16px;
                        color: #ffffff;
                        background-color: #FF6347;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                    .footer {
                        padding: 20px;
                        text-align: center;
                        font-size: 12px;
                        color: #777777;
                        background-color: #f3f3f3;
                    }
                    .footer p {
                        margin: 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Your Subscription is About to Expire</h1>
                    </div>

                    <div class="content">
                        <p>Dear ${parentName},</p>

                        <p>Please be informed that your subscription to <strong>${APP_NAME}</strong> will be automatically renewed in 72 hours.</p>

                        <p>Kindly note that if you do not renew your subscription by then, you will lose access to the “${APP_NAME}” app solution.</p>

                        <p>Thank you for choosing ${APP_NAME}!</p>

                        <p>Warm Regards,<br>
                        The ${APP_NAME} Team</p>
                    </div>

                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
  },

  invite_admin: (data: { name: string; url: string; password: string }) => `
<!--
Online HTML, CSS and JavaScript editor to run code online.
-->
<!DOCTYPE html>
<html lang="en<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="x-apple-disable-message-reformatting" />
    <style>
        body {
            background-color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            margin: 0;
            padding: 0;
        }
        .hidden-text {
            display: none;
            overflow: hidden;
            line-height: 1px;
            opacity: 0;
            max-height: 0;
            max-width: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px 0 48px;
        }
        .email-content {
            text-align: centeleftr;
            padding: 20px;
        }
        .email-content img {
            display: block;
            margin: 0 auto;
            outline: none;
            border: none;
            text-decoration: none;
        }
        .email-content p {
            font-size: 16px;
            line-height: 26px;
            margin: 16px 0;
        }
        .email-content a {
            display: inline-block;
            background-color: #5f51e8;
            border-radius: 3px;
            color: #fff;
            font-size: 16px;
            text-align: left
                                                                                                                                ;
            text-decoration: none;
            padding: 12px;
        }
        .email-footer {
            font-size: 12px;
            line-height: 24px;
            color: #8898aa;
            margin: 16px 0;
        }
        .divider {
            width: 100%;
            border-top: 1px solid #eaeaea;
            margin: 20px 0;
        }
    </style>
</head>

<body>
    <div class="hidden-text">
    </div>

    <div class="email-container">
        <div class="email-content">
            <img src="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" alt="${APP_NAME}" width="170" height="50" />
            <p>Hi ${data.name},</p>
            <p>You have been invited to join ${APP_NAME} as an admin. Your default password is <strong>${data.password}</strong>. Use the forgot password process to set it to whatever you prefer.</p>
            <a href="${data.url}" target="_blank">Sign In</a>
            <p>Best,<br />${APP_NAME} team</p>
            <hr class="divider" />
            <p class="email-footer">470 Noor Ave STE B #1148, South San Francisco, CA 94080</p>
        </div>
    </div>
</body>

</html>
`,
};

export default emailTemplates;
