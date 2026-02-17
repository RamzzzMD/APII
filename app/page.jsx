import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getDocsSpec } from '../lib/docsService';

export const revalidate = 3600;

export const metadata = {
    title: 'PuruBoy API - Home',
    description: 'Beranda PuruBoy API. Temukan berbagai REST API gratis untuk kebutuhan proyek aplikasi Anda.',
};

const Hero = () => (
    <div className="text-center mb-10 animate-fade-in pt-4">
        <div className="inline-block mb-4">
             <div className="w-20 h-20 bg-gradient-to-br from-accent-dark to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-accent/20 border border-white/10">
                <i className="fas fa-bolt text-4xl text-white drop-shadow-md"></i>
             </div>
        </div>
        <h1 className="text-4xl font-extrabold text-primary mb-3 tracking-tight">
            PuruBoy <span className="gradient-text">API</span>
        </h1>
        <p className="text-secondary text-sm leading-relaxed max-w-xs mx-auto font-medium">
            Platform API modular terbaik dengan integrasi AI, Downloader, dan Anime Streaming.
        </p>
        
        <div className="mt-8 flex flex-col gap-3 max-w-xs mx-auto">
            <Link href="/docs" className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3.5 rounded-xl shadow-lg shadow-accent/25 transition-all active:scale-95 flex items-center justify-center gap-2 group">
                <span>Mulai Sekarang</span>
                <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform"></i>
            </Link>
            <Link href="/blog" className="w-full bg-card border border-default hover:bg-white/5 text-secondary font-semibold py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center">
                Lihat Updates
            </Link>
        </div>
    </div>
);

const StatsCard = ({ icon, count, label }) => (
    <div className="native-card p-4 flex items-center gap-4 hover:border-accent/50 transition-colors group">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
            <i className={`fas ${icon} text-xl`}></i>
        </div>
        <div>
            <div className="text-xl font-bold text-primary">{count}</div>
            <div className="text-[10px] text-muted uppercase tracking-wider font-bold">{label}</div>
        </div>
    </div>
);

const FeatureItem = ({ icon, title, desc }) => (
    <div className="flex gap-4 p-4 native-card hover:bg-white/5 transition-colors">
        <div className="flex-shrink-0 mt-1">
             <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                <i className={`fas ${icon} text-accent text-sm`}></i>
             </div>
        </div>
        <div>
            <h3 className="font-bold text-primary text-sm mb-1">{title}</h3>
            <p className="text-xs text-secondary leading-relaxed opacity-80">{desc}</p>
        </div>
    </div>
);

// WhatsApp Channel Promotion Section
const ChannelPromo = () => (
    <div className="native-card overflow-hidden relative group mb-8 border-none ring-1 ring-white/10">
         <div className="relative h-40 w-full bg-gray-900">
             <Image 
                src="/puruboy-ch.jpg" 
                alt="PuruBoy Channel" 
                fill
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 600px"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-[#121215]/60 to-transparent"></div>
             
             <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#25D366] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                        Official
                    </span>
                    <span className="text-gray-300 text-[10px] font-medium flex items-center gap-1">
                        <i className="fas fa-users"></i> Community
                    </span>
                </div>
                <h3 className="text-xl font-bold text-white drop-shadow-md">WhatsApp Channel</h3>
             </div>
         </div>
         <div className="p-5 pt-2 bg-[#121215]">
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Dapatkan notifikasi update fitur, info maintenance, dan bagi-bagi script gratis langsung dari sumbernya.
            </p>
            <a 
                href="https://whatsapp.com/channel/0029Vb7OMyy96H4TkWjlTO0V" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#1da851] text-white font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-green-900/10"
            >
                <i className="fab fa-whatsapp text-lg"></i>
                <span>Gabung Channel</span>
            </a>
         </div>
    </div>
);

async function getContributors() {
    try {
        const res = await fetch('https://api.github.com/repos/purujawa06-bot/Na-api/contributors?per_page=15', {
            next: { revalidate: 3600 }
        });
        if (!res.ok) return [];
        return await res.json();
    } catch (e) {
        console.error("Failed to fetch contributors", e);
        return [];
    }
}

export default async function HomePage() {
    let stats = { endpoints: 0, categories: 0 };
    
    try {
        const data = await getDocsSpec();
        const totalEndpoints = Object.values(data).reduce((sum, arr) => sum + arr.length, 0);
        const totalCategories = Object.keys(data).length;
        stats = { endpoints: totalEndpoints, categories: totalCategories };
    } catch (e) {
        console.error("Failed to fetch stats for SSG", e);
    }

    const contributors = await getContributors();

    return (
        <div className="pb-4">
            <Hero />
            
            <ChannelPromo />

            <div className="grid grid-cols-2 gap-3 mb-8">
                <StatsCard icon="fa-code-branch" count={stats.endpoints} label="Endpoints" />
                <StatsCard icon="fa-folder" count={stats.categories} label="Categories" />
            </div>

            {contributors && contributors.length > 0 && (
                <div className="mb-8 animate-fade-in">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h2 className="text-base font-bold text-primary flex items-center gap-2">
                            <i className="fas fa-crown text-yellow-500 text-sm"></i> Top Contributors
                        </h2>
                        <a 
                            href="https://github.com/purujawa06-bot/Na-api" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full text-secondary transition-colors"
                        >
                            View All
                        </a>
                    </div>
                    
                    <div className="relative -mx-4 px-4">
                        <div className="flex gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar">
                            {contributors.map((contributor) => (
                                <a 
                                    key={contributor.id}
                                    href={contributor.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="native-card min-w-[100px] w-[100px] p-3 flex flex-col items-center gap-2 snap-start border border-gray-800 hover:border-accent transition-colors group bg-card"
                                >
                                    <div className="relative w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-accent to-purple-600 shadow-lg shadow-purple-900/20 group-hover:scale-110 transition-transform duration-300">
                                        <div className="w-full h-full rounded-full overflow-hidden bg-black">
                                            <Image
                                                src={contributor.avatar_url}
                                                alt={contributor.login}
                                                width={40}
                                                height={40}
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-secondary truncate w-full text-center group-hover:text-white transition-colors">
                                        {contributor.login}
                                    </span>
                                    <span className="text-[9px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-mono">
                                        {contributor.contributions} C
                                    </span>
                                </a>
                            ))}
                            
                            <a 
                                href="https://github.com/purujawa06-bot/Na-api"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="native-card min-w-[100px] w-[100px] p-3 flex flex-col items-center justify-center gap-2 snap-start border border-dashed border-gray-700 hover:border-accent hover:bg-accent/5 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 group-hover:text-accent transition-colors">
                                    <i className="fas fa-plus"></i>
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 group-hover:text-accent text-center">
                                    Join Us
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            )}

            <div className="native-card p-5 border-l-4 border-accent mb-8 bg-gradient-to-r from-card to-transparent">
                <h3 className="font-bold text-primary text-sm mb-3 flex items-center gap-2">
                    <i className="fas fa-link text-accent"></i> Official Domains
                </h3>
                <div className="space-y-2">
                    <a href="https://www.puruboy.kozow.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-input/50 hover:bg-input p-3 rounded-lg border border-default transition-all group">
                        <span className="text-xs font-mono text-gray-300 group-hover:text-accent transition-colors truncate">www.puruboy.kozow.com</span>
                        <span className="text-[9px] bg-green-500/10 text-green-400 px-2 py-1 rounded font-bold uppercase tracking-wider">Stabil</span>
                    </a>
                    <a href="https://puruboy-api.vercel.app" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-input/50 hover:bg-input p-3 rounded-lg border border-default transition-all group">
                        <span className="text-xs font-mono text-gray-300 group-hover:text-accent transition-colors truncate">puruboy-api.vercel.app</span>
                        <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded font-bold uppercase tracking-wider">Cloud</span>
                    </a>
                </div>
            </div>

            <h2 className="text-lg font-bold text-primary mb-4 px-1 flex items-center gap-2">
                <i className="fas fa-star text-accent text-sm"></i> Fitur Utama
            </h2>
            <div className="space-y-3">
                <FeatureItem icon="fa-bolt" title="High Performance" desc="Infrastruktur server yang dioptimalkan untuk respons cepat dan stabil." />
                <FeatureItem icon="fa-mobile-alt" title="Mobile Friendly" desc="Dokumentasi yang didesain nyaman untuk layar kecil." />
                <FeatureItem icon="fa-flask" title="API Tester" desc="Coba endpoint langsung dari browser tanpa aplikasi tambahan." />
            </div>
        </div>
    );
}