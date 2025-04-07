// Swift Data Models for Investigation Case Management Application
// These models correspond to the PostgreSQL database schema

import Foundation

// MARK: - Base Models

/// Base model with common properties
protocol BaseModel: Codable, Identifiable {
    var id: UUID { get }
    var createdAt: Date { get }
    var updatedAt: Date { get }
}

/// Default implementation for BaseModel
extension BaseModel {
    var createdAt: Date {
        return Date()
    }
    
    var updatedAt: Date {
        return Date()
    }
}

// MARK: - Case Models

/// Case status enum
enum CaseStatus: String, Codable {
    case open = "Open"
    case closed = "Closed"
    case pending = "Pending"
    case archived = "Archived"
}

/// Case priority enum
enum CasePriority: String, Codable {
    case low = "Low"
    case medium = "Medium"
    case high = "High"
    case critical = "Critical"
}

/// Case model
struct Case: BaseModel {
    var id: UUID
    var title: String
    var description: String?
    var status: CaseStatus
    var priority: CasePriority
    var createdAt: Date
    var updatedAt: Date
    var createdBy: UUID?
    var assignedTo: UUID?
    var caseNumber: String
    var classification: String?
    var location: String?
    var startDate: Date?
    var endDate: Date?
    var tags: [String]?
    
    // Relationships (not stored in database)
    var evidence: [Evidence]?
    var persons: [Person]?
    var timelineEvents: [TimelineEvent]?
    var notes: [Note]?
    var aiAnalyses: [AIAnalysis]?
}

// MARK: - User Models

/// User role enum
enum UserRole: String, Codable {
    case administrator = "Administrator"
    case investigator = "Investigator"
    case analyst = "Analyst"
    case viewer = "Viewer"
}

/// User model
struct User: BaseModel {
    var id: UUID
    var username: String
    var email: String
    var passwordHash: String
    var fullName: String
    var role: UserRole
    var department: String?
    var badgeNumber: String?
    var contactInfo: [String: String]?
    var createdAt: Date
    var updatedAt: Date
    var lastLogin: Date?
    var isActive: Bool
}

/// Access level enum
enum AccessLevel: String, Codable {
    case read = "Read"
    case write = "Write"
    case admin = "Admin"
}

/// Case access model
struct CaseAccess: BaseModel {
    var id: UUID
    var caseId: UUID
    var userId: UUID
    var accessLevel: AccessLevel
    var grantedAt: Date
    var grantedBy: UUID?
    var expiresAt: Date?
    var isActive: Bool
}

// MARK: - Person Models

/// Person role enum
enum PersonRole: String, Codable {
    case suspect = "Suspect"
    case witness = "Witness"
    case victim = "Victim"
    case investigator = "Investigator"
    case other = "Other"
}

/// Person model
struct Person: BaseModel {
    var id: UUID
    var caseId: UUID
    var name: String
    var role: PersonRole
    var contactInfo: [String: String]?
    var description: String?
    var dateOfBirth: Date?
    var identification: String?
    var notes: String?
    var createdAt: Date
    var updatedAt: Date
    var createdBy: UUID?
    var vectorEmbedding: [Float]?
}

// MARK: - Evidence Models

/// Evidence type enum
enum EvidenceType: String, Codable {
    case document = "Document"
    case image = "Image"
    case audio = "Audio"
    case video = "Video"
    case physical = "Physical"
    case other = "Other"
}

/// Evidence status enum
enum EvidenceStatus: String, Codable {
    case collected = "Collected"
    case processed = "Processed"
    case analyzed = "Analyzed"
    case archived = "Archived"
}

/// Custody chain record
struct CustodyRecord: Codable {
    var timestamp: Date
    var userId: UUID
    var action: String
    var notes: String?
}

/// Evidence model
struct Evidence: BaseModel {
    var id: UUID
    var caseId: UUID
    var title: String
    var description: String?
    var type: EvidenceType
    var filePath: String?
    var fileHash: String?
    var fileSize: Int64?
    var mimeType: String?
    var originalFilename: String?
    var custodyChain: [CustodyRecord]?
    var collectionDate: Date?
    var collectionLocation: String?
    var collectedBy: UUID?
    var status: EvidenceStatus
    var tags: [String]?
    var ocrText: String?
    var transcription: String?
    var vectorEmbedding: [Float]?
    var createdAt: Date
    var updatedAt: Date
    var createdBy: UUID?
}

// MARK: - Timeline Models

/// Event importance enum
enum EventImportance: String, Codable {
    case low = "Low"
    case medium = "Medium"
    case high = "High"
    case critical = "Critical"
}

/// Timeline event model
struct TimelineEvent: BaseModel {
    var id: UUID
    var caseId: UUID
    var title: String
    var description: String?
    var eventType: String?
    var eventDate: Date
    var eventEndDate: Date?
    var location: String?
    var personsInvolved: [UUID]?
    var evidenceLinked: [UUID]?
    var importance: EventImportance?
    var confidence: Float?
    var source: String?
    var notes: String?
    var createdAt: Date
    var updatedAt: Date
    var createdBy: UUID?
    var isAIGenerated: Bool
    var vectorEmbedding: [Float]?
}

// MARK: - Note Models

/// Note model
struct Note: BaseModel {
    var id: UUID
    var caseId: UUID
    var title: String
    var content: String?
    var category: String?
    var tags: [String]?
    var relatedEvidence: [UUID]?
    var relatedPersons: [UUID]?
    var relatedEvents: [UUID]?
    var createdAt: Date
    var updatedAt: Date
    var createdBy: UUID?
    var vectorEmbedding: [Float]?
}

// MARK: - AI Analysis Models

/// Analysis type enum
enum AnalysisType: String, Codable {
    case timeline = "Timeline"
    case relationships = "Relationships"
    case evidence = "Evidence"
    case summary = "Summary"
    case recommendation = "Recommendation"
}

/// AI analysis model
struct AIAnalysis: BaseModel {
    var id: UUID
    var caseId: UUID
    var analysisType: AnalysisType
    var content: String
    var confidenceScore: Float?
    var generatedAt: Date
    var promptUsed: String?
    var modelVersion: String?
    var relatedEvidence: [UUID]?
    var relatedPersons: [UUID]?
    var relatedEvents: [UUID]?
    var vectorEmbedding: [Float]?
}

// MARK: - Search Models

/// Search query model
struct SearchQuery: BaseModel {
    var id: UUID
    var userId: UUID?
    var caseId: UUID?
    var queryText: String
    var queryVector: [Float]?
    var resultsCount: Int?
    var executedAt: Date
    var executionTimeMs: Int?
    var filtersApplied: [String: Any]?
}

/// Search result model
struct SearchResult: Codable {
    var entityType: String
    var entityId: UUID
    var title: String
    var snippet: String?
    var relevance: Float
}

// MARK: - Audit Models

/// Audit action enum
enum AuditAction: String, Codable {
    case create = "Create"
    case update = "Update"
    case delete = "Delete"
    case view = "View"
    case export = "Export"
}

/// Audit log model
struct AuditLog: BaseModel {
    var id: UUID
    var userId: UUID?
    var action: AuditAction
    var entityType: String
    var entityId: UUID?
    var details: [String: Any]?
    var ipAddress: String?
    var userAgent: String?
    var timestamp: Date
}

// MARK: - Summary Models

/// Case summary model
struct CaseSummary: Codable, Identifiable {
    var id: UUID
    var title: String
    var caseNumber: String
    var status: String
    var priority: String
    var createdAt: Date
    var updatedAt: Date
    var assignedToName: String?
    var evidenceCount: Int
    var personsCount: Int
    var eventsCount: Int
    var notesCount: Int
    var analysisCount: Int
}

/// Evidence summary model
struct EvidenceSummary: Codable, Identifiable {
    var id: UUID
    var title: String
    var type: String
    var status: String
    var caseId: UUID
    var caseNumber: String
    var caseTitle: String
    var collectionDate: Date?
    var createdAt: Date
    var collectedByName: String?
    var fileSize: Int64?
    var mimeType: String?
    var hasOcr: Bool
    var hasTranscription: Bool
    var hasEmbedding: Bool
}

/// Timeline summary model
struct TimelineSummary: Codable, Identifiable {
    var id: UUID
    var title: String
    var eventType: String?
    var eventDate: Date
    var importance: String?
    var confidence: Float?
    var caseId: UUID
    var caseNumber: String
    var caseTitle: String
    var isAIGenerated: Bool
    var personsCount: Int?
    var evidenceCount: Int?
}

/// Person summary model
struct PersonSummary: Codable, Identifiable {
    var id: UUID
    var name: String
    var role: String
    var dateOfBirth: Date?
    var caseId: UUID
    var caseNumber: String
    var caseTitle: String
    var eventsCount: Int
    var hasEmbedding: Bool
}

/// User activity model
struct UserActivity: Codable, Identifiable {
    var id: UUID
    var username: String
    var fullName: String
    var role: String
    var lastLogin: Date?
    var assignedCasesCount: Int
    var recentActionsCount: Int
    var lastActionTime: Date?
}
