import { useState, useEffect, useRef, useCallback } from 'react';

// --- IMAGES ---
const ANNA_PHOTO_1 = '/fotos/foto1.png';   
const STUDIO_PHOTO = '/fotos/studio1.jpg';   
const ANNA_VIDEO   = '/videos/video1.mp4'; 
const DESKTOP_VIDEO = '/videos/videodesktop.mp4';

const serviceCategories = [
  {
    category: 'Extensão de Cílios',
    items: [
      { name: 'Fio a Fio', desc: 'Alongamento clássico fio por fio, valorizando o olhar com naturalidade extrema.' },
      { name: 'Volume Brasileiro', desc: 'Fios em formato de Y para volume leve, maciez e excelente durabilidade.' },
      { name: 'Volume Egípcio', desc: 'Técnica com fios W que proporciona volume intermediário e textura marcante.' },
      { name: 'Fox Eyes', desc: 'Alongamento estratégico com curvatura que alonga o canto externo para efeito gateado.' },
    ]
  },
  {
    category: 'Sobrancelhas',
    items: [
      { name: 'Design Personalizado', desc: 'Estudo das proporções faciais para desenhar a sobrancelha ideal para o seu rosto.' },
      { name: 'Design com Henna', desc: 'Preenchimento e definição com pigmento natural de alta qualidade para cobertura impecável.' },
      { name: 'Brow Lamination', desc: 'Alinhamento e nutrição dos fios naturais, criando um efeito encorpado e moderno.' },
    ]
  },
  {
    category: 'Serviços Extras',
    items: [
      { name: 'Tintura de Sobrancelhas', desc: 'Coloração dos fios naturais com tintura específica, ideal para cobrir brancos.' },
      { name: 'Spa das Sobrancelhas', desc: 'Protocolo de cuidados com argiloterapia, esfoliação e hidratação dos fios.' },
      { name: 'Remoção de Extensão de Cílios', desc: 'Retirada segura do alongamento antigo com removedor profissional, sem danificar os fios naturais.' },
      { name: 'Manutenção de Alongamento', desc: 'Reposição dos fios crescidos para manter o volume e o alinhamento das extensões.' },
    ]
  }
];

function useStaggeredReveal(_count: number, threshold = 0.15, ready = true) {
  const [visible, setVisible] = useState(false);
  const nodeRef = useRef<HTMLElement | null>(null);
  const setRef = useCallback((el: HTMLElement | null) => { nodeRef.current = el; }, []);

  useEffect(() => {
    if (!ready) return;
    const el = nodeRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, ready]);

  const getAnimStyle = (i: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.98)',
    transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 150}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 150}ms`,
  });

  const getTextRevealStyle = (i: number): React.CSSProperties => ({
    display: 'block',
    transform: visible ? 'translateY(0)' : 'translateY(100%)',
    transition: `transform 1.2s cubic-bezier(0.16,1,0.3,1) ${i * 150}ms`,
  });

  return { setRef, getAnimStyle, getTextRevealStyle };
}

function useParallax(speed = -0.08) {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      const elementTop = rect.top + scrolled;
      const viewportHeight = window.innerHeight;
      
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const relativeScroll = scrolled - (elementTop - viewportHeight);
        setOffset(relativeScroll * speed);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { ref, style: { transform: `translateY(${offset}px)` } };
}

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'blink' | 'opening' | 'done'>('loading');
  const cb = useRef(onComplete); cb.current = onComplete;

  useEffect(() => {
    let c = 0;
    const t = setInterval(() => {
      const increment = c > 85 ? 2 : 4;
      c += increment;
      if (c > 100) c = 100;
      setCount(c);
      if (c >= 100) {
        clearInterval(t);
        setTimeout(() => setPhase('blink'), 200);
        setTimeout(() => setPhase('loading'), 350);
        setTimeout(() => {
          setPhase('opening');
          cb.current(); // Inicia a animação das frases do site junto com a abertura do olho
        }, 500);
        setTimeout(() => setPhase('done'), 1800);
      }
    }, 15);
    return () => clearInterval(t);
  }, []);

  const isOpen = phase === 'opening';
  const isBlink = phase === 'blink';

  // Controle da abertura vertical das pálpebras (porcentagem do eixo Y da elipse)
  const upperY = isOpen ? '0%' : isBlink ? '48%' : '50%';
  const lowerY = isOpen ? '0%' : isBlink ? '48%' : '50%';

  return (
    <>
      {phase !== 'done' && (
        <div className="fixed inset-0 z-[100]" style={{ pointerEvents: phase === 'opening' ? 'none' : 'auto' }}>

          {/* ===== CAMADA CENTRAL: Íris + Pupila do Olho (visível durante loading e blink) ===== */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101]"
            style={{
              opacity: isOpen ? 0 : 1,
              transform: `translate(-50%, -50%) scale(${isOpen ? 1.5 : 1})`,
              transition: 'opacity 0.6s ease, transform 1s ease',
            }}
          >
            <svg width="120" height="120" viewBox="0 0 120 120" className="animate-pulse-slow">
              {/* Íris externa */}
              <circle cx="60" cy="60" r="55" fill="none" stroke="rgba(212,175,55,0.08)" strokeWidth="1" />
              <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(212,175,55,0.12)" strokeWidth="0.5" />
              {/* Íris dourada com gradiente */}
              <defs>
                <radialGradient id="irisGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F3E5AB" stopOpacity="0.3" />
                  <stop offset="40%" stopColor="#D4AF37" stopOpacity="0.15" />
                  <stop offset="70%" stopColor="#AA7C11" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="60" cy="60" r="38" fill="url(#irisGrad)" />
              {/* Fibras da íris */}
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i * 15) * (Math.PI / 180);
                const x1 = 60 + Math.cos(angle) * 16;
                const y1 = 60 + Math.sin(angle) * 16;
                const x2 = 60 + Math.cos(angle) * 36;
                const y2 = 60 + Math.sin(angle) * 36;
                return (
                  <line key={`iris-fiber-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(212,175,55,0.06)" strokeWidth="0.5" />
                );
              })}
              {/* Pupila */}
              <circle cx="60" cy="60" r="12" fill="rgba(10,9,8,0.7)" />
              {/* Reflexo da pupila */}
              <circle cx="52" cy="53" r="3" fill="rgba(243,229,171,0.25)" />
            </svg>
          </div>

          {/* ===== PÁLPEBRA SUPERIOR ===== */}
          <div
            className="absolute inset-0 bg-lux-darker z-[102]"
            style={{
              clipPath: `ellipse(150% ${upperY} at 50% 0%)`,
              transition: isBlink
                ? 'clip-path 0.12s ease-in'
                : isOpen
                  ? 'clip-path 1.3s cubic-bezier(0.22, 1, 0.36, 1)'
                  : 'clip-path 0.15s ease-out',
            }}
          >
            {/* Linha da pálpebra (delineador dourado sutil) */}
            <div
              className="absolute bottom-0 left-0 w-full h-[1px]"
              style={{
                background: 'linear-gradient(to right, transparent 10%, rgba(212,175,55,0.3) 30%, rgba(212,175,55,0.5) 50%, rgba(212,175,55,0.3) 70%, transparent 90%)',
              }}
            />

            {/* Cílios Superiores - SVG curvos orgânicos */}
            <svg
              className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 overflow-visible"
              width="400" height="60" viewBox="0 0 400 60"
              style={{ opacity: isOpen ? 0 : 1, transition: 'opacity 0.5s ease' }}
            >
              {Array.from({ length: 50 }).map((_, i) => {
                const x = 40 + i * 6.5;
                const dist = Math.abs(x - 200);
                const len = Math.max(10, 45 - dist * 0.18);
                const curve = (x - 200) * 0.15;
                const thickness = dist < 60 ? 1.2 : 0.8;
                return (
                  <path
                    key={`lash-${i}`}
                    d={`M ${x} 0 Q ${x + curve * 0.5} ${len * 0.5} ${x + curve} ${len}`}
                    stroke="rgba(212,175,55,0.35)"
                    strokeWidth={thickness}
                    fill="none"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
          </div>

          {/* ===== PÁLPEBRA INFERIOR ===== */}
          <div
            className="absolute inset-0 bg-lux-darker z-[102]"
            style={{
              clipPath: `ellipse(150% ${lowerY} at 50% 100%)`,
              transition: isBlink
                ? 'clip-path 0.12s ease-in'
                : isOpen
                  ? 'clip-path 1.3s cubic-bezier(0.22, 1, 0.36, 1)'
                  : 'clip-path 0.15s ease-out',
            }}
          >
            {/* Linha da pálpebra inferior */}
            <div
              className="absolute top-0 left-0 w-full h-[1px]"
              style={{
                background: 'linear-gradient(to right, transparent 15%, rgba(212,175,55,0.2) 35%, rgba(212,175,55,0.35) 50%, rgba(212,175,55,0.2) 65%, transparent 85%)',
              }}
            />

            {/* Cílios Inferiores - SVG curvos menores */}
            <svg
              className="absolute top-[-1px] left-1/2 -translate-x-1/2 overflow-visible"
              width="300" height="25" viewBox="0 0 300 25"
              style={{ opacity: isOpen ? 0 : 1, transition: 'opacity 0.5s ease' }}
            >
              {Array.from({ length: 35 }).map((_, i) => {
                const x = 30 + i * 7;
                const dist = Math.abs(x - 150);
                const len = Math.max(5, 18 - dist * 0.1);
                const curve = (x - 150) * 0.08;
                return (
                  <path
                    key={`lash-b-${i}`}
                    d={`M ${x} 0 Q ${x + curve * 0.5} ${-len * 0.5} ${x + curve} ${-len}`}
                    stroke="rgba(212,175,55,0.2)"
                    strokeWidth="0.6"
                    fill="none"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
          </div>

          {/* ===== CONTEÚDO DO CARREGADOR ===== */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center z-[103]"
            style={{
              opacity: isOpen ? 0 : 1,
              transition: 'opacity 0.4s ease',
            }}
          >
            {/* Partículas douradas */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              {Array.from({ length: 12 }).map((_, idx) => {
                const size = 1.2 + (idx % 3) * 0.8;
                const left = 8 + (idx * 7.5) % 84;
                const top = 15 + (idx * 11) % 70;
                return (
                  <div
                    key={idx}
                    className="absolute bg-lux-goldLight/20 rounded-full animate-float-particle"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      left: `${left}%`,
                      top: `${top}%`,
                      animationDelay: `${idx * 0.4}s`,
                      animationDuration: `${8 + (idx % 4) * 2}s`,
                    }}
                  />
                );
              })}
            </div>

            {/* Anel giratório sutil */}
            <div className="absolute w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-full border border-lux-gold/5 z-0" />
            <div className="absolute w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-full border-t border-r border-lux-gold/15 animate-spin z-0" style={{ animationDuration: '8s' }} />

            {/* Marca */}
            <div className="flex flex-col items-center mb-10 relative z-10 select-none animate-float">
              <span className="font-serif text-4xl md:text-5xl lg:text-6xl text-white tracking-[0.25em] leading-none font-bold">ANNA</span>
              <span className="font-serif text-3xl md:text-4xl lg:text-5xl italic text-lux-goldLight tracking-wide -mt-1">Beauty</span>
              <div className="flex items-center gap-2 mt-4">
                <div className="w-6 h-[1px] bg-lux-gold/30"></div>
                <span className="text-[8px] md:text-[9px] tracking-[0.4em] uppercase text-lux-gold/60 font-light">Estúdio de Beleza</span>
                <div className="w-6 h-[1px] bg-lux-gold/30"></div>
              </div>
            </div>

            {/* Barra de Carregamento */}
            <div className="w-48 md:w-56 flex flex-col items-center gap-3 relative z-10">
              <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-lux-goldLight via-lux-gold to-lux-goldLight transition-all duration-100 ease-out"
                  style={{ width: `${count}%` }}
                />
              </div>
              <div className="flex items-center gap-1 font-serif text-[10px] md:text-xs text-lux-goldLight/70 tracking-[0.2em] uppercase font-light">
                <span>Aguarde</span>
                <span className="font-bold text-lux-gold tabular-nums">{count}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const navLinks = [
    { label: 'Início', href: '#início' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Cursos', href: '#cursos' },
    { label: 'Serviços', href: '#serviços' },
    { label: 'Local', href: '#localizacao' }
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent ${scrolled ? 'bg-lux-light/80 backdrop-blur-lg border-lux-gold/20 py-4 shadow-[0_4px_30px_rgba(212,175,55,0.05)]' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex flex-col cursor-pointer group">
            <span className={`font-serif text-2xl md:text-3xl font-bold tracking-tight leading-none transition-all duration-500 ${scrolled ? 'text-lux-gold' : 'text-white'}`}>Anna</span>
            <span className={`font-serif text-2xl md:text-3xl italic tracking-tight leading-none -mt-1 transition-all duration-500 group-hover:text-lux-goldLight ${scrolled ? 'text-[#AA7C11]' : 'text-lux-goldLight'}`}>Beauty</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map(l => (
               <a key={l.label} href={l.href} className={`text-sm tracking-widest uppercase transition-all duration-300 hover:-translate-y-0.5 ${scrolled ? 'text-lux-dark/80 hover:text-lux-gold' : 'text-white/80 hover:text-lux-goldLight'}`}>{l.label}</a>
            ))}
            <a href="https://anna-beauty.vercel.app/" target="_blank" rel="noopener noreferrer" className={`relative overflow-hidden px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-500 border group ${scrolled ? 'bg-lux-gold text-lux-darker border-lux-gold hover:bg-[#AA7C11]' : 'bg-transparent text-white border-lux-gold hover:bg-lux-gold hover:text-lux-darker hover:border-lux-gold'}`}>
              <span className="relative z-10">Agende aqui</span>
            </a>
          </div>

          <button className={`md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 relative z-[60]`} onClick={() => setIsOpen(o => !o)}>
            <span className={`h-0.5 w-6 transition-all duration-300 ${scrolled || isOpen ? 'bg-lux-gold' : 'bg-lux-goldLight'} ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`h-0.5 w-6 transition-all duration-300 ${scrolled || isOpen ? 'bg-lux-gold' : 'bg-lux-goldLight'} ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`h-0.5 w-6 transition-all duration-300 ${scrolled || isOpen ? 'bg-lux-gold' : 'bg-lux-goldLight'} ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 z-40 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-lux-darker/60 backdrop-blur-md transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsOpen(false)} />
        
        {/* Painel do Menu com fundo Branco/Claro */}
        <div className={`absolute top-0 right-0 h-full w-[85%] bg-lux-light shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-lux-gold/5 via-lux-light to-lux-light pointer-events-none" />
          
          <div className="flex flex-col justify-center h-full px-10 gap-8 relative z-10">
            {navLinks.map((l, i) => (
              <a key={l.label} href={l.href} onClick={() => setIsOpen(false)}
                className="font-serif text-4xl text-lux-dark hover:text-lux-gold transition-colors relative group w-max"
                style={{ opacity: isOpen ? 1 : 0, transform: isOpen ? 'translateX(0)' : 'translateX(32px)', transition: `all 500ms cubic-bezier(0.76,0,0.24,1) ${100 + i * 60}ms` }}>
                <span className="relative z-10">{l.label}</span>
                <span className="absolute left-0 bottom-1 w-0 h-[1px] bg-lux-gold transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            
            <a href="https://anna-beauty.vercel.app/" target="_blank" rel="noopener noreferrer" 
              className="mt-8 px-10 py-4 bg-lux-gold text-white font-bold rounded-full border border-lux-gold text-sm tracking-widest uppercase text-center w-full sm:w-max shadow-[0_4px_25px_rgba(212,175,55,0.3)]"
              style={{ opacity: isOpen ? 1 : 0, transition: `all 500ms ease 400ms` }}>
              Agende aqui
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

function HeroSection({ ready }: { ready: boolean }) {
  const { setRef, getAnimStyle } = useStaggeredReveal(4, 0.1, ready);

  return (
    <section id="início" ref={setRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-lux-darker">
      <div className="absolute inset-0 w-full h-full bg-lux-darker">
        {/* Vídeo para Mobile (Vertical) */}
        <video src={ANNA_VIDEO} autoPlay muted loop playsInline className="block lg:hidden w-full h-full object-cover object-center" />
        
        {/* Vídeo para Desktop (Horizontal) */}
        <video src={DESKTOP_VIDEO} autoPlay muted loop playsInline className="hidden lg:block w-full h-full object-cover object-center scale-[1.15] animate-[pulse_20s_ease-in-out_infinite]" />
        
        {/* Máscara escura para legibilidade do texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-lux-darker/70 via-lux-darker/40 to-lux-darker/80 z-20 pointer-events-none" /> 
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-lux-darker/95 via-lux-darker/60 to-transparent z-20 pointer-events-none" />
      </div>
      
      {/* Decorative floating elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-lux-gold/10 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-lux-goldLight/10 rounded-full blur-[120px] animate-pulse-slow" />
      
      <div className="relative z-30 text-center lg:text-left px-6 max-w-7xl mx-auto w-full h-full flex flex-col justify-center items-center lg:items-start pt-16">
        <h1 className="font-serif text-white text-[3.5rem] md:text-[5.5rem] lg:text-[6.5rem] leading-[1.1] mb-8 text-balance drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] max-w-3xl" style={getAnimStyle(1)}>
          A Arte de um <br/> <span className="italic text-lux-goldLight drop-shadow-[0_2px_15px_rgba(212,175,55,0.4)]">Olhar Perfeito</span>
        </h1>
        
        <p className="text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] max-w-lg mb-10 text-sm md:text-base font-light" style={getAnimStyle(2)}>
          Experimente o mais alto padrão em lash design, onde cada detalhe é pensado para realçar a sua beleza autêntica.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-max mt-12 md:mt-0" style={getAnimStyle(3)}>
          <a href="https://anna-beauty.vercel.app/" target="_blank" rel="noopener noreferrer" className="relative group px-6 py-2.5 md:px-8 md:py-3 bg-transparent border border-lux-gold text-lux-goldLight rounded-full text-[10px] md:text-xs font-semibold tracking-widest uppercase overflow-hidden transition-all duration-500 shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] w-[80%] max-w-[220px] sm:max-w-none sm:w-auto text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-lux-gold to-lux-goldLight translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 group-hover:text-lux-darker transition-colors duration-500">Agendar</span>
          </a>
          <a href="#cursos" className="relative group px-6 py-2.5 md:px-8 md:py-3 bg-transparent border border-lux-gold text-lux-goldLight rounded-full text-[10px] md:text-xs font-semibold tracking-widest uppercase overflow-hidden transition-all duration-500 shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] w-[80%] max-w-[220px] sm:max-w-none sm:w-auto text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-lux-gold to-lux-goldLight translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 group-hover:text-lux-darker transition-colors duration-500">Cursos</span>
          </a>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-lux-gold animate-float">
        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-lux-gold to-transparent" />
      </div>
    </section>
  );
}

function AboutSection({ ready }: { ready: boolean }) {
  const { setRef, getAnimStyle, getTextRevealStyle } = useStaggeredReveal(2, 0.2, ready);
  const parallax = useParallax(-0.06);

  return (
    <section id="sobre" ref={setRef} className="relative w-full py-24 md:py-40 bg-lux-light overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -left-40 top-20 w-96 h-96 bg-lux-gold/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16 md:gap-24 relative z-10">
        
        <div className="w-full md:w-5/12" style={getAnimStyle(0)}>
          {/* Container principal sem overflow-hidden para os elementos saírem da borda */}
          <div className="relative aspect-[3/4] w-full max-w-md mx-auto md:mr-auto group">
            
            {/* Molde dourado de fundo (deslocado para fora) */}
            <div className="absolute inset-0 bg-lux-gold/15 translate-x-6 translate-y-6 rounded-t-[120px] rounded-b-[40px] transition-transform duration-700 group-hover:translate-x-8 group-hover:translate-y-8 z-0 shadow-md" />
            
            {/* Wrapper da imagem com overflow-hidden para o efeito parallax */}
            <div ref={parallax.ref} className="relative w-full h-full overflow-hidden rounded-t-[120px] rounded-b-[40px] z-10 shadow-2xl transition-transform duration-700 group-hover:-translate-y-2 group-hover:-translate-x-2">
              <img 
                src={ANNA_PHOTO_1} 
                alt="Anna Beauty" 
                style={parallax.style} 
                className="relative z-10 w-full h-[120%] -top-[10%] object-cover object-top rounded-t-[120px] rounded-b-[40px] grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 scale-110" 
              />
            </div>
            
            {/* Selo giratório posicionado completamente fora do molde */}
            <div className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full border border-lux-gold/40 flex items-center justify-center p-2 bg-lux-light/95 backdrop-blur-sm z-20 shadow-[0_15px_30px_rgba(212,175,55,0.15)] group-hover:scale-110 transition-transform duration-500">
              <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_15s_linear_infinite]">
                <path id="curve" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                <text className="text-[11.5px] font-bold tracking-widest uppercase fill-lux-gold"><textPath href="#curve">Anna Beauty • Especialista •</textPath></text>
              </svg>
            </div>
          </div>
        </div>

        <div className="w-full md:w-7/12">
          <span className="text-lux-gold tracking-[0.2em] uppercase text-xs font-bold block mb-4 flex items-center gap-3" style={getAnimStyle(0)}>
            <span className="w-8 h-[1px] bg-lux-gold"></span> Sobre Mim
          </span>
          <div className="overflow-hidden mb-8">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#AA7C11] to-[#F3E5AB] animate-shimmer leading-[1.1]" style={{ ...getTextRevealStyle(1), transition: 'transform 2.8s cubic-bezier(0.16, 1, 0.3, 1) 300ms', backgroundSize: '200% auto' }}>
              Elevando a sua autoestima através de um <span className="italic text-lux-dark">olhar sob medida.</span>
            </h2>
          </div>
          <div className="space-y-6 text-lux-gray text-base md:text-lg max-w-xl font-light" style={getAnimStyle(2)}>
            <p>Com anos de experiência e dedicação exclusiva ao Lash Design, desenvolvi técnicas que unem naturalidade, saúde dos fios e um acabamento impecável.</p>
            <p>Meu propósito não é apenas alongar cílios, mas sim realçar a beleza única de cada mulher que senta na minha maca, proporcionando um momento de cuidado e puro luxo.</p>
          </div>
          <button className="mt-12 group flex items-center gap-4 text-lux-dark font-bold tracking-[0.2em] uppercase text-xs hover:text-lux-gold transition-colors" style={getAnimStyle(3)}>
            <span>Conheça Minha Trajetória</span>
            <div className="w-12 h-[1px] bg-lux-dark transition-all duration-300 group-hover:w-20 group-hover:bg-lux-gold" />
          </button>
        </div>

      </div>
    </section>
  );
}

function CoursesSection({ ready }: { ready: boolean }) {
  const { setRef, getAnimStyle } = useStaggeredReveal(3, 0.2, ready);

  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement("script");
    script.src = "//www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <section id="cursos" ref={setRef} className="relative w-full py-24 md:py-32 bg-lux-darker overflow-hidden text-white">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
      <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-lux-gold/10 rounded-full blur-[150px] animate-pulse-slow" />

      {/* Video de fundo no canto esquerdo */}
      <div className="absolute left-0 top-0 h-full w-full lg:w-[50%] opacity-20 pointer-events-none overflow-hidden select-none z-0">
        <video 
          src="/videos/videocurso3.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover"
        />
        {/* Degradês para suavizar as bordas do vídeo no fundo escuro */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-lux-darker" />
        <div className="absolute inset-0 bg-gradient-to-t from-lux-darker via-transparent to-lux-darker" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="w-full lg:w-1/2" style={getAnimStyle(0)}>
            <span className="text-lux-gold tracking-[0.2em] uppercase text-xs font-bold block mb-4 flex items-center gap-3">
               <span className="w-8 h-[1px] bg-lux-gold"></span> Anna Beauty Academy
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-8 text-balance">
              Método Anna Beauty <br/><span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#FFF1BA] animate-shimmer" style={{ backgroundSize: '200% auto' }}>Extensão de Cílios</span>
            </h2>
            
            <div className="space-y-8 mb-10">
              <p className="text-white/80 text-base md:text-lg font-light max-w-lg leading-relaxed">
                O Método Anna Beauty foi desenvolvido para capacitar profissionais, ensinando desde as técnicas mais requisitadas de extensão de cílios até o gerenciamento estratégico da sua carreira no mercado da estética.
              </p>

              <div className="max-w-lg">
                <h4 className="text-lux-gold font-serif text-xl mb-6 flex items-center gap-4">
                  <span className="w-8 h-[1px] bg-lux-gold/50"></span> Estrutura do Método
                </h4>
                <ul className="space-y-4 text-white/80 font-light text-sm md:text-base pl-12">
                  <li className="relative">
                    <span className="absolute -left-6 top-0 text-lux-gold/70 text-xs">01.</span> 
                    <span>Técnicas exclusivas e avançadas de alongamento.</span>
                  </li>
                  <li className="relative">
                    <span className="absolute -left-6 top-0 text-lux-gold/70 text-xs">02.</span> 
                    <span>Seleção criteriosa de materiais para cada perfil de cliente.</span>
                  </li>
                  <li className="relative">
                    <span className="absolute -left-6 top-0 text-lux-gold/70 text-xs">03.</span> 
                    <span>Protocolos de segurança, durabilidade e saúde ocular.</span>
                  </li>
                  <li className="relative">
                    <span className="absolute -left-6 top-0 text-lux-gold/70 text-xs">04.</span> 
                    <span>Gestão de atendimento e estratégias de fidelização.</span>
                  </li>
                </ul>
              </div>

              <div className="max-w-lg pt-4">
                <p className="text-lux-goldLight font-bold uppercase tracking-widest text-xs mb-2">
                  Vagas Limitadas
                </p>
                <p className="text-white/60 font-light text-sm leading-relaxed">
                  Conquiste sua independência financeira e torne-se uma referência em extensão de cílios.
                </p>
              </div>
            </div>
            

          </div>

          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end" style={getAnimStyle(1)}>
            {/* Instagram Iframe Embed */}
            <div className="w-full max-w-[400px] aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(212,175,55,0.15)] border border-lux-gold/30 relative group bg-black flex items-center justify-center">
               <div className="absolute inset-0 bg-gradient-to-br from-lux-gold to-lux-goldLight opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none z-10" />
               <iframe 
                 src="https://www.instagram.com/p/DY92w0HRfex/embed" 
                 className="w-[calc(100%+4px)] h-[calc(100%+4px)] border-0" 
                 scrolling="no" 
                 allowTransparency={true}
                 title="Instagram Video"
               />
            </div>
          </div>
        </div>

        {/* Social Proof (Testimonials) - Animated Marquee */}
        <div 
          className="mt-24 w-full relative max-w-7xl mx-auto" 
          style={{
            ...getAnimStyle(2),
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
          }}
        >
          <div className="flex w-max animate-slide-left hover:[animation-play-state:paused] gap-4 md:gap-8 py-8">
            {/* Group 1 */}
            <div className="w-[300px] md:w-[450px] flex-shrink-0 overflow-hidden relative group transition-all duration-500 hover:-translate-y-2 opacity-80 hover:opacity-100">
              <img src="/print1.png" alt="Depoimento Luana" className="w-full h-auto object-cover rounded-xl" />
            </div>
            <div className="w-[300px] md:w-[450px] flex-shrink-0 overflow-hidden relative group transition-all duration-500 hover:-translate-y-2 opacity-80 hover:opacity-100">
              <img src="/print2.png" alt="Depoimento Etiene" className="w-full h-auto object-cover rounded-xl" />
            </div>
            
            {/* Group 2 (Duplicate for infinite loop) */}
            <div className="w-[300px] md:w-[450px] flex-shrink-0 overflow-hidden relative group transition-all duration-500 hover:-translate-y-2 opacity-80 hover:opacity-100">
              <img src="/print1.png" alt="Depoimento Luana" className="w-full h-auto object-cover rounded-xl" />
            </div>
            <div className="w-[300px] md:w-[450px] flex-shrink-0 overflow-hidden relative group transition-all duration-500 hover:-translate-y-2 opacity-80 hover:opacity-100">
              <img src="/print2.png" alt="Depoimento Etiene" className="w-full h-auto object-cover rounded-xl" />
            </div>
          </div>
        </div>

        {/* Floating Call to Action Button */}
        <div className="mt-8 flex justify-center w-full" style={getAnimStyle(3)}>
          <div className="relative inline-block">
            {/* Efeito de brilho pulsante por trás do botão para destaque */}
            <div className="absolute -inset-1 bg-gradient-to-r from-lux-gold to-lux-goldLight rounded-full blur opacity-40 animate-pulse"></div>
            
            <a 
              href="https://api.whatsapp.com/send?phone=5521992279722&text=Ol%C3%A1!%20Gostaria%20de%20garantir%20minha%20inscri%C3%A7%C3%A3o%20no%20M%C3%A9todo%20Anna%20Beauty%20-%20Extens%C3%A3o%20de%20C%C3%ADlios."
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-lux-darker rounded-full text-sm font-bold tracking-widest uppercase hover:shadow-[0_0_40px_rgba(212,175,55,0.7)] hover:-translate-y-1 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Garantir Minha Vaga
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ ready }: { ready: boolean }) {
  const { setRef, getAnimStyle } = useStaggeredReveal(15, 0.05, ready);

  return (
    <section id="serviços" ref={setRef} className="w-full py-24 md:py-40 bg-lux-light relative overflow-hidden">
      {/* Imagem de fundo no canto esquerdo */}
      <div className="absolute left-0 top-0 h-full w-full lg:w-[50%] opacity-15 pointer-events-none overflow-hidden select-none z-0">
        <img 
          src="/fotos/servico1.png" 
          alt="Background Serviços Esquerdo" 
          className="w-full h-full object-cover object-left"
        />
        {/* Degradês para suavizar e mesclar a imagem com o fundo claro */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#F9F8F6]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F9F8F6] via-transparent to-[#F9F8F6]" />
      </div>

      {/* Vídeo de fundo no canto direito (Apenas Desktop) */}
      <div className="hidden lg:block absolute right-0 top-0 h-full w-[42%] opacity-30 pointer-events-none overflow-hidden select-none z-0">
        <video 
          src="/videos/videoservico2.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover object-right"
        />
        {/* Degradês para suavizar e mesclar o vídeo com o fundo claro */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#F9F8F6] via-[#F9F8F6]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F9F8F6] via-transparent to-[#F9F8F6]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-8">
          
          {/* Coluna da Esquerda: Título e Lista de Serviços */}
          <div className="lg:w-[58%] w-full flex flex-col gap-12">
            <div style={getAnimStyle(0)}>
              <span className="text-lux-gold tracking-[0.2em] uppercase text-xs font-bold block mb-4 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-lux-gold"></span> Menu de Serviços
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#AA7C11] to-[#F3E5AB] animate-shimmer leading-[1.1] mb-12" style={{ backgroundSize: '200% auto' }}>
                Portfólio<br/><span className="italic text-lux-dark">Estético</span>
              </h2>
            </div>

            {serviceCategories.map((cat, catIdx) => (
              <div key={catIdx} className="flex flex-col" style={getAnimStyle(catIdx + 1)}>
                <h3 className="font-serif text-lux-gold text-lg tracking-[0.2em] uppercase font-bold border-b border-lux-gold/20 pb-4 mb-6">
                  {cat.category}
                </h3>
                <div className="flex flex-col">
                  {cat.items.map((svc, i) => {
                    const uniqueIndex = catIdx * 4 + i + 4;
                    return (
                      <a 
                        key={i} 
                        href="https://anna-beauty.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group py-6 border-b border-lux-gold/10 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-white hover:shadow-[0_10px_30px_rgba(212,175,55,0.05)] transition-all duration-500 px-6 -mx-6 rounded-xl"
                        style={getAnimStyle(uniqueIndex)}
                      >
                        <div className="flex flex-col">
                          <h4 className="font-serif text-xl md:text-2xl text-lux-dark group-hover:text-transparent bg-clip-text bg-gradient-to-r group-hover:from-lux-gold group-hover:to-lux-goldLight transition-all duration-500">
                            {svc.name}
                          </h4>
                          <p className="text-lux-gray font-light text-sm mt-2 max-w-xl">
                            {svc.desc}
                          </p>
                        </div>
                        <div className="shrink-0 mt-4 md:mt-0 flex justify-end w-full md:w-auto">
                          <div className="w-10 h-10 rounded-full border border-lux-gold/30 flex items-center justify-center text-lux-gold group-hover:bg-lux-gold group-hover:text-white transition-all duration-300">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Vídeo em Destaque no Mobile (Final da lista de serviços) */}
            <div className="block lg:hidden mt-12 w-[calc(100%+3rem)] -mx-6 relative" style={getAnimStyle(14)}>
              <div className="w-full aspect-[9/16] bg-lux-darker overflow-hidden relative">
                <video 
                  src="/videos/videoservico2.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover"
                />
                {/* Degradês para suavizar as bordas superior e inferior do vídeo com o fundo claro */}
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#F9F8F6] to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#F9F8F6] to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function LocationSection({ ready }: { ready: boolean }) {
  const { setRef, getAnimStyle } = useStaggeredReveal(2, 0.2, ready);
  const studioParallax = useParallax(-0.05);

  return (
    <section id="localizacao" ref={setRef} className="w-full bg-lux-light relative overflow-hidden text-lux-darker border-t border-lux-gold/10">
      <div className="flex flex-col-reverse lg:flex-row min-h-screen">
        {/* Imagem do Estúdio (Esquerda no Desktop, Embaixo no Mobile) */}
        <div style={getAnimStyle(0)} className="w-full lg:w-1/2 relative min-h-[50vh] lg:min-h-screen overflow-hidden">
          <div ref={studioParallax.ref} className="w-full h-full relative overflow-hidden min-h-[50vh] lg:min-h-screen">
             <img src={STUDIO_PHOTO} alt="Nosso Estúdio" style={studioParallax.style} className="absolute -top-[10%] left-0 w-full h-[120%] object-cover scale-110" />
             {/* Sombra escura na base para o texto do estúdio e fade na direita no desktop */}
             <div className="absolute inset-0 bg-gradient-to-t from-lux-darker/90 via-lux-darker/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-lux-light/100 pointer-events-none z-10" />
             {/* Borda degradê suave no topo apenas no mobile para fundir com a seção branca */}
             <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-lux-light to-transparent lg:hidden pointer-events-none z-10" />
             
             <div className="absolute bottom-10 left-6 md:left-12 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] pr-6 lg:pr-12 z-20">
               <h3 className="font-serif text-3xl md:text-4xl mb-3 text-lux-goldLight">O ambiente perfeito<br/>para você</h3>
               <p className="font-light text-sm md:text-base max-w-md text-white/90">
                 Projetado para o seu máximo conforto, garantindo uma experiência relaxante e inesquecível em cada procedimento.
               </p>
             </div>
          </div>
        </div>

        {/* Textos e Mapa (Direita no Desktop, Em cima no Mobile) */}
        <div style={getAnimStyle(1)} className="w-full lg:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-lux-gold tracking-[0.3em] uppercase text-xs md:text-sm font-semibold">Onde Estamos</span>
            <div className="w-12 h-[1px] bg-gradient-to-r from-lux-gold to-transparent"></div>
          </div>
          
          <h2 className="font-serif text-[2.5rem] md:text-[3.5rem] leading-[1.1] mb-8 text-lux-darker">
            Nosso <span className="italic text-lux-gold">Espaço</span>
          </h2>
          
          <p className="text-lux-gray max-w-lg mb-8 text-sm md:text-base leading-relaxed">
            Nossa localização no Cavalcante é de fácil acesso, com um espaço pensado para unir sofisticação, paz e um atendimento impecável.
          </p>
          
          <div className="flex items-start gap-4 mb-8">
             <div className="p-3 bg-lux-gold/10 rounded-full text-lux-gold mt-1">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
             </div>
             <div>
               <h4 className="font-serif text-lg text-lux-darker mb-1">Endereço</h4>
               <p className="text-lux-gray">Rua Joaquim Norberto, 44<br/>Cavalcante, Térreo - Sala 6</p>
             </div>
          </div>
          
          {/* Google Maps Embed */}
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-lux-gold/20 mb-8 relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3676.223055919794!2d-43.310168!3d-22.8682855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997cc0f994b29b%3A0xa1937ff7a9e6fb4e!2sR.%20Joaquim%20Norberto%2C%2044%20-%20Cavalcanti%2C%20Rio%20de%20Janeiro%20-%20RJ%2C%2021370-130!5e0!3m2!1spt-BR!2sbr!4v1716901844222!5m2!1spt-BR!2sbr" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>

          <a href="https://maps.google.com/?q=Rua+Joaquim+Norberto,+44,+Cavalcante" target="_blank" rel="noopener noreferrer" className="w-max px-8 py-3 bg-transparent border border-lux-gold text-lux-gold rounded-full text-xs font-bold tracking-widest uppercase hover:bg-lux-gold hover:text-white transition-colors duration-300">
            Abrir Rota no Mapa
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer({ ready }: { ready: boolean }) {
  const { setRef, getAnimStyle } = useStaggeredReveal(3, 0.15, ready);

  return (
    <footer ref={setRef} className="w-full bg-lux-darker py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-lux-gold/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lux-gold/10 rounded-full blur-[200px]" />

      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center relative z-10">
        <div style={getAnimStyle(0)}>
          <span className="tracking-[0.3em] uppercase text-xs font-semibold block mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#FFF1BA] animate-shimmer" style={{ backgroundSize: '200% auto' }}>O momento é agora</span>
          <h2 className="font-serif text-white text-5xl md:text-7xl mb-12">Pronta para transformar<br/><span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#FFF1BA] animate-shimmer" style={{ backgroundSize: '200% auto' }}>seu olhar?</span></h2>
          
          <a 
            href="https://anna-beauty.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-12 py-5 bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#F3E5AB] animate-shimmer text-lux-darker rounded-full text-sm font-bold tracking-widest uppercase hover:shadow-[0_0_40px_rgba(243,229,171,0.4)] hover:scale-105 transition-all duration-500 mb-24" 
            style={{ backgroundSize: '200% auto' }}
          >
            Agende aqui
          </a>
        </div>
        
        {/* Contact info grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 py-16 border-y border-lux-gold/20 text-white/80 text-sm leading-relaxed mb-12" style={getAnimStyle(1)}>
          <div className="flex flex-col items-center">
            <h4 className="font-serif text-lux-gold text-lg mb-3 tracking-wider">Contato</h4>
            <a href="https://wa.me/5521992279722?text=Olá!%20Quero%20mais%20informações%20ou%20ajuda." target="_blank" rel="noopener noreferrer" className="hover:text-lux-goldLight transition-colors font-light text-base flex items-center gap-2">
              <svg className="w-4 h-4 text-lux-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              (21) 99227-9722
            </a>
          </div>
          <div className="flex flex-col items-center border-y md:border-y-0 md:border-x border-lux-gold/10 py-8 md:py-0">
            <h4 className="font-serif text-lux-gold text-lg mb-3 tracking-wider">Localização</h4>
            <p className="font-light text-base max-w-xs mb-2">
              Rua Joaquim Norberto, 44, Cavalcante, Térreo - Sala 6
            </p>
            <a href="#localizacao" className="text-xs text-lux-goldLight uppercase tracking-widest hover:text-white transition-colors border-b border-lux-goldLight/30 hover:border-white pb-1">Ver mapa</a>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="font-serif text-lux-gold text-lg mb-3 tracking-wider">Rede Social</h4>
            <a href="https://instagram.com/aannabeauty__" target="_blank" rel="noopener noreferrer" className="hover:text-lux-goldLight transition-colors font-light text-base flex items-center gap-2">
              <svg className="w-5 h-5 text-lux-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              @aannabeauty__
            </a>
          </div>
        </div>

        <div className="w-full pt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-xs font-light" style={getAnimStyle(2)}>
          <span>&copy; {new Date().getFullYear()} Anna Beauty. Todos os direitos reservados.</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [animReady, setAnimReady] = useState(false);

  const handleComplete = useCallback(() => {
    setShowSplash(false);
    requestAnimationFrame(() => setAnimReady(true));
  }, []);

  return (
    <div className="bg-lux-light font-sans antialiased text-lux-dark min-h-screen selection:bg-lux-gold selection:text-lux-darker">
      {showSplash && <SplashScreen onComplete={handleComplete} />}
      <Navbar />
      <main>
        <HeroSection ready={animReady} />
        <AboutSection ready={animReady} />
        <CoursesSection ready={animReady} />
        <ServicesSection ready={animReady} />
        <LocationSection ready={animReady} />
      </main>
      <Footer ready={animReady} />
    </div>
  );
}
