import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/db/mongodb';

export interface BlogTag {
  _id?: string;
  tenantId: ObjectId;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export class BlogTagService {
  private async getCollection() {
    const db = await getDatabase();
    return db.collection<BlogTag>('blog_tags');
  }

  async list(tenantId: string | ObjectId) {
    const col = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    return col.find({ tenantId: tid }).sort({ name: 1 }).toArray();
  }

  async create(tenantId: string | ObjectId, data: Omit<BlogTag, '_id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Promise<BlogTag> {
    const col = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const doc: Omit<BlogTag, '_id'> = { ...data, tenantId: tid, createdAt: new Date(), updatedAt: new Date() };
    const r = await col.insertOne(doc as BlogTag);
    return { ...doc, _id: r.insertedId } as BlogTag;
  }
}

export const blogTagService = new BlogTagService();
