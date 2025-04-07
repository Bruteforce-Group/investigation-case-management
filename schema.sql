-- Investigation Case Management Application Database Schema
-- PostgreSQL with pgvector extension

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- Cases table
CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Open', 'Closed', 'Pending', 'Archived')),
    priority VARCHAR(50) NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    assigned_to UUID,
    case_number VARCHAR(50) UNIQUE,
    classification VARCHAR(100),
    location VARCHAR(255),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    tags TEXT[]
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Administrator', 'Investigator', 'Analyst', 'Viewer')),
    department VARCHAR(100),
    badge_number VARCHAR(50),
    contact_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Case access table
CREATE TABLE case_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    access_level VARCHAR(50) NOT NULL CHECK (access_level IN ('Read', 'Write', 'Admin')),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    granted_by UUID REFERENCES users(id),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE (case_id, user_id)
);

-- Persons table
CREATE TABLE persons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Suspect', 'Witness', 'Victim', 'Investigator', 'Other')),
    contact_info JSONB,
    description TEXT,
    date_of_birth DATE,
    identification VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    vector_embedding vector(1536)
);

-- Evidence table
CREATE TABLE evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Document', 'Image', 'Audio', 'Video', 'Physical', 'Other')),
    file_path VARCHAR(1024),
    file_hash VARCHAR(255),
    file_size BIGINT,
    mime_type VARCHAR(100),
    original_filename VARCHAR(255),
    custody_chain JSONB,
    collection_date TIMESTAMP WITH TIME ZONE,
    collection_location VARCHAR(255),
    collected_by UUID REFERENCES users(id),
    status VARCHAR(50) NOT NULL CHECK (status IN ('Collected', 'Processed', 'Analyzed', 'Archived')),
    tags TEXT[],
    ocr_text TEXT,
    transcription TEXT,
    vector_embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Timeline events table
CREATE TABLE timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(100),
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    event_end_date TIMESTAMP WITH TIME ZONE,
    location VARCHAR(255),
    persons_involved UUID[],
    evidence_linked UUID[],
    importance VARCHAR(50) CHECK (importance IN ('Low', 'Medium', 'High', 'Critical')),
    confidence FLOAT CHECK (confidence >= 0 AND confidence <= 1),
    source VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    is_ai_generated BOOLEAN DEFAULT FALSE,
    vector_embedding vector(1536)
);

-- Notes table
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    category VARCHAR(100),
    tags TEXT[],
    related_evidence UUID[],
    related_persons UUID[],
    related_events UUID[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    vector_embedding vector(1536)
);

-- AI analysis table
CREATE TABLE ai_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    analysis_type VARCHAR(50) NOT NULL CHECK (analysis_type IN ('Timeline', 'Relationships', 'Evidence', 'Summary', 'Recommendation')),
    content TEXT NOT NULL,
    confidence_score FLOAT CHECK (confidence_score >= 0 AND confidence_score <= 1),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    prompt_used TEXT,
    model_version VARCHAR(100),
    related_evidence UUID[],
    related_persons UUID[],
    related_events UUID[],
    vector_embedding vector(1536)
);

-- Search queries table
CREATE TABLE search_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    case_id UUID REFERENCES cases(id),
    query_text TEXT NOT NULL,
    query_vector vector(1536),
    results_count INTEGER,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    execution_time_ms INTEGER,
    filters_applied JSONB
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance optimization
CREATE INDEX idx_cases_case_number ON cases(case_number);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_created_at ON cases(created_at);
CREATE INDEX idx_cases_assigned_to ON cases(assigned_to);

CREATE INDEX idx_persons_case_id ON persons(case_id);
CREATE INDEX idx_persons_role ON persons(role);
CREATE INDEX idx_persons_name ON persons(name);

CREATE INDEX idx_evidence_case_id ON evidence(case_id);
CREATE INDEX idx_evidence_type ON evidence(type);
CREATE INDEX idx_evidence_status ON evidence(status);
CREATE INDEX idx_evidence_collection_date ON evidence(collection_date);

CREATE INDEX idx_timeline_events_case_id ON timeline_events(case_id);
CREATE INDEX idx_timeline_events_event_date ON timeline_events(event_date);
CREATE INDEX idx_timeline_events_event_type ON timeline_events(event_type);
CREATE INDEX idx_timeline_events_importance ON timeline_events(importance);

CREATE INDEX idx_notes_case_id ON notes(case_id);
CREATE INDEX idx_notes_created_at ON notes(created_at);
CREATE INDEX idx_notes_category ON notes(category);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_case_access_case_id ON case_access(case_id);
CREATE INDEX idx_case_access_user_id ON case_access(user_id);
CREATE INDEX idx_case_access_access_level ON case_access(access_level);

CREATE INDEX idx_ai_analysis_case_id ON ai_analysis(case_id);
CREATE INDEX idx_ai_analysis_analysis_type ON ai_analysis(analysis_type);
CREATE INDEX idx_ai_analysis_generated_at ON ai_analysis(generated_at);

CREATE INDEX idx_search_queries_user_id ON search_queries(user_id);
CREATE INDEX idx_search_queries_case_id ON search_queries(case_id);
CREATE INDEX idx_search_queries_executed_at ON search_queries(executed_at);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Create vector indexes for similarity search
CREATE INDEX idx_persons_vector ON persons USING ivfflat (vector_embedding vector_l2_ops) WITH (lists = 100);
CREATE INDEX idx_evidence_vector ON evidence USING ivfflat (vector_embedding vector_l2_ops) WITH (lists = 100);
CREATE INDEX idx_timeline_events_vector ON timeline_events USING ivfflat (vector_embedding vector_l2_ops) WITH (lists = 100);
CREATE INDEX idx_notes_vector ON notes USING ivfflat (vector_embedding vector_l2_ops) WITH (lists = 100);
CREATE INDEX idx_ai_analysis_vector ON ai_analysis USING ivfflat (vector_embedding vector_l2_ops) WITH (lists = 100);
CREATE INDEX idx_search_queries_vector ON search_queries USING ivfflat (query_vector vector_l2_ops) WITH (lists = 100);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_cases_updated_at
BEFORE UPDATE ON cases
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_persons_updated_at
BEFORE UPDATE ON persons
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evidence_updated_at
BEFORE UPDATE ON evidence
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timeline_events_updated_at
BEFORE UPDATE ON timeline_events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at
BEFORE UPDATE ON notes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create function for audit logging
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
DECLARE
    action_type VARCHAR(50);
    user_id_val UUID;
BEGIN
    -- Determine action type
    IF TG_OP = 'INSERT' THEN
        action_type := 'Create';
    ELSIF TG_OP = 'UPDATE' THEN
        action_type := 'Update';
    ELSIF TG_OP = 'DELETE' THEN
        action_type := 'Delete';
    END IF;
    
    -- Get current user ID (in a real app, this would come from session context)
    -- For this example, we'll use NULL or the created_by/updated_by if available
    IF TG_OP = 'INSERT' AND NEW.created_by IS NOT NULL THEN
        user_id_val := NEW.created_by;
    ELSIF TG_OP = 'UPDATE' AND NEW.updated_by IS NOT NULL THEN
        user_id_val := NEW.updated_by;
    ELSE
        user_id_val := NULL; -- Would be replaced with actual session user in real app
    END IF;
    
    -- Insert audit log
    INSERT INTO audit_logs (
        user_id,
        action,
        entity_type,
        entity_id,
        details,
        ip_address,
        user_agent
    ) VALUES (
        user_id_val,
        action_type,
        TG_TABLE_NAME,
        CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.id
            ELSE NEW.id
        END,
        CASE
            WHEN TG_OP = 'INSERT' THEN jsonb_build_object('new', row_to_json(NEW))
            WHEN TG_OP = 'UPDATE' THEN jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW))
            WHEN TG_OP = 'DELETE' THEN jsonb_build_object('old', row_to_json(OLD))
        END,
        NULL, -- Would be client IP in real app
        NULL  -- Would be user agent in real app
    );
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers for main tables
CREATE TRIGGER audit_cases
AFTER INSERT OR UPDATE OR DELETE ON cases
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_persons
AFTER INSERT OR UPDATE OR DELETE ON persons
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_evidence
AFTER INSERT OR UPDATE OR DELETE ON evidence
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_timeline_events
AFTER INSERT OR UPDATE OR DELETE ON timeline_events
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_notes
AFTER INSERT OR UPDATE OR DELETE ON notes
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_ai_analysis
AFTER INSERT OR UPDATE OR DELETE ON ai_analysis
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- Create function for generating case numbers
CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS TRIGGER AS $$
DECLARE
    year_prefix TEXT;
    sequence_number INT;
    new_case_number TEXT;
BEGIN
    -- Get current year
    year_prefix := to_char(CURRENT_DATE, 'YYYY');
    
    -- Get next sequence number for this year
    SELECT COALESCE(MAX(SUBSTRING(case_number FROM position('-' IN case_number) + 1)::INTEGER), 0) + 1
    INTO sequence_number
    FROM cases
    WHERE case_number LIKE year_prefix || '-%';
    
    -- Generate new case number
    new_case_number := year_prefix || '-' || LPAD(sequence_number::TEXT, 6, '0');
    
    -- Set the case number
    NEW.case_number := new_case_number;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic case number generation
CREATE TRIGGER generate_case_number_trigger
BEFORE INSERT ON cases
FOR EACH ROW
WHEN (NEW.case_number IS NULL)
EXECUTE FUNCTION generate_case_number();

-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION search_similar_items(
    search_table TEXT,
    search_column TEXT,
    query_vector vector,
    max_results INT DEFAULT 10,
    similarity_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (
    id UUID,
    similarity FLOAT
) AS $$
DECLARE
    query TEXT;
BEGIN
    query := format('
        SELECT id, 1 - (vector_embedding <-> %L) AS similarity
        FROM %I
        WHERE vector_embedding IS NOT NULL
        AND 1 - (vector_embedding <-> %L) > %L
        ORDER BY similarity DESC
        LIMIT %L
    ', query_vector, search_table, query_vector, similarity_threshold, max_results);
    
    RETURN QUERY EXECUTE query;
END;
$$ LANGUAGE plpgsql;

-- Create view for case summary
CREATE OR REPLACE VIEW case_summary AS
SELECT 
    c.id,
    c.title,
    c.case_number,
    c.status,
    c.priority,
    c.created_at,
    c.updated_at,
    u.full_name AS assigned_to_name,
    (SELECT COUNT(*) FROM evidence WHERE case_id = c.id) AS evidence_count,
    (SELECT COUNT(*) FROM persons WHERE case_id = c.id) AS persons_count,
    (SELECT COUNT(*) FROM timeline_events WHERE case_id = c.id) AS events_count,
    (SELECT COUNT(*) FROM notes WHERE case_id = c.id) AS notes_count,
    (SELECT COUNT(*) FROM ai_analysis WHERE case_id = c.id) AS analysis_count
FROM 
    cases c
LEFT JOIN 
    users u ON c.assigned_to = u.id;

-- Create view for evidence summary
CREATE OR REPLACE VIEW evidence_summary AS
SELECT 
    e.id,
    e.title,
    e.type,
    e.status,
    e.case_id,
    c.case_number,
    c.title AS case_title,
    e.collection_date,
    e.created_at,
    u.full_name AS collected_by_name,
    e.file_size,
    e.mime_type,
    (e.ocr_text IS NOT NULL) AS has_ocr,
    (e.transcription IS NOT NULL) AS has_transcription,
    (e.vector_embedding IS NOT NULL) AS has_embedding
FROM 
    evidence e
JOIN 
    cases c ON e.case_id = c.id
LEFT JOIN 
    users u ON e.collected_by = u.id;

-- Create view for timeline summary
CREATE OR REPLACE VIEW timeline_summary AS
SELECT 
    t.id,
    t.title,
    t.event_type,
    t.event_date,
    t.importance,
    t.confidence,
    t.case_id,
    c.case_number,
    c.title AS case_title,
    t.is_ai_generated,
    array_length(t.persons_involved, 1) AS persons_count,
    array_length(t.evidence_linked, 1) AS evidence_count
FROM 
    timeline_events t
JOIN 
    cases c ON t.case_id = c.id;

-- Create view for person summary
CREATE OR REPLACE VIEW person_summary AS
SELECT 
    p.id,
    p.name,
    p.role,
    p.date_of_birth,
    p.case_id,
    c.case_number,
    c.title AS case_title,
    (SELECT COUNT(*) FROM timeline_events 
     WHERE case_id = p.case_id AND p.id = ANY(persons_involved)) AS events_count,
    (p.vector_embedding IS NOT NULL) AS has_embedding
FROM 
    persons p
JOIN 
    cases c ON p.case_id = c.id;

-- Create view for user activity
CREATE OR REPLACE VIEW user_activity AS
SELECT 
    u.id,
    u.username,
    u.full_name,
    u.role,
    u.last_login,
    (SELECT COUNT(*) FROM cases WHERE assigned_to = u.id) AS assigned_cases_count,
    (SELECT COUNT(*) FROM audit_logs WHERE user_id = u.id AND timestamp > CURRENT_TIMESTAMP - INTERVAL '30 days') AS recent_actions_count,
    (SELECT MAX(timestamp) FROM audit_logs WHERE user_id = u.id) AS last_action_time
FROM 
    users u;

-- Create function to get case timeline
CREATE OR REPLACE FUNCTION get_case_timeline(case_id_param UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    event_type TEXT,
    event_date TIMESTAMP WITH TIME ZONE,
    event_end_date TIMESTAMP WITH TIME ZONE,
    importance TEXT,
    confidence FLOAT,
    is_ai_generated BOOLEAN,
    persons TEXT[],
    evidence TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.title,
        t.event_type,
        t.event_date,
        t.event_end_date,
        t.importance,
        t.confidence,
        t.is_ai_generated,
        ARRAY(
            SELECT p.name 
            FROM persons p 
            WHERE p.id = ANY(t.persons_involved)
        ) AS persons,
        ARRAY(
            SELECT e.title 
            FROM evidence e 
            WHERE e.id = ANY(t.evidence_linked)
        ) AS evidence
    FROM 
        timeline_events t
    WHERE 
        t.case_id = case_id_param
    ORDER BY 
        t.event_date;
END;
$$ LANGUAGE plpgsql;

-- Create function to get case evidence
CREATE OR REPLACE FUNCTION get_case_evidence(case_id_param UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    type TEXT,
    status TEXT,
    collection_date TIMESTAMP WITH TIME ZONE,
    file_path TEXT,
    file_size BIGINT,
    mime_type TEXT,
    has_ocr BOOLEAN,
    has_transcription BOOLEAN,
    tags TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.title,
        e.type,
        e.status,
        e.collection_date,
        e.file_path,
        e.file_size,
        e.mime_type,
        (e.ocr_text IS NOT NULL AND e.ocr_text <> '') AS has_ocr,
        (e.transcription IS NOT NULL AND e.transcription <> '') AS has_transcription,
        e.tags
    FROM 
        evidence e
    WHERE 
        e.case_id = case_id_param
    ORDER BY 
        e.collection_date DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get case persons
CREATE OR REPLACE FUNCTION get_case_persons(case_id_param UUID)
RETURNS TABLE (
    id UUID,
    name TEXT,
    role TEXT,
    date_of_birth DATE,
    events_count BIGINT,
    notes_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.role,
        p.date_of_birth,
        (SELECT COUNT(*) FROM timeline_events 
         WHERE case_id = case_id_param AND p.id = ANY(persons_involved)) AS events_count,
        (SELECT COUNT(*) FROM notes 
         WHERE case_id = case_id_param AND p.id = ANY(related_persons)) AS notes_count
    FROM 
        persons p
    WHERE 
        p.case_id = case_id_param
    ORDER BY 
        p.role, p.name;
END;
$$ LANGUAGE plpgsql;

-- Create function to search across all entities
CREATE OR REPLACE FUNCTION search_all(
    search_text TEXT,
    case_id_param UUID DEFAULT NULL
)
RETURNS TABLE (
    entity_type TEXT,
    entity_id UUID,
    title TEXT,
    snippet TEXT,
    relevance FLOAT
) AS $$
DECLARE
    search_tokens TEXT[];
    search_pattern TEXT;
BEGIN
    -- Tokenize search text
    search_tokens := regexp_split_to_array(lower(search_text), '\s+');
    
    -- Create pattern for text search
    search_pattern := '%' || array_to_string(search_tokens, '%') || '%';
    
    -- Search in cases
    RETURN QUERY
    SELECT 
        'Case'::TEXT AS entity_type,
        c.id AS entity_id,
        c.title,
        COALESCE(c.description, '')::TEXT AS snippet,
        1.0::FLOAT AS relevance
    FROM 
        cases c
    WHERE 
        (case_id_param IS NULL OR c.id = case_id_param) AND
        (lower(c.title) LIKE search_pattern OR 
         lower(COALESCE(c.description, '')) LIKE search_pattern OR
         EXISTS (SELECT 1 FROM unnest(c.tags) tag WHERE lower(tag) LIKE ANY(search_tokens)))
    
    UNION ALL
    
    -- Search in evidence
    SELECT 
        'Evidence'::TEXT AS entity_type,
        e.id AS entity_id,
        e.title,
        COALESCE(e.description, '')::TEXT AS snippet,
        1.0::FLOAT AS relevance
    FROM 
        evidence e
    WHERE 
        (case_id_param IS NULL OR e.case_id = case_id_param) AND
        (lower(e.title) LIKE search_pattern OR 
         lower(COALESCE(e.description, '')) LIKE search_pattern OR
         lower(COALESCE(e.ocr_text, '')) LIKE search_pattern OR
         lower(COALESCE(e.transcription, '')) LIKE search_pattern OR
         EXISTS (SELECT 1 FROM unnest(e.tags) tag WHERE lower(tag) LIKE ANY(search_tokens)))
    
    UNION ALL
    
    -- Search in persons
    SELECT 
        'Person'::TEXT AS entity_type,
        p.id AS entity_id,
        p.name AS title,
        COALESCE(p.description, '')::TEXT AS snippet,
        1.0::FLOAT AS relevance
    FROM 
        persons p
    WHERE 
        (case_id_param IS NULL OR p.case_id = case_id_param) AND
        (lower(p.name) LIKE search_pattern OR 
         lower(COALESCE(p.description, '')) LIKE search_pattern OR
         lower(COALESCE(p.notes, '')) LIKE search_pattern)
    
    UNION ALL
    
    -- Search in timeline events
    SELECT 
        'Event'::TEXT AS entity_type,
        t.id AS entity_id,
        t.title,
        COALESCE(t.description, '')::TEXT AS snippet,
        1.0::FLOAT AS relevance
    FROM 
        timeline_events t
    WHERE 
        (case_id_param IS NULL OR t.case_id = case_id_param) AND
        (lower(t.title) LIKE search_pattern OR 
         lower(COALESCE(t.description, '')) LIKE search_pattern OR
         lower(COALESCE(t.notes, '')) LIKE search_pattern)
    
    UNION ALL
    
    -- Search in notes
    SELECT 
        'Note'::TEXT AS entity_type,
        n.id AS entity_id,
        n.title,
        COALESCE(n.content, '')::TEXT AS snippet,
        1.0::FLOAT AS relevance
    FROM 
        notes n
    WHERE 
        (case_id_param IS NULL OR n.case_id = case_id_param) AND
        (lower(n.title) LIKE search_pattern OR 
         lower(COALESCE(n.content, '')) LIKE search_pattern OR
         EXISTS (SELECT 1 FROM unnest(n.tags) tag WHERE lower(tag) LIKE ANY(search_tokens)))
    
    UNION ALL
    
    -- Search in AI analysis
    SELECT 
        'Analysis'::TEXT AS entity_type,
        a.id AS entity_id,
        a.analysis_type AS title,
        COALESCE(a.content, '')::TEXT AS snippet,
        1.0::FLOAT AS relevance
    FROM 
        ai_analysis a
    WHERE 
        (case_id_param IS NULL OR a.case_id = case_id_param) AND
        (lower(a.analysis_type) LIKE search_pattern OR 
         lower(COALESCE(a.content, '')) LIKE search_pattern);
END;
$$ LANGUAGE plpgsql;
