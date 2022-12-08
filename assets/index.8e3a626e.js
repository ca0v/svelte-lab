(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const u of i.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&s(u)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerpolicy&&(i.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?i.credentials="include":r.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();function P(){}const J=e=>e;function se(e){return e()}function X(){return Object.create(null)}function N(e){e.forEach(se)}function B(e){return typeof e=="function"}function oe(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}let S;function b(e,t){return S||(S=document.createElement("a")),S.href=t,e===S.href}function Ee(e){return Object.keys(e).length===0}const le=typeof window<"u";let ce=le?()=>window.performance.now():()=>Date.now(),Q=le?e=>requestAnimationFrame(e):P;const E=new Set;function fe(e){E.forEach(t=>{t.c(e)||(E.delete(t),t.f())}),E.size!==0&&Q(fe)}function ue(e){let t;return E.size===0&&Q(fe),{promise:new Promise(n=>{E.add(t={c:e,f:n})}),abort(){E.delete(t)}}}function $(e,t){e.appendChild(t)}function ae(e){if(!e)return document;const t=e.getRootNode?e.getRootNode():e.ownerDocument;return t&&t.host?t:e.ownerDocument}function Pe(e){const t=v("style");return Oe(ae(e),t),t.sheet}function Oe(e,t){return $(e.head||e,t),t.sheet}function U(e,t,n){e.insertBefore(t,n||null)}function A(e){e.parentNode&&e.parentNode.removeChild(e)}function ke(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function v(e){return document.createElement(e)}function xe(e){return document.createTextNode(e)}function H(){return xe(" ")}function _(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function Ne(e){return Array.from(e.childNodes)}function Y(e,t,n,s){n===null?e.style.removeProperty(t):e.style.setProperty(t,n,s?"important":"")}function C(e,t,n){e.classList[n?"add":"remove"](t)}function Ae(e,t,{bubbles:n=!1,cancelable:s=!1}={}){const r=document.createEvent("CustomEvent");return r.initCustomEvent(e,n,s,t),r}const R=new Map;let D=0;function Se(e){let t=5381,n=e.length;for(;n--;)t=(t<<5)-t^e.charCodeAt(n);return t>>>0}function Ce(e,t){const n={stylesheet:Pe(t),rules:{}};return R.set(e,n),n}function de(e,t,n,s,r,i,u,f=0){const m=16.666/s;let o=`{
`;for(let g=0;g<=1;g+=m){const p=t+(n-t)*i(g);o+=g*100+`%{${u(p,1-p)}}
`}const l=o+`100% {${u(n,1-n)}}
}`,c=`__svelte_${Se(l)}_${f}`,d=ae(e),{stylesheet:a,rules:h}=R.get(d)||Ce(d,e);h[c]||(h[c]=!0,a.insertRule(`@keyframes ${c} ${l}`,a.cssRules.length));const y=e.style.animation||"";return e.style.animation=`${y?`${y}, `:""}${c} ${s}ms linear ${r}ms 1 both`,D+=1,c}function K(e,t){const n=(e.style.animation||"").split(", "),s=n.filter(t?i=>i.indexOf(t)<0:i=>i.indexOf("__svelte")===-1),r=n.length-s.length;r&&(e.style.animation=s.join(", "),D-=r,D||je())}function je(){Q(()=>{D||(R.forEach(e=>{const{ownerNode:t}=e.stylesheet;t&&A(t)}),R.clear())})}let V;function x(e){V=e}const k=[],Z=[],I=[],ee=[],qe=Promise.resolve();let G=!1;function Ie(){G||(G=!0,qe.then(me))}function w(e){I.push(e)}const T=new Set;let j=0;function me(){const e=V;do{for(;j<k.length;){const t=k[j];j++,x(t),Le(t.$$)}for(x(null),k.length=0,j=0;Z.length;)Z.pop()();for(let t=0;t<I.length;t+=1){const n=I[t];T.has(n)||(T.add(n),n())}I.length=0}while(k.length);for(;ee.length;)ee.pop()();G=!1,T.clear(),x(e)}function Le(e){if(e.fragment!==null){e.update(),N(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(w)}}let O;function _e(){return O||(O=Promise.resolve(),O.then(()=>{O=null})),O}function M(e,t,n){e.dispatchEvent(Ae(`${t?"intro":"outro"}${n}`))}const L=new Set;let he;function ge(e,t){e&&e.i&&(L.delete(e),e.i(t))}function Re(e,t,n,s){if(e&&e.o){if(L.has(e))return;L.add(e),he.c.push(()=>{L.delete(e),s&&(n&&e.d(1),s())}),e.o(t)}else s&&s()}const pe={duration:0};function te(e,t,n){const s={direction:"in"};let r=t(e,n,s),i=!1,u,f,m=0;function o(){u&&K(e,u)}function l(){const{delay:d=0,duration:a=300,easing:h=J,tick:y=P,css:g}=r||pe;g&&(u=de(e,0,1,a,d,h,g,m++)),y(0,1);const p=ce()+d,be=p+a;f&&f.abort(),i=!0,w(()=>M(e,!0,"start")),f=ue(F=>{if(i){if(F>=be)return y(1,0),M(e,!0,"end"),o(),i=!1;if(F>=p){const W=h((F-p)/a);y(W,1-W)}}return i})}let c=!1;return{start(){c||(c=!0,K(e),B(r)?(r=r(s),_e().then(l)):l())},invalidate(){c=!1},end(){i&&(o(),i=!1)}}}function ne(e,t,n){const s={direction:"out"};let r=t(e,n,s),i=!0,u;const f=he;f.r+=1;function m(){const{delay:o=0,duration:l=300,easing:c=J,tick:d=P,css:a}=r||pe;a&&(u=de(e,1,0,l,o,c,a));const h=ce()+o,y=h+l;w(()=>M(e,!1,"start")),ue(g=>{if(i){if(g>=y)return d(0,1),M(e,!1,"end"),--f.r||N(f.c),!1;if(g>=h){const p=c((g-h)/l);d(1-p,p)}}return i})}return B(r)?_e().then(()=>{r=r(s),m()}):m(),{end(o){o&&r.tick&&r.tick(1,0),i&&(u&&K(e,u),i=!1)}}}function De(e){e&&e.c()}function ye(e,t,n,s){const{fragment:r,after_update:i}=e.$$;r&&r.m(t,n),s||w(()=>{const u=e.$$.on_mount.map(se).filter(B);e.$$.on_destroy?e.$$.on_destroy.push(...u):N(u),e.$$.on_mount=[]}),i.forEach(w)}function $e(e,t){const n=e.$$;n.fragment!==null&&(N(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function Me(e,t){e.$$.dirty[0]===-1&&(k.push(e),Ie(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function ve(e,t,n,s,r,i,u,f=[-1]){const m=V;x(e);const o=e.$$={fragment:null,ctx:[],props:i,update:P,not_equal:r,bound:X(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(m?m.$$.context:[])),callbacks:X(),dirty:f,skip_bound:!1,root:t.target||m.$$.root};u&&u(o.root);let l=!1;if(o.ctx=n?n(e,t.props||{},(c,d,...a)=>{const h=a.length?a[0]:d;return o.ctx&&r(o.ctx[c],o.ctx[c]=h)&&(!o.skip_bound&&o.bound[c]&&o.bound[c](h),l&&Me(e,c)),d}):[],o.update(),l=!0,N(o.before_update),o.fragment=s?s(o.ctx):!1,t.target){if(t.hydrate){const c=Ne(t.target);o.fragment&&o.fragment.l(c),c.forEach(A)}else o.fragment&&o.fragment.c();t.intro&&ge(e.$$.fragment),ye(e,t.target,t.anchor,t.customElement),me()}x(m)}class we{$destroy(){$e(this,1),this.$destroy=P}$on(t,n){if(!B(n))return P;const s=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return s.push(n),()=>{const r=s.indexOf(n);r!==-1&&s.splice(r,1)}}$set(t){this.$$set&&!Ee(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function q(e,{delay:t=0,duration:n=400,easing:s=J}={}){const r=+getComputedStyle(e).opacity;return{delay:t,duration:n,easing:s,css:i=>`opacity: ${i*r}`}}function ze(e){let t,n,s,r,i,u,f,m,o,l,c;return{c(){t=v("div"),n=v("img"),u=H(),f=v("img"),b(n.src,s=e[1])||_(n,"src",s),_(n,"alt","photo album"),_(n,"class","svelte-e4psbt"),b(f.src,m=e[2])||_(f,"src",m),_(f,"alt","photo album"),_(f,"class","svelte-e4psbt"),C(f,"fadeOut",!e[3]),C(f,"fadeIn",e[3]),_(t,"class","frame svelte-e4psbt"),Y(t,"--interval",`${e[0]}ms`)},m(d,a){U(d,t,a),$(t,n),$(t,u),$(t,f),c=!0},p(d,[a]){(!c||a&2&&!b(n.src,s=d[1]))&&_(n,"src",s),(!c||a&4&&!b(f.src,m=d[2]))&&_(f,"src",m),(!c||a&8)&&C(f,"fadeOut",!d[3]),(!c||a&8)&&C(f,"fadeIn",d[3]),(!c||a&1)&&Y(t,"--interval",`${d[0]}ms`)},i(d){c||(w(()=>{i&&i.end(1),r=te(n,q,{}),r.start()}),w(()=>{l&&l.end(1),o=te(f,q,{}),o.start()}),c=!0)},o(d){r&&r.invalidate(),i=ne(n,q,{}),o&&o.invalidate(),l=ne(f,q,{}),c=!1},d(d){d&&A(t),d&&i&&i.end(),d&&l&&l.end()}}}function Be(e,t,n){let{sources:s=[]}=t,{interval:r=1e4}=t,i=0,u="",f="",m=!1;function o(){function l(){if(!s.length){n(1,u=n(2,f=""));return}n(3,m=i%2===0);const c=s[i%s.length];i%2?n(1,u=c):n(2,f=c),i++}setInterval(l,r),l()}return e.$$set=l=>{"sources"in l&&n(4,s=l.sources),"interval"in l&&n(0,r=l.interval)},e.$$.update=()=>{e.$$.dirty&16&&s.length&&o()},[r,u,f,m,s]}class Fe extends we{constructor(t){super(),ve(this,t,Be,ze,oe,{sources:4,interval:0})}}function re(e,t,n){const s=e.slice();return s[2]=t[n],s}function ie(e){let t,n,s;return{c(){t=v("img"),_(t,"tabindex","0"),_(t,"class","photo svelte-1q9inlt"),b(t.src,n=`${z}/get?id=${e[2].id}`)||_(t,"src",n),_(t,"alt",s=e[2].id)},m(r,i){U(r,t,i)},p(r,i){i&1&&!b(t.src,n=`${z}/get?id=${r[2].id}`)&&_(t,"src",n),i&1&&s!==(s=r[2].id)&&_(t,"alt",s)},d(r){r&&A(t)}}}function Te(e){let t,n,s,r,i,u,f;i=new Fe({props:{sources:e[0].map(e[1])}});let m=e[0],o=[];for(let l=0;l<m.length;l+=1)o[l]=ie(re(e,m,l));return{c(){t=v("main"),n=v("h1"),n.textContent="Photos",s=H(),r=v("div"),De(i.$$.fragment),u=H();for(let l=0;l<o.length;l+=1)o[l].c();_(r,"class","frame svelte-1q9inlt")},m(l,c){U(l,t,c),$(t,n),$(t,s),$(t,r),ye(i,r,null),$(r,u);for(let d=0;d<o.length;d+=1)o[d].m(r,null);f=!0},p(l,[c]){const d={};if(c&1&&(d.sources=l[0].map(l[1])),i.$set(d),c&1){m=l[0];let a;for(a=0;a<m.length;a+=1){const h=re(l,m,a);o[a]?o[a].p(h,c):(o[a]=ie(h),o[a].c(),o[a].m(r,null))}for(;a<o.length;a+=1)o[a].d(1);o.length=m.length}},i(l){f||(ge(i.$$.fragment,l),f=!0)},o(l){Re(i.$$.fragment,l),f=!1},d(l){l&&A(t),$e(i),ke(o,l)}}}const z="http://localhost:5107/Photo";function He(e,t,n){let s=[];return(async()=>{const i=await fetch(`${z}/list`);if(i.ok){const u=await i.json();console.log(u),n(0,s=u)}})(),[s,i=>`${z}/get?id=${i.id}`]}class Ke extends we{constructor(t){super(),ve(this,t,He,Te,oe,{})}}new Ke({target:document.getElementById("app")});
