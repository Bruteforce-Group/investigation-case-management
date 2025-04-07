import { Anthropic } from '@anthropic-ai/sdk';
import { unifiedVectorSearch, updateEvidenceEmbedding, updateTimelineEventEmbedding, updatePersonEmbedding, updateLocationEmbedding } from './vector';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Default model to use
const DEFAULT_MODEL = 'claude-3-opus-20240229';

// Vector dimensions for Claude embeddings
const EMBEDDING_DIMENSIONS = 1536;

/**
 * Generate embeddings for text using Claude API
 * @param text Text to generate embeddings for
 * @returns Vector embedding as number array
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await anthropic.embeddings.create({
      model: 'claude-3-haiku-20240307',
      input: text,
    });
    
    return response.embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

/**
 * Generate embeddings for evidence and update in database
 * @param evidenceId Evidence ID
 * @param text Text to generate embeddings from (combines title, description, OCR text, etc.)
 */
export async function generateAndStoreEvidenceEmbedding(evidenceId: string, text: string): Promise<void> {
  const embedding = await generateEmbedding(text);
  await updateEvidenceEmbedding(evidenceId, embedding);
}

/**
 * Generate embeddings for timeline event and update in database
 * @param timelineEventId Timeline event ID
 * @param text Text to generate embeddings from (combines title, description, etc.)
 */
export async function generateAndStoreTimelineEventEmbedding(timelineEventId: string, text: string): Promise<void> {
  const embedding = await generateEmbedding(text);
  await updateTimelineEventEmbedding(timelineEventId, embedding);
}

/**
 * Generate embeddings for person and update in database
 * @param personId Person ID
 * @param text Text to generate embeddings from (combines name, description, etc.)
 */
export async function generateAndStorePersonEmbedding(personId: string, text: string): Promise<void> {
  const embedding = await generateEmbedding(text);
  await updatePersonEmbedding(personId, embedding);
}

/**
 * Generate embeddings for location and update in database
 * @param locationId Location ID
 * @param text Text to generate embeddings from (combines name, address, description, etc.)
 */
export async function generateAndStoreLocationEmbedding(locationId: string, text: string): Promise<void> {
  const embedding = await generateEmbedding(text);
  await updateLocationEmbedding(locationId, embedding);
}

/**
 * Perform semantic search across all entities using text query
 * @param query Text query to search with
 * @param caseId Optional case ID to limit search scope
 * @returns Search results grouped by entity type
 */
export async function semanticSearch(query: string, caseId?: string) {
  const embedding = await generateEmbedding(query);
  return unifiedVectorSearch(embedding, caseId);
}

/**
 * Analyze evidence using Claude API
 * @param evidenceText Text content of the evidence
 * @param prompt Custom prompt for analysis
 * @returns Analysis from Claude
 */
export async function analyzeEvidence(evidenceText: string, prompt?: string) {
  const defaultPrompt = `
    You are an expert investigative analyst. Analyze the following evidence and provide insights:
    1. Summarize the key information
    2. Identify key entities (people, places, dates, etc.)
    3. Note any inconsistencies or areas that need further investigation
    4. Suggest potential connections to explore
    
    Evidence:
    ${evidenceText}
  `;

  try {
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 1000,
      messages: [
        { role: 'user', content: prompt || defaultPrompt }
      ],
    });
    
    return response.content[0].text;
  } catch (error) {
    console.error('Error analyzing evidence:', error);
    throw new Error('Failed to analyze evidence');
  }
}

/**
 * Generate a timeline analysis using Claude API
 * @param timelineEvents Array of timeline events
 * @param prompt Custom prompt for analysis
 * @returns Analysis from Claude
 */
export async function analyzeTimeline(timelineEvents: any[], prompt?: string) {
  // Format timeline events for the prompt
  const eventsText = timelineEvents.map(event => {
    return `
      Date: ${new Date(event.eventDate).toLocaleDateString()}
      Title: ${event.title}
      Description: ${event.description || 'N/A'}
      Location: ${event.location || 'N/A'}
      Importance: ${event.importance}/5
      Confidence: ${event.confidenceLevel}/5
    `;
  }).join('\n\n');

  const defaultPrompt = `
    You are an expert investigative analyst. Analyze the following timeline of events and provide insights:
    1. Identify key patterns or sequences
    2. Note any gaps or inconsistencies in the timeline
    3. Suggest potential cause-and-effect relationships
    4. Identify the most significant events and turning points
    5. Suggest areas for further investigation
    
    Timeline Events:
    ${eventsText}
  `;

  try {
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 1500,
      messages: [
        { role: 'user', content: prompt || defaultPrompt }
      ],
    });
    
    return response.content[0].text;
  } catch (error) {
    console.error('Error analyzing timeline:', error);
    throw new Error('Failed to analyze timeline');
  }
}

/**
 * Generate a storyline analysis using Claude API
 * @param caseData Case data including evidence and timeline events
 * @param prompt Custom prompt for analysis
 * @returns Storyline analysis from Claude
 */
export async function generateStorylineAnalysis(caseData: any, prompt?: string) {
  // Format case data for the prompt
  const caseInfo = `
    Case: ${caseData.title}
    Description: ${caseData.description || 'N/A'}
    Status: ${caseData.status}
    Priority: ${caseData.priority}
    Start Date: ${new Date(caseData.startDate).toLocaleDateString()}
    ${caseData.endDate ? `End Date: ${new Date(caseData.endDate).toLocaleDateString()}` : ''}
  `;
  
  // Format evidence summary
  const evidenceSummary = caseData.evidence.map((item: any) => {
    return `
      Evidence: ${item.title}
      Type: ${item.evidenceType}
      Description: ${item.description || 'N/A'}
    `;
  }).join('\n');
  
  // Format timeline summary
  const timelineSummary = caseData.timelineEvents.map((event: any) => {
    return `
      Date: ${new Date(event.eventDate).toLocaleDateString()}
      Event: ${event.title}
      Description: ${event.description || 'N/A'}
    `;
  }).join('\n');

  const defaultPrompt = `
    You are an expert investigative analyst. Based on the following case information, evidence, and timeline, generate a comprehensive storyline analysis:
    
    ${caseInfo}
    
    EVIDENCE:
    ${evidenceSummary}
    
    TIMELINE:
    ${timelineSummary}
    
    Please provide:
    1. A coherent narrative that explains the events
    2. Key findings and insights
    3. Potential motives or explanations
    4. Alternative scenarios that could explain the evidence
    5. Gaps in the current understanding and areas for further investigation
    6. Confidence assessment of the overall analysis
  `;

  try {
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 2500,
      messages: [
        { role: 'user', content: prompt || defaultPrompt }
      ],
    });
    
    return response.content[0].text;
  } catch (error) {
    console.error('Error generating storyline analysis:', error);
    throw new Error('Failed to generate storyline analysis');
  }
}

/**
 * Analyze relationships between persons using Claude API
 * @param persons Array of persons with their relationships
 * @param prompt Custom prompt for analysis
 * @returns Relationship analysis from Claude
 */
export async function analyzeRelationships(persons: any[], relationships: any[], prompt?: string) {
  // Format persons data
  const personsText = persons.map(person => {
    return `
      Person: ${person.firstName} ${person.lastName} ${person.alias ? `(${person.alias})` : ''}
      Role: ${person.role || 'Unknown'}
      Description: ${person.description || 'N/A'}
    `;
  }).join('\n\n');
  
  // Format relationships data
  const relationshipsText = relationships.map(rel => {
    return `
      ${rel.personA.firstName} ${rel.personA.lastName} -> ${rel.type} -> ${rel.personB.firstName} ${rel.personB.lastName}
      Description: ${rel.description || 'N/A'}
    `;
  }).join('\n');

  const defaultPrompt = `
    You are an expert investigative analyst. Analyze the following persons and their relationships:
    
    PERSONS:
    ${personsText}
    
    RELATIONSHIPS:
    ${relationshipsText}
    
    Please provide:
    1. Key insights about the network of relationships
    2. Identify central figures and their significance
    3. Potential hidden relationships not explicitly stated
    4. Suggested areas for further investigation
    5. Visual description of how a relationship diagram should be structured
  `;

  try {
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 1500,
      messages: [
        { role: 'user', content: prompt || defaultPrompt }
      ],
    });
    
    return response.content[0].text;
  } catch (error) {
    console.error('Error analyzing relationships:', error);
    throw new Error('Failed to analyze relationships');
  }
}

export default {
  generateEmbedding,
  generateAndStoreEvidenceEmbedding,
  generateAndStoreTimelineEventEmbedding,
  generateAndStorePersonEmbedding,
  generateAndStoreLocationEmbedding,
  semanticSearch,
  analyzeEvidence,
  analyzeTimeline,
  generateStorylineAnalysis,
  analyzeRelationships
};
