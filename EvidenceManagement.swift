// EvidenceManagement.swift
// Evidence management module for Investigation Case Management Application

import SwiftUI
import UniformTypeIdentifiers
import Vision
import AVFoundation

/// Evidence management view
struct EvidenceManagementView: View {
    @ObservedObject var viewModel: EvidenceViewModel
    @State private var selectedEvidence: Evidence? = nil
    @State private var isShowingFilters = false
    @State private var isShowingAddEvidence = false
    @State private var isShowingImport = false
    @State private var searchText = ""
    @State private var isShowingAnalysis = false
    @State private var selectedAnalysis: EvidenceAnalysis? = nil
    
    var body: some View {
        VStack(spacing: 0) {
            // Header controls
            evidenceControls
                .padding()
                .background(Color(.systemBackground))
                .shadow(color: Color.black.opacity(0.1), radius: 2, y: 1)
            
            // Main content
            if viewModel.isLoading {
                ProgressView("Loading evidence...")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Color(.secondarySystemBackground))
            } else if viewModel.filteredEvidence.isEmpty {
                emptyStateView
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Color(.secondarySystemBackground))
            } else {
                evidenceGridView
                    .background(Color(.secondarySystemBackground))
            }
        }
        .sheet(isPresented: $isShowingFilters) {
            EvidenceFilterView(viewModel: viewModel)
        }
        .sheet(isPresented: $isShowingAddEvidence) {
            AddEvidenceView(viewModel: viewModel)
        }
        .sheet(isPresented: $isShowingImport) {
            ImportEvidenceView(viewModel: viewModel)
        }
        .sheet(item: $selectedEvidence) { evidence in
            EvidenceDetailView(evidence: evidence, viewModel: viewModel)
        }
        .sheet(item: $selectedAnalysis) { analysis in
            EvidenceAnalysisView(analysis: analysis)
        }
    }
    
    // MARK: - Evidence Controls
    
    private var evidenceControls: some View {
        VStack(spacing: 12) {
            HStack {
                Text("Evidence")
                    .font(.title)
                    .fontWeight(.bold)
                
                Spacer()
                
                Menu {
                    Button(action: { isShowingAddEvidence = true }) {
                        Label("Add Evidence Manually", systemImage: "plus")
                    }
                    
                    Button(action: { isShowingImport = true }) {
                        Label("Import Evidence", systemImage: "square.and.arrow.down")
                    }
                } label: {
                    Label("Add Evidence", systemImage: "plus")
                }
                .buttonStyle(.borderedProminent)
            }
            
            HStack {
                // Search field
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.secondary)
                    
                    TextField("Search evidence", text: $searchText)
                        .textFieldStyle(.plain)
                        .onChange(of: searchText) { _ in
                            viewModel.searchText = searchText
                            viewModel.applyFilters()
                        }
                    
                    if !searchText.isEmpty {
                        Button(action: {
                            searchText = ""
                            viewModel.searchText = ""
                            viewModel.applyFilters()
                        }) {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(.secondary)
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(8)
                .background(Color(.systemGray6))
                .cornerRadius(8)
                
                // Filter button
                Button(action: { isShowingFilters = true }) {
                    HStack {
                        Image(systemName: "line.3.horizontal.decrease.circle")
                        Text("Filters")
                        if viewModel.isFiltered {
                            Text("(\(viewModel.activeFilterCount))")
                                .foregroundColor(.blue)
                        }
                    }
                    .padding(8)
                    .background(Color(.secondarySystemBackground))
                    .cornerRadius(8)
                }
                
                Spacer()
                
                // View options
                Picker("View", selection: $viewModel.viewMode) {
                    Image(systemName: "square.grid.2x2").tag(EvidenceViewMode.grid)
                    Image(systemName: "list.bullet").tag(EvidenceViewMode.list)
                }
                .pickerStyle(.segmented)
                .frame(width: 100)
                
                // Sort options
                Menu {
                    Picker("Sort By", selection: $viewModel.sortOption) {
                        Text("Date Added").tag(EvidenceSortOption.dateAdded)
                        Text("Title").tag(EvidenceSortOption.title)
                        Text("Type").tag(EvidenceSortOption.type)
                        Text("Status").tag(EvidenceSortOption.status)
                    }
                    
                    Picker("Sort Order", selection: $viewModel.sortAscending) {
                        Text("Ascending").tag(true)
                        Text("Descending").tag(false)
                    }
                } label: {
                    Label("Sort", systemImage: "arrow.up.arrow.down")
                        .padding(8)
                        .background(Color(.secondarySystemBackground))
                        .cornerRadius(8)
                }
            }
            
            // Evidence stats
            HStack {
                Text("\(viewModel.filteredEvidence.count) of \(viewModel.evidence.count) items")
                    .foregroundColor(.secondary)
                
                Spacer()
                
                if viewModel.isAnalyzing {
                    HStack {
                        ProgressView()
                            .scaleEffect(0.7)
                        Text("Analyzing evidence...")
                            .font(.caption)
                    }
                    .padding(.trailing)
                }
                
                if viewModel.hasAnalysis {
                    Button(action: { isShowingAnalysis = true }) {
                        Label("View Analysis", systemImage: "sparkles")
                            .font(.caption)
                            .foregroundColor(.purple)
                    }
                }
            }
            .font(.caption)
            .padding(.top, 4)
        }
    }
    
    // MARK: - Evidence Grid View
    
    private var evidenceGridView: some View {
        Group {
            if viewModel.viewMode == .grid {
                ScrollView {
                    LazyVGrid(columns: [GridItem(.adaptive(minimum: 200, maximum: 300), spacing: 16)], spacing: 16) {
                        ForEach(viewModel.filteredEvidence) { evidence in
                            evidenceGridItem(evidence)
                                .onTapGesture {
                                    selectedEvidence = evidence
                                }
                        }
                    }
                    .padding()
                }
            } else {
                List {
                    ForEach(viewModel.filteredEvidence) { evidence in
                        evidenceListItem(evidence)
                            .onTapGesture {
                                selectedEvidence = evidence
                            }
                    }
                }
            }
        }
    }
    
    private func evidenceGridItem(_ evidence: Evidence) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            // Thumbnail
            ZStack {
                Rectangle()
                    .fill(Color(.systemGray6))
                    .aspectRatio(1.33, contentMode: .fit)
                
                evidenceThumbnail(for: evidence)
            }
            .cornerRadius(8)
            
            // Title
            Text(evidence.title)
                .font(.headline)
                .lineLimit(1)
            
            // Type and status
            HStack {
                Text(evidence.type.rawValue)
                    .font(.caption)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(typeColor(for: evidence.type).opacity(0.1))
                    .foregroundColor(typeColor(for: evidence.type))
                    .cornerRadius(4)
                
                Spacer()
                
                Text(evidence.status.rawValue)
                    .font(.caption)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(statusColor(for: evidence.status).opacity(0.1))
                    .foregroundColor(statusColor(for: evidence.status))
                    .cornerRadius(4)
            }
            
            // Date
            Text("Added \(dateFormatter.string(from: evidence.createdAt))")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.1), radius: 2, y: 1)
    }
    
    private func evidenceListItem(_ evidence: Evidence) -> some View {
        HStack(spacing: 16) {
            // Thumbnail
            evidenceThumbnail(for: evidence)
                .frame(width: 60, height: 60)
                .background(Color(.systemGray6))
                .cornerRadius(8)
            
            // Details
            VStack(alignment: .leading, spacing: 4) {
                Text(evidence.title)
                    .font(.headline)
                    .lineLimit(1)
                
                if let description = evidence.description {
                    Text(description)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .lineLimit(2)
                }
                
                HStack {
                    Text(evidence.type.rawValue)
                        .font(.caption)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(typeColor(for: evidence.type).opacity(0.1))
                        .foregroundColor(typeColor(for: evidence.type))
                        .cornerRadius(4)
                    
                    Text(evidence.status.rawValue)
                        .font(.caption)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(statusColor(for: evidence.status).opacity(0.1))
                        .foregroundColor(statusColor(for: evidence.status))
                        .cornerRadius(4)
                    
                    Spacer()
                    
                    Text(dateFormatter.string(from: evidence.createdAt))
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
        }
        .padding(.vertical, 8)
    }
    
    private func evidenceThumbnail(for evidence: Evidence) -> some View {
        Group {
            switch evidence.type {
            case .document:
                Image(systemName: "doc.text")
                    .resizable()
                    .scaledToFit()
                    .padding()
                    .foregroundColor(.blue)
            case .image:
                if let filePath = evidence.filePath {
                    // In a real app, this would load the actual image
                    Image(systemName: "photo")
                        .resizable()
                        .scaledToFit()
                        .padding()
                        .foregroundColor(.green)
                } else {
                    Image(systemName: "photo")
                        .resizable()
                        .scaledToFit()
                        .padding()
                        .foregroundColor(.green)
                }
            case .audio:
                Image(systemName: "waveform")
                    .resizable()
                    .scaledToFit()
                    .padding()
                    .foregroundColor(.orange)
            case .video:
                Image(systemName: "video")
                    .resizable()
                    .scaledToFit()
                    .padding()
                    .foregroundColor(.red)
            case .physical:
                Image(systemName: "cube.box")
                    .resizable()
                    .scaledToFit()
                    .padding()
                    .foregroundColor(.purple)
            case .other:
                Image(systemName: "questionmark.square")
                    .resizable()
                    .scaledToFit()
                    .padding()
                    .foregroundColor(.gray)
            }
        }
    }
    
    // MARK: - Empty State View
    
    private var emptyStateView: some View {
        VStack(spacing: 20) {
            Image(systemName: "tray")
                .resizable()
                .scaledToFit()
                .frame(width: 80, height: 80)
                .foregroundColor(.secondary)
            
            Text("No Evidence Found")
                .font(.title2)
                .fontWeight(.bold)
            
            if viewModel.isFiltered {
                Text("Try adjusting your filters or search criteria")
                    .foregroundColor(.secondary)
                
                Button("Reset Filters") {
                    viewModel.resetFilters()
                    searchText = ""
                }
                .buttonStyle(.bordered)
            } else {
                Text("Add evidence to get started")
                    .foregroundColor(.secondary)
                
                Button("Add Evidence") {
                    isShowingAddEvidence = true
                }
                .buttonStyle(.borderedProminent)
            }
        }
        .padding()
    }
    
    // MARK: - Helper Methods
    
    private func typeColor(for type: EvidenceType) -> Color {
        switch type {
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
    
    private func statusColor(for status: EvidenceStatus) -> Color {
        switch status {
        case .collected:
            return .blue
        case .processed:
            return .orange
        case .analyzed:
            return .green
        case .archived:
            return .gray
        }
    }
    
    private let dateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .none
        return formatter
    }()
}

// MARK: - Evidence View Model

/// Evidence view mode
enum EvidenceViewMode {
    case grid
    case list
}

/// Evidence sor
(Content truncated due to size limit. Use line ranges to read in chunks)