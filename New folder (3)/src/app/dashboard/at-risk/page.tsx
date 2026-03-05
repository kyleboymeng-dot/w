
"use client"

import { useState } from 'react';
import { identifyAtRiskStudents, IdentifyAtRiskStudentsOutput } from '@/ai/flows/identify-at-risk-students';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, BrainCircuit, CheckCircle2, User, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AtRiskPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<IdentifyAtRiskStudentsOutput | null>(null);
  const { toast } = useToast();

  const runAnalysis = async () => {
    setLoading(true);
    try {
      // Mock data input for the AI flow
      const mockInput = [
        {
          studentId: "s101",
          studentName: "John Doe",
          grades: [
            { subject: "Mathematics", score: 65, gradeLetter: "D" },
            { subject: "Science", score: 68, gradeLetter: "D" },
            { subject: "History", score: 85, gradeLetter: "B" }
          ],
          attendanceSummary: {
            totalSchoolDays: 100,
            daysPresent: 82,
            daysAbsent: 15,
            daysTardy: 3
          }
        },
        {
          studentId: "s102",
          studentName: "Jane Smith",
          grades: [
            { subject: "Mathematics", score: 92, gradeLetter: "A" },
            { subject: "Science", score: 95, gradeLetter: "A" }
          ],
          attendanceSummary: {
            totalSchoolDays: 100,
            daysPresent: 98,
            daysAbsent: 2,
            daysTardy: 0
          }
        },
        {
          studentId: "s103",
          studentName: "Mike Wilson",
          grades: [
            { subject: "Mathematics", score: 45, gradeLetter: "F" },
            { subject: "English", score: 70, gradeLetter: "C" }
          ],
          attendanceSummary: {
            totalSchoolDays: 100,
            daysPresent: 60,
            daysAbsent: 35,
            daysTardy: 5
          }
        }
      ];

      const output = await identifyAtRiskStudents(mockInput);
      setResults(output);
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error connecting to the AI analysis engine.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">At-Risk Analysis</h1>
          <p className="text-muted-foreground">AI-powered early detection for academic and attendance intervention.</p>
        </div>
        <Button 
          onClick={runAnalysis} 
          disabled={loading}
          className="bg-primary hover:bg-primary/90 shadow-md"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
          {loading ? "Analyzing Records..." : "Run AI Analysis"}
        </Button>
      </div>

      {!results && !loading && (
        <Card className="border-dashed py-20">
          <CardContent className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <BrainCircuit className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No Recent Analysis</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              Click the button above to process current student records through our risk prediction model.
            </p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-muted/50 rounded-t-lg" />
              <CardContent className="p-6 h-40" />
            </Card>
          ))}
        </div>
      )}

      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {results.map((student) => (
            <Card key={student.studentId} className={student.isAtRisk ? "border-l-4 border-l-destructive shadow-md" : "border-l-4 border-l-green-500 shadow-sm"}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{student.studentName}</CardTitle>
                      <CardDescription>ID: {student.studentId}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={student.isAtRisk ? "destructive" : "outline"} className={!student.isAtRisk ? "text-green-600 bg-green-50 border-green-200" : ""}>
                    {student.isAtRisk ? "High Risk" : "On Track"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">Assessment Reason</h4>
                  <p className="text-sm italic">&quot;{student.overallRiskReason}&quot;</p>
                </div>

                {student.isAtRisk && student.riskFactors && (
                  <div>
                    <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1 text-destructive" />
                      Critical Factors
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {student.riskFactors.map((f, idx) => (
                        <Badge key={idx} variant="secondary" className="text-[10px] font-normal">{f}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {student.isAtRisk && student.suggestedInterventions && (
                  <div className="pt-2">
                    <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1 text-primary" />
                      Recommended Interventions
                    </h4>
                    <ul className="text-sm space-y-1">
                      {student.suggestedInterventions.map((int, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span>{int}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
