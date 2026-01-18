-- AI Marketing Bootcamp - Seed Data
-- Run this in Supabase SQL Editor

-- Clear existing data
DELETE FROM beginners_modules WHERE true;
DELETE FROM beginners_tasks WHERE true;
DELETE FROM beginners_config WHERE true;
DELETE FROM beginners_content WHERE true;
DELETE FROM pro_modules WHERE true;
DELETE FROM pro_tasks WHERE true;
DELETE FROM pro_audiences WHERE true;
DELETE FROM pro_content WHERE true;

-- Beginners Modules
INSERT INTO beginners_modules (data) VALUES (
  '[
    {"id":1,"name":"יסודות שיווק (Foundations)","color":"#3b82f6","hours":15,"expanded":false,"order":1,"topics":[{"id":101,"name":"מודל משפך שיווקי (Funnel)","hours":2},{"id":102,"name":"הגדרת קהלי יעד וסגמנטציה","hours":2},{"id":103,"name":"הצעת ערך (Value Proposition)","hours":2},{"id":104,"name":"מסרים שיווקיים ממוקדי תועלת","hours":2},{"id":105,"name":"מבוא למדדים: CTR, CPC, CPM","hours":2},{"id":106,"name":"Testing Mindset ו-A/B Testing","hours":3},{"id":107,"name":"Customer Journey Mapping","hours":2}]},
    {"id":2,"name":"עסקי ופיננסי (Business)","color":"#f59e0b","hours":18,"expanded":false,"order":2,"topics":[{"id":201,"name":"מדדים עסקיים: ROI, CAC, ROAS, CLV","hours":3},{"id":202,"name":"דיסציפלינת תקציב וניהול Budget","hours":2},{"id":203,"name":"דיווח למנהלים ו-Stakeholders","hours":2},{"id":204,"name":"הקמת עסק עצמאי כמשווק","hours":2},{"id":205,"name":"תמחור שירותים ומודלים עסקיים","hours":2},{"id":206,"name":"קידום עצמי ובניית מותג אישי","hours":2},{"id":207,"name":"שיתופי פעולה ו-Networking","hours":1},{"id":208,"name":"אפיון פרויקטים ו-Briefing","hours":2},{"id":209,"name":"ניהול לקוחות ו-Retainer","hours":2}]},
    {"id":3,"name":"כלי AI לשיווק","color":"#8b5cf6","hours":32,"expanded":false,"order":3,"topics":[{"id":301,"name":"מפגש 1: מבוא לבינה מלאכותית והנדסת פרומפטים","hours":4},{"id":302,"name":"מפגש 2: ביצוע מחקרים ובניית סוכני AI","hours":4},{"id":303,"name":"מפגש 3: סיכום פגישות, עיבוד מסמכים ויצירת מצגות","hours":4},{"id":304,"name":"מפגש 4: יצירת תמונות וסרטונים בכלים חדשניים","hours":4},{"id":305,"name":"מפגש 5: אפיון עסקי, איסוף מידע ויצירת דשבורדים","hours":4},{"id":306,"name":"מפגש 6: דפי נחיתה, מיילים מעוצבים ואוטומציה","hours":4},{"id":307,"name":"מפגש 7: דפי נחיתה מתקדם + אוטומציות","hours":4},{"id":308,"name":"מפגש 8: פרויקט גמר AI","hours":4}]},
    {"id":4,"name":"קמפיינים ממומנים (PPC)","color":"#ef4444","hours":25,"expanded":false,"order":4,"topics":[{"id":401,"name":"Meta Ads: מבנה חשבון וקמפיין","hours":3},{"id":402,"name":"Meta Ads: קהלים ו-Targeting","hours":3},{"id":403,"name":"Meta Ads: Creative ו-Ad Copy","hours":3},{"id":404,"name":"Meta Ads: אופטימיזציה ו-Scaling","hours":2},{"id":405,"name":"Google Ads: Search Campaigns","hours":3},{"id":406,"name":"Google Ads: Display & YouTube","hours":2},{"id":407,"name":"Google Ads: Keywords ו-Match Types","hours":2},{"id":408,"name":"Remarketing ו-Retargeting","hours":2},{"id":409,"name":"TikTok Ads Basics","hours":2},{"id":410,"name":"LinkedIn Ads ל-B2B","hours":2},{"id":411,"name":"אינטגרציית AI בקמפיינים","hours":1}]},
    {"id":5,"name":"תוכן וסושיאל","color":"#ec4899","hours":15,"expanded":false,"order":5,"topics":[{"id":501,"name":"אסטרטגיית תוכן","hours":2},{"id":502,"name":"כתיבה לסושיאל: Facebook, Instagram","hours":2},{"id":503,"name":"כתיבה ל-LinkedIn","hours":1},{"id":504,"name":"Content Calendar וניהול תוכן","hours":2},{"id":505,"name":"יצירת Reels ו-Stories","hours":2},{"id":506,"name":"צילום בסיסי לסושיאל","hours":2},{"id":507,"name":"עריכת וידאו בסיסית","hours":2},{"id":508,"name":"Community Management","hours":2}]},
    {"id":6,"name":"אנליטיקה ומדידה","color":"#14b8a6","hours":12,"expanded":false,"order":6,"topics":[{"id":601,"name":"Google Analytics 4: Basics","hours":2},{"id":602,"name":"GA4: Events ו-Conversions","hours":2},{"id":603,"name":"Meta Pixel & CAPI","hours":2},{"id":604,"name":"Google Tag Manager","hours":2},{"id":605,"name":"Attribution Models","hours":2},{"id":606,"name":"דשבורדים ודיווח","hours":2}]}
  ]'::jsonb
);

-- Beginners Tasks
INSERT INTO beginners_tasks (data) VALUES (
  '[
    {"id":1,"text":"לברר מחירי מתחרים (SV College, HackerU, Bar-Ilan)","done":false,"category":"מחקר","owner":"לא משויך"},
    {"id":2,"text":"להשוות תכני סילבוס של מתחרים","done":false,"category":"מחקר","owner":"לא משויך"},
    {"id":3,"text":"לאסוף חוות דעת בוגרים על מתחרים","done":false,"category":"מחקר","owner":"לא משויך"},
    {"id":4,"text":"להחליט על משך ליווי אחרי סיום","done":false,"category":"החלטות","owner":"משותף"},
    {"id":5,"text":"להגדיר מודל תרגול (תקציבים אמיתיים?)","done":false,"category":"החלטות","owner":"משותף"},
    {"id":10,"text":"חברה רשומה ופעילה","done":false,"category":"משפטי ופיננסי","owner":"לא משויך"},
    {"id":11,"text":"חשבון בנק עסקי","done":false,"category":"משפטי ופיננסי","owner":"לא משויך"},
    {"id":12,"text":"מערכת חשבוניות","done":false,"category":"משפטי ופיננסי","owner":"לא משויך"},
    {"id":13,"text":"הסכם הרשמה מוכן","done":false,"category":"משפטי ופיננסי","owner":"לא משויך"},
    {"id":14,"text":"ביטוחים בתוקף","done":false,"category":"משפטי ופיננסי","owner":"לא משויך"},
    {"id":20,"text":"CRM מוגדר ופעיל","done":false,"category":"מכירות","owner":"לא משויך"},
    {"id":21,"text":"טלפוניה מחוברת","done":false,"category":"מכירות","owner":"לא משויך"},
    {"id":22,"text":"תסריטי מכירה מוכנים","done":false,"category":"מכירות","owner":"לא משויך"},
    {"id":23,"text":"צוות מכירות מאויש","done":false,"category":"מכירות","owner":"לא משויך"},
    {"id":30,"text":"מתחם 35+ מקומות","done":false,"category":"מיקום והפקה","owner":"לא משויך"},
    {"id":31,"text":"ציוד שמע-וידאו","done":false,"category":"מיקום והפקה","owner":"לא משויך"},
    {"id":32,"text":"אינטרנט יציב","done":false,"category":"מיקום והפקה","owner":"לא משויך"},
    {"id":33,"text":"Zoom היברידי","done":false,"category":"מיקום והפקה","owner":"לא משויך"},
    {"id":40,"text":"חומרי לימוד מוכנים","done":false,"category":"תוכן והוראה","owner":"לא משויך"},
    {"id":41,"text":"מרצים מאוישים","done":false,"category":"תוכן והוראה","owner":"לא משויך"},
    {"id":42,"text":"LMS פעיל","done":false,"category":"תוכן והוראה","owner":"לא משויך"},
    {"id":43,"text":"מערכת הגשות","done":false,"category":"תוכן והוראה","owner":"לא משויך"}
  ]'::jsonb
);

-- Beginners Config (with audiences)
INSERT INTO beginners_config (data) VALUES (
  '{
    "audiences": [
      {"id":1,"title":"בוגרי תואר רלוונטי","desc":"תואר בתקשורת, שיווק, מדעי החברה או עסקים — רוצים להיכנס לתחום השיווק הדיגיטלי"},
      {"id":2,"title":"מחליפי קריירה","desc":"עובדים בתחומים אחרים שרוצים לעבור לשיווק דיגיטלי — מחפשים הסבה מקצועית איכותית"},
      {"id":3,"title":"בעלי עסקים קטנים","desc":"רוצים ללמוד לשווק את העסק שלהם בעצמם — חוסכים עלויות ומקבלים שליטה"},
      {"id":4,"title":"עוזרי שיווק / ג׳וניורים","desc":"עובדים בתפקידי כניסה, רוצים לבנות בסיס מקצועי מוצק ולהתקדם לתפקידים בכירים"}
    ]
  }'::jsonb
);

-- Beginners Content
INSERT INTO beginners_content (vision, requirements, advantages) VALUES (
  'תוכנית הכשרה מקיפה לשיווק דיגיטלי עם AI - מיסודות השיווק ועד לכלים המתקדמים ביותר',
  '• אין צורך בניסיון קודם בשיווק דיגיטלי
• יכולת לעבוד עם מחשב ברמה בסיסית
• מוטיבציה ללמוד ולהתפתח בתחום
• נכונות להשקיע 10-15 שעות שבועיות בלימודים ותרגול',
  '• AI Ethics בכל מודולה — ללמוד מתי AI עוזר ומתי מסוכן
• 12 חודשי ליווי אחרי סיום התוכנית
• תיק עבודות עם השוואת AI vs. No-AI
• שקיפות מלאה בנתוני השמה'
);

-- Pro Modules
INSERT INTO pro_modules (data) VALUES (
  '[
    {"id":1,"name":"מבוא ל-AI ו-Prompt Engineering","color":"#1a1a2e","hours":4,"expanded":false,"order":1,"topics":[{"id":101,"name":"מה זה AI ואיך זה עובד (ברמה מעשית)","hours":1},{"id":102,"name":"הבדלים בין מודלים (GPT, Claude, Gemini)","hours":0.5},{"id":103,"name":"עקרונות Prompt Engineering","hours":1.5},{"id":104,"name":"תבניות Prompt לשיווק","hours":1}]},
    {"id":2,"name":"AI ליצירת תוכן שיווקי","color":"#16213e","hours":6,"expanded":false,"order":2,"topics":[{"id":201,"name":"כתיבת קופי לפרסום (Headlines, Ad Copy)","hours":1.5},{"id":202,"name":"יצירת תוכן לסושיאל (פוסטים, קרוסלות)","hours":1.5},{"id":203,"name":"Email Marketing עם AI","hours":1},{"id":204,"name":"Landing Pages — מבנה ותוכן","hours":1},{"id":205,"name":"בדיקת איכות ו-Brand Voice","hours":1}]},
    {"id":3,"name":"AI לאנליטיקס ודאטה","color":"#ec4899","hours":4,"expanded":false,"order":3,"topics":[{"id":301,"name":"ניתוח דאשבורדים עם AI","hours":1},{"id":302,"name":"סיכום ביצועים ודיווח","hours":1},{"id":303,"name":"זיהוי תובנות מנתונים","hours":1},{"id":304,"name":"שאלות לשאול את ה-AI על הדאטה","hours":1}]},
    {"id":4,"name":"AI לקריאייטיב ויזואלי","color":"#f59e0b","hours":4,"expanded":false,"order":4,"topics":[{"id":401,"name":"יצירת תמונות לפרסום (Midjourney, DALL-E)","hours":1.5},{"id":402,"name":"עריכת תמונות ו-Mockups","hours":1},{"id":403,"name":"יצירת סרטונים קצרים","hours":1},{"id":404,"name":"זכויות יוצרים ושימוש מסחרי","hours":0.5}]},
    {"id":5,"name":"AI Workflows ואוטומציה","color":"#22c55e","hours":6,"expanded":false,"order":5,"topics":[{"id":501,"name":"בניית Workflows עם AI","hours":1.5},{"id":502,"name":"אוטומציה עם Make/Zapier + AI","hours":2},{"id":503,"name":"AI Agents למשימות חוזרות","hours":1.5},{"id":504,"name":"אינטגרציה עם כלי שיווק קיימים","hours":1}]},
    {"id":6,"name":"AI Limitations, Ethics & Privacy","color":"#ef4444","hours":4,"expanded":false,"order":6,"topics":[{"id":601,"name":"Hallucinations — מה זה ואיך מזהים","hours":1},{"id":602,"name":"Biases ב-AI — סיכונים שיווקיים","hours":1},{"id":603,"name":"Privacy ו-GDPR עם AI","hours":1},{"id":604,"name":"מתי לא להשתמש ב-AI","hours":1}]},
    {"id":7,"name":"פרויקט גמר + Workshop","color":"#3b82f6","hours":4,"expanded":false,"order":7,"topics":[{"id":701,"name":"בניית AI Workflow אישי","hours":2},{"id":702,"name":"הצגת פרויקטים ו-Peer Review","hours":1.5},{"id":703,"name":"סיכום ו-Next Steps","hours":0.5}]}
  ]'::jsonb
);

-- Pro Tasks
INSERT INTO pro_tasks (data) VALUES (
  '[
    {"id":1,"text":"להכין חומרי הדרכה AI","done":false,"category":"תוכן והוראה","owner":"לא משויך"},
    {"id":2,"text":"לקבוע תאריכי מפגשים","done":false,"category":"מיקום והפקה","owner":"משותף"},
    {"id":3,"text":"להגדיר פרויקט גמר","done":false,"category":"תוכן והוראה","owner":"לא משויך"},
    {"id":4,"text":"לבנות דף מכירה Pro","done":false,"category":"מכירות","owner":"לא משויך"},
    {"id":5,"text":"להכין תסריט מכירה Pro","done":false,"category":"מכירות","owner":"לא משויך"}
  ]'::jsonb
);

-- Pro Audiences
INSERT INTO pro_audiences (data) VALUES (
  '[
    {"id":1,"title":"משווקים עם 1+ שנות ניסיון","desc":"בעלי ניסיון מעשי בשיווק דיגיטלי שרוצים לשדרג עם כלי AI"},
    {"id":2,"title":"מנהלי שיווק","desc":"מנהלים שרוצים להבין איך AI יכול לשפר את התוצאות של הצוות"},
    {"id":3,"title":"פרילנסרים","desc":"עצמאיים שרוצים להגביר פרודוקטיביות ולהציע שירותים מתקדמים יותר"}
  ]'::jsonb
);

-- Pro Content
INSERT INTO pro_content (vision) VALUES (
  'תוכנית Pro למשווקים מנוסים שרוצים לשלוט בכלי AI המתקדמים ביותר

תנאי קבלה:
• שנה+ ניסיון בשיווק דיגיטלי
• היכרות עם לפחות פלטפורמה אחת (Meta/Google/LinkedIn)
• יכולת לקרוא dashboard ולהבין מדדים בסיסיים

יתרונות:
• פוקוס מלא על AI ו-Prompt Engineering
• 8 מפגשים אינטנסיביים
• פרויקט גמר עם AI Workflow אישי
• גישה לכלי AI מתקדמים'
);

-- Verify data was inserted
SELECT 'beginners_modules' as table_name, count(*) as rows FROM beginners_modules
UNION ALL SELECT 'beginners_tasks', count(*) FROM beginners_tasks
UNION ALL SELECT 'beginners_config', count(*) FROM beginners_config
UNION ALL SELECT 'beginners_content', count(*) FROM beginners_content
UNION ALL SELECT 'pro_modules', count(*) FROM pro_modules
UNION ALL SELECT 'pro_tasks', count(*) FROM pro_tasks
UNION ALL SELECT 'pro_audiences', count(*) FROM pro_audiences
UNION ALL SELECT 'pro_content', count(*) FROM pro_content;
