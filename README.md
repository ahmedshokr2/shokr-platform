# Ahmed Shokr Store — أحدث حزمة ملفات

## الملفات
- `index.html`, `style.css`, `script.js`: واجهة المتجر والطلبات.
- `firebase-config.js`: إعدادات مشروع Firebase (أكمل الحقول الموضحة).
- `login.html`, `login.js`: تسجيل الدخول وإنشاء الحساب وإعادة تعيين كلمة المرور.
- `admin.html`, `admin.js`: لوحة المدير، لا تظهر في قائمة العملاء، وتتحقق من UID.
- `firestore.rules`: قواعد Firestore المقترحة.

## قبل رفع الملفات
1. احتفظ بنسخة احتياطية من ملفات موقعك الحالية.
2. افتح Firebase Console > Project settings > Your apps > Web app، وانسخ إعدادات `firebaseConfig` الحقيقية إلى `firebase-config.js`. لا تترك `PASTE_...`.
3. من Firebase Console > Authentication > Sign-in method، فعّل Email/Password وAnonymous.
4. في Authentication > Settings > Authorized domains، تأكد من إضافة `ahmedshokr2.github.io`.
5. افتح Firestore Database > Rules، راجع `firestore.rules` ثم انشرها. تأكد أن UID المدير في القواعد و`admin.js` هو UID الحقيقي لحساب المدير قبل النشر.
6. ارفع الملفات إلى جذر مستودع GitHub نفسه. لا تحذف ملفات أخرى قبل التأكد من استخدامها.
7. انتظر تحديث GitHub Pages ثم جرّب الطلب ببيانات اختبار.

## ملاحظات أمان مهمة
- إخفاء رابط لوحة الإدارة لا يجعل الملف سريًا؛ الحماية الأساسية هي قواعد Firestore والتحقق من UID.
- طلبات الزائر ترتبط بمعرّف Firebase مجهول على نفس المتصفح/الجهاز. لا تضمن استعادتها بعد مسح بيانات المتصفح أو الانتقال لجهاز آخر.
- لا تطلب من العميل كلمة مرور تطبيق أنا فودافون أو رمز OTP. لا تجمع بيانات الدخول السرية للعملاء.
- هذا المشروع لا يتحقق تلقائيًا من وصول التحويل البنكي؛ المدير يراجع الدفع يدويًا.
- إذا ظهر `permission-denied`، لا تفتح القواعد للجميع. تحقق من نشر القواعد، إعدادات Auth، تطابق UID، وحقول الطلب.
