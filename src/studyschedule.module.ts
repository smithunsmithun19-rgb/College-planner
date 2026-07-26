import { Module } from '@nitrostack/core';
import { StudyScheduleTools } from './studyschedule.tools.js';
import { StudyScheduleResources } from './studyschedule.resources.js';
import { StudySchedulePrompts } from './studyschedule.prompts.js';

@Module({
  name: 'studyschedule',
  description: 'AI-powered study schedule generation and optimization. Parse curriculum PDFs, calculate study loads, generate personalized daily schedules, and export in multiple formats.',
  controllers: [StudyScheduleTools, StudyScheduleResources, StudySchedulePrompts],
})
export class StudyScheduleModule {}
