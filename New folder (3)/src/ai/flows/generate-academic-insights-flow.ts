'use server';
/**
 * @fileOverview This file implements a Genkit flow to generate AI-powered insights into student performance patterns and common learning challenges.
 *
 * - generateAcademicInsights - A function that handles the academic insights generation process.
 * - AcademicInsightInput - The input type for the generateAcademicInsights function.
 * - AcademicInsightOutput - The return type for the generateAcademicInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AcademicInsightInputSchema = z.object({
  classId: z.string().describe('The ID of the class for which to generate insights.'),
  students: z.array(z.object({
    id: z.string().describe('The ID of the student.'),
    name: z.string().describe('The name of the student.'),
    grades: z.array(z.object({
      subject: z.string().describe('The subject of the grade (e.g., Math, Science).'),
      assignment: z.string().describe('The name of the assignment or test.'),
      score: z.number().describe('The score received by the student.'),
      maxScore: z.number().describe('The maximum possible score for the assignment.'),
      date: z.string().describe('The date of the assignment in YYYY-MM-DD format.'),
    })).describe('A list of grades for the student across various assignments.'),
    attendance: z.array(z.object({
      date: z.string().describe('The date of the attendance record in YYYY-MM-DD format.'),
      status: z.enum(['present', 'absent', 'tardy']).describe('The attendance status for the day.'),
    })).describe('A list of attendance records for the student.'),
    behavioralNotes: z.array(z.string()).optional().describe('Any qualitative behavioral observations or notes for the student.'),
  })).describe('An array of student data. If only one student is provided, insights will focus on that individual. If multiple students are provided, insights will focus on class-wide patterns.'),
  context: z.string().optional().describe('Additional context or specific areas to focus the analysis on (e.g., "focus on math performance in Q1").'),
});
export type AcademicInsightInput = z.infer<typeof AcademicInsightInputSchema>;

const AcademicInsightOutputSchema = z.object({
  focus: z.string().describe('Indicates whether the insights are for an individual student or the class as a whole.'),
  overallSummary: z.string().describe('A high-level summary of the academic performance and attendance observed.'),
  performancePatterns: z.string().describe('Detailed analysis of observable performance trends and patterns across subjects, assignments, or time periods.'),
  learningChallenges: z.string().describe('Identification of common learning difficulties, areas of struggle, or knowledge gaps.'),
  recommendations: z.string().describe('Actionable recommendations for teaching strategies, individualized support, or curricular adjustments.'),
  atRiskStudents: z.array(z.object({
    studentId: z.string().describe('The ID of the student identified as at-risk.'),
    reason: z.string().describe('Concise reason why the student is considered at-risk.'),
  })).optional().describe('A list of students who are identified as potentially at risk, with reasons. If no students are at risk, this array should be empty.'),
});
export type AcademicInsightOutput = z.infer<typeof AcademicInsightOutputSchema>;

export async function generateAcademicInsights(input: AcademicInsightInput): Promise<AcademicInsightOutput> {
  return generateAcademicInsightsFlow(input);
}

const academicInsightPrompt = ai.definePrompt({
  name: 'generateAcademicInsightsPrompt',
  input: { schema: AcademicInsightInputSchema },
  output: { schema: AcademicInsightOutputSchema },
  prompt: `You are an expert educational analyst. Your task is to analyze the provided student academic data for Class ID "{{classId}}" and generate comprehensive insights into performance patterns, common learning challenges, and actionable recommendations. You should also identify any students who appear to be at risk of falling behind.\n\nBased on the number of students provided, determine if the analysis should focus on an individual student or the class as a whole.\n\n## Data Provided:\n\n{{#if students}}\n  {{#each students}}\n    ### Student ID: {{this.id}}, Name: {{this.name}}\n    #### Grades:\n    {{#if this.grades}}\n      {{#each this.grades}}\n        - Subject: {{this.subject}}, Assignment: "{{this.assignment}}", Score: {{this.score}}/{{this.maxScore}}, Date: {{this.date}}\n      {{/each}}\n    {{else}}\n      No grade data available.\n    {{/if}}\n\n    #### Attendance:\n    {{#if this.attendance}}\n      {{#each this.attendance}}\n        - Date: {{this.date}}, Status: {{this.status}}\n      {{/each}}\n    {{else}}\n      No attendance data available.\n    {{/if}}\n\n    #### Behavioral Notes:\n    {{#if this.behavioralNotes}}\n      {{#each this.behavioralNotes}}\n        - "{{{this}}}"\n      {{/each}}\n    {{else}}\n      No behavioral notes available.\n    {{/if}}\n  {{/each}}\n{{else}}\n  No student data provided. Cannot generate insights.\n{{/if}}\n\n{{#if context}}\n## Additional Context for Analysis:\n{{{context}}}\n{{/if}}\n\n---\n\nAnalyze the above data comprehensively to fulfill the following sections. Ensure the output strictly adheres to the JSON schema.\n\n'focus': Indicate "Individual Student" if only one student's data is provided, otherwise "Class-Wide".\n'overallSummary': Provide a concise summary of the overall academic health and notable trends.\n'performancePatterns': Describe observable trends in grades (e.g., consistent high/low scores, improvement, decline, subject-specific strengths/weaknesses), attendance consistency, and how these might correlate.\n'learningChallenges': Identify specific areas where students (or the student) seem to struggle, common misconceptions, or recurring issues based on grades and behavioral notes.\n'recommendations': Offer practical and actionable advice for teachers or administrators to adapt teaching strategies, provide targeted support, or modify curriculum to address identified challenges and improve performance.\n'atRiskStudents': Based on a combination of low grades (e.g., significantly below average, failing assignments), high absenteeism, or negative behavioral patterns, identify specific students who might be at risk. For each, provide a brief reason. If no students are at risk, this array should be empty.\n\nYour analysis should be objective, data-driven, and insightful.`,
});

const generateAcademicInsightsFlow = ai.defineFlow(
  {
    name: 'generateAcademicInsightsFlow',
    inputSchema: AcademicInsightInputSchema,
    outputSchema: AcademicInsightOutputSchema,
  },
  async (input) => {
    const { output } = await academicInsightPrompt(input);
    return output!;
  }
);
