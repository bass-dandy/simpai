function k(){}const mt=t=>t;function pt(t,e){for(const n in e)t[n]=e[n];return t}function tt(t){return t()}function X(){return Object.create(null)}function S(t){t.forEach(tt)}function I(t){return typeof t=="function"}function Wt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let q;function Gt(t,e){return q||(q=document.createElement("a")),q.href=e,t===q.href}function yt(t){return Object.keys(t).length===0}function et(t,...e){if(t==null)return k;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function Jt(t){let e;return et(t,n=>e=n)(),e}function Kt(t,e,n){t.$$.on_destroy.push(et(e,n))}function Qt(t,e,n,i){if(t){const s=nt(t,e,n,i);return t[0](s)}}function nt(t,e,n,i){return t[1]&&i?pt(n.ctx.slice(),t[1](i(e))):n.ctx}function Ut(t,e,n,i){if(t[2]&&i){const s=t[2](i(n));if(e.dirty===void 0)return s;if(typeof s=="object"){const l=[],r=Math.max(e.dirty.length,s.length);for(let o=0;o<r;o+=1)l[o]=e.dirty[o]|s[o];return l}return e.dirty|s}return e.dirty}function Vt(t,e,n,i,s,l){if(s){const r=nt(e,n,i,l);t.p(r,s)}}function Xt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function Yt(t){const e={};for(const n in t)n[0]!=="$"&&(e[n]=t[n]);return e}function Zt(t,e){const n={};e=new Set(e);for(const i in t)!e.has(i)&&i[0]!=="$"&&(n[i]=t[i]);return n}function te(t){return t??""}function ee(t){return t&&I(t.destroy)?t.destroy:k}const it=typeof window<"u";let gt=it?()=>window.performance.now():()=>Date.now(),Q=it?t=>requestAnimationFrame(t):k;const N=new Set;function st(t){N.forEach(e=>{e.c(t)||(N.delete(e),e.f())}),N.size!==0&&Q(st)}function $t(t){let e;return N.size===0&&Q(st),{promise:new Promise(n=>{N.add(e={c:t,f:n})}),abort(){N.delete(e)}}}let H=!1;function bt(){H=!0}function xt(){H=!1}function wt(t,e,n,i){for(;t<e;){const s=t+(e-t>>1);n(s)<=i?t=s+1:e=s}return t}function vt(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const c=[];for(let u=0;u<e.length;u++){const f=e[u];f.claim_order!==void 0&&c.push(f)}e=c}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let s=0;for(let c=0;c<e.length;c++){const u=e[c].claim_order,f=(s>0&&e[n[s]].claim_order<=u?s+1:wt(1,s,h=>e[n[h]].claim_order,u))-1;i[c]=n[f]+1;const _=f+1;n[_]=c,s=Math.max(_,s)}const l=[],r=[];let o=e.length-1;for(let c=n[s]+1;c!=0;c=i[c-1]){for(l.push(e[c-1]);o>=c;o--)r.push(e[o]);o--}for(;o>=0;o--)r.push(e[o]);l.reverse(),r.sort((c,u)=>c.claim_order-u.claim_order);for(let c=0,u=0;c<r.length;c++){for(;u<l.length&&r[c].claim_order>=l[u].claim_order;)u++;const f=u<l.length?l[u]:null;t.insertBefore(r[c],f)}}function kt(t,e){t.appendChild(e)}function rt(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function Et(t){const e=ct("style");return Nt(rt(t),e),e.sheet}function Nt(t,e){return kt(t.head||t,e),e.sheet}function St(t,e){if(H){for(vt(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function ne(t,e,n){H&&!n?St(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function ot(t){t.parentNode&&t.parentNode.removeChild(t)}function ie(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function ct(t){return document.createElement(t)}function jt(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function U(t){return document.createTextNode(t)}function se(){return U(" ")}function re(){return U("")}function oe(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function ce(t){return function(e){return e.preventDefault(),t.call(this,e)}}function le(t){return function(e){return e.stopPropagation(),t.call(this,e)}}function V(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function ue(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const i in e)e[i]==null?t.removeAttribute(i):i==="style"?t.style.cssText=e[i]:i==="__value"?t.value=t[i]=e[i]:n[i]&&n[i].set?t[i]=e[i]:V(t,i,e[i])}function ae(t,e){for(const n in e)V(t,n,e[n])}function fe(t,e){Object.keys(e).forEach(n=>{At(t,n,e[n])})}function At(t,e,n){e in t?t[e]=typeof t[e]=="boolean"&&n===""?!0:n:V(t,e,n)}function Ct(t){return Array.from(t.childNodes)}function Mt(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function lt(t,e,n,i,s=!1){Mt(t);const l=(()=>{for(let r=t.claim_info.last_index;r<t.length;r++){const o=t[r];if(e(o)){const c=n(o);return c===void 0?t.splice(r,1):t[r]=c,s||(t.claim_info.last_index=r),o}}for(let r=t.claim_info.last_index-1;r>=0;r--){const o=t[r];if(e(o)){const c=n(o);return c===void 0?t.splice(r,1):t[r]=c,s?c===void 0&&t.claim_info.last_index--:t.claim_info.last_index=r,o}}return i()})();return l.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,l}function ut(t,e,n,i){return lt(t,s=>s.nodeName===e,s=>{const l=[];for(let r=0;r<s.attributes.length;r++){const o=s.attributes[r];n[o.name]||l.push(o.name)}l.forEach(r=>s.removeAttribute(r))},()=>i(e))}function _e(t,e,n){return ut(t,e,n,ct)}function de(t,e,n){return ut(t,e,n,jt)}function Dt(t,e){return lt(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>U(e),!0)}function he(t){return Dt(t," ")}function me(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function pe(t,e){t.value=e??""}function ye(t,e,n,i){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function ge(t,e){for(let n=0;n<t.options.length;n+=1){const i=t.options[n];if(i.__value===e){i.selected=!0;return}}t.selectedIndex=-1}function $e(t){const e=t.querySelector(":checked")||t.options[0];return e&&e.__value}function be(t,e,n){t.classList[n?"add":"remove"](e)}function at(t,e,{bubbles:n=!1,cancelable:i=!1}={}){const s=document.createEvent("CustomEvent");return s.initCustomEvent(t,n,i,e),s}function xe(t,e){return new t(e)}const z=new Map;let B=0;function Ot(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function Pt(t,e){const n={stylesheet:Et(e),rules:{}};return z.set(t,n),n}function Y(t,e,n,i,s,l,r,o=0){const c=16.666/i;let u=`{
`;for(let y=0;y<=1;y+=c){const g=e+(n-e)*l(y);u+=y*100+`%{${r(g,1-g)}}
`}const f=u+`100% {${r(n,1-n)}}
}`,_=`__svelte_${Ot(f)}_${o}`,h=rt(t),{stylesheet:a,rules:d}=z.get(h)||Pt(h,t);d[_]||(d[_]=!0,a.insertRule(`@keyframes ${_} ${f}`,a.cssRules.length));const p=t.style.animation||"";return t.style.animation=`${p?`${p}, `:""}${_} ${i}ms linear ${s}ms 1 both`,B+=1,_}function qt(t,e){const n=(t.style.animation||"").split(", "),i=n.filter(e?l=>l.indexOf(e)<0:l=>l.indexOf("__svelte")===-1),s=n.length-i.length;s&&(t.style.animation=i.join(", "),B-=s,B||Tt())}function Tt(){Q(()=>{B||(z.forEach(t=>{const{ownerNode:e}=t.stylesheet;e&&ot(e)}),z.clear())})}let O;function D(t){O=t}function j(){if(!O)throw new Error("Function called outside component initialization");return O}function we(t){j().$$.on_mount.push(t)}function ve(t){j().$$.after_update.push(t)}function ke(t){j().$$.on_destroy.push(t)}function Ee(){const t=j();return(e,n,{cancelable:i=!1}={})=>{const s=t.$$.callbacks[e];if(s){const l=at(e,n,{cancelable:i});return s.slice().forEach(r=>{r.call(t,l)}),!l.defaultPrevented}return!0}}function Ne(t,e){return j().$$.context.set(t,e),e}function Se(t){return j().$$.context.get(t)}function je(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach(i=>i.call(this,e))}const M=[],Z=[],L=[],J=[],ft=Promise.resolve();let K=!1;function _t(){K||(K=!0,ft.then(dt))}function Ae(){return _t(),ft}function F(t){L.push(t)}function Ce(t){J.push(t)}const W=new Set;let T=0;function dt(){const t=O;do{for(;T<M.length;){const e=M[T];T++,D(e),Lt(e.$$)}for(D(null),M.length=0,T=0;Z.length;)Z.pop()();for(let e=0;e<L.length;e+=1){const n=L[e];W.has(n)||(W.add(n),n())}L.length=0}while(M.length);for(;J.length;)J.pop()();K=!1,W.clear(),D(t)}function Lt(t){if(t.fragment!==null){t.update(),S(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(F)}}let C;function Rt(){return C||(C=Promise.resolve(),C.then(()=>{C=null})),C}function G(t,e,n){t.dispatchEvent(at(`${e?"intro":"outro"}${n}`))}const R=new Set;let x;function Me(){x={r:0,c:[],p:x}}function De(){x.r||S(x.c),x=x.p}function ht(t,e){t&&t.i&&(R.delete(t),t.i(e))}function zt(t,e,n,i){if(t&&t.o){if(R.has(t))return;R.add(t),x.c.push(()=>{R.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}const Bt={duration:0};function Oe(t,e,n,i){const s={direction:"both"};let l=e(t,n,s),r=i?0:1,o=null,c=null,u=null;function f(){u&&qt(t,u)}function _(a,d){const p=a.b-r;return d*=Math.abs(p),{a:r,b:a.b,d:p,duration:d,start:a.start,end:a.start+d,group:a.group}}function h(a){const{delay:d=0,duration:p=300,easing:y=mt,tick:g=k,css:w}=l||Bt,E={start:gt()+d,b:a};a||(E.group=x,x.r+=1),o||c?c=E:(w&&(f(),u=Y(t,r,a,p,d,y,w)),a&&g(0,1),o=_(E,p),F(()=>G(t,a,"start")),$t(v=>{if(c&&v>c.start&&(o=_(c,p),c=null,G(t,o.b,"start"),w&&(f(),u=Y(t,r,o.b,o.duration,0,y,l.css))),o){if(v>=o.end)g(r=o.b,1-r),G(t,o.b,"end"),c||(o.b?f():--o.group.r||S(o.group.c)),o=null;else if(v>=o.start){const A=v-o.start;r=o.a+o.d*y(A/o.duration),g(r,1-r)}}return!!(o||c)}))}return{run(a){I(l)?Rt().then(()=>{l=l(s),h(a)}):h(a)},end(){f(),o=c=null}}}function Pe(t,e){t.d(1),e.delete(t.key)}function qe(t,e){zt(t,1,1,()=>{e.delete(t.key)})}function Te(t,e,n,i,s,l,r,o,c,u,f,_){let h=t.length,a=l.length,d=h;const p={};for(;d--;)p[t[d].key]=d;const y=[],g=new Map,w=new Map;for(d=a;d--;){const m=_(s,l,d),$=n(m);let b=r.get($);b?i&&b.p(m,e):(b=u($,m),b.c()),g.set($,y[d]=b),$ in p&&w.set($,Math.abs(d-p[$]))}const E=new Set,v=new Set;function A(m){ht(m,1),m.m(o,f),r.set(m.key,m),f=m.first,a--}for(;h&&a;){const m=y[a-1],$=t[h-1],b=m.key,P=$.key;m===$?(f=m.first,h--,a--):g.has(P)?!r.has(b)||E.has(b)?A(m):v.has(P)?h--:w.get(b)>w.get(P)?(v.add(b),A(m)):(E.add(P),h--):(c($,r),h--)}for(;h--;){const m=t[h];g.has(m.key)||c(m,r)}for(;a;)A(y[a-1]);return y}function Le(t,e){const n={},i={},s={$$scope:1};let l=t.length;for(;l--;){const r=t[l],o=e[l];if(o){for(const c in r)c in o||(i[c]=1);for(const c in o)s[c]||(n[c]=o[c],s[c]=1);t[l]=o}else for(const c in r)s[c]=1}for(const r in i)r in n||(n[r]=void 0);return n}function Re(t){return typeof t=="object"&&t!==null?t:{}}function ze(t,e,n,i){const s=t.$$.props[e];s!==void 0&&(t.$$.bound[s]=n,i===void 0&&n(t.$$.ctx[s]))}function Be(t){t&&t.c()}function Fe(t,e){t&&t.l(e)}function Ft(t,e,n,i){const{fragment:s,after_update:l}=t.$$;s&&s.m(e,n),i||F(()=>{const r=t.$$.on_mount.map(tt).filter(I);t.$$.on_destroy?t.$$.on_destroy.push(...r):S(r),t.$$.on_mount=[]}),l.forEach(F)}function It(t,e){const n=t.$$;n.fragment!==null&&(S(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Ht(t,e){t.$$.dirty[0]===-1&&(M.push(t),_t(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function Ie(t,e,n,i,s,l,r,o=[-1]){const c=O;D(t);const u=t.$$={fragment:null,ctx:[],props:l,update:k,not_equal:s,bound:X(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(c?c.$$.context:[])),callbacks:X(),dirty:o,skip_bound:!1,root:e.target||c.$$.root};r&&r(u.root);let f=!1;if(u.ctx=n?n(t,e.props||{},(_,h,...a)=>{const d=a.length?a[0]:h;return u.ctx&&s(u.ctx[_],u.ctx[_]=d)&&(!u.skip_bound&&u.bound[_]&&u.bound[_](d),f&&Ht(t,_)),h}):[],u.update(),f=!0,S(u.before_update),u.fragment=i?i(u.ctx):!1,e.target){if(e.hydrate){bt();const _=Ct(e.target);u.fragment&&u.fragment.l(_),_.forEach(ot)}else u.fragment&&u.fragment.c();e.intro&&ht(t.$$.fragment),Ft(t,e.target,e.anchor,e.customElement),xt(),dt()}D(c)}class He{$destroy(){It(this,1),this.$destroy=k}$on(e,n){if(!I(n))return k;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const s=i.indexOf(n);s!==-1&&i.splice(s,1)}}$set(e){this.$$set&&!yt(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{ae as $,It as A,Ae as B,k as C,et as D,S as E,I as F,Qt as G,Vt as H,Xt as I,Ut as J,St as K,Kt as L,pt as M,ue as N,be as O,Le as P,oe as Q,Zt as R,He as S,Yt as T,Te as U,qe as V,Re as W,fe as X,Jt as Y,jt as Z,de as _,se as a,te as a0,le as a1,mt as a2,ee as a3,F as a4,Oe as a5,ce as a6,Ee as a7,ke as a8,pe as a9,ie as aa,ge as ab,$e as ac,Gt as ad,Se as ae,Pe as af,ze as ag,Ce as ah,je as ai,Ne as aj,ne as b,he as c,De as d,re as e,ht as f,Me as g,ot as h,Ie as i,ve as j,ct as k,_e as l,Ct as m,V as n,we as o,ye as p,U as q,Dt as r,Wt as s,zt as t,me as u,Z as v,xe as w,Be as x,Fe as y,Ft as z};
