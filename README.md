# Malta Business · site de portfólio

Site de **João Pedro (Malta)**: fotografia, sites e landing pages.
Estático (HTML/CSS/JS puro, sem dependências), pronto para a Vercel.

- Produção atual: https://maltabusiness.vercel.app/
- Branch deste trabalho: `site-portfolio` (a `main` continua com a LP antiga até você aprovar)

---

## Estrutura

```
/
├── index.html                    # Home: hero, serviços, destaques web e foto, processo, feedbacks, sobre, CTA
├── fotografia/index.html         # Projetos de foto (card com carrossel + texto)
├── sites-e-landing-pages/        # 14 projetos web com filtro: Sites · Landing Pages · Outros nichos
├── sobre/index.html
├── contato/index.html            # Formulário → WhatsApp
├── obrigado/index.html           # Pós-envio (noindex)
├── 404.html                      # Página de erro personalizada
├── robots.txt · sitemap.xml · site.webmanifest · vercel.json
├── assets/
│   ├── css/site.css              # Todo o visual (tokens de cor no :root)
│   ├── js/site.js                # Header, menu mobile, reveal, carrossel, filtros, formulário
│   └── img/
│       ├── brand/                # logo-malta.png, about.webp (foto do Sobre)
│       ├── icons/                # favicon, apple-touch-icon, ícones do manifest
│       ├── og/og-cover.jpg       # Imagem de compartilhamento (1200×630)
│       ├── projetos/             # Prints: <slug>.webp (desktop 1280×800) e <slug>_mob.webp (420×909)
│       └── fotos/<projeto>/      # 01.webp, 02.webp, ... uma pasta por ensaio
├── tools/build-pages.mjs         # Gerador das páginas (dados dos projetos + header/footer/SEO)
│
│   (legado, mantido sem alterações)
├── landing-page/                 # Página "Planos" antiga, usa css/ e js/ da raiz
├── playbook/ · Malta-Playbook.html · encrypt-playbook.py
└── css/ · js/ · assets/*.png     # Arquivos usados só pelas páginas legadas
```

### Como editar

As páginas são geradas por `tools/build-pages.mjs` (Node 18+, sem `npm install`).
Projetos, textos das fotos, menu, rodapé e SEO ficam nesse arquivo. Depois de editar:

```bash
node tools/build-pages.mjs
```

> Se preferir editar o HTML na mão, tudo bem, mas aí não rode o gerador de novo, porque ele sobrescreve as páginas.

**Adicionar fotos a um ensaio:** coloque `03.webp`, `04.webp`... em `assets/img/fotos/<projeto>/` e rode o gerador. O carrossel pega todas as imagens da pasta.
Use fotos em **retrato 4:5 ou 3:4**, com ~1200 px no lado maior e em WebP (as atuais têm 480×640 e vieram do Instagram, então troque por versões em alta).

**Novo ensaio:** crie a pasta em `assets/img/fotos/` e adicione um item em `SHOOTS` no gerador.

**Novo projeto web:** salve os prints em `assets/img/projetos/<slug>.webp` (1280×800) e `<slug>_mob.webp` (420×909) e adicione o projeto no grupo certo em `GROUPS`.

---

## Como publicar (Vercel)

1. Revise a branch `site-portfolio` no preview da Vercel (cada push gera uma URL de preview).
2. Aprovou? Faça o merge da `site-portfolio` na `main`. A Vercel publica sozinha.
3. Se mudar de domínio, troque `SITE` em `tools/build-pages.mjs`, rode o gerador e atualize `robots.txt`.

Rodar localmente:
```bash
python3 -m http.server 5544
```
e abra http://localhost:5544 (precisa ser via servidor, por causa dos caminhos absolutos `/assets/...`).

`vercel.json` já tem: `cleanUrls`, barra final, redirecionamentos (`/portfolio`, `/projetos`, `/fotos`), cabeçalhos de segurança (CSP, HSTS, X-Frame-Options...) e cache longo para imagens. `.vercelignore` tira `tools/`, `.py`, `.zip` e este README do deploy.

---

## Pendências (fazer antes de publicar na main)

- [ ] **Feedbacks:** os 3 cards na home são placeholders marcados com `<!-- EDITAR -->` e o selo "Espaço reservado". Troque por depoimentos reais (nome, empresa, texto e foto opcional em `assets/img/feedbacks/`) e remova a classe `quote--placeholder` e o `.ph-flag`. Se ainda não tiver depoimentos, apague a seção e o link "Feedbacks" do menu (`NAV` no gerador).
- [ ] **Fotografia:** os textos dos 5 ensaios (título, tipo, proposta, entrega) são **provisórios**, escritos a partir das fotos. Corrija com os dados reais (cliente, tipo de ensaio) em `SHOOTS`.
- [ ] **Fotos em alta:** as 10 fotos atuais vieram do Instagram em 480×640. Envie as originais (o acesso ao Instagram não foi feito nesta etapa; foram reaproveitadas as fotos que já estavam no repositório).
- [ ] **Foto do Sobre:** `assets/img/brand/about.webp` é a mesma da LP antiga; troque se tiver uma melhor.
- [ ] **Confirmar textos dos projetos web:** cada frase de objetivo foi escrita a partir do conteúdo público do site, sem números nem resultados. Revise se o nicho/cidade estão certos.
- [ ] **Autorização dos clientes:** confirme que pode exibir cada projeto (principalmente os feitos via agência).
- [ ] Depois do deploy: enviar `sitemap.xml` no Google Search Console e testar o link no [validador de rich results](https://search.google.com/test/rich-results).

---

## Checklist de SEO

| Item | Status |
|---|---|
| `<title>` e `meta description` únicos por página | ✔ |
| `canonical` absoluto em todas as páginas | ✔ |
| Open Graph (title, description, url, image 1200×630, locale) | ✔ |
| Twitter Card `summary_large_image` | ✔ |
| JSON-LD: `ProfessionalService`, `Person`, `WebSite`, `BreadcrumbList`, `CollectionPage`/`ItemList` de projetos, `AboutPage`, `ContactPage` | ✔ |
| `robots.txt` com sitemap; `/obrigado/` e `/playbook/` bloqueados | ✔ |
| `sitemap.xml` com as 5 páginas indexáveis | ✔ |
| `site.webmanifest` + ícones 192/512 + apple-touch-icon + favicon | ✔ |
| `width`/`height` em todas as imagens (sem CLS) | ✔ |
| `preload` da imagem do hero com `fetchpriority="high"` | ✔ |
| Imagens WebP com `loading="lazy"` abaixo da dobra | ✔ |
| Um único `<h1>` por página, hierarquia de títulos | ✔ |
| `alt` descritivo em todas as imagens | ✔ |
| `lang="pt-BR"`, `theme-color`, viewport sem bloquear zoom | ✔ |
| Páginas separadas por área (URLs indexáveis próprias) | ✔ |
| 404 personalizada e página de obrigado com `noindex` | ✔ |
| HTML validado (html-validate, 0 erros) | ✔ |

## Acessibilidade e comportamento

- Link "Pular para o conteúdo", foco visível, menu mobile com `aria-expanded`, `inert` quando fechado e fechamento com Esc.
- Carrossel: arrastar no celular (scroll-snap), arrastar com mouse no desktop, setas, bolinhas e teclado (← →).
- Filtro de projetos com `aria-pressed` e link direto por âncora (`/sites-e-landing-pages/#landing-pages`).
- Formulário: rótulos visíveis, máscara de telefone, erro abaixo do campo depois que você sai dele, botão desabilitado até os obrigatórios estarem válidos. O envio monta a mensagem, abre o WhatsApp em nova aba e leva para `/obrigado/`. Se o navegador bloquear a nova aba, abre o WhatsApp na mesma aba.
- `prefers-reduced-motion` desliga as animações.

## Contato configurado
WhatsApp +55 31 8763-7599 · joaopedrosegreto@gmail.com · @jp_fmalta · Behance/joaopedromalta · LinkedIn/joaopedromalta7 · CNPJ 63.593.320/0001-12
