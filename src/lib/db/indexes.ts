import { getDatabase } from './mongodb';

export async function ensureIndexes() {
  const db = await getDatabase();
  await Promise.all([
    db.collection('tenants').createIndex({ slug: 1 }, { unique: true, name: 'uniq_tenants_slug' }),
    db.collection('users').createIndex({ tenantId: 1, email: 1 }, { unique: true, name: 'uniq_users_tenant_email' }),
    db.collection('users').createIndex({ tenantId: 1, role: 1 }, { name: 'users_tenant_role' }),

    db.collection('pages').createIndex({ tenantId: 1, slug: 1 }, { unique: true, name: 'uniq_pages_tenant_slug' }),
    db.collection('posts').createIndex({ tenantId: 1, slug: 1 }, { unique: true, name: 'uniq_posts_tenant_slug' }),
    db.collection('media').createIndex({ tenantId: 1, filename: 1 }, { name: 'media_tenant_filename' }),
    db.collection('categories').createIndex({ tenantId: 1, slug: 1 }, { unique: true, name: 'uniq_categories_tenant_slug' }),

    db.collection('products').createIndex({ tenantId: 1, slug: 1 }, { unique: true, name: 'uniq_products_tenant_slug' }),
    db.collection('products').createIndex({ tenantId: 1, status: 1 }, { name: 'products_tenant_status' }),
    db.collection('product_categories').createIndex({ tenantId: 1, slug: 1 }, { unique: true, name: 'uniq_product_categories_tenant_slug' }),

    db.collection('orders').createIndex({ tenantId: 1, orderNumber: 1 }, { unique: true, name: 'uniq_orders_tenant_number' }),
    db.collection('carts').createIndex({ tenantId: 1, sessionId: 1 }, { name: 'carts_tenant_session' }),
    db.collection('carts').createIndex({ expiresAt: 1 }, { name: 'ttl_carts_expiry', expireAfterSeconds: 0 }),
  ]);
}
