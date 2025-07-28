import type { Category } from './types';
import {
  CarIcon, BuildingIcon, PhoneIcon, SofaIcon, BriefcaseIcon, LaptopIcon, ShirtIcon, WrenchIcon, MoreHorizontalIcon,
} from './components/IconComponents';

export const CATEGORIES: Category[] = [
  { id: 'cars', name: 'سيارات', icon: CarIcon },
  { id: 'real_estate', name: 'عقارات', icon: BuildingIcon },
  { id: 'phones', name: 'هواتف', icon: PhoneIcon },
  { id: 'electronics', name: 'إلكترونيات', icon: LaptopIcon },
  { id: 'furniture', name: 'أثاث', icon: SofaIcon },
  { id: 'jobs', name: 'وظائف', icon: BriefcaseIcon },
  { id: 'services', name: 'خدمات', icon: WrenchIcon },
  { id: 'clothing', name: 'ملابس ومستلزمات', icon: ShirtIcon },
  { id: 'other', name: 'أخرى', icon: MoreHorizontalIcon },
];

export const CONDITIONS = [
    { id: 'new', name: 'جديدة' },
    { id: 'likenew', name: 'شبه جديدة' },
    { id: 'used', name: 'مستخدمة' },
];

export const LOCATIONS: { [country: string]: string[] } = {
  "اليمن": [
    "صنعاء", "عدن", "تعز", "الحديدة", "إب", "ذمار", "المكلا", "سيئون", "شبوة", "مأرب", "الجوف", "صعدة", "حجة", "المحويت", "عمران", "البيضاء", "لحج", "أبين", "الضالع", "المهرة", "سقطرى"
  ],
  "السعودية": [
    "الرياض", "جدة", "مكة", "المدينة المنورة", "الدمام", "الخبر", "أبها", "تبوك", "بريدة", "حائل"
  ],
  "مصر": [
    "القاهرة", "الإسكندرية", "الجيزة", "الأقصر", "أسوان", "شرم الشيخ", "الغردقة"
  ],
  "الإمارات": [
    "دبي", "أبوظبي", "الشارقة", "عجمان", "رأس الخيمة", "الفجيرة"
  ],
  "قطر": ["الدوحة", "الريان", "الوكرة"],
  "الكويت": ["مدينة الكويت", "الأحمدي", "حولي"],
  "البحرين": ["المنامة", "المحرق", "الرفاع"],
  "عمان": ["مسقط", "صلالة", "صحار"],
  // Add other Arab countries as needed
};
