import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/db/mongodb';
import type { Page } from './types';
import { BaseDocument } from '@/types';

export class PageService {
  private async getCollection() {
    const db = await getDatabase();
    return db.collection<Page>('pages');
  }

  async getPageBySlug(
    tenantId: string | ObjectId,
    slug: string
  ): Promise<Page | null> {
    const collection = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    return collection.findOne({
      tenantId: tid,
      slug,
      status: 'published',
    });
  }

  async listPages(tenantId: string | ObjectId): Promise<Page[]> {
    const collection = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    return collection
      .find({ tenantId: tid })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async createPage(
    tenantId: string | ObjectId,
    data: Omit<Page, keyof BaseDocument>
  ): Promise<Page> {
    const collection = await this.getCollection();
    const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const page: Omit<Page, '_id'> = {
      ...data,
      tenantId: tid,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await collection.insertOne(page as Page);
    return { ...page, _id: result.insertedId } as Page;
  }

  async updatePage(
    id: string | ObjectId,
    updates: Partial<Page>
  ): Promise<boolean> {
    const collection = await this.getCollection();
    const oid = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await collection.updateOne(
      { _id: oid },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      }
    );
    return result.modifiedCount > 0;
  }

  async deletePage(id: string | ObjectId): Promise<boolean> {
    const collection = await this.getCollection();
    const oid = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await collection.deleteOne({ _id: oid });
    return result.deletedCount > 0;
  }
}

export const pageService = new PageService();
