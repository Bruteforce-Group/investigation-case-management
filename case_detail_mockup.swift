# Case Detail View Mockup

```swift
import SwiftUI

struct CaseDetailView: View {
    @State private var selectedTab = "Overview"
    @State private var caseNotes = "Armed robbery at First National Bank on Main Street. Two suspects fled in a blue sedan. Witnesses report suspects were wearing masks and carrying handguns."
    
    // Sample data
    let caseData = CaseDetail(
        id: "12345",
        title: "Robbery Investigation",
        status: "Active",
        priority: "High",
        createdDate: "April 2, 2025",
        assignedTo: "John Smith",
        description: "Armed robbery at First National Bank on Main Street. Two suspects fled in a blue sedan.",
        tags: ["robbery", "armed", "bank"]
    )
    
    let tabs = ["Overview", "Evidence", "Timeline", "Persons", "Notes", "Analysis", "Reports"]
    
    var body: some View {
        VStack(spacing: 0) {
            // Case header
            HStack {
                Text("CASE #\(caseData.id)")
                    .font(.headline)
                    .foregroundColor(.secondary)
                
                Spacer()
                
                Button(action: {}) {
                    Label("Edit", systemImage: "pencil")
                }
                
                Menu {
                    Button("Export Case", action: {})
                    Button("Share Case", action: {})
                    Divider()
                    Button("Close Case", action: {})
                    Button("Archive Case", action: {})
                    Divider()
                    Button("Delete Case", action: {})
                        .foregroundColor(.red)
                } label: {
                    Image(systemName: "ellipsis.circle")
                }
            }
            .padding()
            .background(Color(.systemBackground))
            
            // Tab selector
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 0) {
                    ForEach(tabs, id: \.self) { tab in
                        Button(action: {
                            selectedTab = tab
                        }) {
                            Text(tab)
                                .padding(.vertical, 12)
                                .padding(.horizontal, 16)
                                .foregroundColor(selectedTab == tab ? .primary : .secondary)
                        }
                        .background(
                            VStack {
                                Spacer()
                                if selectedTab == tab {
                                    Rectangle()
                                        .fill(Color.blue)
                                        .frame(height: 2)
                                }
                            }
                        )
                    }
                }
            }
            .padding(.horizontal)
            .overlay(
                Rectangle()
                    .frame(height: 1)
                    .foregroundColor(Color(.systemGray5)),
                alignment: .bottom
            )
            
            // Tab content
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    if selectedTab == "Overview" {
                        overviewTab
                    } else if selectedTab == "Evidence" {
                        evidenceTab
                    } else if selectedTab == "Timeline" {
                        timelineTab
                    } else if selectedTab == "Persons" {
                        personsTab
                    } else if selectedTab == "Notes" {
                        notesTab
                    } else if selectedTab == "Analysis" {
                        analysisTab
                    } else if selectedTab == "Reports" {
                        reportsTab
                    }
                }
                .padding()
            }
        }
    }
    
    // Tab content views
    var overviewTab: some View {
        VStack(alignment: .leading, spacing: 20) {
            // Case information
            Group {
                HStack {
                    Text("Case Title:")
                        .fontWeight(.semibold)
                        .frame(width: 120, alignment: .leading)
                    
                    Text(caseData.title)
                }
                
                HStack {
                    Text("Status:")
                        .fontWeight(.semibold)
                        .frame(width: 120, alignment: .leading)
                    
                    HStack {
                        Circle()
                            .fill(Color.green)
                            .frame(width: 8, height: 8)
                        Text(caseData.status)
                    }
                }
                
                HStack {
                    Text("Priority:")
                        .fontWeight(.semibold)
                        .frame(width: 120, alignment: .leading)
                    
                    HStack {
                        Circle()
                            .fill(Color.red)
                            .frame(width: 8, height: 8)
                        Text(caseData.priority)
                    }
                }
                
                HStack {
                    Text("Created:")
                        .fontWeight(.semibold)
                        .frame(width: 120, alignment: .leading)
                    
                    Text(caseData.createdDate)
                }
                
                HStack {
                    Text("Assigned to:")
                        .fontWeight(.semibold)
                        .frame(width: 120, alignment: .leading)
                    
                    Text(caseData.assignedTo)
                }
            }
            
            Divider()
            
            // Description
            VStack(alignment: .leading, spacing: 8) {
                Text("Description:")
                    .fontWeight(.semibold)
                
                Text(caseData.description)
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color(.secondarySystemBackground))
                    .cornerRadius(8)
            }
            
            Divider()
            
            // Tags
            VStack(alignment: .leading, spacing: 8) {
                Text("Tags:")
                    .fontWeight(.semibold)
                
                HStack {
                    ForEach(caseData.tags, id: \.self) { tag in
                        Text(tag)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 5)
                            .background(Color.blue.opacity(0.1))
                            .foregroundColor(.blue)
                            .cornerRadius(12)
                    }
                }
            }
            
            Divider()
            
            // Case statistics
            VStack(alignment: .leading, spacing: 8) {
                Text("Case Statistics:")
                    .fontWeight(.semibold)
                
                HStack(spacing: 20) {
                    VStack {
                        Text("12")
                            .font(.title)
                            .fontWeight(.bold)
                        Text("Evidence Items")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    VStack {
                        Text("8")
                            .font(.title)
                            .fontWeight(.bold)
                        Text("Timeline Events")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    VStack {
                        Text("5")
                            .font(.title)
                            .fontWeight(.bold)
                        Text("Persons")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    VStack {
                        Text("3")
                            .font(.title)
                            .fontWeight(.bold)
                        Text("AI Analyses")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
                .padding()
                .background(Color(.secondarySystemBackground))
                .cornerRadius(8)
            }
        }
    }
    
    var evidenceTab: some View {
        VStack(alignment: .leading, spacing: 20) {
            HStack {
                Text("Evidence Items")
                    .font(.title2)
                    .fontWeight(.bold)
                
                Spacer()
                
                Button(action: {}) {
                    Label("Add Evidence", systemImage: "plus")
                }
                .buttonStyle(.borderedProminent)
            }
            
            // Filter and sort controls
            HStack {
                Menu {
                    Button("All Types", action: {})
                    Divider()
                    Button("Documents", action: {})
                    Button("Images", action: {})
                    Button("Audio", action: {})
                    Button("Video", action: {})
                    Button("Physical", action: {})
                } label: {
                    Label("Filter", systemImage: "line.3.horizontal.decrease.circle")
                        .padding(8)
                        .background(Color(.secondarySystemBackground))
                        .cornerRadius(8)
                }
                
                Menu {
                    Button("Date Added (Newest)", action: {})
                    Button("Date Added (Oldest)", action: {})
                    Button("Name (A-Z)", action: {})
                    Button("Type", action: {})
                } label: {
                    Label("Sort", systemImage: "arrow.up.arrow.down")
                        .padding(8)
                        .background(Color(.secondarySystemBackground))
                        .cornerRadius(8)
                }
                
                Spacer()
                
                TextField("Search evidence...", text: .constant(""))
                    .padding(8)
                    .background(Color(.secondarySystemBackground))
                    .cornerRadius(8)
                    .frame(width: 200)
            }
            
            // Evidence grid
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 200))], spacing: 16) {
                ForEach(1...8, id: \.self) { _ in
                    evidenceCard
                }
            }
        }
    }
    
    var evidenceCard: some View {
        VStack(alignment: .leading) {
            ZStack(alignment: .topTrailing) {
                Image(systemName: "photo")
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(height: 120)
                    .background(Color.gray.opacity(0.2))
                    .cornerRadius(8)
                
                Text("IMAGE")
                    .font(.caption)
                    .padding(4)
                    .background(Color.black.opacity(0.6))
                    .foregroundColor(.white)
                    .cornerRadius(4)
                    .padding(8)
            }
            
            Text("Security Camera #1")
                .fontWeight(.semibold)
            
            Text("Added April 2, 2025")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding(8)
        .background(Color(.secondarySystemBackground))
        .cornerRadius(12)
    }
    
    var timelineTab: some View {
        Text("Timeline content")
    }
    
    var personsTab: some View {
        Text("Persons content")
    }
    
    var notesTab: some View {
        VStack(alignment: .leading, spacing: 20) {
            HStack {
                Text("Case Notes")
                    .font(.title2)
                    .fontWeight(.bold)
                
                Spacer()
                
                Button(action: {}) {
                    Label("Save", systemImage: "checkmark")
                }
                .buttonStyle(.borderedProminent)
            }
            
            TextEditor(text: $caseNotes)
                .frame(minHeight: 200)
                .padding(8)
                .background(Color(.secondarySystemBackground))
                .cornerRadius(8)
        }
    }
    
    var analysisTab: some View {
        Text("Analysis content")
    }
    
    var reportsTab: some View {
        Text("Reports content")
    }
}

struct CaseDetail {
    let id: String
    let title: String
    let status: String
    let priority: String
    let createdDate: String
    let assignedTo: String
    let description: String
    let tags: [String]
}
```
