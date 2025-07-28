
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Ad, User, UserWithPassword } from '../types';
import { getAllAds, getAdById, getAdsByUser, createAd, updateAd, deleteAd } from '../services/database';
import { getAdSuggestion } from '../services/geminiService';
import { CATEGORIES, CONDITIONS, LOCATIONS } from '../data';
import { useNavigation } from './App';
import { AdCard } from './AdCard';
import { Button, Input, Select, Textarea, Spinner } from './UIComponents';
import { ArrowLeftIcon, CheckCircleIcon, ClipboardCopyIcon, EditIcon, LocationMarkerIcon, PhoneIcon, SearchIcon, TagIcon, TrashIcon, UploadCloudIcon, WhatsAppIcon, XIcon, EyeIcon, BuildingIcon, BriefcaseIcon, SparklesIcon } from './IconComponents';
import { formatPrice } from '../utils';

// --- LoginPage ---
export function LoginPage({ onLogin, onSignup }: { onLogin: (c: Omit<UserWithPassword, 'password_confirm'>) => void, onSignup: (c: UserWithPassword) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin({ email, password });
    } else {
      if (!email.includes('@') || !email.includes('.')) {
        alert("الرجاء إدخال بريد إلكتروني صالح.");
        return;
      }
      onSignup({ email, password, password_confirm: passwordConfirm });
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}</h2>
        <p className="text-center text-gray-500 mb-8">
          {isLogin ? 'مرحباً بعودتك! أدخل بياناتك للمتابعة.' : 'انضم إلينا الآن وابدأ في بيع وشراء كل شيء.'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input type="email" label="البريد الإلكتروني" value={email} onChange={e => setEmail(e.target.value)} required placeholder="email@example.com" />
          <Input type="password" label="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          {!isLogin && (
            <Input type="password" label="تأكيد كلمة المرور" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} required placeholder="••••••••" />
          )}
          <Button type="submit" variant="primary" className="w-full" size="lg">
            {isLogin ? 'دخول' : 'إنشاء حساب'}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-teal-600 hover:underline">
            {isLogin ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب بالفعل؟ سجل الدخول'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- HomePage ---
export function HomePage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ category: 'all', city: 'all' });

  useEffect(() => {
    setLoading(true);
    const allAds = getAllAds();
    setAds(allAds);
    setFilteredAds(allAds);
    setLoading(false);
  }, []);
  
  useEffect(() => {
    let result = ads;
    
    if (searchTerm) {
        result = result.filter(ad => ad.title.toLowerCase().includes(searchTerm.toLowerCase()) || ad.description.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    if(filters.category !== 'all'){
        result = result.filter(ad => ad.categoryId === filters.category);
    }
    if(filters.city !== 'all'){
        result = result.filter(ad => ad.city === filters.city);
    }

    setFilteredAds(result);
  }, [searchTerm, filters, ads]);

  const uniqueCities = [...new Set(ads.map(ad => ad.city))].sort();

  if (loading) return <div className="flex justify-center p-12"><Spinner size="lg"/></div>;

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-3">
                <Input type="text" placeholder="ابحث عن سيارة، هاتف، أو أي شيء آخر..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pe-12"/>
                <SearchIcon className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 w-5 h-5"/>
            </div>
            <Select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})}>
                <option value="all">كل الأقسام</option>
                {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </Select>
            <Select value={filters.city} onChange={e => setFilters({...filters, city: e.target.value})}>
                <option value="all">كل المدن</option>
                {uniqueCities.map(city => <option key={city} value={city}>{city}</option>)}
            </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAds.length > 0 ? (
          filteredAds.map(ad => <AdCard key={ad.id} ad={ad} />)
        ) : (
          <div className="col-span-full text-center py-16 text-gray-500">
            <h3 className="text-2xl font-bold">لا توجد إعلانات تطابق بحثك</h3>
            <p className="mt-2">حاول تغيير كلمات البحث أو الفلاتر.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- PostAdPage ---
export function PostAdPage({ user, adId }: { user: User, adId?: string }) {
  const { navigate } = useNavigation();
  const isEditing = !!adId;
  const [ad, setAd] = useState<Partial<Ad>>({
    title: '', description: '', categoryId: CATEGORIES[0].id, price: 0, 
    country: 'اليمن', city: LOCATIONS['اليمن'][0], contactNumber: '',
    condition: 'used', images: []
  });
  const [cities, setCities] = useState<string[]>(LOCATIONS[ad.country || 'اليمن']);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [aiKeywords, setAiKeywords] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);

  useEffect(() => {
    if (isEditing && adId) {
      const existingAd = getAdById(adId);
      if (existingAd && existingAd.userId === user.id) {
        setAd(existingAd);
        setCities(LOCATIONS[existingAd.country] || []);
      } else {
        alert("الإعلان غير موجود أو لا تملك صلاحية تعديله.");
        navigate({ name: 'dashboard' });
      }
    }
  }, [adId, isEditing, user.id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'country') {
      const newCities = LOCATIONS[value] || [];
      setCities(newCities);
      setAd(prev => ({ ...prev, [name]: value, city: newCities[0] || '' }));
    } else if (name === 'price') {
       setAd(prev => ({ ...prev, price: Number(value) }));
    } else {
      setAd(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5 - (ad.images?.length || 0));
      const readers = files.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });
      Promise.all(readers).then(base64Images => {
        setAd(prev => ({ ...prev, images: [...(prev.images || []), ...base64Images] }));
      });
    }
  };

  const removeImage = (index: number) => {
    setAd(prev => ({...prev, images: prev.images?.filter((_, i) => i !== index)}));
  };

  const handleGetSuggestion = async () => {
    if (!aiKeywords) {
        alert('الرجاء إدخال كلمات رئيسية للحصول على اقتراح.');
        return;
    }
    setIsSuggesting(true);
    try {
        const categoryName = CATEGORIES.find(c => c.id === ad.categoryId)?.name || 'عام';
        const suggestion = await getAdSuggestion({ keywords: aiKeywords, category: categoryName });
        setAd(prev => ({
            ...prev,
            title: suggestion.title,
            description: suggestion.description
        }));
    } catch (error) {
        alert(`فشل جلب الاقتراح: ${error.message}`);
    } finally {
        setIsSuggesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ad.title || !ad.description || !ad.contactNumber) {
        alert("الرجاء ملء جميع الحقول المطلوبة.");
        return;
    }
    const adData = { ...ad, userId: user.id, userEmail: user.email } as Omit<Ad, 'id' | 'createdAt' | 'views'>;

    try {
        if (isEditing && adId) {
            updateAd(adId, adData);
            alert("✅ تم تحديث الإعلان بنجاح!");
        } else {
            createAd(adData);
            alert("✅ تم نشر الإعلان بنجاح!");
        }
        navigate({ name: 'dashboard' });
    } catch(error) {
        alert(`حدث خطأ: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{isEditing ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div>
            <h3 className="text-xl font-bold text-teal-600 border-b-2 border-teal-200 pb-2 mb-4">
              هل تحتاج للمساعدة؟ <span className="text-sm font-normal text-gray-500">(اختياري)</span>
            </h3>
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
              <label htmlFor="aiKeywords" className="block text-sm font-medium text-gray-700 mb-1">
                اكتب كلمات عن سلعتك ودع الذكاء الاصطناعي يقترح لك عنوان ووصف
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  id="aiKeywords"
                  name="aiKeywords"
                  value={aiKeywords}
                  onChange={(e) => setAiKeywords(e.target.value)}
                  placeholder="مثال: ايفون 13 برو ازرق نظيف جدا"
                  className="flex-grow"
                  disabled={isSuggesting}
                />
                <Button type="button" onClick={handleGetSuggestion} disabled={isSuggesting || !aiKeywords} className="flex items-center justify-center gap-2">
                  {isSuggesting ? <Spinner size="sm" /> : <SparklesIcon className="w-5 h-5" />}
                  <span>{isSuggesting ? 'جاري التفكير...' : 'اقترح لي'}</span>
                </Button>
              </div>
            </div>
        </div>

        <div>
            <h3 className="text-xl font-bold text-teal-600 border-b-2 border-teal-200 pb-2 mb-4">تفاصيل الإعلان</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="عنوان الإعلان" name="title" value={ad.title} onChange={handleChange} required placeholder="مثال: آيفون 14 مستعمل"/>
                <Select label="القسم" name="categoryId" value={ad.categoryId} onChange={handleChange}>
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
                <Textarea label="وصف الإعلان" name="description" value={ad.description} onChange={handleChange} required rows={5} className="md:col-span-2" placeholder="اكتب تفاصيل عن السلعة..."/>
                <Input label="السعر (بالعملة المحلية)" name="price" type="number" value={ad.price || ''} onChange={handleChange} required placeholder="0" />
                 <Select label="حالة السلعة" name="condition" value={ad.condition} onChange={handleChange}>
                    {CONDITIONS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
            </div>
        </div>

        <div>
            <h3 className="text-xl font-bold text-teal-600 border-b-2 border-teal-200 pb-2 mb-4">الصور (5 كحد أقصى)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {ad.images?.map((img, index) => (
                    <div key={index} className="relative group">
                        <img src={img} alt={`ad-image-${index}`} className="w-full h-32 object-cover rounded-md"/>
                        <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <XIcon className="w-4 h-4"/>
                        </button>
                    </div>
                ))}
                {(ad.images?.length || 0) < 5 && (
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition">
                        <UploadCloudIcon className="w-8 h-8"/>
                        <span className="text-sm mt-2">إضافة صورة</span>
                    </button>
                )}
            </div>
            <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden"/>
        </div>

        <div>
            <h3 className="text-xl font-bold text-teal-600 border-b-2 border-teal-200 pb-2 mb-4">معلومات الموقع والتواصل</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Select label="الدولة" name="country" value={ad.country} onChange={handleChange}>
                    {Object.keys(LOCATIONS).map(country => <option key={country} value={country}>{country}</option>)}
                </Select>
                 <Select label="المدينة" name="city" value={ad.city} onChange={handleChange} disabled={cities.length === 0}>
                    {cities.length > 0 ? cities.map(city => <option key={city} value={city}>{city}</option>) : <option>اختر دولة أولاً</option>}
                </Select>
                <Input label="رقم التواصل (واتساب)" name="contactNumber" type="tel" value={ad.contactNumber} onChange={handleChange} required className="md:col-span-2" placeholder="e.g., 967771234567" />
            </div>
        </div>
         <div className="flex justify-end pt-4">
            <Button type="submit" variant="primary" size="lg">
                {isEditing ? 'حفظ التعديلات' : 'نشر الإعلان'}
            </Button>
        </div>
      </form>
    </div>
  );
}

// --- DashboardPage ---
export function DashboardPage({ user }: { user: User }) {
  const { navigate } = useNavigation();
  const [myAds, setMyAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAds = useCallback(() => {
    setLoading(true);
    setMyAds(getAdsByUser(user.id));
    setLoading(false);
  }, [user.id]);

  useEffect(() => {
    loadAds();
  }, [loadAds]);

  const handleEdit = (adId: string) => {
    navigate({ name: 'edit_ad', adId });
  };

  const handleDelete = (adId: string) => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء.")) {
      try {
        deleteAd(adId, user.id);
        alert("تم حذف الإعلان بنجاح.");
        loadAds();
      } catch (error) {
        alert(`حدث خطأ: ${error.message}`);
      }
    }
  };
  
  if (loading) return <div className="flex justify-center p-12"><Spinner size="lg"/></div>;

  return (
    <div>
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم</h1>
            <Button onClick={() => navigate({name: 'post_ad'})} variant="primary">إضافة إعلان جديد</Button>
        </div>

        <div className="bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold p-6 border-b border-gray-200">إعلاناتي</h2>
            {myAds.length > 0 ? (
                <div className="divide-y divide-gray-200">
                    {myAds.map(ad => (
                        <div key={ad.id} className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-gray-50" >
                           <div className="flex items-center gap-4 flex-grow w-full cursor-pointer" onClick={() => navigate({name: 'ad_details', adId: ad.id})}>
                                <img src={ad.images[0] || `https://via.placeholder.com/100x100/E2E8F0/4A5568?text=${encodeURIComponent(ad.title)}`} alt={ad.title} className="w-20 h-20 object-cover rounded-md flex-shrink-0"/>
                                <div className="flex-grow">
                                    <h3 className="font-bold text-gray-800">{ad.title}</h3>
                                    <p className="text-sm text-gray-500">{ad.city}, {ad.country}</p>
                                    <p className="text-sm text-teal-600 font-bold">{formatPrice(ad.price, ad.country)}</p>
                                </div>
                           </div>
                           <div className="flex items-center gap-2 flex-shrink-0">
                                <Button onClick={(e) => {e.stopPropagation(); handleEdit(ad.id)}} variant="secondary" size="sm" className="flex items-center gap-1"><EditIcon className="w-4 h-4"/> تعديل</Button>
                                <Button onClick={(e) => {e.stopPropagation(); handleDelete(ad.id)}} variant="danger" size="sm" className="flex items-center gap-1"><TrashIcon className="w-4 h-4"/> حذف</Button>
                           </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-12 text-gray-500">
                    <p>ليس لديك أي إعلانات منشورة بعد.</p>
                </div>
            )}
        </div>
    </div>
  );
}

// --- AdDetailsPage ---
export function AdDetailsPage({ adId }: { adId: string }) {
  const { navigate } = useNavigation();
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [mainImage, setMainImage] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    const foundAd = getAdById(adId);
    if (foundAd) {
      setAd(foundAd);
      setMainImage(foundAd.images[0] || `https://via.placeholder.com/800x600/E2E8F0/4A5568?text=${encodeURIComponent(foundAd.title)}`);
    }
    setLoading(false);
  }, [adId]);

  const handleCopyNumber = () => {
    if (ad?.contactNumber) {
      navigator.clipboard.writeText(ad.contactNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  if (loading) return <div className="flex justify-center p-12"><Spinner size="lg"/></div>;
  if (!ad) return <div className="text-center p-12 text-gray-500 text-2xl">لم يتم العثور على الإعلان.</div>;

  const category = CATEGORIES.find(c => c.id === ad.categoryId);
  const condition = CONDITIONS.find(c => c.id === ad.condition);
  const whatsappLink = `https://wa.me/${ad.contactNumber.replace(/[^0-9]/g, '')}`;

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
       <button onClick={() => navigate({name: 'home'})} className="flex items-center gap-2 text-teal-600 hover:text-teal-800 font-semibold mb-6">
            <ArrowLeftIcon className="w-5 h-5"/>
            <span>العودة إلى الإعلانات</span>
       </button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div>
                <img src={mainImage} alt={ad.title} className="w-full h-auto max-h-[500px] object-contain rounded-lg border bg-gray-100 mb-4"/>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {ad.images.map((img, index) => (
                        <img key={index} src={img} onClick={() => setMainImage(img)} alt={`${ad.title} thumbnail ${index+1}`} className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${mainImage === img ? 'border-teal-500' : 'border-transparent'}`} />
                    ))}
                </div>
            </div>
            {/* Description */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">الوصف</h2>
                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{ad.description}</p>
            </div>
        </div>

        <div className="lg:col-span-1">
            <div className="sticky top-24">
                 <h1 className="text-3xl font-bold text-gray-900 mb-2">{ad.title}</h1>
                <p className="text-3xl font-extrabold text-teal-600 mb-4">{formatPrice(ad.price, ad.country)}</p>

                {/* Details Section */}
                <div className="space-y-3 text-gray-600 border-t border-b py-4 my-4">
                    <div className="flex items-center gap-3"><TagIcon className="w-5 h-5 text-gray-400"/> <strong>القسم:</strong> <span className="bg-gray-100 text-gray-700 px-2 py-1 text-sm rounded">{category?.name}</span></div>
                    <div className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-gray-400"/> <strong>الحالة:</strong> <span>{condition?.name}</span></div>
                    <div className="flex items-center gap-3"><LocationMarkerIcon className="w-5 h-5 text-gray-400"/> <strong>الموقع:</strong> <span>{ad.city}, {ad.country}</span></div>
                    <div className="flex items-center gap-3"><EyeIcon className="w-5 h-5 text-gray-400"/> <strong>المشاهدات:</strong> <span>{ad.views}</span></div>
                </div>

                {/* Contact Buttons */}
                <div className="space-y-3 mt-6">
                    <h3 className="font-bold mb-2">تواصل مع البائع</h3>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full">
                       <Button size="lg" className="w-full flex items-center justify-center gap-2 text-white bg-[#25D366] hover:bg-[#128C7E] focus:ring-[#128C7E]">
                          <WhatsAppIcon className="w-5 h-5"/> واتساب
                       </Button>
                    </a>
                    <a href={`tel:${ad.contactNumber}`} className="w-full">
                       <Button variant="secondary" size="lg" className="w-full flex items-center justify-center gap-2">
                          <PhoneIcon className="w-5 h-5"/> اتصال
                       </Button>
                    </a>
                    <Button onClick={handleCopyNumber} variant="ghost" size="lg" className="w-full flex items-center justify-center gap-2">
                        {copied ? <CheckCircleIcon className="w-5 h-5 text-green-500"/> : <ClipboardCopyIcon className="w-5 h-5"/>}
                        {copied ? 'تم النسخ!' : 'نسخ الرقم'}
                    </Button>
                </div>
                 <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                    <strong>نصيحة أمان:</strong> لا تقم بأي تحويلات مالية قبل التأكد من البائع والسلعة.
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

// --- Static Pages ---
const StaticPageWrapper: React.FC<React.PropsWithChildren<{title: string, icon: React.ReactNode}>> = ({ title, icon, children }) => (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center gap-4 mb-6 border-b pb-4">
            {icon}
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        </div>
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed text-right">
            {children}
        </div>
    </div>
);

export function AboutPage() {
    return (
        <StaticPageWrapper title="حول موقع MR للإعلانات" icon={<BuildingIcon className="w-8 h-8 text-teal-500"/>}>
            <p>MR للإعلانات المبوبة هو منصة عربية رائدة تهدف إلى تسهيل عمليات البيع والشراء عبر الإنترنت في جميع أنحاء العالم العربي. نحن نوفر مساحة آمنة وموثوقة للمستخدمين لعرض منتجاتهم وخدماتهم، سواء كانت جديدة أو مستعملة، والوصول إلى آلاف المشترين المحتملين.</p>
            <h3 className="font-bold mt-6">مهمتنا</h3>
            <p>مهمتنا هي تمكين الأفراد والشركات الصغيرة من خلال توفير أدوات سهلة الاستخدام وفعالة للتجارة الإلكترونية، مع التركيز على البساطة والأمان وتجربة المستخدم الممتازة.</p>
            <h3 className="font-bold mt-6">لماذا تختارنا؟</h3>
            <ul>
                <li><strong>مجاني بالكامل:</strong> نشر الإعلانات وتصفحها مجاني 100%.</li>
                <li><strong>سهولة الاستخدام:</strong> واجهة بسيطة وواضحة مصممة لتكون سهلة على الجميع.</li>
                <li><strong>تغطية واسعة:</strong> ندعم جميع الدول والمدن العربية.</li>
                <li><strong>أمان وموثوقية:</strong> نعمل بجد لضمان بيئة آمنة لجميع مستخدمينا.</li>
            </ul>
        </StaticPageWrapper>
    );
}

export function ContactPage() {
    return (
        <StaticPageWrapper title="اتصل بنا" icon={<PhoneIcon className="w-8 h-8 text-teal-500"/>}>
            <p>نحن هنا لمساعدتك! إذا كان لديك أي استفسار، اقتراح، أو واجهت أي مشكلة أثناء استخدام الموقع، لا تتردد في التواصل معنا.</p>
            <h3 className="font-bold mt-6">للدعم الفني والاستفسارات العامة:</h3>
            <p>يمكنك مراسلتنا عبر البريد الإلكتروني التالي، وسيقوم فريق الدعم بالرد عليك في أقرب وقت ممكن.</p>
            <p className="font-bold text-teal-600 text-xl my-4 text-left dir-ltr">support@mr-classifieds.com</p>
             <h3 className="font-bold mt-6">للشراكات والإعلانات التجارية:</h3>
             <p>إذا كنت تمثل شركة وترغب في الإعلان أو بناء شراكة معنا، يرجى التواصل عبر:</p>
            <p className="font-bold text-teal-600 text-xl my-4 text-left dir-ltr">business@mr-classifieds.com</p>
        </StaticPageWrapper>
    );
}

export function FaqPage() {
    return (
        <StaticPageWrapper title="الأسئلة الشائعة" icon={<BriefcaseIcon className="w-8 h-8 text-teal-500"/>}>
            <div className="space-y-6">
                <div>
                    <h4 className="font-bold text-lg">كيف يمكنني نشر إعلان؟</h4>
                    <p>بعد تسجيل الدخول، انقر على زر "أضف إعلان" في أعلى الصفحة. املأ النموذج بالمعلومات المطلوبة مثل العنوان، الوصف، السعر، والصور، ثم انقر على "نشر الإعلان".</p>
                </div>
                <div>
                    <h4 className="font-bold text-lg">هل نشر الإعلانات مجاني؟</h4>
                    <p>نعم، يمكنك نشر أي عدد من الإعلانات مجانًا تمامًا وبدون أي رسوم.</p>
                </div>
                <div>
                    <h4 className="font-bold text-lg">كيف يمكنني تعديل أو حذف إعلاني؟</h4>
                    <p>اذهب إلى "لوحة التحكم" من القائمة. ستجد قائمة بجميع إعلاناتك، وبجانب كل إعلان أزرار للتعديل أو الحذف.</p>
                </div>
                <div>
                    <h4 className="font-bold text-lg">كيف أتواصل مع البائع؟</h4>
                    <p>في صفحة تفاصيل الإعلان، ستجد أزرارًا للتواصل المباشر مع البائع عبر واتساب أو الاتصال الهاتفي، بالإضافة إلى خيار لنسخ رقمه.</p>
                </div>
                 <div>
                    <h4 className="font-bold text-lg">هل بياناتي آمنة؟</h4>
                    <p>نعم، نحن نأخذ خصوصية وأمان مستخدمينا على محمل الجد. لا نشارك بياناتك مع أي طرف ثالث ونستخدم إجراءات أمان لحماية حسابك.</p>
                </div>
            </div>
        </StaticPageWrapper>
    );
}