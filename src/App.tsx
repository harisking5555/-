import { useEffect, useState } from 'react';
import {
  AdminRoute,
  AppView,
  FiqhQuestion,
  JamiaAdmission,
  JamiaFeeRecord,
  JamiaResult,
  JamiaSiteConfig,
  JamiaStaff,
  JamiaStudent,
} from './types/jamia';
import {
  INITIAL_ADMISSIONS,
  INITIAL_COURSES,
  INITIAL_FEES,
  INITIAL_FIQH_QUESTIONS,
  INITIAL_RESULTS,
  INITIAL_SITE_CONFIG,
  INITIAL_STAFF,
  INITIAL_STUDENTS,
} from './data/jamiaData';
import { PublicWebsite, SiteLang } from './components/PublicWebsite';
import { AdminLoginPage } from './components/AdminLoginPage';
import { AdminLayout } from './components/AdminLayout';
import { AdminPortalPages } from './pages/AdminPortalPages';
import { ToastBanner } from './components/ui/Modal';

export default function App() {
  const [view, setView] = useState<AppView>('website');
  const [siteLang, setSiteLang] = useState<SiteLang>('ur');
  const [langPromptOpen, setLangPromptOpen] = useState<boolean>(true);
  const [adminRoute, setAdminRoute] = useState<AdminRoute>('dashboard');
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [toast, setToast] = useState<string | null>(null);

  // Shared live state connecting Public Website & Urdu Admin Portal
  const [siteConfig, setSiteConfig] = useState<JamiaSiteConfig>(INITIAL_SITE_CONFIG);
  const [students, setStudents] = useState<JamiaStudent[]>(INITIAL_STUDENTS);
  const [admissions, setAdmissions] = useState<JamiaAdmission[]>(INITIAL_ADMISSIONS);
  const [staff, setStaff] = useState<JamiaStaff[]>(INITIAL_STAFF);
  const [fees, setFees] = useState<JamiaFeeRecord[]>(INITIAL_FEES);
  const [results, setResults] = useState<JamiaResult[]>(INITIAL_RESULTS);
  const [questions, setQuestions] = useState<FiqhQuestion[]>(INITIAL_FIQH_QUESTIONS);

  useEffect(() => {
    const isEnglishView = view === 'website' && siteLang === 'en';
    document.documentElement.lang = isEnglishView ? 'en' : 'ur';
    document.documentElement.dir = isEnglishView ? 'ltr' : 'rtl';
  }, [view, siteLang]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(t);
  }, [toast]);

  const notify = (msg: string) => setToast(msg);

  const handleSelectLanguage = (chosen: SiteLang) => {
    setSiteLang(chosen);
    setLangPromptOpen(false);
    notify(chosen === 'en' ? 'Language switched to English.' : 'زبان اردو منتخب کر لی گئی۔');
  };

  const handleLoginSuccess = (email: string) => {
    setAdminEmail(email);
    setAdminRoute('dashboard');
    setView('admin');
    notify('ایڈمن پورٹل میں خوش آمدید!');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setAdminEmail('');
    setView('website');
    notify(siteLang === 'en' ? 'Logged out successfully.' : 'آپ کامیابی سے لاگ آؤٹ ہو چکے ہیں۔');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {view === 'website' && (
        <PublicWebsite
          lang={siteLang}
          langPromptOpen={langPromptOpen}
          onSelectLanguage={handleSelectLanguage}
          siteConfig={siteConfig}
          courses={INITIAL_COURSES}
          questions={questions}
          results={results}
          onSubmitQuestion={(q) => setQuestions((prev) => [q, ...prev])}
          onSubmitAdmission={(adm) => setAdmissions((prev) => [adm, ...prev])}
          onOpenAdminLogin={() => {
            setView(adminEmail ? 'admin' : 'login');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNotify={notify}
        />
      )}

      {view === 'login' && (
        <AdminLoginPage
          siteConfig={siteConfig}
          onLoginSuccess={handleLoginSuccess}
          onBackToWebsite={() => {
            setView('website');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {view === 'admin' && (
        <AdminLayout
          activeRoute={adminRoute}
          onNavigate={(r) => {
            setAdminRoute(r);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          adminEmail={adminEmail || siteConfig.email}
          siteConfig={siteConfig}
          pendingQuestionsCount={questions.filter((q) => q.status === 'زیر غور').length}
          pendingAdmissionsCount={admissions.filter((a) => a.status === 'زیر غور').length}
          onViewWebsite={() => {
            setView('website');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onLogout={handleLogout}
        >
          <AdminPortalPages
            route={adminRoute}
            onNavigate={setAdminRoute}
            students={students}
            onAddStudent={(s) => setStudents((prev) => [s, ...prev])}
            admissions={admissions}
            onUpdateAdmissionStatus={(id, status) =>
              setAdmissions((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
            }
            staff={staff}
            onAddStaff={(m) => setStaff((prev) => [m, ...prev])}
            onToggleSalary={(id) =>
              setStaff((prev) =>
                prev.map((m) =>
                  m.id === id
                    ? { ...m, salaryStatus: m.salaryStatus === 'ادا شدہ' ? 'باقی' : 'ادا شدہ' }
                    : m
                )
              )
            }
            fees={fees}
            onAddFee={(f) => setFees((prev) => [f, ...prev])}
            onMarkFeePaid={(id) =>
              setFees((prev) => prev.map((f) => (f.id === id ? { ...f, status: 'ادا شدہ' } : f)))
            }
            results={results}
            onAddResult={(r) => setResults((prev) => [r, ...prev])}
            questions={questions}
            onAnswerQuestion={(id, answer) =>
              setQuestions((prev) =>
                prev.map((q) => (q.id === id ? { ...q, answer, status: 'جواب جاری' } : q))
              )
            }
            courses={INITIAL_COURSES}
            siteConfig={siteConfig}
            onUpdateSiteConfig={setSiteConfig}
            adminEmail={adminEmail || siteConfig.email}
            onViewWebsite={() => setView('website')}
            onLogout={handleLogout}
            onNotify={notify}
          />
        </AdminLayout>
      )}

      <ToastBanner message={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
