
import React, { useState } from 'react';
import type { AdFormData } from '../types';
import { PLATFORMS, TONES } from '../constants';
import { Loader } from './Loader';

interface AdGeneratorFormProps {
  onSubmit: (data: AdFormData) => void;
  isLoading: boolean;
}

export function AdGeneratorForm({ onSubmit, isLoading }: AdGeneratorFormProps): React.ReactNode {
  const [formData, setFormData] = useState<AdFormData>({
    productName: '',
    targetAudience: '',
    platform: PLATFORMS[0],
    tone: TONES[0],
    features: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 shadow-2xl sticky top-8">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">أخبرنا عن منتجك</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-slate-300 mb-1">اسم المنتج/الخدمة</label>
          <input
            type="text"
            name="productName"
            id="productName"
            value={formData.productName}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            placeholder="مثال: أحذية رياضية مريحة"
          />
        </div>
        <div>
          <label htmlFor="targetAudience" className="block text-sm font-medium text-slate-300 mb-1">الجمهور المستهدف</label>
          <input
            type="text"
            name="targetAudience"
            id="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            placeholder="مثال: الشباب الرياضي بين 20-35 سنة"
          />
        </div>
        <div>
          <label htmlFor="features" className="block text-sm font-medium text-slate-300 mb-1">أهم الميزات والفوائد</label>
          <textarea
            name="features"
            id="features"
            rows={4}
            value={formData.features}
            onChange={handleChange}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            placeholder="مثال: نعل مرن، تصميم عصري، مقاوم للماء"
          ></textarea>
        </div>
        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-slate-300 mb-1">منصة الإعلان</label>
          <select
            name="platform"
            id="platform"
            value={formData.platform}
            onChange={handleChange}
            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
          >
            {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="tone" className="block text-sm font-medium text-slate-300 mb-1">نبرة الصوت</label>
          <select
            name="tone"
            id="tone"
            value={formData.tone}
            onChange={handleChange}
            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
          >
            {TONES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center"
        >
          {isLoading ? <Loader /> : 'إنشاء الإعلانات'}
        </button>
      </form>
    </div>
  );
}