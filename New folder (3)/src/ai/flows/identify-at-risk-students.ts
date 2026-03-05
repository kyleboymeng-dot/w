'use server';
/**
 * @fileOverview This file implements a Genkit flow for identifying students at risk of academic underperformance or attendance issues.
 *
 * - identifyAtRiskStudents - A function that initiates the risk identification process for a list of students.
 * - IdentifyAtRiskStudentsInput - The input type for the identifyAtRiskStudents function, representing a list of student data.
 * - IdentifyAtRiskStudentsOutput - The return type for the identifyAtRiskStudents function, representing the risk assessment for each student.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyAtRiskStudentsInputSchema = z.array(
  z.object({
    studentId: z.string().describe('Unique identifier for the student.'),
    studentName: z.string().describe('Full name of the student.'),
    grades:
      z.array(
        z.object({
          subject: z
            .string()
            .describe('The name of the subject (e.g., "Mathematics", "English").'),
          score:
            z.number().min(0).max(100).describe('The numerical score for the subject, typically out of 100.'),
          gradeLetter: z
            .string()
            .optional()
            .describe('The letter grade for the subject (e.g., "A", "B+", "C").'),
        })
      )
      .describe('A list of the student\'s academic grades across different subjects.'),
    attendanceSummary: z
      .object({
        totalSchoolDays:
          z.number().min(1).describe('Total number of school days recorded.'),
        daysPresent: z.number().min(0).describe('Number of days the student was present.'),
        daysAbsent: z.number().min(0).describe('Number of days the student was absent.'),
        daysTardy: z.number().min(0).describe('Number of days the student was tardy.'),
      })
      .describe('Summary of the student\'s attendance record.'),
  })
);
export type IdentifyAtRiskStudentsInput = z.infer<typeof IdentifyAtRiskStudentsInputSchema>;

const IdentifyAtRiskStudentsOutputSchema = z.array(
  z.object({
    studentId: z.string().describe('Unique identifier for the student.'),
    studentName: z.string().describe('Full name of the student.'),
    isAtRisk:
      z.boolean().describe('True if the student is identified as at risk of academic underperformance or attendance issues, false otherwise.'),
    riskFactors:
      z
        .array(z.string())
        .optional()
        .describe('A list of specific factors contributing to the student\'s at-risk status (e.g., "Low grades in Math", "High absenteeism", "Frequent tardiness").'),
    overallRiskReason:
      z.string().describe('A comprehensive explanation of why the student is considered at risk, or why they are not.'),
    suggestedInterventions:
      z
        .array(z.string())
        .optional()
        .describe('A list of actionable steps or interventions to support the student (e.g., "Recommend tutoring in Math", "Schedule parent-teacher conference", "Monitor attendance closely").'),
  })
);
export type IdentifyAtRiskStudentsOutput = z.infer<typeof IdentifyAtRiskStudentsOutputSchema>;

export async function identifyAtRiskStudents(
  input: IdentifyAtRiskStudentsInput
): Promise<IdentifyAtRiskStudentsOutput> {
  return identifyAtRiskStudentsFlow(input);
}

const identifyAtRiskStudentsPrompt = ai.definePrompt({
  name: 'identifyAtRiskStudentsPrompt',
  input: {schema: IdentifyAtRiskStudentsInputSchema},
  output: {schema: IdentifyAtRiskStudentsOutputSchema},
  prompt: `You are an experienced academic advisor and risk assessment specialist for a school. Your task is to review student academic and attendance data and identify students who may be at risk of academic underperformance or attendance issues. For each student, you need to provide a clear assessment in a JSON array format.

Consider a student "at risk" if they exhibit:
- Consistent low academic performance: For example, an average score below 70% in multiple core subjects, or failing grades in critical subjects.
- Significant attendance problems: For example, an attendance rate below 90%, a high number of unexcused absences, or frequent tardiness.

For each student provided, analyze their grades and attendance summary. Determine if they are at risk, identify specific risk factors, provide an overall reason for your assessment, and suggest actionable interventions.

Return the response as a JSON array of student risk assessments, adhering to the specified output schema.

Here is the input student data for your analysis:

{{json this}}`,
});

const identifyAtRiskStudentsFlow = ai.defineFlow(
  {
    name: 'identifyAtRiskStudentsFlow',
    inputSchema: IdentifyAtRiskStudentsInputSchema,
    outputSchema: IdentifyAtRiskStudentsOutputSchema,
  },
  async input => {
    const {output} = await identifyAtRiskStudentsPrompt(input);
    return output!;
  }
);
