import React, { useState, useEffect } from 'react';
import { 
  Sun, Moon, TrendingUp, TrendingDown, Users, PhoneCall, 
  MessageSquare, Settings, DollarSign, X, ChevronRight, 
  Send, Check, Calculator, Sliders, Sparkles, Languages, 
  Percent, Info, Layers, ShieldCheck, Download, AlertTriangle, FileText
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';

// ==========================================
// MOCK DATA: CUSTOMER LEADS FOR PRIORITIZATION
// ==========================================
const INITIAL_LEADS = [
  {
    id: "IDBI-L-9843",
    name: "Sweta Pilla",
    age: 32,
    location: "Mumbai, MH",
    occupation: "Salaried (IT Project Manager)",
    salary: 120000,
    rentalIncome: 20000,
    businessInflow: 0,
    existingEmi: 15000,
    cibil: 780,
    leadScore: 94,
    incomeConfidence: 98,
    repaymentCapacityScore: 92,
    intentScore: 89,
    urgencyScore: 95,
    loanAffinity: "Personal Loan",
    eligibilityLimit: 950000,
    disposableIncome: 78000,
    maxSafeEmi: 54600,
    dti: 0.125,
    riskRating: "LOW",
    explainability: "High CIBIL score of 780 combined with a very low existing Debt-to-Income ratio (12.5%). Primary salary of ₹1.2L verified with 100% confidence over the last 12 months. Large disposable cash buffer of ₹78,000 makes this customer highly suitable for a fast-track pre-approved Personal Loan.",
    campaignStage: "Eligible Page Visited",
    lastAction: "Eligibility checked via web"
  },
  {
    id: "IDBI-L-4592",
    name: "Priya Patil",
    age: 28,
    location: "Pune, MH",
    occupation: "Salaried (Software Engineer)",
    salary: 85000,
    rentalIncome: 0,
    businessInflow: 0,
    existingEmi: 8000,
    cibil: 745,
    leadScore: 86,
    incomeConfidence: 95,
    repaymentCapacityScore: 81,
    intentScore: 92,
    urgencyScore: 84,
    loanAffinity: "Home Loan BT",
    eligibilityLimit: 4500000,
    disposableIncome: 52000,
    maxSafeEmi: 36400,
    dti: 0.094,
    riskRating: "LOW",
    explainability: "Strong transactional history showing consistent salary credits and low lifestyle spending. CIBIL is healthy at 745. Existing EMI is low. Ideal candidate for Home Loan Balance Transfer (BT) due to low debt levels and steady 20% savings margin.",
    campaignStage: "WhatsApp Initial sent",
    lastAction: "Clicked 'Check Eligibility' in WhatsApp"
  },
  {
    id: "IDBI-L-3810",
    name: "Amit Gupta",
    age: 45,
    location: "New Delhi, DL",
    occupation: "Self-Employed (Retail Shop Owner)",
    salary: 0,
    rentalIncome: 15000,
    businessInflow: 250000, // Monthly business turnover
    existingEmi: 32000,
    cibil: 690,
    leadScore: 75,
    incomeConfidence: 78,
    repaymentCapacityScore: 72,
    intentScore: 80,
    urgencyScore: 71,
    loanAffinity: "Loan Against Property",
    eligibilityLimit: 3500000,
    disposableIncome: 88000, // calculated applying haircut to business inflow
    maxSafeEmi: 61600,
    dti: 0.128,
    riskRating: "MEDIUM",
    explainability: "Self-employed customer with variable business turnover of ₹2.5L. Income Confidence is moderate (78%) due to transaction fluctuations. However, CIBIL of 690 and clean repayment track of existing ₹32K EMI warrants pre-qualification for asset-backed Loan Against Property (LAP) at a 50% LTV ratio.",
    campaignStage: "WhatsApp unresponsive",
    lastAction: "WhatsApp delivered, no response for 24h"
  },
  {
    id: "IDBI-L-1029",
    name: "Sneha Reddy",
    age: 30,
    location: "Hyderabad, TS",
    occupation: "Salaried (HR Analyst)",
    salary: 60000,
    rentalIncome: 0,
    businessInflow: 0,
    existingEmi: 22000,
    cibil: 660,
    leadScore: 58,
    incomeConfidence: 94,
    repaymentCapacityScore: 48,
    intentScore: 75,
    urgencyScore: 68,
    loanAffinity: "Auto Loan",
    eligibilityLimit: 400000,
    disposableIncome: 18000,
    maxSafeEmi: 12600,
    dti: 0.366,
    riskRating: "MEDIUM",
    explainability: "High credit card and existing EMI commitments (₹22,000 out of ₹60,000 salary), leading to a high DTI of 36.6%. Repayment buffer is thin (₹18,000 disposable). Approved limit capped at ₹4L for Auto Loan to avoid over-leveraging. Underwriting team review is recommended.",
    campaignStage: "Form Abandoned",
    lastAction: "Left document upload page midway"
  },
  {
    id: "IDBI-L-5182",
    name: "Rajesh Kumar",
    age: 39,
    location: "Bengaluru, KA",
    occupation: "Business (Restaurant Owner)",
    salary: 0,
    rentalIncome: 0,
    businessInflow: 180000,
    existingEmi: 45000,
    cibil: 610,
    leadScore: 35,
    incomeConfidence: 62,
    repaymentCapacityScore: 32,
    intentScore: 42,
    urgencyScore: 50,
    loanAffinity: "LAP Top-up",
    eligibilityLimit: 0,
    disposableIncome: 5000,
    maxSafeEmi: 3500,
    dti: 0.250,
    riskRating: "HIGH",
    explainability: "Low CIBIL score (610) with recent cheque bounce records and variable cash flows. High existing EMI obligations (₹45,000) leave a minimal disposable buffer of ₹5,000. Risk Rating is High. Not eligible for automated pre-approval. Recommended for rejection or manual security-backed restructuring.",
    campaignStage: "None",
    lastAction: "Loan enquiry failed rules"
  }
];

export default function App() {
  // Global States
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState(INITIAL_LEADS[0]);
  const [filterAffinity, setFilterAffinity] = useState('All');
  
  // Auto-Demo States
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  // Audio narration function using Web Speech Synthesis API
  const speakText = (text, callback) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // stop current narration
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
      if (englishVoice) utterance.voice = englishVoice;
      utterance.rate = 1.0;
      utterance.onend = () => { if (callback) callback(); };
      window.speechSynthesis.speak(utterance);
    } else {
      console.log("Speech Synthesis not supported: ", text);
    }
  };

  // Auto-Demo Tour Effect (3-minute automated flow)
  useEffect(() => {
    if (!isDemoRunning) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      return;
    }

    const steps = [
      {
        action: () => {
          setActiveTab('dashboard');
          setSelectedLead(INITIAL_LEADS[0]); // Select Sweta Pilla
        },
        speech: "Welcome to the IDBI Smart Lending Copilot guided audio tour. We are currently looking at the Relationship Manager Console. Here, customer leads are prioritized dynamically based on live transactional features and conversion probability, rather than static CIBIL files. For example, Sweta Pilla is bubbled up as a hot lead with an AI score of 94.",
        duration: 18000
      },
      {
        action: () => {
          // Keep showing selection
        },
        speech: "On the right details panel, the system extracts key metrics like salary confidence and calculates a precise maximum safe monthly EMI. It also generates an explainable credit audit rationale that complies with digital lending rules.",
        duration: 14000
      },
      {
        action: () => {
          setActiveTab('whatsapp');
          setWhatsappChat([
            { sender: 'bot', text: "Hi Sweta, based on your premium banking relationship with IDBI Bank, you are eligible for an instant pre-qualified Personal Loan up to ₹8 Lakh. Would you like to check your eligibility in under 2 minutes?", hasButtons: true }
          ]);
          setChatStep(0);
        },
        speech: "Next, we switch to the WhatsApp Lending Assistant. This simulated smartphone UI acts as the hero customer outreach channel. By replacing complex loan files with simple conversational clicks, it pushes conversion rates over 30 percent.",
        duration: 16000
      },
      {
        action: () => {
          // Simulate clicking eligibility
          setWhatsappChat(prev => [...prev, { sender: 'customer', text: '✅ Check Eligibility' }]);
          setChatStep(1);
          setTimeout(() => {
            setWhatsappChat(prev => [...prev, {
              sender: 'bot',
              text: "Great! Let's get started. Please select the primary purpose of your loan:",
              customOptions: ["🏡 Home Renovation", "🚗 Vehicle Purchase", "🎓 Education", "💼 Debt Consolidation"]
            }]);
          }, 1500);
        },
        speech: "The bot automatically prompts the customer for their loan purpose, net salary, and desired terms, and accepts direct bank statement uploads parsed via Document AI OCR.",
        duration: 15000
      },
      {
        action: () => {
          // Simulate salary confirm
          setWhatsappChat(prev => [...prev, { sender: 'customer', text: 'Yes, ₹1,20,000' }]);
          setChatStep(2);
          setTimeout(() => {
            setWhatsappChat(prev => [...prev, {
              sender: 'bot',
              text: "Thank you. Analyzing transaction history... ⚡\n\nBased on your monthly inflows of ₹1,20,000 and low existing credit limits, your pre-approved limit is *₹8,00,000*. Your safe EMI is *₹15,000/month*.\n\nWould you like to upload your bank statement to unlock a higher limit?",
              customOptions: ["📄 Upload Documents", "📞 Talk to Advisor", "✅ Accept Offer"]
            }]);
          }, 1500);
        },
        speech: "Based on the input salary and historical checks, the system computes the eligibility range and displays the offer instantly in the chat window, ready for user acceptance.",
        duration: 16000
      },
      {
        action: () => {
          setActiveTab('calculator');
        },
        speech: "Now, let's look at the Repayment Capacity Engine. This modeling interface allows credit analysts and branch managers to adjust customer transactions dynamically.",
        duration: 12000
      },
      {
        action: () => {
          // Animate sliders
          setCalcSalary(140000);
          setCalcRent(25000);
          setCalcEmi(10000);
        },
        speech: "As we modify parameters, the calculation panel applies vacancy haircuts to rental inflows and margin haircuts to business turnovers, recalculating the net disposable buffer, debt-to-income limits, and compliance explainability summaries in real-time.",
        duration: 18000
      },
      {
        action: () => {
          setActiveTab('campaign');
          setTargetSegment('Mumbai-based salaried professionals with CIBIL > 740 and no active Home Loans');
          setGeneratedCampaign(null);
        },
        speech: "Finally, we visit the Omnichannel Campaign Builder. Here, our marketing team can input natural language segments to instantly generate copy.",
        duration: 13000
      },
      {
        action: () => {
          // Generate
          const whatsapp = `*IDBI BANK Smart lending* 💼\n\nHi Sweta, unlock a pre-approved Personal Loan up to *₹8,00,000* at a special interest rate starting at *10.5% p.a.* \n\nCheck eligibility instantly here:\n👉 {{Eligibility_Link}}`;
          const sms = `IDBI Bank: Hi Sweta, you are pre-qualified for a Personal Loan up to Rs 8 Lakhs. Check eligibility instantly: {{Link}}`;
          const email = `Subject: Pre-Qualified Loan Offer: Unlock up to Rs 8,00,000 instantly with IDBI Bank\n\nDear Sweta,\n\nBased on your valued banking relationship, we are pleased to offer you a pre-qualified Personal Loan...\n\nWarm regards,\nRetail Lending Division\nIDBI Bank Ltd.`;
          const ivr = `[IVR Audio Transcript] "Hello! You have a pre-approved loan offer of up to 8 Lakh rupees waiting at IDBI Bank..."`;
          const voice = `[Voice Bot Script] "Hi Sweta, I'm calling from IDBI Bank. I noticed that you're eligible for a pre-qualified loan..."`;
          setGeneratedCampaign({ whatsapp, sms, email, ivr, voice });
        },
        speech: "Gemini models immediately output compliance-approved copy for WhatsApp, SMS, Email, and Voice scripts, and support regional localizations.",
        duration: 14000
      },
      {
        action: () => {
          setIsDemoRunning(false);
          setActiveTab('dashboard');
        },
        speech: "This concludes our guided audio tour of the IDBI Smart Lending Copilot. You can now test the interactive tabs, drag the repayment sliders, or trigger WhatsApp simulations yourself. Thank you for listening!",
        duration: 14000
      }
    ];

    let currentTimeout;
    const runStep = (idx) => {
      if (idx >= steps.length) {
        setIsDemoRunning(false);
        return;
      }
      const current = steps[idx];
      current.action();
      speakText(current.speech);
      currentTimeout = setTimeout(() => {
        runStep(idx + 1);
      }, current.duration);
    };

    runStep(0);

    return () => {
      clearTimeout(currentTimeout);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [isDemoRunning]);
  
  // WhatsApp Simulator States
  const [whatsappChat, setWhatsappChat] = useState([
    { sender: 'bot', text: "Hi Sweta, based on your premium banking relationship with IDBI Bank, you are eligible for an instant pre-qualified Personal Loan up to ₹8 Lakh. Would you like to check your eligibility in under 2 minutes?", hasButtons: true }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatStep, setChatStep] = useState(0); // 0: Start, 1: Purpose collected, 2: Income collected, 3: Completed

  // Calculator States
  const [calcSalary, setCalcSalary] = useState(85000);
  const [calcBusiness, setCalcBusiness] = useState(0);
  const [calcRent, setCalcRent] = useState(15000);
  const [calcEmi, setCalcEmi] = useState(12000);
  const [calcUtilities, setCalcUtilities] = useState(8000);
  const [calcLifestyle, setCalcLifestyle] = useState(15000);
  const [calcSips, setCalcSips] = useState(5000);
  const [calcBuffer, setCalcBuffer] = useState(0.70);

  // Campaign Builder States
  const [targetSegment, setTargetSegment] = useState('Salaried professionals in Metro cities with CIBIL > 720 and no active Home Loans');
  const [generatedCampaign, setGeneratedCampaign] = useState(null);
  const [campaignLanguage, setCampaignLanguage] = useState('English');

  // Dark Mode Toggle Effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Lead filter logic
  const filteredLeads = leads.filter(lead => {
    if (filterAffinity === 'All') return true;
    return lead.loanAffinity.toLowerCase().includes(filterAffinity.toLowerCase());
  });

  // Action: Allocate Lead
  const handleAllocate = (leadId, target) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, lastAction: `Allocated to ${target}`, campaignStage: "RM Allocated" };
      }
      return l;
    }));
    // Update selected lead to reflect changes immediately
    setSelectedLead(prev => prev.id === leadId ? { ...prev, lastAction: `Allocated to ${target}`, campaignStage: "RM Allocated" } : prev);
  };

  // Action: Send WhatsApp Reminder
  const handleSendWhatsAppReminder = (leadName) => {
    alert(`WhatsApp reminder triggered for ${leadName}: "Hi ${leadName.split(' ')[0]}, your pre-qualified loan offer is expiring soon. Reply YES to continue."`);
  };

  // WhatsApp Simulation Flow
  const handleChatAction = (optionText, value = null) => {
    setIsChatLoading(true);
    
    // Add user response bubble
    setWhatsappChat(prev => [...prev, { sender: 'customer', text: optionText }]);

    setTimeout(() => {
      setIsChatLoading(false);
      
      if (optionText === '📊 EMI Calculator') {
        setWhatsappChat(prev => [...prev, {
          sender: 'bot',
          text: "Let's calculate! For a loan of ₹8 Lakh at an attractive rate of 10.5% for 5 years, your estimated EMI will be *₹17,196* per month. Would you like to proceed with the application?",
          hasButtons: false
        }]);
        return;
      }
      if (optionText === '📞 Talk to Advisor') {
        setWhatsappChat(prev => [...prev, {
          sender: 'bot',
          text: "Understood. Our Relationship Manager will call you on your registered mobile number in 5 minutes. Thank you!",
          hasButtons: false
        }]);
        return;
      }
      if (optionText === '❌ Not Interested') {
        setWhatsappChat(prev => [...prev, {
          sender: 'bot',
          text: "Thank you for your feedback. We have recorded your preference.",
          hasButtons: false
        }]);
        return;
      }

      // Main eligibility check flow
      if (optionText === '✅ Check Eligibility' || chatStep === 0) {
        setWhatsappChat(prev => [...prev, {
          sender: 'bot',
          text: "Great! Let's get started. Please select the primary purpose of your loan:",
          hasButtons: false,
          customOptions: ["🏡 Home Renovation", "🚗 Vehicle Purchase", "🎓 Education", "💼 Debt Consolidation"]
        }]);
        setChatStep(1);
      } else if (chatStep === 1) {
        // Purpose selected
        setWhatsappChat(prev => [...prev, {
          sender: 'bot',
          text: `Understood, selected purpose: *${optionText}*. Please enter or confirm your monthly net salary inflow (in ₹):`,
          hasButtons: false,
          confirmSalaryOption: true
        }]);
        setChatStep(2);
      } else if (chatStep === 2) {
        // Salary input/confirmed
        const salaryVal = value || 120000;
        setWhatsappChat(prev => [...prev, {
          sender: 'bot',
          text: `Thank you. Analyzing transaction history... ⚡\n\nBased on your monthly inflows of ₹${salaryVal.toLocaleString()} and low existing credit limits, your pre-approved limit is *₹8,00,000*. Your safe EMI is *₹15,000/month*.\n\nWould you like to upload your bank statement to unlock a higher limit?`,
          hasButtons: false,
          customOptions: ["📄 Upload Documents", "📞 Talk to Advisor", "✅ Accept Offer"]
        }]);
        setChatStep(3);
      } else if (optionText === '📄 Upload Documents' || optionText === '✅ Accept Offer') {
        setWhatsappChat(prev => [...prev, {
          sender: 'bot',
          text: "Excellent! Your request has been sent. Our systems are checking the document. You will receive an OTP confirmation shortly to disburse the funds.",
          hasButtons: false
        }]);
      }
    }, 1200);
  };

  // Text message send in WhatsApp
  const handleSendTextMessage = () => {
    if (!chatInput.trim()) return;
    const txt = chatInput;
    setChatInput('');
    handleChatAction(txt, parseInt(txt.replace(/[^0-9]/g, '')) || 120000);
  };

  // Campaign Generator Logic
  const handleGenerateCampaign = () => {
    setIsChatLoading(true);
    setTimeout(() => {
      setIsChatLoading(false);
      
      const whatsapp = `*IDBI BANK Smart lending* 💼\n\nHi {{Customer_Name}}, unlock a pre-approved Personal Loan up to *₹8,00,000* at a special interest rate starting at *10.5% p.a.* \n\nNo branch visits, 100% digital check in 2 minutes.\n\nClick below to check eligibility:\n👉 {{Eligibility_Link}}`;
      
      const sms = `IDBI Bank: Hi {{Name}}, you are pre-qualified for a Personal Loan up to Rs 8 Lakhs. Check eligibility instantly here: {{Link}} - IDBI Bank`;
      
      const email = `Subject: Pre-Qualified Loan Offer: Unlock up to Rs 8,00,000 instantly with IDBI Bank\n\nDear {{Customer_Name}},\n\nBased on your valued banking relationship, we are pleased to offer you a pre-qualified Personal Loan up to ₹8,00,000 with a special rate of 10.5% p.a.\n\nWhy choose IDBI Copilot?\n- Zero paper uploads\n- Funds disbursed directly into your IDBI account\n- Flexible tenure options up to 60 months\n\nClick the link below to accept the pre-approved offer:\n{{Link}}\n\nWarm regards,\nRetail Lending Division\nIDBI Bank Ltd.`;
      
      const ivr = `[IVR Audio Transcript] "Hello! You have a pre-approved loan offer of up to 8 Lakh rupees waiting at IDBI Bank. Press 1 to speak to our lending executive immediately. Press 2 to receive the application link on your WhatsApp. Press 3 to decline."`;

      const voice = `[Voice Bot Conversational Script] "Hi there, I'm calling from IDBI Bank. I noticed that you're eligible for a pre-qualified loan of 8 Lakhs based on your transaction history. Would you like me to send you the eligibility verification link on WhatsApp?"`;

      const hindi = `*आईडीबीआई बैंक स्मार्ट लेंडिंग* 💼\n\nनमस्ते {{Customer_Name}}, अपने बैंकिंग संबंधों के आधार पर ₹8,00,000 तक का पर्सनल लोन प्राप्त करें। ब्याज दरें 10.5% से शुरू।\n\n2 मिनट में पात्रता जांचें:\n👉 {{Eligibility_Link}}`;

      const marathi = `*आयडीबीआय बँक स्मार्ट लेंडिंग* 💼\n\nनमस्कार {{Customer_Name}}, आपल्या बँकिंग संबंधांवर आधारित ₹8,00,000 पर्यंतचे पर्सनल लोन मिळवा. व्याजदर केवळ 10.5% पासून सुरू.\n\n२ मिनिटात पात्रता तपासा:\n👉 {{Eligibility_Link}}`;

      setGeneratedCampaign({
        whatsapp, sms, email, ivr, voice, hindi, marathi
      });
    }, 1000);
  };

  // Calculator Form Calculation
  const totalInflow = calcSalary + (calcRent * 0.80) + (calcBusiness * 0.15);
  const totalOutflow = calcEmi + calcUtilities + calcLifestyle + calcSips;
  const disposableIncome = Math.max(0, totalInflow - totalOutflow);
  const maxSafeEmi = disposableIncome * calcBuffer;
  const dti = totalInflow > 0 ? (calcEmi / totalInflow) : 1.0;
  
  // Calculate loan limit
  const r = 10.5 / 12 / 100;
  const n = 5 * 12;
  const rawLoanLimit = maxSafeEmi > 0 ? maxSafeEmi * (((1 + r)**n - 1) / (r * (1 + r)**n)) : 0;
  const eligibilityLimit = Math.round(rawLoanLimit / 50000) * 50000;

  const calculatedRisk = dti > 0.50 || maxSafeEmi <= 0 ? "HIGH" : dti > 0.35 ? "MEDIUM" : "LOW";
  const calculatedExplainability = `Customer shows a total monthly verified inflow of ₹${totalInflow.toLocaleString(undefined, {maximumFractionDigits:2})} (including 20% rent haircut and 15% business turnover profit factor). Net monthly outflows are ₹${totalOutflow.toLocaleString()}. The monthly disposable income buffer is ₹${disposableIncome.toLocaleString()}. Applying a conservative risk buffer of ${Math.round(calcBuffer * 100)}%, the customer can comfortably handle an EMI of ₹${maxSafeEmi.toLocaleString()} per month. CIBIL score checks out, resulting in a pre-qualified limit of ₹${eligibilityLimit.toLocaleString()} under a '${calculatedRisk}' risk category.`;

  // Funnel chart configuration
  const funnelOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c}%' },
    color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
    series: [
      {
        name: 'Lead Funnel',
        type: 'funnel',
        left: '10%',
        top: '10%',
        bottom: '10%',
        width: '80%',
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside',
          formatter: '{b}: {c}%',
          textStyle: { fontFamily: 'DM Sans', fontWeight: 'bold' }
        },
        labelLine: { show: false },
        itemStyle: { borderColor: '#fff', borderWidth: 1 },
        data: [
          { value: 100, name: '1. Ingested' },
          { value: 72, name: '2. Pre-Qualified' },
          { value: 48, name: '3. Docs Uploaded' },
          { value: 36, name: '4. Sanctioned' },
          { value: 31, name: '5. Disbursed' }
        ]
      }
    ]
  };

  return (
    <div className="container">
      {/* HEADER SECTION */}
      <div className="header-row">
        <div className="header-title">
          <h1>
            IDBI Smart Lending Copilot 
            <span className="header-logo-badge">APACC COPILOT</span>
          </h1>
          <p>AI-Powered Lending & CRM Relationship Intelligence Platform</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            className={`btn ${isDemoRunning ? 'btn-danger' : 'btn-primary'}`}
            onClick={() => setIsDemoRunning(!isDemoRunning)}
            style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {isDemoRunning ? (
              <>
                <X size={16} /> Stop Auto-Demo
              </>
            ) : (
              <>
                <span>▶️</span> Start Auto-Demo (Audio)
              </>
            )}
          </button>
          <button 
            className="theme-toggle-btn" 
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle Dark/Light Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Operator</span>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>IDBI Admin Console</div>
          </div>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid-4">
        <div className="card kpi-card">
          <div className="kpi-details">
            <span className="kpi-title">Total Leads Ingested</span>
            <span className="kpi-value">12,450</span>
            <span className="kpi-trend trend-up">
              <TrendingUp size={12} /> +14.2% MoM
            </span>
          </div>
          <div className="kpi-icon-container">
            <Users size={22} />
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-details">
            <span className="kpi-title">Pre-Qualified Conversion</span>
            <span className="kpi-value">34.2%</span>
            <span className="kpi-trend trend-up">
              <TrendingUp size={12} /> +3.1% MoM
            </span>
          </div>
          <div className="kpi-icon-container">
            <ShieldCheck size={22} />
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-details">
            <span className="kpi-title">Disbursement Volume</span>
            <span className="kpi-value">₹84.5 Cr</span>
            <span className="kpi-trend trend-up">
              <TrendingUp size={12} /> +28.4% MoM
            </span>
          </div>
          <div className="kpi-icon-container">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-details">
            <span className="kpi-title">Manual Call Reduction</span>
            <span className="kpi-value">47.5%</span>
            <span className="kpi-trend trend-up">
              <TrendingUp size={12} /> -12.4% Cost
            </span>
          </div>
          <div className="kpi-icon-container">
            <PhoneCall size={22} />
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="tabs-nav">
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <Layers size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Relationship Manager Console
        </button>
        <button 
          className={`tab-btn ${activeTab === 'whatsapp' ? 'active' : ''}`}
          onClick={() => setActiveTab('whatsapp')}
        >
          <MessageSquare size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          WhatsApp Assistant Simulator ⭐
        </button>
        <button 
          className={`tab-btn ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculator')}
        >
          <Sliders size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Repayment Capacity Engine (Module 2)
        </button>
        <button 
          className={`tab-btn ${activeTab === 'campaign' ? 'active' : ''}`}
          onClick={() => setActiveTab('campaign')}
        >
          <Sparkles size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Auto Campaign Builder (Module 7)
        </button>
      </div>

      {/* ==========================================
          TAB 1: RELATIONSHIP MANAGER DASHBOARD
          ========================================== */}
      {activeTab === 'dashboard' && (
        <div className="dashboard-split">
          {/* Main Leads Table */}
          <div className={`split-table ${selectedLead ? 'split' : 'full'}`}>
            <div className="table-container">
              <div className="table-toolbar">
                <div className="table-toolbar-left">
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Prioritized Loan Leads</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--accent-light)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                    NVIDIA GPU Accelerated
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select 
                    className="form-input" 
                    style={{ margin: 0, padding: '0.35rem 0.5rem', width: 'auto' }}
                    value={filterAffinity}
                    onChange={(e) => setFilterAffinity(e.target.value)}
                  >
                    <option value="All">All Loan Types</option>
                    <option value="Personal">Personal Loan</option>
                    <option value="Home">Home Loan</option>
                    <option value="LAP">Loan Against Property</option>
                    <option value="Auto">Auto Loan</option>
                  </select>
                </div>
              </div>
              
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>CIBIL</th>
                      <th>Lead Score</th>
                      <th>Risk Rating</th>
                      <th>Affinity Product</th>
                      <th>Current Stage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr 
                        key={lead.id} 
                        className={`hoverable ${selectedLead?.id === lead.id ? 'selected' : ''}`}
                        onClick={() => setSelectedLead(lead)}
                      >
                        <td>
                          <div style={{ fontWeight: 'bold' }}>{lead.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{lead.location} • {lead.id}</div>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{lead.cibil}</td>
                        <td>
                          <div className="sparkline-container">
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                              <span style={{ fontWeight: 'bold' }}>{lead.leadScore}</span>
                            </div>
                            <div className="sparkline-bar">
                              <div 
                                className="sparkline-fill fill-accent" 
                                style={{ width: `${lead.leadScore}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge badge-${lead.riskRating.toLowerCase()}`}>
                            {lead.riskRating}
                          </span>
                        </td>
                        <td style={{ fontWeight: '600' }}>{lead.loanAffinity}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <div>{lead.campaignStage}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>{lead.lastAction}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="pagination">
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Showing {filteredLeads.length} of {leads.length} leads
                </div>
                <div className="pagination-buttons">
                  <button className="pagination-btn" disabled>&lt;</button>
                  <button className="pagination-btn" disabled>&gt;</button>
                </div>
              </div>
            </div>

            {/* Funnel Analytics Section */}
            <div className="card" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={18} /> Lead-to-Loan Conversion Funnel (Module 8)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '1.5rem' }}>
                <div style={{ height: '300px' }}>
                  <ReactECharts option={funnelOption} style={{ height: '100%', width: '100%' }} />
                </div>
              </div>
              <div className="alert-box alert-info" style={{ margin: '1rem 0 0 0' }}>
                <Info size={18} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Target Conversion Rate: &gt;30%</strong>. The current automated funnel achieves a <strong>31% final disbursement rate</strong>, representing a 3.6x increase over standard static workflows.
                </div>
              </div>
            </div>
          </div>

          {/* Details & Actions Panel */}
          {selectedLead && (
            <div className="split-panel">
              <div className="card">
                <div className="panel-header">
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{selectedLead.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{selectedLead.occupation}</span>
                  </div>
                  <button className="panel-close-btn" onClick={() => setSelectedLead(null)}>
                    <X size={18} />
                  </button>
                </div>

                {/* Sub Scores Details */}
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>
                  AI Scoring breakdown (Module 1)
                </h4>
                <div className="details-block" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <div className="details-label">Income Confidence</div>
                    <div className="details-value mono" style={{ color: 'var(--accent-color)' }}>{selectedLead.incomeConfidence}%</div>
                  </div>
                  <div>
                    <div className="details-label">Repayment Score</div>
                    <div className="details-value mono" style={{ color: 'var(--accent-color)' }}>{selectedLead.repaymentCapacityScore}/100</div>
                  </div>
                  <div>
                    <div className="details-label">Intent Score</div>
                    <div className="details-value mono">{selectedLead.intentScore}/100</div>
                  </div>
                  <div>
                    <div className="details-label">Urgency Score</div>
                    <div className="details-value mono">{selectedLead.urgencyScore}/100</div>
                  </div>
                </div>

                {/* Repayment Details */}
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', margin: '1rem 0 0.5rem 0' }}>
                  Repayment details (Module 2)
                </h4>
                <div className="details-block">
                  <div className="details-grid" style={{ marginBottom: '0.5rem' }}>
                    <div>
                      <div className="details-label">Verified Income</div>
                      <div className="details-value">₹{(selectedLead.salary + selectedLead.rentalIncome).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="details-label">Existing EMIs</div>
                      <div className="details-value">₹{selectedLead.existingEmi.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="details-grid" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                    <div>
                      <div className="details-label">Max Safe EMI</div>
                      <div className="details-value text-success" style={{ color: '#10b981' }}>₹{selectedLead.maxSafeEmi.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="details-label">Eligible Loan</div>
                      <div className="details-value text-success" style={{ color: '#10b981' }}>₹{selectedLead.eligibilityLimit.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Explainable AI */}
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', margin: '1rem 0 0.5rem 0' }}>
                  Explainability report (Module 9)
                </h4>
                <div className="details-block" style={{ backgroundColor: 'var(--accent-light)', borderLeft: '3px solid var(--accent-color)' }}>
                  <p style={{ fontSize: '0.82rem', lineHeight: '1.4', color: 'var(--text-primary)' }}>
                    {selectedLead.explainability}
                  </p>
                </div>

                {/* Next Best Action Buttons */}
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', margin: '1rem 0 0.5rem 0' }}>
                  Next Best Action (Module 4)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleSendWhatsAppReminder(selectedLead.name)}
                  >
                    <MessageSquare size={16} /> Send WhatsApp Reminder
                  </button>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleAllocate(selectedLead.id, "Mumbai Main Branch")}
                    >
                      Allocate to Branch
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleAllocate(selectedLead.id, "Core CRM System")}
                    >
                      Sync to CRM
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          TAB 2: WHATSAPP LENDING ASSISTANT SIMULATOR
          ========================================== */}
      {activeTab === 'whatsapp' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
          
          {/* Instructions Box */}
          <div className="card" style={{ flex: '1 1 400px', maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={18} /> WhatsApp Lending Assistant (Module 5)
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              This simulates the automated customer-facing eligibility check on WhatsApp. By providing instant verification buttons and calculations, it minimizes user friction, boosting conversions by over 30%.
            </p>
            <div className="alert-box alert-warning">
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>Simulation Guidelines:</strong> Click the chat buttons inside the phone screen to simulate chatbot interaction, or type a custom monthly salary into the chat input.
              </div>
            </div>
            
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', margin: '1rem 0 0.5rem 0' }}>
              Key Workflow Stages Simulated
            </h4>
            <div className="details-block" style={{ fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                <strong>Step 1: Relationship pre-approval</strong> (Eligibility invitation)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
                <strong>Step 2: Detail collection</strong> (Intent & loan purpose check)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
                <strong>Step 3: Verification & Offer</strong> (Repayment calculation integration)
              </div>
            </div>
            <button 
              className="btn btn-secondary" 
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={() => {
                setWhatsappChat([
                  { sender: 'bot', text: "Hi Sweta, based on your premium banking relationship with IDBI Bank, you are eligible for an instant pre-qualified Personal Loan up to ₹8 Lakh. Would you like to check your eligibility in under 2 minutes?", hasButtons: true }
                ]);
                setChatStep(0);
              }}
            >
              Reset Chat Session
            </button>
          </div>

          {/* Phone Screen Container */}
          <div className="phone-emulator">
            {/* Phone Header */}
            <div className="phone-header">
              <div className="phone-avatar">IDBI</div>
              <div className="phone-user-details">
                <span className="phone-username">IDBI Lending Bot</span>
                <span className="phone-status">Online • Verified Account</span>
              </div>
            </div>

            {/* Phone Chat Body */}
            <div className="phone-body">
              {whatsappChat.map((msg, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <div className={`chat-bubble ${msg.sender}`}>
                    {msg.text}
                    
                    {/* Action buttons embedded in message */}
                    {msg.hasButtons && (
                      <div className="chat-buttons">
                        <div className="chat-btn-option" onClick={() => handleChatAction('✅ Check Eligibility')}>✅ Check Eligibility</div>
                        <div className="chat-btn-option" onClick={() => handleChatAction('📊 EMI Calculator')}>📊 EMI Calculator</div>
                        <div className="chat-btn-option" onClick={() => handleChatAction('📞 Talk to Advisor')}>📞 Talk to Advisor</div>
                        <div className="chat-btn-option" onClick={() => handleChatAction('❌ Not Interested')}>❌ Not Interested</div>
                      </div>
                    )}

                    {/* Dynamic branching choices */}
                    {msg.customOptions && (
                      <div className="chat-buttons">
                        {msg.customOptions.map((opt, idx) => (
                          <div key={idx} className="chat-btn-option" onClick={() => handleChatAction(opt)}>{opt}</div>
                        ))}
                      </div>
                    )}
                    
                    {/* Quick confirm salary */}
                    {msg.confirmSalaryOption && (
                      <div className="chat-buttons">
                        <div className="chat-btn-option" onClick={() => handleChatAction("Yes, ₹1,20,000", 120000)}>Confirm ₹1,20,000</div>
                        <div className="chat-btn-option" onClick={() => handleChatAction("Yes, ₹85,000", 85000)}>Confirm ₹85,000</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="chat-bubble bot" style={{ padding: '0.4rem 0.6rem', display: 'flex', gap: '0.2rem' }}>
                  <span style={{ animation: 'pulse 1s infinite' }}>•</span>
                  <span style={{ animation: 'pulse 1s infinite 0.2s' }}>•</span>
                  <span style={{ animation: 'pulse 1s infinite 0.4s' }}>•</span>
                </div>
              )}
            </div>

            {/* Phone Footer */}
            <div className="phone-footer">
              <input 
                type="text" 
                className="phone-input" 
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendTextMessage()}
              />
              <button className="phone-send-btn" onClick={handleSendTextMessage}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 3: REPAYMENT CAPACITY ENGINE CALCULATOR
          ========================================== */}
      {activeTab === 'calculator' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          {/* Sliders Input Panel */}
          <div className="card" style={{ flex: '1 1 450px' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sliders size={20} /> Transaction Inflow & Outflow Modeler (Module 2)
            </h3>

            <div className="slider-group">
              <div className="slider-header">
                <span className="form-label">Primary Salary Credit</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>₹{calcSalary.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="20000" 
                max="300000" 
                step="5000"
                value={calcSalary} 
                onChange={(e) => setCalcSalary(Number(e.target.value))}
                className="slider-input"
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <span className="form-label">Rental Inflow Credits (Gross)</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>₹{calcRent.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100000" 
                step="5000"
                value={calcRent} 
                onChange={(e) => setCalcRent(Number(e.target.value))}
                className="slider-input"
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Note: Apply 20% vacancies haircut credit: ₹{(calcRent * 0.8).toLocaleString()}</span>
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <span className="form-label">Gross Business Turnover</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>₹{calcBusiness.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="500000" 
                step="10000"
                value={calcBusiness} 
                onChange={(e) => setCalcBusiness(Number(e.target.value))}
                className="slider-input"
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Note: Apply 15% estimated net profit margins: ₹{(calcBusiness * 0.15).toLocaleString()}</span>
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <span className="form-label">Existing EMI Commitments</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>₹{calcEmi.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100000" 
                step="2000"
                value={calcEmi} 
                onChange={(e) => setCalcEmi(Number(e.target.value))}
                className="slider-input"
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <span className="form-label">Utilities & Direct Debit Bills</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>₹{calcUtilities.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="2000" 
                max="30000" 
                step="1000"
                value={calcUtilities} 
                onChange={(e) => setCalcUtilities(Number(e.target.value))}
                className="slider-input"
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <span className="form-label">Lifestyle Spends (Dining, Shopping)</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>₹{calcLifestyle.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="5000" 
                max="80000" 
                step="2000"
                value={calcLifestyle} 
                onChange={(e) => setCalcLifestyle(Number(e.target.value))}
                className="slider-input"
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <span className="form-label">Risk Multiplier Buffer</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>{Math.round(calcBuffer * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.4" 
                max="0.8" 
                step="0.05"
                value={calcBuffer} 
                onChange={(e) => setCalcBuffer(Number(e.target.value))}
                className="slider-input"
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Standard banking safety multiplier applied to liquid savings.</span>
            </div>
          </div>

          {/* Results calculation panel */}
          <div className="card" style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calculator size={20} /> Calculation Results
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Adjusted Monthly Inflows</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  ₹{totalInflow.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </div>
              </div>
              
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Estimated Monthly Outflows</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  ₹{totalOutflow.toLocaleString()}
                </div>
              </div>

              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Net Disposable Income</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                  ₹{disposableIncome.toLocaleString()}
                </div>
              </div>

              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Calculated Safe EMI Limit</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                  ₹{maxSafeEmi.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </div>
              </div>
            </div>

            <div className="details-block" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Debt-to-Income (DTI) Ratio</span>
                <span style={{ fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{(dti * 100).toFixed(1)}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Risk Assessment Classification</span>
                <span className={`badge badge-${calculatedRisk.toLowerCase()}`}>{calculatedRisk}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                <span style={{ fontWeight: 'bold' }}>Max Loan Eligibility Estimate</span>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-color)', fontFamily: 'var(--font-mono)' }}>
                  ₹{eligibilityLimit.toLocaleString()}
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', textAlign: 'right', marginTop: '0.2rem' }}>
                (Assumed 10.5% p.a. over 60-month tenure)
              </span>
            </div>

            {/* Explainable AI block */}
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>
              AI Generation Compliance & Explanations (Module 9)
            </h4>
            <div style={{ padding: '1rem', backgroundColor: 'var(--accent-light)', borderLeft: '4px solid var(--accent-color)', borderRadius: '0 8px 8px 0', fontSize: '0.82rem', lineHeight: '1.45', flexGrow: 1 }}>
              {calculatedExplainability}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 4: AUTO CAMPAIGN BUILDER
          ========================================== */}
      {activeTab === 'campaign' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          
          {/* Segment Filter Box */}
          <div className="card" style={{ flex: '1 1 450px' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} /> Omnichannel Campaign Engine (Module 7)
            </h3>
            
            <div className="slider-group">
              <label className="form-label">Define target audience segment</label>
              <textarea 
                className="form-input" 
                rows="3" 
                style={{ fontFamily: 'var(--font-sans)', height: '80px', resize: 'vertical' }}
                value={targetSegment}
                onChange={(e) => setTargetSegment(e.target.value)}
                placeholder="E.g., High-income salaried customers in metro cities..."
              />
            </div>

            <div className="slider-group">
              <label className="form-label">Language Variants</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['English', 'Hindi', 'Marathi'].map(lang => (
                  <button 
                    key={lang}
                    className={`btn ${campaignLanguage === lang ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setCampaignLanguage(lang)}
                    style={{ flexGrow: 1 }}
                  >
                    <Languages size={14} /> {lang}
                  </button>
                ))}
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.75rem', fontWeight: 'bold' }}
              onClick={handleGenerateCampaign}
              disabled={isChatLoading}
            >
              {isChatLoading ? "Generating Templates..." : "Generate AI Campaigns"}
            </button>
            
            <div style={{ marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Our campaign engine integrates directly with <strong>Gemini 1.5 Pro</strong> models, ensuring that messaging complies with RBI guidelines and IDBI's brand voice. A/B testing variants are automatically calculated.
            </div>
          </div>

          {/* Generated Templates Box */}
          <div className="card" style={{ flex: '1 1 450px' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} /> Compliance-Approved Templates
            </h3>

            {generatedCampaign ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Variant 1: WhatsApp (Hero channel) */}
                {campaignLanguage === 'English' && (
                  <>
                    <div className="campaign-variant">
                      <div className="campaign-header">
                        <span>WhatsApp Template (Hero)</span>
                        <span style={{ color: '#10b981' }}>Approved</span>
                      </div>
                      <div className="campaign-text">{generatedCampaign.whatsapp}</div>
                      <div className="campaign-meta">Engagement Rate projection: 68-72%</div>
                    </div>

                    <div className="campaign-variant">
                      <div className="campaign-header">
                        <span>SMS Copy</span>
                        <span style={{ color: '#10b981' }}>Approved</span>
                      </div>
                      <div className="campaign-text">{generatedCampaign.sms}</div>
                    </div>

                    <div className="campaign-variant">
                      <div className="campaign-header">
                        <span>Email Newsletter</span>
                        <span style={{ color: '#10b981' }}>Approved</span>
                      </div>
                      <div className="campaign-text" style={{ fontSize: '0.8rem' }}>{generatedCampaign.email}</div>
                    </div>
                  </>
                )}

                {campaignLanguage === 'Hindi' && (
                  <div className="campaign-variant">
                    <div className="campaign-header">
                      <span>WhatsApp Template (Hindi)</span>
                      <span style={{ color: '#10b981' }}>Approved</span>
                    </div>
                    <div className="campaign-text">{generatedCampaign.hindi}</div>
                  </div>
                )}

                {campaignLanguage === 'Marathi' && (
                  <div className="campaign-variant">
                    <div className="campaign-header">
                      <span>WhatsApp Template (Marathi)</span>
                      <span style={{ color: '#10b981' }}>Approved</span>
                    </div>
                    <div className="campaign-text">{generatedCampaign.marathi}</div>
                  </div>
                )}

                {/* IVR Scripts */}
                <div className="campaign-variant" style={{ backgroundColor: 'var(--accent-light)' }}>
                  <div className="campaign-header">
                    <span>Contact Center Dialer / Voice Bot Script</span>
                    <span style={{ color: '#10b981' }}>Approved</span>
                  </div>
                  <div className="campaign-text" style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
                    {generatedCampaign.ivr}
                    <br/><br/>
                    {generatedCampaign.voice}
                  </div>
                </div>

              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <Sparkles size={48} style={{ opacity: 0.5 }} />
                <span>Define your target audience on the left and click <strong>Generate AI Campaigns</strong> to construct marketing templates instantly.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
