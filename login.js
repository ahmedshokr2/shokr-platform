import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";
const $=id=>document.getElementById(id), msg=(t,kind="")=>{$("authMessage").textContent=t;$("authMessage").className="message "+kind};
if(!firebaseConfig.apiKey||firebaseConfig.apiKey.startsWith("PASTE_")){msg("أكمل إعدادات Firebase في firebase-config.js أولًا.","error")}
else{
 const auth=getAuth(initializeApp(firebaseConfig));
 const vals=()=>({email:$("email").value.trim(),password:$("password").value});
 $("loginBtn").onclick=async()=>{const {email,password}=vals();try{await signInWithEmailAndPassword(auth,email,password);msg("تم تسجيل الدخول. يمكنك العودة للمتجر.","success");setTimeout(()=>location.href="index.html",700)}catch(e){msg("تعذر تسجيل الدخول. راجع البريد وكلمة المرور.","error")}};
 $("registerBtn").onclick=async()=>{const {email,password}=vals();if(password.length<6)return msg("كلمة المرور يجب أن تكون 6 أحرف على الأقل.","error");try{await createUserWithEmailAndPassword(auth,email,password);msg("تم إنشاء الحساب وتسجيل الدخول.","success");setTimeout(()=>location.href="index.html",700)}catch(e){msg(e.code==="auth/email-already-in-use"?"هذا البريد مسجل بالفعل. جرّب تسجيل الدخول.":"تعذر إنشاء الحساب. تأكد من البريد وكلمة المرور.","error")}};
 $("resetBtn").onclick=async()=>{const email=$("email").value.trim();if(!email)return msg("اكتب بريدك الإلكتروني أولًا.","error");try{await sendPasswordResetEmail(auth,email);msg("إذا كان البريد مسجلًا، ستصلك رسالة لإعادة تعيين كلمة المرور.","success")}catch(e){msg("تعذر إرسال الرسالة. راجع البريد وإعدادات Firebase.","error")}};
}
