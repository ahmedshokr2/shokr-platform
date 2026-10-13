import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const bundles = [
 {id:"flex10400",name:"فليكس 10400",category:"vodafone",price:250,description:"باقة فليكس — تفعيل بعد مراجعة الدفع"},
 {id:"flex6500",name:"فليكس 6500",category:"vodafone",price:140,description:"باقة فليكس"},
 {id:"flex2600",name:"فليكس 2600",category:"vodafone",price:80,description:"باقة فليكس"},
 {id:"flex1300",name:"فليكس 1300",category:"vodafone",price:50,description:"باقة فليكس"},
 {id:"internet",name:"إنترنت 18–20 ألف ميجا",category:"vodafone",price:320,description:"باقة إنترنت حسب العرض المتاح"},
 {id:"we20",name:"WE 20 جيجا",category:"we",price:280,description:"20GB + 1500 وحدة/دقيقة حسب العرض"},
 {id:"we30",name:"WE 30 جيجا",category:"we",price:340,description:"30GB + 1500 وحدة/دقيقة حسب العرض"},
 {id:"we40",name:"WE 40 جيجا",category:"we",price:440,description:"40GB + 2000 وحدة/دقيقة حسب العرض"},
 {id:"we50",name:"WE 50 جيجا",category:"we",price:520,description:"50GB + 2000 وحدة/دقيقة حسب العرض"},
 {id:"we60",name:"WE 60 جيجا",category:"we",price:580,description:"60GB + 2000 وحدة/دقيقة حسب العرض"},
 {id:"we70",name:"WE 70 جيجا",category:"we",price:660,description:"70GB + 2500 وحدة/دقيقة حسب العرض"}
];
const $ = id => document.getElementById(id);
$("year").textContent = new Date().getFullYear();
$("menuToggle").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
$("themeToggle").addEventListener("click",()=>{document.body.classList.toggle("dark");localStorage.setItem("as-theme",document.body.classList.contains("dark")?"dark":"light")});
if(localStorage.getItem("as-theme")==="dark") document.body.classList.add("dark");

function card(b){return `<article class="bundle-card"><h3>${b.name}</h3><p>${b.description}</p><div class="price">${b.price} جنيه</div><button class="btn" data-bundle="${b.id}">اطلب الباقة</button></article>`}
$("vodafoneGrid").innerHTML=bundles.filter(b=>b.category==="vodafone").map(card).join("");
$("weGrid").innerHTML=bundles.filter(b=>b.category==="we").map(card).join("");
$("bundleId").insertAdjacentHTML("beforeend",bundles.map(b=>`<option value="${b.id}">${b.name} — ${b.price} جنيه</option>`).join(""));
document.addEventListener("click",e=>{const b=e.target.closest("[data-bundle]");if(b){$("bundleId").value=b.dataset.bundle;$("order").scrollIntoView({behavior:"smooth"});$("sidebar").classList.remove("open")}});

let app,auth,db,currentUser;
const message=(txt,type="")=>{ $("orderMessage").textContent=txt;$("orderMessage").className=`message ${type}` };
const configReady=firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("PASTE_") && firebaseConfig.messagingSenderId && !firebaseConfig.messagingSenderId.startsWith("PASTE_");
if(configReady){
 try{
  app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);
  onAuthStateChanged(auth,async user=>{currentUser=user;if(!user){try{await signInAnonymously(auth)}catch(err){console.error(err);message("تعذر بدء جلسة الزائر. فعّل Anonymous في Firebase Authentication.", "error")}}else{loadOrders(user)}});
 }catch(e){console.error(e);message("تعذر الاتصال بـFirebase. راجع firebase-config.js.", "error")}
}else{message("قبل تشغيل الطلبات: ضع إعدادات Web App الحقيقية داخل firebase-config.js.", "error")}

async function loadOrders(user){
 const target=$("myOrders");
 if(!db||!user){target.innerHTML='<p class="muted">سجل الطلبات غير متاح حاليًا.</p>';return}
 if(user.isAnonymous){target.innerHTML='<p class="muted">طلبات الزائر محفوظة لهذا المتصفح/الجهاز فقط. سجل الدخول بحسابك لمتابعة الطلبات المرتبطة به.</p>';return}
 try{
  const q=query(collection(db,"orders"),where("ownerUid","==",user.uid),orderBy("createdAt","desc"));
  const snap=await getDocs(q);
  target.innerHTML=snap.empty?'<p class="muted">لا توجد طلبات مرتبطة بهذا الحساب حتى الآن.</p>':snap.docs.map(d=>{const x=d.data();return `<article class="order-item"><strong>${x.bundleName||"باقة"}</strong><p>رقم الطلب: ${d.id}</p><p>السعر: ${x.price} جنيه</p><p>الحالة: ${x.status||"بانتظار المراجعة"}</p></article>`}).join("");
 }catch(e){console.error(e);target.innerHTML='<p class="muted">تعذر تحميل الطلبات. راجع صلاحيات Firestore.</p>'}
}
$("orderForm").addEventListener("submit",async e=>{
 e.preventDefault();
 if(!db||!auth){message("إعدادات Firebase غير مكتملة. افتح README واتبع الخطوات.", "error");return}
 const b=bundles.find(x=>x.id===$("bundleId").value);
 if(!b){message("اختر باقة صحيحة.", "error");return}
 $("submitOrder").disabled=true;message("جارٍ إرسال الطلب…");
 try{
  if(!currentUser){await new Promise((resolve,reject)=>{const off=onAuthStateChanged(auth,u=>{if(u){currentUser=u;off();resolve()} });setTimeout(()=>reject(new Error("auth-timeout")),10000)})}
  const payload={ownerUid:currentUser.uid,customerEmail:currentUser.isAnonymous?null:(currentUser.email||null),name:$("customerName").value.trim(),phone:$("phone").value.trim(),bundleId:b.id,bundleName:b.name,price:b.price,note:$("note").value.trim(),paymentMethod:$("paymentMethod").value,paymentReference:$("paymentReference").value.trim(),paymentStatus:"بانتظار المراجعة",status:"بانتظار المراجعة",createdAt:serverTimestamp()};
  const ref=await addDoc(collection(db,"orders"),payload);
  message(`تم استلام طلبك. رقم الطلب: ${ref.id}. سيظل بانتظار المراجعة حتى تأكيد الدفع.`, "success");
  $("orderForm").reset();loadOrders(currentUser);
 }catch(err){console.error(err);message(err.code==="permission-denied"?"تم رفض الطلب من Firestore. راجع firestore.rules وتأكد من نشرها وتفعيل Anonymous Authentication.":"لم نتمكن من إرسال الطلب. تحقق من الإنترنت وإعدادات Firebase ثم حاول مجددًا.","error")}
 finally{$("submitOrder").disabled=false}
});
