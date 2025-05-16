// To Send Email, we can only write inline CSS in the HTML content. 

export const mailVerifyTemplate = `<div style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f7f7f7; color: #333;">

    <div class="maincontainer" style="background-color: #ffffff; width: 100%; max-width: 600px; margin: 50px auto; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center; border-top: 5px solid #4CAF50;">
        <h1 style="font-size: 28px; color: #2d3e50; margin-bottom: 20px;">Verification Email for Job Hunters</h1>
        <p style="font-size: 18px; color: #555555; margin-bottom: 30px;">
            Hi USERNAME ! Please click the button below to verify and activate your account.
        </p>
        <a href="verification_link" style="text-decoration: none;">
            <div style="display: inline-block; padding: 12px 25px; font-size: 18px; font-weight: bold; background-color: #4CAF50; color: #ffffff; border-radius: 5px; transition: background-color 0.3s ease;">
                Verify
            </div>
        </a>
        <div class="footer" style="margin-top: 40px; font-size: 14px; color: #888;">
            &copy; 2025 Job Hunters. All Rights Reserved.
        </div>
    </div>

</div>`


export const forgotPasswordOTP = `<div style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f7f7f7; color: #333;">

<div class="maincontainer" style="background-color: #ffffff; width: 100%; max-width: 600px; margin: 50px auto; padding: 40px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); text-align: center; border-top: 5px solid #4CAF50;">
    <h1 style="font-size: 30px; color: #2d3e50; font-weight: 600; margin-bottom: 25px;">Account Verification</h1>
    <p style="font-size: 18px; color: #555555; margin-bottom: 25px; line-height: 1.6;">
        Hi <span style="font-weight: bold; color: #2d3e50;">USERNAME</span>, <br>
        We received a request to verify your account. Please use the following One-Time Password (OTP) to complete the verification:
    </p>
    
    <div style="font-size: 26px; font-weight: bold; color: #4CAF50; padding: 15px 30px; background-color: #f1f1f1; border-radius: 8px; display: inline-block; margin-bottom: 25px;">
        OTP: <span style="color: #2d3e50;">OTP_VALUE</span>
    </div>

    <p style="font-size: 16px; color: #555555; margin-bottom: 25px; line-height: 1.5;">
        Please note, this OTP is valid for only 10 minutes. For security purposes, do not share it with anyone.
    </p>

    <div style="font-size: 14px; color: #888888; margin-top: 40px; border-top: 1px solid #f1f1f1; padding-top: 20px;">
        &copy; 2025 Job Hunters. All Rights Reserved.
    </div>
</div>

</div>`
