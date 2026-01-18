-- Supabase Seed Data for AI Marketing Bootcamp
-- Run this in Supabase SQL Editor

-- =============================================
-- MODULES - Beginners Program
-- =============================================

INSERT INTO modules (program, name, color, hours, sort_order, topics) VALUES
(
  'beginners',
  'יסודות שיווק (Foundations)',
  '#3b82f6',
  15,
  1,
  '[
    {"id": 101, "name": "מודל משפך שיווקי (Funnel)", "hours": 2},
    {"id": 102, "name": "הגדרת קהלי יעד וסגמנטציה", "hours": 2},
    {"id": 103, "name": "הצעת ערך (Value Proposition)", "hours": 2},
    {"id": 104, "name": "מסרים שיווקיים ממוקדי תועלת", "hours": 2},
    {"id": 105, "name": "מבוא למדדים: CTR, CPC, CPM", "hours": 2},
    {"id": 106, "name": "Testing Mindset ו-A/B Testing", "hours": 3},
    {"id": 107, "name": "Customer Journey Mapping", "hours": 2}
  ]'::jsonb
),
(
  'beginners',
  'עסקי ופיננסי (Business)',
  '#f59e0b',
  18,
  2,
  '[
    {"id": 201, "name": "מדדים עסקיים: ROI, CAC, ROAS, CLV", "hours": 3},
    {"id": 202, "name": "דיסציפלינת תקציב וניהול Budget", "hours": 2},
    {"id": 203, "name": "דיווח למנהלים ו-Stakeholders", "hours": 2},
    {"id": 204, "name": "הקמת עסק עצמאי כמשווק", "hours": 2},
    {"id": 205, "name": "תמחור שירותים ומודלים עסקיים", "hours": 2},
    {"id": 206, "name": "קידום עצמי ובניית מותג אישי", "hours": 2},
    {"id": 207, "name": "שיתופי פעולה ו-Networking", "hours": 1},
    {"id": 208, "name": "אפיון פרויקטים ו-Briefing", "hours": 2},
    {"id": 209, "name": "ניהול לקוחות ו-Retainer", "hours": 2}
  ]'::jsonb
),
(
  'beginners',
  'כלי AI לשיווק (מבוסס AI Ready)',
  '#8b5cf6',
  32,
  3,
  '[
    {"id": 301, "name": "מפגש 1: מבוא לבינה מלאכותית והנדסת פרומפטים", "hours": 4, "desc": "היכרות עם מודלי שפה, הבדלים בין מודלים, עקרונות חשיבה ובקשות מדויקות, ChatGPT לעומק"},
    {"id": 302, "name": "מפגש 2: ביצוע מחקרים ובניית סוכני AI", "hours": 4, "desc": "בניית סוכנים ב-GPT, מחקר שוק, זיהוי קהלים, הגדרת פרסונות, תהליכי חשיבה ויצירת תוכניות"},
    {"id": 303, "name": "מפגש 3: סיכום פגישות, עיבוד מסמכים ויצירת מצגות", "hours": 4, "desc": "GenSpark, NotebookLM, תמלול פגישות, סיכום מידע, עיבוד טקסטים, יצירת מצגות מקצועיות"},
    {"id": 304, "name": "מפגש 4: יצירת תמונות וסרטונים בכלים חדשניים", "hours": 4, "desc": "Node-based editing, Nano Banana Pro, יצירה מהירה של תמונות וסרטונים, עריכה ונגיעות סיום"},
    {"id": 305, "name": "מפגש 5: אפיון עסקי, איסוף מידע ויצירת דשבורדים", "hours": 4, "desc": "Lovable לאפיון, איסוף ועיבוד מידע, BPMN ו-RACI, ניתוח שבועי, דשבורדים לצוות מכירות"},
    {"id": 306, "name": "מפגש 6: דפי נחיתה, מיילים מעוצבים ואוטומציה", "hours": 4, "desc": "דפי נחיתה עם HTML ו-CSS, יצירת תבנית מיילים, פיתוח מקטעים, אוטומציות Zapier/Make"},
    {"id": 307, "name": "מפגש 7: דפי נחיתה מתקדם + אוטומציות", "hours": 4, "desc": "עיצוב בעזרת AI, שיפור ברורות, אופטימיזציה של קוד, חיבור לאוטומציות בסיסי וסיכום"},
    {"id": 308, "name": "מפגש 8: פרויקט גמר AI", "hours": 4, "desc": "שילוב כל הכלים, אפיון מחדש, פתרון בעיות עם AI, הצגה, סוג AI, בוס מצגת"}
  ]'::jsonb
),
(
  'beginners',
  'קמפיינים ממומנים (PPC)',
  '#ef4444',
  25,
  4,
  '[
    {"id": 401, "name": "Meta Ads: מבנה חשבון וקמפיין", "hours": 3},
    {"id": 402, "name": "Meta Ads: קהלים ו-Targeting", "hours": 3},
    {"id": 403, "name": "Meta Ads: Creative ו-Ad Copy", "hours": 3},
    {"id": 404, "name": "Meta Ads: אופטימיזציה ו-Scaling", "hours": 2},
    {"id": 405, "name": "Google Ads: Search Campaigns", "hours": 3},
    {"id": 406, "name": "Google Ads: Display & YouTube", "hours": 2},
    {"id": 407, "name": "Google Ads: Keywords ו-Match Types", "hours": 2},
    {"id": 408, "name": "Remarketing ו-Retargeting", "hours": 2},
    {"id": 409, "name": "TikTok Ads Basics", "hours": 2},
    {"id": 410, "name": "LinkedIn Ads ל-B2B", "hours": 2},
    {"id": 411, "name": "אינטגרציית AI בקמפיינים", "hours": 1}
  ]'::jsonb
),
(
  'beginners',
  'תוכן וסושיאל',
  '#ec4899',
  15,
  5,
  '[
    {"id": 501, "name": "אסטרטגיית תוכן", "hours": 2},
    {"id": 502, "name": "כתיבה לסושיאל: Facebook, Instagram", "hours": 2},
    {"id": 503, "name": "כתיבה ל-LinkedIn", "hours": 1},
    {"id": 504, "name": "Content Calendar וניהול תוכן", "hours": 2},
    {"id": 505, "name": "יצירת Reels ו-Stories", "hours": 2},
    {"id": 506, "name": "צילום בסיסי לסושיאל", "hours": 2},
    {"id": 507, "name": "עריכת וידאו בסיסית", "hours": 2},
    {"id": 508, "name": "Community Management", "hours": 2}
  ]'::jsonb
),
(
  'beginners',
  'אנליטיקה ומדידה',
  '#14b8a6',
  12,
  6,
  '[
    {"id": 601, "name": "Google Analytics 4: Basics", "hours": 2},
    {"id": 602, "name": "GA4: Events ו-Conversions", "hours": 2},
    {"id": 603, "name": "Meta Pixel & CAPI", "hours": 2},
    {"id": 604, "name": "Google Tag Manager", "hours": 2},
    {"id": 605, "name": "Attribution Models", "hours": 2},
    {"id": 606, "name": "דשבורדים ודיווח", "hours": 2}
  ]'::jsonb
);

-- =============================================
-- MODULES - Pro Program
-- =============================================

INSERT INTO modules (program, name, color, hours, sort_order, topics) VALUES
(
  'pro',
  'מבוא ל-AI ו-Prompt Engineering',
  '#1a1a2e',
  4,
  1,
  '[
    {"id": 101, "name": "מה זה AI ואיך זה עובד (ברמה מעשית)", "hours": 1},
    {"id": 102, "name": "הבדלים בין מודלים (GPT, Claude, Gemini)", "hours": 0.5},
    {"id": 103, "name": "עקרונות Prompt Engineering", "hours": 1.5},
    {"id": 104, "name": "תבניות Prompt לשיווק", "hours": 1}
  ]'::jsonb
),
(
  'pro',
  'AI ליצירת תוכן שיווקי',
  '#16213e',
  6,
  2,
  '[
    {"id": 201, "name": "כתיבת קופי לפרסום (Headlines, Ad Copy)", "hours": 1.5},
    {"id": 202, "name": "יצירת תוכן לסושיאל (פוסטים, קרוסלות)", "hours": 1.5},
    {"id": 203, "name": "Email Marketing עם AI", "hours": 1},
    {"id": 204, "name": "Landing Pages — מבנה ותוכן", "hours": 1},
    {"id": 205, "name": "בדיקת איכות ו-Brand Voice", "hours": 1}
  ]'::jsonb
),
(
  'pro',
  'AI לאנליטיקס ודאטה',
  '#ec4899',
  4,
  3,
  '[
    {"id": 301, "name": "ניתוח דאשבורדים עם AI", "hours": 1},
    {"id": 302, "name": "סיכום ביצועים ודיווח", "hours": 1},
    {"id": 303, "name": "זיהוי תובנות מנתונים", "hours": 1},
    {"id": 304, "name": "שאלות לשאול את ה-AI על הדאטה", "hours": 1}
  ]'::jsonb
),
(
  'pro',
  'AI לקריאייטיב ויזואלי',
  '#f59e0b',
  4,
  4,
  '[
    {"id": 401, "name": "יצירת תמונות לפרסום (Midjourney, DALL-E)", "hours": 1.5},
    {"id": 402, "name": "עריכת תמונות ו-Mockups", "hours": 1},
    {"id": 403, "name": "יצירת סרטונים קצרים", "hours": 1},
    {"id": 404, "name": "זכויות יוצרים ושימוש מסחרי", "hours": 0.5}
  ]'::jsonb
),
(
  'pro',
  'AI Workflows ואוטומציה',
  '#22c55e',
  6,
  5,
  '[
    {"id": 501, "name": "בניית Workflows עם AI", "hours": 1.5},
    {"id": 502, "name": "אוטומציה עם Make/Zapier + AI", "hours": 2},
    {"id": 503, "name": "AI Agents למשימות חוזרות", "hours": 1.5},
    {"id": 504, "name": "אינטגרציה עם כלי שיווק קיימים", "hours": 1}
  ]'::jsonb
),
(
  'pro',
  'AI Limitations, Ethics & Privacy',
  '#ef4444',
  4,
  6,
  '[
    {"id": 601, "name": "Hallucinations — מה זה ואיך מזהים", "hours": 1},
    {"id": 602, "name": "Biases ב-AI — סיכונים שיווקיים", "hours": 1},
    {"id": 603, "name": "Privacy ו-GDPR עם AI", "hours": 1},
    {"id": 604, "name": "מתי לא להשתמש ב-AI", "hours": 1}
  ]'::jsonb
),
(
  'pro',
  'פרויקט גמר + Workshop',
  '#3b82f6',
  4,
  7,
  '[
    {"id": 701, "name": "בניית AI Workflow אישי", "hours": 2},
    {"id": 702, "name": "הצגת פרויקטים ו-Peer Review", "hours": 1.5},
    {"id": 703, "name": "סיכום ו-Next Steps", "hours": 0.5}
  ]'::jsonb
);

-- =============================================
-- AUDIENCES - Beginners Program
-- =============================================

INSERT INTO audiences (program, title, description) VALUES
('beginners', 'בוגרי תואר רלוונטי', 'תואר בתקשורת, שיווק, מדעי החברה או עסקים — רוצים להיכנס לתחום השיווק הדיגיטלי'),
('beginners', 'מחליפי קריירה', 'עובדים בתחומים אחרים שרוצים לעבור לשיווק דיגיטלי — מחפשים הסבה מקצועית איכותית'),
('beginners', 'בעלי עסקים קטנים', 'רוצים ללמוד לשווק את העסק שלהם בעצמם — חוסכים עלויות ומקבלים שליטה'),
('beginners', 'עוזרי שיווק / ג׳וניורים', 'עובדים בתפקידי כניסה, רוצים לבנות בסיס מקצועי מוצק ולהתקדם לתפקידים בכירים');

-- =============================================
-- AUDIENCES - Pro Program
-- =============================================

INSERT INTO audiences (program, title, description) VALUES
('pro', 'משווקים עם 1+ שנות ניסיון', 'בעלי ניסיון מעשי בשיווק דיגיטלי שרוצים לשדרג עם כלי AI'),
('pro', 'מנהלי שיווק', 'מנהלים שרוצים להבין איך AI יכול לשפר את התוצאות של הצוות'),
('pro', 'פרילנסרים', 'עצמאיים שרוצים להגביר פרודוקטיביות ולהציע שירותים מתקדמים יותר');

-- =============================================
-- TASKS - Beginners Program
-- =============================================

INSERT INTO tasks (program, text, done, category, owner) VALUES
-- מחקר
('beginners', 'לברר מחירי מתחרים (SV College, HackerU, Bar-Ilan)', false, 'מחקר', 'לא משויך'),
('beginners', 'להשוות תכני סילבוס של מתחרים', false, 'מחקר', 'לא משויך'),
('beginners', 'לאסוף חוות דעת בוגרים על מתחרים', false, 'מחקר', 'לא משויך'),
-- החלטות
('beginners', 'להחליט על משך ליווי אחרי סיום', false, 'החלטות', 'משותף'),
('beginners', 'להגדיר מודל תרגול (תקציבים אמיתיים?)', false, 'החלטות', 'משותף'),
-- משפטי ופיננסי
('beginners', 'חברה רשומה ופעילה', false, 'משפטי ופיננסי', 'לא משויך'),
('beginners', 'חשבון בנק עסקי', false, 'משפטי ופיננסי', 'לא משויך'),
('beginners', 'מערכת חשבוניות', false, 'משפטי ופיננסי', 'לא משויך'),
('beginners', 'הסכם הרשמה מוכן', false, 'משפטי ופיננסי', 'לא משויך'),
('beginners', 'ביטוחים בתוקף', false, 'משפטי ופיננסי', 'לא משויך'),
-- מכירות
('beginners', 'CRM מוגדר ופעיל', false, 'מכירות', 'לא משויך'),
('beginners', 'טלפוניה מחוברת', false, 'מכירות', 'לא משויך'),
('beginners', 'תסריטי מכירה מוכנים', false, 'מכירות', 'לא משויך'),
('beginners', 'צוות מכירות מאויש', false, 'מכירות', 'לא משויך'),
-- מיקום והפקה
('beginners', 'מתחם 35+ מקומות', false, 'מיקום והפקה', 'לא משויך'),
('beginners', 'ציוד שמע-וידאו', false, 'מיקום והפקה', 'לא משויך'),
('beginners', 'אינטרנט יציב', false, 'מיקום והפקה', 'לא משויך'),
('beginners', 'Zoom היברידי', false, 'מיקום והפקה', 'לא משויך'),
-- תוכן והוראה
('beginners', 'חומרי לימוד מוכנים', false, 'תוכן והוראה', 'לא משויך'),
('beginners', 'מרצים מאוישים', false, 'תוכן והוראה', 'לא משויך'),
('beginners', 'LMS פעיל', false, 'תוכן והוראה', 'לא משויך'),
('beginners', 'מערכת הגשות', false, 'תוכן והוראה', 'לא משויך');

-- =============================================
-- TASKS - Pro Program
-- =============================================

INSERT INTO tasks (program, text, done, category, owner) VALUES
('pro', 'להכין חומרי הדרכה AI', false, 'תוכן והוראה', 'לא משויך'),
('pro', 'לקבוע תאריכי מפגשים', false, 'מיקום והפקה', 'משותף'),
('pro', 'להגדיר פרויקט גמר', false, 'תוכן והוראה', 'לא משויך'),
('pro', 'לבנות דף מכירה Pro', false, 'מכירות', 'לא משויך'),
('pro', 'להכין תסריט מכירה Pro', false, 'מכירות', 'לא משויך');

-- =============================================
-- EDITABLE CONTENT - Beginners
-- =============================================

INSERT INTO editable_content (program, section_key, content) VALUES
('beginners', 'requirements', '• אין צורך בניסיון קודם בשיווק דיגיטלי
• יכולת לעבוד עם מחשב ברמה בסיסית
• מוטיבציה ללמוד ולהתפתח בתחום
• נכונות להשקיע 10-15 שעות שבועיות בלימודים ותרגול'),
('beginners', 'advantages', '• AI Ethics בכל מודולה — ללמוד מתי AI עוזר ומתי מסוכן
• 12 חודשי ליווי אחרי סיום התוכנית
• תיק עבודות עם השוואת AI vs. No-AI
• שקיפות מלאה בנתוני השמה');

-- =============================================
-- EDITABLE CONTENT - Pro
-- =============================================

INSERT INTO editable_content (program, section_key, content) VALUES
('pro', 'requirements', '• שנה+ ניסיון בשיווק דיגיטלי
• היכרות עם לפחות פלטפורמה אחת (Meta/Google/LinkedIn)
• יכולת לקרוא dashboard ולהבין מדדים בסיסיים'),
('pro', 'advantages', '• פוקוס מלא על AI ו-Prompt Engineering
• 8 מפגשים אינטנסיביים
• פרויקט גמר עם AI Workflow אישי
• גישה לכלי AI מתקדמים');
