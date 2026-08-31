(function(){
  var $=function(id){return document.getElementById(id);};
  function b64(s){return Uint8Array.from(atob(s),function(c){return c.charCodeAt(0);});}
  async function decrypt(pw){
    var d=JSON.parse($('cipher').textContent);
    var enc=new TextEncoder();
    var km=await crypto.subtle.importKey('raw',enc.encode(pw),{name:'PBKDF2'},false,['deriveKey']);
    var key=await crypto.subtle.deriveKey(
      {name:'PBKDF2',salt:b64(d.salt),iterations:d.iter,hash:'SHA-256'},
      km,{name:'AES-GCM',length:256},false,['decrypt']);
    var pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:b64(d.iv)},key,b64(d.ct));
    return new TextDecoder().decode(pt);
  }
  function reveal(html){
    $('content').innerHTML=html;
    var g=$('gate'); if(g){g.remove();}
  }
  window.addEventListener('DOMContentLoaded',function(){
    var f=$('gateForm');
    f.addEventListener('submit',async function(e){
      e.preventDefault(); $('err').textContent='';
      var btn=$('go'); btn.disabled=true; btn.textContent='Abrindo...';
      try{
        var html=await decrypt($('pw').value);
        try{sessionStorage.setItem('mpb',$('pw').value);}catch(_){}
        reveal(html);
      }catch(_){
        $('err').textContent='Senha incorreta. Tenta de novo.';
        btn.disabled=false; btn.textContent='Entrar'; $('pw').select();
      }
    });
    (async function(){try{var s=sessionStorage.getItem('mpb'); if(s){reveal(await decrypt(s));}}catch(_){}})();
  });
})();
