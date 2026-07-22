-- Add migration script here
ALTER TABLE settings ADD COLUMN custom_accent_color TEXT NOT NULL DEFAULT '';
