import React, { useState, useMemo } from 'react';
import {
  Pill,
  PieChart as PieChartIcon,
  ShieldCheck,
  Download,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  Check,
  Moon,
  Sun,
  Bell,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Wallet,
  Calendar,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Edit3,
  CheckCircle,
  Music,
  Play,
  PlayCircle,
  FileCode,
  Copy
} from 'lucide-react';

// Models
export interface MedicationItem {
  id: number;
  pillName: string;
  dosage: string;
  scheduledTime: string;
  isCompleted: boolean;
  instructions: string;
  ringtoneName?: string;
  ringtoneUri?: string;
}

export interface ExpenseItem {
  id: number;
  amount: number;
  category: string;
  date: string;
  note: string;
}

// Available System Ringtones (simulates RingtoneManager.ACTION_RINGTONE_PICKER)
const SYSTEM_RINGTONES = [
  { id: 'default', nameAr: 'نغمة المنبه الافتراضية', nameEn: 'Default Alarm Sound', uri: 'content://settings/system/alarm_alert', freq: [587, 880, 1174] },
  { id: 'gentle', nameAr: 'رنين الصباح الهادئ', nameEn: 'Gentle Morning Chime', uri: 'content://media/internal/audio/media/101', freq: [523, 659, 783] },
  { id: 'radar', nameAr: 'تنبيه الرادار الإيقاعي', nameEn: 'Rhythmic Radar Pulse', uri: 'content://media/internal/audio/media/102', freq: [784, 784, 1046] },
  { id: 'bell', nameAr: 'أجراس الصدى المهدئة', nameEn: 'Echo Temple Bells', uri: 'content://media/internal/audio/media/103', freq: [659, 830, 987] },
  { id: 'energetic', nameAr: 'نغمة الحيوية والنشاط', nameEn: 'Energetic Sunrise', uri: 'content://media/internal/audio/media/104', freq: [440, 554, 659] }
];

// Production Android Build & Manifest Config Files
export const ANDROID_BUILD_CONFIG_FILES = {
  project_gradle: {
    filename: 'build.gradle.kts (Project)',
    path: 'FamilyAssistant/build.gradle.kts',
    badge: 'Project Level',
    code: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id("com.android.application") version "8.7.1" apply false
    id("org.jetbrains.kotlin.android") version "2.0.21" apply false
    id("org.jetbrains.kotlin.plugin.compose") version "2.0.21" apply false
    id("com.google.devtools.ksp") version "2.0.21-1.0.28" apply false
    id("androidx.room") version "2.6.1" apply false
}`
  },
  app_gradle: {
    filename: 'build.gradle.kts (App)',
    path: 'FamilyAssistant/app/build.gradle.kts',
    badge: 'App Module',
    code: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
    id("com.google.devtools.ksp")
    id("androidx.room")
}

android {
    namespace = "com.familyassistant.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.familyassistant.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            isMinifyEnabled = false
            applicationIdSuffix = ".debug"
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }

    room {
        schemaDirectory("$projectDir/schemas")
    }
}

dependencies {
    // AndroidX Core & Lifecycle
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.7")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation("androidx.activity:activity-compose:1.9.3")

    // Jetpack Compose BOM & UI Material 3
    implementation(platform("androidx.compose:compose-bom:2024.10.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")

    // Navigation Compose
    implementation("androidx.navigation:navigation-compose:2.8.3")

    // Room Database (Local SQLite 100% Offline)
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    ksp("androidx.room:room-compiler:2.6.1")

    // Jetpack Glance (Home Screen AppWidget)
    implementation("androidx.glance:glance-appwidget:1.1.1")
    implementation("androidx.glance:glance-material3:1.1.1")

    // WorkManager (Background Scheduling)
    implementation("androidx.work:work-runtime-ktx:2.10.0")

    // Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")

    // Local Encrypted Backup / JSON Serialization
    implementation("com.google.code.gson:gson:2.11.0")

    // Debug Tooling
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}`
  },
  manifest: {
    filename: 'AndroidManifest.xml',
    path: 'FamilyAssistant/app/src/main/AndroidManifest.xml',
    badge: 'Manifest',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- Zero Internet permission: 100% Offline Privacy Guarantee -->

    <!-- Required for posting notifications on Android 13+ (API 33) -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <!-- Exact Alarm scheduling for millisecond-accurate pill alerts -->
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.USE_EXACT_ALARM" />

    <!-- Auto-reschedule alarms after phone restart -->
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />

    <!-- Vibration & Wake lock for urgent pill reminder rings -->
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:name=".FamilyAssistantApp"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.FamilyAssistant"
        tools:targetApi="35">

        <!-- Single Activity Navigation -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Medication Precise Alarm BroadcastReceiver -->
        <receiver
            android:name=".alarm.MedicationAlarmReceiver"
            android:enabled="true"
            android:exported="false">
            <intent-filter>
                <action android:name="com.familyassistant.app.ACTION_TRIGGER_MED_ALARM" />
                <action android:name="com.familyassistant.app.ACTION_MARK_TAKEN" />
                <action android:name="com.familyassistant.app.ACTION_SNOOZE_ALARM" />
                <action android:name="android.intent.action.BOOT_COMPLETED" />
                <action android:name="android.intent.action.LOCKED_BOOT_COMPLETED" />
                <action android:name="android.intent.action.TIME_SET" />
                <action android:name="android.intent.action.TIMEZONE_CHANGED" />
            </intent-filter>
        </receiver>

        <!-- Glance Home Screen AppWidget Receiver -->
        <receiver
            android:name=".widget.FamilyAssistantWidgetReceiver"
            android:enabled="true"
            android:exported="true">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/family_assistant_widget_info" />
        </receiver>

    </application>

</manifest>`
  },
  proguard: {
    filename: 'proguard-rules.pro',
    path: 'FamilyAssistant/app/proguard-rules.pro',
    badge: 'ProGuard',
    code: `# ===================================================================
# Family Assistant - ProGuard / R8 Release Optimization Rules
# ===================================================================

# 1. Room Database Protection (Entities & DAOs)
-keep class androidx.room.** { *; }
-dontwarn androidx.room.**
-keep class * extends androidx.room.RoomDatabase
-keep @androidx.room.Entity class * { *; }
-keep @androidx.room.Dao interface * { *; }
-keepclassmembers class * {
    @androidx.room.PrimaryKey *;
    @androidx.room.ColumnInfo *;
    @androidx.room.Embedded *;
    @androidx.room.Relation *;
}

# 2. Prevent obfuscating Model & Data Classes used in JSON Offline Backup
-keepattributes Signature
-keepattributes *Annotation*
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
    @com.google.gson.annotations.Expose <fields>;
}
-keep class com.familyassistant.app.data.model.** { *; }
-keep class com.familyassistant.app.data.entity.** { *; }

# 3. Jetpack Compose & Glance Rules
-keep class androidx.compose.** { *; }
-keep class androidx.glance.** { *; }
-dontwarn androidx.compose.**
-dontwarn androidx.glance.**`
  },
  libs_toml: {
    filename: 'libs.versions.toml',
    path: 'FamilyAssistant/gradle/libs.versions.toml',
    badge: 'Version Catalog',
    code: `[versions]
agp = "8.7.1"
kotlin = "2.0.21"
ksp = "2.0.21-1.0.28"
coreKtx = "1.15.0"
lifecycle = "2.8.7"
activityCompose = "1.9.3"
composeBom = "2024.10.01"
navigation = "2.8.3"
room = "2.6.1"
glance = "1.1.1"
work = "2.10.0"
coroutines = "1.9.0"
gson = "2.11.0"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycle" }
androidx-lifecycle-runtime-compose = { group = "androidx.lifecycle", name = "lifecycle-runtime-compose", version.ref = "lifecycle" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycle" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-compose-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-compose-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigation" }
androidx-room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "room" }
androidx-room-ktx = { group = "androidx.room", name = "room-ktx", version.ref = "room" }
androidx-room-compiler = { group = "androidx.room", name = "room-compiler", version.ref = "room" }
androidx-glance-appwidget = { group = "androidx.glance", name = "glance-appwidget", version.ref = "glance" }
androidx-glance-material3 = { group = "androidx.glance", name = "glance-material3", version.ref = "glance" }
gson = { group = "com.google.code.gson", name = "gson", version.ref = "gson" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
google-ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
androidx-room = { id = "androidx.room", version.ref = "room" }`
  }
};

// Translations dictionary for bilingual support
const TRANSLATIONS = {
  ar: {
    appName: 'المساعد العائلي',
    appSubtitle: 'منبه الأدوية ومسجل المصروفات العائلية',
    offlineBadge: 'أوفلاين 100%',
    tabMeds: 'الأدوية',
    tabExpenses: 'المصروفات والميزانية',
    nextAlarmTitle: 'المنبه القادم',
    inTime: 'خلال 45 دقيقة',
    todaySchedule: 'جدول اليوم',
    takenDoses: 'تم أخذها',
    addPill: 'إضافة دواء جديد',
    pillName: 'اسم الدواء',
    pillNamePlaceholder: 'مثل: بنادول أو أوميغا 3',
    dosage: 'الجرعة',
    dosagePlaceholder: 'مثل: 500 مجم أو قرص واحد',
    time: 'الموعد',
    instructions: 'ملاحظات وتوجيهات',
    instructionsPlaceholder: 'مثل: بعد الأكل مع كوب ماء',
    btnSavePill: 'حفظ المنبه',
    selectRingtoneLabel: 'نغمة التنبيه المخصصة (Ringtone Picker)',
    playTonePreview: 'استماع للنغمة',
    playing: 'جاري التشغيل...',
    financialSummaryTitle: 'الملخص المالي الشهري',
    incomeBudget: 'إجمالي الدخل / الميزانية',
    totalExpenses: 'إجمالي المصروفات',
    remainingBalance: 'المتبقي',
    overBudgetWarning: '⚠️ تجاوز الميزانية!',
    safeBudgetStatus: 'في حدود الميزانية',
    editBudget: 'تعديل الميزانية',
    saveBudget: 'حفظ الميزانية',
    budgetModalTitle: 'تعديل الدخل أو الميزانية الشهرية',
    budgetPlaceholder: 'أدخل الميزانية الإجمالية ($)',
    budgetConsumed: 'تم استهلاك',
    categoryChart: 'توزيع المصروفات حسب التصنيف',
    recentExpenses: 'سجل المصروفات الأخير',
    logExpense: 'تسجيل مصروف جديد',
    amount: 'المبلغ ($)',
    note: 'ملاحظة أو وصف',
    notePlaceholder: 'مثل: مستلزمات البقالة',
    category: 'التصنيف',
    btnSaveExpense: 'تسجيل المصروف',
    exportBackup: 'تصدير نسخة احتياطية',
    triggerTestAlarm: '🔔 تجربة رنين المنبه الآن',
    notificationTitle: 'تنبيه موعد الدواء!',
    notificationSubtitle: 'حان الآن موعد أخذ الجرعة المجدولة',
    notificationActionTaken: '✓ أخذت الجرعة الآن',
    notificationActionSnooze: 'غفوة 10 دقائق',
    widgetPreviewTitle: 'ويدجت الشاشة الرئيسية (Glance Widget)',
    widgetPillTitle: 'الجرعة القادمة: ميتفورمين 500 مجم',
    widgetPillTime: 'اليوم الساعة 01:30 م (مع الغداء)',
    widgetBtnTake: 'أخذت الجرعة',
    widgetBtnAddExpense: '+$ مصروف سريع',
    cats: {
      food: 'طعام ومشتريات',
      medical: 'صحة وأدوية',
      transport: 'مواصلات وبنزين',
      utilities: 'فواتير وخدمات',
      housing: 'سكن وإيجار',
      leisure: 'ترفيه ومصاريف شخصية'
    },
    buildFilesBtn: 'ملفات Gradle & Manifest',
    buildFilesModalTitle: 'ملفات بناء وتكوين أندرويد (Production Gradle & Manifest)',
    copyCode: 'نسخ الكود',
    copiedSuccess: 'تم النسخ بنجاح'
  },
  en: {
    appName: 'Family Assistant',
    appSubtitle: 'Smart Pill Reminder & Offline Expense Tracker',
    offlineBadge: '100% Offline',
    tabMeds: 'Medications',
    tabExpenses: 'Expenses & Budget',
    nextAlarmTitle: 'Next Upcoming Alarm',
    inTime: 'In 45 minutes',
    todaySchedule: "Today's Schedule",
    takenDoses: 'Taken',
    addPill: 'Add New Medication',
    pillName: 'Medicine Name',
    pillNamePlaceholder: 'e.g. Metformin or Omega-3',
    dosage: 'Dosage',
    dosagePlaceholder: 'e.g. 500mg or 1 tablet',
    time: 'Time',
    instructions: 'Instructions',
    instructionsPlaceholder: 'e.g. With lunch and water',
    btnSavePill: 'Save Reminder',
    selectRingtoneLabel: 'Custom Alarm Ringtone (Ringtone Picker)',
    playTonePreview: 'Preview Tone',
    playing: 'Playing...',
    financialSummaryTitle: 'Monthly Financial Summary',
    incomeBudget: 'Total Income / Budget',
    totalExpenses: 'Total Expenses',
    remainingBalance: 'Remaining Balance',
    overBudgetWarning: '⚠️ Over Budget!',
    safeBudgetStatus: 'Within Budget',
    editBudget: 'Edit Budget',
    saveBudget: 'Save Budget',
    budgetModalTitle: 'Edit Monthly Budget / Income',
    budgetPlaceholder: 'Enter total budget amount ($)',
    budgetConsumed: 'Consumed',
    categoryChart: 'Expense Breakdown',
    recentExpenses: 'Recent Expense Records',
    logExpense: 'Log New Expense',
    amount: 'Amount ($)',
    note: 'Note / Description',
    notePlaceholder: 'e.g. Weekly supermarket shopping',
    category: 'Category',
    btnSaveExpense: 'Log Expense',
    exportBackup: 'Export Backup',
    triggerTestAlarm: '🔔 Trigger Alarm Notification',
    notificationTitle: 'Medication Pill Reminder!',
    notificationSubtitle: 'Time to take your scheduled dose',
    notificationActionTaken: '✓ Mark Taken Now',
    notificationActionSnooze: 'Snooze 10m',
    widgetPreviewTitle: 'Home Screen Glance Widget',
    widgetPillTitle: 'Next Pill: Metformin 500mg',
    widgetPillTime: 'Today at 01:30 PM (With lunch)',
    widgetBtnTake: 'Take Now',
    widgetBtnAddExpense: '+$ Quick Log',
    cats: {
      food: 'Food & Groceries',
      medical: 'Medical & Health',
      transport: 'Transportation',
      utilities: 'Utilities & Bills',
      housing: 'Housing & Rent',
      leisure: 'Personal & Leisure'
    },
    buildFilesBtn: 'Gradle & Manifest Files',
    buildFilesModalTitle: 'Android Production Build & Manifest Scripts',
    copyCode: 'Copy Code',
    copiedSuccess: 'Copied successfully!'
  }
};

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const t = TRANSLATIONS[lang];

  const [activeTab, setActiveTab] = useState<'meds' | 'expenses'>('meds');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showWidgetPreview, setShowWidgetPreview] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Financial Budget State
  const [monthlyBudget, setMonthlyBudget] = useState<number>(650.0);
  const [isEditingBudget, setIsEditingBudget] = useState<boolean>(false);
  const [budgetTempInput, setBudgetTempInput] = useState<string>('650');

  // Ringtone State for Form
  const [selectedRingtoneId, setSelectedRingtoneId] = useState<string>('gentle');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Android Build Scripts Modal State
  const [showBuildConfigModal, setShowBuildConfigModal] = useState<boolean>(false);
  const [selectedConfigFile, setSelectedConfigFile] = useState<
    'project_gradle' | 'app_gradle' | 'manifest' | 'proguard' | 'libs_toml'
  >('app_gradle');
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);

  const handleCopyCode = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeKey(key);
    showToast(t.copiedSuccess);
    setTimeout(() => {
      setCopiedCodeKey(null);
    }, 2000);
  };

  // Medications State (with ringtoneUri stored)
  const [meds, setMeds] = useState<MedicationItem[]>([
    {
      id: 1,
      pillName: lang === 'ar' ? 'أوميغا 3 زيت سمك' : 'Omega-3 Fish Oil',
      dosage: lang === 'ar' ? '1000 مجم (كبسولة)' : '1000 mg (1 softgel)',
      scheduledTime: lang === 'ar' ? '08:00 ص' : '08:00 AM',
      isCompleted: true,
      instructions: lang === 'ar' ? 'مع وجبة الإفطار' : 'Take with breakfast',
      ringtoneName: lang === 'ar' ? 'رنين الصباح الهادئ' : 'Gentle Morning Chime',
      ringtoneUri: 'content://media/internal/audio/media/101'
    },
    {
      id: 2,
      pillName: lang === 'ar' ? 'ميتفورمين Metformin' : 'Metformin HCl',
      dosage: lang === 'ar' ? '500 مجم (قرص)' : '500 mg (1 tablet)',
      scheduledTime: lang === 'ar' ? '01:30 م' : '01:30 PM',
      isCompleted: false,
      instructions: lang === 'ar' ? 'مع وجبة الغداء' : 'Take with lunch',
      ringtoneName: lang === 'ar' ? 'أجراس الصدى المهدئة' : 'Echo Temple Bells',
      ringtoneUri: 'content://media/internal/audio/media/103'
    },
    {
      id: 3,
      pillName: lang === 'ar' ? 'فيتامين د3 + ك2' : 'Vitamin D3 + K2',
      dosage: '5000 IU',
      scheduledTime: lang === 'ar' ? '07:00 م' : '07:00 PM',
      isCompleted: false,
      instructions: lang === 'ar' ? 'الجرعة المسائية' : 'Evening dose',
      ringtoneName: lang === 'ar' ? 'نغمة المنبه الافتراضية' : 'Default Alarm Sound',
      ringtoneUri: 'content://settings/system/alarm_alert'
    }
  ]);

  // Expenses State
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    {
      id: 1,
      amount: 48.5,
      category: t.cats.food,
      date: lang === 'ar' ? 'اليوم، 10:15 ص' : 'Today, 10:15 AM',
      note: lang === 'ar' ? 'مشتريات السوبرماركت الأسبوعية' : 'Weekly groceries'
    },
    {
      id: 2,
      amount: 15.0,
      category: t.cats.medical,
      date: lang === 'ar' ? 'أمس' : 'Yesterday',
      note: lang === 'ar' ? 'فيتامينات من الصيدلية' : 'Pharmacy vitamins'
    },
    {
      id: 3,
      amount: 22.0,
      category: t.cats.transport,
      date: lang === 'ar' ? '07 أكتوبر' : 'Oct 07',
      note: lang === 'ar' ? 'شحن بطاقة المترو' : 'Metro rail recharge'
    },
    {
      id: 4,
      amount: 95.0,
      category: t.cats.utilities,
      date: lang === 'ar' ? '05 أكتوبر' : 'Oct 05',
      note: lang === 'ar' ? 'فاتورة الكهرباء' : 'Electricity bill'
    },
    {
      id: 5,
      amount: 35.0,
      category: t.cats.food,
      date: lang === 'ar' ? '04 أكتوبر' : 'Oct 04',
      note: lang === 'ar' ? 'عشاء عائلي' : 'Family dinner'
    }
  ]);

  // Form inputs
  const [pillNameInput, setPillNameInput] = useState('');
  const [dosageInput, setDosageInput] = useState('');
  const [timeInput, setTimeInput] = useState(lang === 'ar' ? '09:00 ص' : '09:00 AM');
  const [instructionsInput, setInstructionsInput] = useState('');

  const [expenseAmountInput, setExpenseAmountInput] = useState('');
  const [expenseCategoryInput, setExpenseCategoryInput] = useState(t.cats.food);
  const [expenseNoteInput, setExpenseNoteInput] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Play synthesized ringtone chime using Web Audio API
  const playRingtoneSound = (toneId?: string) => {
    try {
      const selected = SYSTEM_RINGTONES.find((r) => r.id === (toneId || selectedRingtoneId)) || SYSTEM_RINGTONES[0];
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      setIsPlayingAudio(true);

      const notes = selected.freq;
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + idx * 0.18;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.55);
      });

      setTimeout(() => {
        setIsPlayingAudio(false);
      }, notes.length * 180 + 350);
    } catch {
      setIsPlayingAudio(false);
    }
  };

  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pillNameInput.trim()) return;

    const ringtoneObj = SYSTEM_RINGTONES.find((r) => r.id === selectedRingtoneId) || SYSTEM_RINGTONES[0];

    const newMed: MedicationItem = {
      id: Date.now(),
      pillName: pillNameInput.trim(),
      dosage: dosageInput.trim() || (lang === 'ar' ? 'جرعة واحدة' : '1 Dose'),
      scheduledTime: timeInput,
      isCompleted: false,
      instructions: instructionsInput.trim() || (lang === 'ar' ? 'منبه مجدول' : 'Scheduled reminder'),
      ringtoneName: lang === 'ar' ? ringtoneObj.nameAr : ringtoneObj.nameEn,
      ringtoneUri: ringtoneObj.uri
    };

    setMeds([newMed, ...meds]);
    setPillNameInput('');
    setDosageInput('');
    setInstructionsInput('');
    showToast(lang === 'ar' ? `✓ تمت إضافة ${newMed.pillName} بنغمة: ${newMed.ringtoneName}` : `✓ Added ${newMed.pillName} with tone: ${newMed.ringtoneName}`);
  };

  const handleToggleMed = (id: number) => {
    setMeds(
      meds.map((m) =>
        m.id === id ? { ...m, isCompleted: !m.isCompleted } : m
      )
    );
  };

  const handleDeleteMed = (id: number) => {
    setMeds(meds.filter((m) => m.id !== id));
    showToast(lang === 'ar' ? 'تم حذف الدواء وإلغاء المنبه' : 'Medication deleted');
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(expenseAmountInput);
    if (isNaN(parsed) || parsed <= 0) return;

    const newExp: ExpenseItem = {
      id: Date.now(),
      amount: parsed,
      category: expenseCategoryInput,
      date: lang === 'ar' ? 'الآن' : 'Just now',
      note: expenseNoteInput.trim() || (lang === 'ar' ? 'مصروف' : 'Expense')
    };

    setExpenses([newExp, ...expenses]);
    setExpenseAmountInput('');
    setExpenseNoteInput('');
    showToast(lang === 'ar' ? `✓ تم تسجيل $${parsed.toFixed(2)} بنجاح` : `✓ Logged $${parsed.toFixed(2)} successfully`);
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter((e) => e.id !== id));
    showToast(lang === 'ar' ? 'تم حذف بند المصروف' : 'Expense record removed');
  };

  // Calculations for Expenses and Remaining Budget
  const totalExpenseAmount = useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const remainingBalance = useMemo(() => {
    return monthlyBudget - totalExpenseAmount;
  }, [monthlyBudget, totalExpenseAmount]);

  const budgetUsagePercent = useMemo(() => {
    if (monthlyBudget <= 0) return 0;
    return (totalExpenseAmount / monthlyBudget) * 100;
  }, [monthlyBudget, totalExpenseAmount]);

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(budgetTempInput);
    if (!isNaN(parsed) && parsed >= 0) {
      setMonthlyBudget(parsed);
      setIsEditingBudget(false);
      showToast(lang === 'ar' ? `✓ تم تحديث الميزانية الشهرية إلى $${parsed.toFixed(2)}` : `✓ Updated monthly budget to $${parsed.toFixed(2)}`);
    }
  };

  // Pie chart calculations
  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    const total = Object.values(map).reduce((a, b) => a + b, 0);
    const colors: Record<string, string> = {
      [t.cats.food]: '#3b82f6',
      [t.cats.medical]: '#10b981',
      [t.cats.transport]: '#f59e0b',
      [t.cats.utilities]: '#8b5cf6',
      [t.cats.housing]: '#ef4444',
      [t.cats.leisure]: '#ec4899',
      'Food & Groceries': '#3b82f6',
      'Medical & Health': '#10b981',
      'Transportation': '#f59e0b',
      'Utilities & Bills': '#8b5cf6',
      'Housing & Rent': '#ef4444',
      'Personal & Leisure': '#ec4899',
      'طعام ومشتريات': '#3b82f6',
      'صحة وأدوية': '#10b981',
      'مواصلات وبنزين': '#f59e0b',
      'فواتير وخدمات': '#8b5cf6',
      'سكن وإيجار': '#ef4444',
      'ترفيه ومصاريف شخصية': '#ec4899'
    };

    return Object.entries(map).map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
      color: colors[category] || '#64748b'
    }));
  }, [expenses, t]);

  const handleExportBackup = () => {
    const backupData = {
      appName: 'Family Assistant',
      exportedAt: new Date().toISOString(),
      monthlyBudget: monthlyBudget,
      medications: meds,
      expenses: expenses
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `family_assistant_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(lang === 'ar' ? '✓ تم تصدير ملف النسخة الاحتياطية بنجاح إلى جهازك!' : '✓ Backup exported to your device storage!');
  };

  const handleMarkTakenFromNotification = () => {
    handleToggleMed(2);
    setShowNotification(false);
    showToast(lang === 'ar' ? '✓ تم تأكيد أخذ الجرعة وتحديث السجل!' : '✓ Marked medication as taken!');
  };

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen font-sans transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-sm font-semibold animate-bounce border border-emerald-400/40 ${
            lang === 'ar' ? 'left-5' : 'right-5'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col min-h-screen">
        {/* App Top Bar */}
        <header
          className={`rounded-3xl p-4 sm:p-5 mb-5 border transition-all shadow-sm flex flex-wrap items-center justify-between gap-3 ${
            isDarkMode
              ? 'bg-slate-900/90 border-slate-800 backdrop-blur-md'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-indigo-600 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <div
                className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                  isDarkMode ? 'bg-slate-950 text-indigo-400' : 'bg-white text-indigo-600'
                }`}
              >
                <Pill className="w-5 h-5 text-rose-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-current">
                  {t.appName}
                </h1>
                <span className="text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {t.offlineBadge}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Language Selector */}
            <div
              className={`inline-flex items-center p-1 rounded-xl border ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => setLang('ar')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  lang === 'ar'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>🇸🇦</span>
                <span>عربي</span>
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  lang === 'en'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>🇺🇸</span>
                <span>EN</span>
              </button>
            </div>

            {/* Dark/Light mode */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl border transition-colors ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Export Backup Button */}
            <button
              onClick={handleExportBackup}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t.exportBackup}</span>
            </button>

            {/* Widget Preview Toggle */}
            <button
              onClick={() => setShowWidgetPreview(!showWidgetPreview)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                showWidgetPreview
                  ? 'bg-amber-600 text-white border-amber-500'
                  : isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
                  : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.widgetPreviewTitle}</span>
            </button>

            {/* Android Build Scripts Viewer Toggle */}
            <button
              onClick={() => setShowBuildConfigModal(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                showBuildConfigModal
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-indigo-400 hover:bg-slate-700'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
              }`}
              title="Android Build & Manifest Configuration"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{t.buildFilesBtn}</span>
            </button>
          </div>
        </header>

        {/* Android Build Config Modal */}
        {showBuildConfigModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div
              className={`w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-base sm:text-lg leading-tight">
                      {t.buildFilesModalTitle}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Gradle 8.7+ • Kotlin 2.0+ • Compose 35 • Room 2.6 • KSP • ProGuard
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowBuildConfigModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* File Selector Tabs */}
              <div className="flex items-center gap-1.5 p-3 overflow-x-auto border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/50">
                {(Object.keys(ANDROID_BUILD_CONFIG_FILES) as Array<keyof typeof ANDROID_BUILD_CONFIG_FILES>).map((key) => {
                  const file = ANDROID_BUILD_CONFIG_FILES[key];
                  const isSelected = selectedConfigFile === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedConfigFile(key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-500 dark:text-slate-400 hover:text-indigo-400 hover:bg-slate-800/40'
                      }`}
                    >
                      <span>{file.filename}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-black/20 text-white/90">
                        {file.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* File Details & Copy Bar */}
              <div className="px-5 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-950">
                <span className="font-mono text-slate-400">
                  {ANDROID_BUILD_CONFIG_FILES[selectedConfigFile].path}
                </span>

                <button
                  onClick={() =>
                    handleCopyCode(
                      ANDROID_BUILD_CONFIG_FILES[selectedConfigFile].code,
                      selectedConfigFile
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-sm"
                >
                  {copiedCodeKey === selectedConfigFile ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.copiedSuccess}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.copyCode}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Display Area */}
              <div className="flex-1 overflow-auto p-4 bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed select-text">
                <pre className="whitespace-pre overflow-x-auto">
                  <code>{ANDROID_BUILD_CONFIG_FILES[selectedConfigFile].code}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Live Notification Simulation Pop-up */}
        {showNotification && (
          <div className="mb-5 bg-gradient-to-r from-rose-600 to-rose-700 text-white p-4 rounded-3xl shadow-xl border border-rose-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in slide-in-from-top">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="font-extrabold text-sm">{t.notificationTitle}</div>
                <div className="text-xs text-rose-100">
                  {lang === 'ar' ? 'ميتفورمين (500 مجم) • مع وجبة الغداء' : 'Metformin HCl (500mg) • With lunch'}
                </div>
                <div className="text-[11px] text-rose-200 flex items-center gap-1 mt-0.5">
                  <Music className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'النغمة: أجراس الصدى المهدئة' : 'Tone: Echo Temple Bells'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleMarkTakenFromNotification}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white text-rose-700 font-bold text-xs hover:bg-rose-50 transition-colors shadow-sm"
              >
                {t.notificationActionTaken}
              </button>
              <button
                onClick={() => {
                  setShowNotification(false);
                  showToast(lang === 'ar' ? 'تم ضبط غفوة المنبه لمدة 10 دقائق' : 'Snoozed for 10 minutes');
                }}
                className="px-3 py-2 rounded-xl bg-rose-800/80 text-white text-xs font-medium hover:bg-rose-800"
              >
                {t.notificationActionSnooze}
              </button>
              <button
                onClick={() => setShowNotification(false)}
                className="p-1.5 text-rose-200 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Home Screen Glance Widget Live Mockup */}
        {showWidgetPreview && (
          <div
            className={`mb-5 p-4 rounded-3xl border transition-all ${
              isDarkMode
                ? 'bg-slate-900 border-amber-500/40'
                : 'bg-amber-50/70 border-amber-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                {t.widgetPreviewTitle}
              </span>
              <button
                onClick={() => setShowWidgetPreview(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-current">{t.widgetPillTitle}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{t.widgetPillTime}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast(lang === 'ar' ? 'تم تأكيد الجرعة من الويدجت!' : 'Pill marked taken via widget!')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                >
                  {t.widgetBtnTake}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('expenses');
                    showToast(lang === 'ar' ? 'تم فتح إضافة مصروف' : 'Opened expense logger');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                >
                  {t.widgetBtnAddExpense}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation Switcher */}
        <div
          className={`grid grid-cols-2 p-1.5 rounded-2xl mb-5 border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <button
            onClick={() => setActiveTab('meds')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'meds'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>{t.tabMeds}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">
              {meds.filter((m) => !m.isCompleted).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'expenses'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>{t.tabExpenses}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                remainingBalance < 0 ? 'bg-rose-500 text-white font-bold' : 'bg-white/20'
              }`}
            >
              ${totalExpenseAmount.toFixed(0)}
            </span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {activeTab === 'meds' ? (
            /* TAB 1: MEDICATIONS */
            <div className="space-y-4">
              {/* Upcoming Alarm Banner */}
              <div
                className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                  isDarkMode
                    ? 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400">
                    <Bell className="w-4 h-4" />
                    {t.nextAlarmTitle}
                  </span>
                  <span className="text-xs font-extrabold bg-rose-600 text-white px-2.5 py-0.5 rounded-full">
                    {t.inTime}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-1">
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-current">
                      {lang === 'ar' ? 'ميتفورمين Metformin HCl (500 مجم)' : 'Metformin HCl (500 mg)'}
                    </h3>
                    <p className="text-xs opacity-80 mt-0.5">
                      {lang === 'ar' ? 'الموعد: 01:30 م • مع وجبة الغداء' : 'Scheduled: 01:30 PM • With lunch'}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-300 font-semibold mt-1">
                      <Music className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'نغمة المنبه: أجراس الصدى المهدئة' : 'Ringtone: Echo Temple Bells'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playRingtoneSound('bell');
                      setShowNotification(true);
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{t.triggerTestAlarm}</span>
                  </button>
                </div>
              </div>

              {/* Today's Medications List */}
              <div
                className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-current flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <span>{t.todaySchedule} ({meds.length})</span>
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    {meds.filter((m) => m.isCompleted).length} / {meds.length} {t.takenDoses}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {meds.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                        item.isCompleted
                          ? isDarkMode
                            ? 'bg-slate-950/40 border-slate-800/80 opacity-60'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                          : isDarkMode
                          ? 'bg-slate-800/80 border-slate-700/80 shadow-sm'
                          : 'bg-slate-50/50 border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleMed(item.id)}
                          className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                            item.isCompleted
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-400 hover:border-emerald-500'
                          }`}
                        >
                          {item.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <div>
                          <h4
                            className={`text-sm font-bold ${
                              item.isCompleted ? 'line-through text-slate-400' : 'text-current'
                            }`}
                          >
                            {item.pillName}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {item.dosage}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-indigo-500 dark:text-indigo-400 font-semibold">
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3" />
                              {item.scheduledTime}
                            </span>
                            {item.instructions && (
                              <span className="text-slate-400">• {item.instructions}</span>
                            )}
                            {item.ringtoneName && (
                              <span className="flex items-center gap-1 text-rose-500 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md text-[11px]">
                                <Music className="w-2.5 h-2.5" />
                                {item.ringtoneName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => playRingtoneSound(item.ringtoneUri?.includes('103') ? 'bell' : item.ringtoneUri?.includes('101') ? 'gentle' : 'default')}
                          className="text-slate-400 hover:text-indigo-500 p-1.5 transition-colors"
                          title="Preview Ringtone"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMed(item.id)}
                          className="text-slate-400 hover:text-rose-500 p-1.5 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Medication Form (with Ringtone Picker) */}
              <form
                onSubmit={handleAddMed}
                className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <h3 className="font-bold text-sm text-current mb-3 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-rose-500" />
                  <span>{t.addPill}</span>
                </h3>

                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder={t.pillNamePlaceholder}
                    value={pillNameInput}
                    onChange={(e) => setPillNameInput(e.target.value)}
                    className={`w-full p-3 rounded-2xl border text-sm outline-none transition-colors ${
                      isDarkMode
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-rose-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-rose-500'
                    }`}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder={t.dosagePlaceholder}
                      value={dosageInput}
                      onChange={(e) => setDosageInput(e.target.value)}
                      className={`w-full p-3 rounded-2xl border text-sm outline-none transition-colors ${
                        isDarkMode
                          ? 'bg-slate-950 border-slate-800 text-white focus:border-rose-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-rose-500'
                      }`}
                    />

                    <input
                      type="text"
                      placeholder="09:00 AM"
                      value={timeInput}
                      onChange={(e) => setTimeInput(e.target.value)}
                      className={`w-full p-3 rounded-2xl border text-sm outline-none transition-colors ${
                        isDarkMode
                          ? 'bg-slate-950 border-slate-800 text-white focus:border-rose-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-rose-500'
                      }`}
                    />
                  </div>

                  {/* Ringtone Selection Field (RingtoneManager Simulator) */}
                  <div
                    className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isDarkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    <div className="flex-1 w-full">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
                        <Music className="w-3.5 h-3.5 text-rose-500" />
                        <span>{t.selectRingtoneLabel}</span>
                      </label>
                      <select
                        value={selectedRingtoneId}
                        onChange={(e) => {
                          setSelectedRingtoneId(e.target.value);
                          playRingtoneSound(e.target.value);
                        }}
                        className={`w-full p-2.5 rounded-xl border text-xs font-semibold outline-none ${
                          isDarkMode
                            ? 'bg-slate-900 border-slate-700 text-white'
                            : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      >
                        {SYSTEM_RINGTONES.map((tone) => (
                          <option key={tone.id} value={tone.id}>
                            {lang === 'ar' ? tone.nameAr : tone.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => playRingtoneSound()}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all w-full sm:w-auto mt-1 sm:mt-5 ${
                        isPlayingAudio
                          ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                          : isDarkMode
                          ? 'bg-slate-800 border-slate-700 text-rose-400 hover:bg-slate-700'
                          : 'bg-white border-slate-300 text-rose-600 hover:bg-slate-100 shadow-sm'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{isPlayingAudio ? t.playing : t.playTonePreview}</span>
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder={t.instructionsPlaceholder}
                    value={instructionsInput}
                    onChange={(e) => setInstructionsInput(e.target.value)}
                    className={`w-full p-3 rounded-2xl border text-sm outline-none transition-colors ${
                      isDarkMode
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-rose-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-rose-500'
                    }`}
                  />

                  <button
                    type="submit"
                    className="w-full bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-900/20 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.btnSavePill}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* TAB 2: EXPENSES & BUDGET */
            <div className="space-y-4">
              {/* TOP FINANCIAL SUMMARY CARD (3 COLUMNS: INCOME, EXPENSES, REMAINING) */}
              <div
                className={`p-4 sm:p-6 rounded-3xl border transition-all ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-800 shadow-xl'
                    : 'bg-white border-slate-200 shadow-md'
                }`}
              >
                {/* Header row with Edit Budget trigger */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-sm sm:text-base text-current">
                        {t.financialSummaryTitle}
                      </h2>
                      <span className="text-[11px] text-slate-400">
                        {remainingBalance < 0 ? (
                          <span className="text-rose-500 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {t.overBudgetWarning}
                          </span>
                        ) : (
                          <span className="text-emerald-500 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {t.safeBudgetStatus}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setBudgetTempInput(monthlyBudget.toString());
                      setIsEditingBudget(!isEditingBudget);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      isEditingBudget
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{t.editBudget}</span>
                  </button>
                </div>

                {/* Inline Edit Budget Input (shown when toggled) */}
                {isEditingBudget && (
                  <form
                    onSubmit={handleSaveBudget}
                    className={`p-3.5 mb-4 rounded-2xl border flex flex-col sm:flex-row items-center gap-2 animate-in fade-in ${
                      isDarkMode ? 'bg-slate-950 border-indigo-500/40' : 'bg-indigo-50/70 border-indigo-200'
                    }`}
                  >
                    <div className="flex-1 w-full">
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">
                        {t.budgetModalTitle}
                      </label>
                      <input
                        type="number"
                        step="10"
                        min="0"
                        value={budgetTempInput}
                        onChange={(e) => setBudgetTempInput(e.target.value)}
                        placeholder={t.budgetPlaceholder}
                        className={`w-full p-2.5 rounded-xl border text-sm font-bold outline-none ${
                          isDarkMode
                            ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                        }`}
                      />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-5">
                      <button
                        type="submit"
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                      >
                        {t.saveBudget}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingBudget(false)}
                        className="px-3 py-2.5 rounded-xl bg-slate-700/40 hover:bg-slate-700/60 text-slate-300 text-xs font-medium"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}

                {/* The 3 Columns Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {/* 1. إجمالي الدخل / الميزانية (Green / Emerald) */}
                  <div
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isDarkMode
                        ? 'bg-emerald-950/25 border-emerald-800/40'
                        : 'bg-emerald-50/70 border-emerald-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {t.incomeBudget}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                      ${monthlyBudget.toFixed(2)}
                    </div>
                    <span className="text-[11px] text-emerald-700/70 dark:text-emerald-300/60 mt-1">
                      {lang === 'ar' ? 'المخصص الشهري' : 'Allocated monthly'}
                    </span>
                  </div>

                  {/* 2. إجمالي المصروفات (Red / Rose / Orange) */}
                  <div
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isDarkMode
                        ? 'bg-rose-950/25 border-rose-800/40'
                        : 'bg-rose-50/70 border-rose-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                        {t.totalExpenses}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                        <TrendingDown className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
                      ${totalExpenseAmount.toFixed(2)}
                    </div>
                    <span className="text-[11px] text-rose-700/70 dark:text-rose-300/60 mt-1">
                      {expenses.length} {lang === 'ar' ? 'عمليات مسجلة' : 'logged records'}
                    </span>
                  </div>

                  {/* 3. المتبقي (Blue / Sky when positive, Bold Red when negative) */}
                  <div
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      remainingBalance < 0
                        ? 'bg-rose-500/20 border-rose-500/60 shadow-lg shadow-rose-950/20 animate-pulse'
                        : isDarkMode
                        ? 'bg-sky-950/25 border-sky-800/40'
                        : 'bg-sky-50/70 border-sky-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-xs font-bold ${
                          remainingBalance < 0
                            ? 'text-rose-600 dark:text-rose-400 font-black'
                            : 'text-sky-600 dark:text-sky-400'
                        }`}
                      >
                        {t.remainingBalance}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          remainingBalance < 0
                            ? 'bg-rose-600 text-white'
                            : 'bg-sky-500/15 text-sky-600 dark:text-sky-400'
                        }`}
                      >
                        {remainingBalance < 0 ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : (
                          <PiggyBank className="w-4 h-4" />
                        )}
                      </div>
                    </div>

                    <div
                      className={`text-xl sm:text-2xl font-black tracking-tight ${
                        remainingBalance < 0
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-sky-600 dark:text-sky-400'
                      }`}
                    >
                      {remainingBalance < 0 ? '-' : ''}${Math.abs(remainingBalance).toFixed(2)}
                    </div>

                    <span
                      className={`text-[11px] font-bold mt-1 ${
                        remainingBalance < 0
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-sky-700/70 dark:text-sky-300/60'
                      }`}
                    >
                      {remainingBalance < 0
                        ? t.overBudgetWarning
                        : `${(100 - Math.min(budgetUsagePercent, 100)).toFixed(0)}% ${
                            lang === 'ar' ? 'متبقي من الميزانية' : 'remaining'
                          }`}
                    </span>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {t.budgetConsumed}: {budgetUsagePercent.toFixed(1)}%
                    </span>
                    <span
                      className={`font-bold ${
                        budgetUsagePercent > 100
                          ? 'text-rose-500'
                          : budgetUsagePercent > 80
                          ? 'text-amber-500'
                          : 'text-emerald-500'
                      }`}
                    >
                      ${totalExpenseAmount.toFixed(0)} / ${monthlyBudget.toFixed(0)}
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        budgetUsagePercent > 100
                          ? 'bg-rose-500'
                          : budgetUsagePercent > 80
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Pie Chart Visualization */}
              <div
                className={`p-5 rounded-3xl border transition-all ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <h3 className="font-bold text-sm text-current mb-4">
                  {t.categoryChart}
                </h3>

                <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
                  {/* SVG Pie Chart */}
                  <div className="relative w-36 h-36 flex-shrink-0">
                    <svg viewBox="0 0 36 36" className="w-36 h-36 -rotate-90">
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="transparent"
                        stroke={isDarkMode ? '#1e293b' : '#e2e8f0'}
                        strokeWidth="3.5"
                      />
                      {(() => {
                        let accumulatedPercent = 0;
                        return categoryTotals.map((item, idx) => {
                          const strokeDasharray = `${item.percentage} ${100 - item.percentage}`;
                          const strokeDashoffset = -accumulatedPercent;
                          accumulatedPercent += item.percentage;
                          return (
                            <circle
                              key={idx}
                              cx="18"
                              cy="18"
                              r="15.9155"
                              fill="transparent"
                              stroke={item.color}
                              strokeWidth="4"
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                            />
                          );
                        });
                      })()}
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xs text-slate-400 font-medium">100%</span>
                      <span className="text-[11px] font-bold text-current">
                        {categoryTotals.length} {lang === 'ar' ? 'أقسام' : 'Cats'}
                      </span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full sm:w-auto">
                    {categoryTotals.map((cat, i) => (
                      <div
                        key={i}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-4 text-xs ${
                          isDarkMode
                            ? 'bg-slate-950 border-slate-800'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="font-semibold truncate">{cat.category}</span>
                        </span>
                        <span className="font-extrabold text-current">
                          {cat.percentage.toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Expenses List */}
              <div
                className={`p-5 rounded-3xl border transition-all ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <h3 className="font-bold text-sm text-current mb-3">
                  {t.recentExpenses}
                </h3>

                <div className="space-y-2">
                  {expenses.map((exp) => (
                    <div
                      key={exp.id}
                      className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                        isDarkMode
                          ? 'bg-slate-950 border-slate-800'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm text-current">{exp.category}</div>
                        {exp.note && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {exp.note}
                          </div>
                        )}
                        <div className="text-[10px] text-slate-400 mt-0.5">{exp.date}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-base text-rose-600 dark:text-rose-400">
                          ${exp.amount.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Expense Form */}
              <form
                onSubmit={handleAddExpense}
                className={`p-5 rounded-3xl border transition-all ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <h3 className="font-bold text-sm text-current mb-3 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-indigo-500" />
                  <span>{t.logExpense}</span>
                </h3>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder={t.amount}
                      value={expenseAmountInput}
                      onChange={(e) => setExpenseAmountInput(e.target.value)}
                      className={`w-full p-3 rounded-2xl border text-sm outline-none transition-colors ${
                        isDarkMode
                          ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                      }`}
                    />

                    <select
                      value={expenseCategoryInput}
                      onChange={(e) => setExpenseCategoryInput(e.target.value)}
                      className={`w-full p-3 rounded-2xl border text-sm outline-none transition-colors ${
                        isDarkMode
                          ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                      }`}
                    >
                      <option>{t.cats.food}</option>
                      <option>{t.cats.medical}</option>
                      <option>{t.cats.transport}</option>
                      <option>{t.cats.utilities}</option>
                      <option>{t.cats.housing}</option>
                      <option>{t.cats.leisure}</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    placeholder={t.notePlaceholder}
                    value={expenseNoteInput}
                    onChange={(e) => setExpenseNoteInput(e.target.value)}
                    className={`w-full p-3 rounded-2xl border text-sm outline-none transition-colors ${
                      isDarkMode
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                    }`}
                  />

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.btnSaveExpense}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Clean Footer */}
        <footer className="mt-8 py-3 text-center text-xs text-slate-400">
          Family Assistant • 100% Offline
        </footer>
      </div>
    </div>
  );
}
