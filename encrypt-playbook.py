#!/usr/bin/env python3
"""
Criptografa o playbook e gera site/playbook/index.html (portão com senha).
O conteúdo fica CIFRADO (AES-256-GCM); só abre no navegador com a senha certa.
Nada de senha fica salvo no código — só o texto embaralhado.

Uso:
    python3 encrypt-playbook.py "SUA_SENHA_AQUI"

Fonte do conteúdo: Malta-Playbook.html (mantido fora da pasta publicada 'site/').
Depois de rodar, faça deploy da pasta site/ normalmente.
"""
import sys, os, json, base64, hashlib, secrets
from Crypto.Cipher import AES

if len(sys.argv) < 2 or not sys.argv[1].strip():
    print("Uso: python3 encrypt-playbook.py \"SUA_SENHA\"")
    sys.exit(1)

password = sys.argv[1].encode("utf-8")
BASE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(BASE, "Malta-Playbook.html")
OUT_DIR = os.path.join(BASE, "site", "playbook")
os.makedirs(OUT_DIR, exist_ok=True)

full = open(SRC, encoding="utf-8").read()
# extrai só a parte visual (<style> + <div class="wrap">...</div>)
inner = full[full.index("<style>"): full.rindex("</div>") + 6]

ITER = 200000
salt = secrets.token_bytes(16)
iv = secrets.token_bytes(12)
key = hashlib.pbkdf2_hmac("sha256", password, salt, ITER, dklen=32)
ct, tag = AES.new(key, AES.MODE_GCM, nonce=iv).encrypt_and_digest(inner.encode("utf-8"))

payload = json.dumps({
    "salt": base64.b64encode(salt).decode(),
    "iv":   base64.b64encode(iv).decode(),
    "ct":   base64.b64encode(ct + tag).decode(),
    "iter": ITER,
}, separators=(",", ":"))

CSP = ("default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' "
       "https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; "
       "img-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'; "
       "object-src 'none'; frame-src 'none'; upgrade-insecure-requests")

GATE = """<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="__CSP__">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="robots" content="noindex, nofollow">
<title>Playbook Malta Business</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#0a0a0a;color:#f3f2ef;font-family:'Archivo',system-ui,sans-serif;min-height:100vh}
  #gate{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
  .box{width:100%;max-width:380px;text-align:center}
  .box img{width:120px;margin:0 auto 34px;display:block}
  .box .lbl{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.22em;
    text-transform:uppercase;color:#8d8d8a;margin-bottom:14px}
  .box h1{font-weight:800;font-size:1.5rem;letter-spacing:-.02em;margin-bottom:8px}
  .box p{color:#8d8d8a;font-size:.92rem;margin-bottom:26px;line-height:1.5}
  form{display:flex;flex-direction:column;gap:12px}
  input{background:#141312;border:1px solid rgba(243,242,239,.22);color:#f3f2ef;
    padding:15px 18px;border-radius:100px;font:inherit;font-size:15px;text-align:center;outline:none;
    transition:border-color .3s}
  input:focus{border-color:#f3f2ef}
  button{background:#f3f2ef;color:#0a0a0a;border:none;padding:15px 18px;border-radius:100px;
    font:inherit;font-weight:600;font-size:15px;cursor:pointer;transition:opacity .3s}
  button:disabled{opacity:.5;cursor:default}
  .err{color:#c98b7a;font-size:.85rem;min-height:1.2em;font-family:'JetBrains Mono',monospace;letter-spacing:.02em}
  #content{opacity:0;animation:fade .6s ease forwards}
  @keyframes fade{to{opacity:1}}
  @media (prefers-reduced-motion:reduce){#content{animation:none;opacity:1}}
</style>
</head>
<body>
  <div id="gate">
    <div class="box">
      <img src="../assets/logo-malta.png" alt="Malta Business">
      <div class="lbl">✱ Acesso restrito</div>
      <h1>Playbook da marca</h1>
      <p>Este documento é privado. Digite a senha para acessar.</p>
      <form id="gateForm" autocomplete="off">
        <input id="pw" type="password" placeholder="Senha" aria-label="Senha" autofocus>
        <button id="go" type="submit">Entrar</button>
        <div class="err" id="err"></div>
      </form>
    </div>
  </div>
  <div id="content"></div>
  <script type="application/json" id="cipher">__PAYLOAD__</script>
  <script src="gate.js" defer></script>
</body>
</html>
"""

GATE = GATE.replace("__CSP__", CSP).replace("__PAYLOAD__", payload)
open(os.path.join(OUT_DIR, "index.html"), "w", encoding="utf-8").write(GATE)

GATE_JS = r"""(function(){
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
"""
open(os.path.join(OUT_DIR, "gate.js"), "w", encoding="utf-8").write(GATE_JS)

print("OK: /playbook criptografado com sucesso.")
print("Conteudo cifrado em site/playbook/index.html (nao legivel sem a senha).")
