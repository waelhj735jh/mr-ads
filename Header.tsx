
import React, { useState } from 'react';
import type { User } from '../types';
import { useNavigation } from './App';
import { Button } from './UIComponents';
import { MenuIcon, PlusCircleIcon, XIcon } from './IconComponents';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps): React.ReactNode {
  const { navigate } = useNavigation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'الرئيسية', page: { name: 'home' } },
    { name: 'لوحة التحكم', page: { name: 'dashboard' } },
    { name: 'حول الموقع', page: { name: 'about' } },
    { name: 'اتصل بنا', page: { name: 'contact' } },
    { name: 'الأسئلة الشائعة', page: { name: 'faq' } },
  ];

  const handleNav = (page) => {
    navigate(page);
    setIsMenuOpen(false);
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => handleNav({ name: 'home' })} className="text-2xl font-bold text-teal-600">
              MR<span className="text-gray-700"> للإعلانات</span>
            </button>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.slice(0, 2).map(link => (
              <button key={link.name} onClick={() => handleNav(link.page)} className="text-gray-600 hover:text-teal-600 transition-colors font-medium">
                {link.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {user ? (
              <>
                <Button onClick={() => handleNav({ name: 'post_ad' })} variant="primary" className="hidden sm:flex items-center gap-2">
                  <PlusCircleIcon className="w-5 h-5" />
                  أضف إعلان
                </Button>
                <div className="hidden md:flex items-center gap-2">
                   <span className="text-sm text-gray-500">{user.email}</span>
                   <Button onClick={onLogout} variant="secondary" size="sm">تسجيل الخروج</Button>
                </div>
              </>
            ) : (
               <Button onClick={() => handleNav({ name: 'login' })} variant="primary">تسجيل الدخول</Button>
            )}
             <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-teal-600" aria-label="فتح القائمة">
                {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {user && (
                 <div className="px-2 py-2">
                    <Button onClick={() => handleNav({ name: 'post_ad' })} variant="primary" className="w-full flex items-center justify-center gap-2">
                        <PlusCircleIcon className="w-5 h-5" />
                        أضف إعلان
                    </Button>
                </div>
             )}
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNav(link.page)}
                className="w-full text-right block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50"
              >
                {link.name}
              </button>
            ))}
             {user && (
                 <div className="border-t border-gray-200 pt-4 pb-3">
                    <div className="flex items-center px-5">
                        <div className="ml-3">
                        <p className="text-base font-medium text-gray-800">{user.email}</p>
                        </div>
                    </div>
                    <div className="mt-3 px-2 space-y-1">
                        <button onClick={() => {onLogout(); setIsMenuOpen(false);}} className="w-full text-right block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50">
                            تسجيل الخروج
                        </button>
                    </div>
                </div>
             )}
          </div>
        </div>
      )}
    </header>
  );
}
