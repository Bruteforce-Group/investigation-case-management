// TimelineVisualization.swift
// Timeline visualization component for Investigation Case Management Application

import SwiftUI
import Charts

/// Timeline visualization component
struct TimelineVisualization: View {
    @ObservedObject var viewModel: TimelineViewModel
    @State private var selectedEvent: TimelineEvent? = nil
    @State private var zoomLevel: Double = 1.0
    @State private var isShowingFilters = false
    @State private var isShowingEventDetails = false
    @State private var isShowingAddEvent = false
    @State private var hoveredEvent: TimelineEvent? = nil
    
    // Layout constants
    private let timelineHeight: CGFloat = 600
    private let eventHeight: CGFloat = 80
    private let eventSpacing: CGFloat = 10
    private let timelineWidth: CGFloat = 800
    
    var body: some View {
        VStack(spacing: 0) {
            // Header controls
            timelineControls
                .padding()
                .background(Color(.systemBackground))
                .shadow(color: Color.black.opacity(0.1), radius: 2, y: 1)
            
            // Main timeline view
            ScrollView([.horizontal, .vertical]) {
                ZStack {
                    // Background grid
                    timelineGrid
                    
                    // Timeline events
                    timelineEventsView
                    
                    // Connection lines between related events
                    connectionLinesView
                }
                .frame(minWidth: timelineWidth * zoomLevel, minHeight: timelineHeight * zoomLevel)
                .padding()
            }
            .background(Color(.secondarySystemBackground))
        }
        .sheet(isPresented: $isShowingFilters) {
            TimelineFilterView(viewModel: viewModel)
        }
        .sheet(isPresented: $isShowingAddEvent) {
            AddTimelineEventView(viewModel: viewModel)
        }
        .sheet(item: $selectedEvent) { event in
            TimelineEventDetailView(event: event, viewModel: viewModel)
        }
    }
    
    // MARK: - Timeline Controls
    
    private var timelineControls: some View {
        VStack(spacing: 12) {
            HStack {
                Text("Timeline")
                    .font(.title)
                    .fontWeight(.bold)
                
                Spacer()
                
                Button(action: { isShowingAddEvent = true }) {
                    Label("Add Event", systemImage: "plus")
                }
                .buttonStyle(.borderedProminent)
            }
            
            HStack {
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
                
                // View options
                Picker("View", selection: $viewModel.viewMode) {
                    Text("Chronological").tag(TimelineViewMode.chronological)
                    Text("Grouped").tag(TimelineViewMode.grouped)
                }
                .pickerStyle(.segmented)
                .frame(width: 200)
                
                Spacer()
                
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
                
                // AI analysis button
                Button(action: viewModel.analyzeTimeline) {
                    Label("Analyze", systemImage: "sparkles")
                        .padding(8)
                        .background(Color.purple.opacity(0.1))
                        .foregroundColor(.purple)
                        .cornerRadius(8)
                }
            }
            
            // Timeline date range
            if let startDate = viewModel.earliestDate, let endDate = viewModel.latestDate {
                HStack {
                    Text("Timeline Range: ")
                        .foregroundColor(.secondary)
                    
                    Text(dateFormatter.string(from: startDate))
                        .fontWeight(.medium)
                    
                    Text(" to ")
                        .foregroundColor(.secondary)
                    
                    Text(dateFormatter.string(from: endDate))
                        .fontWeight(.medium)
                    
                    Spacer()
                    
                    if viewModel.isAnalyzing {
                        ProgressView()
                            .padding(.trailing)
                    }
                    
                    if viewModel.hasAnalysis {
                        Button(action: viewModel.toggleShowAnalysis) {
                            Label(
                                viewModel.showAnalysis ? "Hide Analysis" : "Show Analysis",
                                systemImage: viewModel.showAnalysis ? "eye.slash" : "eye"
                            )
                            .foregroundColor(.purple)
                        }
                    }
                }
                .font(.caption)
                .padding(.top, 4)
            }
        }
    }
    
    // MARK: - Timeline Grid
    
    private var timelineGrid: some View {
        GeometryReader { geometry in
            VStack(spacing: 0) {
                // Time markers
                HStack(alignment: .top, spacing: 0) {
                    ForEach(viewModel.timeMarkers, id: \.self) { time in
                        VStack {
                            Text(timeFormatter.string(from: time))
                                .font(.caption)
                                .foregroundColor(.secondary)
                            
                            Rectangle()
                                .fill(Color.gray.opacity(0.3))
                                .frame(width: 1, height: timelineHeight * zoomLevel)
                        }
                        .frame(width: hourWidth)
                    }
                }
                
                // Date separators
                if viewModel.viewMode == .chronological {
                    ForEach(viewModel.dateSeparators, id: \.self) { date in
                        HStack {
                            Text(dateFormatter.string(from: date))
                                .font(.headline)
                                .padding(.vertical, 8)
                            
                            Spacer()
                        }
                        .padding(.horizontal)
                        .background(Color(.systemBackground))
                        .frame(maxWidth: .infinity)
                    }
                }
            }
        }
    }
    
    // MARK: - Timeline Events
    
    private var timelineEventsView: some View {
        ZStack {
            ForEach(viewModel.filteredEvents) { event in
                timelineEventView(event)
                    .position(eventPosition(for: event))
                    .onTapGesture {
                        selectedEvent = event
                    }
                    .onHover { isHovered in
                        hoveredEvent = isHovered ? event : nil
                    }
            }
            
            // AI-suggested events (if analysis is shown)
            if viewModel.showAnalysis {
                ForEach(viewModel.suggestedEvents) { event in
                    suggestedEventView(event)
                        .position(eventPosition(for: event))
                        .onTapGesture {
                            viewModel.addSuggestedEvent(event)
                        }
                }
            }
        }
    }
    
    private func timelineEventView(_ event: TimelineEvent) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text(timeFormatter.string(from: event.eventDate))
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Spacer()
                
                if event.isAIGenerated {
                    Image(systemName: "sparkles")
                        .foregroundColor(.purple)
                }
                
                importanceBadge(for: event)
            }
            
            Text(event.title)
                .font(.headline)
                .lineLimit(2)
            
            if let description = event.description, !description.isEmpty {
                Text(description)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .lineLimit(2)
            }
            
            if let personsInvolved = event.personsInvolved, !personsInvolved.isEmpty {
                HStack {
                    Image(systemName: "person.2")
                        .foregroundColor(.blue)
                    
                    Text("\(personsInvolved.count) persons")
                        .font(.caption)
                        .foregroundColor(.blue)
                }
            }
        }
        .padding(8)
        .frame(width: 200, height: eventHeight)
        .background(
            RoundedRectangle(cornerRadius: 8)
                .fill(Color(.systemBackground))
                .shadow(color: Color.black.opacity(0.1), radius: 2, y: 1)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(
                    selectedEvent?.id == event.id ? Color.blue : Color.clear,
                    lineWidth: 2
                )
        )
    }
    
    private func suggestedEventView(_ event: TimelineEvent) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text(timeFormatter.string(from: event.eventDate))
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Spacer()
                
                Text("Suggested")
                    .font(.caption)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(Color.purple.opacity(0.1))
                    .foregroundColor(.purple)
                    .cornerRadius(4)
            }
            
            Text(event.title)
                .font(.headline)
                .lineLimit(2)
            
            if let description = event.description, !description.isEmpty {
                Text(description)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .lineLimit(2)
            }
            
            Button("Add to Timeline") {
                viewModel.addSuggestedEvent(event)
            }
            .font(.caption)
            .buttonStyle(.borderless)
            .foregroundColor(.blue)
        }
        .padding(8)
        .frame(width: 200, height: eventHeight)
        .background(
            RoundedRectangle(cornerRadius: 8)
                .fill(Color.purple.opacity(0.05))
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(Color.purple.opacity(0.3), lineWidth: 1, dash: [4])
                )
        )
    }
    
    private func importanceBadge(for event: TimelineEvent) -> some View {
        Group {
            if let importance = event.importance {
                HStack(spacing: 4) {
                    Circle()
                        .fill(importanceColor(for: importance))
                        .frame(width: 6, height: 6)
                    
                    Text(importance.rawValue)
                        .font(.caption)
                        .foregroundColor(importanceColor(for: importance))
                }
                .padding(.horizontal, 6)
                .padding(.vertical, 2)
                .background(importanceColor(for: importance).opacity(0.1))
                .cornerRadius(4)
            }
        }
    }
    
    // MARK: - Connection Lines
    
    private var connectionLinesView: some View {
        ZStack {
            ForEach(viewModel.connections) { connection in
                if let sourceEvent = viewModel.event(with: connection.sourceId),
                   let targetEvent = viewModel.event(with: connection.targetId) {
                    connectionLine(from: sourceEvent, to: targetEvent, strength: connection.strength)
                }
            }
        }
    }
    
    private func connectionLine(from source: TimelineEvent, to target: TimelineEvent, strength: Float) -> some View {
        let sourcePoint = eventPosition(for: source)
        let targetPoint = eventPosition(for: target)
        
        return Path { path in
            path.move(to: sourcePoint)
            
            // Create a curved path
            let controlPoint1 = CGPoint(
                x: sourcePoint.x + (targetPoint.x - sourcePoint.x) / 3,
                y: sourcePoint.y
            )
            
            let controlPoint2 = CGPoint(
                x: sourcePoint.x + 2 * (targetPoint.x - sourcePoint.x) / 3,
                y: targetPoint.y
            )
            
            path.addCurve(to: targetPoint, control1: controlPoint1, control2: controlPoint2)
        }
        .stroke(
            connectionColor(strength: strength),
            style: StrokeStyle(lineWidth: CGFloat(strength) * 3, lineCap: .round, dash: [5, 5])
        )
    }
    
    // MARK: - Helper Methods
    
    private func eventPosition(for event: TimelineEvent) -> CGPoint {
        let x = xPosition(for: event.eventDate)
        let y = yPosition(for: event)
        return CGPoint(x: x, y: y)
    }
    
    private func xPosition(for date: Date) -> CGFloat {
        guard let earliestDate = viewModel.earliestDate else { return 0 }
        
        let timeInterval = date.timeIntervalSince(earliestDate)
        let hours = timeInterval / 3600
        
        return hours * hourWidth + 100 // Add offset for labels
    }
    
    private func yPosition(for event: TimelineEvent) -> CGFloat {
        if viewModel.viewMode == .chronological {
            // In chronological view, position is based on event type
            let typeIndex = viewModel.eventTypes.firstIndex(of: event.eventType ?? "") ?? 0
            return CGFloat(typeIndex) * (eventHeight + eventSpacing) + 100
        } else {
            // In grouped view, position is based on event date
            let dayIndex = Calendar.current.dateComponents([.day], from: event.eventDate).day ?? 0
            return CGFloat(dayIndex % 5) * (eventHeight + eventSpacing) + 100
        }
    }
    
    private func importanceColor(for importance: EventImportance) -> Color {
        switch importance {
        case .low:
            return .green
        case .medium:
            return .orange
        case .high:
            return .red
        case .critical:
(Content truncated due to size limit. Use line ranges to read in chunks)