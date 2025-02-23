
import React, { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import AnalysisResult from '../components/AnalysisResult';
import { Card } from "@/components/ui/card";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    risk: 'low' | 'medium' | 'high';
    confidence: number;
  } | null>(null);

  const handleImageSelected = async (image: File) => {
    setSelectedImage(image);
    setAnalyzing(true);
    
    // Simulate analysis (replace with actual AI model integration)
    setTimeout(() => {
      const mockResult = {
        risk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        confidence: 0.7 + Math.random() * 0.2
      };
      setResult(mockResult);
      setAnalyzing(false);
    }, 2000);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-white">
      <div className="container max-w-4xl px-4 py-12">
        <div className="text-center mb-12 animate-fadeIn">
          <span className="inline-block px-4 py-1 rounded-full bg-sage-100 text-sage-800 text-sm font-medium mb-4">
            AI-Powered Skin Analysis
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Early Skin Cancer Detection Assistant
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload an image of your skin concern for instant AI analysis. Remember, this tool is for educational purposes only and does not replace professional medical advice.
          </p>
        </div>

        <div className="space-y-8">
          {!result && (
            <div className="animate-fadeIn">
              <ImageUpload onImageSelected={handleImageSelected} />
            </div>
          )}

          {analyzing && (
            <Card className="p-8 text-center animate-pulse">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-sage-200 mx-auto" />
                <div className="h-4 bg-sage-100 rounded w-3/4 mx-auto" />
                <div className="h-4 bg-sage-100 rounded w-1/2 mx-auto" />
              </div>
            </Card>
          )}

          {result && (
            <AnalysisResult
              risk={result.risk}
              confidence={result.confidence}
              onReset={handleReset}
            />
          )}

          <div className="text-center text-sm text-gray-500 mt-8">
            <p>
              This tool is designed to assist, not diagnose. Always consult healthcare professionals for medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
