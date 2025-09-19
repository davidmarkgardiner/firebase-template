#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Read environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyDatabaseSetup() {
    console.log('🔍 Verifying Honduras Coffee Database Setup...\n');

    try {
        // Test 1: Check if main tables exist by querying them
        console.log('📋 Test 1: Checking core tables...');

        const tableTests = [
            { name: 'categories', query: () => supabase.from('categories').select('name').limit(1) },
            { name: 'products', query: () => supabase.from('products').select('name, origin_farm').limit(1) },
            { name: 'product_variants', query: () => supabase.from('product_variants').select('sku, format').limit(1) },
            { name: 'orders', query: () => supabase.from('orders').select('order_number').limit(1) },
            { name: 'subscriptions', query: () => supabase.from('subscriptions').select('id').limit(1) }
        ];

        let tablesFound = 0;
        for (const test of tableTests) {
            try {
                const { data, error } = await test.query();
                if (error) {
                    console.log(`   ❌ ${test.name}: ${error.message}`);
                } else {
                    console.log(`   ✅ ${test.name}: Found`);
                    tablesFound++;
                }
            } catch (err) {
                console.log(`   ❌ ${test.name}: ${err.message}`);
            }
        }

        if (tablesFound === 0) {
            console.log('\n💡 No tables found. The schema may not have been applied yet.');
            console.log('   Please run the SQL from apply_schema.sql in your Supabase SQL Editor.');
            return;
        }

        // Test 2: Check sample data
        console.log('\n🌱 Test 2: Checking sample data...');

        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('name, origin_farm, processing_method, tasting_notes')
            .limit(5);

        if (productsError) {
            console.log(`   ❌ Products query failed: ${productsError.message}`);
        } else if (products && products.length > 0) {
            console.log(`   ✅ Found ${products.length} products:`);
            products.forEach(product => {
                console.log(`      • ${product.name} from ${product.origin_farm} (${product.processing_method})`);
            });
        } else {
            console.log('   ⚠️  No products found - seed data may not be loaded');
        }

        // Test 3: Check product variants
        console.log('\n📦 Test 3: Checking product variants...');

        const { data: variants, error: variantsError } = await supabase
            .from('product_variants')
            .select('sku, format, weight, price_cents')
            .limit(5);

        if (variantsError) {
            console.log(`   ❌ Variants query failed: ${variantsError.message}`);
        } else if (variants && variants.length > 0) {
            console.log(`   ✅ Found ${variants.length} variants:`);
            variants.forEach(variant => {
                const price = (variant.price_cents / 100).toFixed(2);
                console.log(`      • ${variant.sku} (${variant.format}, ${variant.weight}g, €${price})`);
            });
        } else {
            console.log('   ⚠️  No variants found');
        }

        // Test 4: Check categories
        console.log('\n🏷️  Test 4: Checking categories...');

        const { data: categories, error: categoriesError } = await supabase
            .from('categories')
            .select('name, slug')
            .eq('active', true)
            .limit(5);

        if (categoriesError) {
            console.log(`   ❌ Categories query failed: ${categoriesError.message}`);
        } else if (categories && categories.length > 0) {
            console.log(`   ✅ Found ${categories.length} categories:`);
            categories.forEach(category => {
                console.log(`      • ${category.name} (${category.slug})`);
            });
        } else {
            console.log('   ⚠️  No categories found');
        }

        // Test 5: Check product-category relationships
        console.log('\n🔗 Test 5: Checking relationships...');

        const { data: productCategories, error: relationError } = await supabase
            .from('product_categories')
            .select('*')
            .limit(5);

        if (relationError) {
            console.log(`   ❌ Relationship query failed: ${relationError.message}`);
        } else if (productCategories && productCategories.length > 0) {
            console.log(`   ✅ Found ${productCategories.length} product-category relationships`);
        } else {
            console.log('   ⚠️  No relationships found');
        }

        // Summary
        console.log('\n📊 Summary:');
        console.log(`   • Tables verified: ${tablesFound}/5`);
        console.log(`   • Products: ${products?.length || 0}`);
        console.log(`   • Variants: ${variants?.length || 0}`);
        console.log(`   • Categories: ${categories?.length || 0}`);
        console.log(`   • Relationships: ${productCategories?.length || 0}`);

        if (tablesFound === 5 && products?.length > 0 && variants?.length > 0) {
            console.log('\n🎉 Honduras Coffee Database setup completed successfully!');
            console.log('   Your e-commerce platform is ready for development.');
        } else {
            console.log('\n⚠️  Setup incomplete. Please ensure the schema has been applied.');
        }

    } catch (error) {
        console.error('💥 Verification failed:', error.message);
    }
}

// Additional function to test frontend connection
async function testFrontendConnection() {
    console.log('\n🌐 Testing frontend connection patterns...');

    try {
        // Test a typical product listing query
        const { data: featuredProducts, error } = await supabase
            .from('products')
            .select(`
                *,
                product_variants (
                    id,
                    format,
                    weight,
                    price_cents,
                    stock_quantity
                ),
                product_images (
                    url,
                    alt_text,
                    is_primary
                )
            `)
            .eq('featured', true)
            .eq('status', 'active')
            .limit(3);

        if (error) {
            console.log('   ❌ Frontend query failed:', error.message);
        } else {
            console.log('   ✅ Frontend connection successful!');
            console.log(`   Found ${featuredProducts?.length || 0} featured products with full details`);
        }
    } catch (error) {
        console.log('   ❌ Frontend test failed:', error.message);
    }
}

// Run verification
await verifyDatabaseSetup();
await testFrontendConnection();