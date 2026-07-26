import { ToolDecorator as Tool, z, ExecutionContext, Injectable } from '@nitrostack/core';
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

/**
 * StudySchedule Tools
 * 
 * Comprehensive tools for parsing curriculum, calculating study loads,
 * generating schedules, exporting study plans, and summarizing live inbox via IMAP.
 */

// ============ SCHEMAS ============

const CourseSchema = z.object({
  courseCode: z.string().describe('Course code (e.g., CS101)'),
  courseName: z.string().describe('Course name'),
  credits: z.number().describe('Credit hours'),
  currentGrade: z.number().min(0).max(4).describe('Current grade on 4.0 scale'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('Estimated difficulty'),
});

const CurriculumSchema = z.object({
  courses: z.array(CourseSchema).describe('List of courses'),
  currentCGPA: z.number().min(0).max(4).describe('Current cumulative GPA'),
  totalCreditsCompleted: z.number().describe('Total credits completed so far'),
});

const StudyLoadSchema = z.object({
  courseCode: z.string(),
  courseName: z.string(),
  currentGrade: z.number(),
  targetGrade: z.number(),
  hoursPerWeek: z.number(),
  totalHours: z.number(),
  priority: z.enum(['low', 'medium', 'high']),
});

const TimeBlockSchema = z.object({
  day: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  courseCode: z.string(),
  activity: z.string(),
  breakAfter: z.boolean().optional(),
});

const DailyScheduleSchema = z.object({
  date: z.string(),
  dayOfWeek: z.string(),
  timeBlocks: z.array(TimeBlockSchema),
  totalStudyHours: z.number(),
  breakMinutes: z.number(),
});

const WeeklyScheduleSchema = z.object({
  weekNumber: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  dailySchedules: z.array(DailyScheduleSchema),
  totalWeeklyHours: z.number(),
  milestones: z.array(z.string()),
});

const EmailMessageSchema = z.object({
  id: z.string(),
  from: z.string(),
  subject: z.string(),
  date: z.string(),
  preview: z.string(),
  isRead: z.boolean(),
  hasAttachments: z.boolean().optional(),
});

const InboxSummarySchema = z.object({
  totalMessages: z.number(),
  unreadCount: z.number(),
  topSenders: z.array(z.object({
    sender: z.string(),
    messageCount: z.number(),
    lastMessageDate: z.string(),
  })),
  recentMessages: z.array(EmailMessageSchema),
  topTopics: z.array(z.string()),
  summary: z.string(),
});

@Injectable()
export class StudyScheduleTools {
  
  /**
   * Parse curriculum PDF and extract course information
   */
  @Tool({
    name: 'parse_curriculum_pdf',
    description: 'Parse curriculum PDF to extract courses, credits, and current grades. Returns structured course data.',
    inputSchema: z.object({
      pdfContent: z.string().describe('Base64 encoded PDF content or raw text extracted from PDF'),
      studentName: z.string().optional().describe('Student name for context'),
    }),
  })
  async parseCurriculumPdf(
    input: { pdfContent: string; studentName?: string },
    context: ExecutionContext
  ) {
    context.logger.info('Parsing curriculum PDF', { studentName: input.studentName });

    // Mock data for PDF extraction
    const mockCourses = [
      { courseCode: 'CS101', courseName: 'Introduction to Computer Science', credits: 3, currentGrade: 3.5, difficulty: 'medium' as const },
      { courseCode: 'MATH201', courseName: 'Calculus II', credits: 4, currentGrade: 3.0, difficulty: 'hard' as const },
      { courseCode: 'ENG102', courseName: 'English Composition', credits: 3, currentGrade: 3.8, difficulty: 'easy' as const },
      { courseCode: 'PHYS150', courseName: 'Physics I', credits: 4, currentGrade: 2.8, difficulty: 'hard' as const },
      { courseCode: 'CHEM101', courseName: 'General Chemistry', credits: 3, currentGrade: 3.2, difficulty: 'medium' as const },
    ];

    const totalCredits = mockCourses.reduce((sum, c) => sum + c.credits, 0);
    const currentCGPA = mockCourses.reduce((sum, c) => sum + c.currentGrade * c.credits, 0) / totalCredits;

    const curriculum: z.infer<typeof CurriculumSchema> = {
      courses: mockCourses,
      currentCGPA: Math.round(currentCGPA * 100) / 100,
      totalCreditsCompleted: totalCredits,
    };

    context.logger.info('Curriculum parsed successfully', { courseCount: mockCourses.length });

    return {
      success: true,
      curriculum,
      message: `Parsed ${mockCourses.length} courses with current CGPA: ${curriculum.currentCGPA}`,
    };
  }

  /**
   * Calculate study load needed to reach target CGPA
   */
  @Tool({
    name: 'calculate_study_load',
    description: 'Calculate hours per course needed to reach target CGPA. Returns study load breakdown.',
    inputSchema: z.object({
      curriculum: CurriculumSchema.describe('Current curriculum data'),
      targetCGPA: z.number().min(0).max(4).describe('Target CGPA (0-4.0 scale)'),
      weeksAvailable: z.number().min(1).describe('Weeks available to study'),
      hoursPerDayAvailable: z.number().min(1).max(24).describe('Available study hours per day'),
    }),
  })
  async calculateStudyLoad(
    input: {
      curriculum: z.infer<typeof CurriculumSchema>;
      targetCGPA: number;
      weeksAvailable: number;
      hoursPerDayAvailable: number;
    },
    context: ExecutionContext
  ) {
    context.logger.info('Calculating study load', { currentCGPA: input.curriculum.currentCGPA, targetCGPA: input.targetCGPA });

    const totalAvailableHours = input.hoursPerDayAvailable * 7 * input.weeksAvailable;

    const studyLoads: z.infer<typeof StudyLoadSchema>[] = input.curriculum.courses.map(
      (course) => {
        const gradeGap = input.targetCGPA - course.currentGrade;
        const difficultyMultiplier = course.difficulty === 'hard' ? 1.5 : course.difficulty === 'medium' ? 1.0 : 0.7;

        const baseHours = Math.max(0, gradeGap * 10 * difficultyMultiplier);
        const hoursPerWeek = (baseHours / input.weeksAvailable) * (course.credits / 3);

        let priority: 'low' | 'medium' | 'high' = 'medium';
        if (gradeGap > 0.5) priority = 'high';
        if (gradeGap < 0.2) priority = 'low';

        return {
          courseCode: course.courseCode,
          courseName: course.courseName,
          currentGrade: course.currentGrade,
          targetGrade: Math.min(4.0, input.targetCGPA + 0.2),
          hoursPerWeek: Math.round(hoursPerWeek * 10) / 10,
          totalHours: Math.round(baseHours * 10) / 10,
          priority,
        };
      }
    );

    const totalHoursNeeded = studyLoads.reduce((sum, load) => sum + load.totalHours, 0);
    const feasible = totalHoursNeeded <= totalAvailableHours;

    return {
      success: true,
      studyLoads,
      summary: {
        totalHoursNeeded: Math.round(totalHoursNeeded * 10) / 10,
        totalAvailableHours,
        feasible,
        message: feasible
          ? `Target CGPA ${input.targetCGPA} is achievable with ${totalHoursNeeded} hours of study`
          : `Target CGPA ${input.targetCGPA} requires ${totalHoursNeeded} hours (${totalHoursNeeded - totalAvailableHours} hours over available time)`,
      },
    };
  }

  /**
   * Generate daily study schedule with time blocks
   */
  @Tool({
    name: 'generate_daily_schedule',
    description: 'Generate a detailed daily/weekly study schedule with time blocks, breaks, and milestones.',
    inputSchema: z.object({
      studyLoads: z.array(StudyLoadSchema).describe('Study load breakdown per course'),
      startDate: z.string().describe('Start date (YYYY-MM-DD)'),
      durationWeeks: z.number().min(1).describe('Duration in weeks'),
      studyStartTime: z.string().describe('Daily study start time (HH:MM)'),
      studyEndTime: z.string().describe('Daily study end time (HH:MM)'),
      breakMinutesPerHour: z.number().min(5).max(30).describe('Break minutes per study hour'),
      examDates: z.array(z.string()).optional().describe('Exam dates (YYYY-MM-DD)'),
    }),
  })
  async generateDailySchedule(
    input: {
      studyLoads: z.infer<typeof StudyLoadSchema>[];
      startDate: string;
      durationWeeks: number;
      studyStartTime: string;
      studyEndTime: string;
      breakMinutesPerHour: number;
      examDates?: string[];
    },
    context: ExecutionContext
  ) {
    context.logger.info('Generating daily schedule');

    const weeklySchedules: z.infer<typeof WeeklyScheduleSchema>[] = [];
    const startDateObj = new Date(input.startDate);

    const sortedLoads = [...input.studyLoads].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    for (let week = 1; week <= input.durationWeeks; week++) {
      const weekStart = new Date(startDateObj);
      weekStart.setDate(weekStart.getDate() + (week - 1) * 7);

      const dailySchedules: z.infer<typeof DailyScheduleSchema>[] = [];
      let totalWeeklyHours = 0;

      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(weekStart);
        currentDate.setDate(currentDate.getDate() + day);

        const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
        const dateStr = currentDate.toISOString().split('T')[0];

        if (day === 5 || day === 6) {
          dailySchedules.push({ date: dateStr, dayOfWeek, timeBlocks: [], totalStudyHours: 0, breakMinutes: 0 });
          continue;
        }

        const timeBlocks: z.infer<typeof TimeBlockSchema>[] = [];
        let currentTime = new Date(`2000-01-01T${input.studyStartTime}`);
        const endTime = new Date(`2000-01-01T${input.studyEndTime}`);
        let dayStudyHours = 0;
        let breakMinutes = 0;
        let courseIndex = 0;

        while (currentTime < endTime && courseIndex < sortedLoads.length) {
          const load = sortedLoads[courseIndex % sortedLoads.length];
          const sessionMinutes = Math.min(90, (load.hoursPerWeek / 5) * 60);

          const blockStart = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
          currentTime.setMinutes(currentTime.getMinutes() + sessionMinutes);
          const blockEnd = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

          timeBlocks.push({ day: dayOfWeek, startTime: blockStart, endTime: blockEnd, courseCode: load.courseCode, activity: `Study ${load.courseName}`, breakAfter: true });

          dayStudyHours += sessionMinutes / 60;
          breakMinutes += input.breakMinutesPerHour;
          currentTime.setMinutes(currentTime.getMinutes() + input.breakMinutesPerHour);
          courseIndex++;
        }

        totalWeeklyHours += dayStudyHours;
        dailySchedules.push({ date: dateStr, dayOfWeek, timeBlocks, totalStudyHours: Math.round(dayStudyHours * 10) / 10, breakMinutes });
      }

      const milestones = input.examDates ? input.examDates.filter((date) => {
        const examDate = new Date(date);
        return examDate >= weekStart && examDate < new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      }) : [];

      weeklySchedules.push({
        weekNumber: week,
        startDate: weekStart.toISOString().split('T')[0],
        endDate: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dailySchedules,
        totalWeeklyHours: Math.round(totalWeeklyHours * 10) / 10,
        milestones,
      });
    }

    return { success: true, schedule: weeklySchedules, message: `Generated ${input.durationWeeks}-week study schedule` };
  }

  /**
   * Adjust schedule based on constraints
   */
  @Tool({
    name: 'adjust_schedule',
    description: 'Adjust the study schedule based on user constraints (work hours, other commitments, learning pace).',
    inputSchema: z.object({
      schedule: z.array(WeeklyScheduleSchema).describe('Current weekly schedule'),
      constraints: z.object({
        workHoursPerDay: z.number().optional().describe('Hours per day spent on work'),
        otherCommitmentsHoursPerDay: z.number().optional().describe('Other commitments hours'),
        preferredStudyHours: z.number().optional().describe('Preferred study hours per day'),
        learningPace: z.enum(['slow', 'normal', 'fast']).optional().describe('Learning pace preference'),
        daysOff: z.array(z.string()).optional().describe('Days to keep off (e.g., ["Saturday", "Sunday"])'),
      }),
    }),
  })
  async adjustSchedule(
    input: {
      schedule: z.infer<typeof WeeklyScheduleSchema>[];
      constraints: {
        workHoursPerDay?: number;
        otherCommitmentsHoursPerDay?: number;
        preferredStudyHours?: number;
        learningPace?: 'slow' | 'normal' | 'fast';
        daysOff?: string[];
      };
    },
    context: ExecutionContext
  ) {
    const adjustedSchedule = input.schedule.map((week) => {
      const adjustedDailySchedules = week.dailySchedules.map((day) => {
        if (input.constraints.daysOff?.includes(day.dayOfWeek)) {
          return { ...day, timeBlocks: [], totalStudyHours: 0 };
        }

        const paceMultiplier = input.constraints.learningPace === 'slow' ? 0.8 : input.constraints.learningPace === 'fast' ? 1.2 : 1.0;

        const adjustedTimeBlocks = day.timeBlocks.map((block) => {
          const duration = this.parseTimeRange(block.startTime, block.endTime);
          const adjustedDuration = Math.round(duration * paceMultiplier * 10) / 10;
          return { ...block, endTime: this.addMinutesToTime(block.startTime, adjustedDuration * 60) };
        });

        const totalStudyHours = adjustedTimeBlocks.reduce((sum, block) => sum + this.parseTimeRange(block.startTime, block.endTime), 0);
        return { ...day, timeBlocks: adjustedTimeBlocks, totalStudyHours: Math.round(totalStudyHours * 10) / 10 };
      });

      return {
        ...week,
        dailySchedules: adjustedDailySchedules,
        totalWeeklyHours: adjustedDailySchedules.reduce((sum, day) => sum + day.totalStudyHours, 0),
      };
    });

    return { success: true, adjustedSchedule, message: 'Schedule adjusted based on constraints' };
  }

  /**
   * Summarize student inbox
   * Connects to real IMAP server using environment variables
   */
  @Tool({
    name: 'inbox-summary',
    description: 'Summarize student inbox. Requests mail access and returns inbox summary with unread count, top senders, and key topics.',
    inputSchema: z.object({
      emailAccount: z.string().describe('Email account to summarize (e.g., student@university.edu)'),
      maxMessages: z.number().optional().describe('Maximum number of messages to analyze (default: 50)'),
      filter: z.enum(['all', 'unread', 'today', 'this-week']).optional().describe('Filter messages by status'),
    }),
  })
  async inboxSummary(
    input: {
      emailAccount: string;
      maxMessages?: number;
      filter?: 'all' | 'unread' | 'today' | 'this-week';
    },
    context: ExecutionContext
  ) {
    context.logger.info('Live Inbox summary requested', { emailAccount: input.emailAccount, filter: input.filter || 'all' });

    try {
      const accessGranted = await this.verifyMailCredentials(input.emailAccount, context);
      if (!accessGranted) {
        return {
          success: false,
          error: 'Mail credentials missing',
          message: 'Please configure EMAIL_APP_PASSWORD in your .env file to access live mail.',
          requiresPermission: true,
        };
      }

      const messages = await this.getRealEmailMessages(input.emailAccount, input.maxMessages || 50, input.filter || 'all');
      const summary = this.analyzeMails(messages, input.emailAccount);

      context.logger.info('Inbox summary generated successfully');

      return {
        success: true,
        emailAccount: input.emailAccount,
        summary,
        message: `Live inbox summary for ${input.emailAccount}: ${summary.unreadCount} unread messages out of ${summary.totalMessages}`,
      };
    } catch (error: any) {
      context.logger.error('Failed to fetch real emails', { error: error.message });
      return {
        success: false,
        error: 'IMAP Connection Failed',
        message: `Could not connect to the email server: ${error.message}`,
      };
    }
  }

  /**
   * Export schedule in multiple formats
   */
  @Tool({
    name: 'export_schedule',
    description: 'Export the study schedule in JSON, CSV, or iCal format.',
    inputSchema: z.object({
      schedule: z.array(WeeklyScheduleSchema).describe('Weekly schedule to export'),
      format: z.enum(['json', 'csv', 'ical']).describe('Export format'),
      includeMetadata: z.boolean().optional().describe('Include metadata in export'),
    }),
  })
  async exportSchedule(
    input: {
      schedule: z.infer<typeof WeeklyScheduleSchema>[];
      format: 'json' | 'csv' | 'ical';
      includeMetadata?: boolean;
    },
    context: ExecutionContext
  ) {
    let exportData: string, mimeType: string, filename: string;

    if (input.format === 'json') {
      exportData = JSON.stringify(input.schedule, null, 2);
      mimeType = 'application/json';
      filename = 'study-schedule.json';
    } else if (input.format === 'csv') {
      exportData = this.scheduleToCSV(input.schedule);
      mimeType = 'text/csv';
      filename = 'study-schedule.csv';
    } else {
      exportData = this.scheduleToICal(input.schedule);
      mimeType = 'text/calendar';
      filename = 'study-schedule.ics';
    }

    return { success: true, format: input.format, mimeType, filename, data: exportData, message: `Schedule exported as ${input.format.toUpperCase()}` };
  }

  // ============ HELPER METHODS ============

  private parseTimeRange(startTime: string, endTime: string): number {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    return ((endHour * 60 + endMin) - (startHour * 60 + startMin)) / 60;
  }

  private addMinutesToTime(time: string, minutes: number): string {
    const [hour, min] = time.split(':').map(Number);
    const totalMin = hour * 60 + min + minutes;
    const newHour = Math.floor(totalMin / 60) % 24;
    return `${String(newHour).padStart(2, '0')}:${String(totalMin % 60).padStart(2, '0')}`;
  }

  private scheduleToCSV(schedule: z.infer<typeof WeeklyScheduleSchema>[]): string {
    const rows = ['Week,Date,Day,Course,Activity,Start Time,End Time,Study Hours'];
    schedule.forEach((week) => {
      week.dailySchedules.forEach((day) => {
        day.timeBlocks.forEach((block) => {
          rows.push(`${week.weekNumber},${day.date},${day.dayOfWeek},${block.courseCode},${block.activity},${block.startTime},${block.endTime},${this.parseTimeRange(block.startTime, block.endTime)}`);
        });
      });
    });
    return rows.join('\n');
  }

  private scheduleToICal(schedule: z.infer<typeof WeeklyScheduleSchema>[]): string {
    let ical = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Study Schedule//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n`;
    schedule.forEach((week) => {
      week.dailySchedules.forEach((day) => {
        day.timeBlocks.forEach((block) => {
          const [startHour, startMin] = block.startTime.split(':');
          const [endHour, endMin] = block.endTime.split(':');
          const startDateTime = `${day.date.replace(/-/g, '')}T${startHour}${startMin}00`;
          const endDateTime = `${day.date.replace(/-/g, '')}T${endHour}${endMin}00`;

          ical += `BEGIN:VEVENT\nUID:${block.courseCode}-${day.date}@studyschedule\nDTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\nDTSTART:${startDateTime}\nDTEND:${endDateTime}\nSUMMARY:${block.activity}\nDESCRIPTION:${block.courseCode}\nEND:VEVENT\n`;
        });
      });
    });
    return ical + 'END:VCALENDAR';
  }

  // ============ INBOX SUMMARY HELPER METHODS ============

  private async verifyMailCredentials(emailAccount: string, context: ExecutionContext): Promise<boolean> {
    return !!process.env.EMAIL_APP_PASSWORD;
  }

  private async getRealEmailMessages(
    emailAccount: string,
    maxMessages: number,
    filter: 'all' | 'unread' | 'today' | 'this-week'
  ): Promise<z.infer<typeof EmailMessageSchema>[]> {
    
    const client = new ImapFlow({
      host: process.env.IMAP_HOST || 'imap.gmail.com',
      port: Number(process.env.IMAP_PORT) || 993,
      secure: true,
      auth: {
        user: process.env.EMAIL_ACCOUNT || emailAccount,
        pass: process.env.EMAIL_APP_PASSWORD as string
      },
      logger: console
    });

    await client.connect();
    const lock = await client.getMailboxLock('INBOX');
    const messages: z.infer<typeof EmailMessageSchema>[] = [];

    try {
      const mailbox = client.mailbox as any;
      const totalInMailbox = mailbox && mailbox.exists ? mailbox.exists : 100;
      
      const fetchCount = Math.min(totalInMailbox, Math.max(maxMessages * 2, 100)); 
      const startSeq = Math.max(1, totalInMailbox - fetchCount + 1);

      // Using 'as any' bypasses the strict TypeScript errors for the ImapFlow fetch stream
      for await (const msg of client.fetch({ seq: `${startSeq}:*` }, { source: true, uid: true, flags: true }) as any) {
        
        const message = msg as any;
        const parsed: any = await simpleParser(message.source);
        
        messages.push({
          id: message.uid ? message.uid.toString() : Math.random().toString(),
          from: parsed.from?.value?.[0]?.address || parsed.from?.text || 'unknown',
          subject: parsed.subject || 'No Subject',
          date: parsed.date ? new Date(parsed.date).toISOString() : new Date().toISOString(),
          preview: parsed.text ? parsed.text.substring(0, 150).replace(/\n/g, ' ') : '',
          isRead: message.flags ? message.flags.has('\\Seen') : false,
          hasAttachments: parsed.attachments && parsed.attachments.length > 0,
        });
      }
    } finally {
      lock.release();
    }
    
    await client.logout();

    let sorted = messages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (filter === 'unread') {
      sorted = sorted.filter((m) => !m.isRead);
    } else if (filter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      sorted = sorted.filter((m) => new Date(m.date) >= today);
    } else if (filter === 'this-week') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      sorted = sorted.filter((m) => new Date(m.date) >= weekAgo);
    }

    return sorted.slice(0, maxMessages);
  }

  private analyzeMails(
    messages: z.infer<typeof EmailMessageSchema>[],
    emailAccount: string
  ): z.infer<typeof InboxSummarySchema> {
    const unreadCount = messages.filter((m) => !m.isRead).length;

    const senderMap = new Map<string, { count: number; lastDate: string }>();
    messages.forEach((msg) => {
      const existing = senderMap.get(msg.from) || { count: 0, lastDate: msg.date };
      senderMap.set(msg.from, {
        count: existing.count + 1,
        lastDate: new Date(msg.date) > new Date(existing.lastDate) ? msg.date : existing.lastDate,
      });
    });

    const topSenders = Array.from(senderMap.entries())
      .map(([sender, data]) => ({ sender, messageCount: data.count, lastMessageDate: data.lastDate }))
      .sort((a, b) => b.messageCount - a.messageCount)
      .slice(0, 5);

    const topicMap = new Map<string, number>();
    messages.forEach((msg) => {
      const keywords = msg.subject.toLowerCase().split(/\s+/);
      keywords.forEach((keyword) => {
        if (keyword.length > 3 && !['from', 'your', 'this', 'that', 'have', 'with'].includes(keyword)) {
          topicMap.set(keyword, (topicMap.get(keyword) || 0) + 1);
        }
      });
    });

    const topTopics = Array.from(topicMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);

    const summary = `You have ${unreadCount} unread messages out of ${messages.length} total. Top senders: ${topSenders.map((s) => s.sender.split('@')[0]).join(', ')}. Key topics: ${topTopics.join(', ')}.`;

    return {
      totalMessages: messages.length,
      unreadCount,
      topSenders,
      recentMessages: messages.slice(0, 5),
      topTopics,
      summary,
    };
  }
}