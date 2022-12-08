(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const f of i.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&s(f)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerpolicy&&(i.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?i.credentials="include":r.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();function P(){}const J=e=>e;function se(e){return e()}function X(){return Object.create(null)}function N(e){e.forEach(se)}function B(e){return typeof e=="function"}function oe(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}let S;function b(e,t){return S||(S=document.createElement("a")),S.href=t,e===S.href}function Ee(e){return Object.keys(e).length===0}const le=typeof window<"u";let ce=le?()=>window.performance.now():()=>Date.now(),Q=le?e=>requestAnimationFrame(e):P;const E=new Set;function fe(e){E.forEach(t=>{t.c(e)||(E.delete(t),t.f())}),E.size!==0&&Q(fe)}function ue(e){let t;return E.size===0&&Q(fe),{promise:new Promise(n=>{E.add(t={c:e,f:n})}),abort(){E.delete(t)}}}function $(e,t){e.appendChild(t)}function ae(e){if(!e)return document;const t=e.getRootNode?e.getRootNode():e.ownerDocument;return t&&t.host?t:e.ownerDocument}function Pe(e){const t=v("style");return Oe(ae(e),t),t.sheet}function Oe(e,t){return $(e.head||e,t),t.sheet}function U(e,t,n){e.insertBefore(t,n||null)}function A(e){e.parentNode&&e.parentNode.removeChild(e)}function ke(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function v(e){return document.createElement(e)}function xe(e){return document.createTextNode(e)}function H(){return xe(" ")}function h(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function Ne(e){return Array.from(e.childNodes)}function Y(e,t,n,s){n===null?e.style.removeProperty(t):e.style.setProperty(t,n,s?"important":"")}function C(e,t,n){e.classList[n?"add":"remove"](t)}function Ae(e,t,{bubbles:n=!1,cancelable:s=!1}={}){const r=document.createEvent("CustomEvent");return r.initCustomEvent(e,n,s,t),r}const R=new Map;let D=0;function Se(e){let t=5381,n=e.length;for(;n--;)t=(t<<5)-t^e.charCodeAt(n);return t>>>0}function Ce(e,t){const n={stylesheet:Pe(t),rules:{}};return R.set(e,n),n}function de(e,t,n,s,r,i,f,u=0){const _=16.666/s;let l=`{
`;for(let p=0;p<=1;p+=_){const y=t+(n-t)*i(p);l+=p*100+`%{${f(y,1-y)}}
`}const c=l+`100% {${f(n,1-n)}}
}`,o=`__svelte_${Se(c)}_${u}`,a=ae(e),{stylesheet:d,rules:m}=R.get(a)||Ce(a,e);m[o]||(m[o]=!0,d.insertRule(`@keyframes ${o} ${c}`,d.cssRules.length));const g=e.style.animation||"";return e.style.animation=`${g?`${g}, `:""}${o} ${s}ms linear ${r}ms 1 both`,D+=1,o}function K(e,t){const n=(e.style.animation||"").split(", "),s=n.filter(t?i=>i.indexOf(t)<0:i=>i.indexOf("__svelte")===-1),r=n.length-s.length;r&&(e.style.animation=s.join(", "),D-=r,D||qe())}function qe(){Q(()=>{D||(R.forEach(e=>{const{ownerNode:t}=e.stylesheet;t&&A(t)}),R.clear())})}let V;function x(e){V=e}const k=[],Z=[],I=[],ee=[],je=Promise.resolve();let G=!1;function Ie(){G||(G=!0,je.then(me))}function w(e){I.push(e)}const T=new Set;let q=0;function me(){const e=V;do{for(;q<k.length;){const t=k[q];q++,x(t),Le(t.$$)}for(x(null),k.length=0,q=0;Z.length;)Z.pop()();for(let t=0;t<I.length;t+=1){const n=I[t];T.has(n)||(T.add(n),n())}I.length=0}while(k.length);for(;ee.length;)ee.pop()();G=!1,T.clear(),x(e)}function Le(e){if(e.fragment!==null){e.update(),N(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(w)}}let O;function _e(){return O||(O=Promise.resolve(),O.then(()=>{O=null})),O}function M(e,t,n){e.dispatchEvent(Ae(`${t?"intro":"outro"}${n}`))}const L=new Set;let he;function ge(e,t){e&&e.i&&(L.delete(e),e.i(t))}function Re(e,t,n,s){if(e&&e.o){if(L.has(e))return;L.add(e),he.c.push(()=>{L.delete(e),s&&(n&&e.d(1),s())}),e.o(t)}else s&&s()}const pe={duration:0};function te(e,t,n){const s={direction:"in"};let r=t(e,n,s),i=!1,f,u,_=0;function l(){f&&K(e,f)}function c(){const{delay:a=0,duration:d=300,easing:m=J,tick:g=P,css:p}=r||pe;p&&(f=de(e,0,1,d,a,m,p,_++)),g(0,1);const y=ce()+a,be=y+d;u&&u.abort(),i=!0,w(()=>M(e,!0,"start")),u=ue(F=>{if(i){if(F>=be)return g(1,0),M(e,!0,"end"),l(),i=!1;if(F>=y){const W=m((F-y)/d);g(W,1-W)}}return i})}let o=!1;return{start(){o||(o=!0,K(e),B(r)?(r=r(s),_e().then(c)):c())},invalidate(){o=!1},end(){i&&(l(),i=!1)}}}function ne(e,t,n){const s={direction:"out"};let r=t(e,n,s),i=!0,f;const u=he;u.r+=1;function _(){const{delay:l=0,duration:c=300,easing:o=J,tick:a=P,css:d}=r||pe;d&&(f=de(e,1,0,c,l,o,d));const m=ce()+l,g=m+c;w(()=>M(e,!1,"start")),ue(p=>{if(i){if(p>=g)return a(0,1),M(e,!1,"end"),--u.r||N(u.c),!1;if(p>=m){const y=o((p-m)/c);a(1-y,y)}}return i})}return B(r)?_e().then(()=>{r=r(s),_()}):_(),{end(l){l&&r.tick&&r.tick(1,0),i&&(f&&K(e,f),i=!1)}}}function De(e){e&&e.c()}function ye(e,t,n,s){const{fragment:r,after_update:i}=e.$$;r&&r.m(t,n),s||w(()=>{const f=e.$$.on_mount.map(se).filter(B);e.$$.on_destroy?e.$$.on_destroy.push(...f):N(f),e.$$.on_mount=[]}),i.forEach(w)}function $e(e,t){const n=e.$$;n.fragment!==null&&(N(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function Me(e,t){e.$$.dirty[0]===-1&&(k.push(e),Ie(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function ve(e,t,n,s,r,i,f,u=[-1]){const _=V;x(e);const l=e.$$={fragment:null,ctx:[],props:i,update:P,not_equal:r,bound:X(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(_?_.$$.context:[])),callbacks:X(),dirty:u,skip_bound:!1,root:t.target||_.$$.root};f&&f(l.root);let c=!1;if(l.ctx=n?n(e,t.props||{},(o,a,...d)=>{const m=d.length?d[0]:a;return l.ctx&&r(l.ctx[o],l.ctx[o]=m)&&(!l.skip_bound&&l.bound[o]&&l.bound[o](m),c&&Me(e,o)),a}):[],l.update(),c=!0,N(l.before_update),l.fragment=s?s(l.ctx):!1,t.target){if(t.hydrate){const o=Ne(t.target);l.fragment&&l.fragment.l(o),o.forEach(A)}else l.fragment&&l.fragment.c();t.intro&&ge(e.$$.fragment),ye(e,t.target,t.anchor,t.customElement),me()}x(_)}class we{$destroy(){$e(this,1),this.$destroy=P}$on(t,n){if(!B(n))return P;const s=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return s.push(n),()=>{const r=s.indexOf(n);r!==-1&&s.splice(r,1)}}$set(t){this.$$set&&!Ee(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function j(e,{delay:t=0,duration:n=400,easing:s=J}={}){const r=+getComputedStyle(e).opacity;return{delay:t,duration:n,easing:s,css:i=>`opacity: ${i*r}`}}function ze(e){let t,n,s,r,i,f,u,_,l,c,o;return{c(){t=v("div"),n=v("img"),f=H(),u=v("img"),b(n.src,s=e[1])||h(n,"src",s),h(n,"alt","photo album"),h(n,"class","svelte-1evrsqm"),b(u.src,_=e[2])||h(u,"src",_),h(u,"alt","photo album"),h(u,"class","svelte-1evrsqm"),C(u,"fadeOut",!e[3]),C(u,"fadeIn",e[3]),h(t,"class","frame svelte-1evrsqm"),Y(t,"--interval",`${e[0]}ms`)},m(a,d){U(a,t,d),$(t,n),$(t,f),$(t,u),o=!0},p(a,[d]){(!o||d&2&&!b(n.src,s=a[1]))&&h(n,"src",s),(!o||d&4&&!b(u.src,_=a[2]))&&h(u,"src",_),(!o||d&8)&&C(u,"fadeOut",!a[3]),(!o||d&8)&&C(u,"fadeIn",a[3]),(!o||d&1)&&Y(t,"--interval",`${a[0]}ms`)},i(a){o||(w(()=>{i&&i.end(1),r=te(n,j,{}),r.start()}),w(()=>{c&&c.end(1),l=te(u,j,{}),l.start()}),o=!0)},o(a){r&&r.invalidate(),i=ne(n,j,{}),l&&l.invalidate(),c=ne(u,j,{}),o=!1},d(a){a&&A(t),a&&i&&i.end(),a&&c&&c.end()}}}function Be(e,t,n){let{sources:s=[]}=t,{interval:r=1e4}=t,i=0,f="",u="",_=!1;function l(){function c(){if(!s.length){n(1,f=n(2,u=""));return}n(3,_=i%2===0);const o=s[i%s.length];i%2?n(1,f=o):n(2,u=o),i++}setInterval(c,r),c()}return e.$$set=c=>{"sources"in c&&n(4,s=c.sources),"interval"in c&&n(0,r=c.interval)},e.$$.update=()=>{e.$$.dirty&16&&s.length&&l()},[r,f,u,_,s]}class Fe extends we{constructor(t){super(),ve(this,t,Be,ze,oe,{sources:4,interval:0})}}function re(e,t,n){const s=e.slice();return s[2]=t[n],s}function ie(e){let t,n,s;return{c(){t=v("img"),h(t,"tabindex","0"),h(t,"class","photo svelte-51f2be"),b(t.src,n=`${z}/get?id=${e[2].id}`)||h(t,"src",n),h(t,"alt",s=e[2].id)},m(r,i){U(r,t,i)},p(r,i){i&1&&!b(t.src,n=`${z}/get?id=${r[2].id}`)&&h(t,"src",n),i&1&&s!==(s=r[2].id)&&h(t,"alt",s)},d(r){r&&A(t)}}}function Te(e){let t,n,s,r,i,f,u,_;f=new Fe({props:{sources:e[0].map(e[1])}});let l=e[0],c=[];for(let o=0;o<l.length;o+=1)c[o]=ie(re(e,l,o));return{c(){t=v("main"),n=v("h1"),n.textContent="Photos",s=H(),r=v("div"),i=v("div"),De(f.$$.fragment),u=H();for(let o=0;o<c.length;o+=1)c[o].c();h(i,"class","fit svelte-51f2be"),h(r,"class","frame svelte-51f2be")},m(o,a){U(o,t,a),$(t,n),$(t,s),$(t,r),$(r,i),ye(f,i,null),$(r,u);for(let d=0;d<c.length;d+=1)c[d].m(r,null);_=!0},p(o,[a]){const d={};if(a&1&&(d.sources=o[0].map(o[1])),f.$set(d),a&1){l=o[0];let m;for(m=0;m<l.length;m+=1){const g=re(o,l,m);c[m]?c[m].p(g,a):(c[m]=ie(g),c[m].c(),c[m].m(r,null))}for(;m<c.length;m+=1)c[m].d(1);c.length=l.length}},i(o){_||(ge(f.$$.fragment,o),_=!0)},o(o){Re(f.$$.fragment,o),_=!1},d(o){o&&A(t),$e(f),ke(c,o)}}}const z="http://localhost:5107/Photo";function He(e,t,n){let s=[];return(async()=>{const i=await fetch(`${z}/list`);if(i.ok){const f=await i.json();console.log(f),n(0,s=f)}})(),[s,i=>`${z}/get?id=${i.id}`]}class Ke extends we{constructor(t){super(),ve(this,t,He,Te,oe,{})}}new Ke({target:document.getElementById("app")});
