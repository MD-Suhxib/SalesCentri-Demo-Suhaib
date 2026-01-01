"use client";

import React, { useState, useEffect } from 'react';
import { ICPResult, SampleLead, LightningInputs } from '../types/lightningMode';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Copy, ExternalLink, Mail, Linkedin, Building2, Users, Target, TrendingUp, Zap, ChevronRight } from 'lucide-react';

interface LightningModeChatProps {
  inputs: LightningInputs;
  onComplete: (icp: ICPResult, leads: SampleLead[]) => void;
  onNextQuestion: (question: string, response: string) => void;
}

interface Question {
  id: string;
  question: string;
  type: 'text' | 'select' | 'multi-select';
  options?: string[];
  required: boolean;
}

const LIGHTNING_QUESTIONS: Question[] = [
  {
    id: 'company_goals',
    question: 'What are your main business goals for this quarter?',
    type: 'text',
    required: true
  },
  {
    id: 'target_audience',
    question: 'Who is your ideal customer? (job titles, industries, company size)',
    type: 'text',
    required: true
  },
  {
    id: 'pain_points',
    question: 'What are the biggest challenges your customers face?',
    type: 'text',
    required: true
  },
  {
    id: 'budget_range',
    question: 'What budget range are you targeting?',
    type: 'select',
    options: ['Under $10K', '$10K - $50K', '$50K - $100K', '$100K - $500K', 'Over $500K'],
    required: true
  },
  {
    id: 'outreach_preference',
    question: 'What outreach channels do you prefer?',
    type: 'multi-select',
    options: ['Email', 'LinkedIn', 'Phone', 'Social Media', 'Direct Mail'],
    required: true
  }
];

export function LightningModeChat({ inputs, onComplete, onNextQuestion }: LightningModeChatProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [icpResult, setIcpResult] = useState<ICPResult | null>(null);
  const [sampleLeads, setSampleLeads] = useState<SampleLead[]>([]);

  const currentQuestion = LIGHTNING_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === LIGHTNING_QUESTIONS.length - 1;

  const handleResponse = (response: string | string[]) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: response
    }));
  };

  const handleNext = async () => {
    const response = responses[currentQuestion.id];
    
    if (!response || (Array.isArray(response) && response.length === 0)) {
      alert('Please provide an answer before continuing.');
      return;
    }

    // Call the next question callback
    onNextQuestion(currentQuestion.question, Array.isArray(response) ? response.join(', ') : response);

    if (isLastQuestion) {
      // Generate ICP and leads
      setIsGenerating(true);
      try {
        const result = await generateLightningModeResults(inputs, responses);
        setIcpResult(result.icp);
        setSampleLeads(result.leads);
        setShowResults(true);
        onComplete(result.icp, result.leads);
      } catch (error) {
        console.error('Error generating results:', error);
        alert('Failed to generate results. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (showResults && icpResult && sampleLeads.length > 0) {
    return (
      <div className="space-y-6">
        {/* ICP Summary */}
        <Card className="bg-gradient-to-r from-yellow-950/20 to-orange-950/20 border-yellow-400/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <Target className="h-5 w-5" />
              Your Ideal Customer Profile (ICP)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-300 mb-2">Target Personas</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-gray-400">Job Titles:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {icpResult.personas.jobTitles.map((title, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Industries:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {icpResult.personas.industries.map((industry, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-gray-300 mb-2">Company Characteristics</h4>
                <div className="space-y-1 text-sm">
                  <div><span className="font-medium text-gray-300">Size:</span> <span className="text-gray-400">{icpResult.companyCharacteristics.size}</span></div>
                  <div><span className="font-medium text-gray-300">Revenue:</span> <span className="text-gray-400">{icpResult.companyCharacteristics.revenue}</span></div>
                  <div><span className="font-medium text-gray-300">Location:</span> <span className="text-gray-400">{icpResult.companyCharacteristics.location}</span></div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-gray-300 mb-2">Pain Points</h4>
              <div className="flex flex-wrap gap-1">
                {icpResult.painPoints.map((painPoint, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {painPoint}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Leads */}
        <Card className="bg-gradient-to-r from-yellow-950/20 to-orange-950/20 border-yellow-400/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <Users className="h-5 w-5" />
              Sample Leads ({sampleLeads.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleLeads.map((lead, index) => (
                <div key={index} className="border border-gray-700 rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-lg text-white">{lead.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {lead.title}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {lead.company}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {lead.industry}
                        </div>
                        <div>{lead.location}</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        const leadText = `Name: ${lead.name}\nTitle: ${lead.title}\nCompany: ${lead.company}\nEmail: ${lead.email}\nLinkedIn: ${lead.linkedin}\nOutreach Message:\n${lead.outreachMessage}`;
                        copyToClipboard(leadText);
                      }}
                      size="sm"
                      variant="outline"
                      className="ml-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-sm text-gray-400">
                    <span className="font-medium">Why they fit:</span> {lead.reasoning}
                  </div>

                  <div className="bg-gray-800/50 rounded p-3">
                    <div className="text-sm font-medium text-gray-300 mb-2">Outreach Message:</div>
                    <div className="text-sm text-gray-400 whitespace-pre-line">
                      {lead.outreachMessage}
                    </div>
                    <Button
                      onClick={() => copyToClipboard(lead.outreachMessage)}
                      size="sm"
                      variant="ghost"
                      className="mt-2 text-xs"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy Message
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    {lead.linkedin && (
                      <a
                        href={lead.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                      >
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    <div className="flex items-center gap-1 text-gray-400">
                      <Mail className="h-4 w-4" />
                      {lead.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-yellow-300 text-lg">Generating your ICP and sample leads...</p>
        <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-400" />
          <span className="text-yellow-400 font-semibold">Lightning Mode</span>
        </div>
        <div className="flex-1 bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / LIGHTNING_QUESTIONS.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-gray-400">
          {currentQuestionIndex + 1} of {LIGHTNING_QUESTIONS.length}
        </span>
      </div>

      {/* Question */}
      <Card className="bg-gradient-to-r from-yellow-950/20 to-orange-950/20 border-yellow-400/20">
        <CardHeader>
          <CardTitle className="text-yellow-400">
            Question {currentQuestionIndex + 1}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-white mb-6">{currentQuestion.question}</p>
          
          {currentQuestion.type === 'text' && (
            <textarea
              value={responses[currentQuestion.id] as string || ''}
              onChange={(e) => handleResponse(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none resize-none"
              rows={4}
            />
          )}

          {currentQuestion.type === 'select' && (
            <div className="space-y-2">
              {currentQuestion.options?.map((option) => (
                <label key={option} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option}
                    checked={responses[currentQuestion.id] === option}
                    onChange={(e) => handleResponse(e.target.value)}
                    className="text-yellow-500 focus:ring-yellow-500"
                  />
                  <span className="text-white">{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'multi-select' && (
            <div className="space-y-2">
              {currentQuestion.options?.map((option) => (
                <label key={option} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    value={option}
                    checked={(responses[currentQuestion.id] as string[] || []).includes(option)}
                    onChange={(e) => {
                      const currentValues = (responses[currentQuestion.id] as string[] || []);
                      if (e.target.checked) {
                        handleResponse([...currentValues, option]);
                      } else {
                        handleResponse(currentValues.filter(v => v !== option));
                      }
                    }}
                    className="text-yellow-500 focus:ring-yellow-500"
                  />
                  <span className="text-white">{option}</span>
                </label>
              ))}
            </div>
          )}

          <Button
            onClick={handleNext}
            className="mt-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
          >
            {isLastQuestion ? 'Generate Results' : 'Next Question'}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to generate lightning mode results
async function generateLightningModeResults(inputs: LightningInputs, responses: Record<string, string | string[]>): Promise<{ icp: ICPResult; leads: SampleLead[] }> {
  try {
    const response = await fetch('/api/lightning-mode/icp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        inputs,
        responses // Include the question responses
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }

    return {
      icp: result.icp,
      leads: result.sampleLeads
    };
  } catch (error) {
    console.error('Error generating lightning mode results:', error);
    throw error;
  }
}
