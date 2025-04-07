# Evidence Management View Mockup

```swift
import SwiftUI

struct EvidenceManagementView: View {
    @State private var searchText = ""
    @State private var selectedEvidence: Evidence? = nil
    @State private var filterType: String = "All"
    @State private var sortOption: String = "Date Added (Newest)"
    @State private var isAddingEvidence = false
    @State private var selectedItems: Set<String> = []
    
    // Sample data
    let evidenceItems: [Evidence] = [
        Evidence(id: "E001", title: "Security Camera Footage", type: .video, dateAdded: "April 2, 2025", status: .processed),
        Evidence(id: "E002", title: "Witness Statement - John Smith", type: .document, dateAdded: "April 2, 2025", status: .processed),
        Evidence(id: "E003", title: "911 Call Recording", type: .audio, dateAdded: "April 2, 2025", status: .processed),
        Evidence(id: "E004", title: "Crime Scene Photo #1", type: .image, dateAdded: "April 2, 2025", status: .processed),
        Evidence(id: "E005", title: "Crime Scene Photo #2", type: .image, dateAdded: "April 2, 2025", status: .processed),
        Evidence(id: "E006", title: "Fingerprint Analysis", type: .document, dateAdded: "April 3, 2025", status: .processing),
        Evidence(id: "E007", title: "Bank Floor Plan", type: .document, dateAdded: "April 3, 2025", status: .processed),
        Evidence(id: "E008", title: "Suspect Vehicle Photo", type: .image, dateAdded: "April 3, 2025", status: .processed),
        Evidence(id: "E009", title: "Weapon Analysis Report", type: .document, dateAdded: "April 4, 2025", status: .unprocessed),
        Evidence(id: "E010", title: "Surveillance Video - External", type: .video, dateAdded: "April 4, 2025", status: .unprocessed)
    ]
    
    let evidenceTypes = ["All", "Document", "Image", "Audio", "Video", "Physical", "Other"]
    let sortOptions = ["Date Added (Newest)", "Date Added (Oldest)", "Title (A-Z)", "Title (Z-A)", "Type"]
    
    var filteredEvidence: [Evidence] {
        var result = evidenceItems
        
        // Apply type filter
        if filterType != "All" {
            result = result.filter { $0.type.rawValue == filterType }
        }
        
        // Apply search filter
        if !searchText.isEmpty {
            result = result.filter { $0.title.lowercased().contains(searchText.lowercased()) }
        }
        
        // Apply sorting
        switch sortOption {
        case "Date Added (Newest)":
            // This is just a mockup, so we're not actually sorting by date
            return result
        case "Date Added (Oldest)":
            return result.reversed()
        case "Title (A-Z)":
            return result.sorted { $0.title < $1.title }
        case "Title (Z-A)":
            return result.sorted { $0.title > $1.title }
        case "Type":
            return result.sorted { $0.type.rawValue < $1.type.rawValue }
        default:
            return result
        }
    }
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Text("Evidence Management")
                    .font(.title)
                    .fontWeight(.bold)
                
                Spacer()
                
                Button(action: { isAddingEvidence = true }) {
                    Label("Add Evidence", systemImage: "plus")
                }
                .buttonStyle(.borderedProminent)
            }
            .padding()
            
            // Controls
            VStack(spacing: 12) {
                // Search, filter, sort
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.secondary)
                    
                    TextField("Search evidence...", text: $searchText)
                        .textFieldStyle(PlainTextFieldStyle())
                    
                    if !searchText.isEmpty {
                        Button(action: { searchText = "" }) {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(.secondary)
                        }
                    }
                }
                .padding(8)
                .background(Color(.secondarySystemBackground))
                .cornerRadius(8)
                
                HStack {
                    // Type filter
                    Menu {
                        ForEach(evidenceTypes, id: \.self) { type in
                            Button(type) {
                                filterType = type
                            }
                        }
                    } label: {
                        HStack {
                            Image(systemName: "line.3.horizontal.decrease.circle")
                            Text("Filter: \(filterType)")
                            Image(systemName: "chevron.down")
                        }
                        .padding(8)
                        .background(Color(.secondarySystemBackground))
                        .cornerRadius(8)
                        .foregroundColor(.primary)
                    }
                    
                    // Sort options
                    Menu {
                        ForEach(sortOptions, id: \.self) { option in
                            Button(option) {
                                sortOption = option
                            }
                        }
                    } label: {
                        HStack {
                            Image(systemName: "arrow.up.arrow.down")
                            Text("Sort: \(sortOption)")
                            Image(systemName: "chevron.down")
                        }
                        .padding(8)
                        .background(Color(.secondarySystemBackground))
                        .cornerRadius(8)
                        .foregroundColor(.primary)
                    }
                    
                    Spacer()
                    
                    // View options
                    Picker("View", selection: .constant(0)) {
                        Image(systemName: "square.grid.2x2").tag(0)
                        Image(systemName: "list.bullet").tag(1)
                    }
                    .pickerStyle(.segmented)
                    .frame(width: 100)
                }
                
                // Selection controls (visible when items are selected)
                if !selectedItems.isEmpty {
                    HStack {
                        Text("\(selectedItems.count) items selected")
                            .foregroundColor(.secondary)
                        
                        Spacer()
                        
                        Button("Tag") {
                            // Action
                        }
                        .buttonStyle(.bordered)
                        
                        Button("Export") {
                            // Action
                        }
                        .buttonStyle(.bordered)
                        
                        Button("Delete") {
                            // Action
                        }
                        .buttonStyle(.bordered)
                        .foregroundColor(.red)
                    }
                    .padding(8)
                    .background(Color(.secondarySystemBackground))
                    .cornerRadius(8)
                }
            }
            .padding(.horizontal)
            .padding(.bottom)
            
            // Evidence grid
            ScrollView {
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 250))], spacing: 16) {
                    ForEach(filteredEvidence) { evidence in
                        EvidenceCard(
                            evidence: evidence,
                            isSelected: selectedItems.contains(evidence.id),
                            onSelect: { isSelected in
                                if isSelected {
                                    selectedItems.insert(evidence.id)
                                } else {
                                    selectedItems.remove(evidence.id)
                                }
                            },
                            onTap: {
                                selectedEvidence = evidence
                            }
                        )
                    }
                }
                .padding()
            }
            .background(Color(.secondarySystemBackground))
        }
        .sheet(isPresented: $isAddingEvidence) {
            AddEvidenceView()
        }
        .sheet(item: $selectedEvidence) { evidence in
            EvidenceDetailView(evidence: evidence)
        }
    }
}

struct EvidenceCard: View {
    let evidence: Evidence
    let isSelected: Bool
    let onSelect: (Bool) -> Void
    let onTap: () -> Void
    
    var body: some View {
        VStack(alignment: .leading) {
            // Thumbnail area
            ZStack(alignment: .topLeading) {
                Rectangle()
                    .fill(Color.gray.opacity(0.2))
                    .aspectRatio(1.5, contentMode: .fit)
                    .overlay(
                        Group {
                            switch evidence.type {
                            case .document:
                                Image(systemName: "doc.text")
                                    .font(.system(size: 30))
                                    .foregroundColor(.blue)
                            case .image:
                                Image(systemName: "photo")
                                    .font(.system(size: 30))
                                    .foregroundColor(.green)
                            case .audio:
                                Image(systemName: "waveform")
                                    .font(.system(size: 30))
                                    .foregroundColor(.orange)
                            case .video:
                                Image(systemName: "video")
                                    .font(.system(size: 30))
                                    .foregroundColor(.red)
                            case .physical:
                                Image(systemName: "cube")
                                    .font(.system(size: 30))
                                    .foregroundColor(.purple)
                            case .other:
                                Image(systemName: "questionmark.square")
                                    .font(.system(size: 30))
                                    .foregroundColor(.gray)
                            }
                        }
                    )
                
                // Selection checkbox
                Checkbox(isChecked: isSelected, onToggle: onSelect)
                    .padding(8)
            }
            .cornerRadius(8)
            
            // Evidence info
            VStack(alignment: .leading, spacing: 4) {
                Text(evidence.title)
                    .font(.headline)
                    .lineLimit(1)
                
                HStack {
                    Text(evidence.type.rawValue)
                        .font(.caption)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(typeColor.opacity(0.1))
                        .foregroundColor(typeColor)
                        .cornerRadius(4)
                    
                    Spacer()
                    
                    statusBadge
                }
                
                Text("Added: \(evidence.dateAdded)")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            .padding(.horizontal, 8)
            .padding(.vertical, 6)
        }
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.1), radius: 2, x: 0, y: 1)
        .onTapGesture {
            onTap()
        }
    }
    
    var typeColor: Color {
        switch evidence.type {
        case .document:
            return .blue
        case .image:
            return .green
        case .audio:
            return .orange
        case .video:
            return .red
        case .physical:
            return .purple
        case .other:
            return .gray
        }
    }
    
    var statusBadge: some View {
        HStack(spacing: 4) {
            Circle()
                .fill(statusColor)
                .frame(width: 6, height: 6)
            
            Text(evidence.status.rawValue)
                .font(.caption)
                .foregroundColor(statusColor)
        }
    }
    
    var statusColor: Color {
        switch evidence.status {
        case .unprocessed:
            return .gray
        case .processing:
            return .orange
        case .processed:
            return .green
        }
    }
}

struct Checkbox: View {
    let isChecked: Bool
    let onToggle: (Bool) -> Void
    
    var body: some View {
        Button(action: { onToggle(!isChecked) }) {
            ZStack {
                RoundedRectangle(cornerRadius: 4)
                    .stroke(Color.white, lineWidth: 2)
                    .background(
                        isChecked ? 
                            RoundedRectangle(cornerRadius: 4).fill(Color.blue) : 
                            RoundedRectangle(cornerRadius: 4).fill(Color.black.opacity(0.3))
                    )
                    .frame(width: 20, height: 20)
                
                if isChecked {
                    Image(systemName: "checkmark")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.white)
                }
            }
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct AddEvidenceView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var title = ""
    @State private var description = ""
    @State private var selectedType: Evidence.EvidenceType = .document
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Evidence Information")) {
                    TextField("Title", text: $title)
                    
                    Picker("Type", selection: $selectedType) {
                        ForEach(Evidence.EvidenceType.allCases, id: \.self) { type in
                            Text(type.rawValue).tag(type)
                        }
                    }
                    
                    TextEditor(text: $description)
                        .frame(height: 100)
                        .overlay(
                            RoundedRectangle(cornerRadius: 5)
                                .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                        )
                }
                
                Section(header: Text("File Upload")) {
                    HStack {
                        Image(systemName: "doc.badge.plus")
                            .font(.system(size: 24))
                            .foregroundColor(.blue)
                        
                        VStack(alignment: .leading) {
                            Text("Upload File")
                                .font(.headline)
                            Text("Click to select or drag and drop")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        
                        Spacer()
                        
                        Image(systemName: "arrow.up.doc")
                    }
                    .padding()
                    .background(Color.blue.opacity(0.1))
                    .cornerRadius(8)
                }
                
                Section(header: Text("Additional
(Content truncated due to size limit. Use line ranges to read in chunks)