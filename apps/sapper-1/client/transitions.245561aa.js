import{w as t,x as n}from"./client.738a53c2.js";function e(t){const n=t-1;return n*n*n+1}function r(t){return--t*t*t*t*t+1}
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */function a(t,{delay:n=0,duration:r=400,easing:a=e,x:o=0,y:s=0,opacity:i=0}){const c=getComputedStyle(t),l=+c.opacity,f="none"===c.transform?"":c.transform,u=l*(1-i);return{delay:n,duration:r,easing:a,css:(t,n)=>`\n\t\t\ttransform: ${f} translate(${(1-t)*o}px, ${(1-t)*s}px);\n\t\t\topacity: ${l-u*n}`}}function o(t,{delay:n=0,duration:r=400,easing:a=e,start:o=0,opacity:s=0}){const i=getComputedStyle(t),c=+i.opacity,l="none"===i.transform?"":i.transform,f=1-o,u=c*(1-s);return{delay:n,duration:r,easing:a,css:(t,n)=>`\n\t\t\ttransform: ${l} scale(${1-f*n});\n\t\t\topacity: ${c-u*n}\n\t\t`}}const[s,i]=function(r){var{fallback:a}=r,o=function(t,n){var e={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&n.indexOf(r)<0&&(e[r]=t[r]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var a=0;for(r=Object.getOwnPropertySymbols(t);a<r.length;a++)n.indexOf(r[a])<0&&Object.prototype.propertyIsEnumerable.call(t,r[a])&&(e[r[a]]=t[r[a]])}return e}(r,["fallback"]);const s=new Map,i=new Map;function c(r,s,i){return(c,l)=>(r.set(l.key,{rect:c.getBoundingClientRect()}),()=>{if(s.has(l.key)){const{rect:r}=s.get(l.key);return s.delete(l.key),function(r,a,s){const{delay:i=0,duration:c=(t=>30*Math.sqrt(t)),easing:l=e}=n(n({},o),s),f=a.getBoundingClientRect(),u=r.left-f.left,y=r.top-f.top,p=r.width/f.width,d=r.height/f.height,g=Math.sqrt(u*u+y*y),m=getComputedStyle(a),$="none"===m.transform?"":m.transform,h=+m.opacity;return{delay:i,duration:t(c)?c(g):c,easing:l,css:(t,n)=>`\n\t\t\t\topacity: ${t*h};\n\t\t\t\ttransform-origin: top left;\n\t\t\t\ttransform: ${$} translate(${n*u}px,${n*y}px) scale(${t+(1-t)*p}, ${t+(1-t)*d});\n\t\t\t`}}(r,c,l)}return r.delete(l.key),a&&a(c,l,i)})}return[c(i,s,!1),c(s,i,!0)]}({duration:200,delay:200,fallback:(t,n)=>({duration:100,easing:r,css:t=>"opacity: "+t})});export{a as f,o as s};
