"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, CheckCircle } from "lucide-react";

interface OnboardingStep {
  title: string;
  description: string;
  target?: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: "Welcome to Panel Forge! 🎨",
    description: "Create amazing comic strips with AI in minutes. Let me show you around!",
  },
  {
    title: "Choose Your Art Style",
    description: "Select from 5 unique comic art styles - Classic, Manga, Graphic Novel, Retro Pulp, or Minimalist.",
  },
  {
    title: "Describe Your Story",
    description: "Enter your story idea. Be specific about characters, setting, and action for best results!",
  },
  {
    title: "Generate 3-Panel Strip",
    description: "Click generate and watch AI create your Setup → Action → Payoff comic sequence.",
  },
  {
    title: "Add Captions",
    description: "Use AI to generate captions or write your own. Edit them to perfect your story!",
  },
  {
    title: "Save & Continue",
    description: "Save your comic and add more strips to build a complete story with visual continuity.",
  },
  {
    title: "Explore Features",
    description: "Check out Templates for quick starts, Analytics to track your creations, and Export to share!",
  },
];

export function OnboardingTour() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen onboarding before
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  if (!showOnboarding) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close onboarding"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-500">
              Step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </span>
            <span className="text-xs text-gray-500">{Math.round(((currentStep + 1) / ONBOARDING_STEPS.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gray-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h2>
          <p className="text-gray-600 leading-relaxed">{step.description}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {!isLastStep && (
            <button
              onClick={handleSkip}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Skip Tour
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            {isLastStep ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Get Started
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-6">
          {ONBOARDING_STEPS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-gray-900 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}




