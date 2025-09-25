import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Extracurricular, Announcement, RegistrationDetails } from './types';
import { EXTRACURRICULARS, CLASSES, ANNOUNCEMENTS, SCHOOL_LOGO_PATH, SCHOOL_NAME } from './constants';

import logosmk from './src/logosmk9.png';
import headerimage from './src/header.jpeg';

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

const App: React.FC = () => {
  const [registrationDetails, setRegistrationDetails] = useState<RegistrationDetails | null>(null);
  const [showProof, setShowProof] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [selectedAnnouncementUrl, setSelectedAnnouncementUrl] = useState('');
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

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
    <a href={href} className="text-gray-300 hover:text-white transition-colors duration-300 font-medium px-3 py-2 rounded-md">{children}</a>
  );

  return (
    <div className="bg-slate-100 text-slate-800">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHeaderScrolled ? 'bg-blue-800 backdrop-blur-md shadow-lg' : ''}`}>
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src={logosmk} alt="Logo Sekolah" className="h-10 "/>
            <span className="text-xl font-bold text-white tracking-wider">SMKN 9 Semarang</span>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <NavLink href="#home">Home</NavLink>
            <NavLink href="#gallery">Galeri Ekstra</NavLink>
            <NavLink href="#announcements">Pengumuman</NavLink>
            <NavLink href="#register">Pendaftaran</NavLink>
          </div>
        </nav>
      </header>

      <main>
        <section id="home" className="min-h-screen flex items-center bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${headerimage})` }}>
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="container mx-auto px-6 text-center relative">
            <Reveal>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">Portal Ekstrakurikuler</h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8">Temukan Bakatmu, Kembangkan Potensimu di SMKN 9 Semarang.</p>
              <a href="#register" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105 inline-block">
                Daftar Sekarang
              </a>
            </Reveal>
          </div>
        </section>

        <section id="gallery" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <Reveal>
              <h2 className="text-3xl font-bold text-center mb-4">Galeri Ekstrakurikuler</h2>
              <p className="text-center text-slate-600 max-w-2xl mx-auto mb-12">Lihat berbagai pilihan kegiatan untuk menyalurkan minat dan bakatmu.</p>
            </Reveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {EXTRACURRICULARS.map(extra => <ExtracurricularCard key={extra.id} extra={extra} />)}
            </div>
          </div>
        </section>

        <section id="announcements" className="py-20 bg-slate-100">
          <div className="container mx-auto px-6">
            <Reveal>
              <h2 className="text-3xl font-bold text-center mb-4">Pengumuman</h2>
              <p className="text-center text-slate-600 max-w-2xl mx-auto mb-12">Informasi terbaru seputar seleksi dan kegiatan ekstrakurikuler.</p>
            </Reveal>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {ANNOUNCEMENTS.map(item => (
                    <Reveal key={item.id}>
                        <AnnouncementCard announcement={item} onClick={handleAnnouncementClick} />
                    </Reveal>
                ))}
            </div>
          </div>
        </section>

        <section id="register" className="py-20 bg-white">
            <RegistrationForm onSubmit={handleFormSubmit} />
        </section>
      </main>

      {showProof && registrationDetails && <RegistrationProofModal details={registrationDetails} onClose={() => setShowProof(false)} />}
      {showAnnouncementModal && <AnnouncementModal url={selectedAnnouncementUrl} onClose={() => setShowAnnouncementModal(false)} />}

      <footer className="bg-blue-800 text-white py-6">
        <div className="container mx-auto px-6 text-center text-blue-200">
          <p>Copyright &copy; {new Date().getFullYear()} - {SCHOOL_NAME}</p>
          <p className="text-sm">Jl.Peterongansari No.2 Semarang | Telp: (024) 83127253</p>
        </div>
      </footer>
    </div>
  );
};

const ExtracurricularCard: React.FC<{ extra: Extracurricular }> = ({ extra }) => (
    <Reveal className="bg-white rounded-lg shadow-md overflow-hidden group">
        <div className="relative h-56">
            <img src={extra.image} alt={extra.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/30"></div>
            <h3 className="absolute bottom-4 left-4 text-white text-2xl font-bold">{extra.name}</h3>
        </div>
        <div className="p-5">
            <p className="text-slate-600 text-sm">{extra.description}</p>
        </div>
    </Reveal>
);

const AnnouncementCard: React.FC<{ announcement: Announcement, onClick: (url: string) => void }> = ({ announcement, onClick }) => (
    <div className={`bg-white p-5 rounded-lg shadow-sm border-l-4 ${announcement.borderColor} flex items-start space-x-4`}>
        <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={announcement.icon}></path></svg>
        </div>
        <div className="flex-grow">
            <h3 className="font-semibold text-gray-800">{announcement.title}</h3>
            <p className="text-sm text-gray-500 mb-3">{announcement.description}</p>
            <button onClick={() => onClick(announcement.sheetUrl)} className="bg-blue-600 text-white text-sm font-semibold py-1 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Klik Disini
            </button>
        </div>
    </div>
);

const RegistrationForm: React.FC<{ onSubmit: (details: RegistrationDetails) => void; }> = ({ onSubmit }) => {
    const [fullName, setFullName] = useState('');
    const [nisn, setNisn] = useState('');
    const [studentClass, setStudentClass] = useState('');
    const [address, setAddress] = useState('');
    const [extracurricularId, setExtracurricularId] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const extracurricular = EXTRACURRICULARS.find(s => s.id === Number(extracurricularId)) || null;
        
        onSubmit({
            fullName,
            nisn,
            studentClass,
            address,
            extracurricular,
            registrationDate: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
        });
    };

    return (
        <Reveal className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-4">Form Pendaftaran</h2>
            <p className="text-center text-slate-600 max-w-2xl mx-auto mb-12">Isi data di bawah ini dengan lengkap dan benar.</p>
            <div className="max-w-2xl mx-auto bg-slate-50 p-8 rounded-xl shadow-lg">
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
                    
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md">
                        Kirim Pendaftaran
                    </button>
                </form>
            </div>
        </Reveal>
    );
};

const FormInput: React.FC<any> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input id={id} {...props} className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
    </div>
);

const FormSelect: React.FC<any> = ({ label, id, children, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select id={id} {...props} className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            {children}
        </select>
    </div>
);

const RegistrationProofModal: React.FC<{ details: RegistrationDetails; onClose: () => void; }> = ({ details, onClose }) => {
    const proofRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        if (proofRef.current) {
            html2canvas(proofRef.current, { scale: 2 }).then((canvas: any) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jspdf.jsPDF({ orientation: 'p', unit: 'px', format: [canvas.width, canvas.height] });
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save(`bukti-pendaftaran-${details.fullName.replace(/\s/g, '-')}.pdf`);
            });
        }
    };
    
    const DetailRow: React.FC<{ label: string, value: string | undefined | null }> = ({ label, value }) => (
      <tr className="border-b">
        <td className="py-2 px-4 w-1/3 font-medium text-slate-600">{label}</td>
        <td className="py-2 px-4 font-semibold text-slate-800">{value || '-'}</td>
      </tr>
    );

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div ref={proofRef} className="p-8 bg-white printable-area">
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
                            <p className="font-semibold border-t pt-1">({details.fullName})</p>
                        </div>
                        <div className="text-right">
                          <p>Semarang, {new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                          <p>Tanda Tangan Orang Tua/Wali,</p>
                          <div className="h-20"></div>
                          <p className="font-semibold border-t pt-1">(Orang Tua/Wali)</p>
                        </div>
                    </footer>
                </div>
                 <div className="bg-gray-100 p-4 flex justify-end space-x-3 rounded-b-lg">
                    <button onClick={onClose} className="px-5 py-2 rounded-md font-semibold text-gray-700 bg-gray-300 hover:bg-gray-400 transition-colors">Tutup</button>
                    <button onClick={handleDownload} className="px-5 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">Unduh PDF</button>
                </div>
            </div>
        </div>
    );
};

const AnnouncementModal: React.FC<{ url: string, onClose: () => void }> = ({ url, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-semibold">Detail Pengumuman</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                <div className="flex-grow p-2">
                    <iframe src={url} className="w-full h-full border-0" title="Pengumuman"></iframe>
                </div>
            </div>
        </div>
    );
};


export default App;
