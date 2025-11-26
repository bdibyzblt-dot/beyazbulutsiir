
import React, { useState, useEffect } from 'react';
import { Feather, BookOpen, Coffee, Loader2 } from 'lucide-react';
import { getSettings } from '../services/settingsService';
import { SiteSettings } from '../types';

const AboutPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const load = async () => {
        const s = await getSettings();
        setSettings(s);
    };
    load();
  }, []);

  if (!settings) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="animate-spin text-accent" size={48} />
        </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 md:py-20 space-y-16 animate-fade-in">
      
      {/* Header */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-serif text-ink">{settings.aboutTitle}</h1>
        <div className="w-24 h-px bg-secondary mx-auto"></div>
        <p className="text-xl text-stone-500 max-w-2xl mx-auto font-body italic leading-relaxed">
          {settings.aboutQuote}
        </p>
      </section>

      {/* Content Block 1 */}
      <section className="grid md:grid-cols-2 gap-12 items-center bg-white p-8 md:p-12 rounded-lg border border-secondary/20 shadow-sm">
        <div className="space-y-6">
          <h2 className="text-2xl font-serif text-ink">Neden {settings.siteName}?</h2>
          <p className="text-stone-600 font-body leading-loose whitespace-pre-line">
            {settings.aboutTextPrimary}
          </p>
          <p className="text-stone-600 font-body leading-loose whitespace-pre-line">
            {settings.aboutTextSecondary}
          </p>
        </div>
        <div className="flex justify-center">
            <div className="p-8 bg-background rounded-full border border-secondary/20">
                <Feather size={120} className="text-accent/30" strokeWidth={1} />
            </div>
        </div>
      </section>

      {/* Features / Philosophy */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-white rounded-lg border border-secondary/20 hover:shadow-md transition-all">
          <div className="flex justify-center mb-4">
            <BookOpen className="text-accent" size={32} />
          </div>
          <h3 className="font-serif text-lg text-ink mb-2">Edebi Derinlik</h3>
          <p className="text-sm text-stone-500 font-body">
            Sadece sözcükler değil, arkasındaki anlam ve duygu yükü bizim için önemlidir.
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg border border-secondary/20 hover:shadow-md transition-all">
          <div className="flex justify-center mb-4">
            <Feather className="text-accent" size={32} />
          </div>
          <h3 className="font-serif text-lg text-ink mb-2">Sade Estetik</h3>
          <p className="text-sm text-stone-500 font-body">
            Gözü yormayan, okuma zevkini artıran minimalist bir tasarım anlayışı.
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg border border-secondary/20 hover:shadow-md transition-all">
          <div className="flex justify-center mb-4">
            <Coffee className="text-accent" size={32} />
          </div>
          <h3 className="font-serif text-lg text-ink mb-2">Huzurlu Ortam</h3>
          <p className="text-sm text-stone-500 font-body">
            Dijital kaosta bir nefes alma durağı. Sakinlik ve huzur önceliğimiz.
          </p>
        </div>
      </section>

      {/* Bottom Message */}
      <section className="text-center py-10">
        <p className="font-serif text-2xl text-ink leading-relaxed">
          Siz de kaleminizi kağıda değdirin,<br />
          bırakın mısralarınız gökyüzüne karışsın.
        </p>
      </section>

    </div>
  );
};

export default AboutPage;
