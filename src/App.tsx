import { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocFromServer,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  AdminRoute,
  AppView,
  FiqhQuestion,
  GalleryPhoto,
  JamiaAdmission,
  JamiaFeeRecord,
  JamiaResult,
  JamiaSiteConfig,
  JamiaStaff,
  JamiaStudent,
  LeadershipProfile,
  OnlineCourse,
} from './types/jamia';
import {
  GALLERY_PHOTOS,
  INITIAL_ADMISSIONS,
  INITIAL_COURSES,
  INITIAL_FEES,
  INITIAL_FIQH_QUESTIONS,
  INITIAL_RESULTS,
  INITIAL_SITE_CONFIG,
  INITIAL_STAFF,
  INITIAL_STUDENTS,
  LEADERSHIP_PROFILES,
} from './data/jamiaData';
import {
  ADMIN_UID,
  auth,
  db,
  handleFirestoreError,
  isPermissionDeniedError,
  OperationType,
  verifyFirestoreConnection,
} from './lib/firebase';
import { PublicWebsite, SiteLang } from './components/PublicWebsite';
import { AdminLoginPage } from './components/AdminLoginPage';
import { AdminLayout } from './components/AdminLayout';
import { AdminPortalPages } from './pages/AdminPortalPages';
import { ToastBanner } from './components/ui/Modal';
import { CursorEffects } from './components/CursorEffects';

export default function App() {
  const [view, setView] = useState<AppView>('website');
  const [siteLang, setSiteLang] = useState<SiteLang>('ur');
  const [langPromptOpen, setLangPromptOpen] = useState<boolean>(true);
  const [adminRoute, setAdminRoute] = useState<AdminRoute>('dashboard');
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Live state synchronized with Firebase Firestore (falls back to defaults while empty)
  const [siteConfig, setSiteConfig] = useState<JamiaSiteConfig>(INITIAL_SITE_CONFIG);
  const [courses, setCourses] = useState<OnlineCourse[]>(INITIAL_COURSES);
  const [leadership, setLeadership] = useState<LeadershipProfile[]>(LEADERSHIP_PROFILES);
  const [gallery, setGallery] = useState<GalleryPhoto[]>(GALLERY_PHOTOS);
  const [students, setStudents] = useState<JamiaStudent[]>(INITIAL_STUDENTS);
  const [admissions, setAdmissions] = useState<JamiaAdmission[]>(INITIAL_ADMISSIONS);
  const [staff, setStaff] = useState<JamiaStaff[]>(INITIAL_STAFF);
  const [fees, setFees] = useState<JamiaFeeRecord[]>(INITIAL_FEES);
  const [results, setResults] = useState<JamiaResult[]>(INITIAL_RESULTS);
  const [questions, setQuestions] = useState<FiqhQuestion[]>(INITIAL_FIQH_QUESTIONS);

  const notify = useCallback((msg: string) => setToast(msg), []);

  useEffect(() => {
    const isLtrEnglish =
      view === 'login' || view === 'admin' || (view === 'website' && siteLang === 'en');
    document.documentElement.lang = isLtrEnglish ? 'en' : 'ur';
    document.documentElement.dir = isLtrEnglish ? 'ltr' : 'rtl';
  }, [view, siteLang]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const isAdminUser = firebaseUser?.uid === ADMIN_UID;

  const onListenerError = useCallback((label: string, err: unknown) => {
    if (isPermissionDeniedError(err)) {
      // Rules may not be published yet on the external Firebase console; fallback data stays active.
      return;
    }
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`${label} listener:`, msg);
  }, []);

  const seedDefaultDataToFirestore = useCallback(async () => {
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'siteConfig', 'main'), INITIAL_SITE_CONFIG, { merge: true });
      INITIAL_COURSES.forEach((c) => batch.set(doc(db, 'courses', c.id), c));
      LEADERSHIP_PROFILES.forEach((l) => batch.set(doc(db, 'leadership', l.id), l));
      GALLERY_PHOTOS.forEach((g) => batch.set(doc(db, 'gallery', g.id), g));
      INITIAL_RESULTS.forEach((r) => batch.set(doc(db, 'results', r.id), r));
      INITIAL_FIQH_QUESTIONS.forEach((q) => batch.set(doc(db, 'fiqhQuestions', q.id), q));
      INITIAL_STUDENTS.forEach((s) => batch.set(doc(db, 'students', s.id), s));
      INITIAL_ADMISSIONS.forEach((a) => batch.set(doc(db, 'admissions', a.id), a));
      INITIAL_STAFF.forEach((m) => batch.set(doc(db, 'staff', m.id), m));
      INITIAL_FEES.forEach((f) => batch.set(doc(db, 'fees', f.id), f));
      await batch.commit();
      notify('All default Jamia records synced to Firebase Firestore.');
    } catch (err) {
      if (isPermissionDeniedError(err)) {
        notify('Publish Firestore Security Rules in Firebase Console to enable cloud sync.');
      } else {
        handleFirestoreError(err, OperationType.WRITE, 'batchSeed');
      }
    }
  }, [notify]);

  // Initial Firestore connectivity verification & Firebase Auth listener
  useEffect(() => {
    verifyFirestoreConnection().catch(() => {});

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user && user.uid === ADMIN_UID) {
        try {
          const snap = await getDocFromServer(doc(db, 'siteConfig', 'main'));
          if (!snap.exists()) {
            await seedDefaultDataToFirestore();
          }
        } catch {
          // Rules might not be updated yet or offline; UI continues smoothly
        }
      }
    });

    return () => unsubAuth();
  }, [seedDefaultDataToFirestore]);

  // Public Firestore real-time subscriptions
  useEffect(() => {
    const unsubConfig = onSnapshot(
      doc(db, 'siteConfig', 'main'),
      (snap) => {
        if (snap.exists()) {
          setSiteConfig({ ...INITIAL_SITE_CONFIG, ...(snap.data() as Partial<JamiaSiteConfig>) });
        }
      },
      (err) => onListenerError('siteConfig', err)
    );

    const unsubCourses = onSnapshot(
      collection(db, 'courses'),
      (snap) => {
        if (!snap.empty) {
          setCourses(snap.docs.map((d) => d.data() as OnlineCourse));
        }
      },
      (err) => onListenerError('courses', err)
    );

    const unsubLeadership = onSnapshot(
      collection(db, 'leadership'),
      (snap) => {
        if (!snap.empty) {
          setLeadership(
            snap.docs
              .map((d) => d.data() as LeadershipProfile)
              .sort((a, b) => a.order - b.order)
          );
        }
      },
      (err) => onListenerError('leadership', err)
    );

    const unsubGallery = onSnapshot(
      collection(db, 'gallery'),
      (snap) => {
        if (!snap.empty) {
          setGallery(snap.docs.map((d) => d.data() as GalleryPhoto));
        }
      },
      (err) => onListenerError('gallery', err)
    );

    const unsubResults = onSnapshot(
      collection(db, 'results'),
      (snap) => {
        if (!snap.empty) {
          setResults(snap.docs.map((d) => d.data() as JamiaResult));
        }
      },
      (err) => onListenerError('results', err)
    );

    return () => {
      unsubConfig();
      unsubCourses();
      unsubLeadership();
      unsubGallery();
      unsubResults();
    };
  }, [onListenerError]);

  // Fiqh Questions subscription (Public sees Published only; Admin sees all)
  useEffect(() => {
    const fiqhTarget = isAdminUser
      ? collection(db, 'fiqhQuestions')
      : query(collection(db, 'fiqhQuestions'), where('status', '==', 'Published'));

    const unsubFiqh = onSnapshot(
      fiqhTarget,
      (snap) => {
        if (!snap.empty) {
          setQuestions(snap.docs.map((d) => d.data() as FiqhQuestion));
        }
      },
      (err) => onListenerError('fiqhQuestions', err)
    );

    return () => unsubFiqh();
  }, [isAdminUser, onListenerError]);

  // Admin-only real-time subscriptions (Students, Admissions, Staff, Fees/Donations)
  useEffect(() => {
    if (!isAdminUser) return;

    const unsubStudents = onSnapshot(
      collection(db, 'students'),
      (snap) => {
        if (!snap.empty) setStudents(snap.docs.map((d) => d.data() as JamiaStudent));
      },
      (err) => onListenerError('students', err)
    );

    const unsubAdmissions = onSnapshot(
      collection(db, 'admissions'),
      (snap) => {
        if (!snap.empty) setAdmissions(snap.docs.map((d) => d.data() as JamiaAdmission));
      },
      (err) => onListenerError('admissions', err)
    );

    const unsubStaff = onSnapshot(
      collection(db, 'staff'),
      (snap) => {
        if (!snap.empty) setStaff(snap.docs.map((d) => d.data() as JamiaStaff));
      },
      (err) => onListenerError('staff', err)
    );

    const unsubFees = onSnapshot(
      collection(db, 'fees'),
      (snap) => {
        if (!snap.empty) setFees(snap.docs.map((d) => d.data() as JamiaFeeRecord));
      },
      (err) => onListenerError('fees', err)
    );

    return () => {
      unsubStudents();
      unsubAdmissions();
      unsubStaff();
      unsubFees();
    };
  }, [isAdminUser, onListenerError]);

  const handleSelectLanguage = (chosen: SiteLang) => {
    setSiteLang(chosen);
    setLangPromptOpen(false);
    notify(chosen === 'en' ? 'Language switched to English.' : 'زبان اردو منتخب کر لی گئی۔');
  };

  const handleLoginSuccess = () => {
    setAdminRoute('dashboard');
    setView('admin');
    notify('Signed in to Admin Portal!');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignore signOut errors
    }
    setView('website');
    notify(siteLang === 'en' ? 'Logged out successfully.' : 'آپ کامیابی سے لاگ آؤٹ ہو چکے ہیں۔');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Safe Firestore write helpers with instant local UI reflection
  const persistQuestion = async (q: FiqhQuestion) => {
    setQuestions((prev) => [q, ...prev]);
    try {
      await setDoc(doc(db, 'fiqhQuestions', q.id), q);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `fiqhQuestions/${q.id}`);
    }
  };

  const persistAdmission = async (adm: JamiaAdmission) => {
    setAdmissions((prev) => [adm, ...prev]);
    try {
      await setDoc(doc(db, 'admissions', adm.id), adm);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `admissions/${adm.id}`);
    }
  };

  const persistDonation = async (record: JamiaFeeRecord) => {
    setFees((prev) => [record, ...prev]);
    try {
      await setDoc(doc(db, 'fees', record.id), record);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `fees/${record.id}`);
    }
  };

  return (
    <>
      {view === 'website' && (
        <PublicWebsite
          lang={siteLang}
          langPromptOpen={langPromptOpen}
          onSelectLanguage={handleSelectLanguage}
          siteConfig={siteConfig}
          courses={courses}
          leadership={leadership}
          gallery={gallery}
          questions={questions}
          results={results}
          onSubmitQuestion={(q) => {
            persistQuestion(q).catch(() => {});
          }}
          onSubmitAdmission={(adm) => {
            persistAdmission(adm).catch(() => {});
          }}
          onSubmitDonation={(record) => {
            persistDonation(record).catch(() => {});
          }}
          onOpenAdminLogin={() => {
            setView(firebaseUser ? 'admin' : 'login');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNotify={notify}
        />
      )}

      {view === 'login' && (
        <AdminLoginPage
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
          adminEmail={firebaseUser?.email || siteConfig.email}
          pendingQuestionsCount={questions.filter((q) => q.status === 'Pending').length}
          pendingAdmissionsCount={admissions.filter((a) => a.status === 'Pending').length}
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
            onAddStudent={async (s) => {
              setStudents((prev) => [s, ...prev]);
              try {
                await setDoc(doc(db, 'students', s.id), s);
              } catch (err) {
                notify('Firestore write error: check Security Rules.');
                handleFirestoreError(err, OperationType.CREATE, `students/${s.id}`);
              }
            }}
            admissions={admissions}
            onUpdateAdmissionStatus={async (id, status) => {
              setAdmissions((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
              try {
                await setDoc(
                  doc(db, 'admissions', id),
                  { ...admissions.find((a) => a.id === id), status },
                  { merge: true }
                );
              } catch (err) {
                notify('Firestore write error: check Security Rules.');
                handleFirestoreError(err, OperationType.UPDATE, `admissions/${id}`);
              }
            }}
            staff={staff}
            onAddStaff={async (m) => {
              setStaff((prev) => [m, ...prev]);
              try {
                await setDoc(doc(db, 'staff', m.id), m);
              } catch (err) {
                notify('Firestore write error: check Security Rules.');
                handleFirestoreError(err, OperationType.CREATE, `staff/${m.id}`);
              }
            }}
            onToggleSalary={async (id) => {
              const target = staff.find((m) => m.id === id);
              const nextStatus: JamiaStaff['salaryStatus'] =
                target?.salaryStatus === 'Paid' ? 'Pending' : 'Paid';
              setStaff((prev) =>
                prev.map((m) => (m.id === id ? { ...m, salaryStatus: nextStatus } : m))
              );
              try {
                await updateDoc(doc(db, 'staff', id), { salaryStatus: nextStatus });
              } catch (err) {
                handleFirestoreError(err, OperationType.UPDATE, `staff/${id}`);
              }
            }}
            onSaveAttendance={async (date, marks) => {
              try {
                await setDoc(doc(db, 'attendance', date), { date, marks, updatedAt: new Date().toISOString() });
                notify(`Attendance register saved to Firestore for ${date}.`);
              } catch (err) {
                notify('Firestore write error: check Security Rules.');
                handleFirestoreError(err, OperationType.WRITE, `attendance/${date}`);
              }
            }}
            fees={fees}
            onAddFee={async (f) => {
              setFees((prev) => [f, ...prev]);
              try {
                await setDoc(doc(db, 'fees', f.id), f);
              } catch (err) {
                notify('Firestore write error: check Security Rules.');
                handleFirestoreError(err, OperationType.CREATE, `fees/${f.id}`);
              }
            }}
            onMarkFeePaid={async (id) => {
              setFees((prev) => prev.map((f) => (f.id === id ? { ...f, status: 'Paid' } : f)));
              try {
                await setDoc(
                  doc(db, 'fees', id),
                  { ...fees.find((f) => f.id === id), status: 'Paid' },
                  { merge: true }
                );
              } catch (err) {
                handleFirestoreError(err, OperationType.UPDATE, `fees/${id}`);
              }
            }}
            results={results}
            onAddResult={async (r) => {
              setResults((prev) => [r, ...prev]);
              try {
                await setDoc(doc(db, 'results', r.id), r);
              } catch (err) {
                notify('Firestore write error: check Security Rules.');
                handleFirestoreError(err, OperationType.CREATE, `results/${r.id}`);
              }
            }}
            onDeleteResult={async (id) => {
              setResults((prev) => prev.filter((r) => r.id !== id));
              try {
                await deleteDoc(doc(db, 'results', id));
                notify('Result deleted from Firestore.');
              } catch (err) {
                handleFirestoreError(err, OperationType.DELETE, `results/${id}`);
              }
            }}
            questions={questions}
            onAnswerQuestion={async (id, answer) => {
              setQuestions((prev) =>
                prev.map((q) => (q.id === id ? { ...q, answer, status: 'Published' } : q))
              );
              try {
                await setDoc(
                  doc(db, 'fiqhQuestions', id),
                  { ...questions.find((q) => q.id === id), answer, status: 'Published' },
                  { merge: true }
                );
              } catch (err) {
                handleFirestoreError(err, OperationType.UPDATE, `fiqhQuestions/${id}`);
              }
            }}
            courses={courses}
            onAddCourse={async (c) => {
              setCourses((prev) => [...prev, c]);
              try {
                await setDoc(doc(db, 'courses', c.id), c);
                notify(`Online class "${c.titleEn}" saved to Firestore.`);
              } catch (err) {
                notify('Firestore write error: check Security Rules.');
                handleFirestoreError(err, OperationType.CREATE, `courses/${c.id}`);
              }
            }}
            onDeleteCourse={async (id) => {
              setCourses((prev) => prev.filter((c) => c.id !== id));
              try {
                await deleteDoc(doc(db, 'courses', id));
                notify('Online class removed from Firestore.');
              } catch (err) {
                handleFirestoreError(err, OperationType.DELETE, `courses/${id}`);
              }
            }}
            leadership={leadership}
            onUpdateLeadership={async (leader) => {
              setLeadership((prev) => prev.map((l) => (l.id === leader.id ? leader : l)));
              try {
                await setDoc(doc(db, 'leadership', leader.id), leader, { merge: true });
              } catch (err) {
                handleFirestoreError(err, OperationType.WRITE, `leadership/${leader.id}`);
              }
            }}
            gallery={gallery}
            onAddGalleryPhoto={async (photo) => {
              setGallery((prev) => [photo, ...prev]);
              try {
                await setDoc(doc(db, 'gallery', photo.id), photo);
              } catch (err) {
                handleFirestoreError(err, OperationType.CREATE, `gallery/${photo.id}`);
              }
            }}
            onDeleteGalleryPhoto={async (id) => {
              setGallery((prev) => prev.filter((p) => p.id !== id));
              try {
                await deleteDoc(doc(db, 'gallery', id));
                notify('Photo removed from Gallery.');
              } catch (err) {
                handleFirestoreError(err, OperationType.DELETE, `gallery/${id}`);
              }
            }}
            siteConfig={siteConfig}
            onUpdateSiteConfig={async (cfg) => {
              setSiteConfig(cfg);
              try {
                await setDoc(doc(db, 'siteConfig', 'main'), cfg, { merge: true });
                notify('Website settings saved to Firebase Firestore.');
              } catch (err) {
                notify('Firestore write error: check Security Rules.');
                handleFirestoreError(err, OperationType.WRITE, 'siteConfig/main');
              }
            }}
            onSeedDatabase={seedDefaultDataToFirestore}
            adminEmail={firebaseUser?.email || siteConfig.email}
            onViewWebsite={() => setView('website')}
            onLogout={handleLogout}
            onNotify={notify}
          />
        </AdminLayout>
      )}

      <CursorEffects />
      <ToastBanner message={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
