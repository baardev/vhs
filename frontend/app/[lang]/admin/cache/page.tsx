'use client';

import { useEffect, useState } from 'react';
import { getCommonDictionary } from '../../../dictionaries';

export default function AdminCachePage({ params }: { params: { lang: string } }) {
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      const dict = await getCommonDictionary(params.lang);
      setDictionary(dict);
    };
    
    loadDictionary();
  }, [params.lang]);

  if (!dictionary) {
    return <div>{params?.lang === 'en' ? 'Loading...' : 
           params?.lang === 'es' ? 'Cargando...' : 
           params?.lang === 'he' ? 'טוען...' : 
           params?.lang === 'ru' ? 'Загрузка...' : 
           params?.lang === 'zh' ? '加载中...' : 'Loading...'}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{dictionary.adminCache?.title || 'Admin Cache Management'}</h1>
      <p className="mb-4">{dictionary.adminCache?.placeholder || 'This is a placeholder for the Admin Cache management page.'}</p>
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p>{dictionary.adminCache?.underConstruction || '⚠️ Under Construction'}</p>
      </div>
    </div>
  );
} 