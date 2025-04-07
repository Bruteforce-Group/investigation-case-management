// ErrorHandling.swift
// Error handling and validation for Investigation Case Management Application

import SwiftUI
import Combine

/// Application error types
enum AppError: Error, Identifiable {
    case databaseError(String)
    case networkError(String)
    case fileError(String)
    case validationError(String)
    case authenticationError(String)
    case apiError(String)
    case vectorDBError(String)
    case unknownError(String)
    
    var id: String {
        switch self {
        case .databaseError(let message): return "db_\(message.hashValue)"
        case .networkError(let message): return "net_\(message.hashValue)"
        case .fileError(let message): return "file_\(message.hashValue)"
        case .validationError(let message): return "val_\(message.hashValue)"
        case .authenticationError(let message): return "auth_\(message.hashValue)"
        case .apiError(let message): return "api_\(message.hashValue)"
        case .vectorDBError(let message): return "vec_\(message.hashValue)"
        case .unknownError(let message): return "unk_\(message.hashValue)"
        }
    }
    
    var title: String {
        switch self {
        case .databaseError: return "Database Error"
        case .networkError: return "Network Error"
        case .fileError: return "File Error"
        case .validationError: return "Validation Error"
        case .authenticationError: return "Authentication Error"
        case .apiError: return "API Error"
        case .vectorDBError: return "Vector Database Error"
        case .unknownError: return "Unknown Error"
        }
    }
    
    var message: String {
        switch self {
        case .databaseError(let message): return message
        case .networkError(let message): return message
        case .fileError(let message): return message
        case .validationError(let message): return message
        case .authenticationError(let message): return message
        case .apiError(let message): return message
        case .vectorDBError(let message): return message
        case .unknownError(let message): return message
        }
    }
    
    var recoveryAction: String? {
        switch self {
        case .databaseError:
            return "Try restarting the application or check database connection."
        case .networkError:
            return "Check your internet connection and try again."
        case .fileError:
            return "Ensure the file exists and you have proper permissions."
        case .validationError:
            return "Please correct the input and try again."
        case .authenticationError:
            return "Please log in again."
        case .apiError:
            return "Try again later or contact support if the issue persists."
        case .vectorDBError:
            return "Try restarting the application or check vector database configuration."
        case .unknownError:
            return "Try restarting the application or contact support."
        }
    }
    
    var logLevel: LogLevel {
        switch self {
        case .databaseError: return .error
        case .networkError: return .warning
        case .fileError: return .warning
        case .validationError: return .info
        case .authenticationError: return .error
        case .apiError: return .error
        case .vectorDBError: return .error
        case .unknownError: return .error
        }
    }
}

/// Log levels for application logging
enum LogLevel: String {
    case debug = "DEBUG"
    case info = "INFO"
    case warning = "WARNING"
    case error = "ERROR"
    case critical = "CRITICAL"
    
    var icon: String {
        switch self {
        case .debug: return "🔍"
        case .info: return "ℹ️"
        case .warning: return "⚠️"
        case .error: return "❌"
        case .critical: return "🚨"
        }
    }
    
    var color: Color {
        switch self {
        case .debug: return .gray
        case .info: return .blue
        case .warning: return .orange
        case .error: return .red
        case .critical: return .purple
        }
    }
}

/// Global error handler for the application
class ErrorHandler: ObservableObject {
    static let shared = ErrorHandler()
    
    @Published var currentError: AppError? = nil
    @Published var isShowingError: Bool = false
    @Published var logs: [LogEntry] = []
    
    private let maxLogEntries = 1000
    private var logFile: URL?
    
    private init() {
        setupLogFile()
    }
    
    private func setupLogFile() {
        do {
            let fileManager = FileManager.default
            let documentsDirectory = try fileManager.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
            let logDirectory = documentsDirectory.appendingPathComponent("Logs", isDirectory: true)
            
            if !fileManager.fileExists(atPath: logDirectory.path) {
                try fileManager.createDirectory(at: logDirectory, withIntermediateDirectories: true)
            }
            
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "yyyy-MM-dd"
            let dateString = dateFormatter.string(from: Date())
            
            logFile = logDirectory.appendingPathComponent("app_log_\(dateString).log")
            
            // Create log file if it doesn't exist
            if !fileManager.fileExists(atPath: logFile!.path) {
                fileManager.createFile(atPath: logFile!.path, contents: nil)
            }
        } catch {
            print("Failed to setup log file: \(error)")
        }
    }
    
    func handle(_ error: AppError) {
        log(level: error.logLevel, message: error.message)
        
        DispatchQueue.main.async {
            self.currentError = error
            self.isShowingError = true
        }
    }
    
    func log(level: LogLevel, message: String, file: String = #file, function: String = #function, line: Int = #line) {
        let fileName = URL(fileURLWithPath: file).lastPathComponent
        let logEntry = LogEntry(
            timestamp: Date(),
            level: level,
            message: message,
            source: "\(fileName):\(line) - \(function)"
        )
        
        DispatchQueue.main.async {
            self.logs.insert(logEntry, at: 0)
            if self.logs.count > self.maxLogEntries {
                self.logs.removeLast()
            }
        }
        
        writeToLogFile(logEntry)
    }
    
    private func writeToLogFile(_ entry: LogEntry) {
        guard let logFile = logFile else { return }
        
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd HH:mm:ss.SSS"
        
        let logString = "[\(formatter.string(from: entry.timestamp))] [\(entry.level.rawValue)] \(entry.message) - \(entry.source)\n"
        
        do {
            let fileHandle = try FileHandle(forWritingTo: logFile)
            fileHandle.seekToEndOfFile()
            if let data = logString.data(using: .utf8) {
                fileHandle.write(data)
            }
            fileHandle.closeFile()
        } catch {
            print("Failed to write to log file: \(error)")
        }
    }
    
    func clearLogs() {
        DispatchQueue.main.async {
            self.logs.removeAll()
        }
    }
}

/// Log entry model
struct LogEntry: Identifiable {
    let id = UUID()
    let timestamp: Date
    let level: LogLevel
    let message: String
    let source: String
}

/// Error alert view modifier
struct ErrorAlert: ViewModifier {
    @ObservedObject var errorHandler = ErrorHandler.shared
    
    func body(content: Content) -> some View {
        content
            .alert(
                errorHandler.currentError?.title ?? "Error",
                isPresented: $errorHandler.isShowingError,
                presenting: errorHandler.currentError
            ) { error in
                Button("OK") {
                    errorHandler.isShowingError = false
                }
            } message: { error in
                VStack(alignment: .leading) {
                    Text(error.message)
                    
                    if let recoveryAction = error.recoveryAction {
                        Text(recoveryAction)
                            .font(.caption)
                            .padding(.top, 8)
                    }
                }
            }
    }
}

/// Log viewer view
struct LogViewer: View {
    @ObservedObject var errorHandler = ErrorHandler.shared
    @State private var searchText = ""
    @State private var selectedLogLevel: LogLevel? = nil
    
    var filteredLogs: [LogEntry] {
        errorHandler.logs.filter { log in
            let matchesSearch = searchText.isEmpty || 
                log.message.localizedCaseInsensitiveContains(searchText) ||
                log.source.localizedCaseInsensitiveContains(searchText)
            
            let matchesLevel = selectedLogLevel == nil || log.level == selectedLogLevel
            
            return matchesSearch && matchesLevel
        }
    }
    
    var body: some View {
        VStack(spacing: 0) {
            // Search and filter controls
            HStack {
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.secondary)
                    
                    TextField("Search logs", text: $searchText)
                        .textFieldStyle(.plain)
                }
                .padding(8)
                .background(Color(.systemGray6))
                .cornerRadius(8)
                
                Menu {
                    Button("All Levels") {
                        selectedLogLevel = nil
                    }
                    
                    Divider()
                    
                    ForEach([LogLevel.debug, .info, .warning, .error, .critical], id: \.self) { level in
                        Button {
                            selectedLogLevel = level
                        } label: {
                            HStack {
                                Text(level.rawValue)
                                if selectedLogLevel == level {
                                    Image(systemName: "checkmark")
                                }
                            }
                        }
                    }
                } label: {
                    HStack {
                        Image(systemName: "line.3.horizontal.decrease.circle")
                        Text(selectedLogLevel?.rawValue ?? "All Levels")
                    }
                    .padding(8)
                    .background(Color(.systemGray6))
                    .cornerRadius(8)
                }
                
                Button(action: { errorHandler.clearLogs() }) {
                    Image(systemName: "trash")
                        .padding(8)
                        .background(Color(.systemGray6))
                        .cornerRadius(8)
                }
            }
            .padding()
            .background(Color(.systemBackground))
            
            Divider()
            
            // Log entries
            if filteredLogs.isEmpty {
                VStack {
                    Image(systemName: "doc.text")
                        .font(.largeTitle)
                        .foregroundColor(.secondary)
                        .padding()
                    
                    Text("No logs found")
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Color(.secondarySystemBackground))
            } else {
                List {
                    ForEach(filteredLogs) { log in
                        LogEntryRow(log: log)
                    }
                }
            }
        }
        .navigationTitle("Application Logs")
    }
}

/// Log entry row view
struct LogEntryRow: View {
    let log: LogEntry
    @State private var isExpanded = false
    
    private let dateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd HH:mm:ss.SSS"
        return formatter
    }()
    
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(alignment: .top) {
                Text(log.level.icon)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(log.message)
                        .font(.body)
                        .lineLimit(isExpanded ? nil : 2)
                    
                    Text(dateFormatter.string(from: log.timestamp))
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            
            if isExpanded {
                Text(log.source)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .padding(.top, 4)
            }
        }
        .padding(.vertical, 4)
        .contentShape(Rectangle())
        .onTapGesture {
            withAnimation {
                isExpanded.toggle()
            }
        }
        .listRowBackground(log.level.color.opacity(0.1))
    }
}

// MARK: - Validation

/// Validation result
enum ValidationResult {
    case valid
    case invalid(String)
}

/// Validation protocol
protocol Validatable {
    func validate() -> ValidationResult
}

/// Validation rules
struct ValidationRule {
    static func notEmpty(_ value: String, fieldName: String) -> ValidationResult {
        return value.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? 
            .invalid("\(fieldName) cannot be empty") : .valid
    }
    
    static func minLength(_ value: String, length: Int, fieldName: String) -> ValidationResult {
        return value.count < length ? 
            .invalid("\(fieldName) must be at least \(length) characters") : .valid
    }
    
    static func maxLength(_ value: String, length: Int, fieldName: String) -> ValidationResult {
        return value.count > length ? 
            .invalid("\(fieldName) must be at most \(length) characters") : .valid
    }
    
    static func validEmail(_ value: String) -> ValidationResult {
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let emailPredicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: value) ? .valid : .invalid("Invalid email format")
    }
    
    static func validDate(_ value: Date, after: Date? = nil, before: Date? = nil, fieldName: String) -> ValidationResult {
        if let after = after, value < after {
            return .invalid("\(fieldName) must be after \(after)")
        }
        
        if let before = before, value > before {
            return .invalid("\(fieldName) must be before \(before)")
        }
        
        return .valid
    }
    
    static func validFileSize(_ size: Int64, maxSize: Int64) -> ValidationResult {
        return size > maxSize ? 
            .invalid("File size exceeds maximum allowed size of \(formatFileSize(maxSize))") : .valid
    }
    
    static func validFileType(_ mimeType: String, allowedTypes: [String]) -> ValidationResult {
        return allowedTypes.contains(mimeType) ? 
            .valid : .invalid("File type not allowed. Allowed types: \(allowedTypes.joined(separator: ", "))")
    }
    
    private static func formatFileSize(_ size: Int64) -> String {
        let formatter = ByteCountFormatter()
        formatter.allowedUnits = [.useKB, .useMB, .useGB]
        formatter.countStyle = .file
        return formatter.string(fromByteCount: size)
    }
}

/// Form validation helper
class FormValidator {
    static func validate(_ validations: [ValidationResult]) -> ValidationResult {
        for validation in validations {
            if case .invalid = validation {
                ret
(Content truncated due to size limit. Use line ranges to read in chunks)