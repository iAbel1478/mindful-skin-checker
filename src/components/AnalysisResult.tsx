
import React from 'react';
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

interface AnalysisResultProps {
  risk: 'low' | 'medium' | 'high';
  confidence: number;
  onReset: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ risk, confidence, onReset }) => {
  const resultConfig = {
    low: {
      icon: CheckCircle,
      title: "Low Risk Detected",
      color: "text-green-500",
      bg: "bg-green-50",
      border: "border-green-200"
    },
    medium: {
      icon: AlertCircle,
      title: "Medium Risk Detected",
      color: "text-yellow-500",
      bg: "bg-yellow-50",
      border: "border-yellow-200"
    },
    high: {
      icon: AlertTriangle,
      title: "High Risk Detected",
      color: "text-red-500",
      bg: "bg-red-50",
      border: "border-red-200"
    }
  }[risk];

  return (
    <div className="animate-fadeIn">
      <Card className={`p-6 ${resultConfig.bg} ${resultConfig.border} border-2`}>
        <div className="flex items-center gap-4 mb-4">
          <resultConfig.icon className={`w-8 h-8 ${resultConfig.color}`} />
          <h3 className={`text-xl font-semibold ${resultConfig.color}`}>
            {resultConfig.title}
          </h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-700">
            Confidence: {(confidence * 100).toFixed(1)}%
          </p>
          
          <Alert>
            <AlertTitle>Important Medical Disclaimer</AlertTitle>
            <AlertDescription>
              This analysis is not a medical diagnosis. Please consult with a qualified healthcare provider
              for proper evaluation of any skin concerns, regardless of these results.
            </AlertDescription>
          </Alert>

          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={onReset}
              className="w-full mr-4"
            >
              Analyze Another Image
            </Button>
            <Button
              className="w-full bg-sage-600 hover:bg-sage-700"
              onClick={() => window.open('https://www.aad.org/', '_blank')}
            >
              Find a Dermatologist
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalysisResult;
