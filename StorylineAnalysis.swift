// StorylineAnalysis.swift
// Dynamic storyline analysis module for Investigation Case Management Application

import SwiftUI
import Charts

/// Storyline analysis view
struct StorylineAnalysisView: View {
    @ObservedObject var viewModel: StorylineViewModel
    @State private var selectedScenario: Scenario? = nil
    @State private var selectedElement: String? = nil
    @State private var isShowingAnalysisSettings = false
    
    var body: some View {
        VStack(spacing: 0) {
            // Header controls
            storylineControls
                .padding()
                .background(Color(.systemBackground))
                .shadow(color: Color.black.opacity(0.1), radius: 2, y: 1)
            
            // Main content
            if viewModel.isLoading {
                ProgressView("Analyzing case data...")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Color(.secondarySystemBackground))
            } else if viewModel.isGenerating {
                generatingView
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Color(.secondarySystemBackground))
            } else if viewModel.hasAnalysis {
                ScrollView {
                    VStack(spacing: 24) {
                        // Main narrative
                        mainNarrativeView
                        
                        // Alternative scenarios
                        alternativeScenariosView
                        
                        // Key elements
                        keyElementsView
                        
                        // Relationship network
                        relationshipNetworkView
                        
                        // Timeline inconsistencies
                        timelineInconsistenciesView
                    }
                    .padding()
                }
                .background(Color(.secondarySystemBackground))
            } else {
                emptyStateView
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Color(.secondarySystemBackground))
            }
        }
        .sheet(isPresented: $isShowingAnalysisSettings) {
            AnalysisSettingsView(viewModel: viewModel)
        }
        .sheet(item: $selectedScenario) { scenario in
            ScenarioDetailView(scenario: scenario)
        }
    }
    
    // MARK: - Storyline Controls
    
    private var storylineControls: some View {
        VStack(spacing: 12) {
            HStack {
                Text("Storyline Analysis")
                    .font(.title)
                    .fontWeight(.bold)
                
                Spacer()
                
                Button(action: { viewModel.generateStorylineAnalysis() }) {
                    Label(viewModel.hasAnalysis ? "Regenerate" : "Generate Analysis", systemImage: "sparkles")
                }
                .buttonStyle(.borderedProminent)
                .disabled(viewModel.isGenerating || viewModel.isLoading)
            }
            
            HStack {
                if viewModel.hasAnalysis {
                    Text("Last updated: \(dateTimeFormatter.string(from: viewModel.lastUpdated))")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                if viewModel.hasAnalysis {
                    Button(action: { isShowingAnalysisSettings = true }) {
                        Label("Settings", systemImage: "gear")
                            .padding(8)
                            .background(Color(.secondarySystemBackground))
                            .cornerRadius(8)
                    }
                }
            }
            
            if viewModel.isGenerating {
                ProgressView(value: viewModel.generationProgress, total: 1.0)
                    .progressViewStyle(.linear)
                    .padding(.top, 4)
            }
        }
    }
    
    // MARK: - Main Narrative View
    
    private var mainNarrativeView: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Main Narrative")
                    .font(.title2)
                    .fontWeight(.bold)
                
                Spacer()
                
                Text("Confidence: \(Int(viewModel.mainNarrativeConfidence * 100))%")
                    .font(.caption)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(confidenceColor(viewModel.mainNarrativeConfidence).opacity(0.1))
                    .foregroundColor(confidenceColor(viewModel.mainNarrativeConfidence))
                    .cornerRadius(8)
            }
            
            Text(viewModel.mainNarrative)
                .lineSpacing(6)
            
            if !viewModel.keyDecisionPoints.isEmpty {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Key Decision Points")
                        .font(.headline)
                    
                    ForEach(viewModel.keyDecisionPoints, id: \.self) { point in
                        HStack(alignment: .top) {
                            Image(systemName: "arrow.up.right.circle.fill")
                                .foregroundColor(.blue)
                                .padding(.top, 2)
                            
                            Text(point)
                        }
                    }
                }
                .padding()
                .background(Color.blue.opacity(0.05))
                .cornerRadius(8)
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.1), radius: 2, y: 1)
    }
    
    // MARK: - Alternative Scenarios View
    
    private var alternativeScenariosView: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Alternative Scenarios")
                .font(.title2)
                .fontWeight(.bold)
            
            ForEach(viewModel.alternativeScenarios) { scenario in
                Button(action: { selectedScenario = scenario }) {
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Text(scenario.title)
                                .font(.headline)
                                .foregroundColor(.primary)
                            
                            Spacer()
                            
                            Text("Confidence: \(Int(scenario.confidenceLevel * 100))%")
                                .font(.caption)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(confidenceColor(scenario.confidenceLevel).opacity(0.1))
                                .foregroundColor(confidenceColor(scenario.confidenceLevel))
                                .cornerRadius(8)
                        }
                        
                        Text(scenario.description)
                            .lineLimit(3)
                            .foregroundColor(.secondary)
                        
                        HStack {
                            Spacer()
                            
                            Text("Tap for details")
                                .font(.caption)
                                .foregroundColor(.blue)
                        }
                    }
                    .padding()
                    .background(Color(.systemBackground))
                    .cornerRadius(8)
                }
                .buttonStyle(.plain)
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.1), radius: 2, y: 1)
    }
    
    // MARK: - Key Elements View
    
    private var keyElementsView: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Key Elements")
                .font(.title2)
                .fontWeight(.bold)
            
            HStack(alignment: .top, spacing: 16) {
                // Unexplained elements
                VStack(alignment: .leading, spacing: 8) {
                    Text("Unexplained Elements")
                        .font(.headline)
                    
                    ForEach(viewModel.unexplainedElements, id: \.self) { element in
                        HStack(alignment: .top) {
                            Image(systemName: "questionmark.circle.fill")
                                .foregroundColor(.orange)
                                .padding(.top, 2)
                            
                            Text(element)
                                .fixedSize(horizontal: false, vertical: true)
                        }
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                
                // Person motivations
                VStack(alignment: .leading, spacing: 8) {
                    Text("Person Motivations")
                        .font(.headline)
                    
                    ForEach(viewModel.personMotivations, id: \.self) { motivation in
                        HStack(alignment: .top) {
                            Image(systemName: "person.fill.questionmark")
                                .foregroundColor(.purple)
                                .padding(.top, 2)
                            
                            Text(motivation)
                                .fixedSize(horizontal: false, vertical: true)
                        }
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            
            // Causal relationships
            VStack(alignment: .leading, spacing: 8) {
                Text("Causal Relationships")
                    .font(.headline)
                
                ForEach(viewModel.causalRelationships, id: \.self) { relationship in
                    HStack(alignment: .top) {
                        Image(systemName: "arrow.right.circle.fill")
                            .foregroundColor(.green)
                            .padding(.top, 2)
                        
                        Text(relationship)
                    }
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.1), radius: 2, y: 1)
    }
    
    // MARK: - Relationship Network View
    
    private var relationshipNetworkView: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Relationship Network")
                .font(.title2)
                .fontWeight(.bold)
            
            // Network visualization
            ZStack {
                // Background
                Color(.systemGray6)
                    .cornerRadius(8)
                
                // Network nodes and edges
                relationshipNetworkGraph
                    .padding()
            }
            .frame(height: 300)
            
            // Key relationships
            VStack(alignment: .leading, spacing: 8) {
                Text("Key Relationships")
                    .font(.headline)
                
                ForEach(viewModel.keyRelationships, id: \.self) { relationship in
                    HStack(alignment: .top) {
                        Image(systemName: "link.circle.fill")
                            .foregroundColor(.blue)
                            .padding(.top, 2)
                        
                        Text(relationship)
                    }
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.1), radius: 2, y: 1)
    }
    
    private var relationshipNetworkGraph: some View {
        GeometryReader { geometry in
            ZStack {
                // Edges
                ForEach(viewModel.relationshipEdges, id: \.id) { edge in
                    if let sourceNode = viewModel.relationshipNodes.first(where: { $0.id == edge.source }),
                       let targetNode = viewModel.relationshipNodes.first(where: { $0.id == edge.target }) {
                        Path { path in
                            let sourcePoint = CGPoint(
                                x: sourceNode.x * geometry.size.width,
                                y: sourceNode.y * geometry.size.height
                            )
                            let targetPoint = CGPoint(
                                x: targetNode.x * geometry.size.width,
                                y: targetNode.y * geometry.size.height
                            )
                            
                            path.move(to: sourcePoint)
                            path.addLine(to: targetPoint)
                        }
                        .stroke(
                            edge.type == "strong" ? Color.blue : Color.gray,
                            style: StrokeStyle(
                                lineWidth: edge.type == "strong" ? 2 : 1,
                                dash: edge.type == "inferred" ? [4] : []
                            )
                        )
                    }
                }
                
                // Nodes
                ForEach(viewModel.relationshipNodes, id: \.id) { node in
                    ZStack {
                        Circle()
                            .fill(nodeColor(for: node.type))
                            .frame(width: node.size, height: node.size)
                        
                        Text(node.label)
                            .font(.caption2)
                            .lineLimit(1)
                            .fixedSize()
                    }
                    .position(
                        x: node.x * geometry.size.width,
                        y: node.y * geometry.size.height
                    )
                    .onTapGesture {
                        selectedElement = node.id
                    }
                }
            }
        }
    }
    
    // MARK: - Timeline Inconsistencies View
    
    private var timelineInconsistenciesView: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Timeline Analysis")
                .font(.title2)
                .fontWeight(.bold)
            
            if viewModel.timelineInconsistencies.isEmpty {
                HStack {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.green)
                    
                    Text("No significant inconsistencies detected in the timeline")
                        .foregroundColor(.green)
                }
                .padding()
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color.green.opacity(0.1))
                .cornerRadius(8)
            } else {
                ForEach(viewModel.timelineInconsistencies, id: \.self) { inconsistency in
                    VStack(alignment: .leading, spacing: 8) {
                        Text(inconsistency.title)
                            .font(.headline)
                        
                        Text(inconsistency.description)
                            .foregroundColor(.secondary)
                        
                        HStack {
                            Text("Confidence:")
                                .foregroundColor(.secondary)
                         
(Content truncated due to size limit. Use line ranges to read in chunks)