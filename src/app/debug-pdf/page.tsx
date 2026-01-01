/**
 * PDF Export Debug Test
 * This file helps debug PDF text rendering issues
 */

'use client';

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

export default function PdfDebugTest() {
  const [testResult, setTestResult] = useState<string>('');

  const testBasicPdf = () => {
    try {
      setTestResult('Creating basic PDF...');
      
      // Create a simple PDF
      const doc = new jsPDF();
      
      // Test basic text
      doc.setFontSize(16);
      doc.text('Test Header', 20, 20);
      
      doc.setFontSize(12);
      doc.text('This is a test message to verify PDF text rendering.', 20, 40);
      
      doc.setFontSize(10);
      doc.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 20, 60);
      doc.text('Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 20, 75);
      
      // Test colors
      doc.setTextColor(255, 0, 0); // Red
      doc.text('This text should be red', 20, 100);
      
      doc.setTextColor(0, 0, 255); // Blue
      doc.text('This text should be blue', 20, 115);
      
      doc.setTextColor(0, 0, 0); // Back to black
      doc.text('Back to black text', 20, 130);
      
      // Test line wrapping
      const longText = 'This is a very long line of text that should be wrapped properly across multiple lines to test the text wrapping functionality of the PDF generator.';
      const splitText = doc.splitTextToSize(longText, 170);
      doc.text(splitText, 20, 150);
      
      // Save the PDF
      doc.save('debug-test.pdf');
      
      setTestResult('✅ Basic PDF created successfully! Check your downloads folder for debug-test.pdf');
    } catch (error) {
      console.error('PDF creation failed:', error);
      setTestResult(`❌ PDF creation failed: ${error.message}`);
    }
  };

  const testImprovedExporter = async () => {
    try {
      setTestResult('Testing improved PDF exporter...');
      
      // Import the improved exporter
      const { exportResearchBotToPdf } = await import('../lib/improvedPdfExporter');
      
      const testQuery = "What are the latest AI trends for 2024?";
      const testResponse = `Based on current research, the key AI trends for 2024 include:

1. **Generative AI Mainstream Adoption**
   - Large language models becoming standard in business workflows
   - AI-powered content creation tools reaching enterprise scale
   - Integration with existing software ecosystems

2. **AI Ethics and Governance Frameworks**
   - Regulatory compliance becoming critical
   - Bias detection and mitigation tools
   - Transparent AI decision-making processes

3. **Edge AI Deployment**
   - On-device AI processing for privacy and speed
   - Reduced latency for real-time applications
   - Lower bandwidth requirements

4. **Multimodal AI Systems**
   - Text, image, and voice integration
   - Enhanced user interaction experiences
   - Cross-modal understanding capabilities

5. **AI-Powered Automation in Enterprise**
   - Intelligent process automation
   - Predictive analytics integration
   - Custom AI model development platforms

These trends represent significant opportunities for businesses to leverage AI technologies for competitive advantage and operational efficiency.`;

      await exportResearchBotToPdf(testQuery, testResponse, 'improved-test.pdf');
      
      setTestResult('✅ Improved PDF exporter test completed! Check your downloads folder for improved-test.pdf');
    } catch (error) {
      console.error('Improved PDF test failed:', error);
      setTestResult(`❌ Improved PDF test failed: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">PDF Export Debug Test</h1>
      
      <div className="space-y-4">
        <div>
          <button
            onClick={testBasicPdf}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-4"
          >
            Test Basic jsPDF
          </button>
          <span className="text-sm text-gray-600">
            Creates a simple PDF to test basic jsPDF functionality
          </span>
        </div>
        
        <div>
          <button
            onClick={testImprovedExporter}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-4"
          >
            Test Improved Exporter
          </button>
          <span className="text-sm text-gray-600">
            Tests the improved PDF exporter with research data
          </span>
        </div>
      </div>
      
      {testResult && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Test Result:</h3>
          <p className={testResult.includes('✅') ? 'text-green-700' : 'text-red-700'}>
            {testResult}
          </p>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">Debug Instructions:</h3>
        <ol className="text-sm text-yellow-700 space-y-1">
          <li>1. Click "Test Basic jsPDF" to verify jsPDF works</li>
          <li>2. Check downloaded PDF - does it have visible text?</li>
          <li>3. Click "Test Improved Exporter" to test our implementation</li>
          <li>4. Compare both PDFs to identify the issue</li>
          <li>5. Check browser console for any error messages</li>
        </ol>
      </div>
    </div>
  );
}
