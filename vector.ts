import { PrismaClient, Prisma } from '@prisma/client';
import { Pool } from 'pg';
import prisma from './prisma';

// Create a connection pool for direct PostgreSQL queries
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Interface for vector search options
interface VectorSearchOptions {
  limit?: number;
  threshold?: number;
  includeMetadata?: boolean;
}

/**
 * Performs a vector similarity search on evidence
 * @param embedding The vector embedding to search with
 * @param caseId Optional case ID to limit search scope
 * @param options Search options including limit and similarity threshold
 * @returns Array of evidence items with similarity scores
 */
export async function searchEvidenceByVector(
  embedding: number[],
  caseId?: string,
  options: VectorSearchOptions = {}
) {
  const {
    limit = 10,
    threshold = 0.7,
    includeMetadata = true
  } = options;

  // Convert embedding to PostgreSQL vector format
  const vectorString = `[${embedding.join(',')}]`;
  
  // Build the SQL query with optional case filter
  let query = `
    SELECT 
      e.id, 
      e.title, 
      e.description,
      e.evidence_type as "evidenceType",
      e.case_id as "caseId",
      ${includeMetadata ? 'e.ocr_text as "ocrText", e.transcription,' : ''}
      1 - (e.vector_embedding <=> $1::vector) as similarity
    FROM evidence e
    WHERE e.vector_embedding IS NOT NULL
      AND (1 - (e.vector_embedding <=> $1::vector)) > $2
  `;
  
  const queryParams = [vectorString, threshold];
  
  // Add case filter if provided
  if (caseId) {
    query += ` AND e.case_id = $3`;
    queryParams.push(caseId);
  }
  
  // Add ordering and limit
  query += `
    ORDER BY similarity DESC
    LIMIT $${queryParams.length + 1}
  `;
  queryParams.push(limit);
  
  // Execute the query
  const result = await pool.query(query, queryParams);
  return result.rows;
}

/**
 * Performs a vector similarity search on timeline events
 * @param embedding The vector embedding to search with
 * @param caseId Optional case ID to limit search scope
 * @param options Search options including limit and similarity threshold
 * @returns Array of timeline events with similarity scores
 */
export async function searchTimelineEventsByVector(
  embedding: number[],
  caseId?: string,
  options: VectorSearchOptions = {}
) {
  const {
    limit = 10,
    threshold = 0.7,
    includeMetadata = true
  } = options;

  // Convert embedding to PostgreSQL vector format
  const vectorString = `[${embedding.join(',')}]`;
  
  // Build the SQL query with optional case filter
  let query = `
    SELECT 
      t.id, 
      t.title, 
      t.description,
      t.event_date as "eventDate",
      t.end_date as "endDate",
      t.location,
      t.importance,
      t.confidence_level as "confidenceLevel",
      t.case_id as "caseId",
      1 - (t.vector_embedding <=> $1::vector) as similarity
    FROM timeline_event t
    WHERE t.vector_embedding IS NOT NULL
      AND (1 - (t.vector_embedding <=> $1::vector)) > $2
  `;
  
  const queryParams = [vectorString, threshold];
  
  // Add case filter if provided
  if (caseId) {
    query += ` AND t.case_id = $3`;
    queryParams.push(caseId);
  }
  
  // Add ordering and limit
  query += `
    ORDER BY similarity DESC
    LIMIT $${queryParams.length + 1}
  `;
  queryParams.push(limit);
  
  // Execute the query
  const result = await pool.query(query, queryParams);
  return result.rows;
}

/**
 * Performs a vector similarity search on persons
 * @param embedding The vector embedding to search with
 * @param caseId Optional case ID to limit search scope
 * @param options Search options including limit and similarity threshold
 * @returns Array of persons with similarity scores
 */
export async function searchPersonsByVector(
  embedding: number[],
  caseId?: string,
  options: VectorSearchOptions = {}
) {
  const {
    limit = 10,
    threshold = 0.7,
    includeMetadata = true
  } = options;

  // Convert embedding to PostgreSQL vector format
  const vectorString = `[${embedding.join(',')}]`;
  
  // Build the SQL query with optional case filter
  let query = `
    SELECT 
      p.id, 
      p.first_name as "firstName",
      p.last_name as "lastName",
      p.alias,
      p.description,
      p.role,
      p.case_id as "caseId",
      1 - (p.vector_embedding <=> $1::vector) as similarity
    FROM person p
    WHERE p.vector_embedding IS NOT NULL
      AND (1 - (p.vector_embedding <=> $1::vector)) > $2
  `;
  
  const queryParams = [vectorString, threshold];
  
  // Add case filter if provided
  if (caseId) {
    query += ` AND p.case_id = $3`;
    queryParams.push(caseId);
  }
  
  // Add ordering and limit
  query += `
    ORDER BY similarity DESC
    LIMIT $${queryParams.length + 1}
  `;
  queryParams.push(limit);
  
  // Execute the query
  const result = await pool.query(query, queryParams);
  return result.rows;
}

/**
 * Performs a vector similarity search on locations
 * @param embedding The vector embedding to search with
 * @param caseId Optional case ID to limit search scope
 * @param options Search options including limit and similarity threshold
 * @returns Array of locations with similarity scores
 */
export async function searchLocationsByVector(
  embedding: number[],
  caseId?: string,
  options: VectorSearchOptions = {}
) {
  const {
    limit = 10,
    threshold = 0.7,
    includeMetadata = true
  } = options;

  // Convert embedding to PostgreSQL vector format
  const vectorString = `[${embedding.join(',')}]`;
  
  // Build the SQL query with optional case filter
  let query = `
    SELECT 
      l.id, 
      l.name,
      l.address,
      l.city,
      l.state,
      l.country,
      l.postal_code as "postalCode",
      l.latitude,
      l.longitude,
      l.description,
      l.case_id as "caseId",
      1 - (l.vector_embedding <=> $1::vector) as similarity
    FROM location l
    WHERE l.vector_embedding IS NOT NULL
      AND (1 - (l.vector_embedding <=> $1::vector)) > $2
  `;
  
  const queryParams = [vectorString, threshold];
  
  // Add case filter if provided
  if (caseId) {
    query += ` AND l.case_id = $3`;
    queryParams.push(caseId);
  }
  
  // Add ordering and limit
  query += `
    ORDER BY similarity DESC
    LIMIT $${queryParams.length + 1}
  `;
  queryParams.push(limit);
  
  // Execute the query
  const result = await pool.query(query, queryParams);
  return result.rows;
}

/**
 * Updates the vector embedding for an evidence item
 * @param id Evidence ID
 * @param embedding Vector embedding array
 */
export async function updateEvidenceEmbedding(id: string, embedding: number[]): Promise<void> {
  const vectorString = `[${embedding.join(',')}]`;
  
  await pool.query(
    `UPDATE evidence SET vector_embedding = $1::vector WHERE id = $2`,
    [vectorString, id]
  );
}

/**
 * Updates the vector embedding for a timeline event
 * @param id Timeline event ID
 * @param embedding Vector embedding array
 */
export async function updateTimelineEventEmbedding(id: string, embedding: number[]): Promise<void> {
  const vectorString = `[${embedding.join(',')}]`;
  
  await pool.query(
    `UPDATE timeline_event SET vector_embedding = $1::vector WHERE id = $2`,
    [vectorString, id]
  );
}

/**
 * Updates the vector embedding for a person
 * @param id Person ID
 * @param embedding Vector embedding array
 */
export async function updatePersonEmbedding(id: string, embedding: number[]): Promise<void> {
  const vectorString = `[${embedding.join(',')}]`;
  
  await pool.query(
    `UPDATE person SET vector_embedding = $1::vector WHERE id = $2`,
    [vectorString, id]
  );
}

/**
 * Updates the vector embedding for a location
 * @param id Location ID
 * @param embedding Vector embedding array
 */
export async function updateLocationEmbedding(id: string, embedding: number[]): Promise<void> {
  const vectorString = `[${embedding.join(',')}]`;
  
  await pool.query(
    `UPDATE location SET vector_embedding = $1::vector WHERE id = $2`,
    [vectorString, id]
  );
}

/**
 * Performs a unified search across all entity types using vector similarity
 * @param embedding The vector embedding to search with
 * @param caseId Optional case ID to limit search scope
 * @param options Search options including limit and similarity threshold
 * @returns Object containing search results grouped by entity type
 */
export async function unifiedVectorSearch(
  embedding: number[],
  caseId?: string,
  options: VectorSearchOptions = {}
) {
  const {
    limit = 5,
    threshold = 0.7
  } = options;

  // Run searches in parallel
  const [evidence, timelineEvents, persons, locations] = await Promise.all([
    searchEvidenceByVector(embedding, caseId, { limit, threshold }),
    searchTimelineEventsByVector(embedding, caseId, { limit, threshold }),
    searchPersonsByVector(embedding, caseId, { limit, threshold }),
    searchLocationsByVector(embedding, caseId, { limit, threshold })
  ]);

  return {
    evidence,
    timelineEvents,
    persons,
    locations
  };
}

// Close the pool when the application shuts down
process.on('SIGINT', () => {
  pool.end();
});

export default {
  searchEvidenceByVector,
  searchTimelineEventsByVector,
  searchPersonsByVector,
  searchLocationsByVector,
  updateEvidenceEmbedding,
  updateTimelineEventEmbedding,
  updatePersonEmbedding,
  updateLocationEmbedding,
  unifiedVectorSearch
};
