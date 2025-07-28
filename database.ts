import type { User, Ad } from '../types';

export interface UserWithPassword {
    email: string;
    password: string;
    password_confirm?: string;
}

const USERS_KEY = 'mr_classifieds_users';
const ADS_KEY = 'mr_classifieds_ads';
const SESSION_KEY = 'mr_classifieds_session';

// --- Sample Data ---
const createSampleData = () => {
  if (!localStorage.getItem(ADS_KEY)) {
    const sampleUser: User = { id: 'user_0', email: 'sample@example.com' };
    const sampleAds: Ad[] = [
      { id: 'ad_1', userId: sampleUser.id, userEmail: sampleUser.email, title: 'سيارة تويوتا كامري 2022 للبيع', description: 'سيارة بحالة ممتازة، ماشية 25000 كم فقط. فل كامل.', images: [], categoryId: 'cars', price: 85000, country: 'السعودية', city: 'الرياض', contactNumber: '966501234567', condition: 'likenew', createdAt: Date.now() - 1000 * 60 * 60, views: 120 },
      { id: 'ad_2', userId: sampleUser.id, userEmail: sampleUser.email, title: 'شقة مفروشة للإيجار في صنعاء', description: 'شقة غرفتين وصالة في حي حدة، إيجار شهري.', images: [], categoryId: 'real_estate', price: 1500, country: 'اليمن', city: 'صنعاء', contactNumber: '967771234567', condition: 'used', createdAt: Date.now() - 1000 * 60 * 60 * 5, views: 250 },
      { id: 'ad_3', userId: sampleUser.id, userEmail: sampleUser.email, title: 'آيفون 14 برو جديد بالكرتونة', description: 'لم يستخدم، لون أرجواني، ذاكرة 256 جيجا.', images: [], categoryId: 'phones', price: 4500, country: 'الإمارات', city: 'دبي', contactNumber: '971501234567', condition: 'new', createdAt: Date.now(), views: 88 },
    ];
    localStorage.setItem(ADS_KEY, JSON.stringify(sampleAds));
  }
};

// --- User Management ---
const getUsers = (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
const saveUsers = (users: User[]) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

export const signupUser = (credentials: UserWithPassword): User => {
    const users = getUsers();
    if (users.find(u => u.email === credentials.email)) {
        throw new Error('البريد الإلكتروني مسجل مسبقاً.');
    }
    if (!credentials.email || !credentials.password) {
      throw new Error("الرجاء إدخال البريد الإلكتروني وكلمة المرور.");
    }
    if (credentials.password !== credentials.password_confirm) {
        throw new Error('كلمتا المرور غير متطابقتين.');
    }
    // In a real app, hash the password here
    const newUser: User = { id: `user_${Date.now()}`, email: credentials.email, password: credentials.password };
    users.push(newUser);
    saveUsers(users);
    
    // Log in the new user
    localStorage.setItem(SESSION_KEY, JSON.stringify({id: newUser.id, email: newUser.email}));
    return {id: newUser.id, email: newUser.email};
};

export const loginUser = (credentials: Omit<UserWithPassword, 'password_confirm'>): User => {
    const users = getUsers();
    const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
    if (!user) {
        throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    }
    const sessionUser = { id: user.id, email: user.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
};

export const logoutUser = () => localStorage.removeItem(SESSION_KEY);
export const getCurrentUser = (): User | null => JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');


// --- Ad Management ---
const getAds = (): Ad[] => {
    createSampleData(); // Ensure sample data exists
    return JSON.parse(localStorage.getItem(ADS_KEY) || '[]').sort((a: Ad, b: Ad) => b.createdAt - a.createdAt);
};
const saveAds = (ads: Ad[]) => localStorage.setItem(ADS_KEY, JSON.stringify(ads));

export const getAllAds = (): Ad[] => getAds();

export const getAdById = (id: string): Ad | undefined => {
    const ads = getAds();
    const ad = ads.find(a => a.id === id);
    if(ad) {
        // Increment view count
        ad.views = (ad.views || 0) + 1;
        saveAds(ads);
    }
    return ad;
};

export const getAdsByUser = (userId: string): Ad[] => getAds().filter(ad => ad.userId === userId);

export const createAd = (adData: Omit<Ad, 'id'|'createdAt'|'views'>): Ad => {
    const ads = getAds();
    const newAd: Ad = {
        ...adData,
        id: `ad_${Date.now()}`,
        createdAt: Date.now(),
        views: 0
    };
    ads.push(newAd);
    saveAds(ads);
    return newAd;
};

export const updateAd = (adId: string, adData: Partial<Omit<Ad, 'id'|'userId'|'userEmail'|'createdAt'|'views'>>): Ad => {
    const ads = getAds();
    const adIndex = ads.findIndex(a => a.id === adId);
    if (adIndex === -1) {
        throw new Error('الإعلان غير موجود.');
    }
    const updatedAd = { ...ads[adIndex], ...adData, createdAt: Date.now() }; // Bumps to top
    ads[adIndex] = updatedAd;
    saveAds(ads);
    return updatedAd;
};

export const deleteAd = (adId: string, userId: string) => {
    let ads = getAds();
    const adToDelete = ads.find(ad => ad.id === adId);
    if (adToDelete && adToDelete.userId !== userId) {
        throw new Error("لا تملك صلاحية حذف هذا الإعلان.");
    }
    ads = ads.filter(ad => ad.id !== adId);
    saveAds(ads);
};