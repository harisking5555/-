export type PageId =
  | 'home'
  | 'about'
  | 'classes'
  | 'darul-ifta'
  | 'results'
  | 'ceremony'
  | 'departments'
  | 'donations'
  | 'gallery';

export interface LeaderProfile {
  id: string;
  role: string;
  arabicRole: string;
  name: string;
  honorific: string;
  bio: string;
  image: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  category: 'اکابرین و مشائخ' | 'تقسیمِ اسناد' | 'درس و تدریس' | 'جامعہ جھلکیاں';
  caption: string;
}

export interface OnlineCourse {
  id: string;
  title: string;
  arabicTitle: string;
  duration: string;
  timing: string;
  level: string;
  summary: string;
}

export interface DepartmentItem {
  id: string;
  num: string;
  title: string;
  arabicTitle: string;
  duration: string;
  summary: string;
}

export interface FatwaItem {
  id: string;
  code: string;
  category: 'عبادات' | 'معاملات' | 'نکاح و طلاق' | 'جدید مسائل';
  question: string;
  answer: string;
  mufti: string;
  date: string;
}

export interface SubjectMark {
  subject: string;
  total: number;
  obtained: number;
}

export interface StudentResult {
  rollNo: string;
  regNo: string;
  name: string;
  fatherName: string;
  darja: string;
  year: string;
  board: string;
  status: 'کامیاب' | 'امتیازی کامیابی';
  grade: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: string;
  subjects: SubjectMark[];
}

export interface DonationAccount {
  id: string;
  label: string;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  branch: string;
}

export const JAMIA_INFO = {
  name: 'مرکزی جامعۃ البنات',
  fullName: 'مرکزی جامعۃ البنات پرانا لاری اڈا قصور',
  arabicName: 'الجامعة المركزية للبنات قصور',
  location: 'پرانا لاری اڈا، قصور، پنجاب، پاکستان',
  affiliation: 'ملحق تنظیم المدارس اہلسنت پاکستان',
  phone: '03006588699',
  phoneIntl: '+92 300 6588699',
  email: 'Jamiatulbinnat786@gmail.com',
  whatsappChannel: 'https://whatsapp.com/channel/0029VbD9bWc2ZjCwf7PBeU2g',
  whatsappDirect: 'https://wa.me/923006588699',
  tiktok: 'https://vt.tiktok.com/ZSp9yS4q4/',
  heroVerse: 'رَبِّ زِدْنِي عِلْمًا',
  heroHadith: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
  heroTagline: 'دینی و عصری علوم کا مستند مرکز',
};

export const LEADERS: LeaderProfile[] = [
  {
    id: 'bani',
    role: 'بانیٔ جامعہ',
    arabicRole: 'المؤسس رحمه الله',
    name: 'مفتی محمد عبداللہ قادری اشرفی رضوی رحمۃ اللہ علیہ',
    honorific: 'پیرِ طریقت رہبرِ شریعت شیخ الحدیث و التفسیر ابوالعلیٰ',
    bio: 'بانی مرکزی جامعۃ البنات پرانا لاری اڈا قصور، جن کی علمی و روحانی بصیرت نے خطۂ قصور میں تعلیمِ نسواں کا یہ عظیم چراغ روشن فرمایا۔',
    image: 'https://i.postimg.cc/02H4crGc/Bane-jamia.jpg',
  },
  {
    id: 'sarparast',
    role: 'سرپرستِ اعلیٰ',
    arabicRole: 'الراعي الأعلى',
    name: 'صاحبزادہ پیر مفتی محمد اختر علی قادری اشرفی رضوی',
    honorific: 'مبلغِ عالمِ اسلام، وارثِ مسند حضور محدثِ اعظم قصوری',
    bio: 'سجادہ نشین آستانہ عالیہ محدثِ اعظم قصور و سرپرستِ اعلیٰ مرکزی جامعۃ البنات، دینی مدارس و دعوتِ حق کے عالمی داعی۔',
    image: 'https://i.postimg.cc/Z5GMzgMS/Whats-App-Image-2026-11-12-at-2-46-59-PM.jpg',
  },
  {
    id: 'nazim',
    role: 'ناظمِ اعلیٰ',
    arabicRole: 'الناظم الأعلى',
    name: 'حضرت صاحبزادہ پیر مفتی محمد ارشاد علی قادری اشرفی رضوی',
    honorific: 'ناظمِ اعلیٰ و مہتمم جامعہ',
    bio: 'ناظمِ اعلیٰ مرکزی جامعۃ البنات پرانا لاری اڈا قصور، تعلیمی نظم و نسق، آن لائن شعبہ جات اور دارالافتاء کے نگران۔',
    image: 'https://i.postimg.cc/7YQRmb1n/Onar-jamia.jpg',
  },
];

export const GALLERY_IMAGES: GalleryItem[] = [
  {
    id: 'g1',
    src: 'https://i.postimg.cc/02H4crGc/Bane-jamia.jpg',
    title: 'بانیٔ جامعہ مفتی محمد عبداللہ قادری رحمۃ اللہ علیہ',
    category: 'اکابرین و مشائخ',
    caption: 'تاسیسی و روحانی سرپرستی کا یادگار منظر',
  },
  {
    id: 'g2',
    src: 'https://i.postimg.cc/7YQRmb1n/Onar-jamia.jpg',
    title: 'حضرت صاحبزادہ پیر مفتی محمد ارشاد علی قادری',
    category: 'اکابرین و مشائخ',
    caption: 'ناظمِ اعلیٰ مرکزی جامعۃ البنات قصور',
  },
  {
    id: 'g3',
    src: 'https://i.postimg.cc/Z5GMzgMS/Whats-App-Image-2026-11-12-at-2-46-59-PM.jpg',
    title: 'صاحبزادہ پیر مفتی محمد اختر علی قادری',
    category: 'اکابرین و مشائخ',
    caption: 'سرپرستِ اعلیٰ و سجادہ نشین آستانہ عالیہ محدثِ اعظم قصور',
  },
  {
    id: 'g4',
    src: 'https://i.postimg.cc/zXPQ03wt/Whats-App-Image-2026-11-12-at-1-15-33-PM.jpg',
    title: 'تقریبِ تقسیمِ اسناد و دعا',
    category: 'تقسیمِ اسناد',
    caption: 'سالانہ محفلِ دستار و ردائے فضیلت کی روح پرور جھلک',
  },
  {
    id: 'g5',
    src: 'https://i.postimg.cc/L60WNhkw/Whats-App-Image-2026-11-12-at-1-15-34-PM.jpg',
    title: 'علماء و مشائخ کی شرکت',
    category: 'اکابرین و مشائخ',
    caption: 'سالانہ تقریب میں ممتاز علمی شخصیات کی آمد',
  },
  {
    id: 'g6',
    src: 'https://i.postimg.cc/WbfyXtmY/Whats-App-Image-2026-11-12-at-1-15-34-PM-(1).jpg',
    title: 'علمی مجلس و خطابِ خصوصی',
    category: 'تقسیمِ اسناد',
    caption: 'طالبات کی علمی و اخلاقی تربیت کے حوالے سے بیان',
  },
  {
    id: 'g7',
    src: 'https://i.postimg.cc/sgQN8yKm/Whats-App-Image-2026-11-12-at-1-15-35-PM.jpg',
    title: 'امتحانی و تعلیمی جائزہ',
    category: 'درس و تدریس',
    caption: 'تنظیم المدارس نصاب کے مطابق تعلیمی سرگرمیاں',
  },
  {
    id: 'g8',
    src: 'https://i.postimg.cc/XYGzh3xD/Whats-App-Image-2026-11-12-at-1-15-36-PM.jpg',
    title: 'جامعہ کا روحانی ماحول',
    category: 'جامعہ جھلکیاں',
    caption: 'مرکزی جامعۃ البنات پرانا لاری اڈا قصور کی تقریب',
  },
  {
    id: 'g9',
    src: 'https://i.postimg.cc/y8gb5Bnp/Whats-App-Image-2026-11-12-at-1-16-34-PM.jpg',
    title: 'اسناد و اعزازات کی تقسیم',
    category: 'تقسیمِ اسناد',
    caption: 'نمایاں پوزیشن حاصل کرنے والی طالبات کے لیے اعزازات',
  },
  {
    id: 'g10',
    src: 'https://i.postimg.cc/wjyGPHFS/Whats-App-Image-2026-11-12-at-1-16-35-PM.jpg',
    title: 'محفلِ نعت و قراءت',
    category: 'تقسیمِ اسناد',
    caption: 'سالانہ پروگرام میں تلاوتِ قرآن و نعتِ رسول مقبول ﷺ',
  },
  {
    id: 'g11',
    src: 'https://i.postimg.cc/dVkxXv4P/Whats-App-Image-2026-11-12-at-1-16-36-PM.jpg',
    title: 'حفظ و ناظرہ کی کلاسز',
    category: 'درس و تدریس',
    caption: 'مستند معلمات کی نگرانی میں قرآنِ پاک کی تعلیم',
  },
  {
    id: 'g12',
    src: 'https://i.postimg.cc/qvh5Y0jJ/Whats-App-Image-2026-11-12-at-1-16-37-PM.jpg',
    title: 'علمی و تربیتی نشست',
    category: 'درس و تدریس',
    caption: 'شعبہ درسِ نظامی کی تعلیمی سرگرمی',
  },
  {
    id: 'g13',
    src: 'https://i.postimg.cc/6p2mSwY6/Whats-App-Image-2026-11-12-at-1-16-37-PM-(1).jpg',
    title: 'استقبالیہ و انتظامی کمیٹی',
    category: 'جامعہ جھلکیاں',
    caption: 'جامعہ کے سالانہ اجتماع کی تیاری و انتظام',
  },
  {
    id: 'g14',
    src: 'https://i.postimg.cc/MpMF4xdT/Whats-App-Image-2026-11-12-at-1-16-38-PM.jpg',
    title: 'اسنادِ فضیلت کی تقریب',
    category: 'تقسیمِ اسناد',
    caption: 'فارغ التحصیل عالمات و حافظات کی حوصلہ افزائی',
  },
  {
    id: 'g15',
    src: 'https://i.postimg.cc/wjyGPH0B/Whats-App-Image-2026-11-12-at-1-16-38-PM-(1).jpg',
    title: 'مرکزی جامعۃ البنات قصور',
    category: 'جامعہ جھلکیاں',
    caption: 'پرانا لاری اڈا قصور کی علمی و روحانی جھلک',
  },
];

export const DEPARTMENTS: DepartmentItem[] = [
  {
    id: 'nazra-hifz',
    num: '01',
    title: 'شعبہ ناظرہ و حفظِ قرآن',
    arabicTitle: 'شعبة القراءة والتحفيظ',
    duration: 'دو تا تین سال',
    summary: 'مخارج کی درست ادائیگی کے ساتھ ناظرہ اور مکمل حفظِ قرآن مع تجوید۔',
  },
  {
    id: 'dars-e-nizami',
    num: '02',
    title: 'شعبہ درسِ نظامی (عالمہ کورس)',
    arabicTitle: 'الدرس النظامي للعالمات',
    duration: 'چھ سالہ نصاب',
    summary: 'تنظیم المدارس کے مطابق تفسیر، حدیث، فقہ، اصولِ فقہ اور عربی ادب۔',
  },
  {
    id: 'tajweed',
    num: '03',
    title: 'شعبہ تجوید و قراءت',
    arabicTitle: 'شعبة التجويد والقراءات',
    duration: 'ایک سالہ کورس',
    summary: 'قواعدِ تجوید، لحنِ جلی و خفی سے بچاؤ اور حسنِ قراءت کی مشق۔',
  },
  {
    id: 'takhassus',
    num: '04',
    title: 'شعبہ تخصص فی الفقہ',
    arabicTitle: 'التخصص في الفقه الحنفي',
    duration: 'ایک سالہ تخصص',
    summary: 'عالمات کے لیے فقہِ حنفی، فتاویٰ نویسی اور جدید مسائل کی تحقیق۔',
  },
  {
    id: 'online-academy',
    num: '05',
    title: 'آن لائن دینی اکیڈمی',
    arabicTitle: 'الأكاديمية الدينية الإلكترونية',
    duration: 'صبح و شام بیچز',
    summary: 'گھر بیٹھے دنیا بھر کی طالبات کے لیے باقاعدہ لائیو دینی کلاسز۔',
  },
  {
    id: 'tarbiyat',
    num: '06',
    title: 'شعبہ خطابت و تربیتِ نسواں',
    arabicTitle: 'شعبة الخطابة والتربية',
    duration: 'ہفتہ وار نشست',
    summary: 'اصلاحِ معاشرہ، سنتِ نبوی ﷺ کی تعلیم اور اسلامی آدابِ زندگی۔',
  },
];

export const ONLINE_COURSES: OnlineCourse[] = [
  {
    id: 'c1',
    title: 'آن لائن ناظرہ و تجوید کورس',
    arabicTitle: 'دورة القراءة والتجويد',
    duration: 'ماہانہ بنیاد پر',
    timing: 'صبح 9 تا شام 8 (مختلف اوقات)',
    level: 'بچیاں اور خواتین',
    summary: 'مدنی قاعدہ، درست مخارج اور مکمل قرآنِ پاک کی انفرادی توجہ کے ساتھ تعلیم۔',
  },
  {
    id: 'c2',
    title: 'آن لائن عالمہ کورس (درسِ نظامی)',
    arabicTitle: 'الدورة النظامية عبر الإنترنت',
    duration: 'چار تا چھ سال',
    timing: 'روزانہ دو گھنٹے لائیو کلاس',
    level: 'میٹرک یا مساوی',
    summary: 'صرف و نحو، فقہ، حدیث اور تفسیر کی باقاعدہ لائیو اسباق اور امتحانات۔',
  },
  {
    id: 'c3',
    title: 'فرض علوم و طہارت کورس',
    arabicTitle: 'دورة العلوم الضرورية',
    duration: 'تین ماہ',
    timing: 'شام 4 تا 5 بجے',
    level: 'تمام خواتین کے لیے',
    summary: 'وضو، غسل، نماز، روزہ، زکوٰۃ اور روزمرہ شرعی مسائل کی آسان تربیت۔',
  },
  {
    id: 'c4',
    title: 'آن لائن حفظِ قرآن و سورتیں',
    arabicTitle: 'تحفيظ القرآن الكريم',
    duration: 'طالبہ کی استعداد کے مطابق',
    timing: 'انفرادی وقت کا انتخاب',
    level: 'ہر عمر کی طالبات',
    summary: 'مسنون سورتیں یا مکمل قرآنِ کریم کی یادداشت اور روزانہ سبق و منزل۔',
  },
];

export const INITIAL_FATAWA: FatwaItem[] = [
  {
    id: 'f1',
    code: 'فتویٰ نمبر 1042',
    category: 'عبادات',
    question: 'عورت کے لیے گھر میں نماز پڑھتے وقت دوپٹہ یا چادر کی کیا حد ہونی چاہیے؟',
    answer: 'عورت پر نماز میں سترِ عورت واجب ہے؛ سر کے تمام بال، کان، گردن اور کلائیاں ڈھکی ہونی چاہئیں۔ اگر دوپٹہ اتنا باریک ہو کہ بالوں کی رنگت ظاہر ہو تو نماز درست نہ ہوگی، لہٰذا موٹا دوپٹہ یا چادر اوڑھنا لازم ہے۔',
    mufti: 'مفتی محمد ارشاد علی قادری',
    date: 'ربیع الثانی 1448ھ',
  },
  {
    id: 'f2',
    code: 'فتویٰ نمبر 1041',
    category: 'معاملات',
    question: 'کیا سونے کے زیورات پر ہر سال زکوٰۃ واجب ہوتی ہے اگر وہ استعمال میں ہوں؟',
    answer: 'جی ہاں، فقہِ حنفی کے مطابق استعمال کے سونے چاندی کے زیورات پر بھی اگر وہ نصاب (ساڑھے سات تولہ سونا یا ساڑھے باون تولہ چاندی کی مالیت) کو پہنچیں اور سال گزر جائے تو ڈھائی فیصد زکوٰۃ ادا کرنا فرض ہے۔',
    mufti: 'دارالافتاء مرکزی جامعۃ البنات',
    date: 'ربیع الثانی 1448ھ',
  },
  {
    id: 'f3',
    code: 'فتویٰ نمبر 1039',
    category: 'جدید مسائل',
    question: 'آن لائن کلاس کے دوران خواتین کا بغیر شرعی عذر کیمرہ آن رکھنا کیسا ہے؟',
    answer: 'دینی تعلیم کے دوران اگر معلمہ اور طالبات کا ماحول مکمل مستور ہو تب بھی غیر محرم تک رسائی یا ریکارڈنگ کے اندیشے کے پیشِ نظر کیمرہ بند رکھ کر آواز کے ذریعے سبق پڑھنا افضل اور احتیاط کے قریب ہے۔',
    mufti: 'مفتی محمد ارشاد علی قادری',
    date: 'ربیع الاول 1448ھ',
  },
  {
    id: 'f4',
    code: 'فتویٰ نمبر 1035',
    category: 'نکاح و طلاق',
    question: 'نکاح میں لڑکی کی اجازت کے بغیر کیا گیا نکاح شرعاً کیا حکم رکھتا ہے؟',
    answer: 'عاقلہ بالغہ لڑکی کے نکاح میں اس کی دلی رضامندی اور اجازت بنیادی شرط ہے۔ بغیر اجازت اور رضامندی کے زبردستی نکاح منعقد نہیں ہوتا۔',
    mufti: 'دارالافتاء مرکزی جامعۃ البنات',
    date: 'صفر المظفر 1448ھ',
  },
];

export const STUDENT_RESULTS: StudentResult[] = [
  {
    rollNo: '10421',
    regNo: 'TM-KSR-2026-101',
    name: 'عائشہ صدیقہ بنتِ محمد اسلم',
    fatherName: 'محمد اسلم قادری',
    darja: 'درجہ عالمیہ (سال دوم)',
    year: 'سالانہ امتحان 2026ء / 1447ھ',
    board: 'تنظیم المدارس اہلسنت پاکستان',
    status: 'امتیازی کامیابی',
    grade: 'ممتاز',
    totalMarks: 600,
    obtainedMarks: 558,
    percentage: '93.0%',
    subjects: [
      { subject: 'صحیح بخاری شریف', total: 100, obtained: 95 },
      { subject: 'صحیح مسلم شریف', total: 100, obtained: 92 },
      { subject: 'سنن ابوداؤد و ترمذی', total: 100, obtained: 91 },
      { subject: 'تفسیرِ بیضاوی و جلالین', total: 100, obtained: 94 },
      { subject: 'فقہ و اصولِ فقہ', total: 100, obtained: 93 },
      { subject: 'عربی ادب و مقالہ', total: 100, obtained: 93 },
    ],
  },
  {
    rollNo: '10422',
    regNo: 'TM-KSR-2026-102',
    name: 'فاطمہ بتول بنتِ حاجی عبدالرحمٰن',
    fatherName: 'حاجی عبدالرحمٰن',
    darja: 'درجہ عامہ (سال اول)',
    year: 'سالانہ امتحان 2026ء / 1447ھ',
    board: 'تنظیم المدارس اہلسنت پاکستان',
    status: 'امتیازی کامیابی',
    grade: 'ممتاز',
    totalMarks: 600,
    obtainedMarks: 534,
    percentage: '89.0%',
    subjects: [
      { subject: 'ترجمہ و تفسیر القرآن', total: 100, obtained: 92 },
      { subject: 'میزان الصرف و منشعب', total: 100, obtained: 88 },
      { subject: 'نحو میر و شرح مائۃ عامل', total: 100, obtained: 90 },
      { subject: 'نور الایضاح (فقہ)', total: 100, obtained: 91 },
      { subject: 'سیرتِ طیبہ ﷺ', total: 100, obtained: 89 },
      { subject: 'تجوید و قراءت', total: 100, obtained: 84 },
    ],
  },
  {
    rollNo: '10423',
    regNo: 'TM-KSR-2026-103',
    name: 'مریم نعیم بنتِ محمد نعیم اشرفی',
    fatherName: 'محمد نعیم اشرفی',
    darja: 'درجہ خاصہ (سال اول)',
    year: 'سالانہ امتحان 2026ء / 1447ھ',
    board: 'تنظیم المدارس اہلسنت پاکستان',
    status: 'کامیاب',
    grade: 'جید جداً',
    totalMarks: 600,
    obtainedMarks: 492,
    percentage: '82.0%',
    subjects: [
      { subject: 'اصول الشاشی', total: 100, obtained: 81 },
      { subject: 'قدوری شریف', total: 100, obtained: 85 },
      { subject: 'کافیہ و شرح جامی', total: 100, obtained: 80 },
      { subject: 'ریاض الصالحین', total: 100, obtained: 86 },
      { subject: 'عربی انشاء و ادب', total: 100, obtained: 79 },
      { subject: 'مطالعہ عقائدِ اہلسنت', total: 100, obtained: 81 },
    ],
  },
  {
    rollNo: '20511',
    regNo: 'TM-KSR-2026-205',
    name: 'خدیجہ طاہرہ بنتِ غلام مصطفیٰ',
    fatherName: 'غلام مصطفیٰ رضوی',
    darja: 'شعبہ حفظ و تجوید',
    year: 'سالانہ امتحان 2026ء / 1447ھ',
    board: 'تنظیم المدارس اہلسنت پاکستان',
    status: 'امتیازی کامیابی',
    grade: 'ممتاز',
    totalMarks: 400,
    obtainedMarks: 382,
    percentage: '95.5%',
    subjects: [
      { subject: 'مکمل حفظِ قرآن (پہلا نصف)', total: 100, obtained: 97 },
      { subject: 'مکمل حفظِ قرآن (دوسرا نصف)', total: 100, obtained: 96 },
      { subject: 'قواعدِ تجوید و مخارج', total: 100, obtained: 95 },
      { subject: 'بنیادی دینیات و نماز', total: 100, obtained: 94 },
    ],
  },
];

export const BANK_ACCOUNTS: DonationAccount[] = [
  {
    id: 'bank-1',
    label: 'مرکزی جامعۃ البنات فنڈ',
    bankName: 'میزان بینک لمیٹڈ (قصور برانچ)',
    accountTitle: 'مرکزی جامعۃ البنات پرانا لاری اڈا قصور',
    accountNumber: '03006588699',
    iban: 'برائے مکمل بینک اکاؤنٹ نمبر و آئی بی اے این دفترِ جامعہ سے تصدیق کریں',
    branch: 'پرانا لاری اڈا، قصور',
  },
  {
    id: 'bank-2',
    label: 'ایزی پیسہ / جاز کیش (تعاون نمبر)',
    bankName: 'موبائل اکاؤنٹ برائے صدقات و زکوٰۃ',
    accountTitle: 'ناظمِ اعلیٰ مرکزی جامعۃ البنات قصور',
    accountNumber: '03006588699',
    iban: 'واٹس ایپ پر رسید ارسال فرما کر تصدیقی میسج حاصل کریں',
    branch: 'قصور، پاکستان',
  },
];

export const PRAYER_TIMES_KASUR = [
  { name: 'فجر', time: '05:14' },
  { name: 'ظہر', time: '12:12' },
  { name: 'عصر', time: '15:38' },
  { name: 'مغرب', time: '17:19' },
  { name: 'عشاء', time: '18:41' },
  { name: 'جمعۃ المبارک', time: '13:15' },
];

export const CEREMONY_DETAILS = {
  title: 'سالانہ تقریبِ تقسیمِ اسناد و ردائے فضیلت',
  arabicTitle: 'الحفل السنوي لتوزيع الشهادات',
  date: 'ہر سال شعبان المعظم میں انعقاد',
  venue: 'مرکزی جامعۃ البنات، پرانا لاری اڈا، قصور',
  patron: 'صاحبزادہ پیر مفتی محمد اختر علی قادری اشرفی رضوی',
  host: 'صاحبزادہ پیر مفتی محمد ارشاد علی قادری اشرفی رضوی',
  highlights: [
    'تنظیم المدارس کے امتحانات میں کامیاب عالمات کو اسنادِ فضیلت',
    'تکمیلِ حفظِ قرآن کرنے والی طالبات کی حوصلہ افزائی و اعزازات',
    'اکابر علمائے کرام و مشائخ عظام کے خصوصی اصلاحی بیانات',
    'پوزیشن ہولڈر طالبات کے لیے خصوصی انعامات و شیلڈز',
    'امتِ مسلمہ، ملکِ پاکستان اور بانیٔ جامعہ کے لیے اجتماعی دعا',
  ],
  schedule: [
    { time: 'صبح 09:00', item: 'تلاوتِ کلامِ پاک و محفلِ نعتِ رسول مقبول ﷺ' },
    { time: 'صبح 10:15', item: 'سندِ حدیث و تقاریرِ طالبات' },
    { time: 'صبح 11:30', item: 'خطابِ خصوصی سرپرستِ اعلیٰ و مشائخِ عظام' },
    { time: 'دوپہر 12:45', item: 'تقسیمِ اسناد و انعامات اور اجتماعی دعا' },
  ],
};
