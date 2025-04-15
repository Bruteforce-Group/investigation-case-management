-- PostgreSQL with pgvector initialization script for Case Management System
-- This script creates the database schema and enables the pgvector extension

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'investigator',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create cases table
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(100) NOT NULL,
  priority VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  tags TEXT[],
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create evidence table
CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(100) NOT NULL,
  file_type VARCHAR(100),
  file_path VARCHAR(255),
  file_size BIGINT,
  date_time TIMESTAMP WITH TIME ZONE,
  location JSONB,
  metadata JSONB,
  embedding VECTOR(1536), -- Vector dimension for embeddings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create timeline_events table
CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  evidence_id UUID REFERENCES evidence(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  importance INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create analysis table
CREATE TABLE IF NOT EXISTS analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  content JSONB NOT NULL,
  related_evidence_ids UUID[],
  confidence FLOAT,
  provider VARCHAR(50),
  embedding VECTOR(1536), -- Vector dimension for embeddings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  file_path VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create llm_settings table for API key management
CREATE TABLE IF NOT EXISTS llm_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider VARCHAR(50) NOT NULL,
  api_key VARCHAR(255),
  model VARCHAR(100),
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_evidence_case_id ON evidence(case_id);
CREATE INDEX IF NOT EXISTS idx_timeline_events_case_id ON timeline_events(case_id);
CREATE INDEX IF NOT EXISTS idx_timeline_events_date_time ON timeline_events(date_time);
CREATE INDEX IF NOT EXISTS idx_analysis_case_id ON analysis(case_id);
CREATE INDEX IF NOT EXISTS idx_analysis_type ON analysis(type);
CREATE INDEX IF NOT EXISTS idx_reports_case_id ON reports(case_id);

-- Create vector indexes for similarity search
CREATE INDEX IF NOT EXISTS idx_evidence_embedding ON evidence USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_analysis_embedding ON analysis USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@example.com', '$2a$10$eCQYeWhqZRsGxnGR.9SV6.RYpQJ2H4hTVJyxlwAKFt5ZSJVYrkEWO', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert default LLM settings
INSERT INTO llm_settings (provider, model, is_active)
VALUES 
  ('local', 'llama2', true),
  ('openai', 'gpt-3.5-turbo', false),
  ('anthropic', 'claude-2', false)
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_evidence_updated_at BEFORE UPDATE ON evidence FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_timeline_events_updated_at BEFORE UPDATE ON timeline_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_analysis_updated_at BEFORE UPDATE ON analysis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_llm_settings_updated_at BEFORE UPDATE ON llm_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
