const { query, pool } = require('./src/config/db');
const scopedQuery = require('./src/db/scopedQuery');

async function runTenantTest() {
  try {
    console.log('1. Setting up mock tenants...');
    const tenantA = await query("INSERT INTO tenants (name) VALUES ('Tenant A') RETURNING id");
    const tenantB = await query("INSERT INTO tenants (name) VALUES ('Tenant B') RETURNING id");
    const tenantAId = tenantA.rows[0].id;
    const tenantBId = tenantB.rows[0].id;

    console.log(`Tenant A created with ID: ${tenantAId}`);
    console.log(`Tenant B created with ID: ${tenantBId}`);

    console.log('\n2. Creating a product for Tenant A...');
    // We can simulate what the controller does:
    const insertRes = await scopedQuery(
      tenantAId,
      `INSERT INTO products (tenant_id, name, starting_price) VALUES ($1, $2, $3) RETURNING id`,
      ['Premium Widget', 100]
    );
    const productId = insertRes.rows[0].id;
    console.log(`Product created with ID: ${productId} belonging to Tenant A`);

    console.log('\n3. Attempting to read Product from Tenant A (Expected: Success)');
    const readA = await scopedQuery(tenantAId, `SELECT * FROM products WHERE tenant_id = $1 AND id = $2`, [productId]);
    if (readA.rows.length > 0) {
      console.log('✅ Success: Tenant A can see their own product.');
    } else {
      console.log('❌ Failure: Tenant A cannot see their product.');
    }

    console.log('\n4. Attempting to read Product from Tenant B (Expected: Not Found due to tenant scope constraint)');
    const readB = await scopedQuery(tenantBId, `SELECT * FROM products WHERE tenant_id = $1 AND id = $2`, [productId]);
    if (readB.rows.length === 0) {
      console.log('✅ Success: Tenant B CANNOT see Tenant A\\'s product. Multi-tenancy is working!');
    } else {
      console.log('❌ Failure: Tenant B saw the product! Scope broken.');
    }

  } catch (err) {
    console.error('Test failed with error:', err);
  } finally {
    console.log('\nCleaning up tests...');
    await query("DELETE FROM tenants WHERE name IN ('Tenant A', 'Tenant B')");
    await pool.end();
  }
}

runTenantTest();
