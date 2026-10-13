import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, getDocs, query, orderBy, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
const ADMIN_UID="BTxztpHJrPYPikfFEmOonyEvy1Z2", $=id=>document.getElementById(id);
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
const say=(s,k="")=>{$("adminMessage").textContent=s;$("adminMessage").className="message "+k};
$("logoutBtn").onclick=async()=>{await signOut(auth);location.href="login.html"};
onAuthStateChanged(auth,async user=>{
 if(!user||user.uid!==ADMIN_UID){say("غير مصرح لك بفتح لوحة الإدارة. سجّل الدخول بحساب المدير.","error");$("adminOrders").innerHTML="";return}
 say("تم التحقق من حساب المدير.");
 try{
  const snap=await getDocs(query(collection(db,"orders"),orderBy("createdAt","desc")));
  $("adminOrders").innerHTML=snap.empty?"لا توجد طلبات.":snap.docs.map(d=>{const x=d.data();return `<article class="order-item"><strong>${x.bundleName||"باقة"} — ${x.price} جنيه</strong><p>رقم الطلب: ${d.id}</p><p>العميل: ${x.name||"-"} · الهاتف: ${x.phone||"-"}</p><p>الدفع: ${x.paymentMethod||"-"} · مرجع: ${x.paymentReference||"-"}</p><p>الحالة: ${x.status||"بانتظار المراجعة"}</p><button class="btn" data-id="${d.id}" data-status="تم التأكيد">تأكيد الطلب</button> <button class="btn" data-id="${d.id}" data-status="مرفوض">رفض الطلب</button></article>`}).join("");
  $("adminOrders").querySelectorAll("button[data-id]").forEach(b=>b.onclick=async()=>{try{await updateDoc(doc(db,"orders",b.dataset.id),{status:b.dataset.status,paymentStatus:b.dataset.status});location.reload()}catch(e){say("تعذر تحديث الطلب. راجع قواعد Firestore.","error")}});
 }catch(e){say("تعذر تحميل الطلبات. راجع قواعد Firestore وصلاحية المدير.","error")}
});
