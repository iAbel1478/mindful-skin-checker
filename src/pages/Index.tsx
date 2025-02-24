
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
      // Initialize the image classification pipeline with a general-purpose model
      const classifier = await pipeline(
        'image-classification',
        'onnx-community/mobilenetv4_conv_small.e2400_r224_in1k',
        { device: 'webgpu' }
      ) as ImageClassificationPipeline;

      // Convert the File to a URL that the model can process
      const imageUrl = URL.createObjectURL(image);
      
      // Analyze the image
      const results = await classifier(imageUrl) as ClassificationResult[];
      
      // Clean up the object URL after analysis
      URL.revokeObjectURL(imageUrl);

      // For demonstration purposes, we'll base the risk assessment on the model's confidence
      // Note: This is a simplified approach and should not be used for real medical diagnosis
      const primaryResult = results[0];
      const score = primaryResult.score;

      // Map confidence scores to risk levels
      let risk: 'low' | 'medium' | 'high';
      if (score < 0.3) { // Low confidence predictions
        risk = 'low';
      } else if (score < 0.7) { // Medium confidence predictions
        risk = 'medium';
      } else { // High confidence predictions
        risk = 'high';
      }

      // Set the result
      setResult({
        risk,
        confidence: score
      });

      // Show a toast message to remind users about the limitations
      toast({
        title: "Analysis Complete",
        description: "Remember: This is a demonstration only and should not be used for medical diagnosis.",
        duration: 5000,
      });

    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Error",
        description: "There was an error analyzing the image. Please try again.",
        variant: "destructive",
        duration: 5000,
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
            AI-Powered Image Analysis Demo
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Image Analysis Demo
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This is a demonstration of AI image analysis capabilities. Please note that this tool uses a general-purpose image classification model and is NOT meant for medical diagnosis. Always consult healthcare professionals for medical advice.
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
            <p className="font-bold">
              Important Disclaimer: This is a technology demonstration only.
            </p>
            <p className="mt-2">
              This tool uses a general-purpose image classification model and is not designed or validated for medical diagnosis.
              Always consult qualified healthcare professionals for medical advice and diagnosis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
