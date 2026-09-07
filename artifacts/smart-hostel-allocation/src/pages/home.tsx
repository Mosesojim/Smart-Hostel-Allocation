import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, CheckCircle2, SlidersHorizontal, Sparkles, Map, Quote, Menu, X, MessageSquarePlus } from 'lucide-react';
import { IconBrand } from '../components/layout';

export function HomePage({ onLogin }: { onLogin: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  
  const testimonials = [
    {
      quote: "When the room fits the person, the whole semester starts on steadier ground.",
      name: "Amara Okafor",
      major: "Computer Science",
      level: "300 level",
      initials: "AO"
    },
    {
      quote: "Haven made it easy to find a roommate who respects my study schedule.",
      name: "Daniel Mensah",
      major: "Electrical Engineering",
      level: "400 level",
      initials: "DM"
    },
    {
      quote: "Finally, an allocation process that isn't a chaotic guessing game.",
      name: "Zainab Bello",
      major: "English & Literary Studies",
      level: "200 level",
      initials: "ZB"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  useEffect(() => {
    // Popup once in a while asking to drop a review
    const popupTimer = setTimeout(() => {
      setIsReviewModalOpen(true);
    }, 15000);
    return () => clearTimeout(popupTimer);
  }, []);

  const bgMain = '#FAF9F6';
  const textMain = '#2D2A26';
  const accent = '#C37D5C';
  const cardPeach = '#F5DCC4';
  const cardSage = '#DEEBE4';
  const cardDark = '#2A2B2A';
  const lineColor = '#E5E2DC';

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-in" style={{ background: bgMain, color: textMain, fontFamily: 'var(--app-font-sans)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navbar */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '20px 5%',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: bgMain,
        borderBottom: `1px solid ${lineColor}`
      }}>
        <div 
          onClick={scrollToTop} 
          style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
          role="button"
          tabIndex={0}
        >
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#181818', color: '#fff', display: 'grid', placeItems: 'center' }}>
            <IconBrand />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}>Haven</div>
            <div style={{ fontSize: 9, color: '#777', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Campus Living</div>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div style={{ gap: 32, fontSize: 14, fontWeight: 500, color: '#555' }} className="hide-on-mobile">
          <button type="button" onClick={() => scrollToSection('how-it-works')} className="home-nav-link">
            How it works
          </button>
          <button type="button" onClick={() => scrollToSection('for-students')} className="home-nav-link">
            For students
          </button>
          <button type="button" onClick={() => scrollToSection('for-housing-teams')} className="home-nav-link">
            For housing teams
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="hide-on-mobile" style={{ width: 1, height: 24, background: lineColor, marginRight: 8 }} />
          <button onClick={onLogin} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer', color: textMain }}>
            Sign in <ArrowUpRight size={16} strokeWidth={2.5} />
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
            aria-label="Toggle navigation menu"
            style={{
              background: 'transparent',
              border: `1px solid ${lineColor}`,
              borderRadius: 8,
              padding: '6px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: textMain
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden animate-slide-up"
          style={{
            position: 'sticky',
            top: 73,
            zIndex: 39,
            background: '#fff',
            borderBottom: `1px solid ${lineColor}`,
            padding: '20px 5% 24px',
            boxShadow: '0 12px 24px rgba(0,0,0,0.06)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              style={{ textAlign: 'left', background: 'none', border: 'none', fontSize: 15, fontWeight: 600, color: textMain, padding: '8px 0', cursor: 'pointer' }}
            >
              How it works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('for-students')}
              style={{ textAlign: 'left', background: 'none', border: 'none', fontSize: 15, fontWeight: 600, color: textMain, padding: '8px 0', cursor: 'pointer' }}
            >
              For students
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('for-housing-teams')}
              style={{ textAlign: 'left', background: 'none', border: 'none', fontSize: 15, fontWeight: 600, color: textMain, padding: '8px 0', cursor: 'pointer' }}
            >
              For housing teams
            </button>
            <div style={{ height: 1, background: lineColor, margin: '8px 0' }} />
            <button
              type="button"
              onClick={onLogin}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: '#181818',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                padding: '12px 20px',
                borderRadius: 99,
                border: 'none',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Sign in to Haven <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="home-section" style={{ 
        maxWidth: 1400, 
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div className="hero-grid">
          <div>
            <div className="animate-slide-up stagger-1" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <div style={{ width: 36, height: 1, background: accent }} />
              <span className="font-mono-eyebrow" style={{ fontSize: 11, color: '#777' }}>
                Housing that meets you where you are
              </span>
            </div>
            
            <h1 className="animate-slide-up stagger-2" style={{ fontSize: 'clamp(40px, 6.5vw, 84px)', fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 1.04, marginBottom: 28 }}>
              A room that feels <span className="font-serif-accent" style={{ color: accent, fontSize: '1.08em' }}>right</span> from the start.
            </h1>
            
            <p className="animate-slide-up stagger-3" style={{ fontSize: 'clamp(15px, 1.35vw, 18px)', color: '#555', lineHeight: 1.6, maxWidth: 500, marginBottom: 36 }}>
              Haven makes campus living more personal. Tell us how you live, and find a room — and a rhythm — that fits your next chapter.
            </p>
            
            <div className="animate-slide-up stagger-4" style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start' }}>
              <button onClick={onLogin} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#181818', color: '#fff', fontSize: 15, fontWeight: 600, padding: '16px 28px', borderRadius: 99, border: 'none', cursor: 'pointer', transition: 'transform 0.15s ease' }}>
                Explore the student experience <ArrowUpRight size={18} strokeWidth={2.2} />
              </button>
              <button 
                type="button" 
                onClick={() => scrollToSection('how-it-works')} 
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer', color: textMain }}
              >
                See how Haven works <ArrowDownRight size={16} strokeWidth={2.2} />
              </button>
            </div>
            
            <div className="animate-slide-up stagger-4" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 40, fontSize: 13, color: '#777' }}>
              <CheckCircle2 size={16} color="#999" /> Built around the details that make shared living work.
            </div>
          </div>

          <div className="hero-visual-wrapper animate-fade-in stagger-4">
            <div className="hero-image-container">
              <img 
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000" 
                alt="Students walking through sunlit campus quad" 
                className="hero-image"
                style={{ objectPosition: 'center 30%' }}
              />
              <div className="hero-image-badge">
                Life at Haven<br/><span style={{ fontWeight: 400, opacity: 0.85, fontSize: 12 }}>Campus living, realized.</span>
              </div>
              
              <div className="hero-floating-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span className="font-mono-eyebrow" style={{ fontSize: 10, color: '#777' }}>Match Found</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#16a34a' }}>94%</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 5, letterSpacing: '-0.02em', color: textMain }}>Mango House · B-214</div>
                <div style={{ fontSize: 12.5, color: '#666', lineHeight: 1.45, marginBottom: 14 }}>Quiet hours, second floor, close to Computer Science.</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#0284c7', background: '#e0f2fe', padding: '4px 12px', borderRadius: 99 }}>Study-friendly</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#16a34a', background: '#dcfce7', padding: '4px 12px', borderRadius: 99 }}>4 min walk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preferences Grid / For Students */}
      <section id="for-students" className="home-section" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <div className="font-mono-eyebrow" style={{ fontSize: 11, color: accent, marginBottom: 20 }}>
            More than a room number
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 20 }}>
            Preferences are not paperwork. <span className="font-serif-accent" style={{ color: accent, fontSize: '1.08em' }}>They are the beginning.</span>
          </h2>
          <p style={{ fontSize: 'clamp(15px, 1.35vw, 18px)', color: '#555', lineHeight: 1.6, maxWidth: 640 }}>
            Sleep schedules, study habits, floor preferences and the person you want beside you — Haven gives those details a meaningful place in the allocation conversation.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          <div style={{ background: cardPeach, borderRadius: 24, padding: 36, display: 'flex', flexDirection: 'column' }}>
            <div className="font-mono-eyebrow" style={{ fontSize: 11, color: '#888', marginBottom: 32 }}>01 of 03</div>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: '#FAF9F6', color: accent, display: 'grid', placeItems: 'center', marginBottom: 24 }}>
              <SlidersHorizontal size={24} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 14, color: textMain }}>Start with your everyday</h3>
            <p style={{ color: '#555', lineHeight: 1.6, marginBottom: 32, flex: 1, fontSize: 15 }}>
              Share the small signals that shape a good home base, from quiet hours to the kind of room where you do your best work.
            </p>
            <button onClick={onLogin} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer', color: textMain, padding: 0 }}>
              Build your profile <ArrowUpRight size={16} strokeWidth={2.2} />
            </button>
          </div>

          <div style={{ background: cardSage, borderRadius: 24, padding: 36, display: 'flex', flexDirection: 'column' }}>
            <div className="font-mono-eyebrow" style={{ fontSize: 11, color: '#888', marginBottom: 32 }}>02 of 03</div>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: '#FAF9F6', color: '#16a34a', display: 'grid', placeItems: 'center', marginBottom: 24 }}>
              <Sparkles size={24} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 14, color: textMain }}>See why it fits</h3>
            <p style={{ color: '#555', lineHeight: 1.6, marginBottom: 32, flex: 1, fontSize: 15 }}>
              Every recommendation is legible. Understand the match, compare what matters and keep your decision in your hands.
            </p>
            <button onClick={onLogin} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer', color: textMain, padding: 0 }}>
              Explore match signals <ArrowUpRight size={16} strokeWidth={2.2} />
            </button>
          </div>
        </div>

        <div style={{ background: cardDark, color: '#fff', borderRadius: 24, padding: 36, display: 'flex', flexDirection: 'column', marginTop: 24 }}>
          <div className="font-mono-eyebrow" style={{ fontSize: 11, color: '#888', marginBottom: 32 }}>03 of 03</div>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: '#3A3B3A', color: '#fff', display: 'grid', placeItems: 'center', marginBottom: 24 }}>
            <Map size={24} strokeWidth={1.5} />
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 14 }}>Arrive with confidence</h3>
          <p style={{ color: '#aaa', lineHeight: 1.6, marginBottom: 32, maxWidth: 500, fontSize: 15 }}>
            From allocation to move-in day, one calm timeline keeps the next step close and the important details easy to find.
          </p>
          <button onClick={onLogin} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer', color: '#fff', padding: 0 }}>
            See the journey <ArrowUpRight size={16} strokeWidth={2.2} />
          </button>
        </div>
      </section>

      {/* Steps List / How It Works */}
      <section id="how-it-works" className="home-section split-section" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="split-left">
          <div className="font-mono-eyebrow" style={{ fontSize: 11, color: '#777', marginBottom: 20 }}>
            A better way to allocate
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 1.05 }}>
            Less guesswork.<br/><span className="font-serif-accent" style={{ color: accent, fontSize: '1.08em' }}>More belonging.</span>
          </h2>
        </div>
        
        <div className="split-right">
          {[
            { num: '01', title: 'You tell Haven what matters', desc: 'Set your room type, floor, quiet hours and roommate preference in a few thoughtful choices.' },
            { num: '02', title: 'Haven makes the match visible', desc: 'See available hostels alongside fit scores, amenities, distance and the reasons behind each suggestion.' },
            { num: '03', title: 'Your team allocates with context', desc: 'Housing teams review one clear queue with availability, payment status and student fit in the same view.' }
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 20, borderBottom: i < 2 ? `1px solid ${lineColor}` : 'none', paddingBottom: 32, marginBottom: 32 }}>
              <div className="font-mono-eyebrow" style={{ fontSize: 13, color: accent, flexShrink: 0 }}>{step.num}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8, color: textMain }}>{step.title}</h3>
                <p style={{ color: '#555', lineHeight: 1.55, fontSize: 14.5 }}>{step.desc}</p>
              </div>
              <div style={{ flexShrink: 0 }}>
                <CheckCircle2 size={22} color="#16a34a" strokeWidth={1.6} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Admin UI Mockup / For Housing Teams */}
      <section id="for-housing-teams" className="home-section split-section" style={{ maxWidth: 1200, margin: '0 auto', alignItems: 'center' }}>
        <div className="split-left">
          <div className="font-mono-eyebrow" style={{ fontSize: 11, color: accent, marginBottom: 20 }}>
            For housing teams
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 20 }}>
            Clarity for the people making <span className="font-serif-accent" style={{ color: accent, fontSize: '1.08em' }}>hundreds of homes.</span>
          </h2>
          <p style={{ fontSize: 15.5, color: '#555', lineHeight: 1.6, marginBottom: 32 }}>
            Haven brings the allocation queue, floor plan and student preferences into one considered workspace — so every decision can be quick, fair and easy to explain.
          </p>
          <button onClick={onLogin} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: cardPeach, color: textMain, fontSize: 14, fontWeight: 700, padding: '16px 28px', borderRadius: 99, border: 'none', cursor: 'pointer' }}>
            Enter the admin demo <ArrowUpRight size={18} strokeWidth={2.2} />
          </button>
        </div>

        <div className="split-right">
          <div style={{ background: cardDark, borderRadius: 24, padding: '24px 24px 0', boxShadow: '0 24px 48px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#555' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#555' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#555' }} />
              <span className="font-mono-eyebrow" style={{ marginLeft: 16, fontSize: 10, color: '#888' }}>Haven / allocation queue</span>
            </div>
            <div style={{ background: bgMain, borderRadius: '16px 16px 0 0', padding: '28px 20px', overflowX: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, minWidth: 260 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', color: textMain }}>Today's allocation queue</h3>
                <span style={{ fontSize: 12, fontWeight: 700, color: accent }}>12 waiting</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { name: 'Daniel Mensah', major: 'Electrical Engineering', score: '91%', status: 'Review', bg: cardSage, avBg: '#DEEBE4' },
                  { name: 'Zainab Bello', major: 'English & Literary Studies', score: '87%', status: 'Ready', bg: '#dcfce7', avBg: cardPeach },
                  { name: 'Chisom Eze', major: 'Architecture', score: '84%', status: 'Review', bg: cardSage, avBg: '#e0f2fe' }
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 14, borderBottom: i < 2 ? `1px solid ${lineColor}` : 'none', minWidth: 260, gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: s.avBg, display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, color: '#555', flexShrink: 0 }}>
                        {s.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: textMain }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: '#777' }}>{s.major}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#16a34a' }}>{s.score}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 99, background: s.status === 'Ready' ? '#dcfce7' : cardPeach, color: s.status === 'Ready' ? '#16a34a' : accent }}>
                        {s.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="home-section" style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <div style={{ display: 'inline-flex', marginBottom: 28, color: accent }}>
          <Quote size={40} strokeWidth={1} fill="currentColor" opacity={0.25} />
        </div>
        <div style={{ minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 className="animate-fade-in" key={`quote-${activeTestimonial}`} style={{ fontSize: 'clamp(26px, 3.8vw, 44px)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.25, marginBottom: 36, color: textMain }}>
            {testimonials[activeTestimonial].quote}
          </h2>
          <div className="animate-fade-in" key={`author-${activeTestimonial}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: cardPeach, display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 700, color: accent }}>
              {testimonials[activeTestimonial].initials}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: textMain }}>{testimonials[activeTestimonial].name}</div>
              <div style={{ fontSize: 12, color: '#777' }}>{testimonials[activeTestimonial].major} · {testimonials[activeTestimonial].level}</div>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTestimonial(idx)}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                padding: 0,
                border: 'none',
                background: activeTestimonial === idx ? accent : '#E5E2DC',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>

        <button 
          onClick={() => setIsReviewModalOpen(true)}
          style={{ 
            marginTop: 40, 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 8, 
            background: '#FAF9F6', 
            color: accent, 
            border: `1px solid ${lineColor}`, 
            padding: '12px 24px', 
            borderRadius: 99, 
            fontSize: 14, 
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}
        >
          <MessageSquarePlus size={18} />
          Drop a Review
        </button>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '0 5% 80px' }}>
        <div style={{ 
          background: cardPeach, 
          borderRadius: 32, 
          padding: '68px 5%', 
          textAlign: 'center',
          maxWidth: 1200,
          margin: '0 auto'
        }}>
          <div>
            <div className="font-mono-eyebrow" style={{ fontSize: 11, color: accent, marginBottom: 20 }}>
              Your next chapter has an address
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 7vw, 68px)', fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 1.05, marginBottom: 20 }}>
              Come find your <span className="font-serif-accent" style={{ color: accent, fontSize: '1.08em' }}>place.</span>
            </h2>
            <p style={{ fontSize: 15.5, color: '#555', marginBottom: 36 }}>
              See what a more considered allocation feels like.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              <button onClick={onLogin} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#181818', color: '#fff', fontSize: 15, fontWeight: 600, padding: '15px 30px', borderRadius: 99, border: 'none', cursor: 'pointer' }}>
                Explore Haven <ArrowUpRight size={18} strokeWidth={2.2} />
              </button>
              <button onClick={onLogin} style={{ background: 'transparent', border: 'none', color: textMain, fontSize: 15, fontWeight: 600, cursor: 'pointer', padding: '14px 16px' }}>
                Sign in to your account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${lineColor}`, padding: '40px 5% calc(40px + env(safe-area-inset-bottom, 0px))' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
          <div 
            onClick={scrollToTop}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
            role="button"
            tabIndex={0}
          >
            <div style={{ width: 24, height: 24, borderRadius: 6, background: '#181818', color: '#fff', display: 'grid', placeItems: 'center' }}>
              <IconBrand />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em' }}>Haven</div>
            <div style={{ fontSize: 8, color: '#777', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Campus Living</div>
          </div>
          
          <div style={{ fontSize: 13, color: '#777' }}>
            Considered housing for the years that shape you.
          </div>
        </div>
      </footer>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            background: bgMain,
            borderRadius: 24,
            width: '100%',
            maxWidth: 480,
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${lineColor}` }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: textMain }}>Share your experience</h3>
                <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Help others find their perfect campus home.</p>
              </div>
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  padding: 8, 
                  cursor: 'pointer', 
                  color: '#666',
                  borderRadius: '50%',
                  display: 'flex'
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: textMain }}>Your Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Jane Doe"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${lineColor}`, fontSize: 15, background: '#fff' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: textMain }}>Major & Level</label>
                <input 
                  type="text" 
                  placeholder="e.g. Computer Science · 300 level"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${lineColor}`, fontSize: 15, background: '#fff' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: textMain }}>Your Review</label>
                <textarea 
                  rows={4}
                  placeholder="What was it like finding a room through Haven?"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${lineColor}`, fontSize: 15, background: '#fff', resize: 'vertical' }}
                />
              </div>
              
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                style={{
                  background: accent,
                  color: '#fff',
                  border: 'none',
                  padding: '16px',
                  borderRadius: 99,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: 8
                }}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


