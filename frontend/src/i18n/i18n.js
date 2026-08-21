import { useApp } from "../context/AppContext";

const translations = {
  fa: {
    // ── TitleBar ──
    "titlebar.appName": "پالت‌ساز",
    "titlebar.appSub": "Color Extractor",
    "titlebar.close": "بستن",
    "titlebar.maximize": "بزرگ",
    "titlebar.restore": "بازگردانی",
    "titlebar.minimize": "کوچک",
    "titlebar.themeLight": "روشن",
    "titlebar.themeDark": "تاریک",
    "titlebar.themeSystem": "سیستم",
    "titlebar.langFa": "فارسی",
    "titlebar.langEn": "English",

    // ── Support Modal ──
    "support.btnLabel": "حمایت مالی از سازنده",
    "support.authorName": "طاها نعمتی",
    "support.authorRole": "توسعه‌دهنده نرم‌افزار · تولیدکننده محتوا",
    "support.tag1": "💻 توسعه نرم‌افزار",
    "support.tag2": "🎨 تولیدکننده محتوا",
    "support.descPart1": "سلام! من",
    "support.descPart2":
      "هستم، توسعه‌دهنده این نرم‌افزار و تولیدکننده محتوای فارسی در حوزه برنامه‌نویسی و طراحی گرافیک، این پروژه به شکل کاملا رایگان ساخته شده تا همه بتونن به راحتی ازش استفاده کنن :)",
    "support.reason1": "حمایت مالی باعث میشه آپدیت‌های بیشتر و سریع‌تر بیان",
    "support.reason2": "پروژه رو زنده نگه میداره و ویژگی‌های جدید اضافه میشن",
    "support.reason3": "نشون‌دهنده‌ی قدردانیت از وقتی که گذاشتم",
    "support.reason4": "کمک می‌کنه محتوای آموزشی بیشتری تولید کنم",
    "support.noteLabel": "نکته مهم:",
    "support.noteText": "قبل از حمایت از اتصال اینترنت خود اطمینان حاصل کنید.",
    "support.donateBtnLabel": "حمایت از من :)",
    "support.footnote": "هر مبلغی، هر چقدر کوچیک، خیلی ارزشمنده 💛",

    // ── Onboarding ──
    "onboarding.welcome": "خوش آمدید",
    "onboarding.subtitle":
      "چند ثانیه وقت بگذارید تا برنامه را برای خود شخصی‌سازی کنید.",
    "onboarding.themeTitle": "ظاهر برنامه",
    "onboarding.themeDesc": "تم مورد علاقه‌تان را انتخاب کنید",
    "onboarding.themeLight": "روشن",
    "onboarding.themeDark": "تاریک",
    "onboarding.themeSystem": "پیروی از سیستم",
    "onboarding.themeSystemDesc": "خودکار بر اساس تنظیمات دستگاه",
    "onboarding.langTitle": "زبان",
    "onboarding.langDesc": "زبان نمایش برنامه را انتخاب کنید",
    "onboarding.langFa": "فارسی",
    "onboarding.langEn": "English",
    "onboarding.start": "شروع کنید",
    "onboarding.settingsNote":
      "این تنظیمات را بعداً از نوار بالا می‌توانید تغییر دهید.",

    // ── Sidebar ──
    "sidebar.appName": "پالت‌ساز",
    "sidebar.appSub": "استخراج رنگ‌های غالب",
    "sidebar.step1": "بارگذاری تصویر",
    "sidebar.step2": "استخراج رنگ",
    "sidebar.step3": "کپی و استفاده",
    "sidebar.imageSection": "تصویر ورودی",
    "sidebar.countSection": "تعداد رنگ",
    "sidebar.countDesc": "تعداد رنگ‌های غالب قابل استخراج",
    "sidebar.extractBtn": "استخراج پالت رنگی",
    "sidebar.processing": "در حال پردازش...",
    "sidebar.resetBtn": "شروع مجدد",

    // ── Main ──
    "main.copyAll": "کپی همه رنگ‌ها",
    "main.paletteBar": "نوار پالت",
    "main.colorCards": "کارت‌های رنگ",
    "main.colorTable": "جدول جزئیات",
    "main.emptyTitle": "هنوز تصویری انتخاب نشده",
    "main.emptyDesc":
      "یک تصویر بارگذاری کنید تا رنگ‌های غالب آن را استخراج کنیم.",
    "main.analyzingToast": "در حال تحلیل تصویر...",
    "main.successToast": "{n} رنگ غالب استخراج شد",
    "main.errorConn": "اتصال به سرور برقرار نشد",
    "main.errorGeneric": "خطا در استخراج رنگ‌ها",
    "main.resetToast": "صفحه پاک‌سازی شد",
    "main.copyAllToast": "تمام رنگ‌ها کپی شدند",
    "main.colorsExtractedCount": "{n} رنگ استخراج شد",
    "main.successBadge": "موفق",
    "main.resultsTitle": "نتایج استخراج",
    "main.dominantColorsFound": "{n} رنگ غالب شناسایی شد",
    "sidebar.heroLine1": "استخراج",
    "sidebar.heroLine2": "پالت رنگی",
    "sidebar.heroDesc": "تحلیل هوشمند رنگ‌های غالب تصویر",

    // ── ColorSwatch ──
    "swatch.copy": "کپی",
    "swatch.copiedHex": "{hex} کپی شد",
    "swatch.copiedRgb": "{rgb} کپی شد",
    "swatch.copiedSuffix": "کپی شد",

    // ── ColorTable ──
    "table.colColor": "رنگ",
    "table.clickToCopy": "کلیک برای کپی",
    "table.extractedCount": "{n} رنگ استخراج‌شده",

    // ── DropZone ──
    "drop.dragHere": "تصویر را اینجا رها کنید",
    "drop.dragging": "رها کنید...",
    "drop.clickToSelect": "کلیک کنید",
    "drop.orLabel": "یا",
    "drop.forSelect": "برای انتخاب",
    "drop.maxSize": "حداکثر ۱۰MB",
    "drop.readyBadge": "آماده برای استخراج",
    "drop.changeImage": "تغییر تصویر",
    "drop.onlyImage": "فقط فایل تصویری قابل قبول است",
    "drop.tooLarge": "حجم فایل بیشتر از ۱۰ مگابایت است",
    "drop.uploaded": "تصویر بارگذاری شد",
    "drop.previewAlt": "پیش‌نمایش",
  },

  en: {
    // ── TitleBar ──
    "titlebar.appName": "Palette",
    "titlebar.appSub": "Color Extractor",
    "titlebar.close": "Close",
    "titlebar.maximize": "Maximize",
    "titlebar.restore": "Restore",
    "titlebar.minimize": "Minimize",
    "titlebar.themeLight": "Light",
    "titlebar.themeDark": "Dark",
    "titlebar.themeSystem": "System",
    "titlebar.langFa": "فارسی",
    "titlebar.langEn": "English",

    // ── Support Modal ──
    "support.btnLabel": "Support the Creator",
    "support.authorName": "Taha Nemati",
    "support.authorRole": "Software Developer · Content Creator",
    "support.tag1": "💻 Software Development",
    "support.tag2": "🎨 Content Creator",
    "support.descPart1": "Hi! I'm",
    "support.descPart2":
      "the developer of this software and a Persian content creator in programming and graphic design. This project was built completely free so everyone can easily use it :)",
    "support.reason1":
      "Financial support leads to more frequent and faster updates",
    "support.reason2": "Keeps the project alive and new features get added",
    "support.reason3": "Shows your appreciation for the time I've invested",
    "support.reason4": "Helps me create more educational content",
    "support.noteLabel": "Note:",
    "support.noteText":
      "Make sure you have an internet connection before supporting.",
    "support.donateBtnLabel": "Support Me :)",
    "support.footnote":
      "Any amount, no matter how small, is greatly appreciated 💛",

    // ── Onboarding ──
    "onboarding.welcome": "Welcome",
    "onboarding.subtitle":
      "Take a moment to personalize the app to your liking.",
    "onboarding.themeTitle": "Appearance",
    "onboarding.themeDesc": "Choose your preferred theme",
    "onboarding.themeLight": "Light",
    "onboarding.themeDark": "Dark",
    "onboarding.themeSystem": "Follow System",
    "onboarding.themeSystemDesc": "Automatically matches your device settings",
    "onboarding.langTitle": "Language",
    "onboarding.langDesc": "Choose your display language",
    "onboarding.langFa": "فارسی",
    "onboarding.langEn": "English",
    "onboarding.start": "Get Started",
    "onboarding.settingsNote":
      "You can change these settings anytime from the title bar.",

    // ── Sidebar ──
    "sidebar.appName": "Palette",
    "sidebar.appSub": "Dominant Color Extractor",
    "sidebar.step1": "Upload Image",
    "sidebar.step2": "Extract Colors",
    "sidebar.step3": "Copy & Use",
    "sidebar.imageSection": "Input Image",
    "sidebar.countSection": "Color Count",
    "sidebar.countDesc": "Number of dominant colors to extract",
    "sidebar.extractBtn": "Extract Color Palette",
    "sidebar.processing": "Processing...",
    "sidebar.resetBtn": "Reset",

    // ── Main ──
    "main.copyAll": "Copy All Colors",
    "main.paletteBar": "Palette Bar",
    "main.colorCards": "Color Cards",
    "main.colorTable": "Detail Table",
    "main.emptyTitle": "No image selected yet",
    "main.emptyDesc": "Upload an image to extract its dominant colors.",
    "main.analyzingToast": "Analyzing image...",
    "main.successToast": "{n} dominant colors extracted",
    "main.errorConn": "Could not connect to server",
    "main.errorGeneric": "Error extracting colors",
    "main.resetToast": "Canvas cleared",
    "main.copyAllToast": "All colors copied",
    "main.colorsExtractedCount": "{n} colors extracted",
    "main.successBadge": "Done",
    "main.resultsTitle": "Extraction Results",
    "main.dominantColorsFound": "{n} dominant colors identified",
    "sidebar.heroLine1": "Extract",
    "sidebar.heroLine2": "Color Palette",
    "sidebar.heroDesc": "Smart dominant color analysis",

    // ── ColorSwatch ──
    "swatch.copy": "Copy",
    "swatch.copiedHex": "{hex} copied",
    "swatch.copiedRgb": "{rgb} copied",
    "swatch.copiedSuffix": "copied",

    // ── ColorTable ──
    "table.colColor": "Color",
    "table.clickToCopy": "Click to copy",
    "table.extractedCount": "{n} colors extracted",

    // ── DropZone ──
    "drop.dragHere": "Drop your image here",
    "drop.dragging": "Release to upload...",
    "drop.clickToSelect": "click here",
    "drop.orLabel": "or",
    "drop.forSelect": "to select",
    "drop.maxSize": "Max 10MB",
    "drop.readyBadge": "Ready to extract",
    "drop.changeImage": "Change Image",
    "drop.onlyImage": "Only image files are accepted",
    "drop.tooLarge": "File size exceeds 10MB",
    "drop.uploaded": "Image uploaded",
    "drop.previewAlt": "Preview",
  },
};

export function useT() {
  const { language } = useApp();
  return function t(key, vars = {}) {
    const dict = translations[language] ?? translations.fa;
    let str = dict[key] ?? translations.fa[key] ?? key;
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(`{${k}}`, v);
    }
    return str;
  };
}

export default translations;
