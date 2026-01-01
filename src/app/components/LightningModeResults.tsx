"use client";

import React from 'react';
import { ICPResult, SampleLead } from '../types/lightningMode';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Copy, ExternalLink, Mail, Linkedin, Building2, Users, Target, TrendingUp } from 'lucide-react';

interface LightningModeResultsProps {
  icp: ICPResult;
  sampleLeads: SampleLead[];
  onCopyLead: (lead: SampleLead) => void;
  onExportLeads: () => void;
}

export function LightningModeResults({ icp, sampleLeads, onCopyLead, onExportLeads }: LightningModeResultsProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* ICP Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Ideal Customer Profile (ICP)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-600 mb-2">Target Personas</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-gray-500">Job Titles:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {icp.personas.jobTitles.map((title, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {title}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Industries:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {icp.personas.industries.map((industry, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm text-gray-600 mb-2">Company Characteristics</h4>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Size:</span> {icp.companyCharacteristics.size}</div>
                <div><span className="font-medium">Revenue:</span> {icp.companyCharacteristics.revenue}</div>
                <div><span className="font-medium">Location:</span> {icp.companyCharacteristics.location}</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-600 mb-2">Pain Points</h4>
            <div className="flex flex-wrap gap-1">
              {icp.painPoints.map((painPoint, index) => (
                <Badge key={index} variant="destructive" className="text-xs">
                  {painPoint}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-600 mb-2">Buying Behavior</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <div><span className="font-medium">Decision Process:</span> {icp.buyingBehavior.decisionProcess}</div>
              <div><span className="font-medium">Timeline:</span> {icp.buyingBehavior.timeline}</div>
              <div><span className="font-medium">Budget:</span> {icp.buyingBehavior.budget}</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-600 mb-2">Target Companies</h4>
            <div className="flex flex-wrap gap-1">
              {icp.targetCompanies.map((company, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {company}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Leads */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Sample Leads ({sampleLeads.length})
            </CardTitle>
            <Button onClick={onExportLeads} size="sm" variant="outline">
              Export All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sampleLeads.map((lead, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-lg">{lead.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {lead.title}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
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
                    onClick={() => onCopyLead(lead)}
                    size="sm"
                    variant="outline"
                    className="ml-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-sm text-gray-600">
                  <span className="font-medium">Why they fit:</span> {lead.reasoning}
                </div>

                <div className="bg-gray-50 rounded p-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Outreach Message:</div>
                  <div className="text-sm text-gray-600 whitespace-pre-line">
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
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  <div className="flex items-center gap-1 text-gray-600">
                    <Mail className="h-4 w-4" />
                    {lead.email}
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  <div><span className="font-medium">Company Size:</span> {lead.companyInfo.size}</div>
                  <div><span className="font-medium">Revenue:</span> {lead.companyInfo.revenue}</div>
                  <div><span className="font-medium">Technology:</span> {lead.companyInfo.technology}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
