import { ResourceDecorator as Resource, ExecutionContext } from '@nitrostack/core';

/**
 * StudySchedule Resources
 * 
 * Provides reference data for study methodologies, course difficulty mappings,
 * GPA conversion tables, and sample schedules.
 */
export class StudyScheduleResources {
  /**
   * Study methodologies resource - provides different study techniques
   */
  @Resource({
    uri: 'studyschedule://study-methodologies',
    name: 'Study Methodologies',
    description: 'Reference guide for different study techniques and their effectiveness',
    mimeType: 'application/json',
  })
  async studyMethodologies(context: ExecutionContext) {
    const methodologies = {
      pomodoro: {
        name: 'Pomodoro Technique',
        description: 'Study in 25-minute focused intervals with 5-minute breaks',
        duration: 25,
        breakDuration: 5,
        longBreakAfter: 4,
        longBreakDuration: 15,
        bestFor: ['concentration', 'avoiding burnout', 'time management'],
        effectiveness: 0.85,
      },
      spacedRepetition: {
        name: 'Spaced Repetition',
        description: 'Review material at increasing intervals to improve retention',
        intervals: [1, 3, 7, 14, 30],
        intervalUnit: 'days',
        bestFor: ['memorization', 'language learning', 'vocabulary'],
        effectiveness: 0.92,
      },
      activeRecall: {
        name: 'Active Recall',
        description: 'Test yourself frequently to strengthen memory retrieval',
        testFrequency: 'every 30 minutes',
        bestFor: ['deep learning', 'exam preparation', 'long-term retention'],
        effectiveness: 0.88,
      },
      feynmanTechnique: {
        name: 'Feynman Technique',
        description: 'Explain concepts in simple terms to identify knowledge gaps',
        steps: [
          'Choose a concept',
          'Explain it simply',
          'Identify gaps',
          'Refine and simplify',
        ],
        bestFor: ['understanding', 'complex topics', 'conceptual clarity'],
        effectiveness: 0.89,
      },
      deepWork: {
        name: 'Deep Work',
        description: 'Extended focused sessions (90+ minutes) for complex problem-solving',
        sessionDuration: 90,
        breakDuration: 20,
        bestFor: ['programming', 'mathematics', 'research', 'writing'],
        effectiveness: 0.91,
      },
      interleaving: {
        name: 'Interleaving',
        description: 'Mix different topics or problem types during study sessions',
        mixRatio: '50-50',
        bestFor: ['problem-solving', 'pattern recognition', 'skill transfer'],
        effectiveness: 0.87,
      },
    };

    return {
      type: 'text' as const,
      text: JSON.stringify(methodologies, null, 2),
    };
  }

  /**
   * Course difficulty map - estimated effort per subject type
   */
  @Resource({
    uri: 'studyschedule://course-difficulty-map',
    name: 'Course Difficulty Map',
    description: 'Estimated study hours and difficulty levels by subject type',
    mimeType: 'application/json',
  })
  async courseDifficultyMap(context: ExecutionContext) {
    const difficultyMap = {
      STEM: {
        category: 'Science, Technology, Engineering, Mathematics',
        subcategories: {
          mathematics: {
            difficulty: 'hard',
            hoursPerCredit: 4.5,
            recommendedStudyMethod: 'Deep Work + Active Recall',
            topicsPerWeek: 2,
          },
          physics: {
            difficulty: 'hard',
            hoursPerCredit: 4.0,
            recommendedStudyMethod: 'Problem-solving + Spaced Repetition',
            topicsPerWeek: 2,
          },
          chemistry: {
            difficulty: 'hard',
            hoursPerCredit: 3.8,
            recommendedStudyMethod: 'Lab work + Visualization',
            topicsPerWeek: 3,
          },
          computerScience: {
            difficulty: 'hard',
            hoursPerCredit: 4.2,
            recommendedStudyMethod: 'Hands-on coding + Deep Work',
            topicsPerWeek: 2,
          },
          biology: {
            difficulty: 'medium',
            hoursPerCredit: 3.5,
            recommendedStudyMethod: 'Memorization + Visualization',
            topicsPerWeek: 3,
          },
        },
      },
      humanities: {
        category: 'Languages, Literature, History, Philosophy',
        subcategories: {
          literature: {
            difficulty: 'medium',
            hoursPerCredit: 2.8,
            recommendedStudyMethod: 'Reading + Discussion',
            topicsPerWeek: 4,
          },
          history: {
            difficulty: 'medium',
            hoursPerCredit: 2.5,
            recommendedStudyMethod: 'Timeline + Spaced Repetition',
            topicsPerWeek: 3,
          },
          philosophy: {
            difficulty: 'medium',
            hoursPerCredit: 3.0,
            recommendedStudyMethod: 'Critical thinking + Discussion',
            topicsPerWeek: 2,
          },
          languages: {
            difficulty: 'medium',
            hoursPerCredit: 3.5,
            recommendedStudyMethod: 'Immersion + Spaced Repetition',
            topicsPerWeek: 5,
          },
        },
      },
      socialSciences: {
        category: 'Economics, Psychology, Sociology, Political Science',
        subcategories: {
          economics: {
            difficulty: 'medium',
            hoursPerCredit: 3.0,
            recommendedStudyMethod: 'Problem-solving + Case studies',
            topicsPerWeek: 3,
          },
          psychology: {
            difficulty: 'easy',
            hoursPerCredit: 2.5,
            recommendedStudyMethod: 'Reading + Discussion',
            topicsPerWeek: 4,
          },
          sociology: {
            difficulty: 'easy',
            hoursPerCredit: 2.3,
            recommendedStudyMethod: 'Case studies + Discussion',
            topicsPerWeek: 4,
          },
        },
      },
      arts: {
        category: 'Fine Arts, Music, Design',
        subcategories: {
          fineArts: {
            difficulty: 'easy',
            hoursPerCredit: 2.0,
            recommendedStudyMethod: 'Practice + Feedback',
            topicsPerWeek: 3,
          },
          music: {
            difficulty: 'medium',
            hoursPerCredit: 3.0,
            recommendedStudyMethod: 'Practice + Theory study',
            topicsPerWeek: 3,
          },
          design: {
            difficulty: 'medium',
            hoursPerCredit: 2.8,
            recommendedStudyMethod: 'Project-based + Feedback',
            topicsPerWeek: 2,
          },
        },
      },
    };

    return {
      type: 'text' as const,
      text: JSON.stringify(difficultyMap, null, 2),
    };
  }

  /**
   * GPA conversion table - grade to GPA mappings
   */
  @Resource({
    uri: 'studyschedule://gpa-conversion',
    name: 'GPA Conversion Table',
    description: 'Grade to GPA conversion for different grading systems',
    mimeType: 'application/json',
  })
  async gpaConversion(context: ExecutionContext) {
    const conversions = {
      us4Point0Scale: {
        name: 'US 4.0 Scale',
        grades: [
          { letterGrade: 'A+', gpa: 4.0, percentage: '97-100' },
          { letterGrade: 'A', gpa: 4.0, percentage: '93-96' },
          { letterGrade: 'A-', gpa: 3.7, percentage: '90-92' },
          { letterGrade: 'B+', gpa: 3.3, percentage: '87-89' },
          { letterGrade: 'B', gpa: 3.0, percentage: '83-86' },
          { letterGrade: 'B-', gpa: 2.7, percentage: '80-82' },
          { letterGrade: 'C+', gpa: 2.3, percentage: '77-79' },
          { letterGrade: 'C', gpa: 2.0, percentage: '73-76' },
          { letterGrade: 'C-', gpa: 1.7, percentage: '70-72' },
          { letterGrade: 'D+', gpa: 1.3, percentage: '67-69' },
          { letterGrade: 'D', gpa: 1.0, percentage: '63-66' },
          { letterGrade: 'D-', gpa: 0.7, percentage: '60-62' },
          { letterGrade: 'F', gpa: 0.0, percentage: '0-59' },
        ],
      },
      uk2Point0Scale: {
        name: 'UK 2.0 Scale',
        grades: [
          { classification: 'First Class (1st)', gpa: 2.0, percentage: '70+' },
          { classification: 'Upper Second Class (2:1)', gpa: 1.5, percentage: '60-69' },
          { classification: 'Lower Second Class (2:2)', gpa: 1.0, percentage: '50-59' },
          { classification: 'Third Class (3rd)', gpa: 0.5, percentage: '40-49' },
          { classification: 'Pass', gpa: 0.0, percentage: '30-39' },
        ],
      },
      percentageScale: {
        name: 'Percentage Scale',
        grades: [
          { range: '90-100', gpa: 4.0, description: 'Excellent' },
          { range: '80-89', gpa: 3.5, description: 'Very Good' },
          { range: '70-79', gpa: 3.0, description: 'Good' },
          { range: '60-69', gpa: 2.5, description: 'Satisfactory' },
          { range: '50-59', gpa: 2.0, description: 'Pass' },
          { range: '0-49', gpa: 0.0, description: 'Fail' },
        ],
      },
    };

    return {
      type: 'text' as const,
      text: JSON.stringify(conversions, null, 2),
    };
  }

  /**
   * Sample schedules - example daily/weekly templates
   */
  @Resource({
    uri: 'studyschedule://sample-schedules',
    name: 'Sample Study Schedules',
    description: 'Example daily and weekly study schedule templates for different scenarios',
    mimeType: 'application/json',
  })
  async sampleSchedules(context: ExecutionContext) {
    const samples = {
      fullTimeStudent: {
        name: 'Full-Time Student Schedule',
        description: 'For students with no work commitments',
        dailyHours: 6,
        weeklyHours: 30,
        template: {
          monday: [
            { time: '09:00-10:30', activity: 'Lecture/Class', duration: 1.5 },
            { time: '10:30-11:00', activity: 'Break', duration: 0.5 },
            { time: '11:00-12:30', activity: 'Study/Review', duration: 1.5 },
            { time: '12:30-13:30', activity: 'Lunch', duration: 1 },
            { time: '13:30-15:00', activity: 'Lab/Practical', duration: 1.5 },
            { time: '15:00-15:30', activity: 'Break', duration: 0.5 },
            { time: '15:30-17:00', activity: 'Study/Assignment', duration: 1.5 },
            { time: '17:00-18:00', activity: 'Free time', duration: 1 },
          ],
          totalStudyHours: 6,
        },
      },
      workingStudent: {
        name: 'Working Student Schedule',
        description: 'For students with part-time work (20 hours/week)',
        dailyHours: 3,
        weeklyHours: 15,
        template: {
          monday: [
            { time: '06:00-07:00', activity: 'Morning study', duration: 1 },
            { time: '07:00-08:00', activity: 'Breakfast/Commute', duration: 1 },
            { time: '08:00-12:00', activity: 'Work', duration: 4 },
            { time: '12:00-13:00', activity: 'Lunch', duration: 1 },
            { time: '13:00-17:00', activity: 'Classes', duration: 4 },
            { time: '17:00-18:00', activity: 'Break', duration: 1 },
            { time: '18:00-20:00', activity: 'Evening study', duration: 2 },
          ],
          totalStudyHours: 3,
        },
      },
      examPrep: {
        name: 'Exam Preparation Schedule',
        description: 'Intensive schedule for exam preparation (4 weeks before exam)',
        dailyHours: 8,
        weeklyHours: 56,
        template: {
          monday: [
            { time: '08:00-09:30', activity: 'Review notes', duration: 1.5 },
            { time: '09:30-10:00', activity: 'Break', duration: 0.5 },
            { time: '10:00-11:30', activity: 'Practice problems', duration: 1.5 },
            { time: '11:30-12:00', activity: 'Break', duration: 0.5 },
            { time: '12:00-13:00', activity: 'Lunch', duration: 1 },
            { time: '13:00-14:30', activity: 'Mock exam', duration: 1.5 },
            { time: '14:30-15:00', activity: 'Break', duration: 0.5 },
            { time: '15:00-16:30', activity: 'Review weak areas', duration: 1.5 },
            { time: '16:30-17:00', activity: 'Break', duration: 0.5 },
            { time: '17:00-18:30', activity: 'Study group', duration: 1.5 },
          ],
          totalStudyHours: 8,
        },
      },
      balancedApproach: {
        name: 'Balanced Study Schedule',
        description: 'Balanced schedule with study, work, and personal time',
        dailyHours: 4,
        weeklyHours: 20,
        template: {
          monday: [
            { time: '07:00-08:00', activity: 'Morning routine', duration: 1 },
            { time: '08:00-12:00', activity: 'Work/Classes', duration: 4 },
            { time: '12:00-13:00', activity: 'Lunch', duration: 1 },
            { time: '13:00-17:00', activity: 'Work/Classes', duration: 4 },
            { time: '17:00-18:00', activity: 'Break/Exercise', duration: 1 },
            { time: '18:00-20:00', activity: 'Study', duration: 2 },
            { time: '20:00-21:00', activity: 'Dinner', duration: 1 },
            { time: '21:00-22:00', activity: 'Personal time', duration: 1 },
          ],
          totalStudyHours: 2,
        },
      },
    };

    return {
      type: 'text' as const,
      text: JSON.stringify(samples, null, 2),
    };
  }

  /**
   * Study tips and best practices
   */
  @Resource({
    uri: 'studyschedule://study-tips',
    name: 'Study Tips & Best Practices',
    description: 'Evidence-based study tips and best practices for academic success',
    mimeType: 'application/json',
  })
  async studyTips(context: ExecutionContext) {
    const tips = {
      timeManagement: [
        'Use the Pomodoro Technique: 25 minutes focused study + 5 minute break',
        'Schedule study sessions during your peak energy hours',
        'Break large tasks into smaller, manageable chunks',
        'Use a calendar or planner to track deadlines and study sessions',
        'Avoid multitasking - focus on one subject at a time',
      ],
      effectiveStudying: [
        'Active recall: Test yourself frequently instead of just re-reading',
        'Spaced repetition: Review material at increasing intervals',
        'Teach others: Explaining concepts helps solidify understanding',
        'Use multiple resources: Textbooks, videos, practice problems',
        'Create summaries and mind maps to organize information',
      ],
      healthAndWellness: [
        'Get 7-9 hours of sleep per night for optimal cognitive function',
        'Exercise regularly to improve focus and reduce stress',
        'Eat healthy meals and stay hydrated',
        'Take regular breaks to avoid burnout',
        'Practice mindfulness or meditation to reduce anxiety',
      ],
      examPreparation: [
        'Start studying at least 2-3 weeks before the exam',
        'Review past exams and practice problems',
        'Form study groups to discuss difficult concepts',
        'Get adequate sleep the night before the exam',
        'Arrive early and read instructions carefully',
      ],
      avoidingProcrastination: [
        'Break tasks into smaller steps with individual deadlines',
        'Use the "2-minute rule": If it takes less than 2 minutes, do it now',
        'Eliminate distractions: Phone, social media, notifications',
        'Create a dedicated study space',
        'Reward yourself after completing study sessions',
      ],
    };

    return {
      type: 'text' as const,
      text: JSON.stringify(tips, null, 2),
    };
  }
}
