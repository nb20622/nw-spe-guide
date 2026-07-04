/* ネスペ2026 合格教材 — 共通ナビゲーション・進捗管理 */
(function(){
"use strict";

var NAV=[
  {g:"学習ガイド",items:[
    ["index.html","ホーム・学習マップ","HOME"],
    ["exam.html","試験制度を知る","§1"],
    ["strategy.html","合格戦略と16週プラン","§2"]
  ]},
  {g:"基礎講座 I — ネットワークの土台",items:[
    ["ch01.html","ネットワークの全体像とレイヤモデル","第1章"],
    ["ch02.html","イーサネットとL2スイッチング","第2章"],
    ["ch03.html","IPアドレッシングとサブネット設計","第3章"],
    ["ch04.html","ルーティング — OSPF・BGP・経路制御","第4章"],
    ["ch05.html","TCPとUDP — トランスポート層","第5章"]
  ]},
  {g:"基礎講座 II — サービスとセキュリティ",items:[
    ["ch06.html","DNS — 名前解決の設計と運用","第6章"],
    ["ch07.html","Web・プロキシ・メール","第7章"],
    ["ch08.html","ネットワークセキュリティ","第8章"]
  ]},
  {g:"基礎講座 III — 設計と最新技術",items:[
    ["ch09.html","冗長化・負荷分散・運用管理","第9章"],
    ["ch10.html","無線LAN","第10章"],
    ["ch11.html","IPv6","第11章"],
    ["ch12.html","クラウド・データセンター・仮想化","第12章"]
  ]},
  {g:"試験対策",items:[
    ["pm-guide.html","午後試験 読解メソッド","対策"],
    ["pm-practice.html","午後演習 — オリジナル事例問題","演習"],
    ["am2-drill.html","午前II 模擬演習 50問","演習"],
    ["glossary.html","用語集","辞書"],
    ["resources.html","教材・リンク集・出典","資料"]
  ]}
];
window.NW_NAV=NAV;

var FLAT=[];
NAV.forEach(function(gr){gr.items.forEach(function(it){FLAT.push(it);});});

var here=location.pathname.split("/").pop()||"index.html";

function getDone(){
  try{return JSON.parse(localStorage.getItem("nw-done")||"[]");}catch(e){return [];}
}
function setDone(arr){localStorage.setItem("nw-done",JSON.stringify(arr));}
window.NW_getDone=getDone;

/* ---- header ---- */
var head=document.getElementById("site-header");
if(head){
  var h='<div class="topbar">'
    +'<a class="brand" href="index.html">ネスペ<span class="yr">2026</span> 合格教材</a>'
    +'<button class="iconbtn" id="themeBtn" aria-label="テーマ切替">☀/☾</button>'
    +'<button class="iconbtn" id="menuBtn" aria-expanded="false" aria-controls="toc">目次</button>'
    +'</div><div id="scrim"></div><nav id="toc" aria-label="サイト目次">';
  var done=getDone();
  NAV.forEach(function(gr){
    h+='<div class="toc-group">'+gr.g+'</div>';
    gr.items.forEach(function(it){
      var cur=(it[0]===here)?' class="cur"':'';
      var dn=(done.indexOf(it[0])>=0)?'<span class="dn">✓</span>':'';
      h+='<a href="'+it[0]+'"'+cur+'><span class="no">'+it[2]+'</span>'+it[1]+dn+'</a>';
    });
  });
  h+='</nav>';
  head.innerHTML=h;

  var root=document.documentElement;
  var saved=localStorage.getItem("nw-theme");
  if(saved){root.setAttribute("data-theme",saved);}
  document.getElementById("themeBtn").addEventListener("click",function(){
    var cur=root.getAttribute("data-theme");
    if(!cur){cur=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}
    var next=cur==="dark"?"light":"dark";
    root.setAttribute("data-theme",next);
    localStorage.setItem("nw-theme",next);
  });
  var toc=document.getElementById("toc"),scrim=document.getElementById("scrim"),btn=document.getElementById("menuBtn");
  function close(){toc.classList.remove("open");scrim.classList.remove("show");btn.setAttribute("aria-expanded","false");}
  btn.addEventListener("click",function(){
    var open=toc.classList.toggle("open");
    scrim.classList.toggle("show",open);
    btn.setAttribute("aria-expanded",open?"true":"false");
  });
  scrim.addEventListener("click",close);
}

/* ---- footer: 学習済みボタン + 前後ナビ ---- */
var foot=document.getElementById("site-footer");
if(foot){
  var idx=-1;
  FLAT.forEach(function(it,i){if(it[0]===here)idx=i;});
  var f="";
  if(here!=="index.html"&&idx>=0){
    var isDone=getDone().indexOf(here)>=0;
    f+='<div class="donewrap"><button class="donebtn'+(isDone?" on":"")+'" id="doneBtn">'
      +(isDone?"✓ 学習済み(タップで解除)":"このページを学習済みにする")+'</button></div>';
  }
  if(idx>=0){
    f+='<div class="pnav">';
    if(idx>0){var p=FLAT[idx-1]; f+='<a href="'+p[0]+'"><small>← 前</small>'+p[2]+' '+p[1]+'</a>';}
    if(idx<FLAT.length-1){var n=FLAT[idx+1]; f+='<a class="next" href="'+n[0]+'"><small>次 →</small>'+n[2]+' '+n[1]+'</a>';}
    f+='</div>';
  }
  f+='<footer class="sitefoot">ネスペ2026 合格教材 — 調査: Codex(Web検索)/戦略・執筆: Claude/2026年7月版<br>'
    +'試験制度は変更されうる。受験前に必ず <a href="https://www.ipa.go.jp/shiken/kubun/nw.html">IPA公式</a> を確認すること。</footer>';
  foot.innerHTML=f;
  var db=document.getElementById("doneBtn");
  if(db){
    db.addEventListener("click",function(){
      var arr=getDone(); var i=arr.indexOf(here);
      if(i>=0){arr.splice(i,1);}else{arr.push(here);}
      setDone(arr);
      var on=arr.indexOf(here)>=0;
      db.classList.toggle("on",on);
      db.textContent=on?"✓ 学習済み(タップで解除)":"このページを学習済みにする";
    });
  }
}
})();
