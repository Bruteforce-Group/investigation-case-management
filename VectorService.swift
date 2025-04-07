// VectorService.swift
// Vector database integration for Investigation Case Management Application

import Foundation
import NIO
import GRPC

/// Service for managing vector embeddings and similarity search
class VectorService {
    private let databaseManager: DatabaseManager
    private let embeddingDimension: Int = 1536  // Claude API embedding dimension
    
    /// Shared instance for singleton access
    static let shared = VectorService()
    
    /// Initialize with default database manager
    private init() {
        self.databaseManager = DatabaseManager.shared
    }
    
    /// Initialize with custom database manager
    init(databaseManager: DatabaseManager) {
        self.databaseManager = databaseManager
    }
    
    // MARK: - Vector Operations
    
    /// Generate embedding for text using Claude API
    func generateEmbedding(for text: String) async throws -> [Float] {
        // This will be implemented in the Claude API integration
        // For now, return a placeholder embedding
        return Array(repeating: 0.0, count: embeddingDimension)
    }
    
    /// Store embedding for an entity
    func storeEmbedding(for entity: any BaseModel, text: String) async throws {
        // Generate embedding
        let embedding = try await generateEmbedding(for: text)
        
        // Determine table name based on entity type
        let tableName = getTableName(for: entity)
        
        // Store embedding in database
        try databaseManager.storeVectorEmbedding(table: tableName, id: entity.id, embedding: embedding)
    }
    
    /// Find similar entities of a specific type
    func findSimilar<T: BaseModel>(to text: String, entityType: T.Type, maxResults: Int = 10, similarityThreshold: Float = 0.7) async throws -> [(entity: T, similarity: Float)] {
        // Generate embedding for query text
        let embedding = try await generateEmbedding(for: text)
        
        // Get table name for entity type
        let tableName = getTableName(for: T.self)
        
        // Find similar items
        let similarItems = try databaseManager.findSimilarItems(
            table: tableName,
            embedding: embedding,
            maxResults: maxResults,
            similarityThreshold: similarityThreshold
        )
        
        // Fetch full entities (this would need to be implemented with repository pattern)
        // For now, return placeholder
        return []
    }
    
    /// Search across all entity types
    func searchAcrossAllEntities(query: String, maxResults: Int = 20, similarityThreshold: Float = 0.7) async throws -> [SearchResult] {
        // Generate embedding for query text
        let embedding = try await generateEmbedding(for: query)
        
        // Search across all vector tables
        let results = try databaseManager.searchAcrossVectors(
            embedding: embedding,
            maxResults: maxResults,
            similarityThreshold: similarityThreshold
        )
        
        // Convert to SearchResult objects
        var searchResults: [SearchResult] = []
        
        for result in results {
            // This would fetch the actual entity and create a proper SearchResult
            // For now, create a placeholder
            let searchResult = SearchResult(
                entityType: getEntityType(from: result.table),
                entityId: result.id,
                title: "Result from \(result.table)",
                snippet: nil,
                relevance: result.similarity
            )
            
            searchResults.append(searchResult)
        }
        
        return searchResults
    }
    
    /// Batch process entities to generate and store embeddings
    func batchProcessEntities<T: BaseModel>(entities: [T], textExtractor: (T) -> String) async throws {
        for entity in entities {
            let text = textExtractor(entity)
            try await storeEmbedding(for: entity, text: text)
        }
    }
    
    // MARK: - Helper Methods
    
    /// Get table name for an entity
    private func getTableName(for entity: Any) -> String {
        return getTableName(for: type(of: entity))
    }
    
    /// Get table name for an entity type
    private func getTableName(for entityType: Any.Type) -> String {
        switch entityType {
        case is Case.Type:
            return "cases"
        case is Person.Type:
            return "persons"
        case is Evidence.Type:
            return "evidence"
        case is TimelineEvent.Type:
            return "timeline_events"
        case is Note.Type:
            return "notes"
        case is AIAnalysis.Type:
            return "ai_analysis"
        default:
            fatalError("Unknown entity type: \(entityType)")
        }
    }
    
    /// Get entity type from table name
    private func getEntityType(from tableName: String) -> String {
        switch tableName {
        case "cases":
            return "Case"
        case "persons":
            return "Person"
        case "evidence":
            return "Evidence"
        case "timeline_events":
            return "Event"
        case "notes":
            return "Note"
        case "ai_analysis":
            return "Analysis"
        default:
            return "Unknown"
        }
    }
}

// MARK: - Vector Repository Protocol

/// Protocol for vector repositories
protocol VectorRepository {
    associatedtype Entity: BaseModel
    
    /// Store embedding for an entity
    func storeEmbedding(for entity: Entity, text: String) async throws
    
    /// Find similar entities
    func findSimilar(to text: String, maxResults: Int, similarityThreshold: Float) async throws -> [(entity: Entity, similarity: Float)]
    
    /// Find similar entities to an existing entity
    func findSimilar(to entity: Entity, maxResults: Int, similarityThreshold: Float) async throws -> [(entity: Entity, similarity: Float)]
}

// MARK: - Concrete Vector Repositories

/// Person vector repository
class PersonVectorRepository: VectorRepository {
    typealias Entity = Person
    private let vectorService: VectorService
    
    init(vectorService: VectorService = VectorService.shared) {
        self.vectorService = vectorService
    }
    
    func storeEmbedding(for entity: Person, text: String) async throws {
        try await vectorService.storeEmbedding(for: entity, text: text)
    }
    
    func findSimilar(to text: String, maxResults: Int = 10, similarityThreshold: Float = 0.7) async throws -> [(entity: Person, similarity: Float)] {
        return try await vectorService.findSimilar(to: text, entityType: Person.self, maxResults: maxResults, similarityThreshold: similarityThreshold)
    }
    
    func findSimilar(to entity: Person, maxResults: Int = 10, similarityThreshold: Float = 0.7) async throws -> [(entity: Person, similarity: Float)] {
        // Extract text representation of the person
        let text = [entity.name, entity.description, entity.notes].compactMap { $0 }.joined(separator: " ")
        return try await findSimilar(to: text, maxResults: maxResults, similarityThreshold: similarityThreshold)
    }
}

/// Evidence vector repository
class EvidenceVectorRepository: VectorRepository {
    typealias Entity = Evidence
    private let vectorService: VectorService
    
    init(vectorService: VectorService = VectorService.shared) {
        self.vectorService = vectorService
    }
    
    func storeEmbedding(for entity: Evidence, text: String) async throws {
        try await vectorService.storeEmbedding(for: entity, text: text)
    }
    
    func findSimilar(to text: String, maxResults: Int = 10, similarityThreshold: Float = 0.7) async throws -> [(entity: Evidence, similarity: Float)] {
        return try await vectorService.findSimilar(to: text, entityType: Evidence.self, maxResults: maxResults, similarityThreshold: similarityThreshold)
    }
    
    func findSimilar(to entity: Evidence, maxResults: Int = 10, similarityThreshold: Float = 0.7) async throws -> [(entity: Evidence, similarity: Float)] {
        // Extract text representation of the evidence
        let text = [entity.title, entity.description, entity.ocrText, entity.transcription].compactMap { $0 }.joined(separator: " ")
        return try await findSimilar(to: text, maxResults: maxResults, similarityThreshold: similarityThreshold)
    }
}

/// Timeline event vector repository
class TimelineEventVectorRepository: VectorRepository {
    typealias Entity = TimelineEvent
    private let vectorService: VectorService
    
    init(vectorService: VectorService = VectorService.shared) {
        self.vectorService = vectorService
    }
    
    func storeEmbedding(for entity: TimelineEvent, text: String) async throws {
        try await vectorService.storeEmbedding(for: entity, text: text)
    }
    
    func findSimilar(to text: String, maxResults: Int = 10, similarityThreshold: Float = 0.7) async throws -> [(entity: TimelineEvent, similarity: Float)] {
        return try await vectorService.findSimilar(to: text, entityType: TimelineEvent.self, maxResults: maxResults, similarityThreshold: similarityThreshold)
    }
    
    func findSimilar(to entity: TimelineEvent, maxResults: Int = 10, similarityThreshold: Float = 0.7) async throws -> [(entity: TimelineEvent, similarity: Float)] {
        // Extract text representation of the timeline event
        let text = [entity.title, entity.description, entity.notes].compactMap { $0 }.joined(separator: " ")
        return try await findSimilar(to: text, maxResults: maxResults, similarityThreshold: similarityThreshold)
    }
}

/// Note vector repository
class NoteVectorRepository: VectorRepository {
    typealias Entity = Note
    private let vectorService: VectorService
    
    init(vectorService: VectorService = VectorService.shared) {
        self.vectorService = vectorService
    }
    
    func storeEmbedding(for entity: Note, text: String) async throws {
        try await vectorService.storeEmbedding(for: entity, text: text)
    }
    
    func findSimilar(to text: String, maxResults: Int = 10, similarityThreshold: Float = 0.7) async throws -> [(entity: Note, similarity: Float)] {
        return try await vectorService.findSimilar(to: text, entityType: Note.self, maxResults: maxResults, similarityThreshold: similarityThreshold)
    }
    
    func findSimilar(to entity: Note, maxResults: Int = 10, similarityThreshold: Float = 0.7) async throws -> [(entity: Note, similarity: Float)] {
        // Extract text representation of the note
        let text = [entity.title, entity.content].compactMap { $0 }.joined(separator: " ")
        return try await findSimilar(to: text, maxResults: maxResults, similarityThreshold: similarityThreshold)
    }
}

/// AI Analysis vector repository
class AIAnalysisVectorRepository: VectorRepository {
    typealias Entity = AIAnalysis
    private let vectorService: VectorService
    
    init(vectorService: VectorService = VectorService.shared) {
        self.vectorService = vectorService
    }
    
    func storeEmbedding(for entity: AIAnalysis, text: String) async throws {
        try await vectorService.storeEmbedding(for: entity, text: text)
    }
    
    func findSimilar(to text: String, maxResults: Int = 10, similarityThreshold: Float = 0.7) async throws -> [(entity: AIAnalysis, similarity: Float)] {
        return try await vectorService.findSimilar(to: text, entityType: AIAnalysis.self, maxResults: maxResults, similarityThreshold: similarityThreshold)
    }
    
    func findSimilar(to entity: AIAnalysis, maxResults: Int = 10, similarityThreshold: Float = 0.7) async throws -> [(entity: AIAnalysis, similarity: Float)] {
        // Extract text representation of the AI analysis
        let text = [entity.analysisType.rawValue, entity.content].joined(separator: " ")
        return try await findSimilar(to: text, maxResults: maxResults, similarityThreshold: similarityThreshold)
    }
}

// MARK: - Vector Search Service

/// Service for performing vector searches across the application
class VectorSearchService {
    private let vectorService: VectorService
    private let personRepository: PersonVectorRepository
    private let evidenceRepository: EvidenceVectorRepository
    private let timelineEventRepository: TimelineEventVectorRepository
    private let noteRepository: NoteVectorRepository
    private let aiAnalysisRepository: AIAnalysisVectorRepository
    
    /// Shared instance for singleton access
    static let shared = VectorSearchService()
    
    /// Initialize with default repositories
    private init() {
        self.vectorService = VectorService.shared
        self.personRepository = PersonVectorRepository()
        self.evidenceRepository = EvidenceVectorRepository()
        self.timelineEventRepository = TimelineEventVectorRepository()
        self.noteRepository = NoteVectorRepository()
        self.aiAnalysisRepository = AIAnalysisVectorRepository()
    }
    
    /// Initialize with custom repositories
    init(
        vectorService: VectorService,
        personRepository: PersonVectorRepository,
        evidenceRepository: EvidenceVectorRepository,
        timelineEventRepository: TimelineEventVectorRepository,
        noteRepository: NoteVectorRepository,
        aiAnalysisRepository: AIAnalysisVectorRepository
    ) {
        self.vectorService = vectorService
        self.personRepository = personRepository
        self.evidenceRepository = evidenceRepository
        self.timelineEventRepository = timelineEventRepository
        self.noteRepository = noteRepository
        self.aiAnalysisRepository = aiAnalysisRepository
    }
    
    /// Search across all entity types
    func searchAll(query: String, maxResults: Int = 20, similarityThreshold: Float = 0.7) async throws -> [SearchResult] {
        return try await vectorService.searchAcrossAllEntities(
            query: query,
            maxResults: maxResults,
            similarityThreshold: similarityThreshold
        )
    }
    
    /// Find connections between entities
    func findConnections(between entities: [any BaseModel], maxResults: Int = 10, similarityThreshold: Float = 0.7) async throws -> [Connection] {
        // This would implement a more sophisticated connection finding algorithm
        // For now, return placeholder
        return []
    }
    
    /// Find potential timeline inconsistencies
    func findTimelineInconsistencies(in caseId: UUID, confidenceThreshold: Float = 0.7) async throws -> [Inconsistency] {
        // This would implement timeline analysis to find inconsistencies
        // For now, return placeholder
        return []
    }
    
    /// Generate case summary using vector search
    func generateCaseSummary(for caseId: UUID) async throws -> String {
        // This would implement case summarization using vector search and Claude API
        // For now, return placeholder
        return "Case summary would be generated here."
    }
}

// MARK: - Supporting Models

/// Connection between entities
struct Connection: Codable, Identifiable {
    var id: UUID = UUID()
    var sourceType: String
    var sourceId: UUID
    var targetType: String
    var targetId: UUID
    var strength: Float
    var description: String?
}

/// Timeline inconsistency
struct Inconsistency: Codable, Identifiable {
    var id: UUID = UUID()
    var eventId1: UUID
    var eventId2: UUID
    var description: String
    var confidence: Float
}
