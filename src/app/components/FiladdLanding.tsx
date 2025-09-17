"use client";
import React, { useState, useEffect } from 'react';
import { CheckIcon, StarIcon } from '@radix-ui/react-icons';

interface FiladdLandingProps {
  highlightedSection: string | null;
  membershipDetails: {
    membership: 'pro' | 'premium' | null;
    feature: string | null;
  } | null;
  onPurchaseInitiated: (membership: 'pro' | 'premium', discountCode?: string) => void;
}

export default function FiladdLanding({ 
  highlightedSection, 
  membershipDetails,
  onPurchaseInitiated 
}: FiladdLandingProps) {
  const [highlightClass, setHighlightClass] = useState('');

  useEffect(() => {
    console.log('🔍 FiladdLanding received highlightedSection:', highlightedSection);
    if (highlightedSection) {
      // Scroll hacia la sección
      let sectionElement = document.getElementById(`section-${highlightedSection}`);
      
      // Para "comparison", usar la sección de memberships
      if (!sectionElement && highlightedSection === 'comparison') {
        sectionElement = document.getElementById('section-memberships');
      }
      
      console.log('📍 Found section element:', sectionElement);
      if (sectionElement) {
        sectionElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
      
      // Animación de highlight
      const newClass = 'bg-yellow-200 transition-all duration-700 ease-in-out rounded-lg shadow-lg';
      console.log('🎨 Setting highlight class:', newClass);
      setHighlightClass(newClass);
      
      const timer = setTimeout(() => {
        console.log('⏰ Starting fade out');
        setHighlightClass('transition-all duration-1000 ease-out');
        // Limpiar completamente después de la transición
        setTimeout(() => {
          console.log('🧹 Clearing highlight class');
          setHighlightClass('');
        }, 1000);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [highlightedSection]);

  const getSectionClass = (section: string) => {
    const result = highlightedSection === section ? highlightClass : '';
    if (result) {
      console.log(`🏷️ getSectionClass(${section}): "${result}"`);
    }
    return result;
  };

  const proFeatures = [
    'Clases grabadas de todas las materias',
    'Material de estudio descargable',
    'Simulacros semanales',
    'Soporte por chat',
    'Acceso por 6 meses'
  ];

  const premiumFeatures = [
    'Todo lo de PRO +',
    'Clases en vivo con profesores',
    'Sesiones de repaso personalizadas',
    'Tutoría 1:1 semanal',
    'Acceso ilimitado',
    'Garantía de puntaje o devolución'
  ];

  const testimonials = [
    {
      name: "María González",
      score: "785 puntos",
      text: "Gracias a Filadd logré entrar a Medicina en la UC. Las clases en vivo fueron clave para mi preparación."
    },
    {
      name: "Carlos Rodríguez",
      score: "720 puntos",
      text: "El material de estudio es excelente y los simulacros me prepararon perfectamente para la PSU real."
    },
    {
      name: "Valentina Silva",
      score: "760 puntos",
      text: "La tutoría personalizada me ayudó a mejorar en matemáticas. ¡Recomiendo Filadd 100%!"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div id="section-hero" className={`py-20 px-4 text-center ${getSectionClass('hero')}`}>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          🎯 <span className="text-blue-600">Filadd</span> - Tu Éxito en la PSU
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          El preuniversitario online #1 de Chile. Metodología comprobada, profesores expertos y 
          miles de estudiantes ya ingresaron a la universidad de sus sueños.
        </p>
        <div className="flex justify-center space-x-8 text-lg">
          <div className="flex items-center text-green-600">
            <StarIcon className="w-6 h-6 mr-2" />
            <span className="font-semibold">95% de aprobación</span>
          </div>
          <div className="flex items-center text-blue-600">
            <CheckIcon className="w-6 h-6 mr-2" />
            <span className="font-semibold">+10,000 estudiantes</span>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id="section-benefits" className={`py-16 px-4 bg-white ${getSectionClass('benefits')}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Por qué elegir Filadd?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-blue-50">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-3">Material Actualizado</h3>
              <p className="text-gray-600">Contenido alineado 100% con la nueva PDT y los cambios del DEMRE</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-green-50">
              <div className="text-4xl mb-4">👨‍🏫</div>
              <h3 className="text-xl font-semibold mb-3">Profesores Expertos</h3>
              <p className="text-gray-600">Docentes con años de experiencia y resultados comprobados</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-purple-50">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3">Metodología Efectiva</h3>
              <p className="text-gray-600">Técnicas probadas que maximizan tu puntaje en menor tiempo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Memberships Comparison */}
      <div id="section-memberships" className={`py-16 px-4 bg-gray-50 ${getSectionClass('memberships')} ${getSectionClass('comparison')}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Elige tu membresía
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Ambas opciones te llevarán al éxito, elige la que mejor se adapte a tus necesidades
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* PRO Plan */}
            <div id="section-pro-plan" className={`bg-white rounded-2xl shadow-lg p-8 relative ${getSectionClass('pro-plan')}`}>
              {membershipDetails?.membership === 'pro' && (
                <div className="absolute inset-0 bg-blue-100 bg-opacity-50 rounded-2xl animate-pulse" />
              )}
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">PRO</h3>
                  <div className="text-4xl font-bold text-blue-600">$29.990</div>
                  <div className="text-gray-500">/mes</div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {proFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => onPurchaseInitiated('pro')}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Comenzar con PRO
                </button>
              </div>
            </div>

            {/* PREMIUM Plan */}
            <div id="section-premium-plan" className={`bg-white rounded-2xl shadow-xl p-8 relative border-2 border-purple-200 ${getSectionClass('premium-plan')}`}>
              {membershipDetails?.membership === 'premium' && (
                <div className="absolute inset-0 bg-purple-100 bg-opacity-50 rounded-2xl animate-pulse" />
              )}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  MÁS POPULAR
                </span>
              </div>
              
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">PREMIUM</h3>
                  <div className="text-4xl font-bold text-purple-600">$49.990</div>
                  <div className="text-gray-500">/mes</div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {premiumFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className={`text-gray-700 ${feature.startsWith('Todo lo de PRO') ? 'font-semibold' : ''}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => onPurchaseInitiated('premium')}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Comenzar con PREMIUM
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div id="section-testimonials" className={`py-16 px-4 bg-white ${getSectionClass('testimonials')}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Historias de éxito
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-green-600 font-semibold">{testimonial.score}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="section-contact" className={`py-16 px-4 bg-blue-600 text-white ${getSectionClass('contact')}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            ¿Tienes preguntas?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Nuestro equipo está aquí para ayudarte a elegir la mejor opción para tu futuro académico
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center">
              <span className="text-2xl mr-3">📧</span>
              <span>contacto@filadd.cl</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-3">📱</span>
              <span>+56 9 1234 5678</span>
            </div>
          </div>
        </div>
      </div>

      {/* Membership Details Modal */}
      {membershipDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4 text-center">
              Membresía {membershipDetails.membership?.toUpperCase()}
            </h3>
            <div className="space-y-4">
              {membershipDetails.membership === 'pro' && proFeatures.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span>{feature}</span>
                </div>
              ))}
              {membershipDetails.membership === 'premium' && premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => onPurchaseInitiated(membershipDetails.membership!)}
              className={`w-full mt-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                membershipDetails.membership === 'pro' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              ¡Quiero esta membresía!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}