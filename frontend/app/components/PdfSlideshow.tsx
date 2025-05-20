'use client';

import { useState } from 'react';

interface PdfFile {
  path: string;
  title: string;
}

export default function PdfSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const pdfFiles: PdfFile[] = [
    { path: '/igraf/es/G1_Conducting_a_Competition-Spanish.pdf', title: 'Guía 1: Conduciendo una Competición' },
    { path: '/igraf/es/G2_NetDoubleBogey-Spanish.pdf', title: 'Guía 2: Net Double Bogey' },
    { path: '/igraf/es/G3_Handicap_Allowances-Spanish.pdf', title: 'Guía 3: Asignaciones de Hándicap' },
    { path: '/igraf/es/G4_PCC-Spanish.pdf', title: 'Guía 4: PCC (Cálculo de Condiciones de Juego)' },
    { path: '/igraf/es/G5_SoftCap_HardCap-Spanish.pdf', title: 'Guía 5: Soft Cap y Hard Cap' },
    { path: '/igraf/es/G6_Stroke_Index_Allocation-Spanish.pdf', title: 'Guía 6: Asignación de Índice de Golpes' },
    { path: '/igraf/es/G7_WHS-Safeguards-Spanish.pdf', title: 'Guía 7: Salvaguardias del WHS' },
    { path: '/igraf/es/G8_CourseHandicap_Change-Spanish.pdf', title: 'Guía 8: Cambio de Hándicap de Campo' },
  ];
  
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? pdfFiles.length - 1 : prevIndex - 1
    );
  };
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === pdfFiles.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };
  
  return (
    <div className="w-full flex flex-col items-center mb-10">
      <h2 className="text-2xl font-semibold text-teal-800 mb-6">Guías de Hándicap (Español)</h2>
      
      <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={goToPrevious}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            ← Anterior
          </button>
          <h3 className="text-xl font-medium text-center flex-1">
            {pdfFiles[currentIndex].title}
          </h3>
          <button 
            onClick={goToNext}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Siguiente →
          </button>
        </div>
        
        <div className="w-full h-[600px] border border-gray-300 rounded">
          <iframe 
            src={pdfFiles[currentIndex].path} 
            className="w-full h-full" 
            title={pdfFiles[currentIndex].title}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {pdfFiles.map((file, index) => (
          <button
            key={index}
            onClick={() => goToIndex(index)}
            className={`px-3 py-1 border rounded-full ${
              index === currentIndex 
                ? 'bg-teal-600 text-white border-teal-600' 
                : 'bg-white text-teal-600 border-teal-300 hover:bg-teal-50'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      
      <a
        href={pdfFiles[currentIndex].path}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Abrir PDF en Nueva Pestaña
      </a>
    </div>
  );
} 