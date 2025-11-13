-- Migration: Remove experience level salaries index
-- This index is no longer needed as we've removed the chart visualization
-- Run this migration if the index already exists in your database

DROP INDEX IF EXISTS idx_occupations_experience_levels;

