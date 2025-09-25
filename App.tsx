import React, { useState, useEffect, useRef, FormEvent, Suspense, useMemo } from 'react';
  import { Canvas, useFrame } from '@react-three/fiber';
  import { Icosahedron, Stars, Ring } from '@react-three/drei';
  import { Swiper, SwiperSlide } from 'swiper/react';
  import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';

  import { Extracurricular, Announcement, RegistrationDetails } from './types';
  import { EXTRACURRICULARS, CLASSES, ANNOUNCEMENTS, SCHOOL_LOGO_PATH, SCHOOL_NAME } from './constants';


  declare var html2canvas: any;
  declare var jspdf: any;

  // Custom hook for scroll animations
  const useIntersectionObserver = (options: IntersectionObserverInit) => {
    const containerRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if(containerRef.current) {
              observer.unobserve(containerRef.current);
          }
        }
      }, options);
      if (containerRef.current) observer.observe(containerRef.current);
      return () => {
        if (containerRef.current) observer.unobserve(containerRef.current);
      };
    }, [containerRef, options]);
    return [containerRef, isVisible] as const;
  };

  const Reveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
      const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
      return (
          <div ref={ref as React.RefObject<HTMLDivElement>} className={`${className} reveal ${isVisible ? 'visible' : ''}`}>
              {children}
          </div>
      );
  };

  // Rotating spherical particle system
  const Particles = ({ count = 3000 }) => {
    const pointsRef = useRef<any>(null);

    const particles = useMemo(() => {
      const p = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const r = 5 + Math.random() * 5; // radius
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos((2 * Math.random()) - 1);
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        p.set([x, y, z], i * 3);
      }
      return p;
    }, [count]);

    useFrame(() => {
      if (pointsRef.current) {
        pointsRef.current.rotation.y += 0.0005;
        pointsRef.current.rotation.x += 0.0002;
      }
    });

    return (
      <points ref={pointsRef}>
        {
          // @ts-ignore
          <bufferGeometry>
          {
            // @ts-ignore
            <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
          }
        </bufferGeometry>
        }
        {
          // @ts-ignore
          <pointsMaterial size={0.02} color="#0891b2" sizeAttenuation={true} transparent opacity={0.7} />
        }
      </points>
    );
  };
  
  // New vertically floating particle system
  const FloatingParticles = ({ count = 1500 }) => {
    const pointsRef = useRef<any>(null);

    const particles = useMemo(() => {
      const p = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 25;
        const y = (Math.random() - 0.5) * 25;
        const z = (Math.random() - 0.5) * 15;
        p.set([x, y, z], i * 3);
      }
      return p;
    }, [count]);

    useFrame((state) => {
      if (pointsRef.current) {
        const positions = pointsRef.current.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          // Float upwards
          positions[i + 1] += 0.01;
          // Add horizontal drift
          positions[i] += Math.sin(state.clock.elapsedTime + i) * 0.001;
          
          // Reset particle to bottom if it goes too high
          if (positions[i + 1] > 12) {
            positions[i + 1] = -12;
          }
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
      }
    });

    return (
      <points ref={pointsRef}>
        {
        // @ts-ignore
        <bufferGeometry>
        {
          // @ts-ignore
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        }
        </bufferGeometry>
        }
        {
        // @ts-ignore
        <pointsMaterial
          size={0.03}
          color="#a855f7"
          sizeAttenuation
          transparent
          opacity={0.6}
        />
        }
      </points>
    );
  };

  const GlowingRings = () => {
    const ring1 = useRef<any>(null);
    const ring2 = useRef<any>(null);
    const ring3 = useRef<any>(null);

    useFrame(() => {
        if(ring1.current) ring1.current.rotation.x = ring1.current.rotation.y += 0.002;
        if(ring2.current) ring2.current.rotation.x = ring2.current.rotation.y -= 0.003;
        if(ring3.current) ring3.current.rotation.z += 0.004;
    });

    return (
      <>
        <Ring ref={ring1} args={[3.5, 3.55, 64]} rotation={[Math.PI / 2, 0, 0]}>
          { // @ts-ignore
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} toneMapped={false} transparent opacity={0.5} /> 
          }
        </Ring>
        <Ring ref={ring2} args={[4, 4.05, 64]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          { // @ts-ignore
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} toneMapped={false} transparent opacity={0.4} /> 
          }
        </Ring>
         <Ring ref={ring3} args={[4.5, 4.55, 64]} rotation={[-Math.PI / 3, -Math.PI / 4, 0]}>
          { // @ts-ignore
            <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} toneMapped={false} transparent opacity={0.3} /> 
          }
        </Ring>
      </>
    );
  }

  const Crystal = () => {
    const meshRef = useRef<any>(null);
    useFrame(() => {
      if(meshRef.current) {
          meshRef.current.rotation.x += 0.001;
          meshRef.current.rotation.y += 0.002;
      }
    });
    return (
      <Icosahedron ref={meshRef} args={[2.5, 1]} position={[0, 0, 0]}>
        {
          // @ts-ignore
          <meshStandardMaterial color="#0891b2" emissive="#0e7490" roughness={0.1} metalness={0.9} wireframe />
        }
      </Icosahedron>
    );
  };

  const HeroScene = () => (
      <div className="absolute top-0 left-0 w-full h-screen -z-10">
          <Canvas camera={{ position: [0, 0, 12] }}>
              <Suspense fallback={null}>
                  {
                    // @ts-ignore
                    <ambientLight intensity={0.5} />
                  }
                  {
                    // @ts-ignore
                    <pointLight position={[10, 10, 10]} intensity={2} />
                  }
                  <Crystal />
                  <Particles />
                  <FloatingParticles />
                  <GlowingRings />
                  <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
              </Suspense>
          </Canvas>
      </div>
  );

  const Preloader: React.FC = () => (
    <div className="preloader animate-fadeIn">
      <div className="spinner"></div>
      <p className="font-semibold tracking-widest text-sm uppercase">Memuat Portal...</p>
    </div>
  );
  
  const CustomCursor: React.FC = () => {
    useEffect(() => {
      const cursorDot = document.querySelector('.custom-cursor-dot') as HTMLElement;
      const cursorOutline = document.querySelector('.custom-cursor-outline') as HTMLElement;
  
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX: posX, clientY: posY } = e;
        if(cursorDot) cursorDot.style.transform = `translate(${posX - 4}px, ${posY - 4}px)`;
        if(cursorOutline) cursorOutline.style.transform = `translate(${posX - 20}px, ${posY - 20}px)`;
      };
      
      const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('a, button, .swiper-slide, input, select')) {
          cursorOutline?.classList.add('hover');
        }
      };
      
      const handleMouseOut = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('a, button, .swiper-slide, input, select')) {
          cursorOutline?.classList.remove('hover');
        }
      };
  
      window.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseover', handleMouseOver);
      document.addEventListener('mouseout', handleMouseOut);
  
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('mouseout', handleMouseOut);
      };
    }, []);
  
    return null; // The elements are in index.html
  };

  const ScrollToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
      const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };
      window.addEventListener('scroll', toggleVisibility);
      return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);
  
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  
    return (
      <button
        onClick={scrollToTop}
        className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
        aria-label="Scroll to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    );
  };

  const ThemeToggleButton: React.FC<{ theme: string; onToggle: () => void; }> = ({ theme, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800/50 hover:bg-slate-700/70 transition-colors text-amber-300 hover:text-amber-200"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.95a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414l-.707.707zm-2.12-10.607a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z" clipRule="evenodd" />
                </svg>
            )}
        </button>
    );
  };


  const LoginModal: React.FC<{ onLogin: () => void; }> = ({ onLogin }) => {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');

      const handleLogin = (e: FormEvent) => {
          e.preventDefault();
          if (username === 'admin' && password === 'password') {
              setError('');
              onLogin();
          } else {
              setError('Username atau Password salah.');
          }
      };

      return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/80 backdrop-blur-sm animate-fadeIn">
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl p-8 w-full max-w-sm animate-scaleIn">
                  <img src={SCHOOL_LOGO_PATH} alt="Logo Sekolah" className="h-20 w-20 mx-auto mb-4"/>
                  <h2 className="text-2xl font-bold text-center text-white mb-2">Selamat Datang</h2>
                  <p className="text-center text-slate-400 mb-6">Portal Ekstrakurikuler SMKN 9 Semarang</p>
                  <form onSubmit={handleLogin} className="space-y-4">
                      <FormInput label="Username" id="username" value={username} onChange={e => setUsername(e.target.value)} required placeholder="admin"/>
                      <FormInput label="Password" id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="password"/>
                      {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                      <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30">
                          Login
                      </button>
                  </form>
              </div>
          </div>
      );
  };


  const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [registrationDetails, setRegistrationDetails] = useState<RegistrationDetails | null>(null);
    const [showProof, setShowProof] = useState(false);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [selectedAnnouncementUrl, setSelectedAnnouncementUrl] = useState('');
    const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
    const [theme, setTheme] = useState('dark');

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'light') {
            root.classList.add('light-theme');
        } else {
            root.classList.remove('light-theme');
        }
    }, [theme]);

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
      const handleScroll = () => setIsHeaderScrolled(window.scrollY > 50);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleFormSubmit = (details: RegistrationDetails) => {
      setRegistrationDetails(details);
      setShowProof(true);
    };
    
    const handleAnnouncementClick = (url: string) => {
      setSelectedAnnouncementUrl(url);
      setShowAnnouncementModal(true);
    };

    const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
      <a href={href} className="text-slate-300 hover:text-white transition-colors duration-300 font-medium px-4 py-2 rounded-md">{children}</a>
    );

    if (isLoading) {
      return <Preloader />;
    }

    if (!isAuthenticated) {
      return (
        <>
          <CustomCursor />
          <LoginModal onLogin={() => setIsAuthenticated(true)} />
        </>
      );
    }
    
    return (
      <div className="bg-slate-900 text-slate-200">
        <CustomCursor />
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHeaderScrolled ? 'bg-slate-900/70 backdrop-blur-md shadow-lg shadow-cyan-500/10' : 'bg-transparent'}`}>
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img src={SCHOOL_LOGO_PATH} alt="Logo Sekolah" className="h-10 w-10"/>
              <span className="text-xl font-bold text-white tracking-wider">SMKN 9 Semarang</span>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <NavLink href="#home">Home</NavLink>
              <NavLink href="#gallery">Galeri</NavLink>
              <NavLink href="#announcements">Pengumuman</NavLink>
              <NavLink href="#register">Pendaftaran</NavLink>
              <ThemeToggleButton theme={theme} onToggle={toggleTheme} />
            </div>
          </nav>
        </header>

        <main>
          <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <HeroScene />
            <div className="container mx-auto px-6 text-center relative">
              <Reveal>
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4 text-glow">Portal Ekstrakurikuler</h1>
                <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">Temukan Bakatmu, Kembangkan Potensimu di SMKN 9 Semarang.</p>
                <a href="#register" className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 px-8 rounded-full hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 inline-block shadow-lg hover:shadow-purple-500/50">
                  Daftar Sekarang
                </a>
              </Reveal>
            </div>
          </section>

          <div className="relative bg-slate-900 z-10">
            <section id="gallery" className="py-20 overflow-hidden">
              <div className="container mx-auto px-6">
                <Reveal>
                  <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Galeri Ekstrakurikuler</h2>
                  <p className="text-center text-slate-400 max-w-2xl mx-auto mb-12">Geser untuk melihat berbagai pilihan kegiatan untuk menyalurkan minat dan bakatmu.</p>
                </Reveal>
                <Reveal>
                  <ExtracurricularCarousel extras={EXTRACURRICULARS} />
                </Reveal>
              </div>
            </section>

            <section id="announcements" className="py-20 bg-slate-900/50">
              <div className="container mx-auto px-6">
                <Reveal>
                  <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Pengumuman Terbaru</h2>
                  <p className="text-center text-slate-400 max-w-2xl mx-auto mb-12">Informasi penting seputar seleksi dan jadwal kegiatan ekstrakurikuler.</p>
                </Reveal>
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {ANNOUNCEMENTS.map(item => (
                        <Reveal key={item.id}>
                            <AnnouncementCard announcement={item} onClick={handleAnnouncementClick} />
                        </Reveal>
                    ))}
                </div>
              </div>
            </section>

            <section id="register" className="py-20">
                <RegistrationForm onSubmit={handleFormSubmit} />
            </section>
          </div>
        </main>

        {showProof && registrationDetails && <RegistrationProofModal details={registrationDetails} onClose={() => setShowProof(false)} />}
        {showAnnouncementModal && <AnnouncementModal url={selectedAnnouncementUrl} onClose={() => setShowAnnouncementModal(false)} />}

        <footer className="bg-slate-900/50 border-t border-slate-800 text-white py-8">
          <div className="container mx-auto px-6 text-center text-slate-400">
            <p>Copyright &copy; {new Date().getFullYear()} - {SCHOOL_NAME}</p>
            <p className="text-sm">Jl.Peterongansari No.2 Semarang | Telp: (024) 83127253</p>
          </div>
        </footer>
        <ScrollToTopButton />
      </div>
    );
  };

  const ExtracurricularCard: React.FC<{ extra: Extracurricular }> = ({ extra }) => (
      <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden group border border-slate-700 hover:border-cyan-500 h-full w-full relative flex flex-col">
          <div className="relative h-2/3">
              <img src={extra.image} alt={extra.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <h3 className="absolute bottom-4 left-4 text-white text-2xl font-bold">{extra.name}</h3>
          </div>
          <div className="p-5 flex-grow">
              <p className="text-slate-400 text-sm">{extra.description}</p>
          </div>
      </div>
  );

  const ExtracurricularCarousel: React.FC<{ extras: Extracurricular[] }> = ({ extras }) => {
    return (
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        loop={true}
        coverflowEffect={{
          rotate: 35,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="extracurricular-carousel"
      >
        {extras.map(extra => (
          <SwiperSlide key={extra.id}>
              <ExtracurricularCard extra={extra} />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };


  const AnnouncementCard: React.FC<{ announcement: Announcement, onClick: (url: string) => void }> = ({ announcement, onClick }) => {
      const colorMap: {[key: string]: { iconBg: string, iconColor: string, glow: string, border: string }} = {
        'border-rose-500': { iconBg: 'bg-rose-900/40', iconColor: 'text-rose-300', glow: 'hover:shadow-rose-500/20', border: 'border-rose-500/40' },
        'border-green-500': { iconBg: 'bg-green-900/40', iconColor: 'text-green-300', glow: 'hover:shadow-green-500/20', border: 'border-green-500/40' },
        'border-purple-500': { iconBg: 'bg-purple-900/40', iconColor: 'text-purple-300', glow: 'hover:shadow-purple-500/20', border: 'border-purple-500/40' },
        'border-red-500': { iconBg: 'bg-red-900/40', iconColor: 'text-red-300', glow: 'hover:shadow-red-500/20', border: 'border-red-500/40' },
      };
      const colors = colorMap[announcement.borderColor] || colorMap['border-purple-500'];

      return (
          <div className={`bg-slate-800/40 backdrop-blur-sm border ${colors.border} rounded-xl shadow-lg transition-all duration-300 ${colors.glow} hover:-translate-y-1`}>
              <div className="p-6 flex items-start space-x-5">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${colors.iconBg} border ${colors.border}`}>
                      <svg className={`w-6 h-6 ${colors.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={announcement.icon}></path></svg>
                  </div>
                  <div className="flex-grow">
                      <h3 className="font-semibold text-slate-100 text-lg">{announcement.title}</h3>
                      <p className="text-sm text-slate-400 mt-1 mb-4">{announcement.description}</p>
                      <button onClick={() => onClick(announcement.sheetUrl)} className="bg-slate-700/50 text-cyan-300 text-xs font-semibold py-2 px-4 rounded-full hover:bg-slate-700 transition-colors border border-slate-600 hover:border-cyan-400">
                          Baca Selengkapnya
                      </button>
                  </div>
              </div>
          </div>
      );
  };

  const RegistrationForm: React.FC<{ onSubmit: (details: RegistrationDetails) => void; }> = ({ onSubmit }) => {
      const [fullName, setFullName] = useState('');
      const [nisn, setNisn] = useState('');
      const [studentClass, setStudentClass] = useState('');
      const [address, setAddress] = useState('');
      const [extracurricularId, setExtracurricularId] = useState('');
      const [isSubmitting, setIsSubmitting] = useState(false);

      const handleSubmit = (e: FormEvent) => {
          e.preventDefault();
          if(isSubmitting) return;

          setIsSubmitting(true);
          
          setTimeout(() => {
              const extracurricular = EXTRACURRICULARS.find(s => s.id === Number(extracurricularId)) || null;
              onSubmit({
                  fullName,
                  nisn,
                  studentClass,
                  address,
                  extracurricular,
                  registrationDate: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
              });
              // No need to reset isSubmitting, as the component will be replaced by the modal
          }, 1500);
      };

      return (
          <Reveal className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Form Pendaftaran</h2>
              <p className="text-center text-slate-400 max-w-2xl mx-auto mb-12">Isi data di bawah ini dengan lengkap dan benar untuk mendaftar.</p>
              <div className="max-w-2xl mx-auto bg-slate-800/50 border border-slate-700 p-8 rounded-xl shadow-2xl">
                  <form onSubmit={handleSubmit} className="space-y-6">
                      <FormInput label="Nama Lengkap" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required />
                      <FormInput label="NISN" id="nisn" type="number" value={nisn} onChange={e => setNisn(e.target.value)} required />
                      <FormSelect label="Kelas & Jurusan" id="studentClass" value={studentClass} onChange={e => setStudentClass(e.target.value)} required>
                          <option value="" disabled>Pilih Kelas...</option>
                          {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                      </FormSelect>
                      <FormInput label="Alamat Rumah" id="address" value={address} onChange={e => setAddress(e.target.value)} required />
                      <FormSelect label="Pilihan Ekstrakurikuler" id="extracurricular" value={extracurricularId} onChange={e => setExtracurricularId(e.target.value)} required>
                          <option value="" disabled>Pilih Ekstrakurikuler...</option>
                          {EXTRACURRICULARS.map(extra => <option key={extra.id} value={extra.id}>{extra.name}</option>)}
                      </FormSelect>
                      
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed hover:from-cyan-600 hover:to-purple-700 hover:scale-105 hover:shadow-purple-500/30"
                      >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Mengirim...
                            </>
                          ) : 'Kirim Pendaftaran'}
                      </button>
                  </form>
              </div>
          </Reveal>
      );
  };

  const FormInput: React.FC<any> = ({ label, id, ...props }) => (
      <div>
          <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
          <input id={id} {...props} className="mt-1 block w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"/>
      </div>
  );

  const FormSelect: React.FC<any> = ({ label, id, children, ...props }) => (
      <div>
          <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
          <select id={id} {...props} className="mt-1 block w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
              {children}
          </select>
      </div>
  );

  const RegistrationProofModal: React.FC<{ details: RegistrationDetails; onClose: () => void; }> = ({ details, onClose }) => {
      const proofRef = useRef<HTMLDivElement>(null);

      const handleDownload = () => {
          if (proofRef.current) {
              html2canvas(proofRef.current, { scale: 2, backgroundColor: '#ffffff' }).then((canvas: any) => {
                  const imgData = canvas.toDataURL('image/png');
                  const pdf = new jspdf.jsPDF({ orientation: 'p', unit: 'px', format: [canvas.width, canvas.height] });
                  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                  pdf.save(`bukti-pendaftaran-${details.fullName.replace(/\s/g, '-')}.pdf`);
              });
          }
      };
      
      const DetailRow: React.FC<{ label: string, value: string | undefined | null }> = ({ label, value }) => (
        <tr className="border-b border-gray-200">
          <td className="py-2 px-4 w-1/3 font-medium text-slate-600">{label}</td>
          <td className="py-2 px-4 font-semibold text-slate-800">{value || '-'}</td>
        </tr>
      );

      return (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn">
              <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scaleIn">
                  <div ref={proofRef} className="p-8 bg-white printable-area text-slate-800 overflow-y-auto">
                      <header className="text-center mb-6">
                          <img src={SCHOOL_LOGO_PATH} alt="School Logo" className="w-20 h-20 mx-auto mb-2" />
                          <h2 className="text-xl font-bold text-gray-800">{SCHOOL_NAME}</h2>
                          <h3 className="text-lg font-semibold text-gray-700">BUKTI PENDAFTARAN EKSTRAKULIKULER</h3>
                      </header>
                      
                      <div className="my-6 border-t-2 border-b-2 border-gray-800 py-2">
                          <h4 className="text-md font-bold text-center text-gray-800">Data Pendaftaran Siswa</h4>
                      </div>
                      
                      <table className="w-full text-left text-sm mb-8">
                          <tbody>
                            <DetailRow label="Nama Lengkap" value={details.fullName} />
                            <DetailRow label="NISN" value={details.nisn} />
                            <DetailRow label="Kelas" value={details.studentClass} />
                            <DetailRow label="Alamat" value={details.address} />
                            <DetailRow label="Ekstrakurikuler" value={details.extracurricular?.name} />
                          </tbody>
                      </table>

                      <footer className="flex justify-between items-start pt-8 text-center text-sm">
                          <div>
                              <p>Tanda Tangan Siswa,</p>
                              <div className="h-20"></div>
                              <p className="font-semibold border-t pt-1 border-gray-400">({details.fullName})</p>
                          </div>
                          <div className="text-right">
                            <p>Semarang, {new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                            <p>Tanda Tangan Orang Tua/Wali,</p>
                            <div className="h-20"></div>
                            <p className="font-semibold border-t pt-1 border-gray-400">(Orang Tua/Wali)</p>
                          </div>
                      </footer>
                  </div>
                  <div className="bg-slate-900/50 p-4 flex justify-end space-x-3 rounded-b-lg">
                      <button onClick={onClose} className="px-5 py-2 rounded-md font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors">Tutup</button>
                      <button onClick={handleDownload} className="px-5 py-2 rounded-md font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 transition-colors">Unduh PDF</button>
                  </div>
              </div>
          </div>
      );
  };

  const AnnouncementModal: React.FC<{ url: string, onClose: () => void }> = ({ url, onClose }) => {
      return (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
              <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col animate-scaleIn" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                      <h3 className="font-semibold text-slate-200">Detail Pengumuman</h3>
                      <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
                  </div>
                  <div className="flex-grow p-2 bg-white">
                      <iframe src={url} className="w-full h-full border-0" title="Pengumuman"></iframe>
                  </div>
              </div>
          </div>
      );
  };


  export default App;