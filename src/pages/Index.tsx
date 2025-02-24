import React, { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import AnalysisResult from '../components/AnalysisResult';
import { Card } from "@/components/ui/card";
import { pipeline, ImageClassificationPipeline } from '@huggingface/transformers';
import { useToast } from "@/components/ui/use-toast";

interface ClassificationResult {
  label: string;
  score: number;
}

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    risk: 'low' | 'medium' | 'high';
    confidence: number;
  } | null>(null);
  const { toast } = useToast();

  const handleImageSelected = async (image: File) => {
    setSelectedImage(image);
    setAnalyzing(true);

    try {
      const classifier = await pipeline(
        'image-classification',
        'google/dermnet',
        { device: 'webgpu' }
      ) as ImageClassificationPipeline;

      const imageUrl = URL.createObjectURL(image);
      const results = await classifier(imageUrl) as ClassificationResult[];
      URL.revokeObjectURL(imageUrl);

      const primaryResult = results[0];
      console.log('Classification results:', results);

      let risk: 'low' | 'medium' | 'high';
      const score = primaryResult.score;
      const label = primaryResult.label.toLowerCase();

      const highRiskConditions = ['melanoma', 'squamous cell carcinoma', 'basal cell carcinoma'];
      const mediumRiskConditions = ['actinic keratosis', 'dysplastic nevus', 'atypical mole'];

      if (highRiskConditions.some(condition => label.includes(condition))) {
        risk = score > 0.6 ? 'high' : score > 0.3 ? 'medium' : 'low';
      } else if (mediumRiskConditions.some(condition => label.includes(condition))) {
        risk = score > 0.7 ? 'medium' : 'low';
      } else {
        risk = score > 0.8 ? 'low' : score > 0.5 ? 'medium' : 'high';
      }

      setResult({
        risk,
        confidence: score
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Error",
        description: "There was an error analyzing the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
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
