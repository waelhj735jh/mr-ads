
import React from 'react';
import type { Ad } from '../types';
import { CATEGORIES } from '../data';
import { LocationMarkerIcon, EyeIcon } from './IconComponents';
import { useNavigation } from './App';
import { formatPrice } from '../utils';

interface AdCardProps {
  ad: Ad;
}

export function AdCard({ ad }: AdCardProps): React.ReactNode {
  const { navigate } = useNavigation();
  const category = CATEGORIES.find(c => c.id === ad.categoryId);

  return (
    <div
      onClick={() => navigate({ name: 'ad_details', adId: ad.id })}
      className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer border border-gray-200 flex flex-col"
    >
      <div className="relative h-48 w-full">
        <img
          src={ad.images[0] || `https://via.placeholder.com/400x300/E2E8F0/4A5568?text=${encodeURIComponent(ad.title)}`}
          alt={ad.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            {category && <category.icon className="w-4 h-4" />}
            <span>{category?.name || 'غير محدد'}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-2 truncate" title={ad.title}>{ad.title}</h3>
        <p className="text-xl font-black text-teal-600 mb-3">
          {ad.price > 0 ? formatPrice(ad.price, ad.country) : 'السعر عند الطلب'}
        </p>
        <div className="mt-auto pt-3 border-t border-gray-100 text-sm text-gray-500 space-y-2">
            <div className="flex items-center gap-2">
                <LocationMarkerIcon className="w-4 h-4 text-gray-400" />
                <span>{ad.city}, {ad.country}</span>
            </div>
             <div className="flex items-center gap-2">
                <EyeIcon className="w-4 h-4 text-gray-400" />
                <span>{ad.views} مشاهدات</span>
            </div>
        </div>
      </div>
    </div>
  );
}
