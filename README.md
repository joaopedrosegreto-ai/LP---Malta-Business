# Malta — Portfólio (João Pedro)

> **Atualização (branch `site-portfolio-v2`):** mesmo site, mesmo layout e animações. Foram trocadas as
> informações (posicionamento: fotografia + sites + landing pages) e adicionadas as partes novas:
> filtro Sites / Landing Pages / Outros nichos com 14 projetos, Fotografia com carrossel por ensaio,
> Feedbacks (placeholders), formulário de contato → WhatsApp, WhatsApp flutuante, SEO completo,
> página de obrigado e 404. Veja **Pendências** e **Checklist de SEO** no fim deste arquivo.

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
    ├── lp/<slug>.webp      # print desktop (1280×800) de cada projeto · <slug>_mob.webp = print mobile (420×909)
    ├── img/fotos/<ensaio>/ # 01.webp, 02.webp... uma pasta por ensaio (carrossel)
    ├── og/og-cover.jpg     # imagem de compartilhamento 1200×630
    └── icon-192.png / icon-512.png  # ícones do site.webmanifest
```

## Performance
Otimizado para pontuar alto no PageSpeed/Lighthouse: imagens em **WebP** + `lazy-load` +
`width/height` (sem layout shift), **GSAP/Lenis locais com `defer`** (sem CDN de terceiros),
fontes enxutas e carregadas de forma **não-bloqueante**. Ao publicar em Netlify/Vercel você
ainda ganha **gzip/brotli, CDN e cache** automáticos, o que melhora ainda mais as notas.

## Seções
1. **Sites & Landing Pages** (`#lps`) — mockups com print de cada projeto, filtro por categoria, objetivo e botão "Ver projeto"
2. **Fotografia** (`#fotografia`) — um card por ensaio, com carrossel (swipe, setas, arrastar, teclado) e texto curto
3. **Serviços** (`#servicos`) — processo (horizontal no desktop, stack vertical no mobile) + lista
4. **Feedbacks** (`#feedbacks`) — placeholders para depoimentos reais
5. **Sobre** (`#sobre`) e **Footer/Contato** (`#contato`) com formulário → WhatsApp
6. Páginas extras: `obrigado/` (pós-envio, noindex), `404.html`, `landing-page/` (planos, sem alteração de layout)

## Atualizar o screenshot de uma landing page
As imagens em `assets/lp/` são prints das páginas. Para atualizar uma, gere um novo print
(1440×900) e substitua o arquivo com o mesmo nome. Ex. via Chrome headless:
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
  --hide-scrollbars --window-size=1440,900 --virtual-time-budget=9000 \
  --screenshot=assets/lp/marmorariabr.jpg "https://www.marmorariabr.com.br/"
```

## O que você pode ajustar rápido
- **Projetos web:** em `index.html`, blocos `<article class="lp" data-cat="...">`. `data-cat` define a aba:
  `sites`, `lps` ou `outros`. Troque `<h3>`, `.lp__type`, `.lp__desc` e os dois links. Se mudar a quantidade,
  atualize o número em `<sup>` da aba correspondente.
- **Ensaios de fotografia:** blocos `<article class="shoot">`. Para adicionar foto, coloque o arquivo em
  `assets/img/fotos/<ensaio>/` e duplique uma linha `<figure class="shoot__slide">` (o contador se ajusta sozinho).
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

> O formulário de contato não envia dados a nenhum servidor: ele só monta o texto e abre o WhatsApp
> no aparelho de quem preencheu. A proteção real do seu trabalho é
> jurídica (direito autoral, automático no Brasil), não técnica.

## Contato configurado
WhatsApp 31 8763-7599 · joaopedrosegreto@gmail.com · @jp_fmalta ·
Behance/joaopedromalta · LinkedIn/joaopedromalta7 · CNPJ 63.593.320/0001-12

## Formulário de contato
Fica no rodapé (`#contato`). O botão "Enviar pelo WhatsApp" só libera quando nome, WhatsApp (com DDD),
serviço e mensagem estão válidos; e-mail é opcional mas validado se preenchido. O envio monta a mensagem,
abre o WhatsApp em nova aba e leva para `obrigado/`. Se o navegador bloquear a nova aba, abre na mesma.
Código em `js/main.js`, função `contactForm()`.

## Como publicar
A Vercel publica a branch `main`. Esta versão está na branch **`site-portfolio-v2`**: confira o preview
que a Vercel gera para a branch e, se aprovar, faça o merge na `main`.

## Pendências
- [ ] **Feedbacks:** os 3 cards são placeholders (marcados com `<!-- EDITAR -->` e o selo "Espaço reservado").
  Troque por depoimentos reais (nome, empresa, texto, foto opcional em `assets/img/feedbacks/`) e remova
  a classe `fb--placeholder` e o `<span class="fb__flag">`.
- [ ] **Fotografia:** os textos dos 5 ensaios são provisórios (escritos a partir das fotos). Corrija cliente,
  tipo de ensaio e o que foi entregue.
- [ ] **Fotos em alta:** as 10 fotos atuais são as que já estavam no site (480×640, do Instagram). Envie as
  originais; o Instagram não foi acessado.
- [ ] **Projetos web:** as frases de objetivo foram escritas a partir do conteúdo público de cada site,
  sem números nem resultados. Revise nicho e texto.
- [ ] Depois do deploy: enviar `sitemap.xml` no Google Search Console.

## Checklist de SEO
| Item | Status |
|---|---|
| `title` e `meta description` | ✔ |
| `canonical` | ✔ |
| Open Graph completo + imagem 1200×630 (`assets/og/og-cover.jpg`) | ✔ |
| Twitter Card `summary_large_image` | ✔ |
| JSON-LD: `ProfessionalService`, `Person`, `WebSite` | ✔ |
| `robots.txt` (bloqueia `/obrigado/` e `/playbook/`) | ✔ |
| `sitemap.xml` | ✔ |
| `site.webmanifest` + ícones 192/512 | ✔ |
| `width`/`height` em todas as imagens | ✔ |
| `preload` do logo (primeira imagem visível, no loader/hero) | ✔ |
| Imagens WebP com `loading="lazy"` | ✔ |
| `obrigado/` e `404.html` com `noindex` | ✔ |
| HTML validado (html-validate, 0 erros) | ✔ |
