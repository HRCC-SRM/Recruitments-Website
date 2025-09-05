// Types for form configuration
interface Question {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  inputType?: string;
  pattern?: string;
  options?: Array<{ label: string; value: string | number }>;
  showForYears?: number[]; // New property for year-based filtering
}

interface Step {
  id: string;
  title: string;
  questions: Question[];
}

interface FormConfig {
  steps: Step[];
}

// Technical Domain Form Configuration
export const technicalFormConfig: FormConfig = {
  steps: [
    {
      id: "your-details",
      title: "Your Details",
      questions: [
        {
          id: "name",
          type: "input",
          label: "Full Name",
          placeholder: "Enter your full name",
          required: true,
          inputType: "text"
        },
        {
          id: "email",
          type: "input",
          label: "Personal Email",
          placeholder: "your.email@example.com",
          required: true,
          inputType: "email"
        },
        {
          id: "srmEmail",
          type: "input",
          label: "SRMIST Email",
          placeholder: "your.name@srmist.edu.in",
          required: true,
          inputType: "email"
        },
        {
          id: "phone",
          type: "input",
          label: "Phone Number",
          placeholder: "e.g., 9876543210",
          required: true,
          inputType: "tel",
          pattern: "^\\d{10}$"
        },
        {
          id: "regNo",
          type: "input",
          label: "Registration Number",
          placeholder: "e.g., RA2411033010060",
          required: true,
          inputType: "text"
        },
        {
          id: "branch",
          type: "input",
          label: "Branch",
          placeholder: "e.g., CSE, ECE, MECH...",
          required: true
        },
        {
          id: "yearOfStudy",
          type: "select",
          label: "Year of Study",
          required: true,
          options: [
            { label: "1st Year", value: 1 },
            { label: "2nd Year", value: 2 },
          ]
        },
        {
          id: "department",
          type: "input",
          label: "Department",
          placeholder: "e.g., Computer Science and Engineering",
          required: true
        },
        {
          id: "linkedinLink",
          type: "input",
          label: "LinkedIn Profile (Optional)",
          placeholder: "https://linkedin.com/in/yourprofile",
          required: false,
          inputType: "url"
        }
      ]
    },
    {
      id: "basic-info",
      title: "Basic Information",
      questions: [
        {
          id: "programmingLanguages",
          type: "input",
          label: "What programming languages are you familiar with or learning?",
          placeholder: "e.g., JavaScript, Python, Java, C++, HTML/CSS...",
          required: true,
          showForYears: [1, 2] // Show for 1st and 2nd year
        },
        {
          id: "frameworks",
          type: "input",
          label: "What frameworks, libraries, or technologies have you worked with?",
          placeholder: "e.g., React, Angular, Django, Flask, Docker, AWS, Git...",
          required: false,
          showForYears: [2] // Show only for 2nd year and above
        },
        {
          id: "experience",
          type: "textarea",
          label: "How long have you been programming? Describe your experience level.",
          placeholder: "Tell us about your programming journey, years of experience, and how you got started...",
          required: true,
          showForYears: [2] // Show only for 2nd year and above
        },
        {
          id: "learningStyle",
          type: "textarea",
          label: "How do you prefer to learn new technologies?",
          placeholder: "Do you prefer documentation, tutorials, hands-on projects, or other methods?",
          required: false,
          showForYears: [1, 2] // Show for 1st and 2nd year
        },
        {
          id: "challenges",
          type: "textarea",
          label: "What's the most challenging technical problem you've solved?",
          placeholder: "Describe the problem, your approach, and what you learned from it...",
          required: true,
          showForYears: [2] // Show only for 2nd year and above
        },
        {
          id: "projects",
          type: "textarea",
          label: "Describe 2-3 of your most impressive technical projects",
          placeholder: "Tell us about the projects you've built. What problems did they solve? What technologies did you use? What was your role? What challenges did you overcome?",
          required: true,
          showForYears: [2] // Show only for 2nd year and above
        },
        {
          id: "whyJoin",
          type: "textarea",
          label: "Why do you want to join the Technical team? What do you hope to achieve?",
          placeholder: "Tell us about your motivation, career goals, and how joining our technical team aligns with your aspirations. What unique perspective or skills can you bring?",
          required: true,
          showForYears: [1, 2] // Show for 1st and 2nd year
        }
      ]
    },
    {
      id: "application-review",
      title: "Application Review",
      questions: []
    }
  ]
}

// Creatives Domain Form Configuration
export const creativesFormConfig = {
  steps: [
    {
      id: "your-details",
      title: "Your Details",
      questions: [
        {
          id: "registrationNumber",
          type: "input",
          label: "Registration Number",
          placeholder: "e.g., RA2411033010060",
          required: true,
          inputType: "text",
          pattern: "^RA\\\d{13}$"
        },
        {
          id: "personalEmail",
          type: "input",
          label: "Personal Email ID",
          placeholder: "your.name@example.com",
          required: true,
          inputType: "email"
        },
        {
          id: "phone",
          type: "input",
          label: "Phone Number",
          placeholder: "e.g., 9876543210",
          required: true,
          inputType: "tel",
          pattern: "^\\d{10}$"
        },
        {
          id: "yearOfStudy",
          type: "select",
          label: "Year of Study",
          required: true,
          options: [
            { label: "1st Year", value: "1" },
            { label: "2nd Year", value: "2" },
            { label: "3rd Year", value: "3" }
          ]
        },
        {
          id: "branch",
          type: "input",
          label: "Branch",
          placeholder: "e.g., CSE, ECE, MECH...",
          required: true
        },
        {
          id: "department",
          type: "input",
          label: "Department",
          placeholder: "e.g., Computer Science and Engineering",
          required: true
        },
        {
          id: "linkedinLink",
          type: "input",
          label: "LinkedIn Profile (Optional)",
          placeholder: "https://linkedin.com/in/yourprofile",
          required: false,
          inputType: "url"
        }
      ]
    },
    {
      id: "creative-skills",
      title: "Creative Skills",
      questions: [
        {
          id: "designTools",
          type: "input",
          label: "What design tools and software are you comfortable using?",
          placeholder: "e.g., Adobe Creative Suite, Figma, Canva, Procreate, Blender, After Effects...",
          required: true
        },
        {
          id: "creativeSkills",
          type: "input",
          label: "What are your main creative skills and specializations?",
          placeholder: "e.g., Graphic Design, UI/UX Design, Illustration, Photography, Video Editing, Animation, Branding...",
          required: true
        },
        {
          id: "experience",
          type: "textarea",
          label: "How long have you been creating? Describe your creative journey.",
          placeholder: "Tell us about your creative background, years of experience, and how you developed your skills...",
          required: true
        },
        {
          id: "style",
          type: "textarea",
          label: "How would you describe your creative style?",
          placeholder: "What characterizes your work? What themes or aesthetics do you gravitate towards?",
          required: false
        },
        {
          id: "inspirations",
          type: "textarea",
          label: "What inspires your creative work? Tell us about your influences.",
          placeholder: "Who are your favorite artists/designers? What art movements or styles influence you? What themes or concepts do you love exploring?",
          required: false
        }
      ]
    },
    {
      id: "portfolio",
      title: "Portfolio & Work",
      questions: [
        {
          id: "projects",
          type: "textarea",
          label: "Show us 3-4 of your best creative works",
          placeholder: "Describe your creative projects in detail. What was the concept? What tools did you use? What was your creative process? What feedback did you receive? What makes these projects special to you?",
          required: true
        },
        {
          id: "collaboration",
          type: "textarea",
          label: "Describe a time you collaborated on a creative project",
          placeholder: "What was the project? How did you work with others? What was your role?",
          required: true
        },
        {
          id: "feedback",
          type: "textarea",
          label: "How do you handle feedback on your creative work?",
          placeholder: "Share an example of how you've incorporated feedback to improve your work...",
          required: false
        },
        {
          id: "deadlines",
          type: "textarea",
          label: "How do you manage creative work under deadlines?",
          placeholder: "Describe your process for meeting deadlines while maintaining quality...",
          required: true
        },
        {
          id: "innovation",
          type: "textarea",
          label: "How do you stay innovative and creative?",
          placeholder: "What methods do you use to generate new ideas and stay creative?",
          required: false
        }
      ]
    },
    {
      id: "goals",
      title: "Goals & Vision",
      questions: [
        {
          id: "whyJoin",
          type: "textarea",
          label: "Why do you want to join the Creatives team? What do you hope to contribute?",
          placeholder: "Tell us about your creative vision, goals, and how you want to grow as an artist/designer. What unique perspective or creative voice can you bring to our team?",
          required: true
        },
        {
          id: "growth",
          type: "textarea",
          label: "What creative skills do you want to develop or improve?",
          placeholder: "What are your creative learning goals? What new techniques or styles do you want to explore?",
          required: true
        },
        {
          id: "impact",
          type: "textarea",
          label: "How do you want to impact our creative projects and team?",
          placeholder: "What specific contributions can you make? How will you help elevate our creative output?",
          required: true
        }
      ]
    }
  ]
}

// Corporate Domain Form Configuration
export const corporateFormConfig = {
  steps: [
    {
      id: "your-details",
      title: "Your Details",
      questions: [
        {
          id: "registrationNumber",
          type: "input",
          label: "Registration Number",
          placeholder: "e.g., RA2411033010060",
          required: true,
          inputType: "text",
          pattern: "^RA\\\d{13}$"
        },
        {
          id: "personalEmail",
          type: "input",
          label: "Personal Email ID",
          placeholder: "your.name@example.com",
          required: true,
          inputType: "email"
        },
        {
          id: "phone",
          type: "input",
          label: "Phone Number",
          placeholder: "e.g., 9876543210",
          required: true,
          inputType: "tel",
          pattern: "^\\d{10}$"
        },
        {
          id: "yearOfStudy",
          type: "select",
          label: "Year of Study",
          required: true,
          options: [
            { label: "1st Year", value: "1" },
            { label: "2nd Year", value: "2" },
            { label: "3rd Year", value: "3" }
          ]
        },
        {
          id: "branch",
          type: "input",
          label: "Branch",
          placeholder: "e.g., CSE, ECE, MECH...",
          required: true
        },
        {
          id: "department",
          type: "input",
          label: "Department",
          placeholder: "e.g., Computer Science and Engineering",
          required: true
        },
        {
          id: "linkedinLink",
          type: "input",
          label: "LinkedIn Profile (Optional)",
          placeholder: "https://linkedin.com/in/yourprofile",
          required: false,
          inputType: "url"
        }
      ]
    },
    {
      id: "leadership",
      title: "Leadership & Skills",
      questions: [
        {
          id: "leadershipExperience",
          type: "textarea",
          label: "Describe your leadership experience and team management skills",
          placeholder: "Tell us about leadership roles you've held, teams you've managed, and how you've motivated others. What challenges did you face and how did you overcome them? What's your leadership style?",
          required: true
        },
        {
          id: "businessSkills",
          type: "input",
          label: "What business skills and knowledge areas are you strong in?",
          placeholder: "e.g., Project Management, Marketing, Finance, Strategy, Communication, Sales, Operations, Data Analysis...",
          required: true
        },
        {
          id: "experience",
          type: "textarea",
          label: "How long have you been in leadership or business roles?",
          placeholder: "Describe your professional journey and experience in business contexts...",
          required: true
        },
        {
          id: "communication",
          type: "textarea",
          label: "How do you approach communication in a business setting?",
          placeholder: "Describe your communication style and how you handle different stakeholders...",
          required: false
        },
        {
          id: "decisionMaking",
          type: "textarea",
          label: "Describe your decision-making process in business situations",
          placeholder: "How do you approach complex decisions? What factors do you consider?",
          required: true
        }
      ]
    },
    {
      id: "projects",
      title: "Projects & Achievements",
      questions: [
        {
          id: "projects",
          type: "textarea",
          label: "Describe any business projects, startups, or initiatives you've been involved in",
          placeholder: "Tell us about business projects you've worked on. What was the goal? What was your role? What strategies did you implement? What were the results? What did you learn?",
          required: true
        },
        {
          id: "achievements",
          type: "textarea",
          label: "What are your key achievements and recognitions?",
          placeholder: "Share any awards, competitions won, positions of responsibility, or significant accomplishments in academics, extracurricular activities, or professional settings...",
          required: false
        },
        {
          id: "challenges",
          type: "textarea",
          label: "Describe a significant business challenge you've overcome",
          placeholder: "What was the challenge? How did you approach it? What was the outcome?",
          required: true
        },
        {
          id: "teamwork",
          type: "textarea",
          label: "How do you build and maintain effective business relationships?",
          placeholder: "Describe your approach to networking, collaboration, and relationship building...",
          required: false
        },
        {
          id: "innovation",
          type: "textarea",
          label: "How do you drive innovation in business processes?",
          placeholder: "Share examples of how you've improved processes or introduced new ideas...",
          required: true
        }
      ]
    },
    {
      id: "goals",
      title: "Career Goals & Vision",
      questions: [
        {
          id: "whyJoin",
          type: "textarea",
          label: "Why do you want to join the Corporate team? What are your career goals?",
          placeholder: "Tell us about your career aspirations, what you hope to learn from this experience, and how you can contribute to our team's success. What business problems do you want to solve?",
          required: true
        },
        {
          id: "learningGoals",
          type: "textarea",
          label: "What business skills do you want to develop or improve?",
          placeholder: "What specific skills or knowledge areas do you want to focus on?",
          required: true
        },
        {
          id: "contribution",
          type: "textarea",
          label: "How do you plan to contribute to our business initiatives?",
          placeholder: "What specific value can you bring to our team? How will you help achieve our goals?",
          required: true
        }
      ]
    }
  ]
}
