import { ReactNode, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Briefcase,
  CalendarCheck,
  CreditCard,
  Award,
  Scale,
  Globe,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';
import { AdminRoute, JamiaSiteConfig } from '../types/jamia';

interface AdminLayoutProps {
  activeRoute: AdminRoute;
  onNavigate: (route: AdminRoute) => void;
  adminEmail: string;
  siteConfig: JamiaSiteConfig;
  pendingQuestionsCount: number;
  pendingAdmissionsCount: number;
  onViewWebsite: () => void;
  onLogout: () => void;
  children: ReactNode;
}

const NAV_ITEMS: { id: AdminRoute; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'ڈیش بورڈ', icon: LayoutDashboard },
  { id: 'students', label: 'طالبات کا ریکارڈ', icon: Users },
  { id: 'admissions', label: 'آن لائن داخلے', icon: UserPlus },
  { id: 'teachers', label: 'معلمات و عملہ', icon: Briefcase },
  { id: 'attendance', label: 'روزانہ حاضری', icon: CalendarCheck },
  { id: 'fees', label: 'فیس اور تعاون', icon: CreditCard },
  { id: 'results', label: 'امتحانات و نتائج', icon: Award },
  { id: 'darulifta', label: 'دارالافتاء و کلاسز', icon: Scale },
  { id: 'website', label: 'ویب سائٹ مینجمنٹ', icon: Globe },
  { id: 'settings', label: 'ترتیبات', icon: Settings },
];

export function AdminLayout({
  activeRoute,
  onNavigate,
  adminEmail,
  siteConfig,
  pendingQuestionsCount,
  pendingAdmissionsCount,
  onViewWebsite,
  onLogout,
  children,
}: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentLabel = NAV_ITEMS.find((n) => n.id === activeRoute)?.label ?? 'ڈیش بورڈ';

  const SidebarContent = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
        <button
          type="button"
          onClick={() => {
            onNavigate('dashboard');
            setMobileOpen(false);
          }}
          className="flex cursor-pointer items-center gap-2.5 text-right"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#0F294A] text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-extrabold text-[#0F294A]">مرکزی جامعۃ البنات</p>
            <p className="text-[10px] font-medium text-slate-500">ایڈمن پورٹل · قصور</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="مینو بند کریں"
          className="flex h-8 w-8 cursor-pointer items-center justify-center border border-slate-200 text-slate-600 lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="ایڈمن مینو">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeRoute === item.id;
          const badge =
            item.id === 'admissions' && pendingAdmissionsCount > 0
              ? pendingAdmissionsCount
              : item.id === 'darulifta' && pendingQuestionsCount > 0
                ? pendingQuestionsCount
                : 0;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onNavigate(item.id);
                setMobileOpen(false);
              }}
              className={`flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 text-right text-xs font-bold transition-colors ${
                active
                  ? 'bg-[#0F294A] text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-[#0F294A]'
              }`}
            >
              <span className="flex items-center gap-2.5 truncate">
                <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-blue-300' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </span>
              {badge > 0 && (
                <span
                  className={`font-mono-num px-1.5 py-0.5 text-[10px] font-bold ${
                    active ? 'bg-blue-500 text-white' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-slate-200 bg-slate-50 p-3 text-xs">
        <button
          type="button"
          onClick={onViewWebsite}
          className="flex w-full cursor-pointer items-center justify-center gap-1.5 border border-slate-300 bg-white py-2 font-bold text-[#0F294A] hover:bg-slate-100"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>ویب سائٹ دیکھیں</span>
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full cursor-pointer items-center justify-center gap-1.5 border border-red-200 bg-red-50 py-2 font-bold text-red-700 hover:bg-red-100"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>لاگ آؤٹ</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      {/* Fixed Right Sidebar in RTL */}
      <aside className="no-print hidden w-[240px] shrink-0 border-l border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:right-0 lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="no-print fixed inset-0 z-50 flex lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="fixed inset-0 bg-slate-900/50" />
          <div
            className="relative z-10 w-[250px] border-l border-slate-200 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            {SidebarContent}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col lg:pr-[240px]">
        <header className="no-print sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="ایڈمن مینو کھولیں"
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center border border-slate-200 bg-white text-slate-700 lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <p className="hidden text-[11px] font-medium text-slate-400 sm:block">
                {siteConfig.name}
              </p>
              <h1 className="truncate text-sm font-extrabold text-[#0F294A] sm:text-base">
                {currentLabel}
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono-num text-[11px] text-slate-600 md:inline-block" dir="ltr">
              {adminEmail}
            </span>
            <button
              type="button"
              onClick={onViewWebsite}
              className="inline-flex cursor-pointer items-center gap-1.5 border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-[#0F294A] hover:bg-slate-50"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">ویب سائٹ دیکھیں</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex cursor-pointer items-center gap-1.5 bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>لاگ آؤٹ</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
