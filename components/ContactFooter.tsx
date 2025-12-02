import React, { useState } from 'react';
import { Mail, Phone, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { ContactFooterProps, FooterLink } from '../types';
import { Link } from 'react-router-dom';

const ContactFooter: React.FC<ContactFooterProps> = ({ 
  contactPerson = {
    name: "Dr. Michael Weber",
    role: "Senior IT Consultant",
    image: "https://picsum.photos/200/200?grayscale",
    email: "michael.weber@novartum.com",
    phone: "+49 89 12345678"
  },
  links = {
    services: [],
    company: [],
    resources: [],
    legal: []
  }
}) => {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    message: '',
    consent: false
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
    consent: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validation Logic
  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', message: '' };

    // Name Validation
    if (!formData.name.trim()) {
      newErrors.name = 'Bitte geben Sie Ihren Namen ein.';
      isValid = false;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Bitte geben Sie Ihre E-Mail-Adresse ein.';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
      isValid = false;
    }

    // Message Validation
    if (!formData.message.trim()) {
      newErrors.message = 'Bitte schreiben Sie uns eine Nachricht.';
      isValid = false;
    }

    // Consent Validation
    if (!formData.consent) {
      newErrors.consent = 'Bitte stimmen Sie der Datenschutzerklärung zu.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setFormData({ name: '', company: '', email: '', message: '', consent: false });
        setErrors({ name: '', email: '', message: '', consent: '' });
        
        // Reset success message after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      }, 1500);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    
    // Checkbox handling
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [id]: checked }));
        if (checked && errors.consent) {
            setErrors(prev => ({ ...prev, consent: '' }));
        }
        return;
    }

    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Clear error when user starts typing
    if (errors[id as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  // Helper to render correct link type
  const renderLink = (linkItem: FooterLink) => {
    const className = "hover:text-orange-700 transition block";
    // Check for internal routes
    if (linkItem.link.startsWith('/')) {
      return <Link to={linkItem.link} className={className}>{linkItem.label}</Link>;
    }
    // Fallback to standard anchor for hash links or external links
    return <a href={linkItem.link} className={className}>{linkItem.label}</a>;
  };

  return (
    <footer className="bg-slate-50 pt-24 pb-12 text-slate-800" id="contact" aria-labelledby="contact-heading">
      <div className="container mx-auto px-4 md:px-12">
        <div className="bg-white rounded-[2rem] shadow-2xl p-6 md:p-12 mb-20 border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Person Card */}
            <div className="lg:col-span-5 xl:col-span-4 h-full min-w-0 flex flex-col">
              <span className="text-orange-700 font-bold uppercase text-xs tracking-widest mb-4 block">Kontakt</span>
              <h2 id="contact-heading" className="text-3xl font-bold mb-8 text-slate-900">Ihr direkter Ansprechpartner</h2>
              
              <div className="bg-slate-50 p-6 lg:p-8 rounded-2xl flex flex-col border border-slate-100 h-full w-full min-w-0 overflow-hidden">
                 {/* Profile Header */}
                 <div className="flex flex-row items-center gap-4 mb-8 w-full min-w-0">
                    <img 
                        src={contactPerson.image} 
                        alt={contactPerson.name} 
                        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover shadow-md shrink-0 bg-slate-200"
                    />
                    <div className="flex-1 min-w-0 overflow-hidden">
                        <h3 className="font-bold text-lg text-slate-900 truncate pr-2">{contactPerson.name}</h3>
                        <p className="text-sm text-slate-500 font-medium truncate">{contactPerson.role}</p>
                    </div>
                 </div>
                 
                 {/* Contact Links */}
                 <div className="space-y-3 w-full mb-8 flex-grow">
                    <a href={`mailto:${contactPerson.email}`} className="flex items-start gap-3 text-slate-600 hover:text-orange-700 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all p-3 rounded-lg border border-transparent group w-full">
                        <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm shrink-0 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                           <Mail size={18} className="text-orange-600" />
                        </div>
                        <span className="text-sm font-medium break-words py-1.5">{contactPerson.email}</span>
                    </a>
                    
                    <a href={`tel:${contactPerson.phone.replace(/\s/g, '')}`} className="flex items-start gap-3 text-slate-600 hover:text-orange-700 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all p-3 rounded-lg border border-transparent group w-full">
                        <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm shrink-0 group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                           <Phone size={18} className="text-orange-600" />
                        </div>
                        <span className="text-sm font-medium break-words py-1.5">{contactPerson.phone}</span>
                    </a>
                 </div>

                 {/* CTA Button */}
                 <button className="w-full mt-auto border-2 border-slate-200 bg-white text-slate-700 hover:border-orange-500 hover:text-orange-700 px-4 py-3.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-500 group shadow-sm">
                    <Calendar size={18} className="shrink-0 text-slate-400 group-hover:text-orange-600 transition-colors" />
                    <span className="truncate">Termin vereinbaren</span>
                 </button>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7 xl:col-span-8 min-w-0 pt-4 lg:pt-0">
                <form onSubmit={handleSubmit} className="space-y-6 bg-white h-full flex flex-col justify-center" noValidate>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Schreiben Sie uns</h3>
                      <p className="text-slate-500 mb-6 text-sm">Wir melden uns in der Regel innerhalb von 24 Stunden bei Ihnen.</p>
                    </div>

                    {isSuccess ? (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-green-800 mb-2">Nachricht gesendet!</h4>
                        <p className="text-green-700">Vielen Dank für Ihre Anfrage. Wir werden uns umgehend bei Ihnen melden.</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-semibold text-slate-700">
                                  Name <span className="text-red-500">*</span>
                                </label>
                                <input 
                                  id="name" 
                                  type="text" 
                                  value={formData.name}
                                  onChange={handleChange}
                                  placeholder="Max Mustermann" 
                                  className={`w-full bg-slate-50 border rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:bg-white transition text-slate-900 placeholder:text-slate-400 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-500'}`} 
                                />
                                {errors.name && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/> {errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="company" className="text-sm font-semibold text-slate-700">Firma</label>
                                <input 
                                  id="company" 
                                  type="text" 
                                  value={formData.company}
                                  onChange={handleChange}
                                  placeholder="Musterfirma GmbH" 
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition text-slate-900 placeholder:text-slate-400" 
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                              E-Mail Adresse <span className="text-red-500">*</span>
                            </label>
                            <input 
                              id="email" 
                              type="email" 
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="max@beispiel.de" 
                              className={`w-full bg-slate-50 border rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:bg-white transition text-slate-900 placeholder:text-slate-400 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-500'}`} 
                            />
                            {errors.email && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/> {errors.email}</p>}
                        </div>
                        
                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-semibold text-slate-700">
                              Nachricht <span className="text-red-500">*</span>
                            </label>
                            <textarea 
                              id="message" 
                              value={formData.message}
                              onChange={handleChange}
                              placeholder="Wie können wir Ihnen helfen?" 
                              rows={5} 
                              className={`w-full bg-slate-50 border rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:bg-white transition text-slate-900 placeholder:text-slate-400 resize-none ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-orange-500'}`}
                            ></textarea>
                            {errors.message && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/> {errors.message}</p>}
                        </div>

                        <div className="space-y-2">
                           <label className="flex items-start gap-3 cursor-pointer group">
                             <div className="relative flex items-center pt-1">
                               <input 
                                 type="checkbox" 
                                 id="consent"
                                 checked={formData.consent}
                                 onChange={handleChange}
                                 className="peer appearance-none w-5 h-5 border border-slate-300 rounded bg-slate-50 checked:bg-orange-600 checked:border-orange-600 transition-colors focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
                               />
                               <CheckCircle size={14} className="absolute left-0.5 top-1.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={3} />
                             </div>
                             <span className="text-xs text-slate-500 leading-relaxed">
                               Ich stimme zu, dass meine Angaben zur Kontaktaufnahme und Zuordnung für eventuelle Rückfragen dauerhaft gespeichert werden. 
                               Hinweis: Diese Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen. 
                               Weitere Informationen finden Sie in der <Link to="/datenschutz" className="text-orange-600 hover:underline">Datenschutzerklärung</Link>.
                             </span>
                           </label>
                           {errors.consent && <p className="text-red-500 text-xs flex items-center gap-1 pl-8"><AlertCircle size={12}/> {errors.consent}</p>}
                        </div>
                        
                        <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className={`w-full bg-orange-700 hover:bg-orange-800 text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-700 text-lg mt-2 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                        >
                          {isSubmitting ? 'Wird gesendet...' : 'Anfrage kostenlos senden'}
                        </button>
                      </>
                    )}
                </form>
            </div>
          </div>
        </div>

        {/* Bottom Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-200 pt-12 text-sm text-slate-600">
            <div>
                <h4 className="font-bold text-slate-900 mb-6">Services</h4>
                <ul className="space-y-3">
                    {links.services.map((link, idx) => (
                      <li key={idx}>{renderLink(link)}</li>
                    ))}
                </ul>
            </div>
             <div>
                <h4 className="font-bold text-slate-900 mb-6">Ressourcen</h4>
                <ul className="space-y-3">
                     {links.resources.map((link, idx) => (
                      <li key={idx}>{renderLink(link)}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-slate-900 mb-6">Über uns</h4>
                <ul className="space-y-3">
                     {links.company.map((link, idx) => (
                      <li key={idx}>{renderLink(link)}</li>
                    ))}
                </ul>
            </div>
             <div>
                <h4 className="font-bold text-slate-900 mb-6">Rechtliches</h4>
                <ul className="space-y-3">
                     {links.legal.map((link, idx) => (
                      <li key={idx}>{renderLink(link)}</li>
                    ))}
                </ul>
            </div>
        </div>
        
        <div className="text-center mt-16 text-slate-400 text-xs">
            &copy; {new Date().getFullYear()} novartum GmbH. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
};

export default ContactFooter;