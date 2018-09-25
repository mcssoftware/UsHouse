/* modernizr 3.3.1 (Custom Build) - backgroundsize-bgpositionxy-bgrepeatspace_bgrepeatround-bgsizecover-borderimage-borderradius-boxshadow-boxsizing-classlist-cssanimations-csscalc-cssgradients-csspositionsticky-csstransforms-csstransforms3d-csstransitions-flexbox-flexboxlegacy-flexboxtweener-flexwrap-fontface-hsla-lastchild-mediaqueries-multiplebgs-nthchild-opacity-overflowscrolling-rgba-textshadow-wrapflow-setclasses */
!function(e,t,n){function r(e,t){return typeof e===t}function s(){var e,t,n,s,o,i,a;for(var d in b)if(b.hasOwnProperty(d)){if(e=[],t=b[d],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(s=r(t.fn,"function")?t.fn():t.fn,o=0;o<e.length;o++)i=e[o],a=i.split("."),1===a.length?Modernizr[a[0]]=s:(!Modernizr[a[0]]||Modernizr[a[0]]instanceof Boolean||(Modernizr[a[0]]=new Boolean(Modernizr[a[0]])),Modernizr[a[0]][a[1]]=s),x.push((s?"":"no-")+a.join("-"))}}function o(e){var t=w.className,n=Modernizr._config.classPrefix||"";if(T&&(t=t.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(r,"$1"+n+"js$2")}Modernizr._config.enableClasses&&(t+=" "+n+e.join(" "+n),T?w.className.baseVal=t:w.className=t)}function i(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):T?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function a(e,t){return!!~(""+e).indexOf(t)}function d(e){return e.replace(/([a-z])-([a-z])/g,function(e,t,n){return t+n.toUpperCase()}).replace(/^-/,"")}function l(){var e=t.body;return e||(e=i(T?"svg":"body"),e.fake=!0),e}function f(e,n,r,s){var o,a,d,f,u="modernizr",c=i("div"),p=l();if(parseInt(r,10))for(;r--;)d=i("div"),d.id=s?s[r]:u+(r+1),c.appendChild(d);return o=i("style"),o.type="text/css",o.id="s"+u,(p.fake?p:c).appendChild(o),p.appendChild(c),o.styleSheet?o.styleSheet.cssText=e:o.appendChild(t.createTextNode(e)),c.id=u,p.fake&&(p.style.background="",p.style.overflow="hidden",f=w.style.overflow,w.style.overflow="hidden",w.appendChild(p)),a=n(c,e),p.fake?(p.parentNode.removeChild(p),w.style.overflow=f,w.offsetHeight):c.parentNode.removeChild(c),!!a}function u(e,t){return function(){return e.apply(t,arguments)}}function c(e,t,n){var s;for(var o in e)if(e[o]in t)return n===!1?e[o]:(s=t[e[o]],r(s,"function")?u(s,n||t):s);return!1}function p(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-")}function g(t,r){var s=t.length;if("CSS"in e&&"supports"in e.CSS){for(;s--;)if(e.CSS.supports(p(t[s]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var o=[];s--;)o.push("("+p(t[s])+":"+r+")");return o=o.join(" or "),f("@supports ("+o+") { #modernizr { position: absolute; } }",function(e){return"absolute"==getComputedStyle(e,null).position})}return n}function h(e,t,s,o){function l(){u&&(delete j.style,delete j.modElem)}if(o=r(o,"undefined")?!1:o,!r(s,"undefined")){var f=g(e,s);if(!r(f,"undefined"))return f}for(var u,c,p,h,m,v=["modernizr","tspan","samp"];!j.style&&v.length;)u=!0,j.modElem=i(v.shift()),j.style=j.modElem.style;for(p=e.length,c=0;p>c;c++)if(h=e[c],m=j.style[h],a(h,"-")&&(h=d(h)),j.style[h]!==n){if(o||r(s,"undefined"))return l(),"pfx"==t?h:!0;try{j.style[h]=s}catch(x){}if(j.style[h]!=m)return l(),"pfx"==t?h:!0}return l(),!1}function m(e,t,n,s,o){var i=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+R.join(i+" ")+i).split(" ");return r(t,"string")||r(t,"undefined")?h(a,t,s,o):(a=(e+" "+N.join(i+" ")+i).split(" "),c(a,t,n))}function v(e,t,r){return m(e,n,n,t,r)}var x=[],b=[],y={_version:"3.3.1",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){b.push({name:e,fn:t,options:n})},addAsyncTest:function(e){b.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=y,Modernizr=new Modernizr;var w=t.documentElement;Modernizr.addTest("classlist","classList"in w);var T="svg"===w.nodeName.toLowerCase();Modernizr.addTest("multiplebgs",function(){var e=i("a").style;return e.cssText="background:url(https://),url(https://),red url(https://)",/(url\s*\(.*?){3}/.test(e.background)}),Modernizr.addTest("rgba",function(){var e=i("a").style;return e.cssText="background-color:rgba(150,255,150,.5)",(""+e.backgroundColor).indexOf("rgba")>-1});var C=y._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];y._prefixes=C,Modernizr.addTest("csscalc",function(){var e="width:",t="calc(10px);",n=i("a");return n.style.cssText=e+C.join(t+e),!!n.style.length}),Modernizr.addTest("cssgradients",function(){for(var e,t="background-image:",n="gradient(linear,left top,right bottom,from(#9f9),to(white));",r="",s=0,o=C.length-1;o>s;s++)e=0===s?"to ":"",r+=t+C[s]+"linear-gradient("+e+"left top, #9f9, white);";Modernizr._config.usePrefixes&&(r+=t+"-webkit-"+n);var a=i("a"),d=a.style;return d.cssText=r,(""+d.backgroundImage).indexOf("gradient")>-1}),Modernizr.addTest("opacity",function(){var e=i("a").style;return e.cssText=C.join("opacity:.55;"),/^0.55$/.test(e.opacity)}),Modernizr.addTest("csspositionsticky",function(){var e="position:",t="sticky",n=i("a"),r=n.style;return r.cssText=e+C.join(t+";"+e).slice(0,-e.length),-1!==r.position.indexOf(t)}),Modernizr.addTest("hsla",function(){var e=i("a").style;return e.cssText="background-color:hsla(120,40%,100%,.5)",a(e.backgroundColor,"rgba")||a(e.backgroundColor,"hsla")});var S="CSS"in e&&"supports"in e.CSS,k="supportsCSS"in e;Modernizr.addTest("supports",S||k);var _=y.testStyles=f,z=function(){var e=navigator.userAgent,t=e.match(/applewebkit\/([0-9]+)/gi)&&parseFloat(RegExp.$1),n=e.match(/w(eb)?osbrowser/gi),r=e.match(/windows phone/gi)&&e.match(/iemobile\/([0-9])+/gi)&&parseFloat(RegExp.$1)>=9,s=533>t&&e.match(/android/gi);return n||s||r}();z?Modernizr.addTest("fontface",!1):_('@font-face {font-family:"font";src:url("https://")}',function(e,n){var r=t.getElementById("smodernizr"),s=r.sheet||r.styleSheet,o=s?s.cssRules&&s.cssRules[0]?s.cssRules[0].cssText:s.cssText||"":"",i=/src/i.test(o)&&0===o.indexOf(n.split(" ")[0]);Modernizr.addTest("fontface",i)}),_("#modernizr div {width:100px} #modernizr :last-child{width:200px;display:block}",function(e){Modernizr.addTest("lastchild",e.lastChild.offsetWidth>e.firstChild.offsetWidth)},2),_("#modernizr div {width:1px} #modernizr div:nth-child(2n) {width:2px;}",function(e){for(var t=e.getElementsByTagName("div"),n=!0,r=0;5>r;r++)n=n&&t[r].offsetWidth===r%2+1;Modernizr.addTest("nthchild",n)},5);var P=function(){var t=e.matchMedia||e.msMatchMedia;return t?function(e){var n=t(e);return n&&n.matches||!1}:function(t){var n=!1;return f("@media "+t+" { #modernizr { position: absolute; } }",function(t){n="absolute"==(e.getComputedStyle?e.getComputedStyle(t,null):t.currentStyle).position}),n}}();y.mq=P,Modernizr.addTest("mediaqueries",P("only all"));var E="Moz O ms Webkit",R=y._config.usePrefixes?E.split(" "):[];y._cssomPrefixes=R;var A=function(t){var r,s=C.length,o=e.CSSRule;if("undefined"==typeof o)return n;if(!t)return!1;if(t=t.replace(/^@/,""),r=t.replace(/-/g,"_").toUpperCase()+"_RULE",r in o)return"@"+t;for(var i=0;s>i;i++){var a=C[i],d=a.toUpperCase()+"_"+r;if(d in o)return"@-"+a.toLowerCase()+"-"+t}return!1};y.atRule=A;var N=y._config.usePrefixes?E.toLowerCase().split(" "):[];y._domPrefixes=N;var O={elem:i("modernizr")};Modernizr._q.push(function(){delete O.elem});var j={style:O.elem.style};Modernizr._q.unshift(function(){delete j.style});var L=y.testProp=function(e,t,r){return h([e],n,t,r)};Modernizr.addTest("textshadow",L("textShadow","1px 1px")),y.testAllProps=m,y.testAllProps=v,Modernizr.addTest("cssanimations",v("animationName","a",!0)),Modernizr.addTest("bgpositionxy",function(){return v("backgroundPositionX","3px",!0)&&v("backgroundPositionY","5px",!0)}),Modernizr.addTest("bgrepeatround",v("backgroundRepeat","round")),Modernizr.addTest("bgrepeatspace",v("backgroundRepeat","space")),Modernizr.addTest("backgroundsize",v("backgroundSize","100%",!0)),Modernizr.addTest("bgsizecover",v("backgroundSize","cover")),Modernizr.addTest("borderimage",v("borderImage","url() 1",!0)),Modernizr.addTest("borderradius",v("borderRadius","0px",!0)),Modernizr.addTest("boxshadow",v("boxShadow","1px 1px",!0)),Modernizr.addTest("boxsizing",v("boxSizing","border-box",!0)&&(t.documentMode===n||t.documentMode>7)),Modernizr.addTest("flexbox",v("flexBasis","1px",!0)),Modernizr.addTest("flexboxlegacy",v("boxDirection","reverse",!0)),Modernizr.addTest("flexboxtweener",v("flexAlign","end",!0)),Modernizr.addTest("flexwrap",v("flexWrap","wrap",!0)),Modernizr.addTest("overflowscrolling",v("overflowScrolling","touch",!0)),Modernizr.addTest("csstransforms",function(){return-1===navigator.userAgent.indexOf("Android 2.")&&v("transform","scale(1)",!0)}),Modernizr.addTest("csstransforms3d",function(){var e=!!v("perspective","1px",!0),t=Modernizr._config.usePrefixes;if(e&&(!t||"webkitPerspective"in w.style)){var n,r="#modernizr{width:0;height:0}";Modernizr.supports?n="@supports (perspective: 1px)":(n="@media (transform-3d)",t&&(n+=",(-webkit-transform-3d)")),n+="{#modernizr{width:7px;height:18px;margin:0;padding:0;border:0}}",_(r+n,function(t){e=7===t.offsetWidth&&18===t.offsetHeight})}return e}),Modernizr.addTest("csstransitions",v("transition","all",!0));var q=y.prefixed=function(e,t,n){return 0===e.indexOf("@")?A(e):(-1!=e.indexOf("-")&&(e=d(e)),t?m(e,t,n):m(e,"pfx"))};Modernizr.addTest("wrapflow",function(){var e=q("wrapFlow");if(!e||T)return!1;var t=e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-"),r=i("div"),s=i("div"),o=i("span");s.style.cssText="position: absolute; left: 50px; width: 100px; height: 20px;"+t+":end;",o.innerText="X",r.appendChild(s),r.appendChild(o),w.appendChild(r);var a=o.offsetLeft;return w.removeChild(r),s=o=r=n,150==a}),s(),o(x),delete y.addTest,delete y.addAsyncTest;for(var M=0;M<Modernizr._q.length;M++)Modernizr._q[M]();e.Modernizr=Modernizr}(window,document);