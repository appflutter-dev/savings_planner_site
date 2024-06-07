var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function a(e){e.forEach(t)}function o(e){return"function"==typeof e}function s(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}let i,l;function r(e,t){return i||(i=document.createElement("a")),i.href=t,e===i.href}function c(e,t){e.appendChild(t)}function u(e,t,n){e.insertBefore(t,n||null)}function d(e){e.parentNode&&e.parentNode.removeChild(e)}function p(e){return document.createElement(e)}function f(e){return document.createTextNode(e)}function h(){return f(" ")}function g(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function v(e,t,n){e.classList[n?"add":"remove"](t)}function y(e){l=e}const m=[],b=[];let w=[];const $=[],k=Promise.resolve();let x=!1;function P(e){w.push(e)}const A=new Set;let T=0;function _(){if(0!==T)return;const e=l;do{try{for(;T<m.length;){const e=m[T];T++,y(e),M(e.$$)}}catch(e){throw m.length=0,T=0,e}for(y(null),m.length=0,T=0;b.length;)b.pop()();for(let e=0;e<w.length;e+=1){const t=w[e];A.has(t)||(A.add(t),t())}w.length=0}while(m.length);for(;$.length;)$.pop()();x=!1,A.clear(),y(e)}function M(e){if(null!==e.fragment){e.update(),a(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(P)}}const q=new Set;let C;function z(e,t){e&&e.i&&(q.delete(e),e.i(t))}function D(e,t,n,a){if(e&&e.o){if(q.has(e))return;q.add(e),C.c.push((()=>{q.delete(e),a&&(n&&e.d(1),a())})),e.o(t)}else a&&a()}function L(e){e&&e.c()}function S(e,n,s,i){const{fragment:l,after_update:r}=e.$$;l&&l.m(n,s),i||P((()=>{const n=e.$$.on_mount.map(t).filter(o);e.$$.on_destroy?e.$$.on_destroy.push(...n):a(n),e.$$.on_mount=[]})),r.forEach(P)}function R(e,t){const n=e.$$;null!==n.fragment&&(!function(e){const t=[],n=[];w.forEach((a=>-1===e.indexOf(a)?t.push(a):n.push(a))),n.forEach((e=>e())),w=t}(n.after_update),a(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function E(e,t){-1===e.$$.dirty[0]&&(m.push(e),x||(x=!0,k.then(_)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function H(t,o,s,i,r,c,u,p=[-1]){const f=l;y(t);const h=t.$$={fragment:null,ctx:[],props:c,update:e,not_equal:r,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(o.context||(f?f.$$.context:[])),callbacks:n(),dirty:p,skip_bound:!1,root:o.target||f.$$.root};u&&u(h.root);let g=!1;if(h.ctx=s?s(t,o.props||{},((e,n,...a)=>{const o=a.length?a[0]:n;return h.ctx&&r(h.ctx[e],h.ctx[e]=o)&&(!h.skip_bound&&h.bound[e]&&h.bound[e](o),g&&E(t,e)),n})):[],h.update(),g=!0,a(h.before_update),h.fragment=!!i&&i(h.ctx),o.target){if(o.hydrate){const e=function(e){return Array.from(e.childNodes)}(o.target);h.fragment&&h.fragment.l(e),e.forEach(d)}else h.fragment&&h.fragment.c();o.intro&&z(t.$$.fragment),S(t,o.target,o.anchor,o.customElement),_()}y(f)}class G{$destroy(){R(this,1),this.$destroy=e}$on(t,n){if(!o(n))return e;const a=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return a.push(n),()=>{const e=a.indexOf(n);-1!==e&&a.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function j(t){let n,a,o,s,i,l;return{c(){n=p("header"),a=p("img"),s=h(),i=p("h1"),l=f(t[0]),r(a.src,o="icon_app.png")||g(a,"src","icon_app.png"),g(a,"alt","Savings Planner Logo"),g(a,"class","app-logo svelte-b0zm2n"),g(i,"class","app-title svelte-b0zm2n"),g(n,"class","app-header svelte-b0zm2n")},m(e,t){u(e,n,t),c(n,a),c(n,s),c(n,i),c(i,l)},p(e,[t]){1&t&&function(e,t){t=""+t,e.data!==t&&(e.data=t)}(l,e[0])},i:e,o:e,d(e){e&&d(n)}}}function I(e,t,n){let{title:a="Savings Planner"}=t;return e.$$set=e=>{"title"in e&&n(0,a=e.title)},[a]}class N extends G{constructor(e){super(),H(this,e,I,j,s,{title:0})}}function W(t){let n,a,o,s,i,l,f,y,m,b,w,$,k,x,P,A,T,_,M;return{c(){n=p("section"),a=p("div"),o=p("a"),s=p("img"),l=h(),f=p("p"),f.textContent="Not available",y=h(),m=p("a"),b=p("img"),$=h(),k=p("p"),k.textContent="Not available",x=h(),P=p("a"),A=p("img"),_=h(),M=p("p"),M.textContent=`Rating: ${U}/5`,r(s.src,i="google-play-badge.png")||g(s,"src","google-play-badge.png"),g(s,"alt","Google Play Store"),g(s,"class","svelte-11gf09f"),v(s,"grayed-out",null===Y),g(o,"class","store-link svelte-11gf09f"),g(o,"href","https://play.google.com/store/apps/details?id=com.example.savingsplanner"),g(o,"target","_blank"),r(b.src,w="app-store-badge.svg")||g(b,"src","app-store-badge.svg"),g(b,"alt","Apple App Store"),g(b,"class","svelte-11gf09f"),v(b,"grayed-out",null===O),g(m,"class","store-link svelte-11gf09f"),g(m,"href","https://apps.apple.com/app/savings-planner/id1234567890"),g(m,"target","_blank"),r(A.src,T="amazon-store-badge.jpg")||g(A,"src","amazon-store-badge.jpg"),g(A,"alt","Amazon Store"),g(A,"class","svelte-11gf09f"),v(A,"grayed-out",null===U),g(P,"class","store-link svelte-11gf09f"),g(P,"href","https://www.amazon.com/gp/mas/dl/android?p=com.fsa.planification_epargne"),g(P,"target","_blank"),g(a,"class","store-links svelte-11gf09f")},m(e,t){u(e,n,t),c(n,a),c(a,o),c(o,s),c(o,l),c(o,f),c(a,y),c(a,m),c(m,b),c(m,$),c(m,k),c(a,x),c(a,P),c(P,A),c(P,_),c(P,M)},p:e,i:e,o:e,d(e){e&&d(n)}}}let Y=null,O=null,U=5;class B extends G{constructor(e){super(),H(this,e,null,W,s,{})}}function F(t){let n,a,o,s,i,l,r,v,y,m,b,w,$,k,x,P;return{c(){n=p("div"),a=p("h1"),a.textContent="Legal Disclaimer",o=h(),s=p("section"),s.innerHTML='<h2 class="svelte-1wey1xi">General</h2> \n    <p class="svelte-1wey1xi">The Savings Planner application (&quot;App&quot;) is provided &quot;as is&quot; without any\n      warranties of any kind, express or implied. The App does not collect or\n      store any personal data directly. However, it uses third-party services\n      such as AdMob for advertising, which may collect and use personal data as\n      described in their privacy policies.</p>',i=h(),l=p("section"),l.innerHTML='<h2 class="svelte-1wey1xi">Limitation of Liability</h2> \n    <p class="svelte-1wey1xi">In no event shall Savings Planner or its developers be liable for any\n      damages, including but not limited to, direct, indirect, incidental,\n      special, consequential, or punitive damages, arising out of the use of or\n      inability to use the App, even if Savings Planner has been advised of the\n      possibility of such damages.</p>',r=h(),v=p("section"),y=p("h2"),y.textContent="Contact Information",m=h(),b=p("p"),b.textContent="If you have any questions about these terms and conditions, please contact\r\n      us at:",w=h(),$=p("p"),k=f("Email: "),x=p("a"),P=f(J),g(a,"class","svelte-1wey1xi"),g(y,"class","svelte-1wey1xi"),g(b,"class","svelte-1wey1xi"),g(x,"href","mailto:"+J),g(x,"class","svelte-1wey1xi"),g($,"class","svelte-1wey1xi"),g(n,"class","legal-disclaimer svelte-1wey1xi")},m(e,t){u(e,n,t),c(n,a),c(n,o),c(n,s),c(n,i),c(n,l),c(n,r),c(n,v),c(v,y),c(v,m),c(v,b),c(v,w),c(v,$),c($,k),c($,x),c(x,P)},p:e,i:e,o:e,d(e){e&&d(n)}}}let J="savingsplanner.contact@gmail.com";class K extends G{constructor(e){super(),H(this,e,null,F,s,{})}}function Q(t){let n,a,o,s,i,l,r,v,y,m,b,w,$,k,x,P,A,T,_,M,q,C,z,D,L,S;return{c(){n=p("div"),a=p("h1"),a.textContent="Privacy Policy",o=h(),s=p("section"),s.innerHTML='<h2 class="svelte-1edafen">Introduction</h2> \n    <p class="svelte-1edafen">Welcome to the Savings Planner application (the &quot;App&quot;). This Privacy\n      Policy is designed to inform you about how we collect, use, and protect\n      your information when you use our App.</p>',i=h(),l=p("section"),l.innerHTML='<h2 class="svelte-1edafen">Information We Collect</h2> \n    <p class="svelte-1edafen">The App itself does not collect any personal data. However, we use AdMob\n      by Google for personalized advertisements, which may collect and use your\n      data. Please refer to AdMob&#39;s privacy policy for more information on the\n      data they collect and how it is used.</p>',r=h(),v=p("section"),v.innerHTML='<h2 class="svelte-1edafen">How AdMob Uses Your Data</h2> \n    <p class="svelte-1edafen">AdMob may collect and use data to show personalized ads. This includes,\n      but is not limited to:</p> \n    <ul class="svelte-1edafen"><li>Device information (e.g., model, OS, unique identifiers)</li> \n      <li>IP address</li> \n      <li>Usage data and metrics</li></ul> \n    <p class="svelte-1edafen">For detailed information on AdMob’s data collection and processing\n      practices, please review the <a href="https://policies.google.com/technologies/ads" target="_blank" class="svelte-1edafen">AdMob Privacy Policy</a>.</p>',y=h(),m=p("section"),m.innerHTML='<h2 class="svelte-1edafen">GDPR Compliance</h2> \n    <p class="svelte-1edafen">If you are located in the European Economic Area (EEA), you have certain\n      rights under the General Data Protection Regulation (GDPR). These rights\n      include:</p> \n    <ul class="svelte-1edafen"><li>The right to access the data AdMob has about you</li> \n      <li>The right to rectify any incorrect data</li> \n      <li>The right to erase your data</li> \n      <li>The right to restrict or object to the processing of your data</li> \n      <li>The right to data portability</li></ul> \n    <p class="svelte-1edafen">You can exercise these rights by contacting Google directly. For more\n      information on your rights under GDPR, please refer to the <a href="https://gdpr-info.eu/" target="_blank" class="svelte-1edafen">GDPR Information Portal</a>.</p>',b=h(),w=p("section"),w.innerHTML='<h2 class="svelte-1edafen">Consent to Personalized Ads</h2> \n    <p class="svelte-1edafen">When you use our App, you may be asked to provide consent for personalized\n      ads. You can manage your ad preferences or withdraw your consent at any\n      time through the settings on your device or by following the instructions\n      provided by AdMob.</p>',$=h(),k=p("section"),k.innerHTML='<h2 class="svelte-1edafen">Data Security</h2> \n    <p class="svelte-1edafen">We are committed to ensuring that your information is secure. Although we\n      do not collect personal data directly, we ensure that our third-party\n      partners, such as AdMob, use reasonable measures to protect your data.</p>',x=h(),P=p("section"),P.innerHTML='<h2 class="svelte-1edafen">Changes to This Privacy Policy</h2> \n    <p class="svelte-1edafen">We may update this Privacy Policy from time to time. Any changes will be\n      posted within the App and will take effect immediately upon posting.</p>',A=h(),T=p("section"),_=p("h2"),_.textContent="Contact Us",M=h(),q=p("p"),q.textContent="If you have any questions or concerns about this Privacy Policy, please\r\n      contact us at:",C=h(),z=p("p"),D=f("Email: "),L=p("a"),S=f(V),g(a,"class","svelte-1edafen"),g(_,"class","svelte-1edafen"),g(q,"class","svelte-1edafen"),g(L,"href",`mailto:${V}`),g(L,"class","svelte-1edafen"),g(z,"class","svelte-1edafen"),g(n,"class","privacy-policy svelte-1edafen")},m(e,t){u(e,n,t),c(n,a),c(n,o),c(n,s),c(n,i),c(n,l),c(n,r),c(n,v),c(n,y),c(n,m),c(n,b),c(n,w),c(n,$),c(n,k),c(n,x),c(n,P),c(n,A),c(n,T),c(T,_),c(T,M),c(T,q),c(T,C),c(T,z),c(z,D),c(z,L),c(L,S)},p:e,i:e,o:e,d(e){e&&d(n)}}}let V="savingsplanner.contact@gmail.com";class X extends G{constructor(e){super(),H(this,e,null,Q,s,{})}}function Z(t){let n,a,o,s,i,l,r,v,y,m,b,w,$,k,x,P,A,T,_,M,q,C,z,D;return{c(){n=p("div"),a=p("h1"),a.textContent="GDPR Notice",o=h(),s=p("section"),i=p("h2"),i.textContent="Data Controller",l=h(),r=p("p"),r.textContent="Savings Planner does not collect or process personal data directly. The\r\n      data controller for the personalized ads shown in the App is AdMob by\r\n      Google. Please refer to AdMob’s privacy policy for information on their\r\n      data processing practices.",v=h(),y=p("p"),m=p("a"),b=f("AdMob Privacy Policy"),w=h(),$=p("section"),$.innerHTML='<h2 class="svelte-1qv37xu">Legal Basis for Processing</h2> \n    <p class="svelte-1qv37xu">The legal basis for processing your data for personalized ads is your\n      consent. You can withdraw your consent at any time by adjusting your ad\n      settings or contacting AdMob directly.</p>',k=h(),x=p("section"),x.innerHTML='<h2 class="svelte-1qv37xu">Data Subject Rights</h2> \n    <p class="svelte-1qv37xu">Under GDPR, you have the following rights regarding your data:</p> \n    <ul class="svelte-1qv37xu"><li>Right to access</li> \n      <li>Right to rectification</li> \n      <li>Right to erasure</li> \n      <li>Right to restrict processing</li> \n      <li>Right to data portability</li> \n      <li>Right to object</li></ul> \n    <p class="svelte-1qv37xu">To exercise these rights, please contact AdMob as detailed in their\n      privacy policy.</p>',P=h(),A=p("section"),T=p("h2"),T.textContent="Complaints",_=h(),M=p("p"),M.textContent="If you believe your data protection rights have been violated, you have\r\n      the right to lodge a complaint with a supervisory authority in your\r\n      country of residence.",q=h(),C=p("p"),z=p("a"),D=f("GDPR Information Portal"),g(a,"class","svelte-1qv37xu"),g(i,"class","svelte-1qv37xu"),g(r,"class","svelte-1qv37xu"),g(m,"href",ee),g(m,"target","_blank"),g(m,"class","svelte-1qv37xu"),g(y,"class","svelte-1qv37xu"),g(T,"class","svelte-1qv37xu"),g(M,"class","svelte-1qv37xu"),g(z,"href",te),g(z,"target","_blank"),g(z,"class","svelte-1qv37xu"),g(C,"class","svelte-1qv37xu"),g(n,"class","gdpr-notice svelte-1qv37xu")},m(e,t){u(e,n,t),c(n,a),c(n,o),c(n,s),c(s,i),c(s,l),c(s,r),c(s,v),c(s,y),c(y,m),c(m,b),c(n,w),c(n,$),c(n,k),c(n,x),c(n,P),c(n,A),c(A,T),c(A,_),c(A,M),c(A,q),c(A,C),c(C,z),c(z,D)},p:e,i:e,o:e,d(e){e&&d(n)}}}let ee="https://policies.google.com/privacy",te="https://gdpr-info.eu/";class ne extends G{constructor(e){super(),H(this,e,null,Z,s,{})}}function ae(t){let n,a,o,s,i,l,r,f,v,y,m,b,w;return n=new N({}),l=new B({}),f=new X({}),y=new ne({}),b=new K({}),{c(){L(n.$$.fragment),a=h(),o=p("main"),s=p("section"),s.innerHTML='<h2 class="svelte-1r1kfku">Savings Planner</h2> \n    <div class="short-description svelte-1r1kfku"><h3 class="svelte-1r1kfku">Manage and optimize your wealth with our mobile investment planning app.</h3></div> \n    <div class="detailed-description svelte-1r1kfku"><p class="svelte-1r1kfku">Discover our mobile investment planning application, an essential tool\n        for managing and optimizing your wealth. With this application, you can\n        define different investment accounts, each with its initial amount and\n        performance. You have the ability to plan the distribution of your\n        monthly savings across these accounts, allowing you to diversify your\n        investments and minimize risks.</p> \n      <p class="svelte-1r1kfku">But that’s not all, our application also offers a multi-year projection\n        feature. This allows you to evaluate your future wealth and make\n        informed decisions. Start planning your financial future today with our\n        investment planning application.</p></div> \n    <div class="detailed-description svelte-1r1kfku"><p class="svelte-1r1kfku">Introducing our mobile investment planning application, an essential\n        tool for anyone looking to manage and optimize their wealth in an\n        efficient and intuitive manner. This application has been designed with\n        the user in mind, offering a user-friendly interface that is easy to\n        navigate.</p> \n      <p class="svelte-1r1kfku">With this application, you can define different investment accounts,\n        each with its initial amount and performance. This gives you a clear\n        overview of your investments and allows you to track their progress over\n        time. You can also add new accounts at any time, offering you the\n        flexibility needed to adapt your portfolio to your changing financial\n        goals.</p> \n      <p class="svelte-1r1kfku">One of the key features of our application is the ability to plan the\n        distribution of your monthly savings across these accounts. This means\n        you can decide how much you want to invest in each account each month,\n        allowing you to diversify your investments and minimize risks. This\n        feature is particularly useful for those looking to balance their\n        portfolio and avoid putting all their eggs in one basket.</p> \n      <p class="svelte-1r1kfku">But that’s not all, our application also offers a multi-year projection\n        feature. This allows you to evaluate your future wealth based on your\n        current investments and your monthly savings plan. You can see how your\n        wealth could evolve over time, giving you a clear idea of what you can\n        expect in the future. This feature can be a valuable tool for long-term\n        planning and can help you make informed decisions on how to manage your\n        money.</p> \n      <p class="svelte-1r1kfku">Start planning your financial future today with our investment planning\n        application. Download it now and take control of your financial future.</p></div> \n    <div class="features svelte-1r1kfku"><h3 class="svelte-1r1kfku">Features</h3> \n      <ul class="svelte-1r1kfku"><li class="svelte-1r1kfku">Definition of different investment accounts with initial amount and\n          performance.</li> \n        <li class="svelte-1r1kfku">Planning of the distribution of monthly savings across different\n          accounts.</li> \n        <li class="svelte-1r1kfku">Diversification of investments to minimize risks.</li> \n        <li class="svelte-1r1kfku">Multi-year projection feature to evaluate future wealth.</li> \n        <li class="svelte-1r1kfku">User-friendly and easy-to-navigate interface.</li></ul></div>',i=h(),L(l.$$.fragment),r=h(),L(f.$$.fragment),v=h(),L(y.$$.fragment),m=h(),L(b.$$.fragment),g(s,"class","about svelte-1r1kfku")},m(e,t){S(n,e,t),u(e,a,t),u(e,o,t),c(o,s),c(o,i),S(l,o,null),c(o,r),S(f,o,null),c(o,v),S(y,o,null),c(o,m),S(b,o,null),w=!0},p:e,i(e){w||(z(n.$$.fragment,e),z(l.$$.fragment,e),z(f.$$.fragment,e),z(y.$$.fragment,e),z(b.$$.fragment,e),w=!0)},o(e){D(n.$$.fragment,e),D(l.$$.fragment,e),D(f.$$.fragment,e),D(y.$$.fragment,e),D(b.$$.fragment,e),w=!1},d(e){R(n,e),e&&d(a),e&&d(o),R(l),R(f),R(y),R(b)}}}return new class extends G{constructor(e){super(),H(this,e,null,ae,s,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map
