// Swift Database Connection Layer for PostgreSQL with pgvector
// This file provides a secure and efficient database connection layer for macOS

import Foundation
import PostgresClientKit

/// Configuration for database connection
struct DatabaseConfig {
    let host: String
    let port: Int
    let database: String
    let username: String
    let password: String
    let useSSL: Bool
    
    /// Initialize with default values for development
    static func development() -> DatabaseConfig {
        return DatabaseConfig(
            host: "localhost",
            port: 5432,
            database: "investigation_app",
            username: "postgres",
            password: "postgres",
            useSSL: false
        )
    }
    
    /// Initialize with values from environment or configuration file
    static func fromEnvironment() -> DatabaseConfig {
        // In a real app, these would be loaded from environment variables or a secure configuration file
        let host = ProcessInfo.processInfo.environment["DB_HOST"] ?? "localhost"
        let portStr = ProcessInfo.processInfo.environment["DB_PORT"] ?? "5432"
        let port = Int(portStr) ?? 5432
        let database = ProcessInfo.processInfo.environment["DB_NAME"] ?? "investigation_app"
        let username = ProcessInfo.processInfo.environment["DB_USER"] ?? "postgres"
        let password = ProcessInfo.processInfo.environment["DB_PASSWORD"] ?? "postgres"
        let useSSLStr = ProcessInfo.processInfo.environment["DB_USE_SSL"] ?? "false"
        let useSSL = useSSLStr.lowercased() == "true"
        
        return DatabaseConfig(
            host: host,
            port: port,
            database: database,
            username: username,
            password: password,
            useSSL: useSSL
        )
    }
    
    /// Create connection URL
    func connectionURL() -> URL {
        var urlComponents = URLComponents()
        urlComponents.scheme = "postgresql"
        urlComponents.host = host
        urlComponents.port = port
        urlComponents.path = "/\(database)"
        urlComponents.user = username
        urlComponents.password = password
        
        // Add SSL parameters if needed
        if useSSL {
            urlComponents.queryItems = [
                URLQueryItem(name: "sslmode", value: "require")
            ]
        } else {
            urlComponents.queryItems = [
                URLQueryItem(name: "sslmode", value: "disable")
            ]
        }
        
        return urlComponents.url!
    }
}

/// Database connection manager
class DatabaseManager {
    private let config: DatabaseConfig
    private var connectionPool: [Connection] = []
    private let poolSize: Int
    private let poolLock = NSLock()
    
    /// Shared instance for singleton access
    static let shared = DatabaseManager()
    
    /// Initialize with default configuration
    private init() {
        self.config = DatabaseConfig.fromEnvironment()
        self.poolSize = 5
        setupConnectionPool()
    }
    
    /// Initialize with custom configuration
    init(config: DatabaseConfig, poolSize: Int = 5) {
        self.config = config
        self.poolSize = poolSize
        setupConnectionPool()
    }
    
    /// Setup the connection pool
    private func setupConnectionPool() {
        for _ in 0..<poolSize {
            do {
                let connection = try createConnection()
                connectionPool.append(connection)
            } catch {
                print("Error creating connection: \(error)")
            }
        }
    }
    
    /// Create a new database connection
    private func createConnection() throws -> Connection {
        var connectionConfiguration = PostgresClientKit.ConnectionConfiguration()
        connectionConfiguration.host = config.host
        connectionConfiguration.port = config.port
        connectionConfiguration.database = config.database
        connectionConfiguration.user = config.username
        connectionConfiguration.credential = .md5Password(password: config.password)
        
        if config.useSSL {
            connectionConfiguration.ssl = true
        }
        
        return try Connection(configuration: connectionConfiguration)
    }
    
    /// Get a connection from the pool
    func getConnection() throws -> Connection {
        poolLock.lock()
        defer { poolLock.unlock() }
        
        if let connection = connectionPool.popLast() {
            return connection
        } else {
            return try createConnection()
        }
    }
    
    /// Return a connection to the pool
    func returnConnection(_ connection: Connection) {
        poolLock.lock()
        defer { poolLock.unlock() }
        
        if connectionPool.count < poolSize {
            connectionPool.append(connection)
        } else {
            // If pool is full, close the connection
            connection.close()
        }
    }
    
    /// Execute a query with parameters and return the result
    func executeQuery<T>(_ query: String, parameters: [Any] = [], rowMapper: (PostgresClientKit.Row) throws -> T) throws -> [T] {
        let connection = try getConnection()
        defer { returnConnection(connection) }
        
        let statement = try connection.prepareStatement(text: query)
        defer { statement.close() }
        
        let cursor = try statement.execute(parameterValues: parameters.map { String(describing: $0) })
        defer { cursor.close() }
        
        var results: [T] = []
        for row in cursor {
            let mappedRow = try rowMapper(row)
            results.append(mappedRow)
        }
        
        return results
    }
    
    /// Execute a query that doesn't return results (INSERT, UPDATE, DELETE)
    func executeUpdate(_ query: String, parameters: [Any] = []) throws {
        let connection = try getConnection()
        defer { returnConnection(connection) }
        
        let statement = try connection.prepareStatement(text: query)
        defer { statement.close() }
        
        let cursor = try statement.execute(parameterValues: parameters.map { String(describing: $0) })
        cursor.close()
    }
    
    /// Execute a transaction with multiple queries
    func executeTransaction(_ block: (Connection) throws -> Void) throws {
        let connection = try getConnection()
        defer { returnConnection(connection) }
        
        let beginStatement = try connection.prepareStatement(text: "BEGIN")
        defer { beginStatement.close() }
        
        let commitStatement = try connection.prepareStatement(text: "COMMIT")
        defer { commitStatement.close() }
        
        let rollbackStatement = try connection.prepareStatement(text: "ROLLBACK")
        defer { rollbackStatement.close() }
        
        do {
            try beginStatement.execute().close()
            try block(connection)
            try commitStatement.execute().close()
        } catch {
            try rollbackStatement.execute().close()
            throw error
        }
    }
    
    /// Check if the database is available
    func checkConnection() -> Bool {
        do {
            let connection = try getConnection()
            defer { returnConnection(connection) }
            
            let statement = try connection.prepareStatement(text: "SELECT 1")
            defer { statement.close() }
            
            let cursor = try statement.execute()
            defer { cursor.close() }
            
            return true
        } catch {
            print("Database connection check failed: \(error)")
            return false
        }
    }
    
    /// Initialize the database schema
    func initializeSchema(schemaFilePath: String) throws {
        guard let schemaSQL = try? String(contentsOfFile: schemaFilePath) else {
            throw NSError(domain: "DatabaseManager", code: 1, userInfo: [NSLocalizedDescriptionKey: "Could not read schema file"])
        }
        
        let connection = try getConnection()
        defer { returnConnection(connection) }
        
        // Split the schema into individual statements
        let statements = schemaSQL.components(separatedBy: ";")
            .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
            .filter { !$0.isEmpty }
        
        for statement in statements {
            let preparedStatement = try connection.prepareStatement(text: statement)
            defer { preparedStatement.close() }
            
            let cursor = try preparedStatement.execute()
            cursor.close()
        }
    }
    
    /// Check if pgvector extension is available
    func checkPgVectorExtension() -> Bool {
        do {
            let query = """
                SELECT COUNT(*) FROM pg_extension WHERE extname = 'vector'
            """
            
            let result = try executeQuery(query) { row in
                let count = try row.columns[0].int()
                return count > 0
            }
            
            return result.first ?? false
        } catch {
            print("Error checking pgvector extension: \(error)")
            return false
        }
    }
}

/// Vector operations for pgvector
extension DatabaseManager {
    /// Store a vector embedding
    func storeVectorEmbedding(table: String, id: UUID, embedding: [Float]) throws {
        let vectorString = embedding.map { String($0) }.joined(separator: ",")
        
        let query = """
            UPDATE \(table) 
            SET vector_embedding = '\(vectorString)'::vector 
            WHERE id = '\(id)'
        """
        
        try executeUpdate(query)
    }
    
    /// Find similar items using vector search
    func findSimilarItems(table: String, embedding: [Float], maxResults: Int = 10, similarityThreshold: Float = 0.7) throws -> [(id: UUID, similarity: Float)] {
        let vectorString = embedding.map { String($0) }.joined(separator: ",")
        
        let query = """
            SELECT id, 1 - (vector_embedding <-> '\(vectorString)'::vector) AS similarity
            FROM \(table)
            WHERE vector_embedding IS NOT NULL
            AND 1 - (vector_embedding <-> '\(vectorString)'::vector) > \(similarityThreshold)
            ORDER BY similarity DESC
            LIMIT \(maxResults)
        """
        
        return try executeQuery(query) { row in
            let id = try UUID(uuidString: row.columns[0].string())!
            let similarity = try Float(row.columns[1].string())!
            return (id: id, similarity: similarity)
        }
    }
    
    /// Search across all vector tables
    func searchAcrossVectors(embedding: [Float], maxResults: Int = 10, similarityThreshold: Float = 0.7) throws -> [(table: String, id: UUID, similarity: Float)] {
        let vectorTables = ["persons", "evidence", "timeline_events", "notes", "ai_analysis"]
        var results: [(table: String, id: UUID, similarity: Float)] = []
        
        for table in vectorTables {
            let tableResults = try findSimilarItems(table: table, embedding: embedding, maxResults: maxResults, similarityThreshold: similarityThreshold)
            results.append(contentsOf: tableResults.map { (table: table, id: $0.id, similarity: $0.similarity) })
        }
        
        // Sort by similarity and limit to maxResults
        results.sort { $0.similarity > $1.similarity }
        if results.count > maxResults {
            results = Array(results.prefix(maxResults))
        }
        
        return results
    }
}
