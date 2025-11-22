import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/db/mongodb';
import type { Post } from './types';

export class PostService {
  private async getCollection() {
    const db = await getDatabase();
    return db.collection<Post>('posts');
  }

  async getBySlug(tenantId: string | ObjectId, slug: string): Promise<Post | null> {
    const col = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    return col.findOne({ tenantId: tid, slug, status: 'published' });
  }

  async list(tenantId: string | ObjectId, opts?: { status?: Post['status']; tag?: string; skip?: number; limit?: number }): Promise<Post[]> {
    const col = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const query: any = { tenantId: tid };
    if (opts?.status) query.status = opts.status;
    if (opts?.tag) query.tags = opts.tag;
    return col.find(query).skip(opts?.skip || 0).limit(opts?.limit || 50).sort({ createdAt: -1 }).toArray();
  }

  async create(tenantId: string | ObjectId, data: Omit<Post, '_id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    const col = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const doc: Omit<Post, '_id'> = { ...data, tenantId: tid, createdAt: new Date(), updatedAt: new Date() };
    const r = await col.insertOne(doc as Post);
    return { ...doc, _id: r.insertedId } as Post;
  }

  async update(id: string | ObjectId, tenantId: string | ObjectId, updates: Partial<Post>): Promise<boolean> {
    const col = await this.getCollection();
    const oid = typeof id === 'string' ? new ObjectId(id) : id;
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const r = await col.updateOne({ _id: oid, tenantId: tid }, { $set: { ...updates, updatedAt: new Date() } });
    return r.modifiedCount > 0;
  }
}

export const postService = new PostService();
