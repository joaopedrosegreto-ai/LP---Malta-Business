// Gera as páginas do site a partir dos dados abaixo. Uso: node tools/build-pages.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.argv[2] || path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SITE = 'https://maltabusiness.vercel.app';
const WA = '553187637599';
const WA_TXT = encodeURIComponent('Olá, Malta! Vi seu portfólio no site e quero conversar sobre um projeto.');
const WA_LINK = `https://wa.me/${WA}?text=${WA_TXT}`;
const OG = `${SITE}/assets/img/og/og-cover.jpg`;
const V = '2'; // cache-bust de css/js

/* ---------------- ícones (SVG, traço 1.6) ---------------- */
const I = {
  out: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".9" fill="currentColor" stroke="none"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6 8.5-6"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
};

/* ---------------- dados: projetos web ---------------- */
const host = u => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
const P = (slug, name, niche, url, goal) => ({ slug, name, niche, url, goal, domain: host(url) });
const GROUPS = [
  {
    key: 'sites', title: 'Sites', lead: 'Sites completos, com várias páginas, catálogo e conteúdo pensado para aparecer no Google e apresentar a empresa inteira.',
    layout: ['wide', 'wide flip'],
    items: [
      P('marmorariapaulista', 'Marmoraria Paulista', 'Marmoraria · Juiz de Fora/MG', 'https://marmorariapaulistajf.com.br/',
        'Site institucional com as coleções de mármores, granitos, quartzitos e travertinos organizadas para o cliente conhecer o material antes de falar com a loja.'),
      P('gvimarmore', 'GVI Mármores e Granitos', 'Marmoraria · Osasco/SP', 'https://gvimarmore.com/',
        'Site com serviços, materiais, regiões atendidas e projetos entregues, estruturado para quem procura marmoraria em Osasco encontrar a GVI.'),
    ],
  },
  {
    key: 'landing-pages', title: 'Landing Pages', lead: 'Páginas de uma rolagem só, com um objetivo claro: levar o visitante até o orçamento, o cadastro ou a compra.',
    layout: ['wide', '', 'offset', 'wide flip', '', 'offset', 'wide'],
    items: [
      P('marmoprice', 'Marmoprice', 'Software para marmorarias', 'https://www.marmopricesistema.com.br/',
        'Apresentar um sistema de precificação e gestão, mostrando ao dono da marmoraria quanto sobra de cada projeto antes de fechar o orçamento.'),
      P('montepedra', 'Montepedra', 'Marmoraria de alto padrão · Brasília/DF', 'https://montepedra.com/',
        'Posicionar a marmoraria para arquitetos e projetos de alto padrão, com as linhas de rochas, o showroom e o beneficiamento próprio.'),
      P('marmomonte', 'MarmoMonte', 'Marmoraria · Litoral Norte/RS', 'https://www.marmomonte.com.br/',
        'Mostrar que quem orça é quem executa: atendimento direto com o marmorista, etapas claras e obras entregues no litoral gaúcho.'),
      P('marmorariabr', 'Marmoraria BR · Revestimentos', 'Revestimentos em pedra · Sidrolândia/MS', 'https://www.marmorariabr.com.br/revestimentos',
        'Página focada em revestimentos de pedra natural, como rockface, moledo e travertino, levando o visitante direto ao orçamento pelo WhatsApp.'),
      P('rpgranitos', 'RP Granitos', 'Distribuidora de chapas · Minas Gerais', 'https://www.rpgranitos.com/',
        'Falar com arquitetos e construtores: chapas organizadas por material e atendimento consultivo para especificar a pedra certa.'),
      P('sulstones', 'Sul Stones', 'Distribuidora de chapas · Cachoeirinha/RS', 'https://www.sulstones.com.br/',
        'Página para marmoristas de Porto Alegre e região conhecerem as linhas de rocha e consultarem o estoque de chapas.'),
      P('wilsonmarmores', 'Wilson Mármores', 'Marmoraria · Natal/RN', 'https://www.wilsonmarmores.com.br/',
        'Gerar pedidos de orçamento de bancadas e peças sob medida pelo WhatsApp, ajudando o cliente a escolher entre mármore, granito e quartzo.'),
    ],
  },
  {
    key: 'outros-nichos', title: 'Outros nichos', lead: 'O mesmo cuidado com estratégia e design aplicado a imobiliário, engenharia, eventos, arte e casamentos.',
    layout: ['wide', '', 'offset', '', 'offset'],
    items: [
      P('greenpark', 'Green Park Resort', 'Imobiliário · Sorocaba/SP', 'https://www.greenparkresort.com.br/',
        'Lançamento de um condomínio-resort com plantas, implantação e tour, e um formulário de simulação para captar interessados.'),
      P('condicionarfuturo', 'Condicionar Futuro', 'Climatização · Belo Horizonte/MG', 'https://www.condicionarfuturo.com.br/',
        'Apresentar projetos de climatização assinados por engenheiro, como VRF, chillers e PMOC, e gerar pedidos de diagnóstico técnico.'),
      P('marmorizou', 'Imersão Marmorizou Camp', 'Evento · educação', 'https://imersao.marmorizou.com/',
        'Página de vendas de uma imersão presencial de quatro dias para donos de marmoraria, com programação, lotes e contagem regressiva.'),
      P('mamelart', 'Mamel Art Stone', 'Ateliê de escultura em pedra', 'https://mamelartstones.com.br/en/',
        'Site multilíngue para um ateliê que esculpe peças únicas em blocos de pedra natural, com linguagem de galeria de arte.'),
      P('candelle', 'Candelle Assessoria', 'Assessoria e cerimonial de casamentos', 'https://candelleassessoria.com.br/',
        'Apresentar a assessoria e o cerimonial de casamentos através das histórias de casais atendidos e facilitar o primeiro contato.'),
    ],
  },
];
const ALL = GROUPS.flatMap(g => g.items.map(i => ({ ...i, group: g.key })));
const byslug = s => ALL.find(p => p.slug === s);

/* ---------------- dados: fotografia ---------------- */
// EDITAR: textos provisórios. Troque título, tipo, proposta e entrega pelos dados reais de cada ensaio.
const SHOOTS = [
  { slug: 'futebol-noturno', title: 'Futebol sob refletores', type: 'Fotografia esportiva',
    proposta: 'Registrar a partida noturna em preto e branco, deixando a luz dos refletores desenhar cada jogador.',
    entrega: 'Seleção de fotos tratadas em P&amp;B, prontas para as redes sociais.',
    alts: ['Jogador de costas com a camisa 10 em campo iluminado à noite', 'Jogador em movimento durante partida noturna'] },
  { slug: 'treino', title: 'Treino ao ar livre', type: 'Esporte · fitness',
    proposta: 'Acompanhar o treino de perto e capturar esforço e movimento reais, sem pose.',
    entrega: 'Fotos em P&amp;B e cor para divulgação do treino.',
    alts: ['Atleta carregando saco de areia nos ombros durante treino funcional', 'Atleta correndo em pista ao ar livre'] },
  { slug: 'bastidores', title: 'Bastidores e cobertura', type: 'Cobertura de evento · making of',
    proposta: 'Mostrar o outro lado da produção: o equipamento, a credencial e o dia de trabalho por trás das imagens.',
    entrega: 'Registros de bastidores para conteúdo de making of.',
    alts: ['Câmera de cinema montada em estabilizador', 'Credencial de mídia ao lado de câmeras fotográficas'] },
  { slug: 'musica-retrato', title: 'Ao vivo e retrato', type: 'Música · retrato',
    proposta: 'Detalhes de quem toca e retratos com luz natural e contraste forte.',
    entrega: 'Série de fotos em P&amp;B para perfil e divulgação.',
    alts: ['Mãos tocando contrabaixo elétrico', 'Retrato de perfil em preto e branco'] },
  { slug: 'editorial', title: 'Editorial e direção de arte', type: 'Lifestyle · moda',
    proposta: 'Cor, textura e tipografia como parte da imagem, para marcas com linguagem própria.',
    entrega: 'Fotos editoriais para campanha e redes sociais.',
    alts: ['Coqueiro contra o céu azul com nuvens', 'Camiseta com a frase Do it again for a new gen'] },
];
const shootImgs = s => fs.readdirSync(path.join(ROOT, 'assets/img/fotos', s.slug)).filter(f => /\.(webp|jpe?g|png|avif)$/i.test(f)).sort();

/* ---------------- partes compartilhadas ---------------- */
const NAV = [
  ['/', 'Início', 'home'],
  ['/fotografia/', 'Fotografia', 'fotografia'],
  ['/sites-e-landing-pages/', 'Sites &amp; LPs', 'web'],
  ['/#feedbacks', 'Feedbacks', 'feedbacks'],
  ['/sobre/', 'Sobre', 'sobre'],
  ['/contato/', 'Contato', 'contato'],
];

function head({ title, desc, pathname, robots = 'index, follow', jsonld = [], preload = '' }) {
  const url = SITE + pathname;
  const ld = jsonld.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  const fonts = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Archivo+Expanded:wght@800&family=JetBrains+Mono:wght@400;500&display=swap';
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${url}">
<meta name="author" content="João Pedro Malta">
<meta name="theme-color" content="#17181a">
<meta name="color-scheme" content="dark">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Malta Business">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${OG}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Malta Business: fotografia, sites e landing pages">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${OG}">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/img/icons/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/img/icons/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${preload}<link rel="preload" as="style" href="${fonts}">
<link rel="stylesheet" href="${fonts}" media="print" data-fontswap>
<noscript><link rel="stylesheet" href="${fonts}"></noscript>
<link rel="stylesheet" href="/assets/css/site.css?v=${V}">
${ld}
</head>
<body>
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
`;
}

function header(active) {
  const links = NAV.map(([href, label, key]) => `<a href="${href}"${key === active ? ' aria-current="page"' : ''}>${label}</a>`).join('\n      ');
  const mlinks = NAV.map(([href, label, key], i) => `<a href="${href}"${key === active ? ' aria-current="page"' : ''}>${label}<em>0${i + 1}</em></a>`).join('\n    ');
  return `
<header class="header">
  <div class="wrap header__in">
    <a class="header__logo" href="/" aria-label="Malta Business, página inicial"><img src="/assets/img/brand/logo-malta.png" alt="Malta Business" width="606" height="265"></a>
    <nav class="nav" aria-label="Principal">
      ${links}
    </nav>
    <a class="btn btn--solid btn--sm header__cta" href="/contato/"><span>Pedir orçamento</span>${I.right}</a>
    <button class="burger" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu"><span></span><span></span></button>
  </div>
</header>

<div class="menu" id="menu" inert>
  <button class="burger menu__close" type="button" aria-label="Fechar menu" aria-expanded="true"><span></span><span></span></button>
  <nav aria-label="Menu mobile">
    ${mlinks}
  </nav>
  <div class="menu__foot">
    <a class="btn btn--solid" href="${WA_LINK}" target="_blank" rel="noopener"><span>Chamar no WhatsApp</span>${I.wa}</a>
    <span class="mono">Belo Horizonte · atendo todo o Brasil</span>
  </div>
</div>
`;
}

const waFloat = `
<a class="wa-float" href="${WA_LINK}" target="_blank" rel="noopener" aria-label="Conversar no WhatsApp">${I.wa}<span class="wa-float__tip">Fale comigo no WhatsApp</span></a>`;

const footer = `
<footer class="footer">
  <div class="wrap">
    <div class="footer__grid">
      <div class="footer__brand">
        <img src="/assets/img/brand/logo-malta.png" alt="Malta Business" width="606" height="265" loading="lazy" decoding="async">
        <p>Fotografia, sites e landing pages por João Pedro, o Malta. Belo Horizonte, atendendo todo o Brasil.</p>
      </div>
      <div class="fcol">
        <h2>Navegação</h2>
        <a href="/">Início</a>
        <a href="/fotografia/">Fotografia</a>
        <a href="/sites-e-landing-pages/">Sites e landing pages</a>
        <a href="/sobre/">Sobre</a>
        <a href="/contato/">Contato</a>
      </div>
      <div class="fcol">
        <h2>Serviços</h2>
        <a href="/sites-e-landing-pages/#sites">Criação de sites</a>
        <a href="/sites-e-landing-pages/#landing-pages">Landing pages</a>
        <a href="/fotografia/">Fotografia</a>
        <a href="/contato/?servico=outro">Outros projetos</a>
      </div>
      <div class="fcol">
        <h2>Contato</h2>
        <a href="${WA_LINK}" target="_blank" rel="noopener">WhatsApp (31) 8763-7599</a>
        <a href="mailto:joaopedrosegreto@gmail.com">joaopedrosegreto@gmail.com</a>
        <a href="https://www.instagram.com/jp_fmalta/" target="_blank" rel="noopener">Instagram @jp_fmalta</a>
        <a href="https://www.behance.net/joaopedromalta" target="_blank" rel="noopener">Behance</a>
        <a href="https://www.linkedin.com/in/joaopedromalta7" target="_blank" rel="noopener">LinkedIn</a>
      </div>
    </div>
    <div class="footer__base">
      <span>© <span data-year>2026</span> Malta Business · João Pedro. CNPJ 63.593.320/0001-12</span>
      <a href="#conteudo">Voltar ao topo ↑</a>
    </div>
  </div>
</footer>
${waFloat}
<script src="/assets/js/site.js?v=${V}" defer></script>
</body>
</html>
`;

/* ---------------- JSON-LD ---------------- */
const ORG = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE}/#malta`,
  name: 'Malta Business',
  url: `${SITE}/`,
  logo: `${SITE}/assets/img/icons/icon-512.png`,
  image: OG,
  description: 'Fotografia, criação de sites e landing pages para empresas e profissionais.',
  telephone: '+55-31-8763-7599',
  email: 'joaopedrosegreto@gmail.com',
  taxID: '63.593.320/0001-12',
  address: { '@type': 'PostalAddress', addressLocality: 'Belo Horizonte', addressRegion: 'MG', addressCountry: 'BR' },
  areaServed: { '@type': 'Country', name: 'Brasil' },
  founder: { '@id': `${SITE}/#joao-pedro` },
  sameAs: ['https://www.instagram.com/jp_fmalta/', 'https://www.behance.net/joaopedromalta', 'https://www.linkedin.com/in/joaopedromalta7'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog', name: 'Serviços',
    itemListElement: ['Criação de sites', 'Landing pages', 'Fotografia'].map(n => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: n } })),
  },
};
const PERSON = {
  '@context': 'https://schema.org', '@type': 'Person', '@id': `${SITE}/#joao-pedro`,
  name: 'João Pedro', alternateName: 'Malta', jobTitle: 'Designer gráfico e desenvolvedor web',
  url: `${SITE}/sobre/`, image: `${SITE}/assets/img/brand/about.webp`,
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'UNA' },
  worksFor: { '@id': `${SITE}/#malta` },
  sameAs: ORG.sameAs,
};
const WEBSITE = { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE}/#site`, name: 'Malta Business', url: `${SITE}/`, inLanguage: 'pt-BR', publisher: { '@id': `${SITE}/#malta` } };
const crumbs = (items) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + p })),
});

/* ---------------- componentes ---------------- */
function workCard(p, n, variant = '') {
  const cls = variant.split(' ').filter(Boolean).map(v => 'work--' + v).join(' ');
  return `
      <article class="work ${cls}" data-reveal>
        <div class="work__stage">
          <span class="browser"><span class="browser__bar"><i></i><i></i><i></i><em>${p.domain}</em></span>
            <span class="browser__shot"><img src="/assets/img/projetos/${p.slug}.webp" alt="Tela inicial do projeto ${p.name} no computador" width="1280" height="800" loading="lazy" decoding="async"></span></span>
          <span class="phone"><span class="phone__screen"><img src="/assets/img/projetos/${p.slug}_mob.webp" alt="Versão mobile do projeto ${p.name}" width="420" height="909" loading="lazy" decoding="async"></span></span>
        </div>
        <div class="work__meta">
          <div class="work__top"><span class="idx">${String(n).padStart(2, '0')}</span><span class="work__niche">${p.niche}</span></div>
          <h3 class="work__name">${p.name}</h3>
          <p class="work__goal">${p.goal}</p>
          <div><a class="btn btn--ghost btn--sm work__cta" href="${p.url}" target="_blank" rel="noopener" aria-label="Ver projeto ${p.name} (abre em nova aba)"><span>Ver projeto</span>${I.out}</a></div>
        </div>
      </article>`;
}

function carousel(s, wide = false) {
  const imgs = shootImgs(s);
  const slides = imgs.map((f, i) => `
            <figure class="carousel__slide"><img src="/assets/img/fotos/${s.slug}/${f}" alt="${(s.alts[i] || s.title + ', foto ' + (i + 1))}" width="480" height="640" ${i === 0 ? 'loading="lazy"' : 'loading="lazy"'} decoding="async" draggable="false"></figure>`).join('');
  return `
        <div class="carousel${wide ? ' is-wide' : ''}" data-carousel role="region" aria-roledescription="carrossel" aria-label="Fotos: ${s.title}">
          <div class="carousel__track">${slides}
          </div>
          <div class="carousel__ui">
            <span class="carousel__count" aria-live="polite">01 / ${String(imgs.length).padStart(2, '0')}</span>
            <div class="carousel__dots"></div>
            <div class="carousel__nav">
              <button class="carousel__btn" type="button" data-prev aria-label="Foto anterior">${I.left}</button>
              <button class="carousel__btn" type="button" data-next aria-label="Próxima foto">${I.right}</button>
            </div>
          </div>
        </div>`;
}

const PLACEHOLDER_QUOTES = [1, 2, 3].map(n => `
      <!-- EDITAR: depoimento ${n}. Troque o texto, nome, empresa e (opcional) a foto em /assets/img/feedbacks/. Remova a classe quote--placeholder e o selo .ph-flag quando for real. -->
      <figure class="quote quote--placeholder" data-reveal>
        <span class="ph-flag">Espaço reservado · depoimento ${n}</span>
        <span class="quote__mark" aria-hidden="true">“</span>
        <blockquote><p>[Depoimento real do cliente aqui. Uma ou duas frases sobre como foi o projeto e o que mudou depois.]</p></blockquote>
        <figcaption>
          <span class="quote__avatar" aria-hidden="true"></span>
          <span class="quote__who"><b>[Nome do cliente]</b><span>[Empresa · cidade]</span></span>
        </figcaption>
      </figure>`).join('');

const ctaBand = (title = 'Vamos tirar seu projeto do papel?') => `
  <section class="cta-band" aria-labelledby="cta-title">
    <div class="wrap">
      <span class="eyebrow" data-reveal><i class="star">✱</i> Próximo passo</span>
      <h2 id="cta-title" class="display" style="margin-top:24px" data-reveal>${title}</h2>
      <p class="lead" style="margin-top:24px" data-reveal>Me conta o que você precisa. Respondo pelo WhatsApp com as próximas etapas e um orçamento sem compromisso.</p>
      <div class="cta-band__row" data-reveal>
        <a class="btn btn--solid" href="/contato/"><span>Pedir orçamento</span>${I.right}</a>
        <a class="btn btn--ghost" href="${WA_LINK}" target="_blank" rel="noopener"><span>Chamar no WhatsApp</span>${I.wa}</a>
      </div>
    </div>
  </section>`;

const write = (rel, html) => {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html.replace(/[ \t]+\n/g, '\n'));
  console.log('wrote', rel);
};

/* ================= HOME ================= */
{
  const feat = [['montepedra', 'wide'], ['marmoprice', ''], ['greenpark', 'offset']];
  const strip = SHOOTS.flatMap(s => shootImgs(s).slice(0, 2).map((f, i) => ({ s, f, i }))).slice(0, 8);
  const html = head({
    title: 'Malta Business · Fotografia, Sites e Landing Pages',
    desc: 'Fotografia, criação de sites e landing pages para quem ainda não tem presença online ou quer melhorar a que tem. Projetos por João Pedro, o Malta, de Belo Horizonte.',
    pathname: '/',
    jsonld: [ORG, PERSON, WEBSITE],
    preload: '<link rel="preload" as="image" href="/assets/img/projetos/marmorariapaulista.webp" fetchpriority="high">\n',
  }) + header('home') + `
<main id="conteudo">

  <section class="hero" aria-labelledby="hero-title">
    <div class="wrap hero__grid">
      <div>
        <div class="hero__top">
          <span class="eyebrow"><i class="star">✱</i> Fotografia · Sites · Landing Pages</span>
          <span class="eyebrow">Belo Horizonte · BR</span>
        </div>
        <h1 id="hero-title" class="display">
          <span class="line-mask"><span>Sua marca merece</span></span>
          <span class="line-mask" style="--d:90ms"><span>ser vista <span class="dim">do jeito</span></span></span>
          <span class="line-mask" style="--d:180ms"><span class="dim">certo.</span></span>
        </h1>
        <p class="lead" data-reveal style="--d:260ms">Sou João Pedro, o <strong>Malta</strong>. Faço <strong>sites, landing pages e fotografia</strong> para empresas e profissionais que ainda não estão na internet, ou que estão, mas não do jeito que deveriam.</p>
        <div class="hero__actions" data-reveal style="--d:340ms">
          <a class="btn btn--solid" href="/contato/"><span>Pedir orçamento</span>${I.right}</a>
          <a class="btn btn--ghost btn--arrow" href="#servicos"><span>Ver o que eu faço</span>${I.down}</a>
        </div>
        <div class="hero__facts" data-reveal style="--d:420ms">
          <span class="chip"><i></i>7 anos na área criativa</span>
          <span class="chip"><i></i>Design + código + câmera</span>
        </div>
      </div>
      <div class="hero__art" data-reveal="scale" style="--d:200ms" aria-hidden="true">
        <div class="browser float-y">
          <div class="browser__bar"><i></i><i></i><i></i><em>marmorariapaulistajf.com.br</em></div>
          <div class="browser__shot"><img src="/assets/img/projetos/marmorariapaulista.webp" alt="" width="1280" height="800" fetchpriority="high" decoding="async"></div>
        </div>
        <div class="phone float-y float-y--late">
          <div class="phone__screen"><img src="/assets/img/fotos/futebol-noturno/01.webp" alt="" width="480" height="640" decoding="async"></div>
        </div>
        <span class="hero__tag">Web ✱ Foto</span>
      </div>
    </div>
  </section>

  <div class="marquee" aria-hidden="true">
    <div class="marquee__track">
      ${Array(2).fill('<span>Sites<i>✱</i></span><span>Landing Pages<i>✱</i></span><span>Fotografia<i>✱</i></span><span>Identidade visual<i>✱</i></span><span>Presença digital<i>✱</i></span>').join('')}
    </div>
  </div>

  <section class="section" id="servicos" aria-labelledby="svc-title">
    <div class="wrap">
      <div class="sec-head sec-head--split">
        <h2 id="svc-title" class="h2" data-reveal>Três frentes, <span class="dim">uma mesma assinatura.</span></h2>
        <p class="lead" data-reveal>Quem pensa o layout também entende de imagem. Por isso o site, a página de vendas e as fotos saem com a mesma cara, sem remendo entre fornecedores.</p>
      </div>
      <div class="svc">
        <a class="svc__row" href="/sites-e-landing-pages/#sites" data-reveal>
          <span class="idx">01</span>
          <span class="svc__title">Sites</span>
          <div class="svc__body">
            <p>Site institucional completo, com páginas de serviços, catálogo, portfólio e contato. Rápido, responsivo e preparado para o Google.</p>
            <span class="svc__for"><b>Para quem</b>Ainda não tem site, ou tem um que não representa mais a empresa.</span>
            <span class="link-arrow">Ver sites ${I.right}</span>
          </div>
          <span class="svc__thumb"><img src="/assets/img/projetos/gvimarmore.webp" alt="" width="1280" height="800" loading="lazy" decoding="async"></span>
        </a>
        <a class="svc__row" href="/sites-e-landing-pages/#landing-pages" data-reveal>
          <span class="idx">02</span>
          <span class="svc__title">Landing Pages</span>
          <div class="svc__body">
            <p>Página de uma rolagem só, com um objetivo: orçamento, cadastro ou venda. Ideal para anúncios no Google e no Instagram.</p>
            <span class="svc__for"><b>Para quem</b>Vai investir em tráfego pago ou lançar um produto, serviço ou evento.</span>
            <span class="link-arrow">Ver landing pages ${I.right}</span>
          </div>
          <span class="svc__thumb"><img src="/assets/img/projetos/marmoprice.webp" alt="" width="1280" height="800" loading="lazy" decoding="async"></span>
        </a>
        <a class="svc__row" href="/fotografia/" data-reveal>
          <span class="idx">03</span>
          <span class="svc__title">Fotografia</span>
          <div class="svc__body">
            <p>Ensaios, cobertura de eventos, esporte e fotos para marcas. Imagem própria para o site, as redes e as campanhas.</p>
            <span class="svc__for"><b>Para quem</b>Quer fotos de verdade da sua marca, do seu evento ou de você.</span>
            <span class="link-arrow">Ver fotografia ${I.right}</span>
          </div>
          <span class="svc__thumb"><img src="/assets/img/fotos/editorial/02.webp" alt="" width="480" height="640" loading="lazy" decoding="async"></span>
        </a>
      </div>
    </div>
  </section>

  <section class="section section--line" aria-labelledby="web-title">
    <div class="wrap">
      <div class="sec-head sec-head--split">
        <div>
          <span class="eyebrow" data-reveal><i class="star">✱</i> Projetos web</span>
          <h2 id="web-title" class="h2" style="margin-top:18px" data-reveal>Páginas no ar, <span class="dim">trabalhando.</span></h2>
        </div>
        <p class="lead" data-reveal>Uma amostra dos sites e landing pages que eu criei. Cada um com um objetivo diferente, todos com o mesmo cuidado com detalhe.</p>
      </div>
      <div class="works">${feat.map(([s, v], i) => workCard(byslug(s), i + 1, v)).join('')}
      </div>
      <div style="margin-top:56px" data-reveal><a class="btn btn--ghost" href="/sites-e-landing-pages/"><span>Ver todos os ${ALL.length} projetos</span>${I.right}</a></div>
    </div>
  </section>

  <section class="section section--line" aria-labelledby="foto-title">
    <div class="wrap">
      <div class="sec-head sec-head--split">
        <div>
          <span class="eyebrow" data-reveal><i class="star">✱</i> Fotografia</span>
          <h2 id="foto-title" class="h2" style="margin-top:18px" data-reveal>Imagem com <span class="dim">intenção.</span></h2>
        </div>
        <p class="lead" data-reveal>Esporte, bastidores, música, retrato e editorial. Arraste para o lado e veja um pouco do que sai da câmera.</p>
      </div>
    </div>
    <div class="wrap">
      <div class="strip" data-reveal>${strip.map(({ s, f, i }) => `
        <a href="/fotografia/#${s.slug}"><img src="/assets/img/fotos/${s.slug}/${f}" alt="${s.alts[i] || s.title}" width="480" height="640" loading="lazy" decoding="async" draggable="false"><span>${s.title}</span></a>`).join('')}
      </div>
      <div style="margin-top:48px" data-reveal><a class="btn btn--ghost" href="/fotografia/"><span>Ver projetos de fotografia</span>${I.right}</a></div>
    </div>
  </section>

  <section class="section section--line" aria-labelledby="proc-title">
    <div class="wrap">
      <div class="sec-head">
        <span class="eyebrow" data-reveal><i class="star">✱</i> Como funciona</span>
        <h2 id="proc-title" class="h2" data-reveal>Do primeiro “oi” <span class="dim">à entrega.</span></h2>
      </div>
      <div class="steps" data-stagger="90">
        <div class="step" data-reveal><span class="idx">01</span><h3>Conversa</h3><p>Você me conta o que precisa pelo WhatsApp ou pelo formulário. Entendo o negócio, o público e o objetivo.</p></div>
        <div class="step" data-reveal><span class="idx">02</span><h3>Proposta</h3><p>Envio escopo, prazo e investimento por escrito. Nada começa sem estar tudo claro para os dois lados.</p></div>
        <div class="step" data-reveal><span class="idx">03</span><h3>Criação</h3><p>Design, código ou ensaio. Você acompanha as etapas e pede ajustes dentro das rodadas combinadas.</p></div>
        <div class="step" data-reveal><span class="idx">04</span><h3>Entrega</h3><p>Site publicado, página no ar ou fotos tratadas na sua mão, com orientação para usar bem o material.</p></div>
      </div>
    </div>
  </section>

  <section class="section section--line" id="feedbacks" aria-labelledby="fb-title">
    <div class="wrap">
      <div class="sec-head sec-head--split">
        <div>
          <span class="eyebrow" data-reveal><i class="star">✱</i> Feedbacks</span>
          <h2 id="fb-title" class="h2" style="margin-top:18px" data-reveal>Quem já <span class="dim">trabalhou comigo.</span></h2>
        </div>
        <p class="lead" data-reveal>Depoimentos de clientes reais, com nome e empresa.</p>
      </div>
      <div class="quotes" data-stagger="90">${PLACEHOLDER_QUOTES}
      </div>
    </div>
  </section>

  <section class="section section--line" aria-labelledby="about-title">
    <div class="wrap about">
      <div class="about__photo" data-reveal="scale">
        <img src="/assets/img/brand/about.webp" alt="Retrato de João Pedro, o Malta" width="900" height="1125" loading="lazy" decoding="async">
        <span class="about__badge">Malta ✱ Business</span>
      </div>
      <div>
        <span class="eyebrow" data-reveal><i class="star">✱</i> Sobre</span>
        <h2 id="about-title" class="h2" style="margin:18px 0 28px" data-reveal>Prazer, <span class="dim">João Pedro.</span></h2>
        <div class="prose" data-reveal>
          <p>No meio criativo, todo mundo me chama de <strong>Malta</strong>. Sou <strong>designer gráfico e desenvolvedor web</strong>, com <strong>7 anos na área criativa</strong>, e fotógrafo.</p>
          <p>Juntar as três coisas me permite entregar presença digital completa: o site ou a landing page, com as fotos que vão dentro dela, falando a mesma língua.</p>
        </div>
        <div style="margin-top:32px" data-reveal><a class="link-arrow" href="/sobre/">Conhecer mais ${I.right}</a></div>
      </div>
    </div>
  </section>

  ${ctaBand()}
</main>
` + footer;
  write('index.html', html);
}

/* ================= FOTOGRAFIA ================= */
{
  const html = head({
    title: 'Fotografia · Malta Business',
    desc: 'Projetos de fotografia de João Pedro, o Malta: esporte, cobertura de eventos, bastidores, música, retrato e editorial para marcas.',
    pathname: '/fotografia/',
    jsonld: [crumbs([['Início', '/'], ['Fotografia', '/fotografia/']]), {
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Fotografia · Malta Business', url: `${SITE}/fotografia/`,
      about: 'Fotografia', isPartOf: { '@id': `${SITE}/#site` },
      hasPart: SHOOTS.map(s => ({ '@type': 'ImageGallery', name: s.title, genre: s.type, url: `${SITE}/fotografia/#${s.slug}` })),
    }],
  }) + header('fotografia') + `
<main id="conteudo">
  <section class="page-head">
    <div class="wrap">
      <nav class="crumbs" aria-label="Você está em"><a href="/">Início</a><span aria-hidden="true">/</span><span>Fotografia</span></nav>
      <h1 class="display">
        <span class="line-mask"><span>Fotografia</span></span>
        <span class="line-mask" style="--d:90ms"><span class="dim">com intenção.</span></span>
      </h1>
      <p class="lead" data-reveal style="--d:200ms">Cada projeto abaixo é um ensaio ou cobertura. Arraste as fotos para o lado (ou use as setas) e leia a proposta de cada um.</p>
    </div>
  </section>

  <section class="section section--tight" aria-label="Projetos de fotografia">
    <div class="wrap shoots">${SHOOTS.map((s, i) => `
      <!-- EDITAR: projeto "${s.slug}". Fotos em /assets/img/fotos/${s.slug}/ (01.webp, 02.webp, ...). O carrossel lê todas automaticamente ao rodar o gerador; se editar o HTML à mão, duplique um <figure class="carousel__slide">. -->
      <article class="shoot" id="${s.slug}" data-reveal>
        ${carousel(s)}
        <div class="shoot__text">
          <div class="work__top"><span class="idx">${String(i + 1).padStart(2, '0')}</span><span class="work__niche">${s.type}</span></div>
          <h2 class="shoot__title">${s.title}</h2>
          <dl class="shoot__dl">
            <div><dt>Proposta</dt><dd>${s.proposta}</dd></div>
            <div><dt>O que foi entregue</dt><dd>${s.entrega}</dd></div>
          </dl>
        </div>
      </article>`).join('')}
    </div>
    <div class="wrap" style="margin-top:80px" data-reveal>
      <a class="btn btn--ghost" href="https://www.instagram.com/jp_fmalta/" target="_blank" rel="noopener"><span>Ver mais no Instagram</span>${I.ig}</a>
    </div>
  </section>

  ${ctaBand('Precisa de fotos para sua marca ou evento?')}
</main>
` + footer;
  write('fotografia/index.html', html);
}

/* ================= SITES E LPs ================= */
{
  let n = 0;
  const html = head({
    title: 'Sites e Landing Pages · Portfólio · Malta Business',
    desc: `Portfólio de ${ALL.length} sites e landing pages criados por João Pedro, o Malta, para marmorarias, distribuidoras, imobiliário, engenharia, eventos e outros nichos.`,
    pathname: '/sites-e-landing-pages/',
    jsonld: [crumbs([['Início', '/'], ['Sites e Landing Pages', '/sites-e-landing-pages/']]), {
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Sites e Landing Pages · Malta Business', url: `${SITE}/sites-e-landing-pages/`,
      isPartOf: { '@id': `${SITE}/#site` },
      mainEntity: {
        '@type': 'ItemList', numberOfItems: ALL.length,
        itemListElement: ALL.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'CreativeWork', name: p.name, url: p.url, description: p.goal, genre: p.niche, creator: { '@id': `${SITE}/#joao-pedro` } } })),
      },
    }],
  }) + header('web') + `
<main id="conteudo">
  <section class="page-head">
    <div class="wrap">
      <nav class="crumbs" aria-label="Você está em"><a href="/">Início</a><span aria-hidden="true">/</span><span>Sites e landing pages</span></nav>
      <h1 class="display">
        <span class="line-mask"><span>Sites e</span></span>
        <span class="line-mask" style="--d:90ms"><span class="dim">landing pages.</span></span>
      </h1>
      <p class="lead" data-reveal style="--d:200ms">${ALL.length} projetos no ar. Filtre por categoria e clique em “Ver projeto” para abrir o site original em uma nova aba.</p>
    </div>
  </section>

  <section class="section section--tight" style="padding-top:0" aria-label="Projetos web">
    <div class="wrap">
      <div class="filters" data-filters role="group" aria-label="Filtrar projetos" data-reveal>
        <button class="filter" type="button" data-filter="todos" aria-pressed="true">Todos <sup>${ALL.length}</sup></button>
        ${GROUPS.map(g => `<button class="filter" type="button" data-filter="${g.key}" aria-pressed="false">${g.title} <sup>${g.items.length}</sup></button>`).join('\n        ')}
      </div>
      ${GROUPS.map(g => `
      <section class="group" id="${g.key}" data-group="${g.key}" aria-labelledby="g-${g.key}">
        <div class="group__head" data-reveal>
          <h2 id="g-${g.key}">${g.title} <span class="idx">(${String(g.items.length).padStart(2, '0')})</span></h2>
          <p>${g.lead}</p>
        </div>
        <div class="works">${g.items.map((p, i) => workCard(p, ++n, g.layout[i] || '')).join('')}
        </div>
      </section>`).join('')}
    </div>
  </section>

  ${ctaBand('Quer um site ou landing page assim?')}
</main>
` + footer;
  write('sites-e-landing-pages/index.html', html);
}

/* ================= SOBRE ================= */
{
  const html = head({
    title: 'Sobre João Pedro, o Malta · Malta Business',
    desc: 'João Pedro, o Malta: designer gráfico, desenvolvedor web e fotógrafo de Belo Horizonte, com 7 anos na área criativa.',
    pathname: '/sobre/',
    jsonld: [crumbs([['Início', '/'], ['Sobre', '/sobre/']]), { ...PERSON, '@type': 'Person' }, {
      '@context': 'https://schema.org', '@type': 'AboutPage', name: 'Sobre · Malta Business', url: `${SITE}/sobre/`, mainEntity: { '@id': `${SITE}/#joao-pedro` },
    }],
  }) + header('sobre') + `
<main id="conteudo">
  <section class="page-head">
    <div class="wrap">
      <nav class="crumbs" aria-label="Você está em"><a href="/">Início</a><span aria-hidden="true">/</span><span>Sobre</span></nav>
      <h1 class="display">
        <span class="line-mask"><span>Prazer,</span></span>
        <span class="line-mask" style="--d:90ms"><span class="dim">eu sou o Malta.</span></span>
      </h1>
    </div>
  </section>

  <section class="section section--tight" style="padding-top:0">
    <div class="wrap about">
      <div class="about__photo" data-reveal="scale">
        <img src="/assets/img/brand/about.webp" alt="Retrato de João Pedro, o Malta" width="900" height="1125" decoding="async">
        <span class="about__badge">João Pedro ✱ Malta</span>
      </div>
      <div>
        <div class="prose" data-reveal>
          <p class="lead" style="color:var(--ink);margin-bottom:1.2em">Sou <strong>João Pedro</strong>, conhecido como <strong>Malta</strong>. Designer gráfico e desenvolvedor web, com <strong>7 anos na área criativa</strong>, e fotógrafo nas horas em que a câmera é a melhor ferramenta.</p>
          <p>Sou formado em Design Gráfico pela UNA e trabalho de Belo Horizonte para clientes de todo o Brasil. A Malta Business é onde junto as três frentes: <strong>sites, landing pages e fotografia</strong>.</p>
          <p>Meu foco é quem ainda não tem presença online, ou tem uma que não faz jus ao negócio. Cuido do layout, do texto, do código e, quando precisa, das fotos, para que tudo saia com a mesma identidade.</p>
          <p>Trabalho com briefing claro, proposta por escrito e entregas que você acompanha. Sem jargão, sem surpresa no meio do caminho.</p>
        </div>
        <div class="facts" data-stagger="70">
          <div data-reveal><b>7</b><span>anos na área criativa</span></div>
          <div data-reveal><b>${ALL.length}</b><span>projetos web neste portfólio</span></div>
          <div data-reveal><b>UNA</b><span>Design Gráfico</span></div>
          <div data-reveal><b>BH</b><span>atendendo todo o Brasil</span></div>
        </div>
        <div class="skills" data-reveal>
          ${['Design gráfico', 'Identidade visual', 'UI / web design', 'Desenvolvimento front-end', 'SEO técnico', 'Copy para web', 'Fotografia', 'Tratamento de imagem'].map(s => `<span class="chip"><i></i>${s}</span>`).join('\n          ')}
        </div>
      </div>
    </div>
  </section>

  ${ctaBand('Bora conversar sobre o seu projeto?')}
</main>
` + footer;
  write('sobre/index.html', html);
}

/* ================= CONTATO ================= */
{
  const html = head({
    title: 'Contato e orçamento · Malta Business',
    desc: 'Peça um orçamento de site, landing page ou fotografia. Preencha o formulário e a mensagem chega pronta no WhatsApp do Malta.',
    pathname: '/contato/',
    jsonld: [crumbs([['Início', '/'], ['Contato', '/contato/']]), {
      '@context': 'https://schema.org', '@type': 'ContactPage', name: 'Contato · Malta Business', url: `${SITE}/contato/`, about: { '@id': `${SITE}/#malta` },
    }],
  }) + header('contato') + `
<main id="conteudo">
  <section class="page-head">
    <div class="wrap">
      <nav class="crumbs" aria-label="Você está em"><a href="/">Início</a><span aria-hidden="true">/</span><span>Contato</span></nav>
      <h1 class="display">
        <span class="line-mask"><span>Vamos</span></span>
        <span class="line-mask" style="--d:90ms"><span class="dim">conversar?</span></span>
      </h1>
    </div>
  </section>

  <section class="section section--tight" style="padding-top:0">
    <div class="wrap contact">
      <aside class="contact__aside" data-reveal>
        <p class="lead">Preencha o formulário e a mensagem chega pronta no meu WhatsApp. Se preferir, fale direto por um dos canais abaixo.</p>
        <div class="contact__list">
          <a href="${WA_LINK}" target="_blank" rel="noopener"><span><small>WhatsApp</small>(31) 8763-7599</span>${I.wa}</a>
          <a href="mailto:joaopedrosegreto@gmail.com"><span><small>E-mail</small>joaopedrosegreto@gmail.com</span>${I.mail}</a>
          <a href="https://www.instagram.com/jp_fmalta/" target="_blank" rel="noopener"><span><small>Instagram</small>@jp_fmalta</span>${I.ig}</a>
        </div>
        <p class="mono">Belo Horizonte · atendo todo o Brasil</p>
      </aside>

      <form class="form" id="contact-form" novalidate data-reveal style="--d:120ms" aria-describedby="form-note">
        <div class="form__row">
          <div class="field">
            <label for="f-nome">Nome <span class="req">(obrigatório)</span></label>
            <input id="f-nome" name="nome" type="text" autocomplete="name" required minlength="2" placeholder="Como posso te chamar?" aria-describedby="e-nome">
            <span class="field__err" id="e-nome" role="alert"></span>
          </div>
          <div class="field">
            <label for="f-whatsapp">WhatsApp <span class="req">(obrigatório)</span></label>
            <input id="f-whatsapp" name="whatsapp" type="tel" inputmode="tel" autocomplete="tel" required placeholder="(31) 98765-4321" aria-describedby="e-whatsapp">
            <span class="field__err" id="e-whatsapp" role="alert"></span>
          </div>
        </div>
        <div class="form__row">
          <div class="field">
            <label for="f-email">E-mail <span class="req">(opcional)</span></label>
            <input id="f-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="voce@empresa.com.br" aria-describedby="e-email">
            <span class="field__err" id="e-email" role="alert"></span>
          </div>
          <div class="field">
            <label for="f-servico">O que você precisa? <span class="req">(obrigatório)</span></label>
            <select id="f-servico" name="servico" required aria-describedby="e-servico">
              <option value="">Selecione</option>
              <option value="site">Site institucional</option>
              <option value="landing-page">Landing page</option>
              <option value="fotografia">Fotografia</option>
              <option value="site-e-fotografia">Site ou LP + fotografia</option>
              <option value="outro">Outro / ainda não sei</option>
            </select>
            <span class="field__err" id="e-servico" role="alert"></span>
          </div>
        </div>
        <fieldset class="field">
          <legend>Sua situação hoje <span class="req">(opcional)</span></legend>
          <div class="choices">
            <label class="choice"><input type="radio" name="situacao" value="Ainda não tenho site"><span>Ainda não tenho site</span></label>
            <label class="choice"><input type="radio" name="situacao" value="Já tenho site e quero melhorar"><span>Já tenho e quero melhorar</span></label>
            <label class="choice"><input type="radio" name="situacao" value="Busco fotografia"><span>Busco fotografia</span></label>
          </div>
        </fieldset>
        <div class="field">
          <label for="f-mensagem">Conte sobre o projeto <span class="req">(obrigatório)</span></label>
          <textarea id="f-mensagem" name="mensagem" required minlength="10" placeholder="Seu negócio, o que você imagina, prazo, links de referência..." aria-describedby="e-mensagem"></textarea>
          <span class="field__err" id="e-mensagem" role="alert"></span>
        </div>
        <div class="form__foot">
          <p id="form-note">O botão libera quando os campos obrigatórios estiverem certos. Ao enviar, o WhatsApp abre com sua mensagem pronta.</p>
          <button class="btn btn--solid" type="submit" disabled><span>Enviar pelo WhatsApp</span>${I.wa}</button>
        </div>
      </form>
    </div>
  </section>
</main>
` + footer;
  write('contato/index.html', html);
}

/* ================= OBRIGADO ================= */
{
  const html = head({
    title: 'Mensagem enviada · Malta Business',
    desc: 'Sua mensagem foi preparada no WhatsApp. Em breve o Malta responde.',
    pathname: '/obrigado/', robots: 'noindex, follow',
  }) + header('') + `
<main id="conteudo" class="simple">
  <div class="simple__in">
    <span class="eyebrow" data-reveal><i class="star">✱</i> Tudo certo</span>
    <h1 class="display">
      <span class="line-mask"><span>Obrigado!</span></span>
      <span class="line-mask" style="--d:90ms"><span class="dim">Já já te respondo.</span></span>
    </h1>
    <p class="lead" data-reveal>Sua mensagem abriu no WhatsApp em outra aba. É só tocar em enviar por lá. Se a aba não abriu, use o botão abaixo.</p>
    <div class="simple__row" data-reveal>
      <a class="btn btn--solid" href="${WA_LINK}" target="_blank" rel="noopener" data-wa-retry><span>Abrir o WhatsApp</span>${I.wa}</a>
      <a class="btn btn--ghost" href="/sites-e-landing-pages/"><span>Ver projetos enquanto isso</span>${I.right}</a>
    </div>
  </div>
</main>
` + footer;
  write('obrigado/index.html', html);
}

/* ================= 404 ================= */
{
  const html = head({
    title: 'Página não encontrada · Malta Business',
    desc: 'Essa página não existe ou mudou de endereço.',
    pathname: '/404.html', robots: 'noindex, follow',
  }) + header('') + `
<main id="conteudo" class="simple">
  <div class="simple__in">
    <span class="simple__big" aria-hidden="true">404</span>
    <h1 class="h2">Essa página <span class="dim">saiu do enquadramento.</span></h1>
    <p class="lead">O endereço pode ter mudado ou não existe mais. Escolha um caminho:</p>
    <div class="simple__row">
      <a class="btn btn--solid" href="/"><span>Ir para o início</span>${I.right}</a>
      <a class="btn btn--ghost" href="/sites-e-landing-pages/"><span>Sites e LPs</span></a>
      <a class="btn btn--ghost" href="/fotografia/"><span>Fotografia</span></a>
    </div>
  </div>
</main>
` + footer;
  write('404.html', html);
}

/* ================= sitemap ================= */
{
  const today = new Date().toISOString().slice(0, 10);
  const urls = [['/', '1.0'], ['/sites-e-landing-pages/', '0.9'], ['/fotografia/', '0.9'], ['/sobre/', '0.7'], ['/contato/', '0.8']];
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, p]) => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod><priority>${p}</priority></url>`).join('\n')}
</urlset>
`);
}
