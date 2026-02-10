-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create journal_embeddings table
CREATE TABLE IF NOT EXISTS journal_embeddings (
    id SERIAL PRIMARY KEY,
    journal_id INTEGER NOT NULL REFERENCES journals(id) ON DELETE CASCADE,
    embedding vector(768),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster similarity search
-- CREATE INDEX ON journal_embeddings USING hnsw (embedding vector_cosine_ops);
