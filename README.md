# Malta — Portfólio (João Pedro)

Site de portfólio pessoal com identidade **Malta Business** (monocromática, editorial) e
animações de scroll no estilo do site de referência — feito com **HTML/CSS/JS puro + GSAP,
ScrollTrigger e Lenis** (smooth scroll). Totalmente responsivo.

## Como rodar localmente
O site usa `fetch`/módulos de forma simples, mas o ideal é servir por HTTP (não abrir o
`index.html` direto pelo `file://`, para as fontes/assets carregarem certinho):

```bash
cd site
python3 -m http.server 5544
```

Depois abra: http://localhost:5544

> Alternativa: extensão "Live Server" do VS Code.

## Publicar (gratuito)
É um site estático — dá pra publicar em qualquer um destes, só arrastar a pasta `site/`:
- **Netlify** (netlify.com/drop) — arrasta a pasta e pronto
- **Vercel** — `vercel` na pasta
- **GitHub Pages** — commit + ativar Pages

## Estrutura
```
site/
├── index.html          # conteúdo + textos (edite aqui as LPs, projetos e a bio)
├── css/style.css       # visual (cores, tipografia, layout, responsivo)
├── js/main.js          # animações (GSAP + ScrollTrigger + Lenis)
├── js/vendor/          # GSAP, ScrollTrigger e Lenis (locais, sem CDN)
└── assets/
    ├── logo-malta.png      # seu logo (extraído do PDF)
    ├── about.webp          # foto "Sobre" (retrato)
    ├── favicon.png
    ├── lp/*.webp           # screenshots das 10 landing pages (seção primária)
    └── portfolio/01..10.webp # 10 fotos do Instagram (@jp_fmalta), "Outros trabalhos"
```

## Performance
Otimizado para pontuar alto no PageSpeed/Lighthouse: imagens em **WebP** + `lazy-load` +
`width/height` (sem layout shift), **GSAP/Lenis locais com `defer`** (sem CDN de terceiros),
fontes enxutas e carregadas de forma **não-bloqueante**. Ao publicar em Netlify/Vercel você
ainda ganha **gzip/brotli, CDN e cache** automáticos, o que melhora ainda mais as notas.

## Seções
1. **Landing Pages** (primária) — mockups de navegador com screenshot de cada página + link ao vivo
2. **Outros trabalhos** — grid de foto/vídeo (Malta Business)
3. **Serviços** — processo (horizontal no desktop, stack vertical no mobile) + lista
4. **Sobre** e **Footer/Contato**

## Atualizar o screenshot de uma landing page
As imagens em `assets/lp/` são prints das páginas. Para atualizar uma, gere um novo print
(1440×900) e substitua o arquivo com o mesmo nome. Ex. via Chrome headless:
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
  --hide-scrollbars --window-size=1440,900 --virtual-time-budget=9000 \
  --screenshot=assets/lp/marmorariabr.jpg "https://www.marmorariabr.com.br/"
```

## O que você pode ajustar rápido
- **Nomes/tipos dos projetos:** em `index.html`, blocos `<article class="card">`
  (troque `<h3>`, `.card__type` e `data-cat`). Os nomes atuais são sugestões.
- **Foto do "Sobre":** substitua `assets/about.jpg` por uma foto sua em alta resolução
  (proporção ~4/5). A atual veio do avatar do Instagram (baixa resolução).
- **Headline do hero / bio:** em `index.html`, seções `.hero` e `.about`.
- **Cores:** em `css/style.css`, bloco `:root` (tudo em tons de preto/branco/cinza).

## Segurança
**Importante:** o HTML/CSS/JS de qualquer site público é sempre baixado pelo navegador de
quem acessa — não existe forma de impedir 100% que alguém veja o código. O que dá pra fazer
(e está feito) são duas camadas:

**1. Segurança real (cabeçalhos + CSP)** — arquivos já incluídos, aplicam no deploy:
- `_headers` → Netlify · `vercel.json` → Vercel · `.htaccess` → Apache/cPanel
- **Content-Security-Policy**: só carrega recursos do próprio site (bloqueia injeção de scripts/XSS e exfiltração de dados para fora).
- **X-Frame-Options / frame-ancestors: DENY**: ninguém consegue embutir seu site num iframe (anti-clickjacking / roubo por enquadramento).
- **HSTS**: força HTTPS. **nosniff**, **Referrer-Policy**, **Permissions-Policy** (desliga câmera/mic/localização), **COOP/CORP**.
- `.htaccess` ainda bloqueia listagem de diretório e acesso a arquivos internos.

**2. Dissuasores de cópia (em `js/main.js`, função `protect()`):** desabilita botão direito,
arrastar/salvar imagem e atalhos de salvar página / ver código fonte. Trava o usuário casual —
**não é proteção absoluta** (quem entende contorna). Para desligar, remova a chamada `protect()`.

> Não há coleta de dados no site (sem formulários/login) — os contatos são links diretos de
> WhatsApp/e-mail, então não há dados de usuário para vazar. A proteção real do seu trabalho é
> jurídica (direito autoral, automático no Brasil), não técnica.

## Contato configurado
WhatsApp 31 8763-7599 · joaopedrosegreto@gmail.com · @jp_fmalta ·
Behance/joaopedromalta · LinkedIn/joaopedromalta7 · CNPJ 63.593.320/0001-12
