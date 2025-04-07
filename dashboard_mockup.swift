# Dashboard View Mockup

```swift
import SwiftUI

struct DashboardView: View {
    @State private var searchText = ""
    @State private var selectedCase: Case? = nil
    
    // Sample data
    let activeCases: [Case] = [
        Case(id: "12345", title: "Robbery Investigation", priority: .high, lastUpdated: "2 hours ago"),
        Case(id: "12346", title: "Fraud Case", priority: .medium, lastUpdated: "Yesterday"),
        Case(id: "12347", title: "Missing Person", priority: .critical, lastUpdated: "4 hours ago"),
        Case(id: "12348", title: "Assault Investigation", priority: .medium, lastUpdated: "1 day ago"),
        Case(id: "12349", title: "Theft Report", priority: .low, lastUpdated: "3 days ago")
    ]
    
    let recentActivities: [Activity] = [
        Activity(description: "Evidence added to Case #12345", timestamp: "2 hours ago"),
        Activity(description: "New timeline event created", timestamp: "3 hours ago"),
        Activity(description: "OCR completed for 3 documents", timestamp: "5 hours ago"),
        Activity(description: "New witness added to Case #12347", timestamp: "Yesterday"),
        Activity(description: "Analysis report generated", timestamp: "Yesterday")
    ]
    
    let aiInsights: [Insight] = [
        Insight(content: "Possible connection between suspect John Doe and witness statements in Case #12345", confidence: 0.85),
        Insight(content: "Timeline inconsistency detected in Case #12347", confidence: 0.72),
        Insight(content: "Similar evidence patterns found between Case #12345 and archived Case #10532", confidence: 0.68)
    ]
    
    var body: some View {
        NavigationView {
            // Sidebar
            List {
                NavigationLink(destination: Text("Dashboard")) {
                    Label("Dashboard", systemImage: "square.grid.2x2")
                }
                .bold()
                
                NavigationLink(destination: Text("Cases")) {
                    Label("Cases", systemImage: "folder")
                }
                
                NavigationLink(destination: Text("Evidence")) {
                    Label("Evidence", systemImage: "doc.text.magnifyingglass")
                }
                
                NavigationLink(destination: Text("Timeline")) {
                    Label("Timeline", systemImage: "calendar")
                }
                
                NavigationLink(destination: Text("Persons")) {
                    Label("Persons", systemImage: "person.2")
                }
                
                NavigationLink(destination: Text("Analysis")) {
                    Label("Analysis", systemImage: "chart.bar.xaxis")
                }
                
                NavigationLink(destination: Text("Reports")) {
                    Label("Reports", systemImage: "doc.text")
                }
                
                NavigationLink(destination: Text("Settings")) {
                    Label("Settings", systemImage: "gear")
                }
            }
            .listStyle(SidebarListStyle())
            .frame(minWidth: 200)
            
            // Main Content
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // Header
                    HStack {
                        Text("Dashboard")
                            .font(.largeTitle)
                            .bold()
                        
                        Spacer()
                        
                        Button(action: {}) {
                            Label("New Case", systemImage: "plus")
                        }
                        .buttonStyle(.borderedProminent)
                    }
                    .padding(.bottom)
                    
                    // Active Cases Section
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Active Cases (\(activeCases.count))")
                            .font(.headline)
                        
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 15) {
                                ForEach(activeCases, id: \.id) { caseItem in
                                    CaseCard(caseItem: caseItem)
                                        .frame(width: 250, height: 150)
                                }
                            }
                        }
                    }
                    
                    // Recent Activity Section
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Recent Activity")
                            .font(.headline)
                        
                        ForEach(recentActivities, id: \.description) { activity in
                            HStack {
                                Circle()
                                    .fill(Color.blue)
                                    .frame(width: 8, height: 8)
                                Text(activity.description)
                                    .fontWeight(.medium)
                                Spacer()
                                Text(activity.timestamp)
                                    .foregroundColor(.secondary)
                                    .font(.caption)
                            }
                            .padding(.vertical, 4)
                        }
                    }
                    .padding()
                    .background(Color(.secondarySystemBackground))
                    .cornerRadius(10)
                    
                    // AI Insights Section
                    VStack(alignment: .leading, spacing: 10) {
                        Text("AI Insights")
                            .font(.headline)
                        
                        ForEach(aiInsights, id: \.content) { insight in
                            VStack(alignment: .leading, spacing: 5) {
                                HStack {
                                    Image(systemName: "sparkles")
                                        .foregroundColor(.orange)
                                    Text(insight.content)
                                        .fontWeight(.medium)
                                }
                                
                                HStack {
                                    Text("Confidence: \(Int(insight.confidence * 100))%")
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                    
                                    Spacer()
                                    
                                    Button("View Details") {
                                        // Action
                                    }
                                    .font(.caption)
                                }
                            }
                            .padding()
                            .background(Color(.secondarySystemBackground))
                            .cornerRadius(8)
                        }
                    }
                }
                .padding()
            }
            .frame(minWidth: 500)
            
            // Detail Panel (empty in dashboard)
            EmptyView()
        }
        .searchable(text: $searchText, prompt: "Search cases, evidence, persons...")
        .toolbar {
            ToolbarItem(placement: .automatic) {
                Menu {
                    Button("Profile", action: {})
                    Button("Preferences", action: {})
                    Divider()
                    Button("Sign Out", action: {})
                } label: {
                    Label("User", systemImage: "person.circle")
                }
            }
        }
    }
}

// Supporting Views and Models
struct CaseCard: View {
    let caseItem: Case
    
    var body: some View {
        VStack(alignment: .leading) {
            HStack {
                Text("Case #\(caseItem.id)")
                    .font(.headline)
                Spacer()
                priorityBadge
            }
            
            Text(caseItem.title)
                .font(.title3)
                .fontWeight(.semibold)
                .padding(.top, 1)
            
            Spacer()
            
            HStack {
                Image(systemName: "clock")
                    .foregroundColor(.secondary)
                Text("Last updated: \(caseItem.lastUpdated)")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .background(Color(.secondarySystemBackground))
        .cornerRadius(10)
    }
    
    var priorityBadge: some View {
        HStack {
            Circle()
                .fill(priorityColor)
                .frame(width: 8, height: 8)
            Text(caseItem.priority.rawValue)
                .font(.caption)
                .foregroundColor(priorityColor)
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(priorityColor.opacity(0.1))
        .cornerRadius(12)
    }
    
    var priorityColor: Color {
        switch caseItem.priority {
        case .low:
            return .green
        case .medium:
            return .orange
        case .high:
            return .red
        case .critical:
            return .purple
        }
    }
}

struct Case {
    let id: String
    let title: String
    let priority: Priority
    let lastUpdated: String
    
    enum Priority: String {
        case low = "Low"
        case medium = "Medium"
        case high = "High"
        case critical = "Critical"
    }
}

struct Activity {
    let description: String
    let timestamp: String
}

struct Insight {
    let content: String
    let confidence: Double
}
```
