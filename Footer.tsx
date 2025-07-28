import React from 'react';
import { useNavigation } from './App';

export function Footer(): React.ReactNode {
  const { navigate } = useNavigation();

  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
          <div>
            <h3 className="text-xl font-bold mb-4 text-teal-400">MR للإعلانات المبوبة</h3>
            <p className="text-gray-400">
              منصتك الأولى لبيع وشراء كل ما هو جديد ومستعمل في العالم العربي.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><button onClick={() => navigate({ name: 'about' })} className="text-gray-300 hover:text-teal-400 transition">حول الموقع</button></li>
              <li><button onClick={() => navigate({ name: 'contact' })} className="text-gray-300 hover:text-teal-400 transition">اتصل بنا</button></li>
              <li><button onClick={() => navigate({ name: 'faq' })} className="text-gray-300 hover:text-teal-400 transition">الأسئلة الشائعة</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">تواصل معنا</h3>
            <p className="text-gray-300">نحن دائماً في الخدمة</p>
            <p className="text-teal-400 mt-1">support@mr-classifieds.com</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} MR للإعلانات المبوبة. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
