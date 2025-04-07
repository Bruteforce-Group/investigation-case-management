'use client';

import React, { useState, useEffect } from 'react';
import { TimelineEvent } from '@prisma/client';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Filter, Calendar, Clock } from 'lucide-react';

interface TimelineControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onShiftLeft: () => void;
  onShiftRight: () => void;
  onToggleFilters: () => void;
}

const TimelineControls: React.FC<TimelineControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onShiftLeft,
  onShiftRight,
  onToggleFilters
}) => {
  return (
    <div className="flex space-x-2">
      <button 
        onClick={onToggleFilters}
        className="p-2 rounded-full hover:bg-gray-100"
        title="Toggle Filters"
      >
        <Filter size={20} />
      </button>
      <button 
        onClick={onZoomOut}
        className="p-2 rounded-full hover:bg-gray-100"
        title="Zoom Out"
      >
        <ZoomOut size={20} />
      </button>
      <button 
        onClick={onZoomIn}
        className="p-2 rounded-full hover:bg-gray-100"
        title="Zoom In"
      >
        <ZoomIn size={20} />
      </button>
      <button 
        onClick={onShiftLeft}
        className="p-2 rounded-full hover:bg-gray-100"
        title="Shift Left"
      >
        <ChevronLeft size={20} />
      </button>
      <button 
        onClick={onShiftRight}
        className="p-2 rounded-full hover:bg-gray-100"
        title="Shift Right"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

interface TimelineFiltersProps {
  importanceFilter: number;
  confidenceFilter: number;
  onImportanceChange: (value: number) => void;
  onConfidenceChange: (value: number) => void;
  onReset: () => void;
}

const TimelineFilters: React.FC<TimelineFiltersProps> = ({
  importanceFilter,
  confidenceFilter,
  onImportanceChange,
  onConfidenceChange,
  onReset
}) => {
  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-md">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Importance</label>
          <select 
            value={importanceFilter}
            onChange={(e) => onImportanceChange(Number(e.target.value))}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value={0}>All</option>
            <option value={1}>1+</option>
            <option value={2}>2+</option>
            <option value={3}>3+</option>
            <option value={4}>4+</option>
            <option value={5}>5 only</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confidence</label>
          <select 
            value={confidenceFilter}
            onChange={(e) => onConfidenceChange(Number(e.target.value))}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value={0}>All</option>
            <option value={1}>1+</option>
            <option value={2}>2+</option>
            <option value={3}>3+</option>
            <option value={4}>4+</option>
            <option value={5}>5 only</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date Range</label>
          <div className="flex items-center space-x-2 mt-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={16} className="text-gray-400" />
              </div>
              <input
                type="date"
                className="pl-10 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <span className="text-gray-500">to</span>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={16} className="text-gray-400" />
              </div>
              <input
                type="date"
                className="pl-10 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors mt-4 md:mt-0"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

interface TimelineEventDetailProps {
  event: any;
  formatDate: (date: Date) => string;
}

const TimelineEventDetail: React.FC<TimelineEventDetailProps> = ({ event, formatDate }) => {
  return (
    <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
      <h3 className="text-lg font-medium">{event.title}</h3>
      <p className="text-sm text-gray-500">
        {formatDate(new Date(event.eventDate))}
        {event.endDate && ` - ${formatDate(new Date(event.endDate))}`}
      </p>
      {event.location && (
        <p className="text-sm text-gray-700 mt-1">
          <span className="font-medium">Location:</span> {event.location}
        </p>
      )}
      <p className="text-sm mt-2">{event.description}</p>
      
      <div className="flex mt-2 space-x-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Importance: {event.importance}/5
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Confidence: {event.confidenceLevel}/5
        </span>
      </div>
      
      {event.evidence && event.evidence.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-medium">Related Evidence:</h4>
          <ul className="mt-1 text-sm text-gray-700">
            {event.evidence.map((item: any) => (
              <li key={item.id} className="flex items-center">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                {item.evidence.title}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {event.persons && event.persons.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-medium">Related Persons:</h4>
          <ul className="mt-1 text-sm text-gray-700">
            {event.persons.map((item: any) => (
              <li key={item.id} className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                {item.person.firstName} {item.person.lastName}
                {item.involvement && ` (${item.involvement})`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

interface TimelineProps {
  events: any[]; // TimelineEvent with additional relations
  caseId: string;
  onEventClick?: (event: any) => void;
  onAnalyzeTimeline?: (events: any[]) => void;
}

const TimelineVisualization: React.FC<TimelineProps> = ({ 
  events, 
  caseId,
  onEventClick,
  onAnalyzeTimeline
}) => {
  const [filteredEvents, setFilteredEvents] = useState<any[]>(events);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [filterImportance, setFilterImportance] = useState<number>(0);
  const [filterConfidence, setFilterConfidence] = useState<number>(0);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'linear' | 'calendar'>('linear');

  // Initialize timeline range based on events
  useEffect(() => {
    if (events && events.length > 0) {
      const dates = events.map(event => new Date(event.eventDate));
      const minDate = new Date(Math.min(...dates.map(date => date.getTime())));
      const maxDate = new Date(Math.max(...dates.map(date => date.getTime())));
      
      // Add buffer to start and end dates
      minDate.setDate(minDate.getDate() - 7);
      maxDate.setDate(maxDate.getDate() + 7);
      
      setStartDate(minDate);
      setEndDate(maxDate);
    }
  }, [events]);

  // Apply filters when they change
  useEffect(() => {
    if (!events) return;
    
    let filtered = [...events];
    
    // Apply importance filter
    if (filterImportance > 0) {
      filtered = filtered.filter(event => event.importance >= filterImportance);
    }
    
    // Apply confidence filter
    if (filterConfidence > 0) {
      filtered = filtered.filter(event => event.confidenceLevel >= filterConfidence);
    }
    
    setFilteredEvents(filtered);
  }, [events, filterImportance, filterConfidence]);

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    if (onEventClick) {
      onEventClick(event);
    }
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
  };

  const shiftTimelineLeft = () => {
    if (!startDate || !endDate) return;
    
    const timeRange = endDate.getTime() - startDate.getTime();
    const shiftAmount = timeRange * 0.2; // Shift by 20% of visible range
    
    const newStartDate = new Date(startDate.getTime() - shiftAmount);
    const newEndDate = new Date(endDate.getTime() - shiftAmount);
    
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const shiftTimelineRight = () => {
    if (!startDate || !endDate) return;
    
    const timeRange = endDate.getTime() - startDate.getTime();
    const shiftAmount = timeRange * 0.2; // Shift by 20% of visible range
    
    const newStartDate = new Date(startDate.getTime() + shiftAmount);
    const newEndDate = new Date(endDate.getTime() + shiftAmount);
    
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const resetFilters = () => {
    setFilterImportance(0);
    setFilterConfidence(0);
  };

  const handleAnalyzeTimeline = () => {
    if (onAnalyzeTimeline) {
      onAnalyzeTimeline(filteredEvents);
    }
  };

  // Calculate position on timeline based on date
  const calculatePosition = (date: Date): number => {
    if (!startDate || !endDate) return 0;
    
    const totalTimespan = endDate.getTime() - startDate.getTime();
    const eventTimeFromStart = date.getTime() - startDate.getTime();
    
    return (eventTimeFromStart / totalTimespan) * 100;
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get color based on importance
  const getImportanceColor = (importance: number): string => {
    switch (importance) {
      case 5: return 'bg-red-500';
      case 4: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 2: return 'bg-blue-500';
      case 1:
      default: return 'bg-gray-500';
    }
  };

  if (!events || events.length === 0 || !startDate || !endDate) {
    return (
      <div className="p-4 text-center">
        <p>No timeline events available.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Case Timeline</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('linear')}
              className={`px-3 py-1 rounded-md ${viewMode === 'linear' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}
            >
              Linear
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded-md ${viewMode === 'calendar' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}
            >
              Calendar
            </button>
          </div>
          <TimelineControls
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onShiftLeft={shiftTimelineLeft}
            onShiftRight={shiftTimelineRight}
            onToggleFilters={toggleFilters}
          />
        </div>
      </div>
      
      {showFilters && (
        <TimelineFilters
          importanceFilter={filterImportance}
          confidenceFilter={filterConfidence}
          onImportanceChange={setFilterImportance}
          onConfidenceChange={setFilterConfidence}
          onReset={resetFilters}
        />
      )}
      
      {viewMode === 'linear' ? (
        <div className="relative" style={{ height: `${300 * zoomLevel}px` }}>
          {/* Timeline axis */}
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-300"></div>
          
          {/* Date markers */}
          <div className="absolute left-0 bottom-0 text-xs text-gray-500">
            {startDate.toLocaleDateString()}
          </div>
          <div className="absolute right-0 bottom-0 text-xs text-gray-500">
            {endDate.toLocaleDateString()}
          </div>
          
          {/* Timeline events */}
          {filteredEvents.map((event) => {
            const position = calculatePosition(new Date(event.eventDate));
            const isSelected = selectedEvent && selectedEvent.id === event.id;
            
            return (
              <div 
                key={event.id}
                className={`absolute transform -translate-x-1/2 cursor-pointer transition-all duration-200 ${
                  isSelected ? 'z-10 scale-110' : 'z-0 hover:scale-105'
                }`}
                style={{ 
                  left: `${position}%`,
                  top: '50%',
                }}
                onClick={() => handleEventClick(event)}
              >
                <div 
                  className={`w-4 h-4 rounded-full ${getImportanceColor(event.importance)} mb-1 mx-auto`}
                  title={`Importance: ${event.importance}, Confidence: ${event.confidenceLevel}`}
                ></div>
                <div className={`text-xs font-medium ${isSelected ? 'text-indigo-700' : 'text-gray-700'}`}>
                  {event.title}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(new Date(event.eventDate))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-2">
          {filteredEvents.map((event) => (
            <div 
              key={event.id}
              className={`p-3 border rounded-md cursor-pointer transition-all duration-200 ${
                selectedEvent && selectedEvent.id === event.id 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
              }`}
              onClick={() => handleEventClick(event)}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">{event.title}</h3>
                <div className={`w-3 h-3 rounded-full ${getImportanceColor(event.importance)}`}></div>
              </div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Clock size={12} className="mr-1" />
                {formatDate(new Date(event.eventDate))}
              </div>
              {event.location && (
                <div className="text-xs text-gray-600 mt-1">
                  Location: {event.location}
                </div>
              )}
              <p className="text-xs mt-2 line-clamp-2">{event.description}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Selected event details */}
      {selectedEvent && (
        <TimelineEventDetail event={selectedEvent} formatDate={formatDate} />
      )}

      {/* Analysis button */}
      {onAnalyzeTimeline && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAnalyzeTimeline}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Analyze Timeline
          </button>
        </div>
      )}
    </div>
  );
};

export default TimelineVisualization;
