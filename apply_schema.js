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
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function applySchema() {
    try {
        console.log('🚀 Starting schema application...');

        // Read the SQL file
        const sqlContent = fs.readFileSync(path.join(__dirname, 'apply_schema.sql'), 'utf8');

        // Split the SQL into individual statements
        const statements = sqlContent
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.match(/^(BEGIN|COMMIT)$/i));

        console.log(`📝 Found ${statements.length} SQL statements to execute`);

        // Execute each statement
        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i] + ';';

            try {
                console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);

                const { data, error } = await supabase.rpc('exec_sql', {
                    sql: statement
                });

                if (error) {
                    console.error(`❌ Error in statement ${i + 1}:`, error.message);
                    errorCount++;
                } else {
                    successCount++;
                }
            } catch (err) {
                console.error(`💥 Exception in statement ${i + 1}:`, err.message);
                errorCount++;
            }
        }

        console.log(`\n✅ Schema application completed:`);
        console.log(`   - Successful statements: ${successCount}`);
        console.log(`   - Failed statements: ${errorCount}`);

        if (errorCount === 0) {
            console.log('\n🎉 All statements executed successfully!');
            await verifySetup();
        } else {
            console.log('\n⚠️  Some statements failed. Please check the errors above.');
        }

    } catch (error) {
        console.error('💥 Fatal error:', error.message);
        process.exit(1);
    }
}

async function verifySetup() {
    console.log('\n🔍 Verifying database setup...');

    try {
        // Check if tables exist
        const { data: tables, error: tablesError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .in('table_name', ['products', 'product_variants', 'categories', 'orders']);

        if (tablesError) {
            console.error('❌ Error checking tables:', tablesError.message);
            return;
        }

        console.log('✅ Tables found:', tables.map(t => t.table_name).join(', '));

        // Check if products exist
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('name, origin_farm')
            .limit(5);

        if (productsError) {
            console.error('❌ Error fetching products:', productsError.message);
            return;
        }

        console.log('✅ Sample products:', products.map(p => `${p.name} (${p.origin_farm})`).join(', '));

        // Check if variants exist
        const { data: variants, error: variantsError } = await supabase
            .from('product_variants')
            .select('sku, format, weight, price_cents')
            .limit(3);

        if (variantsError) {
            console.error('❌ Error fetching variants:', variantsError.message);
            return;
        }

        console.log('✅ Sample variants:', variants.map(v => `${v.sku} (${v.format}, ${v.weight}g, €${v.price_cents/100})`).join(', '));

        console.log('\n🎉 Database verification completed successfully!');

    } catch (error) {
        console.error('💥 Error during verification:', error.message);
    }
}

// Run the script
applySchema();