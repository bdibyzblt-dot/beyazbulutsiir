
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const MusicManager: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin" className="p-2 border border-secondary/20 rounded-full hover:bg-white text-stone-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="font-serif text-3xl text-ink">Müzik Yönetimi</h2>
          <p className="text-stone-400 text-sm">Bu özellik kaldırılmıştır.</p>
        </div>
      </div>
    </div>
  );
};

export default MusicManager;
