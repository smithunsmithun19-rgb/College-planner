import { ToolDecorator as Tool, ExecutionContext, z, Injectable } from '@nitrostack/core';

@Injectable()
export class CalculatorTools {
  
  @Tool({
    name: 'generate_daily_routine',
    description: 'Generates a comprehensive daily healthy routine including meals with nutrition details, exercise, study blocks, and sleep schedules based on wake-up and class start times.',
    inputSchema: z.object({
      wake_up_time: z.string().describe('Wake up time in HH:MM format (e.g., "06:00")'),
      college_start_time: z.string().describe('College start time in HH:MM format (e.g., "08:30")')
    })
  })
  async generateRoutine(
    input: { wake_up_time: string; college_start_time: string }, 
    ctx: ExecutionContext
  ) {
    ctx.logger.info('Generating daily routine', { 
      wake_up_time: input.wake_up_time, 
      college_start_time: input.college_start_time 
    });

    const routine = [
      {
        time: input.wake_up_time,
        activity: "Wake up & Hydrate",
        category: "Health",
        details: "Drink 500ml (2 glasses) of water immediately to kickstart metabolism."
      },
      {
        time: this.addMinutes(input.wake_up_time, 15),
        activity: "Morning Workout",
        category: "Exercise",
        details: "30-40 mins. Bodyweight exercises, mobility work, or a light jog around the Ettimadai area."
      },
      {
        time: this.addMinutes(input.wake_up_time, 60),
        activity: "Breakfast",
        category: "Diet",
        details: "Oats with mixed nuts, chia seeds, and a banana. (~400 kcal | 12g Protein | 60g Carbs | 10g Fat)"
      },
      {
        time: this.addMinutes(input.college_start_time, -45),
        activity: "Commute to Campus",
        category: "Transit",
        details: "Head to the Amrita Vishwa Vidyapeetham campus."
      },
      {
        time: input.college_start_time,
        activity: "Second Year Classes & Labs",
        category: "Academics",
        details: "Focus on primary coursework and lab sessions."
      },
      {
        time: "13:00", // Standardized lunch block, can be made dynamic if needed
        activity: "Lunch",
        category: "Diet",
        details: "Rice or roti, dal, mixed vegetables, and curd. (~600 kcal | 20g Protein | 80g Carbs | 15g Fat)"
      },
      {
        time: "16:30",
        activity: "Return & Unwind",
        category: "Downtime",
        details: "Light stretching and mental reset after classes."
      },
      {
        time: "17:00",
        activity: "Evening Snack & Leisure",
        category: "Leisure",
        details: "Green tea/coffee with a piece of fruit. (~150 kcal). Take an hour for sim racing (e.g., DiRT Rally 2.0) or log a film on Letterboxd."
      },
      {
        time: "18:30",
        activity: "Deep Work Study Session 1",
        category: "Study",
        details: "Programming block. Focus on Data Management with Python or Object-Oriented Java development."
      },
      {
        time: "20:00",
        activity: "Dinner",
        category: "Diet",
        details: "Grilled chicken or paneer, large green salad, and a light carb source. (~500 kcal | 35g Protein | 40g Carbs | 15g Fat)"
      },
      {
        time: "20:45",
        activity: "Deep Work Study Session 2",
        category: "Study",
        details: "Hardware & Theory block. Review electronics, semiconductor circuit theory, or optimize PC hardware."
      },
      {
        time: "22:15",
        activity: "Wind Down",
        category: "Health",
        details: "No screens. Read a book, plan the next day, and prepare for bed."
      },
      {
        time: "23:00",
        activity: "Sleep",
        category: "Health",
        details: "Ensure optimal room temperature. Aim for 7-8 hours of high-quality sleep for cognitive recovery."
      }
    ];

    return {
      success: true,
      message: 'Daily routine generated successfully.',
      inputs_used: {
        wake_up_time: input.wake_up_time,
        college_start_time: input.college_start_time
      },
      schedule: routine
    };
  }

  // Helper method to calculate timestamps dynamically
  private addMinutes(timeStr: string, mins: number): string {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes + mins, 0, 0);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
}