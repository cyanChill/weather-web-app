(()=>{"use strict";function e(e,t){if(t.length<e)throw new TypeError(e+" argument"+(e>1?"s":"")+" required, but only "+t.length+" present")}function t(t){e(1,arguments);var n=Object.prototype.toString.call(t);return t instanceof Date||"object"==typeof t&&"[object Date]"===n?new Date(t.getTime()):"number"==typeof t||"[object Number]"===n?new Date(t):("string"!=typeof t&&"[object String]"!==n||"undefined"==typeof console||(console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule"),console.warn((new Error).stack)),new Date(NaN))}function n(n){e(1,arguments);var r=t(n),a=r.getTime();return a}function r(t){return e(1,arguments),Math.floor(n(t)/1e3)}function a(e){if(null===e||!0===e||!1===e)return NaN;var t=Number(e);return isNaN(t)?t:t<0?Math.ceil(t):Math.floor(t)}function o(n){e(1,arguments);var r=t(n);return!isNaN(r)}(function(){const e=document.getElementById("hourly"),t=document.getElementById("daily"),n=document.getElementById("hourly-weather"),r=document.getElementById("daily-weather");function a(a){n.classList.add("hidden"),r.classList.add("hidden"),e.classList.remove("selected"),t.classList.remove("selected"),"hourly"===a?(e.classList.add("selected"),n.classList.remove("hidden")):"daily"===a&&(t.classList.add("selected"),r.classList.remove("hidden"))}e.addEventListener("click",(()=>{a("hourly")})),t.addEventListener("click",(()=>{a("daily")}))})(),function(){const e=document.getElementById("hourly-weather"),t=document.getElementById("daily-weather");let n=!1;[e,t].forEach((e=>{e.addEventListener("mousedown",(e=>{n=!0})),e.addEventListener("mouseup",(()=>{n=!1})),e.addEventListener("mouseleave",(()=>{n=!1})),e.addEventListener("mousemove",(t=>{if(n){if(e.scrollLeft-t.movementX<=0||e.scrollLeft-t.movementX>e.scrollWidth-e.clientWidth)return;e.scrollBy(-t.movementX,0)}}))}))}();var i={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"1 second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"about 1 hour",other:"about {{count}} hours"},xHours:{one:"1 hour",other:"{{count}} hours"},xDays:{one:"1 day",other:"{{count}} days"},aboutXWeeks:{one:"about 1 week",other:"about {{count}} weeks"},xWeeks:{one:"1 week",other:"{{count}} weeks"},aboutXMonths:{one:"about 1 month",other:"about {{count}} months"},xMonths:{one:"1 month",other:"{{count}} months"},aboutXYears:{one:"about 1 year",other:"about {{count}} years"},xYears:{one:"1 year",other:"{{count}} years"},overXYears:{one:"over 1 year",other:"over {{count}} years"},almostXYears:{one:"almost 1 year",other:"almost {{count}} years"}};function u(e){return function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=t.width?String(t.width):e.defaultWidth,r=e.formats[n]||e.formats[e.defaultWidth];return r}}var c,s={date:u({formats:{full:"EEEE, MMMM do, y",long:"MMMM do, y",medium:"MMM d, y",short:"MM/dd/yyyy"},defaultWidth:"full"}),time:u({formats:{full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},defaultWidth:"full"}),dateTime:u({formats:{full:"{{date}} 'at' {{time}}",long:"{{date}} 'at' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},defaultWidth:"full"})},d={lastWeek:"'last' eeee 'at' p",yesterday:"'yesterday at' p",today:"'today at' p",tomorrow:"'tomorrow at' p",nextWeek:"eeee 'at' p",other:"P"};function l(e){return function(t,n){var r,a=n||{};if("formatting"===(a.context?String(a.context):"standalone")&&e.formattingValues){var o=e.defaultFormattingWidth||e.defaultWidth,i=a.width?String(a.width):o;r=e.formattingValues[i]||e.formattingValues[o]}else{var u=e.defaultWidth,c=a.width?String(a.width):e.defaultWidth;r=e.values[c]||e.values[u]}return r[e.argumentCallback?e.argumentCallback(t):t]}}function h(e){return function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=n.width,a=r&&e.matchPatterns[r]||e.matchPatterns[e.defaultMatchWidth],o=t.match(a);if(!o)return null;var i,u=o[0],c=r&&e.parsePatterns[r]||e.parsePatterns[e.defaultParseWidth],s=Array.isArray(c)?f(c,(function(e){return e.test(u)})):m(c,(function(e){return e.test(u)}));i=e.valueCallback?e.valueCallback(s):s,i=n.valueCallback?n.valueCallback(i):i;var d=t.slice(u.length);return{value:i,rest:d}}}function m(e,t){for(var n in e)if(e.hasOwnProperty(n)&&t(e[n]))return n}function f(e,t){for(var n=0;n<e.length;n++)if(t(e[n]))return n}const g={code:"en-US",formatDistance:function(e,t,n){var r;return n=n||{},r="string"==typeof i[e]?i[e]:1===t?i[e].one:i[e].other.replace("{{count}}",t),n.addSuffix?n.comparison>0?"in "+r:r+" ago":r},formatLong:s,formatRelative:function(e,t,n,r){return d[e]},localize:{ordinalNumber:function(e,t){var n=Number(e),r=n%100;if(r>20||r<10)switch(r%10){case 1:return n+"st";case 2:return n+"nd";case 3:return n+"rd"}return n+"th"},era:l({values:{narrow:["B","A"],abbreviated:["BC","AD"],wide:["Before Christ","Anno Domini"]},defaultWidth:"wide"}),quarter:l({values:{narrow:["1","2","3","4"],abbreviated:["Q1","Q2","Q3","Q4"],wide:["1st quarter","2nd quarter","3rd quarter","4th quarter"]},defaultWidth:"wide",argumentCallback:function(e){return Number(e)-1}}),month:l({values:{narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],wide:["January","February","March","April","May","June","July","August","September","October","November","December"]},defaultWidth:"wide"}),day:l({values:{narrow:["S","M","T","W","T","F","S"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],wide:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},defaultWidth:"wide"}),dayPeriod:l({values:{narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"}},defaultWidth:"wide",formattingValues:{narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"}},defaultFormattingWidth:"wide"})},match:{ordinalNumber:(c={matchPattern:/^(\d+)(th|st|nd|rd)?/i,parsePattern:/\d+/i,valueCallback:function(e){return parseInt(e,10)}},function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=e.match(c.matchPattern);if(!n)return null;var r=n[0],a=e.match(c.parsePattern);if(!a)return null;var o=c.valueCallback?c.valueCallback(a[0]):a[0];o=t.valueCallback?t.valueCallback(o):o;var i=e.slice(r.length);return{value:o,rest:i}}),era:h({matchPatterns:{narrow:/^(b|a)/i,abbreviated:/^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,wide:/^(before christ|before common era|anno domini|common era)/i},defaultMatchWidth:"wide",parsePatterns:{any:[/^b/i,/^(a|c)/i]},defaultParseWidth:"any"}),quarter:h({matchPatterns:{narrow:/^[1234]/i,abbreviated:/^q[1234]/i,wide:/^[1234](th|st|nd|rd)? quarter/i},defaultMatchWidth:"wide",parsePatterns:{any:[/1/i,/2/i,/3/i,/4/i]},defaultParseWidth:"any",valueCallback:function(e){return e+1}}),month:h({matchPatterns:{narrow:/^[jfmasond]/i,abbreviated:/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,wide:/^(january|february|march|april|may|june|july|august|september|october|november|december)/i},defaultMatchWidth:"wide",parsePatterns:{narrow:[/^j/i,/^f/i,/^m/i,/^a/i,/^m/i,/^j/i,/^j/i,/^a/i,/^s/i,/^o/i,/^n/i,/^d/i],any:[/^ja/i,/^f/i,/^mar/i,/^ap/i,/^may/i,/^jun/i,/^jul/i,/^au/i,/^s/i,/^o/i,/^n/i,/^d/i]},defaultParseWidth:"any"}),day:h({matchPatterns:{narrow:/^[smtwf]/i,short:/^(su|mo|tu|we|th|fr|sa)/i,abbreviated:/^(sun|mon|tue|wed|thu|fri|sat)/i,wide:/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i},defaultMatchWidth:"wide",parsePatterns:{narrow:[/^s/i,/^m/i,/^t/i,/^w/i,/^t/i,/^f/i,/^s/i],any:[/^su/i,/^m/i,/^tu/i,/^w/i,/^th/i,/^f/i,/^sa/i]},defaultParseWidth:"any"}),dayPeriod:h({matchPatterns:{narrow:/^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,any:/^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i},defaultMatchWidth:"any",parsePatterns:{any:{am:/^a/i,pm:/^p/i,midnight:/^mi/i,noon:/^no/i,morning:/morning/i,afternoon:/afternoon/i,evening:/evening/i,night:/night/i}},defaultParseWidth:"any"})},options:{weekStartsOn:0,firstWeekContainsDate:1}};function w(n,r){e(2,arguments);var o=t(n).getTime(),i=a(r);return new Date(o+i)}function y(t,n){e(2,arguments);var r=a(n);return w(t,-r)}function p(e,t){for(var n=e<0?"-":"",r=Math.abs(e).toString();r.length<t;)r="0"+r;return n+r}const v=function(e,t){var n=e.getUTCFullYear(),r=n>0?n:1-n;return p("yy"===t?r%100:r,t.length)},b=function(e,t){var n=e.getUTCMonth();return"M"===t?String(n+1):p(n+1,2)},C=function(e,t){return p(e.getUTCDate(),t.length)},T=function(e,t){return p(e.getUTCHours()%12||12,t.length)},x=function(e,t){return p(e.getUTCHours(),t.length)},M=function(e,t){return p(e.getUTCMinutes(),t.length)},S=function(e,t){return p(e.getUTCSeconds(),t.length)},E=function(e,t){var n=t.length,r=e.getUTCMilliseconds();return p(Math.floor(r*Math.pow(10,n-3)),t.length)};var D=864e5;function W(n){e(1,arguments);var r=1,a=t(n),o=a.getUTCDay(),i=(o<r?7:0)+o-r;return a.setUTCDate(a.getUTCDate()-i),a.setUTCHours(0,0,0,0),a}function P(n){e(1,arguments);var r=t(n),a=r.getUTCFullYear(),o=new Date(0);o.setUTCFullYear(a+1,0,4),o.setUTCHours(0,0,0,0);var i=W(o),u=new Date(0);u.setUTCFullYear(a,0,4),u.setUTCHours(0,0,0,0);var c=W(u);return r.getTime()>=i.getTime()?a+1:r.getTime()>=c.getTime()?a:a-1}function k(t){e(1,arguments);var n=P(t),r=new Date(0);r.setUTCFullYear(n,0,4),r.setUTCHours(0,0,0,0);var a=W(r);return a}var U=6048e5;function L(n,r){e(1,arguments);var o=r||{},i=o.locale,u=i&&i.options&&i.options.weekStartsOn,c=null==u?0:a(u),s=null==o.weekStartsOn?c:a(o.weekStartsOn);if(!(s>=0&&s<=6))throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");var d=t(n),l=d.getUTCDay(),h=(l<s?7:0)+l-s;return d.setUTCDate(d.getUTCDate()-h),d.setUTCHours(0,0,0,0),d}function I(n,r){e(1,arguments);var o=t(n,r),i=o.getUTCFullYear(),u=r||{},c=u.locale,s=c&&c.options&&c.options.firstWeekContainsDate,d=null==s?1:a(s),l=null==u.firstWeekContainsDate?d:a(u.firstWeekContainsDate);if(!(l>=1&&l<=7))throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");var h=new Date(0);h.setUTCFullYear(i+1,0,l),h.setUTCHours(0,0,0,0);var m=L(h,r),f=new Date(0);f.setUTCFullYear(i,0,l),f.setUTCHours(0,0,0,0);var g=L(f,r);return o.getTime()>=m.getTime()?i+1:o.getTime()>=g.getTime()?i:i-1}function q(t,n){e(1,arguments);var r=n||{},o=r.locale,i=o&&o.options&&o.options.firstWeekContainsDate,u=null==i?1:a(i),c=null==r.firstWeekContainsDate?u:a(r.firstWeekContainsDate),s=I(t,n),d=new Date(0);d.setUTCFullYear(s,0,c),d.setUTCHours(0,0,0,0);var l=L(d,n);return l}var N=6048e5;function Y(e,t){var n=e>0?"-":"+",r=Math.abs(e),a=Math.floor(r/60),o=r%60;if(0===o)return n+String(a);var i=t||"";return n+String(a)+i+p(o,2)}function O(e,t){return e%60==0?(e>0?"-":"+")+p(Math.abs(e)/60,2):F(e,t)}function F(e,t){var n=t||"",r=e>0?"-":"+",a=Math.abs(e);return r+p(Math.floor(a/60),2)+n+p(a%60,2)}const B={G:function(e,t,n){var r=e.getUTCFullYear()>0?1:0;switch(t){case"G":case"GG":case"GGG":return n.era(r,{width:"abbreviated"});case"GGGGG":return n.era(r,{width:"narrow"});case"GGGG":default:return n.era(r,{width:"wide"})}},y:function(e,t,n){if("yo"===t){var r=e.getUTCFullYear(),a=r>0?r:1-r;return n.ordinalNumber(a,{unit:"year"})}return v(e,t)},Y:function(e,t,n,r){var a=I(e,r),o=a>0?a:1-a;return"YY"===t?p(o%100,2):"Yo"===t?n.ordinalNumber(o,{unit:"year"}):p(o,t.length)},R:function(e,t){return p(P(e),t.length)},u:function(e,t){return p(e.getUTCFullYear(),t.length)},Q:function(e,t,n){var r=Math.ceil((e.getUTCMonth()+1)/3);switch(t){case"Q":return String(r);case"QQ":return p(r,2);case"Qo":return n.ordinalNumber(r,{unit:"quarter"});case"QQQ":return n.quarter(r,{width:"abbreviated",context:"formatting"});case"QQQQQ":return n.quarter(r,{width:"narrow",context:"formatting"});case"QQQQ":default:return n.quarter(r,{width:"wide",context:"formatting"})}},q:function(e,t,n){var r=Math.ceil((e.getUTCMonth()+1)/3);switch(t){case"q":return String(r);case"qq":return p(r,2);case"qo":return n.ordinalNumber(r,{unit:"quarter"});case"qqq":return n.quarter(r,{width:"abbreviated",context:"standalone"});case"qqqqq":return n.quarter(r,{width:"narrow",context:"standalone"});case"qqqq":default:return n.quarter(r,{width:"wide",context:"standalone"})}},M:function(e,t,n){var r=e.getUTCMonth();switch(t){case"M":case"MM":return b(e,t);case"Mo":return n.ordinalNumber(r+1,{unit:"month"});case"MMM":return n.month(r,{width:"abbreviated",context:"formatting"});case"MMMMM":return n.month(r,{width:"narrow",context:"formatting"});case"MMMM":default:return n.month(r,{width:"wide",context:"formatting"})}},L:function(e,t,n){var r=e.getUTCMonth();switch(t){case"L":return String(r+1);case"LL":return p(r+1,2);case"Lo":return n.ordinalNumber(r+1,{unit:"month"});case"LLL":return n.month(r,{width:"abbreviated",context:"standalone"});case"LLLLL":return n.month(r,{width:"narrow",context:"standalone"});case"LLLL":default:return n.month(r,{width:"wide",context:"standalone"})}},w:function(n,r,a,o){var i=function(n,r){e(1,arguments);var a=t(n),o=L(a,r).getTime()-q(a,r).getTime();return Math.round(o/N)+1}(n,o);return"wo"===r?a.ordinalNumber(i,{unit:"week"}):p(i,r.length)},I:function(n,r,a){var o=function(n){e(1,arguments);var r=t(n),a=W(r).getTime()-k(r).getTime();return Math.round(a/U)+1}(n);return"Io"===r?a.ordinalNumber(o,{unit:"week"}):p(o,r.length)},d:function(e,t,n){return"do"===t?n.ordinalNumber(e.getUTCDate(),{unit:"date"}):C(e,t)},D:function(n,r,a){var o=function(n){e(1,arguments);var r=t(n),a=r.getTime();r.setUTCMonth(0,1),r.setUTCHours(0,0,0,0);var o=r.getTime(),i=a-o;return Math.floor(i/D)+1}(n);return"Do"===r?a.ordinalNumber(o,{unit:"dayOfYear"}):p(o,r.length)},E:function(e,t,n){var r=e.getUTCDay();switch(t){case"E":case"EE":case"EEE":return n.day(r,{width:"abbreviated",context:"formatting"});case"EEEEE":return n.day(r,{width:"narrow",context:"formatting"});case"EEEEEE":return n.day(r,{width:"short",context:"formatting"});case"EEEE":default:return n.day(r,{width:"wide",context:"formatting"})}},e:function(e,t,n,r){var a=e.getUTCDay(),o=(a-r.weekStartsOn+8)%7||7;switch(t){case"e":return String(o);case"ee":return p(o,2);case"eo":return n.ordinalNumber(o,{unit:"day"});case"eee":return n.day(a,{width:"abbreviated",context:"formatting"});case"eeeee":return n.day(a,{width:"narrow",context:"formatting"});case"eeeeee":return n.day(a,{width:"short",context:"formatting"});case"eeee":default:return n.day(a,{width:"wide",context:"formatting"})}},c:function(e,t,n,r){var a=e.getUTCDay(),o=(a-r.weekStartsOn+8)%7||7;switch(t){case"c":return String(o);case"cc":return p(o,t.length);case"co":return n.ordinalNumber(o,{unit:"day"});case"ccc":return n.day(a,{width:"abbreviated",context:"standalone"});case"ccccc":return n.day(a,{width:"narrow",context:"standalone"});case"cccccc":return n.day(a,{width:"short",context:"standalone"});case"cccc":default:return n.day(a,{width:"wide",context:"standalone"})}},i:function(e,t,n){var r=e.getUTCDay(),a=0===r?7:r;switch(t){case"i":return String(a);case"ii":return p(a,t.length);case"io":return n.ordinalNumber(a,{unit:"day"});case"iii":return n.day(r,{width:"abbreviated",context:"formatting"});case"iiiii":return n.day(r,{width:"narrow",context:"formatting"});case"iiiiii":return n.day(r,{width:"short",context:"formatting"});case"iiii":default:return n.day(r,{width:"wide",context:"formatting"})}},a:function(e,t,n){var r=e.getUTCHours()/12>=1?"pm":"am";switch(t){case"a":case"aa":return n.dayPeriod(r,{width:"abbreviated",context:"formatting"});case"aaa":return n.dayPeriod(r,{width:"abbreviated",context:"formatting"}).toLowerCase();case"aaaaa":return n.dayPeriod(r,{width:"narrow",context:"formatting"});case"aaaa":default:return n.dayPeriod(r,{width:"wide",context:"formatting"})}},b:function(e,t,n){var r,a=e.getUTCHours();switch(r=12===a?"noon":0===a?"midnight":a/12>=1?"pm":"am",t){case"b":case"bb":return n.dayPeriod(r,{width:"abbreviated",context:"formatting"});case"bbb":return n.dayPeriod(r,{width:"abbreviated",context:"formatting"}).toLowerCase();case"bbbbb":return n.dayPeriod(r,{width:"narrow",context:"formatting"});case"bbbb":default:return n.dayPeriod(r,{width:"wide",context:"formatting"})}},B:function(e,t,n){var r,a=e.getUTCHours();switch(r=a>=17?"evening":a>=12?"afternoon":a>=4?"morning":"night",t){case"B":case"BB":case"BBB":return n.dayPeriod(r,{width:"abbreviated",context:"formatting"});case"BBBBB":return n.dayPeriod(r,{width:"narrow",context:"formatting"});case"BBBB":default:return n.dayPeriod(r,{width:"wide",context:"formatting"})}},h:function(e,t,n){if("ho"===t){var r=e.getUTCHours()%12;return 0===r&&(r=12),n.ordinalNumber(r,{unit:"hour"})}return T(e,t)},H:function(e,t,n){return"Ho"===t?n.ordinalNumber(e.getUTCHours(),{unit:"hour"}):x(e,t)},K:function(e,t,n){var r=e.getUTCHours()%12;return"Ko"===t?n.ordinalNumber(r,{unit:"hour"}):p(r,t.length)},k:function(e,t,n){var r=e.getUTCHours();return 0===r&&(r=24),"ko"===t?n.ordinalNumber(r,{unit:"hour"}):p(r,t.length)},m:function(e,t,n){return"mo"===t?n.ordinalNumber(e.getUTCMinutes(),{unit:"minute"}):M(e,t)},s:function(e,t,n){return"so"===t?n.ordinalNumber(e.getUTCSeconds(),{unit:"second"}):S(e,t)},S:function(e,t){return E(e,t)},X:function(e,t,n,r){var a=(r._originalDate||e).getTimezoneOffset();if(0===a)return"Z";switch(t){case"X":return O(a);case"XXXX":case"XX":return F(a);case"XXXXX":case"XXX":default:return F(a,":")}},x:function(e,t,n,r){var a=(r._originalDate||e).getTimezoneOffset();switch(t){case"x":return O(a);case"xxxx":case"xx":return F(a);case"xxxxx":case"xxx":default:return F(a,":")}},O:function(e,t,n,r){var a=(r._originalDate||e).getTimezoneOffset();switch(t){case"O":case"OO":case"OOO":return"GMT"+Y(a,":");case"OOOO":default:return"GMT"+F(a,":")}},z:function(e,t,n,r){var a=(r._originalDate||e).getTimezoneOffset();switch(t){case"z":case"zz":case"zzz":return"GMT"+Y(a,":");case"zzzz":default:return"GMT"+F(a,":")}},t:function(e,t,n,r){var a=r._originalDate||e;return p(Math.floor(a.getTime()/1e3),t.length)},T:function(e,t,n,r){return p((r._originalDate||e).getTime(),t.length)}};function H(e,t){switch(e){case"P":return t.date({width:"short"});case"PP":return t.date({width:"medium"});case"PPP":return t.date({width:"long"});case"PPPP":default:return t.date({width:"full"})}}function j(e,t){switch(e){case"p":return t.time({width:"short"});case"pp":return t.time({width:"medium"});case"ppp":return t.time({width:"long"});case"pppp":default:return t.time({width:"full"})}}const z={p:j,P:function(e,t){var n,r=e.match(/(P+)(p+)?/),a=r[1],o=r[2];if(!o)return H(e,t);switch(a){case"P":n=t.dateTime({width:"short"});break;case"PP":n=t.dateTime({width:"medium"});break;case"PPP":n=t.dateTime({width:"long"});break;case"PPPP":default:n=t.dateTime({width:"full"})}return n.replace("{{date}}",H(a,t)).replace("{{time}}",j(o,t))}};function X(e){var t=new Date(Date.UTC(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds()));return t.setUTCFullYear(e.getFullYear()),e.getTime()-t.getTime()}var A=["D","DD"],Q=["YY","YYYY"];function $(e){return-1!==A.indexOf(e)}function G(e){return-1!==Q.indexOf(e)}function R(e,t,n){if("YYYY"===e)throw new RangeError("Use `yyyy` instead of `YYYY` (in `".concat(t,"`) for formatting years to the input `").concat(n,"`; see: https://git.io/fxCyr"));if("YY"===e)throw new RangeError("Use `yy` instead of `YY` (in `".concat(t,"`) for formatting years to the input `").concat(n,"`; see: https://git.io/fxCyr"));if("D"===e)throw new RangeError("Use `d` instead of `D` (in `".concat(t,"`) for formatting days of the month to the input `").concat(n,"`; see: https://git.io/fxCyr"));if("DD"===e)throw new RangeError("Use `dd` instead of `DD` (in `".concat(t,"`) for formatting days of the month to the input `").concat(n,"`; see: https://git.io/fxCyr"))}var J=/[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,_=/P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,V=/^'([^]*?)'?$/,K=/''/g,Z=/[a-zA-Z]/;function ee(n,r,i){e(2,arguments);var u=String(r),c=i||{},s=c.locale||g,d=s.options&&s.options.firstWeekContainsDate,l=null==d?1:a(d),h=null==c.firstWeekContainsDate?l:a(c.firstWeekContainsDate);if(!(h>=1&&h<=7))throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");var m=s.options&&s.options.weekStartsOn,f=null==m?0:a(m),w=null==c.weekStartsOn?f:a(c.weekStartsOn);if(!(w>=0&&w<=6))throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");if(!s.localize)throw new RangeError("locale must contain localize property");if(!s.formatLong)throw new RangeError("locale must contain formatLong property");var p=t(n);if(!o(p))throw new RangeError("Invalid time value");var v=X(p),b=y(p,v),C={firstWeekContainsDate:h,weekStartsOn:w,locale:s,_originalDate:p},T=u.match(_).map((function(e){var t=e[0];return"p"===t||"P"===t?(0,z[t])(e,s.formatLong,C):e})).join("").match(J).map((function(e){if("''"===e)return"'";var t=e[0];if("'"===t)return te(e);var a=B[t];if(a)return!c.useAdditionalWeekYearTokens&&G(e)&&R(e,r,n),!c.useAdditionalDayOfYearTokens&&$(e)&&R(e,r,n),a(b,e,s.localize,C);if(t.match(Z))throw new RangeError("Format string contains an unescaped latin alphabet character `"+t+"`");return e})).join("");return T}function te(e){return e.match(V)[1].replace(K,"'")}function ne(e){return"[object Object]"===Object.prototype.toString.call(e)}function re(e){return e.toLowerCase().split(" ").map((e=>e.replace(e[0],e[0].toUpperCase()))).join(" ")}function ae(e,t){const n=localStorage.getItem("unit")||"F",r=+e.toString().split("°")[0],a=+e.toString().match(/\d+\.?\d*/)[0];switch(t){case"temperature":return"C"===n?(e.toString().includes("F")||"number"==typeof e)&&(e=5*(r-32)/9):"F"===n&&e.toString().includes("C")&&(e=9*r/5+32),`${Math.round(e)}°${n}`;case"wind-speed":return"C"===n?(e.toString().includes("mph")||"number"==typeof e)&&(e=1.609*a):"F"===n&&e.toString().includes("km/h")&&(e=a/1.609),`${e.toFixed(1)}${"F"===n?"mph":"km/h"}`;case"visibility":return e<1e3?`${e}m`:`${Math.round(e/1e3)}km`;case"precipitation":return`${Math.round(100*e)}%`;default:return e}}function oe(e,t){sessionStorage.setItem(e,JSON.stringify(t))}function ie(e){const t=r(new Date);return Array.isArray(e)||(e=[e]),e.filter((e=>e.dt>t))}function ue(n){const r=function(n){return e(1,arguments),t(1e3*a(n))}(n.dt),o=ne(n.temp);return{day:ee(new Date(r),"EEEE"),hour:ee(new Date(r),"h aaa"),currTemp:o?n.temp.day:n.temp,minTemp:o?n.temp.min:n.temp,maxTemp:o?n.temp.max:n.temp,precipProb:n.pop||0,humidity:n.humidity,windSpeed:n.wind_speed,visibility:n.visibility,weatherInfo:n.weather[0]}}const ce=function(){const e=document.getElementById("fahrenheit"),t=document.getElementById("celsius");function n(e){localStorage.getItem("unit")!==e&&(localStorage.setItem("unit",e),r(),async function(){const e=document.querySelector("#wind-speed .value");e.textContent=ae(e.textContent,"wind-speed");const t=document.querySelector("#curr-temp .temp");t.textContent=ae(t.textContent,"temperature");const n=document.querySelectorAll(".hour-temp"),r=document.querySelectorAll(".temp-low"),a=document.querySelectorAll(".temp-hi");var o;o=[n,r,a],Array.isArray(o)||(o=[o]),o.forEach((e=>{e.forEach((e=>{e.textContent=ae(e.textContent,"temperature")}))}))}())}function r(){const n=localStorage.getItem("unit");e.classList.remove("selected"),t.classList.remove("selected"),"F"===n?e.classList.add("selected"):t.classList.add("selected")}return e.addEventListener("click",(()=>{n("F")})),t.addEventListener("click",(()=>{n("C")})),{showSelectedUnit:r}}(),se=document.getElementById("curr-temp"),de=se.querySelector(".weather-img"),le=se.querySelector(".temp"),he=se.querySelector(".weather-description");function me(e){const t=ae(e.currTemp,"temperature"),n=re(e.weatherInfo.description);de.src=`images/${e.weatherInfo.icon}.png`,de.alt=`${n} weather image`,le.textContent=t,he.textContent=n}const fe=document.getElementById("location-info"),ge=fe.querySelector("#curr-location"),we=fe.querySelector("#chance-rain .value"),ye=fe.querySelector("#humidity .value"),pe=fe.querySelector("#wind-speed .value"),ve=fe.querySelector("#visibility .value");function be(e,t){const n=ae(t.windSpeed,"wind-speed"),r=ae(t.visibility,"visibility");ge.textContent=re(e),we.textContent=ae(t.precipProb,"precipitation"),ye.textContent=`${t.humidity}%`,pe.textContent=n,ve.textContent=r}const Ce=document.getElementById("hourly-weather"),Te=document.getElementById("daily-weather");function xe(e,t){return Array.isArray(t)||(t=[t]),t.map((t=>function(e,t){const n=document.createElement("div");n.classList="weather-card container-style";const r=document.createElement("p");r.classList="time",r.textContent="hour"===e?t.hour:"day"===e?t.day:"";const a=document.createElement("img"),o=re(t.weatherInfo.description);a.src=`images/${t.weatherInfo.icon}.png`,a.alt=`${o} weather image`,a.classList="weather-img";const i=document.createElement("p");i.className="hour-temp",i.textContent=ae(t.currTemp,"temperature");const u=document.createElement("p");u.classList="temp-hi",u.textContent=ae(t.maxTemp,"temperature");const c=document.createElement("p");c.classList="temp-low",c.textContent=ae(t.minTemp,"temperature");const s=document.createElement("p");return s.classList="precip",s.textContent=ae(t.precipProb,"precipitation"),n.appendChild(r),n.appendChild(a),"hour"===e?n.appendChild(i):"day"===e&&(n.appendChild(u),n.appendChild(c)),n.appendChild(s),n}(e,t)))}let Me,Se,Ee={count:0,interval:""};const De=function(){const n=document.getElementById("curr-time"),a=document.getElementById("hourly-weather");function o(){n.textContent=ee(new Date,"p")}function i(){if(console.log("Hourly Update From Cache"),Ee.count%3<2){const e=JSON.parse(sessionStorage.getItem("cachedInfo")),t=ue(e.hourlyWeather[0]);me(t),be(e.location,t),a.firstChild.remove(),Ee.count++,e.hourlyWeather.shift(),oe("cachedInfo",e)}else Ee.count=0}return{intialize:function(){clearInterval(Me),clearInterval(Se),clearInterval(Ee.interval),o(),function(){const n=1e3*(60-function(n){return e(1,arguments),t(n).getSeconds()}(new Date));setTimeout((()=>{o(),Me=setInterval(o,6e4)}),n)}(),function(){const n=1e3*(r(function(n){e(1,arguments);var r=t(n);return r.setMinutes(59,59,999),r}(new Date))-r(new Date));setTimeout((()=>{i(),Ee.interval=setInterval(i,36e5)}),n)}(),Se=setInterval((async()=>{console.log("Tri-Hourly Update From Servers");const e=localStorage.getItem("locationName");updatePageContents(e,{initialCall:!0}).then((e=>oe("cachedInfo",e)))}),108e5)}}}(),We=function(){const e=document.getElementById("toast");function t(e,n){clearTimeout(n),e.removeEventListener("click",t),e.remove()}return{displayToast:function(n,r){const a=document.createElement("div"),o=document.createElement("span"),i=document.createElement("span"),u=document.createElement("span");n.toLowerCase().includes("error")&&(n=n.split("Error: ")[1]),a.classList="toast "+("error"===r?"error":"success"===r?"success":""),o.classList="toast-type",i.classList="toast-msg",u.classList="remove-toast",o.textContent="error"===r?"Error:":"success"===r?"Success:":"",i.textContent=n,u.textContent="×",a.appendChild(o),a.appendChild(i),a.appendChild(u);const c=setTimeout((()=>{t(a)}),1e4);u.addEventListener("click",(()=>{t(a,c)})),e.insertBefore(a,e.firstChild)}}}(),Pe="9e75176ff9b6f3f3f59ff8c1ab98a18b";async function ke(e,t={initialCall:!1}){try{const n=await async function(e,t){let n;try{n=JSON.parse(sessionStorage.getItem("cachedInfo"))}catch(e){n=""}if(t.newLocation||!n||ne(n)&&0===Object.keys(n).length||!n.location||!n.currentWeather||!n.hourlyWeather||!n.dailyWeather||r(new Date)-n.currentWeather.dt>108e5){console.log("Fetching new data");const n=await async function(e,t){try{if(!/[a-z\-\s]/g.test(e))throw new Error("Invalid City");const r=await async function(e){try{const t=`https://api.openweathermap.org/data/2.5/weather?q=${e.replace(/\s/g,"%20")}&appid=${Pe}`,n=await fetch(t),r=await n.json();if("404"===r.cod)throw Error;return r}catch(e){throw"Invalid City"}}(e),{lon:a,lat:o}={lon:(n=r).coord.lon,lat:n.coord.lat},i=function(e){return e.name}(r);if(!t.initialCall&&i===localStorage.getItem("locationName"))throw"Searching Weather For The Same Location";const{current:u,hourly:c,daily:s}=await async function(e,t){try{const n=`https://api.openweathermap.org/data/2.5/onecall?lat=${t}&lon=${e}&exclude=minutely,alerts&units=imperial&appid=${Pe}`,r=await fetch(n),a=await r.json();if(a.cod)throw Error;return{current:a.current,hourly:a.hourly,daily:a.daily}}catch(e){throw"Failed To Fetch Weather Information"}}(a,o);return{location:i,currentWeather:u,hourlyWeather:c,dailyWeather:s}}catch(e){throw e}var n}(e,t),r=ie(n.hourlyWeather),a=ie(n.dailyWeather);return{location:n.location,currentWeather:n.currentWeather,filteredHourly:r,filteredDaily:a,formatedCurrent:ue(n.currentWeather),formatedHourly:r.map((e=>ue(e))),formatedDaily:a.map((e=>ue(e)))}}return console.log("Using Cached Data"),{location:n.location,currentWeather:n.currentWeather,filteredHourly:n.hourlyWeather,filteredDaily:n.dailyWeather,formatedCurrent:ue(n.currentWeather),formatedHourly:n.hourlyWeather.map((e=>ue(e))),formatedDaily:n.dailyWeather.map((e=>ue(e)))}}(e,t);if(!n)return;const{location:a,currentWeather:o,filteredHourly:i,filteredDaily:u,formatedCurrent:c,formatedHourly:s,formatedDaily:d}=n;if(me(c),be(a,c),function(e){const t=xe("hour",e.slice(23));Ce.textContent="",t.forEach((e=>Ce.appendChild(e)))}(s),function(e){const t=xe("day",e);Te.textContent="",t.forEach((e=>Te.appendChild(e)))}(d),localStorage.setItem("locationName",a),!t.initialCall){const e=`Now displaying weather information for ${a}.`;We.displayToast(e,"success")}return{location:a,currentWeather:o,hourlyWeather:i,dailyWeather:u}}catch(e){return console.log(e),void We.displayToast(e,"error")}}let Ue=localStorage.getItem("locationName")||"new york";!async function(){ce.showSelectedUnit(),De.intialize(),ke(Ue,{initialCall:!0}).then((e=>oe("cachedInfo",e)))}(),document.getElementById("search-bar").addEventListener("submit",(async e=>{e.preventDefault(),Ue=e.target["search-field"].value;const t=await ke(Ue,{newLocation:!0});e.target.reset(),t&&oe("cachedInfo",t)}))})();