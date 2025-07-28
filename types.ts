export interface User {
  id: string;
  email: string;
  password?: string; // Stored hashed in a real app
}

export interface Ad {
  id: string;
  userId: string;
  userEmail?: string;
  title: string;
  description: string;
  images: string[]; // base64 strings
  categoryId: string;
  price: number;
  country: string;
  city: string;
  contactNumber: string;
  condition: 'new' | 'used' | 'likenew';
  createdAt: number; // timestamp
  views: number;
}

export interface Category {
  id: string;
  name: string;
  icon: React.FC<{className?: string}>;
}

export type Page = 
  | { name: 'home' }
  | { name: 'login' }
  | { name: 'dashboard' }
  | { name: 'post_ad' }
  | { name: 'edit_ad'; adId: string }
  | { name: 'ad_details'; adId: string }
  | { name: 'about' }
  | { name: 'contact' }
  | { name: 'faq' };

export type NavigationContextType = {
  page: Page;
  navigate: (page: Page) => void;
};

// For AI Suggestions
export interface AISuggestionPayload {
  keywords: string;
  category: string;
}

export interface AISuggestion {
  title: string;
  description: string;
}

// For Ad Copy Generator (components/geminiService.ts)
export interface AdFormData {
  productName: string;
  targetAudience: string;
  platform: string;
  tone: string;
  features: string;
}

export interface GeneratedAd {
  headline: string;
  body: string;
  callToAction: string;
}
