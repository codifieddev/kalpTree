
// WebsitePageModel interface for a website page document
export interface WebsitePageModel {
	_id: string; // MongoDB ObjectId as string
	tenantId: string; // MongoDB ObjectId as string
	slug: string;
	title: string;
	content: string;
	seo: Record<string, any>;
	status: 'published' | 'draft' | 'archived';
	createdAt: string; // ISO date string
	updatedAt: string; // ISO date string
	publishedAt: string; // ISO date string
}