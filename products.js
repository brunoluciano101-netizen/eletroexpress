window.STORE_CONFIG = {
  storeName: 'EletroExpress',
  domain: 'eletroexpress.app.br',
  fullUrl: 'https://eletroexpress.app.br',
  supportEmail: 'contato@eletroexpress.app.br',
  markupPercent: 50,
  pixExtraDiscount: 0.05,
  pixMerchantName: 'ELETROEXPRESS BRASIL',
  pixMerchantCity: 'UBERLANDIA',
  pixKey: 'recebimentos@eletroexpress.app.br'
};

window.CATEGORIES = [
  { id: 'all', name: 'Todos (108)', icon: '🔥' },
  { id: 'smartwatches', name: 'Smartwatches', icon: '⌚' },
  { id: 'audio', name: 'Áudio & Fones', icon: '🎧' },
  { id: 'casainteligente', name: 'Casa Inteligente', icon: '🏠' },
  { id: 'projetores', name: 'Projetores & TV', icon: '📽️' },
  { id: 'energia', name: 'Carregadores & Energia', icon: '🔋' },
  { id: 'celular', name: 'Acessórios Celular', icon: '📱' },
  { id: 'saude', name: 'Saúde & Beleza', icon: '💆' },
  { id: 'automotivo', name: 'Automotivo Tech', icon: '🚗' },
  { id: 'gamer', name: 'Gamer & Setup', icon: '🎮' }
];

const CATEGORY_PALETTES = {
  smartwatches: ['#0f172a', '#2563eb', '#38bdf8'],
  audio: ['#111827', '#7c3aed', '#c084fc'],
  casainteligente: ['#064e3b', '#059669', '#34d399'],
  projetores: ['#1e1b4b', '#4f46e5', '#818cf8'],
  energia: ['#172554', '#0284c7', '#38bdf8'],
  celular: ['#18181b', '#e11d48', '#fb7185'],
  saude: ['#134e4a', '#0d9488', '#5eead4'],
  automotivo: ['#1e293b', '#ea580c', '#fb923c'],
  gamer: ['#090d16', '#9333ea', '#22d3ee']
};

window.generateProductImages = function (product) {
  const [c1, c2, c3] = CATEGORY_PALETTES[product.category] || ['#0f172a', '#2563eb', '#38bdf8'];
  const catObj = window.CATEGORIES.find((c) => c.id === product.category);
  const icon = catObj ? catObj.icon : '⚡';
  const safeName = product.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').slice(0, 34);
  const spec1 = (product.specs[0] || 'Alta Performance').replace(/&/g, '&amp;').slice(0, 36);
  const spec2 = (product.specs[1] || 'Envio Imediato Brasil').replace(/&/g, '&amp;').slice(0, 36);

  const views = [
    { label: 'VISTA PRINCIPAL HD', sub: spec1, angle: '0' },
    { label: 'DETALHES & TECNOLOGIA', sub: spec2, angle: '12' },
    { label: 'KIT COMPLETO + GARANTIA', sub: `SKU ${product.sku} • EletroExpress`, angle: '-10' }
  ];

  return views.map((v, idx) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="550" viewBox="0 0 800 550">
      <defs>
        <linearGradient id="g${product.id}_${idx}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="55%" stop-color="${c2}"/>
          <stop offset="100%" stop-color="${c3}"/>
        </linearGradient>
      </defs>
      <rect width="800" height="550" fill="url(#g${product.id}_${idx})"/>
      <circle cx="660" cy="110" r="170" fill="rgba(255,255,255,0.08)"/>
      <circle cx="140" cy="460" r="190" fill="rgba(255,255,255,0.06)"/>
      <rect x="36" y="32" width="220" height="34" rx="17" fill="rgba(15,23,42,0.65)"/>
      <text x="54" y="54" fill="#ffffff" font-family="Arial,sans-serif" font-size="14" font-weight="bold">${v.label}</text>
      <rect x="574" y="32" width="190" height="34" rx="17" fill="rgba(16,185,129,0.9)"/>
      <text x="594" y="54" fill="#ffffff" font-family="Arial,sans-serif" font-size="13" font-weight="bold">ELETROEXPRESS.APP.BR</text>
      <g transform="translate(400,245) rotate(${v.angle})">
        <rect x="-115" y="-115" width="230" height="230" rx="46" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.35)" stroke-width="3"/>
        <text x="0" y="32" text-anchor="middle" font-size="108">${icon}</text>
      </g>
      <rect x="36" y="405" width="728" height="112" rx="18" fill="rgba(15,23,42,0.78)"/>
      <text x="60" y="446" fill="#ffffff" font-family="Arial,sans-serif" font-size="24" font-weight="bold">${safeName}</text>
      <text x="60" y="482" fill="#93c5fd" font-family="Arial,sans-serif" font-size="17">${v.sub}</text>
      <text x="740" y="482" text-anchor="end" fill="#6ee7b7" font-family="Arial,sans-serif" font-size="16" font-weight="bold">Foto ${idx + 1}/3 • Vídeo HD</text>
    </svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  });
};

const RAW_ALIEXPRESS_CATALOG = [
  // 1. SMARTWATCHES & WEARABLES (12 produtos)
  { id: 1, sku: 'EE-SW01', name: 'Smartwatch Ultra 9 AMOLED 49mm GPS & NFC', category: 'smartwatches', cost: 118.00, sold: 1420, rating: 4.9, badge: 'TOP 1 VENDAS', specs: ['Tela Super AMOLED 2.1" Always-On', 'Faz e recebe chamadas Bluetooth', 'Bateria de até 7 dias + Carregamento Indução'] },
  { id: 2, sku: 'EE-SW02', name: 'Smartwatch HK9 Pro Max Plus ChatGPT & Bússola', category: 'smartwatches', cost: 132.00, sold: 980, rating: 4.9, badge: 'LANÇAMENTO', specs: ['Processador Dual-Core fluido 60Hz', 'Assistente de voz integrado', 'Resistente à água IP68'] },
  { id: 3, sku: 'EE-SW03', name: 'Relógio Inteligente Militar Tático K56 Pro', category: 'smartwatches', cost: 96.00, sold: 845, rating: 4.8, badge: 'ULTRA RESISTENTE', specs: ['Caixa metálica à prova de impactos', 'Bateria gigante 400mAh (12 dias)', '100+ modos esportivos'] },
  { id: 4, sku: 'EE-SW04', name: 'Smartband Mi Pro 8 OLED Monitor Cardíaco', category: 'smartwatches', cost: 64.00, sold: 1650, rating: 4.8, badge: 'CUSTO-BENEFÍCIO', specs: ['Monitoramento SpO2, sono e batimentos', 'Pulseira silicone esportiva leve', 'Autonomia de até 14 dias'] },
  { id: 5, sku: 'EE-SW05', name: 'Smartwatch Feminino Rosé Gold Tela Curva HD', category: 'smartwatches', cost: 108.00, sold: 1120, rating: 4.9, badge: 'FAVORITO', specs: ['Acompanha 2 pulseiras (Aço + Silicone)', 'Controle de ciclo e saúde feminina', 'Mostradores personalizáveis com foto'] },
  { id: 6, sku: 'EE-SW06', name: 'Anel Inteligente Smart Ring R02 Saúde & Sono', category: 'smartwatches', cost: 88.00, sold: 610, rating: 4.8, badge: 'VIRAL TIKTOK', specs: ['Corpo em aço titânio ultraleve 4g', 'Monitora sono profundo, passos e oxigênio', 'Estojo carregador portátil incluso'] },
  { id: 7, sku: 'EE-SW07', name: 'Smartwatch Amazfit Style GTS4 Mini GPS Integrado', category: 'smartwatches', cost: 164.00, sold: 540, rating: 4.9, badge: 'GPS NATIVO', specs: ['GPS de alta precisão sem precisar do celular', 'Tela AMOLED HD 1.75"', '5 ATM à prova d’água para natação'] },
  { id: 8, sku: 'EE-SW08', name: 'Smartwatch Infantil 4G GPS Rastreador & Chamada Vídeo', category: 'smartwatches', cost: 126.00, sold: 490, rating: 4.8, badge: 'SEGURANÇA', specs: ['Localização em tempo real no app dos pais', 'Botão SOS de emergência', 'Chamada de vídeo e voz'] },
  { id: 9, sku: 'EE-SW09', name: 'Smartwatch Esportivo Stratos 3 GPS Barômetro', category: 'smartwatches', cost: 152.00, sold: 430, rating: 4.9, badge: 'OUTDOOR', specs: ['Altímetro, barômetro e bússola integrados', 'Tela Corning Gorilla Glass', 'Bateria para 20 dias em standby'] },
  { id: 10, sku: 'EE-SW10', name: 'Smartwatch W29 Pro Series 9 Ilha Dinâmica', category: 'smartwatches', cost: 92.00, sold: 1310, rating: 4.8, badge: 'MAIS VENDIDO', specs: ['Ilha dinâmica de notificações', 'Trava de pulseira real + parafusos', 'Controle de câmera e músicas'] },
  { id: 11, sku: 'EE-SW11', name: 'Smartwatch GS9 Ultra Gold Edition 24K + 3 Pulseiras', category: 'smartwatches', cost: 124.00, sold: 760, rating: 4.9, badge: 'KIT LUXO', specs: ['Acabamento dourado premium', '3 pulseiras inclusas na caixa', 'Carregador sem fio magnético'] },
  { id: 12, sku: 'EE-SW12', name: 'Smartwatch Colmi P71 Chamadas Bluetooth & Voz', category: 'smartwatches', cost: 72.00, sold: 1190, rating: 4.8, badge: 'OFERTA RELÂMPAGO', specs: ['Tela grande 1.9" HD nítida', 'Atende ligações direto no pulso', '104 modos de treino'] },

  // 2. ÁUDIO & FONES BLUETOOTH (12 produtos)
  { id: 13, sku: 'EE-AU01', name: 'Fone Bluetooth Pro 2 Cancelamento Ativo de Ruído ANC', category: 'audio', cost: 78.00, sold: 2150, rating: 4.9, badge: 'CAMPEÃO VENDAS', specs: ['Cancelamento ativo de ruído ANC + Transparência', 'Estojo com som e carregamento MagSafe', 'Até 30h totais de bateria'] },
  { id: 14, sku: 'EE-AU02', name: 'Headphone Bluetooth Q30 Hi-Res ANC Dobrável', category: 'audio', cost: 148.00, sold: 890, rating: 4.9, badge: 'SOM ESTÚDIO', specs: ['Drivers 40mm com graves profundos', '40 horas de reprodução contínua', 'Almofadas Memory Foam ultramacias'] },
  { id: 15, sku: 'EE-AU03', name: 'Fone Condução Óssea Esportivo IPX8 Natação', category: 'audio', cost: 94.00, sold: 670, rating: 4.8, badge: 'CORRIDA & BIKE', specs: ['Ouvido livre para segurança no trânsito', 'Memória interna 32GB MP3 + Bluetooth 5.3', 'À prova d’água IPX8'] },
  { id: 16, sku: 'EE-AU04', name: 'Caixa de Som Bluetooth Boombox Mini 40W RGB IPX7', category: 'audio', cost: 136.00, sold: 940, rating: 4.9, badge: 'GRAVE FORTE', specs: ['Potência real 40W RMS com radiadores passivos', 'Função TWS conecta 2 caixas juntas', 'Bateria para 15h de festa'] },
  { id: 17, sku: 'EE-AU05', name: 'Microfone Sem Fio Lapela Duplo USB-C / iPhone', category: 'audio', cost: 68.00, sold: 1340, rating: 4.9, badge: 'CRIADORES', specs: ['Redução inteligente de ruído ambiente', 'Alcance sem fio de até 20 metros', 'Plug & Play sem precisar de aplicativo'] },
  { id: 18, sku: 'EE-AU06', name: 'Fone TWS Gamer X15 Baixa Latência LED Neon', category: 'audio', cost: 44.00, sold: 1880, rating: 4.7, badge: 'PREÇO IMPERDÍVEL', specs: ['Modo Gamer 45ms sem atraso no áudio', 'Estojo futurista com LED respiratório', 'Microfone HD para chamadas'] },
  { id: 19, sku: 'EE-AU07', name: 'Fone Open-Ear Clip-On Conforto Total Bluetooth 5.4', category: 'audio', cost: 66.00, sold: 780, rating: 4.8, badge: 'TENDÊNCIA', specs: ['Não entra no canal auditivo — zero desconforto', 'Bluetooth 5.4 ultra estável', 'Ideal para trabalhar o dia inteiro'] },
  { id: 20, sku: 'EE-AU08', name: 'Soundbar Bluetooth TV & PC 30W Subwoofer Integrado', category: 'audio', cost: 128.00, sold: 615, rating: 4.8, badge: 'CINEMA EM CASA', specs: ['Conexão Bluetooth, P2, USB e Cartão TF', 'Som estéreo envolvente 360°', 'Design slim elegante para sala ou monitor'] },
  { id: 21, sku: 'EE-AU09', name: 'Fone Lenovo GM2 Pro Original Esports Bluetooth 5.3', category: 'audio', cost: 48.00, sold: 2410, rating: 4.9, badge: 'MAIS VENDIDO', specs: ['Chip original Bluetooth 5.3', 'Modo Duplo Música & Jogo', 'Graves reforçados de 10mm'] },
  { id: 22, sku: 'EE-AU10', name: 'Caixa de Som Portátil Karaoke + 2 Microfones Sem Fio', category: 'audio', cost: 112.00, sold: 830, rating: 4.9, badge: 'DIVERSÃO FAMÍLIA', specs: ['Acompanha 2 microfones sem fio recarregáveis', 'Efeitos de voz divertidos + LED RGB', 'Bateria recarregável USB-C'] },
  { id: 23, sku: 'EE-AU11', name: 'Fone Bluetooth Esportivo Gancho Auricular 48h Bateria', category: 'audio', cost: 74.00, sold: 710, rating: 4.8, badge: 'NÃO CAI DA ORELHA', specs: ['Visor digital LED de bateria no estojo', 'Ganchos flexíveis para treino intenso', 'Resistente ao suor IPX7'] },
  { id: 24, sku: 'EE-AU12', name: 'Adaptador Receptor Bluetooth 5.3 Carro & Som Antigo', category: 'audio', cost: 36.00, sold: 1520, rating: 4.8, badge: 'UTILIDADE', specs: ['Transforma qualquer som P2/RCA em Bluetooth', 'Microfone embutido para viva-voz', 'Bateria interna de 10h'] },

  // 3. CASA INTELIGENTE & AUTOMAÇÃO (12 produtos)
  { id: 25, sku: 'EE-CI01', name: 'Câmera Segurança Wi-Fi Dupla Lente 360° Visão Noturna Colorida', category: 'casainteligente', cost: 116.00, sold: 1290, rating: 4.9, badge: 'SEGURANÇA TOP', specs: ['Duas lentes: uma fixa + uma giratória 360°', 'Rastreamento automático de movimento humano', 'Alarme sonoro e acesso remoto pelo celular'] },
  { id: 26, sku: 'EE-CI02', name: 'Robô Aspirador Inteligente 3 em 1 Varre, Aspira e Passa Pano', category: 'casainteligente', cost: 168.00, sold: 740, rating: 4.8, badge: 'CASA LIMPA', specs: ['Sucção potente para pelos de pets e poeira', 'Sensor antiqueda e anticolisão', 'Perfil ultrafino 6.8cm entra embaixo dos móveis'] },
  { id: 27, sku: 'EE-CI03', name: 'Fechadura Digital Biométrica Wi-Fi Tuya Senha & Tag', category: 'casainteligente', cost: 210.00, sold: 480, rating: 4.9, badge: 'ALTA MARGEM', specs: ['Abertura por digital, senha, cartão, app e chave', 'Gera senhas temporárias para visitas/Airbnb', 'Alerta em tempo real no celular'] },
  { id: 28, sku: 'EE-CI04', name: 'Lâmpada Inteligente Smart Wi-Fi RGB 15W Alexa & Google', category: 'casainteligente', cost: 34.00, sold: 2300, rating: 4.9, badge: 'AUTOMAÇÃO', specs: ['16 milhões de cores + branco quente/frio', 'Comando de voz com Alexa e Google Home', 'Agendamento automático de horários'] },
  { id: 29, sku: 'EE-CI05', name: 'Tomada Inteligente Wi-Fi 16A Medidor de Consumo Energia', category: 'casainteligente', cost: 42.00, sold: 1780, rating: 4.9, badge: 'ECONOMIA LUZ', specs: ['Monitora gasto em kWh e R$ pelo aplicativo', 'Liga e desliga aparelhos de qualquer lugar', 'Suporta até 16A (ar-condicionado, cafeteira)'] },
  { id: 30, sku: 'EE-CI06', name: 'Fita LED RGB Inteligente 5 Metros Wi-Fi Sincroniza Música', category: 'casainteligente', cost: 52.00, sold: 1410, rating: 4.8, badge: 'DECORAÇÃO', specs: ['Controle via App, Controle Remoto e Alexa', 'Microfone embutido reage ao som da TV/música', 'Adesivo 3M de alta fixação'] },
  { id: 31, sku: 'EE-CI07', name: 'Controle Remoto Universal Infravermelho Wi-Fi Smart IR', category: 'casainteligente', cost: 46.00, sold: 1150, rating: 4.8, badge: 'TUDO NO CELULAR', specs: ['Controla TV, Ar-Condicionado e Som pelo celular', 'Compatível com Alexa ("Alexa, ligar o ar")', 'Cobertura infravermelha 360°'] },
  { id: 32, sku: 'EE-CI08', name: 'Mini Câmera Espiã Wi-Fi Full HD 1080p Magnética', category: 'casainteligente', cost: 54.00, sold: 1620, rating: 4.7, badge: 'COMPACTA', specs: ['Base magnética fixa em qualquer superfície metálica', 'Visão noturna infravermelha invisível', 'Grava em cartão MicroSD ou nuvem'] },
  { id: 33, sku: 'EE-CI09', name: 'Umidificador Ultrassônico Chama Vulcão Aromatizador LED', category: 'casainteligente', cost: 76.00, sold: 1380, rating: 4.9, badge: 'VIRAL DECOR', specs: ['Efeito realista de chama de fogo 3D', 'Desligamento automático sem água', 'Ideal para óleos essenciais e quartos'] },
  { id: 34, sku: 'EE-CI10', name: 'Campainha Inteligente Sem Fio Vídeo Porteiro Wi-Fi', category: 'casainteligente', cost: 84.00, sold: 690, rating: 4.8, badge: 'PORTARIA SMART', specs: ['Veja e fale com quem está na porta pelo celular', 'Visão noturna HD + sensor de presença', 'Instalação sem quebrar parede'] },
  { id: 35, sku: 'EE-CI11', name: 'Sensor de Abertura Porta/Janela Wi-Fi Alarme Tuya', category: 'casainteligente', cost: 38.00, sold: 920, rating: 4.8, badge: 'ALERTA INSTANTÂNEO', specs: ['Notificação imediata no smartphone ao abrir', 'Cria cenas automáticas com lâmpadas', 'Bateria de longa duração'] },
  { id: 36, sku: 'EE-CI12', name: 'Dispensador Automático Sabonete Líquido Sensor Espuma', category: 'casainteligente', cost: 58.00, sold: 840, rating: 4.8, badge: 'HIGIENE TOUCHLESS', specs: ['Libera espuma em 0.25s sem toque', 'Bateria recarregável USB-C', 'Display digital de temperatura e nível'] },

  // 4. PROJETORES & ENTRETENIMENTO (12 produtos)
  { id: 37, sku: 'EE-PR01', name: 'Mini Projetor Portátil HY300 Pro Android 11 Wi-Fi 6 & 4K', category: 'projetores', cost: 198.00, sold: 2480, rating: 4.9, badge: 'CAMPEÃO ABSOLUTO', specs: ['Sistema Android integrado (Netflix, YouTube, Prime)', 'Rotação 180° projeta na parede ou no teto', 'Correção trapezoidal automática + Bluetooth 5.0'] },
  { id: 38, sku: 'EE-PR02', name: 'Projetor Full HD 1080p Nativo HY320 390 ANSI Lumens', category: 'projetores', cost: 268.00, sold: 1140, rating: 4.9, badge: 'CINEMA 150"', specs: ['Resolução nativa Full HD 1920x1080p', 'Tela gigante de até 150 polegadas nítidas', 'Wi-Fi Dual Band 5G + Alto-falante Hi-Fi'] },
  { id: 39, sku: 'EE-PR03', name: 'TV Stick 4K Android TV Voz Google Assistent 2GB/16GB', category: 'projetores', cost: 114.00, sold: 1320, rating: 4.8, badge: 'TRANSFORMA TV', specs: ['Transforma qualquer TV em Smart TV 4K rápida', 'Controle remoto Bluetooth com comando de voz', 'Chromecast integrado para espelhar celular'] },
  { id: 40, sku: 'EE-PR04', name: 'Console Retro Game Stick 4K 20.000 Jogos + 2 Controles', category: 'projetores', cost: 98.00, sold: 1890, rating: 4.9, badge: 'NOSTALGIA TOP', specs: ['Mais de 20.000 jogos clássicos (PS1, SNES, Arcade)', '2 controles sem fio inclusos', 'Basta conectar na entrada HDMI da TV'] },
  { id: 41, sku: 'EE-PR05', name: 'Fita LED Ambilight Sincroniza Cores da Tela TV/PC', category: 'projetores', cost: 122.00, sold: 640, rating: 4.9, badge: 'IMERSÃO TOTAL', specs: ['Expande as cores da tela na parede em tempo real', 'Sensor óptico ou sincronia via software', 'Efeito cinema IMAX na sua sala'] },
  { id: 42, sku: 'EE-PR06', name: 'Tela de Projeção Portátil 100 Polegadas Antirreflexo', category: 'projetores', cost: 62.00, sold: 790, rating: 4.8, badge: 'ACESSÓRIO PROJETOR', specs: ['Tecido poliéster de alto ganho de brilho', 'Não amassa e pode ser lavada', 'Acompanha ganchos de fixação rápida'] },
  { id: 43, sku: 'EE-PR07', name: 'Luminária Projetor Astronauta Galáxia Nebulosa + Controle', category: 'projetores', cost: 74.00, sold: 1740, rating: 4.9, badge: 'PRESENTE PERFEITO', specs: ['8 modos de nebulosa + estrelas laser verdes', 'Cabeça magnética articulada 360°', 'Timer automático de 45 ou 90 minutos'] },
  { id: 44, sku: 'EE-PR08', name: 'Suporte Articulado Parede/Teto Universal para Projetores', category: 'projetores', cost: 44.00, sold: 620, rating: 4.8, badge: 'INSTALAÇÃO FÁCIL', specs: ['Rosca padrão 1/4" compatível com HY300/HY320', 'Inclinação ajustável 360°', 'Alumínio reforçado de alta estabilidade'] },
  { id: 45, sku: 'EE-PR09', name: 'Mini Teclado Sem Fio Iluminado Touchpad para Smart TV', category: 'projetores', cost: 38.00, sold: 1460, rating: 4.8, badge: 'PRATICIDADE', specs: ['Digite senhas na TV e Projetor em segundos', 'Retroiluminação LED em 3 cores', 'Bateria recarregável via USB'] },
  { id: 46, sku: 'EE-PR10', name: 'Transmissor HDMI Sem Fio Full HD 50m Plug & Play', category: 'projetores', cost: 158.00, sold: 390, rating: 4.9, badge: 'SEM CABOS', specs: ['Transmite imagem e som 1080p sem fios até 50m', 'Ideal para notebook, projetor e apresentações', 'Não precisa de Wi-Fi'] },
  { id: 47, sku: 'EE-PR11', name: 'Projetor Pôr do Sol Lâmpada Sunset RGB 16 Cores App', category: 'projetores', cost: 42.00, sold: 1110, rating: 4.8, badge: 'FOTOS & VÍDEOS', specs: ['Cria iluminação estética profissional para fotos/Reels', '16 tonalidades controladas por app ou controle', 'Haste metálica giratória 180°'] },
  { id: 48, sku: 'EE-PR12', name: 'Cabo HDMI 2.1 Ultra High Speed 8K 60Hz 2 Metros Trançado', category: 'projetores', cost: 34.00, sold: 980, rating: 4.9, badge: 'ALTA VELOCIDADE', specs: ['Largura de banda 48Gbps com HDR dinâmico', 'Conectores banhados a ouro 24K', 'Revestimento em nylon ultrarresistente'] },

  // 5. CARREGADORES & POWER BANKS (12 produtos)
  { id: 49, sku: 'EE-EN01', name: 'Carregador Turbo GaN 65W 3 Portas (2 USB-C + 1 USB-A)', category: 'energia', cost: 76.00, sold: 1680, rating: 4.9, badge: 'TECNOLOGIA GaN', specs: ['Carrega notebook, iPhone e Samsung juntos', 'Tecnologia Nitreto de Gálio não esquenta', 'Proteção inteligente contra sobrecarga'] },
  { id: 50, sku: 'EE-EN02', name: 'Power Bank MagSafe Magnético 10.000mAh Sem Fio 22.5W', category: 'energia', cost: 112.00, sold: 1390, rating: 4.9, badge: 'MAGNÉTICO', specs: ['Gruda firmemente na traseira do celular', 'Carregamento sem fio 15W + cabo turbo 22.5W', 'Display LED indicador de porcentagem'] },
  { id: 51, sku: 'EE-EN03', name: 'Estação Carregadora 3 em 1 Dobrável Celular + Watch + Fone', category: 'energia', cost: 118.00, sold: 920, rating: 4.9, badge: 'ORGANIZAÇÃO', specs: ['Carrega 3 dispositivos simultaneamente sem fios', 'Design dobrável cabe no bolso para viagens', 'Luz noturna suave integrada'] },
  { id: 52, sku: 'EE-EN04', name: 'Power Bank Gigante 20.000mAh Turbo PD 22.5W Display Digital', category: 'energia', cost: 124.00, sold: 1150, rating: 4.9, badge: '4 CARGAS COMPLETAS', specs: ['Capacidade real 20.000mAh aprovada em voos', 'Carrega 50% do celular em 25 minutos', '3 saídas simultâneas'] },
  { id: 53, sku: 'EE-EN05', name: 'Cabo Magnético Giratório 540° 3 em 1 (USB-C, Lightning, Micro)', category: 'energia', cost: 32.00, sold: 2240, rating: 4.8, badge: 'PROTEGE PORTA', specs: ['Conecta com uma mão no escuro via LED', 'Protege o conector do celular contra poeira e quebra', 'Nylon trançado reforçado'] },
  { id: 54, sku: 'EE-EN06', name: 'Cabo Turbo 100W USB-C com Visor Digital de Watts em Tempo Real', category: 'energia', cost: 38.00, sold: 1540, rating: 4.9, badge: 'VISOR DE WATTS', specs: ['Mostra exatamente quantos Watts estão carregando', 'Suporta carregamento ultrarrápido até 100W', 'Chip E-Marker de segurança'] },
  { id: 55, sku: 'EE-EN07', name: 'Filtro de Linha Inteligente Régua 4 Tomadas + 3 USB-C PD', category: 'energia', cost: 88.00, sold: 870, rating: 4.9, badge: 'MESA & SETUP', specs: ['Proteção contra surtos elétricos e raios', 'Portas USB turbo dispensam fontes extras', 'Cabo reforçado de 2 metros'] },
  { id: 56, sku: 'EE-EN08', name: 'Carregador Portátil Chaveiro Mini Power Bank 5000mAh', category: 'energia', cost: 54.00, sold: 1090, rating: 4.8, badge: 'EMERGÊNCIA', specs: ['Conector integrado dispensa levar cabos', 'Tamanho de um chaveiro para bolsa ou bolso', 'Versões USB-C ou Lightning'] },
  { id: 57, sku: 'EE-EN09', name: 'Carregador Solar Portátil 10.000mAh à Prova D’água + Lanterna', category: 'energia', cost: 98.00, sold: 610, rating: 4.8, badge: 'TRILHA & CAMPING', specs: ['Painel solar de emergência integrado', 'Lanterna LED dupla de alta potência', 'Revestimento emborrachado antichoque'] },
  { id: 58, sku: 'EE-EN10', name: 'Kit 4 Pilhas Recarregáveis AA 2600mAh USB-C Direto na Pilha', category: 'energia', cost: 56.00, sold: 940, rating: 4.9, badge: 'INOVAÇÃO', specs: ['Carrega direto com cabo USB-C sem carregador externo', 'Mais de 1.000 ciclos de recarga', 'Tensão constante 1.5V ideal para controles e mouses'] },
  { id: 59, sku: 'EE-EN11', name: 'Base Carregamento Rápido Sem Fio 15W Qi Slim Alumínio', category: 'energia', cost: 46.00, sold: 830, rating: 4.8, badge: 'MINIMALISTA', specs: ['Corpo ultrafino 6mm em alumínio anodizado', 'Detecção inteligente de objetos metálicos', 'Compatível com iPhone, Samsung e Xiaomi'] },
  { id: 60, sku: 'EE-EN12', name: 'Testador Medidor Digital USB-C Voltagem & Amperagem', category: 'energia', cost: 42.00, sold: 510, rating: 4.9, badge: 'TÉCNICO', specs: ['Mede tensão, corrente, potência e capacidade real', 'Tela IPS colorida de alta precisão', 'Ideal para testar cabos e carregadores'] },

  // 6. ACESSÓRIOS PARA CELULAR (12 produtos)
  { id: 61, sku: 'EE-CE01', name: 'Estabilizador Gimbal 3 Eixos Celular com Rastreamento Facial AI', category: 'celular', cost: 228.00, sold: 680, rating: 4.9, badge: 'VÍDEO PROFISSIONAL', specs: ['Estabilização motorizada sem tremores', 'Sensor AI segue seu rosto automaticamente sem app', 'Luz LED de preenchimento integrada'] },
  { id: 62, sku: 'EE-CE02', name: 'Bastão de Selfie Tripé 1.70m Bluetooth + Luz LED Dupla', category: 'celular', cost: 64.00, sold: 1490, rating: 4.9, badge: 'REELS & TIKTOK', specs: ['Altura extensível até 1,70 metro com base reforçada', 'Controle remoto Bluetooth destacável', 'Rotação 360° vertical e horizontal'] },
  { id: 63, sku: 'EE-CE03', name: 'Suporte Articulado Mesa Alumínio 360° Dobrável Celular/Tablet', category: 'celular', cost: 48.00, sold: 1720, rating: 4.9, badge: 'HOME OFFICE', specs: ['100% alumínio maciço com base antiderrapante', 'Altura e ângulo totalmente ajustáveis', 'Não tomba mesmo tocando na tela'] },
  { id: 64, sku: 'EE-CE04', name: 'Cooler Magnético Resfriador Semicondutor Celular Gamer', category: 'celular', cost: 72.00, sold: 960, rating: 4.9, badge: 'RESFRIA EM 5s', specs: ['Placa Peltier gela de verdade até 4°C', 'Evita queda de FPS em jogos pesados', 'LED RGB silencioso'] },
  { id: 65, sku: 'EE-CE05', name: 'Kit Lentes Profissionais 4 em 1 Celular (Macro, Grande Angular, Fisheye)', category: 'celular', cost: 58.00, sold: 740, rating: 4.8, badge: 'FOTOGRAFIA', specs: ['Vidro óptico HD sem distorção nas bordas', 'Clipe universal serve em qualquer smartphone', 'Estojo rígido de transporte incluso'] },
  { id: 66, sku: 'EE-CE06', name: 'Rastreador Smart Tag Localizador Chaves, Mala e Pet', category: 'celular', cost: 44.00, sold: 1580, rating: 4.8, badge: 'ANTI-PERDA', specs: ['Localização global via rede Find My / App', 'Alerta sonoro integrado de 85dB', 'Bateria substituível dura 1 ano'] },
  { id: 67, sku: 'EE-CE07', name: 'Controle Gamepad Bluetooth Telescópico para Celular Android/iOS', category: 'celular', cost: 116.00, sold: 890, rating: 4.9, badge: 'CONSOLE PORTÁTIL', specs: ['Analógicos Hall Effect sem drift', 'Compatível com Xbox Cloud, GeForce Now e emuladores', 'Encaixe firme para telas até 6.9"'] },
  { id: 68, sku: 'EE-CE08', name: 'Bolsa Capa Impermeável Flutuante IPX8 Praia & Piscina', category: 'celular', cost: 28.00, sold: 1920, rating: 4.8, badge: 'VERÃO & PRAIA', specs: ['Borda inflável faz o celular boiar na água', 'Touchscreen funciona perfeitamente debaixo d’água', 'Trava quádrupla hermética'] },
  { id: 69, sku: 'EE-CE09', name: 'Caneta Stylus Universal Ponta Fina Rejeição de Palma iPad/Android', category: 'celular', cost: 68.00, sold: 830, rating: 4.8, badge: 'ESTUDO & DESENHO', specs: ['Ponta POM de alta precisão sem atraso', 'Fixação magnética lateral', 'Carga rápida USB-C com 12h de uso'] },
  { id: 70, sku: 'EE-CE10', name: 'Hub Adaptador OTG 5 em 1 USB-C para HDMI, USB 3.0 e Cartão SD', category: 'celular', cost: 62.00, sold: 910, rating: 4.9, badge: 'PRODUTIVIDADE', specs: ['Espelha celular ou notebook na TV em 4K', 'Transfere arquivos em alta velocidade 5Gbps', 'Carregamento Pass-Through PD 100W'] },
  { id: 71, sku: 'EE-CE11', name: 'Luminária Ring Light Portátil Clipe Recarregável Selfie & Reunião', category: 'celular', cost: 36.00, sold: 1340, rating: 4.8, badge: 'ILUMINAÇÃO', specs: ['3 temperaturas de cor (Fria, Neutra, Quente)', 'Clipe universal para celular, notebook ou monitor', 'Bateria recarregável interna'] },
  { id: 72, sku: 'EE-CE12', name: 'Suporte Magnético Parede/Espelho Ventosa Vácuo Magsafe', category: 'celular', cost: 42.00, sold: 1120, rating: 4.8, badge: 'VIRAL ACADEMIA', specs: ['Fixa em espelhos, vidros, azulejos e painéis', 'Ímã N52 de altíssima retenção', 'Ideal para gravar treinos e receitas'] },

  // 7. SAÚDE, CUIDADOS & BEM-ESTAR (12 produtos)
  { id: 73, sku: 'EE-SA01', name: 'Pistola Massageadora Muscular Profissional 30 Velocidades + 6 Ponteiras', category: 'saude', cost: 114.00, sold: 1560, rating: 4.9, badge: 'ALÍVIO IMEDIATO', specs: ['Motor Brushless silencioso de alto torque', '6 cabeças intercambiáveis para cada grupo muscular', 'Maleta executiva inclusa'] },
  { id: 74, sku: 'EE-SA02', name: 'Irrigador Oral Bucal Portátil Jato D’água 4 Bicos Recarregável', category: 'saude', cost: 68.00, sold: 1790, rating: 4.9, badge: 'SAÚDE BUCAL', specs: ['Remove 99.9% da placa onde a escova não chega', 'Ideal para quem usa aparelho ortodôntico ou implante', 'Reservatório 300ml removível IPX7'] },
  { id: 75, sku: 'EE-SA03', name: 'Máquina Cortar Cabelo & Barba Vintage Dragão Metal Profissional', category: 'saude', cost: 46.00, sold: 2640, rating: 4.9, badge: 'RECORDE VENDAS', specs: ['Lâmina T em aço carbono com corte rente zero', 'Corpo todo em metal gravado com bateria 1200mAh', 'Acompanha 4 pentes, óleo e cabo USB'] },
  { id: 76, sku: 'EE-SA04', name: 'Balança Digital Bioimpedância Bluetooth App 18 Métricas Corporais', category: 'saude', cost: 74.00, sold: 1380, rating: 4.9, badge: 'FITNESS', specs: ['Mede peso, gordura corporal, massa muscular e IMC', 'Sincroniza via Bluetooth com celular (iOS/Android)', 'Vidro temperado resistente até 180kg'] },
  { id: 77, sku: 'EE-SA05', name: 'Massageador Cervical Pescoço & Ombros Aquecimento + Pulsos EMS', category: 'saude', cost: 82.00, sold: 1120, rating: 4.8, badge: 'RELAXAMENTO', specs: ['Compressa térmica morna 42°C alivia tensão', '6 modos de massagem profunda', 'Leve e sem fio para usar no trabalho ou sofá'] },
  { id: 78, sku: 'EE-SA06', name: 'Escova Elétrica Sônica 5 Modos + 4 Refis Temporizador Inteligente', category: 'saude', cost: 52.00, sold: 1290, rating: 4.9, badge: 'DENTES BRANCOS', specs: ['40.000 vibrações sônicas por minuto', 'Bateria dura até 45 dias com uma carga', 'Timer inteligente de 2 minutos'] },
  { id: 79, sku: 'EE-SA07', name: 'Barbeador Elétrico Mini Portátil Rotativo à Prova D’água USB-C', category: 'saude', cost: 48.00, sold: 1450, rating: 4.8, badge: 'BOLSO & VIAGEM', specs: ['Lâminas autoafiáveis de 6 folhas', 'Uso seco ou no banho IPX7', 'Cabe no bolso para retoques rápidos'] },
  { id: 80, sku: 'EE-SA08', name: 'Corretor de Postura Inteligente com Sensor de Vibração', category: 'saude', cost: 44.00, sold: 940, rating: 4.7, badge: 'COLUNA SAUDÁVEL', specs: ['Vibra suavemente sempre que você curva as costas', 'Contador digital de desvios no visor', 'Alças elásticas invisíveis sob a roupa'] },
  { id: 81, sku: 'EE-SA09', name: 'Garrafa Térmica Inteligente Inox 500ml Termômetro LED Touch', category: 'saude', cost: 38.00, sold: 2180, rating: 4.9, badge: 'BEST SELLER', specs: ['Mostra a temperatura exata da bebida na tampa', 'Aço inox 304 parede dupla mantém gelado por 24h', 'Bateria interna dura anos sem precisar carregar'] },
  { id: 82, sku: 'EE-SA10', name: 'Aparador de Pelos Nariz, Orelha e Sobrancelha 3 em 1 Recarregável', category: 'saude', cost: 36.00, sold: 1310, rating: 4.8, badge: 'CUIDADO DIÁRIO', specs: ['Sistema rotativo indolor sem puxar fios', 'Cabeças laváveis em água corrente', 'Recarregável via USB'] },
  { id: 83, sku: 'EE-SA11', name: 'Massageador Ocular Térmico Bluetooth Música Alívio Enxaqueca', category: 'saude', cost: 118.00, sold: 520, rating: 4.9, badge: 'BEM-ESTAR', specs: ['Compressão de ar + aquecimento relaxante', 'Conecta no Bluetooth para ouvir músicas calmas', 'Dobrável 180° com estojo'] },
  { id: 84, sku: 'EE-SA12', name: 'Oxímetro de Pulso Digital OLED + Frequência Cardíaca', category: 'saude', cost: 34.00, sold: 1080, rating: 4.9, badge: 'ESSENCIAL CASA', specs: ['Leitura rápida e precisa em 5 segundos', 'Tela OLED bicolor de fácil visualização', 'Desligamento automático'] },

  // 8. AUTOMOTIVO & MOBILIDADE (12 produtos)
  { id: 85, sku: 'EE-AT01', name: 'Central Multimídia Portátil 7" CarPlay & Android Auto Sem Fio', category: 'automotivo', cost: 196.00, sold: 1180, rating: 4.9, badge: 'UPGRADE CARRO', specs: ['Instala no painel em 2 minutos sem mexer na elétrica', 'Waze, Google Maps e Spotify sem fio na tela HD', 'Entrada para câmera de ré inclusa'] },
  { id: 86, sku: 'EE-AT02', name: 'Compressor de Ar Portátil Digital Sem Fio Pneu Carro, Moto e Bike', category: 'automotivo', cost: 108.00, sold: 1740, rating: 4.9, badge: 'ITEM OBRIGATÓRIO', specs: ['Enche pneu de carro em 3 minutos e desliga sozinho na calibragem', 'Funciona também como Power Bank e Lanterna SOS', 'Visor digital de PSI/BAR em tempo real'] },
  { id: 87, sku: 'EE-AT03', name: 'Aspirador de Pó Automotivo Sem Fio Alta Sucção 12000Pa + Soprador', category: 'automotivo', cost: 78.00, sold: 1590, rating: 4.9, badge: '2 EM 1', specs: ['Aspira sujeira pesada e sopra poeira de cantos', 'Filtro HEPA lavável reutilizável', 'Carregamento rápido USB-C'] },
  { id: 88, sku: 'EE-AT04', name: 'Câmera Veicular Dash Cam Full HD 1080p Gravação Loop & Visão Noturna', category: 'automotivo', cost: 94.00, sold: 930, rating: 4.8, badge: 'PROVA DE TRÂNSITO', specs: ['Grava todo o trajeto automaticamente ao ligar o carro', 'Sensor G bloqueia o vídeo em caso de colisão', 'Lente grande angular 170°'] },
  { id: 89, sku: 'EE-AT05', name: 'Suporte Veicular Magnético Magsafe Giratório 360° Painel/Saída Ar', category: 'automotivo', cost: 44.00, sold: 1840, rating: 4.9, badge: 'FIRMEZA TOTAL', specs: ['Não solta em lombadas nem estradas de terra', 'Encaixe magnético instantâneo com uma mão', 'Braço metálico dobrável'] },
  { id: 90, sku: 'EE-AT06', name: 'Auxiliar de Partida Chupeta Portátil Jump Starter 12V + Power Bank', category: 'automotivo', cost: 178.00, sold: 670, rating: 4.9, badge: 'SALVA VIDAS', specs: ['Liga carro com bateria arriada em segundos', 'Garras inteligentes à prova de inversão de polaridade', 'Saídas USB turbo para celulares'] },
  { id: 91, sku: 'EE-AT07', name: 'Scanner Automotivo OBD2 Bluetooth Diagnóstico Erros no Celular', category: 'automotivo', cost: 38.00, sold: 1410, rating: 4.8, badge: 'ECONOMIA MECÂNICO', specs: ['Lê e apaga luz da injeção eletrônica pelo app', 'Mostra temperatura real, consumo e sensores', 'Compatível com carros flex/gasolina a partir de 2010'] },
  { id: 92, sku: 'EE-AT08', name: 'Carregador Veicular Turbo 66W Display Voltagem Bateria + Cabo Retrátil', category: 'automotivo', cost: 48.00, sold: 1260, rating: 4.9, badge: 'PRÁTICO', specs: ['Cabos retráteis embutidos de 80cm sem bagunça', 'Monitora a saúde da bateria do carro no visor', 'Carregamento ultrarrápido'] },
  { id: 93, sku: 'EE-AT09', name: 'Adaptador CarPlay & Android Auto Sem Fio Dongle USB Plug & Play', category: 'automotivo', cost: 92.00, sold: 880, rating: 4.9, badge: 'SEM CABO USB', specs: ['Converte multimídia original com cabo em sem fio', 'Conexão automática em 5 segundos ao entrar no carro', 'Ultra compacto e discreto'] },
  { id: 94, sku: 'EE-AT10', name: 'Head-Up Display HUD Velocímetro Digital GPS no Para-brisa', category: 'automotivo', cost: 76.00, sold: 640, rating: 4.8, badge: 'TECNOLOGIA', specs: ['Projeta velocidade e alerta de radar sem tirar os olhos da pista', 'Funciona via satélite GPS em qualquer veículo', 'Brilho automático dia e noite'] },
  { id: 95, sku: 'EE-AT11', name: 'Kit Lavadora Alta Pressão Portátil Sem Fio 48V Bateria Dupla', category: 'automotivo', cost: 164.00, sold: 790, rating: 4.8, badge: 'LAVA RÁPIDO CASA', specs: ['Puxa água de qualquer balde, galão ou torneira', 'Acompanha 2 baterias de longa duração + canhão espuma', 'Ideal para carros, motos, quintal e ar-condicionado'] },
  { id: 96, sku: 'EE-AT12', name: 'Aromatizador Automotivo Inteligente Liga/Desliga com o Carro', category: 'automotivo', cost: 56.00, sold: 950, rating: 4.8, badge: 'CARRO CHEIROSO', specs: ['Sensor de vibração ativa o perfume ao dirigir', 'Corpo em alumínio aeroespacial com LED ambiente', 'Recarregável via USB-C'] },

  // 9. GAMER, PC & SETUP (12 produtos)
  { id: 97, sku: 'EE-GM01', name: 'Teclado Mecânico Gamer 60% RGB Hot-Swappable Switch Red', category: 'gamer', cost: 138.00, sold: 1340, rating: 4.9, badge: 'SETUP PRO', specs: ['Switches mecânicos lineares rápidos e silenciosos', '18 modos de iluminação RGB programáveis', 'Cabo USB-C destacável e teclas Double-Shot'] },
  { id: 98, sku: 'EE-GM02', name: 'Mouse Gamer Sem Fio Ultraleve 58g Sensor 26.000 DPI Tri-Mode', category: 'gamer', cost: 118.00, sold: 1120, rating: 4.9, badge: 'ULTRALEVE', specs: ['Conexão 2.4GHz sem atraso, Bluetooth ou Cabo', 'Peso pena de apenas 58 gramas para mira precisa', 'Bateria para 70 horas de jogo'] },
  { id: 99, sku: 'EE-GM03', name: 'Light Bar Luminária Monitor LED Anti-Reflexo Touch Setup', category: 'gamer', cost: 86.00, sold: 1210, rating: 4.9, badge: 'CONFORTO VISUAL', specs: ['Ilumina a mesa sem gerar reflexo na tela do monitor', 'Ajuste contínuo de brilho e temperatura de cor', 'Alimenta direto na USB do PC'] },
  { id: 100, sku: 'EE-GM04', name: 'Headset Gamer Surround 7.1 RGB Microfone Cancelamento Ruído', category: 'gamer', cost: 104.00, sold: 1480, rating: 4.9, badge: 'ÁUDIO POSICIONAL', specs: ['Drivers 50mm ouça passos com precisão', 'Arco autoajustável ultraleve', 'Compatível com PC, PS4, PS5, Xbox e Switch'] },
  { id: 101, sku: 'EE-GM05', name: 'Mousepad Gamer Extra Grande 80x30cm RGB Bordas Costuradas', category: 'gamer', cost: 54.00, sold: 1790, rating: 4.9, badge: 'DESKMAT RGB', specs: ['Cobre teclado e mouse com superfície Speed', '14 modos de iluminação LED na borda', 'Base emborrachada antiderrapante'] },
  { id: 102, sku: 'EE-GM06', name: 'Microfone Condensador USB Estúdio Podcast & Live RGB + Braço', category: 'gamer', cost: 128.00, sold: 860, rating: 4.9, badge: 'STREAMING', specs: ['Captação cardioide cristalina sem ruído de fundo', 'Botão Mute Touch no topo + controle de ganho', 'Plug & Play no PC, Mac e PS5'] },
  { id: 103, sku: 'EE-GM07', name: 'Controle Sem Fio Hall Effect Multiplataforma PC, Switch, Android', category: 'gamer', cost: 122.00, sold: 940, rating: 4.9, badge: 'ZERO DRIFT', specs: ['Gatilhos e analógicos magnéticos Hall Effect', 'Botões traseiros programáveis + Turbo', 'Vibração dupla ajustável'] },
  { id: 104, sku: 'EE-GM08', name: 'Webcam Full HD 1080p 60FPS Autofoco + Tampa Privacidade', category: 'gamer', cost: 84.00, sold: 1030, rating: 4.8, badge: 'REUNIÃO & LIVE', specs: ['Imagem nítida 60 quadros por segundo', 'Microfone duplo estéreo integrado', 'Tampa física deslizante de privacidade'] },
  { id: 105, sku: 'EE-GM09', name: 'SSD Externo Portátil NVMe Alta Velocidade 1TB USB 3.2 Bolso', category: 'gamer', cost: 218.00, sold: 620, rating: 4.9, badge: 'VELOCIDADE EXTREMA', specs: ['Leitura até 1050MB/s — transfere filmes em segundos', 'Corpo metálico dissipador de calor resistente a quedas', 'Acompanha cabo USB-C e USB-A'] },
  { id: 106, sku: 'EE-GM10', name: 'Suporte Headset Gamer RGB + Hub 2 Portas USB Integrado', category: 'gamer', cost: 64.00, sold: 890, rating: 4.8, badge: 'ORGANIZA SETUP', specs: ['Base iluminada RGB com botão touch', '2 portas USB extras na base para pendrive ou mouse', 'Base pesada antiderrapante'] },
  { id: 107, sku: 'EE-GM11', name: 'Base Cooler Notebook Gamer 6 Ventoinhas Silenciosas + Display', category: 'gamer', cost: 88.00, sold: 970, rating: 4.8, badge: 'RESFRIAMENTO', specs: ['6 coolers de alta rotação com ajuste de velocidade', '7 níveis de inclinação ergonômica', 'Suporte frontal para celular incluso'] },
  { id: 108, sku: 'EE-GM12', name: 'Mini Teclado Macro Programável 6 Teclas + Knob Volume RGB', category: 'gamer', cost: 78.00, sold: 740, rating: 4.9, badge: 'ATALHOS PRO', specs: ['Configure atalhos para edição de vídeo, jogos ou trabalho', 'Botão giratório metálico para volume e zoom', 'Memória interna salva as macros'] }
];

// Aplica automaticamente a margem de 50% em cima do custo AliExpress em todos os 108 produtos
window.PRODUCTS = RAW_ALIEXPRESS_CATALOG.map((item) => {
  const sellingPrice = Number((item.cost * 1.5).toFixed(2));
  const originalPrice = Number((sellingPrice * 1.28).toFixed(2));
  const fullItem = {
    ...item,
    price: sellingPrice,
    originalPrice,
    stock: 45 + (item.id % 40),
    description: `${item.name} — Produto validado e testado pela equipe técnica da EletroExpress (eletroexpress.app.br). ${item.specs.join('. ')}. Envio rápido com código de rastreamento para todo o Brasil e garantia de 90 dias.`,
    videoDuration: `0:${38 + (item.id % 21)}`
  };
  fullItem.images = window.generateProductImages(fullItem);
  return fullItem;
});