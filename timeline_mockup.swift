# Timeline View Mockup

```swift
import SwiftUI

struct TimelineView: View {
    @State private var zoomLevel: Double = 1.0
    @State private var selectedEvent: TimelineEvent? = nil
    @State private var filterType: String = "All"
    
    // Sample data
    let timelineEvents: [TimelineEvent] = [
        TimelineEvent(id: "1", title: "Bank opens", time: "09:15", date: "April 2, 2025", type: "Background", importance: .low),
        TimelineEvent(id: "2", title: "Suspects enter bank", time: "10:30", date: "April 2, 2025", type: "Suspect Activity", importance: .medium),
        TimelineEvent(id: "3", title: "Robbery occurs", time: "10:32", date: "April 2, 2025", type: "Critical Event", importance: .high),
        TimelineEvent(id: "4", title: "Suspects flee in sedan", time: "10:35", date: "April 2, 2025", type: "Suspect Activity", importance: .high),
        TimelineEvent(id: "5", title: "911 call received", time: "10:37", date: "April 2, 2025", type: "Witness Report", importance: .medium),
        TimelineEvent(id: "6", title: "Police arrive on scene", time: "10:45", date: "April 2, 2025", type: "Police Activity", importance: .medium),
        TimelineEvent(id: "7", title: "Witness interviews begin", time: "11:00", date: "April 2, 2025", type: "Investigation", importance: .medium),
        TimelineEvent(id: "8", title: "Evidence collection begins", time: "11:15", date: "April 2, 2025", type: "Investigation", importance: .medium)
    ]
    
    let eventTypes = ["All", "Background", "Suspect Activity", "Critical Event", "Witness Report", "Police Activity", "Investigation"]
    
    var filteredEvents: [TimelineEvent] {
        if filterType == "All" {
            return timelineEvents
        } else {
            return timelineEvents.filter { $0.type == filterType }
        }
    }
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Text("Timeline")
                    .font(.title)
                    .fontWeight(.bold)
                
                Spacer()
                
                Button(action: {}) {
                    Label("Add Event", systemImage: "plus")
                }
                .buttonStyle(.borderedProminent)
            }
            .padding()
            
            // Controls
            HStack(spacing: 16) {
                // Filter
                Menu {
                    ForEach(eventTypes, id: \.self) { type in
                        Button(type) {
                            filterType = type
                        }
                    }
                } label: {
                    HStack {
                        Text("Filter: \(filterType)")
                        Image(systemName: "chevron.down")
                    }
                    .padding(8)
                    .background(Color(.secondarySystemBackground))
                    .cornerRadius(8)
                }
                
                // Zoom controls
                HStack {
                    Button(action: {
                        zoomLevel = max(0.5, zoomLevel - 0.25)
                    }) {
                        Image(systemName: "minus.magnifyingglass")
                    }
                    .buttonStyle(.bordered)
                    
                    Slider(value: $zoomLevel, in: 0.5...2.0, step: 0.25)
                        .frame(width: 100)
                    
                    Button(action: {
                        zoomLevel = min(2.0, zoomLevel + 0.25)
                    }) {
                        Image(systemName: "plus.magnifyingglass")
                    }
                    .buttonStyle(.bordered)
                }
                
                Spacer()
                
                // View options
                Picker("View", selection: .constant(0)) {
                    Text("Chronological").tag(0)
                    Text("Grouped").tag(1)
                }
                .pickerStyle(.segmented)
                .frame(width: 200)
            }
            .padding(.horizontal)
            .padding(.bottom)
            
            // Timeline
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    // Date header
                    Text("April 2, 2025")
                        .font(.headline)
                        .padding(.vertical, 8)
                        .padding(.horizontal)
                        .background(Color(.systemBackground))
                        .frame(maxWidth: .infinity, alignment: .leading)
                    
                    // Timeline events
                    ForEach(filteredEvents) { event in
                        TimelineEventRow(event: event, isSelected: selectedEvent?.id == event.id)
                            .onTapGesture {
                                selectedEvent = event
                            }
                            .scaleEffect(x: 1.0, y: zoomLevel, anchor: .center)
                    }
                }
                .animation(.easeInOut, value: zoomLevel)
                .animation(.easeInOut, value: filterType)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color(.secondarySystemBackground))
        }
        .sheet(item: $selectedEvent) { event in
            TimelineEventDetailView(event: event)
        }
    }
}

struct TimelineEventRow: View {
    let event: TimelineEvent
    let isSelected: Bool
    
    var body: some View {
        HStack(alignment: .top, spacing: 0) {
            // Time column
            VStack {
                Text(event.time)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .frame(width: 60)
            }
            .padding(.vertical, 12)
            .frame(width: 80)
            
            // Timeline line with dot
            VStack(spacing: 0) {
                Circle()
                    .fill(importanceColor)
                    .frame(width: 16, height: 16)
                    .overlay(
                        Circle()
                            .stroke(Color.white, lineWidth: 2)
                    )
                    .background(
                        Rectangle()
                            .fill(Color.gray.opacity(0.3))
                            .frame(width: 2)
                            .offset(x: 0, y: 16)
                    )
                
                Rectangle()
                    .fill(Color.gray.opacity(0.3))
                    .frame(width: 2)
                    .frame(maxHeight: .infinity)
            }
            .frame(width: 20)
            .padding(.vertical, 12)
            
            // Event content
            VStack(alignment: .leading, spacing: 4) {
                Text(event.title)
                    .font(.headline)
                
                HStack {
                    Text(event.type)
                        .font(.caption)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 2)
                        .background(typeColor.opacity(0.1))
                        .foregroundColor(typeColor)
                        .cornerRadius(4)
                    
                    if event.importance == .high {
                        Text("High Importance")
                            .font(.caption)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 2)
                            .background(Color.red.opacity(0.1))
                            .foregroundColor(.red)
                            .cornerRadius(4)
                    }
                }
                
                if isSelected {
                    HStack {
                        Button("View Details") {
                            // Action
                        }
                        .font(.caption)
                        
                        Button("Edit") {
                            // Action
                        }
                        .font(.caption)
                        
                        Button("Delete") {
                            // Action
                        }
                        .font(.caption)
                        .foregroundColor(.red)
                    }
                    .padding(.top, 4)
                }
            }
            .padding(.vertical, 12)
            .padding(.horizontal, 16)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(isSelected ? Color.blue.opacity(0.1) : Color.clear)
        }
        .background(Color(.systemBackground))
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundColor(Color(.systemGray5)),
            alignment: .bottom
        )
    }
    
    var importanceColor: Color {
        switch event.importance {
        case .low:
            return .green
        case .medium:
            return .orange
        case .high:
            return .red
        }
    }
    
    var typeColor: Color {
        switch event.type {
        case "Background":
            return .gray
        case "Suspect Activity":
            return .orange
        case "Critical Event":
            return .red
        case "Witness Report":
            return .blue
        case "Police Activity":
            return .purple
        case "Investigation":
            return .green
        default:
            return .gray
        }
    }
}

struct TimelineEventDetailView: View {
    let event: TimelineEvent
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Event Details")) {
                    LabeledContent("Title", value: event.title)
                    LabeledContent("Date", value: event.date)
                    LabeledContent("Time", value: event.time)
                    LabeledContent("Type", value: event.type)
                    LabeledContent("Importance", value: event.importance.rawValue)
                }
                
                Section(header: Text("Description")) {
                    Text("Detailed description of the event would appear here. This would include all relevant information about what happened, who was involved, and any other important details.")
                        .font(.body)
                        .foregroundColor(.secondary)
                }
                
                Section(header: Text("Related Items")) {
                    NavigationLink(destination: Text("Evidence #1")) {
                        Label("Security Camera Footage", systemImage: "video")
                    }
                    
                    NavigationLink(destination: Text("Person #1")) {
                        Label("John Doe (Suspect)", systemImage: "person")
                    }
                    
                    NavigationLink(destination: Text("Person #2")) {
                        Label("Jane Smith (Witness)", systemImage: "person")
                    }
                }
                
                Section(header: Text("Notes")) {
                    Text("Additional notes about this event would be displayed here. Investigators can add context, observations, or follow-up items related to this specific timeline event.")
                        .font(.body)
                        .foregroundColor(.secondary)
                }
            }
            .navigationTitle("Event Details")
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}

struct TimelineEvent: Identifiable {
    let id: String
    let title: String
    let time: String
    let date: String
    let type: String
    let importance: Importance
    
    enum Importance: String {
        case low = "Low"
        case medium = "Medium"
        case high = "High"
    }
}
```
