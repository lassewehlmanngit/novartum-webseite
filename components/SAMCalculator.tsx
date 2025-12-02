import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, ShieldCheck, PieChart, Euro, Clock, 
  Download, AlertTriangle, HelpCircle, XCircle, CheckCircle2, ChevronUp, ChevronDown, Play, FileText, Send, Mail, Phone, ExternalLink 
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- Types & Interfaces ---

type IndustryType = 'finance' | 'industry' | 'other';

interface CalculatorState {
  // Compliance
  licensedSoftware: number;
  installedSoftware: number;
  passedAudits: number;
  totalAudits: number;
  // Shelfware
  unusedLicenses: number;
  boughtLicenses: number;
  // Costs
  totalLicenseCost: number;
  userCount: number;
  industry: IndustryType;
  trueUpCost: number;
  originalOrder: number;
  // Agility
  daysStandard: number;
  daysNew: number;
}

interface KpiResult {
  value: number;
  formattedValue: string;
  status: 'green' | 'yellow' | 'red' | 'gray';
  message: string;
  score: number; // 0-100 for gauge
}

interface SAMConfig {
  contact: {
    title: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    image: string;
  };
  nextSteps: {
    title: string;
    steps: Array<{
      title: string;
      description: string;
    }>;
  };
}

// --- Helper Components ---

// Mobile-friendly Tooltip: Works on Hover (Desktop) and Click/Focus (Mobile)
const Tooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="group relative inline-flex items-center ml-2 align-middle z-10">
    <button 
      type="button"
      className="text-slate-500 hover:text-orange-500 focus:text-orange-500 transition-colors outline-none"
      aria-label="Info anzeigen"
    >
      <HelpCircle size={16} />
    </button>
    <div className="invisible group-hover:visible group-focus-within:visible opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg w-48 sm:w-56 text-center transition-all duration-200 shadow-xl border border-slate-700 z-50 pointer-events-none">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
    </div>
  </div>
);

interface SmartInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  tooltip?: string;
  unit?: string;
  color?: 'orange' | 'blue' | 'red' | 'green';
  warningThreshold?: number; // Optional: Show visual warning if above/below value
}

const SmartInput: React.FC<SmartInputProps> = ({ 
  label, value, min, max, step = 1, onChange, tooltip, unit, color = 'orange', warningThreshold 
}) => {
  
  // Calculate percentage for background gradient
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  
  // Color mapping for Tailwind classes
  const colorMap = {
    orange: 'accent-orange-500 focus:ring-orange-500/50',
    blue: 'accent-blue-500 focus:ring-blue-500/50',
    red: 'accent-red-500 focus:ring-red-500/50',
    green: 'accent-green-500 focus:ring-green-500/50'
  };

  const bgGradient = {
    background: `linear-gradient(to right, 
      ${color === 'orange' ? '#f97316' : color === 'blue' ? '#3b82f6' : color === 'red' ? '#ef4444' : '#22c55e'} 0%, 
      ${color === 'orange' ? '#f97316' : color === 'blue' ? '#3b82f6' : color === 'red' ? '#ef4444' : '#22c55e'} ${percentage}%, 
      #334155 ${percentage}%, 
      #334155 100%)`
  };

  return (
    <div className="mb-6 last:mb-0">
       {/* Header Row: Label + Numeric Input */}
       <div className="flex justify-between items-end mb-3">
          <label className="text-sm font-bold text-slate-300 flex items-center mb-1">
             {label}
             {tooltip && <Tooltip text={tooltip} />}
          </label>
          
          <div className="flex items-center bg-slate-800 rounded-lg border border-slate-600 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all overflow-hidden">
             <input 
                type="number" 
                min={min} 
                max={max} 
                step={step}
                value={value}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) onChange(val);
                }}
                className="w-20 bg-transparent text-white font-mono text-sm px-3 py-1.5 text-right outline-none appearance-none"
             />
             {unit && (
               <span className="bg-slate-700 text-slate-400 text-xs px-2 py-2 font-medium border-l border-slate-600">
                 {unit}
               </span>
             )}
          </div>
       </div>

       {/* Slider Row */}
       <div className="relative w-full h-6 flex items-center">
          <input 
            type="range" 
            min={min} 
            max={max} 
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            style={bgGradient}
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer touch-action-manipulation ${colorMap[color]} focus:outline-none focus:ring-2`}
          />
       </div>
       
       {/* Min/Max Labels */}
       <div className="flex justify-between text-[10px] text-slate-500 font-medium px-1">
          <span>{min}</span>
          <span>{max}</span>
       </div>
    </div>
  );
};

interface SAMCalculatorProps {
  title?: string;
  description?: string;
}

const SAMCalculator: React.FC<SAMCalculatorProps> = ({ 
  title = "Wie gesund ist Ihr Lizenzmanagement?", 
  description = "Prüfen Sie Compliance, Effizienz und Kostenstruktur in Echtzeit gegen Mittelstands-Benchmarks."
}) => {
  // --- State ---
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [config, setConfig] = useState<SAMConfig | null>(null);
  
  // Initialize with ZERO values for a neutral start state
  const [inputs, setInputs] = useState<CalculatorState>({
    licensedSoftware: 0,
    installedSoftware: 0,
    passedAudits: 0,
    totalAudits: 0,
    unusedLicenses: 0,
    boughtLicenses: 0,
    totalLicenseCost: 0,
    userCount: 0,
    industry: 'industry',
    trueUpCost: 0,
    originalOrder: 0,
    daysStandard: 0,
    daysNew: 0
  });

  // Fetch Config
  useEffect(() => {
    fetch('/content/sam-calculator/config.json')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Failed to load SAM config', err));
  }, []);

  // --- Logic Engine ---
  
  const results = useMemo(() => {
    // Helper to determine if we are in "Start State" (Zero values)
    const isZero = (val: number) => val === 0;

    // 1. Compliance Rate
    let compliance: KpiResult;
    if (isZero(inputs.installedSoftware)) {
        compliance = { value: 0, formattedValue: '-', status: 'gray', message: 'Daten eingeben...', score: 0 };
    } else {
        const complianceRaw = (inputs.licensedSoftware / inputs.installedSoftware) * 100;
        compliance = {
            value: complianceRaw,
            formattedValue: complianceRaw.toFixed(1) + '%',
            status: complianceRaw > 98 ? 'green' : complianceRaw >= 95 ? 'yellow' : 'red',
            message: complianceRaw > 98 ? 'Vorbildlich.' : complianceRaw >= 95 ? 'Risiko vorhanden.' : 'Kritisches Compliance-Gap.',
            score: Math.min(complianceRaw, 100)
        };
    }

    // 5. Audit Success Rate
    let audit: KpiResult;
    if (isZero(inputs.totalAudits)) {
        audit = { value: 0, formattedValue: '-', status: 'gray', message: 'Daten eingeben...', score: 0 };
    } else {
        const auditRaw = (inputs.passedAudits / inputs.totalAudits) * 100;
        audit = {
            value: auditRaw,
            formattedValue: auditRaw.toFixed(0) + '%',
            status: auditRaw === 100 ? 'green' : 'red',
            message: auditRaw === 100 ? 'Perfekte Bilanz.' : 'Finanzielles Risiko bei Audits.',
            score: auditRaw
        };
    }

    // 2. Shelfware Quote
    let shelfware: KpiResult;
    if (isZero(inputs.boughtLicenses)) {
        shelfware = { value: 0, formattedValue: '-', status: 'gray', message: 'Daten eingeben...', score: 0 };
    } else {
        const shelfwareRaw = (inputs.unusedLicenses / inputs.boughtLicenses) * 100;
        shelfware = {
            value: shelfwareRaw,
            formattedValue: shelfwareRaw.toFixed(1) + '%',
            status: shelfwareRaw < 5 ? 'green' : shelfwareRaw <= 10 ? 'yellow' : 'red',
            message: shelfwareRaw < 5 ? 'Hocheffiziente Nutzung.' : shelfwareRaw <= 10 ? 'Optimierungspotenzial.' : 'Hohe Kapitalbindung (Waste).',
            score: Math.max(0, 100 - (shelfwareRaw * 5))
        };
    }

    // 3. Cost per User
    let cpu: KpiResult;
    if (isZero(inputs.userCount)) {
        cpu = { value: 0, formattedValue: '-', status: 'gray', message: 'Daten eingeben...', score: 0 };
    } else {
        const cpuRaw = inputs.totalLicenseCost / inputs.userCount;
        let cpuStatus: 'green' | 'red' = 'green';
        let cpuLimit = 0;
        
        if (inputs.industry === 'finance') {
            cpuLimit = 1200;
            cpuStatus = cpuRaw <= 1200 ? 'green' : 'red';
        } else if (inputs.industry === 'industry') {
            cpuLimit = 600;
            cpuStatus = cpuRaw <= 600 ? 'green' : 'red';
        } else {
            cpuLimit = 800;
            cpuStatus = cpuRaw <= 800 ? 'green' : 'red';
        }
        
        cpu = {
            value: cpuRaw,
            formattedValue: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(cpuRaw),
            status: cpuStatus,
            message: cpuStatus === 'green' ? 'Im Branchen-Benchmark.' : `Über Benchmark (> ${cpuLimit}€).`,
            score: cpuStatus === 'green' ? 95 : 40
        };
    }

    // 4. True-Up Ratio
    let trueUp: KpiResult;
    if (isZero(inputs.originalOrder)) {
        trueUp = { value: 0, formattedValue: '-', status: 'gray', message: 'Daten eingeben...', score: 0 };
    } else {
        const trueUpRaw = (inputs.trueUpCost / inputs.originalOrder) * 100;
        trueUp = {
            value: trueUpRaw,
            formattedValue: trueUpRaw.toFixed(1) + '%',
            status: trueUpRaw < 10 ? 'green' : 'red',
            message: trueUpRaw < 10 ? 'Planungssicher.' : 'Schlechte Planung / Nachzahlungen.',
            score: Math.max(0, 100 - (trueUpRaw * 5))
        };
    }

    // 6. Agility (Time-to-Provision)
    let agility: KpiResult;
    if (isZero(inputs.daysStandard) && isZero(inputs.daysNew)) {
        agility = { value: 0, formattedValue: '-', status: 'gray', message: 'Daten eingeben...', score: 0 };
    } else {
        const agilityScore = (inputs.daysStandard < 5 ? 50 : 25) + (inputs.daysNew < 20 ? 50 : 25);
        const agilityStatus = agilityScore >= 90 ? 'green' : agilityScore >= 50 ? 'yellow' : 'red';
        agility = {
            value: agilityScore,
            formattedValue: `${inputs.daysStandard} / ${inputs.daysNew} Tage`,
            status: agilityStatus,
            message: agilityStatus === 'green' ? 'Agile IT-Prozesse.' : 'Verzögerungen im Business.',
            score: agilityScore
        };
    }

    // Overall Health Calculation
    // Only count non-gray scores
    const activeScores = [compliance, audit, shelfware, cpu, trueUp, agility].filter(k => k.status !== 'gray');
    
    let totalScore = 0;
    if (activeScores.length > 0) {
         // Weighted calculation (simplified)
         const sum = activeScores.reduce((acc, curr) => acc + curr.score, 0);
         totalScore = Math.round(sum / activeScores.length);
    }

    return { compliance, audit, shelfware, cpu, trueUp, agility, totalScore, hasData: activeScores.length > 0 };
  }, [inputs]);

  // --- Handlers ---

  const handleInputChange = (field: keyof CalculatorState, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value : Number(value)
    }));
  };

  const scrollToCalculator = () => {
    const element = document.getElementById('calculator-inputs');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // PDF Generator
  const generatePDF = () => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('de-DE');

    // Branding / Header
    doc.setFillColor(21, 23, 30); // Dark background
    doc.rect(0, 0, 210, 40, 'F');
    
    // Header Image - Logo
    try {
       // Attempt to load the logo if available in standard path (requires public URL access in some setups, but usually works for static assets)
       // Since we are client-side, we can just fetch it or embed it. 
       // For simplicity in this environment without complex asset loaders, we will keep the text fallback if image fails, 
       // but we will try to use an image if we can load it.
       // Ideally, convert SVG to PNG canvas first, but that's heavy.
       // We'll stick to the high-fidelity text representation that matches the logo font for PDF stability, 
       // OR use the addImage if we had a PNG/JPG. SVG support in jsPDF is limited.
       
       // UPDATED: Using text approximation to match new logo style as SVG handling in browser-jsPDF is tricky without canvg
       doc.setFontSize(24);
       doc.setTextColor(247, 152, 0); // #F79800
       doc.setFont("helvetica", "bold");
       doc.text("novartum", 14, 22); 
       
    } catch (e) {
       // Fallback
       doc.setFontSize(22);
       doc.setTextColor(247, 152, 0); 
       doc.text("novartum", 14, 20);
    }
    
    doc.setFontSize(16);
    doc.setTextColor(247, 152, 0); // Orange #F79800
    doc.text("SAM Health Check", 14, 28); 
    
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Erstellt am: ${today}`, 150, 28); // y=28

    // Score Section
    const scoreColor = results.totalScore > 80 ? [34, 197, 94] : results.totalScore > 50 ? [234, 179, 8] : [239, 68, 68];
    doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.roundedRect(14, 50, 182, 30, 2, 2, 'F'); // Moved up to y=50
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Health Score: ${results.totalScore} / 100`, 20, 70); // Adjusted y to 70 (center of rect)
    
    const assessment = results.totalScore > 80 ? 'Exzellenter Zustand' : results.totalScore > 50 ? 'Optimierungspotenzial vorhanden' : 'Kritischer Handlungsbedarf';
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(assessment, 190, 70, { align: 'right' }); // Adjusted y to 70

    // KPI Table
    const tableBody = [
        ['Compliance Rate', results.compliance.formattedValue, results.compliance.message],
        ['Audit Erfolgsrate', results.audit.formattedValue, results.audit.message],
        ['Shelfware Quote', results.shelfware.formattedValue, results.shelfware.message],
        ['Lizenzkosten / User', results.cpu.formattedValue, results.cpu.message],
        ['True-Up Ratio', results.trueUp.formattedValue, results.trueUp.message],
        ['Time-to-Provision', results.agility.formattedValue, results.agility.message],
    ];

    autoTable(doc, {
        startY: 90, // Moved up from 105 to 90
        head: [['KPI Indikator', 'Ihr Wert', 'Bewertung']],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [23, 23, 23], textColor: [255, 255, 255] },
        styles: { fontSize: 10, cellPadding: 6 },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 50 },
            1: { cellWidth: 40 },
            2: { cellWidth: 'auto' }
        },
        alternateRowStyles: { fillColor: [249, 250, 251] }
    });

    let finalY = (doc as any).lastAutoTable.finalY || 150;
    
    // Contact Section
    if (config?.contact) {
        finalY += 15; // Add some spacing before contact section

        doc.setDrawColor(200, 200, 200);
        doc.line(14, finalY, 196, finalY);
        finalY += 15;

        // "Nächster Schritt" Header for Contact
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text("Ihr Experte für den nächsten Schritt", 14, finalY);

        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        doc.setFont("helvetica", "bold");
        doc.text(config.contact.name, 14, finalY + 10);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(config.contact.role, 14, finalY + 16);
        doc.text(`Tel: ${config.contact.phone}`, 14, finalY + 24);
        doc.text(`Email: ${config.contact.email}`, 14, finalY + 30);
        
        // Add CTA text in PDF
        doc.setFontSize(10);
        doc.setTextColor(234, 88, 12); // Orange
        doc.text("Vereinbaren Sie jetzt ein kostenloses Erstgespräch.", 14, finalY + 40);
    }

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("www.novartum.com | info@novartum.com", 14, pageHeight - 10);

    doc.save('Novartum_SAM_Report.pdf');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Trigger PDF Download Immediately for the user
    try {
      generatePDF();
    } catch (pdfErr) {
      console.error("PDF Generation failed:", pdfErr);
    }

    // 2. Prepare data for CloudCannon / Netlify (Lead Gen)
    const formData = new FormData();
    formData.append("form-name", "sam-calculator");
    formData.append("email", email);
    formData.append("score", results.totalScore.toString());
    formData.append("compliance", results.compliance.formattedValue);
    formData.append("audit", results.audit.formattedValue);
    formData.append("shelfware", results.shelfware.formattedValue);
    
    try {
        // Standard POST submission for static site forms
        await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData as any).toString(),
        });
        
        setIsSuccess(true);
        setIsSubmitting(false);
    } catch (error) {
        console.error("Submission error:", error);
        // Even if sending fails, they got the PDF, so we just warn them about the email
        alert("Der Report wurde heruntergeladen, aber die E-Mail konnte nicht gesendet werden.");
        setIsSubmitting(false);
    }
  };

  // --- Render Helpers ---

  // Renders the Input Fields for a specific tab ID. 
  // Extracted to be used in both Desktop Tabs and Mobile Accordion.
  const renderModuleContent = (tabId: number) => {
    switch(tabId) {
      case 0: // Compliance
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
             <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3 text-sm text-blue-200 mb-6">
                <ShieldCheck className="shrink-0" size={20}/>
                <p>Eine Compliance-Rate von <strong>100%</strong> ist oft unrealistisch aufgrund von Discovery-Lücken. Zielkorridor: &gt;98%.</p>
             </div>
             
             <SmartInput 
                label="Lizenzierte Software"
                value={inputs.licensedSoftware}
                min={0}
                max={Math.max(1000, inputs.installedSoftware + 200)}
                step={1}
                onChange={(v) => handleInputChange('licensedSoftware', v)}
                color="orange"
                unit="Stk"
             />

             <SmartInput 
                label="Installierte Software"
                value={inputs.installedSoftware}
                min={0}
                max={2500}
                step={10}
                onChange={(v) => handleInputChange('installedSoftware', v)}
                tooltip="Anzahl der erkannten Installationen in Ihrer Umgebung."
                color="blue"
                unit="Stk"
             />

             <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                <SmartInput 
                  label="Bestandene Audits"
                  value={inputs.passedAudits}
                  min={0} max={20}
                  onChange={(v) => handleInputChange('passedAudits', v)}
                  color="green"
                  unit="#"
                />
                <SmartInput 
                  label="Audits Gesamt"
                  value={inputs.totalAudits}
                  min={0} max={20}
                  onChange={(v) => handleInputChange('totalAudits', v)}
                  color="blue"
                  unit="#"
                />
             </div>
          </div>
        );
      case 1: // Shelfware
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
             <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex gap-3 text-sm text-orange-200 mb-6">
                <AlertTriangle className="shrink-0" size={20}/>
                <p><strong>Beispiel:</strong> Bei 1.000 Office-Lizenzen sind 50 ungenutzt = 5% Shelfware-Quote (Verschwendung).</p>
             </div>
             
             <SmartInput 
                label="Gekaufte Lizenzen"
                value={inputs.boughtLicenses}
                min={0} max={3000} step={10}
                onChange={(v) => handleInputChange('boughtLicenses', v)}
                color="blue"
                unit="Stk"
             />

             <SmartInput 
                label="Davon ungenutzt"
                value={inputs.unusedLicenses}
                min={0} max={inputs.boughtLicenses} step={5}
                onChange={(v) => handleInputChange('unusedLicenses', v)}
                tooltip="Anzahl der Lizenzen, die bezahlt werden, aber seit >90 Tagen inaktiv sind."
                color="red"
                unit="Stk"
             />
          </div>
        );
      case 2: // Costs
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
             <div>
                <label className="text-sm font-bold text-slate-300 block mb-2 flex items-center">
                  Branche (für Benchmark)
                  <Tooltip text="Die Lizenzkosten pro User variieren stark je nach Branche." />
                </label>
                <div className="relative">
                  <select 
                      value={inputs.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value as IndustryType)}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 outline-none appearance-none cursor-pointer hover:border-slate-500 transition-colors"
                  >
                      <option value="finance">Finanzwesen & Versicherung</option>
                      <option value="industry">Industrie & Fertigung</option>
                      <option value="other">Sonstige Dienstleistung</option>
                  </select>
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                     <ChevronUp size={16} className="rotate-180" />
                  </div>
                </div>
             </div>

             {/* Cost Inputs remain numeric for better handling of large numbers */}
             <div>
                <label className="text-sm font-bold text-slate-300 block mb-2">Gesamte Lizenzkosten p.a. (€)</label>
                <div className="relative">
                  <input 
                      type="number" step="5000"
                      value={inputs.totalLicenseCost === 0 ? '' : inputs.totalLicenseCost}
                      placeholder="0"
                      onChange={(e) => handleInputChange('totalLicenseCost', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all pl-8 placeholder:text-slate-600"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">€</span>
                </div>
             </div>

             <SmartInput 
                label="Anzahl User / Devices"
                value={inputs.userCount}
                min={0} max={10000} step={10}
                onChange={(v) => handleInputChange('userCount', v)}
                color="blue"
                unit="User"
             />

             <div className="grid grid-cols-2 gap-4 md:gap-6 pt-4 border-t border-white/5">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2 flex items-center">
                      Ausgangsbestellung
                  </label>
                  <div className="relative">
                      <input 
                      type="number"
                      value={inputs.originalOrder === 0 ? '' : inputs.originalOrder}
                      placeholder="0"
                      onChange={(e) => handleInputChange('originalOrder', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-orange-500 transition-all pl-6 placeholder:text-slate-600"
                      />
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">€</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2 flex items-center">
                      True-Up Nachzahlung
                      <Tooltip text="Unerwartete Kosten beim jährlichen Lizenz-Audit." />
                  </label>
                   <div className="relative">
                      <input 
                      type="number"
                      value={inputs.trueUpCost === 0 ? '' : inputs.trueUpCost}
                      placeholder="0"
                      onChange={(e) => handleInputChange('trueUpCost', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-orange-500 transition-all pl-6 placeholder:text-slate-600"
                      />
                       <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">€</span>
                   </div>
                </div>
             </div>
          </div>
        );
      case 3: // Agility
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
             <SmartInput 
                label="Bereitstellung Standardsoftware"
                value={inputs.daysStandard}
                min={0} max={30} step={1}
                onChange={(v) => handleInputChange('daysStandard', v)}
                tooltip="Zeit von Anfrage bis Installation (z.B. Visio, Project)."
                color={inputs.daysStandard > 5 ? 'red' : 'green'}
                unit="Tage"
             />

             <SmartInput 
                label="Neue Software (Beschaffung)"
                value={inputs.daysNew}
                min={0} max={90} step={1}
                onChange={(v) => handleInputChange('daysNew', v)}
                tooltip="Zeit von Anfrage bis Bereitstellung inkl. Einkaufsprozess."
                color={inputs.daysNew > 20 ? 'red' : 'green'}
                unit="Tage"
             />
          </div>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { id: 0, label: 'Compliance & Sicherheit', icon: <ShieldCheck size={18} /> },
    { id: 1, label: 'Effizienz (Shelfware)', icon: <PieChart size={18} /> },
    { id: 2, label: 'Kosten & Planung', icon: <Euro size={18} /> },
    { id: 3, label: 'Agilität & Prozesse', icon: <Clock size={18} /> },
  ];

  // Helper to determine module status for accordion headers
  const getModuleStatus = (id: number): 'green' | 'red' | 'yellow' | 'gray' => {
     switch(id) {
        case 0: return results.compliance.status;
        case 1: return results.shelfware.status;
        case 2: return results.cpu.status === 'red' || results.trueUp.status === 'red' ? 'red' : results.cpu.status === 'gray' ? 'gray' : 'green';
        case 3: return results.agility.status;
        default: return 'gray';
     }
  };

  const renderStatusDot = (status: 'green' | 'red' | 'yellow' | 'gray') => {
     if(status === 'gray') return <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>;
     if(status === 'green') return <CheckCircle2 size={16} className="text-green-500" />;
     if(status === 'red') return <AlertTriangle size={16} className="text-red-500" />;
     return <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>;
  };

  const renderTrafficLight = (status: 'green' | 'yellow' | 'red' | 'gray') => {
    const size = "w-3 h-3";
    return (
      <div className="flex gap-1.5 bg-slate-900 p-1.5 rounded-full border border-slate-700 shadow-inner shrink-0">
        <div className={`${size} rounded-full transition-all duration-300 ${status === 'red' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] scale-110' : 'bg-slate-700 opacity-40'}`}></div>
        <div className={`${size} rounded-full transition-all duration-300 ${status === 'yellow' ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)] scale-110' : 'bg-slate-700 opacity-40'}`}></div>
        <div className={`${size} rounded-full transition-all duration-300 ${status === 'green' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] scale-110' : 'bg-slate-700 opacity-40'}`}></div>
      </div>
    );
  };

  const renderGauge = (label: string, result: KpiResult, infoText: string) => (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 relative overflow-visible group hover:border-slate-600 transition-colors shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
            <h4 className="text-slate-300 text-xs font-bold uppercase tracking-wider">{label}</h4>
            <Tooltip text={infoText} />
        </div>
        {renderTrafficLight(result.status)}
      </div>
      
      <div className="flex items-baseline gap-2 mb-2">
        <span className={`text-2xl font-bold ${
          result.status === 'green' ? 'text-green-400' : 
          result.status === 'yellow' ? 'text-yellow-400' : 
          result.status === 'red' ? 'text-red-400' : 'text-slate-500'
        }`}>
          {result.formattedValue}
        </span>
      </div>
      
      <p className="text-xs text-slate-400 mb-4 h-8 flex items-center">{result.message}</p>

      {/* Progress Bar Visualization */}
      <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${
            result.status === 'green' ? 'bg-green-500' : 
            result.status === 'yellow' ? 'bg-yellow-400' : 
            result.status === 'red' ? 'bg-red-500' : 'bg-slate-600'
          }`}
          style={{ width: `${result.score}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <section className="py-12 md:py-24 bg-[#15171e] text-white relative overflow-hidden" id="calculator">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-900/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-orange-900/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-12 relative z-10">
        
        <div className="text-center mb-10 md:mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 font-medium text-xs uppercase tracking-wider mb-4">
                <Calculator size={14} /> Interaktiver Rechner
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {title}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
              {description}
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-24">
          
          {/* LEFT COLUMN: Inputs & Wizard (Vertical Stack for ALL devices) */}
          <div className="lg:col-span-5 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl" id="calculator-inputs">
            
            <div className="flex flex-col gap-3">
               {tabs.map((tab) => {
                 const isOpen = activeTab === tab.id;
                 const status = getModuleStatus(tab.id);
                 return (
                   <div 
                     key={tab.id} 
                     className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                       isOpen 
                       ? 'bg-slate-800/80 border-orange-500/50 shadow-lg' 
                       : 'bg-slate-900/40 border-slate-700 hover:bg-slate-800 cursor-pointer'
                     }`}
                   >
                     <button
                       onClick={() => setActiveTab(tab.id)}
                       className="w-full flex items-center justify-between p-4 focus:outline-none"
                     >
                        <div className="flex items-center gap-3">
                           <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                             {tab.icon}
                           </div>
                           <div className="text-left">
                             <span className={`block font-bold text-sm ${isOpen ? 'text-white' : 'text-slate-300'}`}>
                               {tab.label}
                             </span>
                             {/* Small status indicator text for closed cards */}
                             {!isOpen && status !== 'gray' && (
                                <span className={`text-[10px] uppercase font-bold tracking-wider ${
                                  status === 'green' ? 'text-green-500' : 
                                  status === 'red' ? 'text-red-500' : 'text-yellow-500'
                                }`}>
                                   {status === 'green' ? 'OK' : status === 'red' ? 'Kritisch' : 'Prüfen'}
                                </span>
                             )}
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           {/* Status Dot only visible when collapsed */}
                           {!isOpen && renderStatusDot(status)}
                           {isOpen ? <ChevronUp size={18} className="text-slate-500"/> : <ChevronDown size={18} className="text-slate-500"/>}
                        </div>
                     </button>
                     
                     {/* Content (Conditional Render) */}
                     {isOpen && (
                       <div className="px-4 pb-6 pt-0 border-t border-white/5 mt-2 animate-in slide-in-from-top-2 fade-in">
                          <div className="pt-4">
                             {renderModuleContent(tab.id)}
                             
                             {/* Next Button for smooth flow inside the card */}
                             {tab.id < 3 && (
                               <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                                 <button 
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     setActiveTab(prev => Math.min(3, prev + 1));
                                   }}
                                   className="text-xs font-bold text-orange-500 hover:text-white transition-colors flex items-center gap-1"
                                 >
                                   Weiter &rarr;
                                 </button>
                               </div>
                             )}
                          </div>
                       </div>
                     )}
                   </div>
                 );
               })}
            </div>

          </div>

          {/* RIGHT COLUMN: Results Dashboard */}
          <div className="lg:col-span-7 flex flex-col gap-6 lg:sticky lg:top-24">
            
            {/* Health Score Header */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                         <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                              className="text-slate-700"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            />
                            {results.hasData && (
                              <path
                                className={`${results.totalScore > 80 ? 'text-green-500' : results.totalScore > 50 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000 ease-out`}
                                strokeDasharray={`${results.totalScore}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                              />
                            )}
                        </svg>
                        <span className={`absolute text-2xl font-bold ${results.hasData ? 'text-white' : 'text-slate-500'}`}>
                          {results.totalScore}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">SAM Health Score</h3>
                        <p className="text-slate-400 text-sm">
                          {results.hasData ? 'Basierend auf Ihren Eingaben' : 'Bitte Daten links eingeben'}
                        </p>
                    </div>
                </div>
                
                <div className="text-right hidden sm:block">
                     <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Status</div>
                     <div className={`text-lg font-bold ${
                        !results.hasData ? 'text-slate-500' :
                        results.totalScore > 80 ? 'text-green-400' : 
                        results.totalScore > 50 ? 'text-yellow-400' : 'text-red-400'
                     }`}>
                        {!results.hasData ? 'Warten auf Eingabe...' : results.totalScore > 80 ? 'Exzellent' : results.totalScore > 50 ? 'Optimierbar' : 'Kritisch'}
                     </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {/* Compliance Row */}
               {renderGauge('Compliance Rate', results.compliance, "Verhältnis von Lizenzen zu Installationen.")}
               {renderGauge('Audit Erfolgsrate', results.audit, "Anteil der Audits ohne Nachzahlung.")}
               
               {/* Shelfware Row */}
               {renderGauge('Shelfware Quote', results.shelfware, "Prozentsatz ungenutzter Lizenzen.")}
               {renderGauge('Lizenzkosten / User', results.cpu, `Benchmark für ${inputs.industry === 'finance' ? 'Finanzwesen' : 'Industrie'}.`)}
               
               {/* Process Row */}
               {renderGauge('True-Up Ratio', results.trueUp, "Verhältnis von Nachzahlung zu Ursprungsvolumen.")}
               {renderGauge('Time-to-Provision', results.agility, "Geschwindigkeit der Softwarebereitstellung.")}
            </div>

            {/* Global Assessment / CTA */}
            {results.hasData && (
                <div className="bg-gradient-to-br from-orange-900/50 to-slate-900 rounded-2xl p-6 md:p-8 border border-orange-500/20 shadow-xl mt-4 animate-in fade-in">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Ergebnis-Analyse</h3>
                        <p className="text-slate-300 text-sm max-w-md">
                            Sie haben {Object.values(results).filter(r => typeof r === 'object' && (r as KpiResult).status === 'red').length} kritische KPIs identifiziert. Laden Sie die vollständige Auswertung herunter.
                        </p>
                    </div>
                    </div>
                </div>
            )}

          </div>
        </div>
      </div>

      {/* STICKY BOTTOM BAR (Always visible) */}
      <div className="fixed bottom-0 left-0 w-full bg-[#15171e]/95 backdrop-blur-md border-t border-slate-700 py-3 md:py-4 px-4 z-40 shadow-[0_-5px_25px_rgba(0,0,0,0.5)]">
         <div className="container mx-auto max-w-7xl flex flex-row items-center justify-between gap-4">
            
            {/* Left: Score Display (Small) */}
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all shrink-0 ${
                    !results.hasData ? 'bg-slate-800 border-slate-600 text-slate-500' :
                    results.totalScore > 80 ? 'bg-green-600 border-green-400 text-white' : 
                    results.totalScore > 50 ? 'bg-yellow-600 border-yellow-400 text-white' : 
                    'bg-red-600 border-red-400 text-white'
                }`}>
                    {results.totalScore}
                </div>
                
                {/* Responsive Label - Now visible on mobile too */}
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider leading-none mb-0.5">
                        Ihr Score
                    </span>
                    <span className={`text-sm font-bold leading-none ${
                         !results.hasData ? 'text-slate-400' :
                         results.totalScore > 80 ? 'text-green-400' : 
                         results.totalScore > 50 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                        {!results.hasData ? 'Analyse starten...' : results.totalScore > 80 ? 'Exzellent' : results.totalScore > 50 ? 'Mittel' : 'Kritisch'}
                    </span>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                 <button 
                    onClick={scrollToCalculator}
                    className="flex items-center gap-2 text-white bg-slate-700 hover:bg-slate-600 px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all"
                 >
                    <Play size={14} className="fill-current" /> <span className="hidden sm:inline">Analyse starten</span><span className="sm:hidden">Starten</span>
                 </button>
                 
                 <button 
                    onClick={() => setShowEmailModal(true)}
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all shadow-lg shadow-orange-900/40"
                 >
                    <Download size={14} /> <span className="hidden sm:inline">Report anfordern</span><span className="sm:hidden">Report</span>
                 </button>
            </div>
         </div>
      </div>

      {/* PDF Export Modal Simulation */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white text-slate-900 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => { setShowEmailModal(false); setIsSuccess(false); }} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                 <XCircle size={24} />
              </button>
              
              {!isSuccess ? (
                  <>
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                            <Download size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-slate-900">Report Herunterladen</h3>
                        <p className="text-slate-600 text-sm">
                        Sichern Sie sich Ihre Ergebnisse und erhalten Sie Handlungsempfehlungen per E-Mail.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <form onSubmit={handleFormSubmit} className="space-y-3" name="sam-calculator" method="POST" data-netlify="true">
                            <input type="hidden" name="form-name" value="sam-calculator" />
                            <input type="hidden" name="score" value={results.totalScore} />
                            <input type="hidden" name="compliance" value={results.compliance.formattedValue} />
                            <input type="hidden" name="audit" value={results.audit.formattedValue} />
                            <input type="hidden" name="shelfware" value={results.shelfware.formattedValue} />

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">E-Mail Adresse</label>
                                <input 
                                type="email" 
                                name="email"
                                required
                                placeholder="name@firma.de"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all bg-white text-sm mb-4"
                                />
                                
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                                >
                                    {isSubmitting ? (
                                    <>
                                        <Clock size={18} className="animate-spin"/> Wird verarbeitet...
                                    </>
                                    ) : (
                                    <>
                                        <Download size={18} /> Report anfordern & Herunterladen
                                    </>
                                    )}
                                </button>
                                
                                <p className="text-[10px] text-slate-400 mt-3 text-center">
                                Durch Klick stimmen Sie zu, dass Novartum Sie bzgl. IT-Services kontaktieren darf.
                                </p>
                            </div>
                        </form>
                    </div>
                  </>
              ) : (
                  <div className="text-center animate-in zoom-in-95 duration-300">
                     <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                        <CheckCircle2 size={32} />
                     </div>
                     <h3 className="text-2xl font-bold mb-2 text-slate-900">Vielen Dank!</h3>
                     <p className="text-slate-600 text-sm mb-6">
                       Ihr Report wurde heruntergeladen und per E-Mail an <strong>{email}</strong> gesendet.
                     </p>

                     {config?.contact && (
                       <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-left flex items-start gap-4 mb-6">
                          <img 
                            src={config.contact.image} 
                            alt={config.contact.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md shrink-0 bg-gray-200" 
                          />
                          <div>
                             <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Ihr Experte</p>
                             <h4 className="font-bold text-slate-900 text-sm">{config.contact.name}</h4>
                             <p className="text-xs text-slate-500 mb-3">{config.contact.role}</p>
                             
                             <a 
                               href={`mailto:${config.contact.email}`} 
                               className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
                             >
                               Termin vereinbaren <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform"/>
                             </a>
                          </div>
                       </div>
                     )}

                     <button 
                        onClick={() => { setShowEmailModal(false); setIsSuccess(false); }}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg text-sm transition-colors"
                     >
                        Schließen
                     </button>
                  </div>
              )}
           </div>
        </div>
      )}

    </section>
  );
};

export default SAMCalculator;