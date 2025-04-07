// ClaudeService.swift
// Claude API integration for Investigation Case Management Application

import Foundation

/// Service for interacting with Claude API
class ClaudeService {
    private let apiKey: String
    private let baseURL = URL(string: "https://api.anthropic.com/v1")!
    private let defaultModel = "claude-3-opus-20240229"
    
    /// Shared instance for singleton access
    static let shared = ClaudeService()
    
    /// Initialize with API key from environment
    private init() {
        // In a real app, this would be securely stored in the keychain or environment
        self.apiKey = ProcessInfo.processInfo.environment["CLAUDE_API_KEY"] ?? ""
    }
    
    /// Initialize with custom API key
    init(apiKey: String) {
        self.apiKey = apiKey
    }
    
    // MARK: - Text Generation
    
    /// Generate text using Claude API
    func generateText(prompt: String, maxTokens: Int = 1000, temperature: Double = 0.7, model: String? = nil) async throws -> String {
        let url = baseURL.appendingPathComponent("messages")
        
        // Prepare request body
        let requestBody: [String: Any] = [
            "model": model ?? defaultModel,
            "max_tokens": maxTokens,
            "messages": [
                ["role": "user", "content": prompt]
            ],
            "temperature": temperature
        ]
        
        // Create request
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("anthropic-version=2023-06-01", forHTTPHeaderField: "x-api-version")
        request.addValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        request.httpBody = try JSONSerialization.data(withJSONObject: requestBody)
        
        // Send request
        let (data, response) = try await URLSession.shared.data(for: request)
        
        // Check response
        guard let httpResponse = response as? HTTPURLResponse else {
            throw ClaudeError.invalidResponse
        }
        
        guard httpResponse.statusCode == 200 else {
            throw ClaudeError.apiError(statusCode: httpResponse.statusCode, message: String(data: data, encoding: .utf8) ?? "Unknown error")
        }
        
        // Parse response
        guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
              let content = json["content"] as? [[String: Any]],
              let firstContent = content.first,
              let text = firstContent["text"] as? String else {
            throw ClaudeError.invalidResponseFormat
        }
        
        return text
    }
    
    // MARK: - Embeddings
    
    /// Generate embeddings for text using Claude API
    func generateEmbeddings(text: String, model: String? = nil) async throws -> [Float] {
        let url = baseURL.appendingPathComponent("embeddings")
        
        // Prepare request body
        let requestBody: [String: Any] = [
            "model": model ?? "claude-3-embedding-20240229",
            "input": text,
            "encoding_format": "float"
        ]
        
        // Create request
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("anthropic-version=2023-06-01", forHTTPHeaderField: "x-api-version")
        request.addValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        request.httpBody = try JSONSerialization.data(withJSONObject: requestBody)
        
        // Send request
        let (data, response) = try await URLSession.shared.data(for: request)
        
        // Check response
        guard let httpResponse = response as? HTTPURLResponse else {
            throw ClaudeError.invalidResponse
        }
        
        guard httpResponse.statusCode == 200 else {
            throw ClaudeError.apiError(statusCode: httpResponse.statusCode, message: String(data: data, encoding: .utf8) ?? "Unknown error")
        }
        
        // Parse response
        guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
              let embedding = json["embedding"] as? [Float] else {
            throw ClaudeError.invalidResponseFormat
        }
        
        return embedding
    }
    
    // MARK: - Batch Embeddings
    
    /// Generate embeddings for multiple texts
    func generateBatchEmbeddings(texts: [String], model: String? = nil) async throws -> [[Float]] {
        // Claude API doesn't support batch embeddings natively, so we'll do them sequentially
        var embeddings: [[Float]] = []
        
        for text in texts {
            let embedding = try await generateEmbeddings(text: text, model: model)
            embeddings.append(embedding)
        }
        
        return embeddings
    }
    
    // MARK: - Analysis Methods
    
    /// Analyze evidence and extract key information
    func analyzeEvidence(evidence: Evidence) async throws -> EvidenceAnalysis {
        var prompt = "Analyze the following evidence from an investigation and extract key information:\n\n"
        
        if let description = evidence.description {
            prompt += "Description: \(description)\n\n"
        }
        
        if let ocrText = evidence.ocrText {
            prompt += "OCR Text: \(ocrText)\n\n"
        }
        
        if let transcription = evidence.transcription {
            prompt += "Transcription: \(transcription)\n\n"
        }
        
        prompt += "Please extract the following information:\n"
        prompt += "1. Key entities (people, places, objects)\n"
        prompt += "2. Important dates and times\n"
        prompt += "3. Potential connections to other evidence\n"
        prompt += "4. Relevance to the investigation\n"
        prompt += "5. Reliability assessment\n"
        prompt += "6. Suggested follow-up actions\n"
        
        let analysisText = try await generateText(prompt: prompt)
        
        // In a real app, we would parse the structured response
        // For now, return a placeholder
        return EvidenceAnalysis(
            evidenceId: evidence.id,
            keyEntities: ["Person 1", "Location A"],
            dates: ["2025-04-02"],
            potentialConnections: ["Connection to other evidence"],
            relevanceAssessment: "High relevance to the case",
            reliabilityAssessment: "High reliability",
            suggestedActions: ["Follow up with witness"],
            rawAnalysis: analysisText
        )
    }
    
    /// Generate a timeline analysis for a case
    func analyzeTimeline(events: [TimelineEvent]) async throws -> TimelineAnalysis {
        var prompt = "Analyze the following timeline of events from an investigation:\n\n"
        
        for (index, event) in events.enumerated() {
            prompt += "\(index + 1). Date/Time: \(event.eventDate)\n"
            prompt += "   Title: \(event.title)\n"
            if let description = event.description {
                prompt += "   Description: \(description)\n"
            }
            prompt += "\n"
        }
        
        prompt += "Please provide the following analysis:\n"
        prompt += "1. Identify any inconsistencies or gaps in the timeline\n"
        prompt += "2. Suggest potential missing events\n"
        prompt += "3. Identify key patterns or sequences\n"
        prompt += "4. Provide an overall assessment of the timeline\n"
        
        let analysisText = try await generateText(prompt: prompt)
        
        // In a real app, we would parse the structured response
        // For now, return a placeholder
        return TimelineAnalysis(
            inconsistencies: ["Potential inconsistency between events 2 and 3"],
            gaps: ["Gap between 10:45 and 11:30"],
            suggestedEvents: ["Potential event at 11:00"],
            patterns: ["Pattern of suspect movements"],
            overallAssessment: "Timeline appears mostly consistent with some minor gaps",
            rawAnalysis: analysisText
        )
    }
    
    /// Analyze relationships between persons in a case
    func analyzeRelationships(persons: [Person], events: [TimelineEvent]) async throws -> RelationshipAnalysis {
        var prompt = "Analyze the relationships between the following persons in an investigation:\n\n"
        
        for (index, person) in persons.enumerated() {
            prompt += "\(index + 1). Name: \(person.name)\n"
            prompt += "   Role: \(person.role.rawValue)\n"
            if let description = person.description {
                prompt += "   Description: \(description)\n"
            }
            prompt += "\n"
        }
        
        prompt += "These persons are involved in the following events:\n\n"
        
        for (index, event) in events.enumerated() {
            prompt += "\(index + 1). Date/Time: \(event.eventDate)\n"
            prompt += "   Title: \(event.title)\n"
            if let description = event.description {
                prompt += "   Description: \(description)\n"
            }
            prompt += "\n"
        }
        
        prompt += "Please analyze the relationships between these persons:\n"
        prompt += "1. Identify direct connections between persons\n"
        prompt += "2. Identify indirect connections through events\n"
        prompt += "3. Suggest potential relationships not explicitly stated\n"
        prompt += "4. Identify key persons in the network\n"
        
        let analysisText = try await generateText(prompt: prompt)
        
        // In a real app, we would parse the structured response
        // For now, return a placeholder
        return RelationshipAnalysis(
            directConnections: ["Person 1 and Person 2 are directly connected"],
            indirectConnections: ["Person 1 and Person 3 are connected through Event 2"],
            suggestedRelationships: ["Person 2 and Person 4 may have a prior relationship"],
            keyPersons: ["Person 1 appears to be central to the network"],
            rawAnalysis: analysisText
        )
    }
    
    /// Generate a case summary
    func generateCaseSummary(caseData: Case, evidence: [Evidence], persons: [Person], events: [TimelineEvent]) async throws -> CaseSummaryAnalysis {
        var prompt = "Generate a comprehensive summary of the following investigation case:\n\n"
        
        prompt += "Case Title: \(caseData.title)\n"
        prompt += "Case Number: \(caseData.caseNumber)\n"
        prompt += "Status: \(caseData.status.rawValue)\n"
        prompt += "Priority: \(caseData.priority.rawValue)\n"
        
        if let description = caseData.description {
            prompt += "Description: \(description)\n"
        }
        
        prompt += "\nKey Evidence (\(evidence.count) items):\n"
        for (index, item) in evidence.prefix(5).enumerated() {
            prompt += "\(index + 1). \(item.title) - \(item.type.rawValue)\n"
        }
        
        prompt += "\nPersons of Interest (\(persons.count) persons):\n"
        for (index, person) in persons.prefix(5).enumerated() {
            prompt += "\(index + 1). \(person.name) - \(person.role.rawValue)\n"
        }
        
        prompt += "\nKey Timeline Events (\(events.count) events):\n"
        for (index, event) in events.prefix(5).enumerated() {
            prompt += "\(index + 1). \(event.eventDate) - \(event.title)\n"
        }
        
        prompt += "\nPlease provide a comprehensive case summary including:\n"
        prompt += "1. Executive summary of the case\n"
        prompt += "2. Key findings and evidence\n"
        prompt += "3. Timeline overview\n"
        prompt += "4. Persons of interest and their roles\n"
        prompt += "5. Current status and next steps\n"
        prompt += "6. Potential theories or scenarios\n"
        
        let summaryText = try await generateText(prompt: prompt, maxTokens: 2000)
        
        // In a real app, we would parse the structured response
        // For now, return a placeholder
        return CaseSummaryAnalysis(
            executiveSummary: "This case involves...",
            keyFindings: ["Finding 1", "Finding 2"],
            timelineOverview: "The incident began on...",
            personsOfInterest: ["Person 1 - Suspect", "Person 2 - Witness"],
            currentStatus: "The investigation is ongoing with several leads",
            nextSteps: ["Interview additional witnesses", "Analyze forensic evidence"],
            potentialTheories: ["Theory 1", "Theory 2"],
            rawSummary: summaryText
        )
    }
    
    /// Generate dynamic storyline analysis
    func generateStorylineAnalysis(caseData: Case, evidence: [Evidence], persons: [Person], events: [TimelineEvent]) async throws -> StorylineAnalysis {
        var prompt = "Analyze the following case information and generate a dynamic storyline analysis:\n\n"
        
        prompt += "Case Title: \(caseData.title)\n"
        if let description = caseData.description {
            prompt += "Description: \(description)\n"
        }
        
        prompt += "\nKey Evidence:\n"
        for (index, item) in evidence.prefix(5).enumerated() {
            prompt += "\(index + 1). \(item.title) - \(item.type.rawValue)\n"
            if let description = item.description {
                prompt += "   Description: \(description)\n"
            }
        }
        
        prompt += "\nPersons of Interest:\n"
        for (index, person) in persons.prefix(5).enumerated() {
            prompt += "\(index + 1). \(person.name) - \(person.role.rawValue)\n"
            if let description = person.description {
                prompt += "   Description: \(description)\n"
            }
        }
        
        prompt += "\nTimeline Events:\n"
        for (index, event) in events.prefix(10).enumerated() {
            prompt += "\(index + 1). \(event.eventDate) - \(event.title)\n"
            if let description = event.description {
                prompt += "   Description: \(description)\n"
            }
        }
        
        prompt += "\nPlease generate a dynamic storyline analysis including:\n"
        prompt += "1. Main narrative of what likely happened\n"
        prompt += "2. Alternative scenarios with confidence levels\n"
        prompt += "3. Key decision points or turning points\n"
        prompt += "4. Unexplained elements or inconsistencies\n"
        prompt += "5. Motivations of key persons\n"
        prompt += "6. Causal relationships between events\n"
        
        let analysisText = try await generateText(prompt: prompt, maxTokens: 2000)
        
        // In a real app, we would parse the structured response
        // For now, return a placeholder
        return StorylineAnalysis(
            mainNarrative: "The main sequence of events appears to be...",
            alternativeScenarios: [
                Scenario(description: "Alternative scenario 1", confidenceLevel: 0.7),
                Scenario(description: "Alternative scenario 2", confidenceLevel: 0.4)
            ],
            keyDecisionPoints: ["Decision point 1", "Decision point 2"],
            unexplainedElements: ["Unexplained element 1", "Unexplained element 2"],
            personMotivations: ["Person 1 appears motivated by...", "Person 2 appears motivated by..."],
            causalRelationships: ["Event 1 likely caused Event 3", "Event 2 contributed to Event 4"],
            rawAnalysis: analysisText
        )
    }
}

// MARK: - Errors

/// Errors that can occur when interacting with Claude API
enum ClaudeError: Error {
    case invalidAPIKey
    case invalidResponse
    case apiError(statusCode: Int, message: String)
    case invalidResponseFormat
    case rateLimitExceeded
    case networkError(Error)
}

// MARK: - Analysis Models

/// Analysis of evidence
struct EvidenceAnalysis: Codable {
    let evidenceId: UUID
    let keyEntities: [String]
    let dates: [String]
    let potentialConnections: [String]
    let relevanceAssessment: String
    let reliabilityAssessment: String
    let suggestedActions: [String]
    let rawAnalysis: String
}

/// Analysis of timeline
struct TimelineAnalysis: Codable {
    let inconsistencies: [String]
    let gaps: [String]
    let suggestedEvents: [String]
    let patterns: [String]
    let overallAssessment: String
    let rawAnalysis: String
}

/// Analysis of relationships
struct RelationshipAnalysis: Codable {
    let directConnections: [String]
    let indirectConnections: [String]
    let suggestedRelationships: [String]
    let keyPersons: [String]
    let rawAnalysis: String
}

/// Case summary analysis
struct CaseSummaryAnalysis: Codable {
    let executiveSummary: String
    let keyFindings: [String]
    let timelineOverview: String
    let personsOfInterest: [String]
    let currentStatus: String
    let nextSteps: [String]
    let potentialTheories: [String]
    let rawSummary: String
}

/// Scenario with confidence level
struct Scenario: Codable {
    let description: String
    let confidenceLevel: Double
}

/// Storyline analysis
struct StorylineAnalysis: Codable {
    let mainNarrative: String
    let alternativeScenarios: [Scenario]
    let keyDecisionPoints: [String]
    let unexplainedElements: [String]
    let personMotivations: [String]
    let causalRelationships: [String]
    let rawAnalysis: String
}

// MARK: - Integration with Vector Service

extension VectorService {
    /// Update the generateEmbedding method to use Claude API
    func generateEmbedding(for text: String) async throws -> [Float] {
        return try await ClaudeService.shared.generateEmbeddings(text: text)
    }
}
