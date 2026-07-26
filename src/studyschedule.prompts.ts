import { PromptDecorator as Prompt, ExecutionContext } from '@nitrostack/core';

/**
 * StudySchedule Prompts
 * 
 * Reusable prompt templates for analyzing curriculum, building study plans,
 * and optimizing schedules.
 */
export class StudySchedulePrompts {
  /**
   * Analyze Curriculum Prompt
   * Guides user through curriculum analysis and current performance entry
   */
  @Prompt({
    name: 'analyze-curriculum',
    description: 'Guide user through curriculum analysis and current performance assessment',
  })
  async analyzeCurriculumPrompt(args: Record<string, unknown>, context: ExecutionContext) {
    return [
      {
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: `I need help analyzing my curriculum and creating a study schedule to improve my GPA.`,
        },
      },
      {
        role: 'assistant' as const,
        content: {
          type: 'text' as const,
          text: `I'd be happy to help you create a personalized study schedule! Let me guide you through the process.

**Step 1: Curriculum Analysis**

To get started, I'll need some information about your current courses:

1. **Upload your curriculum PDF** - This should contain:
   - List of courses you're taking
   - Course codes and credit hours
   - Your current grades in each course

2. **Current Academic Status**:
   - What is your current CGPA (Cumulative GPA)?
   - How many credits have you completed so far?
   - Are there any courses you're particularly struggling with?

3. **Your Goal**:
   - What is your target CGPA?
   - By when do you want to achieve this?
   - How many weeks do you have to study?

Once you provide this information, I can:
- Parse your curriculum and extract course details
- Calculate the study load needed for each course
- Generate a personalized daily study schedule
- Suggest study methodologies based on your courses
- Adjust the schedule based on your constraints

**Let's start!** Please share:
1. Your curriculum PDF (or describe your courses)
2. Your current CGPA
3. Your target CGPA
4. Available study time per day`,
        },
      },
    ];
  }

  /**
   * Build Study Plan Prompt
   * Structured conversation for creating a comprehensive study plan
   */
  @Prompt({
    name: 'build-study-plan',
    description: 'Structured conversation to build a comprehensive study plan based on target CGPA',
  })
  async buildStudyPlanPrompt(args: Record<string, unknown>, context: ExecutionContext) {
    return [
      {
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: `Help me build a study plan to reach my target GPA.`,
        },
      },
      {
        role: 'assistant' as const,
        content: {
          type: 'text' as const,
          text: `Great! I'll help you build a comprehensive study plan. Let me gather some key information:

**Phase 1: Assessment**
- Current CGPA: ?
- Target CGPA: ?
- Courses you're taking: ?
- Current grades in each course: ?

**Phase 2: Constraints & Preferences**
- How many hours per day can you dedicate to studying?
- Do you have work or other commitments? If yes, how many hours per day?
- Which days would you like to keep off (e.g., weekends)?
- What's your preferred learning pace (slow, normal, fast)?

**Phase 3: Study Preferences**
- Do you prefer morning or evening study sessions?
- What study techniques work best for you?
  - Pomodoro (25 min focused + 5 min break)
  - Spaced Repetition (review at intervals)
  - Active Recall (frequent self-testing)
  - Deep Work (90+ min focused sessions)
  - Other?

**Phase 4: Timeline**
- When do you have exams?
- How many weeks do you have to prepare?
- Are there any important deadlines?

Once I have this information, I will:
1. **Calculate Study Load** - Determine hours needed per course
2. **Generate Schedule** - Create a detailed daily/weekly schedule
3. **Optimize** - Adjust based on your constraints and preferences
4. **Export** - Provide the schedule in your preferred format (JSON, CSV, or iCal)

**Let's start with your current situation:**
- What is your current CGPA?
- What is your target CGPA?
- How many weeks do you have to study?`,
        },
      },
    ];
  }

  /**
   * Optimize Schedule Prompt
   * Helps refine and optimize the generated schedule
   */
  @Prompt({
    name: 'optimize-schedule',
    description: 'Refine and optimize your study schedule based on feedback and constraints',
  })
  async optimizeSchedulePrompt(args: Record<string, unknown>, context: ExecutionContext) {
    return [
      {
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: `I have a study schedule but need to optimize it based on my constraints.`,
        },
      },
      {
        role: 'assistant' as const,
        content: {
          type: 'text' as const,
          text: `Perfect! Let me help you optimize your study schedule. Here are some ways we can refine it:

**Schedule Adjustments Available:**

1. **Time Constraints**
   - Reduce daily study hours if the current schedule is too intense
   - Shift study times to match your peak productivity hours
   - Add more breaks if you're feeling overwhelmed

2. **Learning Pace**
   - Slow down: Reduce intensity, more time per topic
   - Speed up: Increase intensity, cover more material
   - Balanced: Maintain current pace

3. **Days Off**
   - Designate specific days as study-free (e.g., Sundays)
   - Create lighter study days for recovery
   - Plan around existing commitments

4. **Study Methods**
   - Switch to a different study technique
   - Combine multiple techniques for better results
   - Adjust break frequency and duration

5. **Course Prioritization**
   - Focus more on challenging courses
   - Allocate less time to easier courses
   - Adjust based on exam dates

6. **Flexibility Options**
   - Make the schedule less rigid
   - Add buffer time for unexpected events
   - Include flexibility for different learning speeds

**What would you like to adjust?**

Please tell me:
1. What's working well in your current schedule?
2. What's not working or feels too challenging?
3. Any new constraints or changes to your situation?
4. Specific courses you want to focus on?

I can then regenerate your schedule with these optimizations!`,
        },
      },
    ];
  }

  /**
   * Study Tips & Motivation Prompt
   * Provides study tips and motivation
   */
  @Prompt({
    name: 'study-tips-motivation',
    description: 'Get study tips, best practices, and motivation for academic success',
  })
  async studyTipsMotivationPrompt(args: Record<string, unknown>, context: ExecutionContext) {
    return [
      {
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: `I need study tips and motivation to stay on track with my study plan.`,
        },
      },
      {
        role: 'assistant' as const,
        content: {
          type: 'text' as const,
          text: `Excellent! Staying motivated and using effective study techniques is key to success. Here's my comprehensive guide:

**🎯 Time Management Tips**
- Use the Pomodoro Technique: 25 minutes focused study + 5 minute break
- Schedule study sessions during your peak energy hours
- Break large tasks into smaller, manageable chunks
- Use a calendar or planner to track deadlines
- Avoid multitasking - focus on one subject at a time

**📚 Effective Study Techniques**
- **Active Recall**: Test yourself frequently instead of just re-reading
- **Spaced Repetition**: Review material at increasing intervals (1, 3, 7, 14, 30 days)
- **Teach Others**: Explaining concepts helps solidify understanding
- **Multiple Resources**: Use textbooks, videos, practice problems, study groups
- **Summaries & Mind Maps**: Organize information visually

**💪 Health & Wellness**
- Get 7-9 hours of sleep per night for optimal cognitive function
- Exercise regularly to improve focus and reduce stress
- Eat healthy meals and stay hydrated
- Take regular breaks to avoid burnout
- Practice mindfulness or meditation to reduce anxiety

**📝 Exam Preparation**
- Start studying at least 2-3 weeks before the exam
- Review past exams and practice problems
- Form study groups to discuss difficult concepts
- Get adequate sleep the night before the exam
- Arrive early and read instructions carefully

**⏰ Avoiding Procrastination**
- Break tasks into smaller steps with individual deadlines
- Use the "2-minute rule": If it takes less than 2 minutes, do it now
- Eliminate distractions: Phone, social media, notifications
- Create a dedicated study space
- Reward yourself after completing study sessions

**🌟 Motivation Boosters**
- Remember your "why" - why is this GPA important to you?
- Celebrate small wins and progress
- Track your improvement over time
- Join study groups for accountability and support
- Visualize your success and achieving your target GPA

**💡 Course-Specific Tips**
- **STEM Courses**: Focus on problem-solving and practice problems
- **Humanities**: Read actively and take detailed notes
- **Languages**: Practice speaking and listening daily
- **Social Sciences**: Understand concepts and apply them to real-world scenarios

**What specific area would you like more help with?**
- Study techniques for a particular subject?
- Overcoming procrastination?
- Managing stress and anxiety?
- Balancing multiple courses?`,
        },
      },
    ];
  }

  /**
   * Export & Share Prompt
   * Helps user export and share their study schedule
   */
  @Prompt({
    name: 'export-schedule',
    description: 'Export your study schedule in different formats and share it',
  })
  async exportSchedulePrompt(args: Record<string, unknown>, context: ExecutionContext) {
    return [
      {
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: `I want to export my study schedule in a format I can use.`,
        },
      },
      {
        role: 'assistant' as const,
        content: {
          type: 'text' as const,
          text: `Great! I can export your study schedule in multiple formats. Here are your options:

**📊 Export Formats Available:**

1. **JSON Format** (.json)
   - Best for: Importing into apps, data analysis
   - Contains: Complete schedule with all details
   - Use case: Integration with other tools

2. **CSV Format** (.csv)
   - Best for: Spreadsheets (Excel, Google Sheets)
   - Contains: Tabular view of all study sessions
   - Use case: Easy viewing and manual adjustments

3. **iCal Format** (.ics)
   - Best for: Calendar apps (Google Calendar, Outlook, Apple Calendar)
   - Contains: Calendar events for each study session
   - Use case: Sync with your phone/computer calendar

**📱 How to Use Each Format:**

**JSON**: 
- Download and import into study apps
- Use for data backup and analysis
- Share with study partners programmatically

**CSV**:
- Open in Excel or Google Sheets
- Create charts and visualizations
- Print for a physical copy
- Share with study groups

**iCal**:
- Import into Google Calendar
- Sync with Outlook or Apple Calendar
- Get notifications for study sessions
- Share calendar with accountability partners

**🔄 Next Steps:**
1. Choose your preferred format
2. Download the schedule
3. Import into your preferred tool
4. Set up reminders and notifications
5. Share with study partners if desired

**Which format would you like to use?**
- JSON for app integration?
- CSV for spreadsheet viewing?
- iCal for calendar sync?
- All three formats?`,
        },
      },
    ];
  }

  /**
   * Progress Tracking Prompt
   * Helps user track progress and adjust schedule
   */
  @Prompt({
    name: 'track-progress',
    description: 'Track your study progress and adjust your schedule as needed',
  })
  async trackProgressPrompt(args: Record<string, unknown>, context: ExecutionContext) {
    return [
      {
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: `I want to track my progress and see if I'm on track to reach my target GPA.`,
        },
      },
      {
        role: 'assistant' as const,
        content: {
          type: 'text' as const,
          text: `Excellent! Tracking progress is crucial for staying motivated and making adjustments. Let me help you monitor your progress:

**📈 Progress Tracking Metrics:**

1. **Study Adherence**
   - Are you following your schedule?
   - How many study sessions did you complete this week?
   - What percentage of planned hours did you study?

2. **Grade Progress**
   - What are your current grades in each course?
   - How much have they improved since you started?
   - Are you on track to reach your target grades?

3. **Learning Outcomes**
   - Can you explain key concepts from your courses?
   - Are you scoring well on practice problems?
   - Do you feel more confident in the material?

4. **Time Management**
   - Are you sticking to your daily schedule?
   - Do you need more or less study time?
   - Are breaks helping you stay focused?

**🎯 Weekly Check-in Questions:**
- How many hours did you study this week?
- Which courses did you focus on?
- What went well?
- What was challenging?
- Do you need to adjust your schedule?

**📊 Monthly Review:**
- Compare your grades to your target
- Assess your overall progress
- Identify courses needing more attention
- Celebrate improvements and wins

**🔄 Adjustment Triggers:**
- If you're ahead of schedule: Increase difficulty or add new topics
- If you're behind: Reduce other commitments or increase study hours
- If grades aren't improving: Try different study techniques
- If you're overwhelmed: Reduce daily hours or extend timeline

**💪 Staying Motivated:**
- Track your progress visually (charts, graphs)
- Celebrate small wins
- Share progress with accountability partners
- Adjust goals if needed
- Remember your "why"

**Let's check your progress:**
1. How many weeks into your study plan are you?
2. What are your current grades?
3. Are you on track to reach your target CGPA?
4. What adjustments do you need to make?`,
        },
      },
    ];
  }
}
