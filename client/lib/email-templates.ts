// Email Templates for the Recruitment System

export const emailTemplates = {
  // Registration Confirmation Email
  registration: {
    subject: "Welcome to HackerRank Campus Crew!",
    html: (userName: string, email: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://your-domain.com/Logo Light Wide.png" alt="HackerRank Campus Crew" style="height: 60px;">
        </div>
        
        <h1 style="color: #333; margin-bottom: 20px;">Welcome to HackerRank Campus Crew!</h1>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Hi ${userName},
        </p>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Thank you for registering with HackerRank Campus Crew! We're excited to have you join our community of talented students.
        </p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-bottom: 15px;">Your Account Details:</h3>
          <p style="color: #666; margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="color: #666; margin: 5px 0;"><strong>Status:</strong> Account Created</p>
        </div>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          <strong>Next Steps:</strong>
        </p>
        <ul style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          <li>Complete your domain application (Technical, Creatives, or Corporate)</li>
          <li>Wait for application review (3-5 business days)</li>
          <li>Receive team assignment and first tasks</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://your-domain.com" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Start Your Application
          </a>
        </div>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          If you have any questions, feel free to reach out to our support team.
        </p>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Best regards,<br>
          The HackerRank Campus Crew Team
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          This email was sent to ${email}. If you didn't create this account, please ignore this email.
        </p>
      </div>
    `
  },

  // Application Submission Confirmation
  applicationSubmitted: {
    subject: "Application Submitted Successfully - HackerRank Campus Crew",
    html: (userName: string, domain: string, applicationId: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://your-domain.com/Logo Light Wide.png" alt="HackerRank Campus Crew" style="height: 60px;">
        </div>
        
        <h1 style="color: #333; margin-bottom: 20px;">Application Submitted Successfully!</h1>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Hi ${userName},
        </p>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Great news! Your application for the <strong>${domain}</strong> domain has been successfully submitted and is now under review.
        </p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-bottom: 15px;">Application Details:</h3>
          <p style="color: #666; margin: 5px 0;"><strong>Domain:</strong> ${domain}</p>
          <p style="color: #666; margin: 5px 0;"><strong>Application ID:</strong> ${applicationId}</p>
          <p style="color: #666; margin: 5px 0;"><strong>Status:</strong> Under Review</p>
          <p style="color: #666; margin: 5px 0;"><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <h3 style="color: #333; margin-bottom: 15px;">What Happens Next?</h3>
        <ol style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          <li><strong>Review Period:</strong> Our team will review your application within 3-5 business days</li>
          <li><strong>Interview:</strong> If selected, you'll be invited for a brief interview or assessment</li>
          <li><strong>Team Assignment:</strong> Upon approval, you'll be assigned to your domain team</li>
          <li><strong>First Tasks:</strong> You'll receive your first project tasks and team introduction</li>
        </ol>
        
        <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #2d5a2d; margin: 0; font-weight: bold;">
            💡 Tip: While waiting, you can continue to improve your skills and prepare for your potential role!
          </p>
        </div>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          We'll keep you updated on your application status via email. Make sure to check your inbox regularly.
        </p>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Best regards,<br>
          The HackerRank Campus Crew Team
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          Application ID: ${applicationId} | Domain: ${domain}
        </p>
      </div>
    `
  },

  // Application Approved
  applicationApproved: {
    subject: "Congratulations! Your Application is Approved - HackerRank Campus Crew",
    html: (userName: string, domain: string, teamLead: string, teamLeadEmail: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://your-domain.com/Logo Light Wide.png" alt="HackerRank Campus Crew" style="height: 60px;">
        </div>
        
        <h1 style="color: #28a745; margin-bottom: 20px;">🎉 Congratulations!</h1>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Hi ${userName},
        </p>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          We're thrilled to inform you that your application for the <strong>${domain}</strong> domain has been approved! 
          Welcome to the HackerRank Campus Crew team!
        </p>
        
        <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
          <h3 style="color: #155724; margin-bottom: 15px;">Your Team Assignment:</h3>
          <p style="color: #155724; margin: 5px 0;"><strong>Domain:</strong> ${domain}</p>
          <p style="color: #155724; margin: 5px 0;"><strong>Team Lead:</strong> ${teamLead}</p>
          <p style="color: #155724; margin: 5px 0;"><strong>Contact:</strong> ${teamLeadEmail}</p>
        </div>
        
        <h3 style="color: #333; margin-bottom: 15px;">Next Steps:</h3>
        <ol style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          <li><strong>Team Introduction:</strong> You'll receive an email from your team lead within 24 hours</li>
          <li><strong>Onboarding:</strong> Complete the team onboarding process and get familiar with tools</li>
          <li><strong>First Project:</strong> Receive your first project assignment and deadlines</li>
          <li><strong>Team Meeting:</strong> Attend your first team meeting to meet your colleagues</li>
        </ol>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #856404; margin: 0; font-weight: bold;">
            ⚡ Action Required: Please respond to your team lead's email within 48 hours to confirm your participation.
          </p>
        </div>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          We're excited to see what you'll accomplish with the team! If you have any questions, don't hesitate to reach out.
        </p>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Welcome aboard!<br>
          The HackerRank Campus Crew Team
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          Domain: ${domain} | Team Lead: ${teamLead}
        </p>
      </div>
    `
  },

  // Application Rejected
  applicationRejected: {
    subject: "Application Update - HackerRank Campus Crew",
    html: (userName: string, domain: string, feedback: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://your-domain.com/Logo Light Wide.png" alt="HackerRank Campus Crew" style="height: 60px;">
        </div>
        
        <h1 style="color: #333; margin-bottom: 20px;">Application Update</h1>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Hi ${userName},
        </p>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Thank you for your interest in joining the HackerRank Campus Crew ${domain} team. 
          After careful review of your application, we regret to inform you that we are unable to move forward with your application at this time.
        </p>
        
        <div style="background-color: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
          <h3 style="color: #721c24; margin-bottom: 15px;">Feedback:</h3>
          <p style="color: #721c24; line-height: 1.6;">${feedback}</p>
        </div>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          We encourage you to:
        </p>
        <ul style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          <li>Continue developing your skills in the ${domain} domain</li>
          <li>Gain more experience through projects and practice</li>
          <li>Apply again in the future when you feel ready</li>
          <li>Consider other opportunities within our organization</li>
        </ul>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          We appreciate your interest in joining our team and wish you the best in your future endeavors.
        </p>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Best regards,<br>
          The HackerRank Campus Crew Team
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          Domain: ${domain} | You can reapply in 3 months
        </p>
      </div>
    `
  }
}

// Email service configuration
export const emailConfig = {
  from: "noreply@hackerrank-campus-crew.com",
  replyTo: "support@hackerrank-campus-crew.com",
  templates: emailTemplates
}
