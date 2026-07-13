import { useState, useEffect, useRef, useCallback } from 'react';

// ─── WHATSAPP LINK ────────────────────────────────────────────────────────────
const WA_METODO = 'https://api.whatsapp.com/send?phone=5521992279722&text=Ol%C3%A1!%20Quero%20garantir%20minha%20vaga%20no%20M%C3%A9todo%20Anna%20Beauty%20-%20Extens%C3%A3o%20de%20C%C3%ADlios!';
const WA_RECICLA = 'https://api.whatsapp.com/send?phone=5521992279722&text=Ol%C3%A1!%20Quero%20garantir%20minha%20vaga%20na%20Reciclagem%20Lash%20Anna%20Beauty!';

// ─── DATES ────────────────────────────────────────────────────────────────────
const COURSE_DATES_METODO = [
  { days: '20 e 21', month: 'Julho' },
  { days: '23 e 24', month: 'Julho' },
  { days: '27 e 28', month: 'Julho' },
  { days: '30 e 31', month: 'Julho' },
];
const COURSE_DATES_RECICLA = [
  { days: '01 e 02', month: 'Agosto' },
];

// ─── BONUSES ─────────────────────────────────────────────────────────────────
const BONUSES = [
  { icon: '📖', title: 'Apostila Exclusiva', desc: 'Material completo e detalhado para consultar sempre que precisar' },
  { icon: '☕', title: 'Coffee Break Incluso', desc: 'Coffeebreak para te energizar durante os dois dias intensivos' },
  { icon: '💬', title: '1 Mês de Suporte', desc: 'Suporte direto com Anna após o curso para tirar todas as dúvidas' },
  { icon: '👁️', title: 'Teoria + Prática Real', desc: 'Você pratica em modelo real — sem bonecos, experiência verdadeira' },
  { icon: '⚕️', title: 'Módulo Alergia', desc: 'Aprenda a identificar e orientar clientes com reação à extensão' },
];

// ─── HOOKS ───────────────────────────────────────────────────────────────────
function useRevealOnScroll(threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  const nodeRef = useRef<HTMLElement | null>(null);
  const setRef = useCallback((el: HTMLElement | null) => { nodeRef.current = el; }, []);

  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  const style = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(36px)',
    transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
  });

  return { setRef, style };
}

function useCountdown(targetDate: Date) {
  const calc = () => {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc());
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function WaButton({ href, children, size = 'lg', id }: { href: string; children: React.ReactNode; size?: 'sm' | 'lg'; id?: string }) {
  const base = 'inline-flex items-center justify-center gap-3 rounded-full font-bold tracking-widest uppercase transition-all duration-300 group relative overflow-hidden';
  const sizes = {
    lg: 'px-10 py-5 text-sm md:text-base',
    sm: 'px-6 py-3 text-xs',
  };
  return (
    <a id={id} href={href} target="_blank" rel="noopener noreferrer" className={`${base} ${sizes[size]} bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#0A0908] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] hover:-translate-y-1`}>
      <div className="absolute inset-0 bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
      <span className="relative z-10">{children}</span>
    </a>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-lux-gold tracking-[0.25em] uppercase text-xs font-bold flex items-center gap-3 mb-4">
      <span className="w-8 h-[1px] bg-lux-gold" />
      {children}
    </span>
  );
}

// ── HERO ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const target = new Date('2026-07-20T08:00:00-03:00');
  const { days, hours, minutes, seconds } = useCountdown(target);

  return (
    <section id="curso-hero" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-lux-darker">
      {/* Video BG */}
      <div className="absolute inset-0">
        <video src="/videos/videocurso3.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-lux-darker/80 via-lux-darker/50 to-lux-darker" />
        <div className="absolute inset-0 bg-gradient-to-r from-lux-darker/90 via-transparent to-lux-darker/90" />
      </div>

      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-lux-gold/10 rounded-full blur-[150px] animate-pulse-slow" />

      {/* Badge */}
      <div className="absolute top-6 left-0 right-0 flex justify-center z-20">
        <div className="flex items-center gap-2 bg-lux-gold/10 border border-lux-gold/30 backdrop-blur-sm rounded-full px-5 py-2">
          <span className="w-2 h-2 rounded-full bg-lux-gold animate-pulse" />
          <span className="text-lux-goldLight text-[11px] tracking-[0.3em] uppercase font-bold">Vagas Limitadas — Turmas Julho 2026</span>
        </div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-24 pb-16">
        {/* Pre-headline */}
        <p className="text-lux-gold text-xs md:text-sm tracking-[0.35em] uppercase font-bold mb-6 animate-fade-in">
          Anna Beauty Academy Apresenta
        </p>

        {/* Headline */}
        <h1 className="font-serif text-white text-[2.6rem] sm:text-[3.5rem] md:text-[4.8rem] lg:text-[5.5rem] leading-[1.08] mb-6 text-balance">
          Aprenda a Arte da<br />
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#FFF1BA] animate-shimmer" style={{ backgroundSize: '200% auto' }}>
            Extensão de Cílios
          </span><br />
          do Zero ao Profissional
        </h1>

        {/* Sub */}
        <p className="text-white/75 text-base md:text-xl font-light max-w-2xl mx-auto mb-10 leading-relaxed">
          Em 2 dias intensivos você sai capacitada para atender clientes, cobrar o que merece e construir uma carreira lucrativa na estética.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-lux-gold to-lux-goldLight rounded-full blur opacity-50 animate-pulse" />
            <WaButton href={WA_METODO} id="hero-cta-metodo">Garantir Minha Vaga Agora</WaButton>
          </div>
          <a href="#curso-opcoes" className="text-lux-goldLight/70 hover:text-lux-goldLight text-xs tracking-widest uppercase underline underline-offset-4 transition-colors">
            Ver opções de curso
          </a>
        </div>

        {/* Countdown */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-white/40 text-[11px] tracking-[0.3em] uppercase">Próxima turma começa em</p>
          <div className="flex items-center gap-3 md:gap-5">
            {[{ v: days, l: 'Dias' }, { v: hours, l: 'Horas' }, { v: minutes, l: 'Min' }, { v: seconds, l: 'Seg' }].map(({ v, l }) => (
              <div key={l} className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 border border-lux-gold/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="font-serif text-2xl md:text-3xl text-white font-bold tabular-nums">{String(v).padStart(2, '0')}</span>
                </div>
                <span className="text-lux-gold/60 text-[9px] tracking-[0.2em] uppercase mt-2">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
        <span className="text-lux-gold/50 text-[9px] tracking-[0.4em] uppercase">Descubra mais</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-lux-gold/50 to-transparent" />
      </div>
    </section>
  );
}

// ── DOR / PROBLEMA ────────────────────────────────────────────────────────────
function PainSection() {
  const { setRef, style } = useRevealOnScroll(0.2);

  return (
    <section ref={setRef as React.Ref<HTMLElement>} className="w-full py-24 md:py-32 bg-lux-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(212,175,55,0.06)_0%,_transparent_60%)]" />

      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <div style={style(0)}>
          <SectionLabel>Você se identifica?</SectionLabel>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-[1.2] mb-12">
            Muitas mulheres sonham em trabalhar com beleza mas ficam travadas por <span className="italic text-lux-goldLight">falta de técnica e segurança</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {[
            'Tenho vontade de entrar na área da estética mas não sei por onde começar',
            'Já tentei aprender sozinha e não consegui resultado de qualidade',
            'Tenho medo de errar e prejudicar a cliente',
            'Não sei precificar meu serviço e fico com a autoestima lá embaixo',
            'Trabalho muito e ganho pouco — quero independência financeira de verdade',
            'Quero um curso que me dê suporte depois, não só nas 2 horas de aula',
          ].map((text, i) => (
            <div key={i} style={style(i * 80)} className="flex items-start gap-3 bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-lux-gold/20 transition-colors duration-300">
              <span className="text-lux-gold text-lg mt-0.5 shrink-0">•</span>
              <p className="text-white/70 text-sm md:text-base font-light leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <div style={style(600)} className="mt-14 p-8 bg-lux-gold/8 border border-lux-gold/25 rounded-3xl">
          <p className="text-lux-goldLight font-serif text-xl md:text-2xl italic leading-relaxed">
            "Se você se viu em pelo menos um desses pontos, o Método Anna Beauty foi criado especialmente pra você."
          </p>
          <p className="text-lux-gold/60 text-sm mt-4 tracking-widest uppercase font-bold">— Anna Beauty</p>
        </div>
      </div>
    </section>
  );
}

// ── OPCOES DE CURSO ───────────────────────────────────────────────────────────
function CourseOptionsSection() {
  const { setRef, style } = useRevealOnScroll(0.15);

  return (
    <section id="curso-opcoes" ref={setRef as React.Ref<HTMLElement>} className="w-full py-24 md:py-32 bg-lux-light relative overflow-hidden">
      <div className="absolute -right-40 top-20 w-96 h-96 bg-lux-gold/5 rounded-full blur-[100px]" />
      <div className="absolute -left-20 bottom-20 w-72 h-72 bg-lux-gold/5 rounded-full blur-[80px]" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16" style={style(0)}>
          <SectionLabel>Escolha sua turma</SectionLabel>
          <h2 className="font-serif text-4xl md:text-5xl text-lux-dark leading-[1.1]">
            Duas opções para o seu<br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA7C11]">momento profissional</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1 — Método */}
          <div style={style(100)} className="relative bg-lux-darker rounded-3xl p-8 md:p-10 border border-lux-gold/20 overflow-hidden group hover:border-lux-gold/50 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(212,175,55,0.15)]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-lux-gold to-transparent" />
            <div className="absolute top-4 right-4">
              <span className="bg-lux-gold text-lux-darker text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">Mais Completo</span>
            </div>

            <div className="mb-8">
              <p className="text-lux-gold/60 text-xs tracking-[0.3em] uppercase mb-2">Curso Principal</p>
              <h3 className="font-serif text-3xl md:text-4xl text-white mb-3">Método Anna Beauty</h3>
              <p className="text-lux-goldLight font-serif text-lg italic">Extensão de Cílios</p>
            </div>

            <p className="text-white/60 text-sm font-light leading-relaxed mb-8">
              Do zero ao profissional. Aprenda todas as técnicas de extensão — Fio a Fio, Volume Brasileiro, Egípcio e Fox Eyes — com prática em modelo real.
            </p>

            {/* Datas */}
            <div className="mb-8">
              <p className="text-lux-gold text-xs tracking-[0.3em] uppercase font-bold mb-4">Próximas Turmas:</p>
              <div className="grid grid-cols-2 gap-3">
                {COURSE_DATES_METODO.map((d, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
                    <p className="text-white font-bold text-sm">{d.days}</p>
                    <p className="text-white/40 text-xs">{d.month}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Preço */}
            <div className="mb-8 p-5 bg-lux-gold/8 border border-lux-gold/20 rounded-2xl">
              <div className="flex items-end justify-between flex-wrap gap-3">
                <div>
                  <p className="text-white/40 text-xs mb-1">Investimento</p>
                  <p className="text-white/50 text-lg line-through font-light">R$ 950,00</p>
                  <p className="text-white font-serif text-4xl font-bold">R$ 800<span className="text-xl font-light">,00</span></p>
                  <p className="text-lux-gold text-xs font-bold tracking-wider mt-1">NO PIX • CONDIÇÃO ESPECIAL</p>
                </div>
                <div className="text-right">
                  <p className="text-white/50 text-xs mb-1">ou parcelado</p>
                  <p className="text-white font-bold text-xl">R$ 950,00</p>
                  <p className="text-white/40 text-xs">no cartão/dinheiro</p>
                </div>
              </div>
            </div>

            <WaButton href={WA_METODO} id="opcao-metodo-cta">Quero o Método Anna Beauty</WaButton>
          </div>

          {/* Card 2 — Reciclagem */}
          <div style={style(200)} className="relative bg-lux-light rounded-3xl p-8 md:p-10 border border-lux-gold/20 overflow-hidden group hover:border-lux-gold/50 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(212,175,55,0.12)]">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-lux-gold/50 to-transparent" />

            <div className="mb-8">
              <p className="text-lux-gold/60 text-xs tracking-[0.3em] uppercase mb-2">Reciclagem</p>
              <h3 className="font-serif text-3xl md:text-4xl text-lux-dark mb-3">Recicla Lash</h3>
              <p className="text-lux-accent font-serif text-lg italic">Prática Supervisionada</p>
            </div>

            <p className="text-lux-gray text-sm font-light leading-relaxed mb-8">
              Para profissionais que já fizeram o básico mas precisam de mais segurança e confiança na aplicação. Prática supervisionada com feedback individual.
            </p>

            {/* Badge */}
            <div className="flex items-center gap-2 mb-8 p-4 bg-lux-gold/8 border border-lux-gold/20 rounded-xl">
              <span className="text-2xl">🎯</span>
              <p className="text-lux-dark text-sm font-light"><strong className="font-bold">Para quem:</strong> já fez curso mas sente insegurança na aplicação em modelos reais</p>
            </div>

            {/* Datas */}
            <div className="mb-8">
              <p className="text-lux-gold text-xs tracking-[0.3em] uppercase font-bold mb-4">Data:</p>
              <div className="grid grid-cols-1 gap-3">
                {COURSE_DATES_RECICLA.map((d, i) => (
                  <div key={i} className="bg-lux-gold/8 border border-lux-gold/20 rounded-xl px-4 py-3 text-center">
                    <p className="text-lux-dark font-bold text-sm">{d.days}</p>
                    <p className="text-lux-gray text-xs">{d.month}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Preço */}
            <div className="mb-8 p-5 bg-lux-darker/5 border border-lux-gold/15 rounded-2xl">
              <div className="flex items-end justify-between flex-wrap gap-3">
                <div>
                  <p className="text-lux-gray text-xs mb-1">Investimento</p>
                  <p className="text-lux-gray text-lg line-through font-light">R$ 550,00</p>
                  <p className="text-lux-dark font-serif text-4xl font-bold">R$ 480<span className="text-xl font-light">,00</span></p>
                  <p className="text-lux-gold text-xs font-bold tracking-wider mt-1">NO PIX • CONDIÇÃO ESPECIAL</p>
                </div>
                <div className="text-right">
                  <p className="text-lux-gray text-xs mb-1">ou parcelado</p>
                  <p className="text-lux-dark font-bold text-xl">R$ 550,00</p>
                  <p className="text-lux-gray text-xs">no cartão/dinheiro</p>
                </div>
              </div>
            </div>

            <WaButton href={WA_RECICLA} id="opcao-recicla-cta">Quero o Recicla Lash</WaButton>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── O QUE VOCÊ VAI APRENDER ───────────────────────────────────────────────────
function CurriculumSection() {
  const { setRef, style } = useRevealOnScroll(0.15);

  const modules = [
    {
      num: '01', title: 'Fundamentos & Teoria',
      items: ['Anatomia do olho e dos cílios', 'Produtos, colas e ferramentas', 'Saúde e higiene no atendimento', 'Alergia: identificar e orientar a cliente'],
    },
    {
      num: '02', title: 'Técnicas de Extensão',
      items: ['Fio a Fio — naturalidade e elegância', 'Volume Brasileiro (Y) — leve e duradouro', 'Volume Egípcio (W) — textura marcante', 'Fox Eyes — o efeito gato irresistível'],
    },
    {
      num: '03', title: 'Prática em Modelo Real',
      items: ['Mapeamento e design do olhar', 'Aplicação supervisionada com feedback', 'Correções em tempo real com a Anna', 'Criando seu portfólio profissional'],
    },
    {
      num: '04', title: 'Negócios & Carreira',
      items: ['Como precificar seu serviço com valor', 'Fidelização e gestão de clientes', 'Estratégias para atrair clientes', 'Construindo sua marca pessoal'],
    },
  ];

  return (
    <section id="modulos" ref={setRef as React.Ref<HTMLElement>} className="w-full py-24 md:py-32 bg-lux-darker relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5" />
      <div className="absolute left-0 top-1/2 w-80 h-80 bg-lux-gold/8 rounded-full blur-[100px]" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16" style={style(0)}>
          <SectionLabel>Conteúdo do Curso</SectionLabel>
          <h2 className="font-serif text-4xl md:text-5xl text-white leading-[1.1]">
            O que você vai dominar<br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] animate-shimmer" style={{ backgroundSize: '200% auto' }}>
              ao final dos 2 dias
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((mod, i) => (
            <div key={i} style={style(i * 100)} className="bg-white/4 border border-white/8 rounded-3xl p-7 md:p-8 hover:border-lux-gold/30 transition-all duration-500 hover:bg-white/6 group">
              <div className="flex items-start gap-4 mb-6">
                <span className="font-serif text-5xl text-lux-gold/20 font-bold leading-none group-hover:text-lux-gold/40 transition-colors duration-500">{mod.num}</span>
                <div>
                  <h3 className="font-serif text-xl md:text-2xl text-white">{mod.title}</h3>
                </div>
              </div>
              <ul className="space-y-3">
                {mod.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-white/65 text-sm font-light">
                    <span className="w-4 h-4 rounded-full border border-lux-gold/40 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-lux-gold" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── BÔNUS ─────────────────────────────────────────────────────────────────────
function BonusSection() {
  const { setRef, style } = useRevealOnScroll(0.15);

  return (
    <section ref={setRef as React.Ref<HTMLElement>} className="w-full py-24 md:py-32 bg-lux-light relative overflow-hidden">
      <div className="absolute right-0 top-0 w-96 h-96 bg-lux-gold/6 rounded-full blur-[100px]" />

      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16" style={style(0)}>
          <SectionLabel>Bônus Exclusivos</SectionLabel>
          <h2 className="font-serif text-4xl md:text-5xl text-lux-dark leading-[1.1]">
            Tudo que vem<br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA7C11]">incluso no curso</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BONUSES.map((bonus, i) => (
            <div key={i} style={style(i * 80)} className="bg-white border border-lux-gold/15 rounded-3xl p-7 shadow-sm hover:shadow-[0_10px_40px_rgba(212,175,55,0.1)] hover:-translate-y-1 transition-all duration-400 group">
              <div className="w-12 h-12 rounded-2xl bg-lux-gold/10 flex items-center justify-center text-2xl mb-5 group-hover:bg-lux-gold/20 transition-colors duration-300">
                {bonus.icon}
              </div>
              <h3 className="font-serif text-lg text-lux-dark mb-2">{bonus.title}</h3>
              <p className="text-lux-gray text-sm font-light leading-relaxed">{bonus.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── DEPOIMENTOS ───────────────────────────────────────────────────────────────
function TestimonialsSection() {
  const { setRef, style } = useRevealOnScroll(0.1);

  return (
    <section ref={setRef as React.Ref<HTMLElement>} className="w-full py-24 md:py-32 bg-lux-darker overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.05)_0%,_transparent_70%)]" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16" style={style(0)}>
          <SectionLabel>Resultados Reais</SectionLabel>
          <h2 className="font-serif text-4xl md:text-5xl text-white leading-[1.1]">
            O que as alunas<br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] animate-shimmer" style={{ backgroundSize: '200% auto' }}>
              estão dizendo
            </span>
          </h2>
        </div>

        {/* Marquee */}
        <div style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
          <div className="flex w-max animate-slide-left hover:[animation-play-state:paused] gap-6 py-4">
            {['/print1.png', '/print2.png', '/print1.png', '/print2.png'].map((src, i) => (
              <div key={i} className="w-[280px] md:w-[380px] flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 opacity-85 hover:opacity-100 hover:-translate-y-2 transition-all duration-500">
                <img src={src} alt={`Depoimento ${i + 1}`} className="w-full h-auto object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA abaixo dos depoimentos */}
        <div className="flex justify-center mt-16" style={style(200)}>
          <div className="text-center">
            <p className="text-white/50 text-sm mb-6">Você pode ser a próxima história de sucesso</p>
            <div className="relative inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-lux-gold to-lux-goldLight rounded-full blur opacity-40 animate-pulse" />
              <WaButton href={WA_METODO} id="testimonial-cta">Quero Fazer Parte Também</WaButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── MENTORA ───────────────────────────────────────────────────────────────────
function MentorSection() {
  const { setRef, style } = useRevealOnScroll(0.15);

  return (
    <section ref={setRef as React.Ref<HTMLElement>} className="w-full py-24 md:py-32 bg-lux-light relative overflow-hidden">
      <div className="absolute -left-40 top-20 w-96 h-96 bg-lux-gold/5 rounded-full blur-[100px]" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-20">
          {/* Foto */}
          <div style={style(0)} className="w-full lg:w-5/12 flex justify-center">
            <div className="relative w-[280px] md:w-[340px] group">
              <div className="absolute inset-0 bg-lux-gold/15 translate-x-5 translate-y-5 rounded-t-[100px] rounded-b-[30px] group-hover:translate-x-7 group-hover:translate-y-7 transition-transform duration-500" />
              <div className="relative overflow-hidden rounded-t-[100px] rounded-b-[30px] aspect-[3/4] shadow-2xl">
                <img src="/fotos/foto1.png" alt="Anna Beauty — Especialista em Extensão de Cílios" className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-lux-darker/30 to-transparent" />
              </div>
              {/* Selo */}
              <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full border border-lux-gold/40 flex items-center justify-center bg-white shadow-xl z-10 group-hover:scale-110 transition-transform duration-500">
                <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_15s_linear_infinite]">
                  <path id="mentor-curve" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                  <text className="text-[11px] font-bold fill-lux-gold tracking-widest uppercase">
                    <textPath href="#mentor-curve">Anna Beauty • Especialista •</textPath>
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* Texto */}
          <div className="w-full lg:w-7/12" style={style(150)}>
            <SectionLabel>Sua Mentora</SectionLabel>
            <h2 className="font-serif text-4xl md:text-5xl text-lux-dark leading-[1.1] mb-6">
              Conheça<br />
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA7C11]">Anna Beauty</span>
            </h2>

            <div className="space-y-4 text-lux-gray font-light text-base md:text-lg leading-relaxed mb-8">
              <p>
                Especialista em Lash Design com anos de experiência transformando olhares e carreiras. Anna desenvolveu um método próprio que une técnica apurada, saúde dos fios e resultado impecável.
              </p>
              <p>
                Já capacitou dezenas de profissionais que hoje atuam com segurança e orgulho no mercado da estética, construindo sua independência financeira através da arte dos cílios.
              </p>
              <p>
                No curso, Anna está presente 100% do tempo — ensinando, supervisionando e corrigindo cada aluna individualmente para garantir que você saia capaz e confiante.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { num: '2+', label: 'Anos de Experiência' },
                { num: '100+', label: 'Alunas Formadas' },
                { num: '5★', label: 'Avaliações' },
              ].map((stat, i) => (
                <div key={i} className="text-center p-4 bg-lux-gold/8 border border-lux-gold/15 rounded-2xl">
                  <p className="font-serif text-3xl text-lux-dark font-bold">{stat.num}</p>
                  <p className="text-lux-gray text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <WaButton href={WA_METODO} size="sm" id="mentor-cta">Aprender com Anna</WaButton>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── OFERTA FINAL ──────────────────────────────────────────────────────────────
function OfferSection() {
  const { setRef, style } = useRevealOnScroll(0.1);

  return (
    <section id="oferta" ref={setRef as React.Ref<HTMLElement>} className="w-full py-24 md:py-32 bg-lux-darker relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lux-gold/8 rounded-full blur-[200px]" />

      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <div style={style(0)}>
          <SectionLabel>Resumo da Oferta</SectionLabel>
          <h2 className="font-serif text-4xl md:text-5xl text-white leading-[1.1] mb-4">
            Tudo que você recebe<br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] animate-shimmer" style={{ backgroundSize: '200% auto' }}>
              ao se inscrever hoje
            </span>
          </h2>
        </div>

        {/* Checklist */}
        <div style={style(100)} className="mt-10 text-left space-y-3 mb-12">
          {[
            '✅ 2 dias intensivos de curso presencial',
            '✅ Teoria completa + Prática em modelo real',
            '✅ Técnicas: Fio a Fio, Volume Brasileiro, Egípcio e Fox Eyes',
            '✅ Módulo sobre Alergia e orientação ao cliente',
            '✅ Apostila exclusiva para consultar sempre',
            '✅ Coffee Break nos dois dias',
            '✅ 1 mês de suporte direto com Anna',
            '✅ Certificado de conclusão',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-5 py-4">
              <p className="text-white/80 text-sm md:text-base font-light">{item}</p>
            </div>
          ))}
        </div>

        {/* Cards de Preço */}
        <div style={style(200)} className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {/* Método */}
          <div className="relative bg-gradient-to-b from-lux-gold/15 to-transparent border border-lux-gold/40 rounded-3xl p-8 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-lux-gold to-transparent" />
            <p className="text-lux-gold text-xs tracking-[0.3em] uppercase font-bold mb-2">Método Anna Beauty</p>
            <p className="text-white/50 text-lg line-through">R$ 950,00</p>
            <p className="font-serif text-5xl text-white font-bold">R$ 800</p>
            <p className="text-lux-goldLight text-xs font-bold tracking-widest mt-1 mb-6">NO PIX</p>
            <WaButton href={WA_METODO} size="sm" id="oferta-metodo-cta">Garantir Vaga</WaButton>
          </div>
          {/* Recicla */}
          <div className="border border-white/15 rounded-3xl p-8">
            <p className="text-white/60 text-xs tracking-[0.3em] uppercase font-bold mb-2">Recicla Lash</p>
            <p className="text-white/50 text-lg line-through">R$ 550,00</p>
            <p className="font-serif text-5xl text-white font-bold">R$ 480</p>
            <p className="text-lux-goldLight text-xs font-bold tracking-widest mt-1 mb-6">NO PIX</p>
            <WaButton href={WA_RECICLA} size="sm" id="oferta-recicla-cta">Garantir Vaga</WaButton>
          </div>
        </div>

        {/* Garantia */}
        <div style={style(300)} className="flex flex-col sm:flex-row items-center gap-6 p-7 bg-lux-gold/8 border border-lux-gold/25 rounded-3xl text-left">
          <div className="w-16 h-16 shrink-0 rounded-full bg-lux-gold/15 border border-lux-gold/30 flex items-center justify-center text-3xl">🛡️</div>
          <div>
            <h4 className="text-white font-bold text-lg mb-1">Compromisso Anna Beauty</h4>
            <p className="text-white/60 text-sm font-light leading-relaxed">
              Estamos comprometidas com o seu aprendizado. Ao sair do curso, você terá todo o conhecimento e suporte necessário para começar a atender com segurança e qualidade.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQSection() {
  const { setRef, style } = useRevealOnScroll(0.1);
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    { q: 'Preciso ter experiência prévia para fazer o curso?', a: 'Não! O Método Anna Beauty foi desenvolvido para iniciantes. Você aprende do zero, de forma progressiva e com prática supervisionada.' },
    { q: 'O que eu preciso levar para o curso?', a: 'Apenas você! Todo o material e ferramentas para o dia da prática são fornecidos. A apostila também é inclusa.' },
    { q: 'O curso tem certificado?', a: 'Sim! Ao concluir os 2 dias, você recebe seu certificado de conclusão emitido pela Anna Beauty Academy.' },
    { q: 'Como funciona o suporte de 1 mês?', a: 'Após o curso, você terá acesso direto à Anna via WhatsApp para tirar dúvidas sobre técnicas e atendimentos reais.' },
    { q: 'Posso pagar parcelado?', a: 'O valor parcelado é de R$ 950 (Método) ou R$ 550 (Recicla Lash). No Pix você tem desconto especial: R$ 800 e R$ 480 respectivamente. Fale no WhatsApp para combinar.' },
    { q: 'Quantas vagas disponíveis por turma?', a: 'As turmas são pequenas e exclusivas para garantir atenção individualizada. Por isso as vagas são limitadas e costumam esgotar rápido!' },
    { q: 'E se eu já fiz o curso básico mas não me sinto segura?', a: 'A Recicla Lash foi feita para você! 2 dias de prática supervisionada para ganhar confiança e aperfeiçoar sua técnica com feedback direto da Anna.' },
  ];

  return (
    <section ref={setRef as React.Ref<HTMLElement>} className="w-full py-24 md:py-32 bg-lux-light relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16" style={style(0)}>
          <SectionLabel>Dúvidas Frequentes</SectionLabel>
          <h2 className="font-serif text-4xl md:text-5xl text-lux-dark leading-[1.1]">
            Suas perguntas<br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA7C11]">respondidas</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} style={style(i * 50)} className="border border-lux-gold/15 rounded-2xl overflow-hidden hover:border-lux-gold/30 transition-colors duration-300">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-lux-gold/3 transition-colors duration-200"
              >
                <span className="font-medium text-lux-dark text-sm md:text-base leading-snug">{faq.q}</span>
                <span className={`shrink-0 w-7 h-7 rounded-full border border-lux-gold/30 flex items-center justify-center text-lux-gold transition-transform duration-300 ${open === i ? 'rotate-45 bg-lux-gold text-white border-lux-gold' : ''}`}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-400 ${open === i ? 'max-h-60' : 'max-h-0'}`}>
                <p className="px-6 pb-6 text-lux-gray text-sm font-light leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA final */}
        <div className="mt-16 text-center" style={style(400)}>
          <p className="text-lux-gray text-sm mb-3">Ainda tem dúvidas? Fale direto com a Anna no WhatsApp</p>
          <WaButton href={WA_METODO} size="sm" id="faq-cta">Falar com Anna pelo WhatsApp</WaButton>
        </div>
      </div>
    </section>
  );
}

// ── FINAL CTA ─────────────────────────────────────────────────────────────────
function FinalCTASection() {
  return (
    <section className="w-full py-24 md:py-36 bg-lux-darker relative overflow-hidden">
      <div className="absolute inset-0">
        <video src="/videos/videocurso3.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-lux-darker/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-lux-darker via-transparent to-lux-darker" />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lux-gold/10 rounded-full blur-[150px] animate-pulse-slow" />

      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <span className="text-lux-gold text-xs tracking-[0.4em] uppercase font-bold block mb-6">Última Chance</span>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-6 text-balance">
          Sua carreira na estética começa com<br />
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#FFF1BA] animate-shimmer" style={{ backgroundSize: '200% auto' }}>
            uma decisão hoje
          </span>
        </h2>
        <p className="text-white/60 text-base md:text-lg font-light mb-12 leading-relaxed">
          Vagas limitadas. Turmas em Julho e Agosto de 2026. Não deixe para amanhã a oportunidade que pode mudar a sua vida.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-lux-gold to-lux-goldLight rounded-full blur opacity-60 animate-pulse" />
            <WaButton href={WA_METODO} id="final-cta-metodo">Quero o Método Anna Beauty</WaButton>
          </div>
        </div>
        <a href={WA_RECICLA} target="_blank" rel="noopener noreferrer" id="final-cta-recicla" className="text-white/40 hover:text-lux-goldLight text-xs tracking-widest uppercase underline underline-offset-4 transition-colors duration-300">
          Prefiro o Recicla Lash →
        </a>
      </div>
    </section>
  );
}

// ── NAVBAR DA LANDING ─────────────────────────────────────────────────────────
function CourseNavbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-lux-darker/90 backdrop-blur-lg border-b border-lux-gold/15 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.3)]' : 'bg-transparent py-5'}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-serif text-xl font-bold text-white tracking-tight leading-none">Anna</span>
          <span className="font-serif text-xl italic text-lux-goldLight tracking-tight leading-none -mt-0.5">Beauty</span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <a href="#modulos" className="text-white/60 hover:text-lux-goldLight text-xs tracking-widest uppercase transition-colors">Conteúdo</a>
          <a href="#curso-opcoes" className="text-white/60 hover:text-lux-goldLight text-xs tracking-widest uppercase transition-colors">Turmas</a>
          <a href="#oferta" className="text-white/60 hover:text-lux-goldLight text-xs tracking-widest uppercase transition-colors">Preços</a>
        </div>
        <WaButton href={WA_METODO} size="sm" id="nav-cta">Garantir Vaga</WaButton>
      </div>
    </nav>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function CourseFooter() {
  return (
    <footer className="w-full py-10 bg-lux-darker border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <span className="font-serif text-lg text-white">Anna<span className="italic text-lux-goldLight"> Beauty</span></span>
          <span className="text-white/30 text-xs ml-2">Academy</span>
        </div>
        <p className="text-white/25 text-xs text-center">
          © {new Date().getFullYear()} Anna Beauty. Todos os direitos reservados.
        </p>
        <a href="/" className="text-white/25 hover:text-lux-goldLight text-xs transition-colors">
          ← Voltar ao site
        </a>
      </div>
    </footer>
  );
}

// ── FLOATING WA BUTTON ────────────────────────────────────────────────────────
function FloatingWA() {
  return (
    <a
      id="floating-wa"
      href={WA_METODO}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.5)] hover:scale-110 hover:shadow-[0_6px_30px_rgba(37,211,102,0.7)] transition-all duration-300"
      aria-label="Fale conosco pelo WhatsApp"
    >
      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    </a>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function CoursePage() {
  useEffect(() => {
    document.title = 'Método Anna Beauty — Curso de Extensão de Cílios | Anna Beauty Academy';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Aprenda extensão de cílios do zero ao profissional em 2 dias intensivos com Anna Beauty. Teoria, prática em modelo real, apostila exclusiva e 1 mês de suporte. Vagas limitadas!');
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <CourseNavbar />
      <HeroSection />
      <PainSection />
      <CourseOptionsSection />
      <CurriculumSection />
      <BonusSection />
      <TestimonialsSection />
      <MentorSection />
      <OfferSection />
      <FAQSection />
      <FinalCTASection />
      <CourseFooter />
      <FloatingWA />
    </div>
  );
}
