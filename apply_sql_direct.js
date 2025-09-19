#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Using anon key for testing connection...');

// Create Supabase client with anon key first to test connection
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    try {
        console.log('🔗 Testing Supabase connection...');

        // Test basic connection
        const { data, error } = await supabase
            .from('_realtime_schema_changes')
            .select('*')
            .limit(1);

        if (error) {
            console.log('Connection test result:', error.message);
        } else {
            console.log('✅ Connection successful!');
        }

        // Try to get schema info
        const { data: tables, error: schemaError } = await supabase
            .rpc('pg_get_tables');

        if (schemaError) {
            console.log('Schema query error:', schemaError.message);
        } else {
            console.log('Available RPC functions or tables:', tables);
        }

    } catch (error) {
        console.error('💥 Connection error:', error.message);
    }
}

// Test the connection first
await testConnection();

console.log(`
📋 Next Steps:
1. Go to your Supabase dashboard: ${supabaseUrl.replace('/rest/v1', '')}/project/default/sql
2. Open the SQL Editor
3. Copy and paste the content from apply_schema.sql
4. Execute the SQL manually

The schema includes:
- Complete e-commerce tables (products, orders, subscriptions)
- Honduras-specific coffee fields
- Sample coffee products
- Row Level Security policies
`);