// Modular AI Service for Case Management System
// This service integrates the LLM capabilities with case analysis features

const { LLMService, LLMProvider } = require('./LLMService');
const fs = require('fs');
const path = require('path');

class AIAnalyzer {
  constructor() {
    this.llmService = new LLMService();
    this.analysisTypes = {
      SUMMARY: 'summary',
      CONNECTIONS: 'connections',
      LEADS: 'leads',
      TIMELINE: 'timeline'
    };
  }

  // Get the current LLM provider
  getCurrentProvider() {
    return this.llmService.getProvider();
  }

  // Set the LLM provider
  setProvider(provider) {
    return this.llmService.setProvider(provider);
  }

  // Check if a provider is available
  async isProviderAvailable(provider) {
    if (provider === LLMProvider.LOCAL) {
      return await this.llmService.isLocalLLMAvailable();
    }
    return true; // Assume cloud providers are available if keys are set
  }

  // Generate a comprehensive case summary based on case details and evidence
  async generateCaseSummary(caseData, evidenceList) {
    console.log(`Generating case summary for case: ${caseData.title}`);
    
    // Prepare the prompt for the LLM
    const prompt = this._prepareSummaryPrompt(caseData, evidenceList);
    
    try {
      const summary = await this.llmService.generateCompletion(prompt, {
        maxTokens: 1500,
        temperature: 0.3 // Lower temperature for more factual responses
      });
      
      return {
        type: this.analysisTypes.SUMMARY,
        content: summary,
        caseId: caseData.id,
        confidence: 0.9,
        provider: this.llmService.getProvider()
      };
    } catch (error) {
      console.error('Error generating case summary:', error);
      throw new Error(`Failed to generate case summary: ${error.message}`);
    }
  }

  // Identify connections between different pieces of evidence
  async identifyEvidenceConnections(caseData, evidenceList) {
    console.log(`Identifying evidence connections for case: ${caseData.title}`);
    
    // Prepare the prompt for the LLM
    const prompt = this._prepareConnectionsPrompt(caseData, evidenceList);
    
    try {
      const connectionsText = await this.llmService.generateCompletion(prompt, {
        maxTokens: 2000,
        temperature: 0.4
      });
      
      // Parse the connections from the LLM response
      const connections = this._parseConnectionsResponse(connectionsText, evidenceList);
      
      return {
        type: this.analysisTypes.CONNECTIONS,
        content: connections,
        caseId: caseData.id,
        confidence: 0.8,
        provider: this.llmService.getProvider()
      };
    } catch (error) {
      console.error('Error identifying evidence connections:', error);
      throw new Error(`Failed to identify evidence connections: ${error.message}`);
    }
  }

  // Generate investigative leads based on the evidence
  async generateInvestigativeLeads(caseData, evidenceList) {
    console.log(`Generating investigative leads for case: ${caseData.title}`);
    
    // Prepare the prompt for the LLM
    const prompt = this._prepareLeadsPrompt(caseData, evidenceList);
    
    try {
      const leadsText = await this.llmService.generateCompletion(prompt, {
        maxTokens: 1500,
        temperature: 0.5 // Slightly higher temperature for creative thinking
      });
      
      // Parse the leads from the LLM response
      const leads = this._parseLeadsResponse(leadsText);
      
      return {
        type: this.analysisTypes.LEADS,
        content: leads,
        caseId: caseData.id,
        confidence: 0.7,
        provider: this.llmService.getProvider()
      };
    } catch (error) {
      console.error('Error generating investigative leads:', error);
      throw new Error(`Failed to generate investigative leads: ${error.message}`);
    }
  }

  // Analyze the timeline for gaps and inconsistencies
  async analyzeTimeline(caseData, timelineEvents) {
    console.log(`Analyzing timeline for case: ${caseData.title}`);
    
    // Prepare the prompt for the LLM
    const prompt = this._prepareTimelineAnalysisPrompt(caseData, timelineEvents);
    
    try {
      const analysisText = await this.llmService.generateCompletion(prompt, {
        maxTokens: 1500,
        temperature: 0.3
      });
      
      // Parse the timeline analysis from the LLM response
      const analysis = this._parseTimelineAnalysisResponse(analysisText, timelineEvents);
      
      return {
        type: this.analysisTypes.TIMELINE,
        content: analysis,
        caseId: caseData.id,
        confidence: 0.8,
        provider: this.llmService.getProvider()
      };
    } catch (error) {
      console.error('Error analyzing timeline:', error);
      throw new Error(`Failed to analyze timeline: ${error.message}`);
    }
  }

  // Generate vector embeddings for evidence for similarity search
  async generateEvidenceEmbeddings(evidence) {
    console.log(`Generating embeddings for evidence: ${evidence.title}`);
    
    // Combine title and description for better embedding
    const text = `${evidence.title}. ${evidence.description}`;
    
    try {
      const embeddings = await this.llmService.generateEmbeddings(text);
      
      return {
        evidenceId: evidence.id,
        embedding: embeddings,
        provider: this.llmService.getProvider()
      };
    } catch (error) {
      console.error('Error generating evidence embeddings:', error);
      throw new Error(`Failed to generate evidence embeddings: ${error.message}`);
    }
  }

  // Find similar evidence based on vector similarity
  async findSimilarEvidence(evidence, allEvidence, limit = 5) {
    console.log(`Finding similar evidence for: ${evidence.title}`);
    
    try {
      // Get embeddings for the target evidence
      const targetEmbedding = evidence.embedding || 
        (await this.generateEvidenceEmbeddings(evidence)).embedding;
      
      // Calculate similarity scores for all other evidence
      const similarityScores = [];
      
      for (const otherEvidence of allEvidence) {
        // Skip the same evidence
        if (otherEvidence.id === evidence.id) continue;
        
        // Get embeddings for the other evidence
        const otherEmbedding = otherEvidence.embedding || 
          (await this.generateEvidenceEmbeddings(otherEvidence)).embedding;
        
        // Calculate cosine similarity
        const similarity = this._calculateCosineSimilarity(targetEmbedding, otherEmbedding);
        
        similarityScores.push({
          evidence: otherEvidence,
          similarity
        });
      }
      
      // Sort by similarity (highest first) and take the top 'limit'
      const topSimilar = similarityScores
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
      
      return topSimilar;
    } catch (error) {
      console.error('Error finding similar evidence:', error);
      throw new Error(`Failed to find similar evidence: ${error.message}`);
    }
  }

  // Perform a comprehensive analysis of a case
  async analyzeCase(caseData, evidenceList, timelineEvents) {
    console.log(`Performing comprehensive analysis for case: ${caseData.title}`);
    
    try {
      // Run all analyses in parallel
      const [summary, connections, leads, timelineAnalysis] = await Promise.all([
        this.generateCaseSummary(caseData, evidenceList),
        this.identifyEvidenceConnections(caseData, evidenceList),
        this.generateInvestigativeLeads(caseData, evidenceList),
        this.analyzeTimeline(caseData, timelineEvents)
      ]);
      
      return {
        caseId: caseData.id,
        summary,
        connections,
        leads,
        timelineAnalysis,
        provider: this.llmService.getProvider(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error performing comprehensive case analysis:', error);
      throw new Error(`Failed to analyze case: ${error.message}`);
    }
  }

  // Private helper methods
  
  // Prepare prompt for case summary
  _prepareSummaryPrompt(caseData, evidenceList) {
    let prompt = `You are an AI assistant for a case management system. Please provide a comprehensive summary of the following case based on the case details and evidence provided.\n\n`;
    
    prompt += `CASE DETAILS:\n`;
    prompt += `Title: ${caseData.title}\n`;
    prompt += `Description: ${caseData.description}\n`;
    prompt += `Type: ${caseData.type}\n`;
    prompt += `Priority: ${caseData.priority}\n\n`;
    
    prompt += `EVIDENCE (${evidenceList.length} items):\n`;
    
    evidenceList.forEach((evidence, index) => {
      prompt += `Evidence ${index + 1}: ${evidence.title}\n`;
      prompt += `Type: ${evidence.type}\n`;
      prompt += `Date/Time: ${evidence.dateTime}\n`;
      prompt += `Description: ${evidence.description}\n`;
      if (evidence.location) {
        prompt += `Location: ${JSON.stringify(evidence.location)}\n`;
      }
      prompt += `\n`;
    });
    
    prompt += `Please provide a detailed summary of this case that includes:\n`;
    prompt += `1. A concise overview of the case\n`;
    prompt += `2. Key facts established by the evidence\n`;
    prompt += `3. Important details that stand out\n`;
    prompt += `4. Chronological narrative of events based on the evidence\n`;
    prompt += `5. Any notable patterns or themes\n\n`;
    
    prompt += `Format your response as a well-structured summary that would be helpful for an investigator.`;
    
    return prompt;
  }
  
  // Prepare prompt for evidence connections
  _prepareConnectionsPrompt(caseData, evidenceList) {
    let prompt = `You are an AI assistant for a case management system. Please identify potential connections between different pieces of evidence in the following case.\n\n`;
    
    prompt += `CASE DETAILS:\n`;
    prompt += `Title: ${caseData.title}\n`;
    prompt += `Description: ${caseData.description}\n`;
    prompt += `Type: ${caseData.type}\n\n`;
    
    prompt += `EVIDENCE (${evidenceList.length} items):\n`;
    
    evidenceList.forEach((evidence, index) => {
      prompt += `Evidence ${index + 1}: ${evidence.title}\n`;
      prompt += `Type: ${evidence.type}\n`;
      prompt += `Date/Time: ${evidence.dateTime}\n`;
      prompt += `Description: ${evidence.description}\n`;
      if (evidence.location) {
        prompt += `Location: ${JSON.stringify(evidence.location)}\n`;
      }
      prompt += `\n`;
    });
    
    prompt += `Please identify potential connections between different pieces of evidence. For each connection, include:\n`;
    prompt += `1. The evidence items involved (refer to them by their numbers)\n`;
    prompt += `2. The nature of the connection\n`;
    prompt += `3. A confidence level (high, medium, or low)\n`;
    prompt += `4. An explanation of why these items might be connected\n\n`;
    
    prompt += `Format your response as a JSON array of connection objects with the following structure:\n`;
    prompt += `[
  {
    "evidenceIds": [1, 3],
    "connectionType": "temporal",
    "confidence": "high",
    "explanation": "Both events occurred within the same 30-minute window"
  },
  ...
]`;
    
    return prompt;
  }
  
  // Prepare prompt for investigative leads
  _prepareLeadsPrompt(caseData, evidenceList) {
    let prompt = `You are an AI assistant for a case management system. Based on the case details and evidence provided, please suggest potential investigative leads.\n\n`;
    
    prompt += `CASE DETAILS:\n`;
    prompt += `Title: ${caseData.title}\n`;
    prompt += `Description: ${caseData.description}\n`;
    prompt += `Type: ${caseData.type}\n`;
    prompt += `Priority: ${caseData.priority}\n\n`;
    
    prompt += `EVIDENCE (${evidenceList.length} items):\n`;
    
    evidenceList.forEach((evidence, index) => {
      prompt += `Evidence ${index + 1}: ${evidence.title}\n`;
      prompt += `Type: ${evidence.type}\n`;
      prompt += `Date/Time: ${evidence.dateTime}\n`;
      prompt += `Description: ${evidence.description}\n`;
      if (evidence.location) {
        prompt += `Location: ${JSON.stringify(evidence.location)}\n`;
      }
      prompt += `\n`;
    });
    
    prompt += `Please suggest potential investigative leads based on the evidence. For each lead, include:\n`;
    prompt += `1. A description of the lead\n`;
    prompt += `2. The priority level (high, medium, or low)\n`;
    prompt += `3. Related evidence items (refer to them by their numbers)\n`;
    prompt += `4. Suggested actions to follow up on this lead\n\n`;
    
    prompt += `Format your response as a JSON array of lead objects with the following structure:\n`;
    prompt += `[
  {
    "description": "Interview the witness mentioned in Evidence 2",
    "priority": "high",
    "relatedEvidenceIds": [2, 4],
    "suggestedActions": ["Locate witness", "Schedule interview", "Prepare questions about timeline discrepancy"]
  },
  ...
]`;
    
    return prompt;
  }
  
  // Prepare prompt for timeline analysis
  _prepareTimelineAnalysisPrompt(caseData, timelineEvents) {
    let prompt = `You are an AI assistant for a case management system. Please analyze the timeline of events for the following case to identify any gaps, inconsistencies, or patterns.\n\n`;
    
    prompt += `CASE DETAILS:\n`;
    prompt += `Title: ${caseData.title}\n`;
    prompt += `Description: ${caseData.description}\n`;
    prompt += `Type: ${caseData.type}\n\n`;
    
    prompt += `TIMELINE EVENTS (${timelineEvents.length} events):\n`;
    
    // Sort timeline events by date/time
    const sortedEvents = [...timelineEvents].sort((a, b) => 
      new Date(a.dateTime) - new Date(b.dateTime)
    );
    
    sortedEvents.forEach((event, index) => {
      prompt += `Event ${index + 1}: ${event.title}\n`;
      prompt += `Date/Time: ${event.dateTime}\n`;
      prompt += `Description: ${event.description}\n`;
      if (event.evidenceId) {
        prompt += `Related Evidence ID: ${event.evidenceId}\n`;
      }
      prompt += `\n`;
    });
    
    prompt += `Please analyze this timeline and identify:\n`;
    prompt += `1. Any significant gaps in the timeline\n`;
    prompt += `2. Potential inconsistencies between events\n`;
    prompt += `3. Notable patterns or clusters of activity\n`;
    prompt += `4. Key periods that require further investigation\n\n`;
    
    prompt += `Format your response as a JSON object with the following structure:\n`;
    prompt += `{
  "gaps": [
    {
      "startTime": "2023-04-10T18:30:00Z",
      "endTime": "2023-04-11T09:15:00Z",
      "description": "Nearly 15-hour gap between events 3 and 4",
      "significance": "high"
    }
  ],
  "inconsistencies": [
    {
      "eventIds": [2, 5],
      "description": "Events 2 and 5 contain contradictory information about location",
      "explanation": "Event 2 places the subject at home, while Event 5 indicates they were at work at the same time"
    }
  ],
  "patterns": [
    {
      "eventIds": [1, 3, 7],
      "description": "Recurring activity at the same location",
      "explanation": "Events 1, 3, and 7 all occurred at the same address within a 48-hour period"
    }
  ],
  "keyPeriods": [
    {
      "startTime": "2023-04-09T22:00:00Z",
      "endTime": "2023-04-10T02:00:00Z",
      "description": "Critical period surrounding the incident",
      "relevance": "This 4-hour window contains the most significant events and should be the focus of investigation"
    }
  ]
}`;
    
    return prompt;
  }
  
  // Parse connections response from LLM
  _parseConnectionsResponse(connectionsText, evidenceList) {
    try {
      // Try to parse as JSON first
      let connections = JSON.parse(connectionsText);
      
      // Validate and clean up the connections
      connections = connections.map(conn => {
        // Convert evidence numbers (1-based) to actual evidence IDs
        const evidenceIds = conn.evidenceIds.map(num => {
          const index = num - 1;
          return index >= 0 && index < evidenceList.length ? 
            evidenceList[index].id : null;
        }).filter(id => id !== null);
        
        return {
          evidenceIds,
          connectionType: conn.connectionType || 'unknown',
          confidence: conn.confidence || 'medium',
          explanation: conn.explanation || ''
        };
      });
      
      return connections;
    } catch (error) {
      console.error('Error parsing connections response:', error);
      
      // Fallback to a simple format if JSON parsing fails
      return [{
        evidenceIds: [],
        connectionType: 'unknown',
        confidence: 'low',
        explanation: connectionsText
      }];
    }
  }
  
  // Parse leads response from LLM
  _parseLeadsResponse(leadsText) {
    try {
      // Try to parse as JSON first
      let leads = JSON.parse(leadsText);
      
      // Validate and clean up the leads
      leads = leads.map(lead => {
        return {
          description: lead.description || '',
          priority: lead.priority || 'medium',
          relatedEvidenceIds: lead.relatedEvidenceIds || [],
          suggestedActions: lead.suggestedActions || []
        };
      });
      
      return leads;
    } catch (error) {
      console.error('Error parsing leads response:', error);
      
      // Fallback to a simple format if JSON parsing fails
      return [{
        description: leadsText,
        priority: 'medium',
        relatedEvidenceIds: [],
        suggestedActions: []
      }];
    }
  }
  
  // Parse timeline analysis response from LLM
  _parseTimelineAnalysisResponse(analysisText, timelineEvents) {
    try {
      // Try to parse as JSON first
      const analysis = JSON.parse(analysisText);
      
      // Ensure all required properties exist
      return {
        gaps: analysis.gaps || [],
        inconsistencies: analysis.inconsistencies || [],
        patterns: analysis.patterns || [],
        keyPeriods: analysis.keyPeriods || []
      };
    } catch (error) {
      console.error('Error parsing timeline analysis response:', error);
      
      // Fallback to a simple format if JSON parsing fails
      return {
        gaps: [],
        inconsistencies: [],
        patterns: [],
        keyPeriods: [],
        rawAnalysis: analysisText
      };
    }
  }
  
  // Calculate cosine similarity between two vectors
  _calculateCosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) {
      throw new Error('Invalid vectors for similarity calculation');
    }
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    
    if (normA === 0 || normB === 0) {
      return 0;
    }
    
    return dotProduct / (normA * normB);
  }
}

module.exports = AIAnalyzer;
