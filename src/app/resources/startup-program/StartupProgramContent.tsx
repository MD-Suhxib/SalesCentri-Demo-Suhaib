'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Script from 'next/script';
import {
  Rocket,
  Globe2,
  MapPin,
  Compass,
  FileText,
  Sparkles,
  Users,
  Target,
  Lightbulb,
  ArrowRight,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

const stats = [
  {
    label: 'Partner Accelerators',
    value: '45+',
    description: 'Global VC and ecosystem allies extending Sales Centri credits & advisory support',
  },
  {
    label: 'Regions Covered',
    value: '18',
    description: 'Localized playbooks tailored for key startup hubs across North America, EMEA & APAC',
  },
  {
    label: 'Capital Access',
    value: '$120M',
    description: 'Total pool of equity-free grants & discounts negotiated with program partners',
  },
  {
    label: 'Activation Time',
    value: '14 Days',
    description: 'Average time from application to onboarding with GTM experimentation sprint',
  },
];

const initiativeHighlights = [
  {
    title: 'AI Revenue Launch Sprints',
    description:
      'Hands-on onboarding that sets up SalesGPT automations, data enrichment, and outreach cadences for immediate revenue experiments.',
    icon: Rocket,
    result: 'Launch tested GTM motion in under 2 weeks.',
  },
  {
    title: 'Market Expansion Playbooks',
    description:
      'Localized content frameworks, compliance checklists, and buyer intelligence for each target region you select.',
    icon: Globe2,
    result: 'Reduce market research cycles by 60%.',
  },
  {
    title: 'Investor & Partner Briefings',
    description:
      'Curated introductions to venture partners, growth marketers, and RevOps leaders who specialize in scaling AI-led teams.',
    icon: Users,
    result: 'Secure strategic capital and advisors faster.',
  },
  {
    title: 'Proof-of-Value Benchmarks',
    description:
      'Data-backed benchmark library showing how peers improved CAC, pipeline velocity, and win rates after automation.',
    icon: Target,
    result: 'Position your startup with credible traction metrics.',
  },
];

type Region = 'All' | 'APAC' | 'ANZ' | 'Africa' | 'Americas' | 'MENA' | 'UK&I' | 'Europe';

interface Program {
  id: number;
  initiative: string;
  country: string;
  state: string;
  region: Region;
  name: string;
  article: string;
}

const programCatalog: Program[] = [
  {
    id: 1,
    initiative: 'AI Market-Entry Fast Track',
    country: 'United States',
    state: 'California',
    region: 'Americas' as Region,
    name: 'Bay Area AI Innovation Fund',
    article:
      'Weekly workshops with YC alumni GTM coaches, $75k in Sales Centri credits, and a 90-day commercialization roadmap for regulated industries.',
  },
  {
    id: 2,
    initiative: 'Enterprise Pilot Bridge',
    country: 'Canada',
    state: 'Ontario',
    region: 'Americas' as Region,
    name: 'Toronto Enterprise Co-Sell Alliance',
    article:
      'Matches growth-stage startups with Fortune 1000 enterprise buyers, includes procurement readiness audits and mutual success plans.',
  },
  {
    id: 3,
    initiative: 'Cross-Border Scale Pod',
    country: 'India',
    state: 'Karnataka',
    region: 'APAC' as Region,
    name: 'Bangalore GTM Guild',
    article:
      'Hybrid sessions with SaaS growth operators, multilingual outreach templates, and compliance workflows for EU & US expansion.',
  },
  {
    id: 4,
    initiative: 'Sustainability Sales Studio',
    country: 'United Kingdom',
    state: 'England',
    region: 'UK&I' as Region,
    name: 'London Climate Tech Collective',
    article:
      'Sector-specific demand maps, introductions to ESG-focused funds, and co-authored whitepapers for inbound credibility.',
  },
  {
    id: 5,
    initiative: 'Deep Tech Commercial Lab',
    country: 'Singapore',
    state: 'Central Region',
    region: 'APAC' as Region,
    name: 'APAC Frontier Innovation Network',
    article:
      'Invitational cohort for robotics and deep-tech startups with access to sovereign wealth partners and regional distributors.',
  },
  {
    id: 6,
    initiative: 'Revenue Ops Residency',
    country: 'Australia',
    state: 'New South Wales',
    region: 'ANZ' as Region,
    name: 'Sydney Scale Residency',
    article:
      'Six-week residency including RevOps audits, channel partner introductions, and ongoing SDR pod support from Sales Centri.',
  },
  {
    id: 7,
    initiative: 'Fintech Expansion Hub',
    country: 'United Arab Emirates',
    state: 'Dubai',
    region: 'MENA' as Region,
    name: 'Dubai Fintech Accelerator',
    article:
      'Regional fintech ecosystem access with regulatory compliance support, cross-border payment integrations, and introductions to Gulf sovereign funds.',
  },
  {
    id: 8,
    initiative: 'SaaS Market Entry Lab',
    country: 'Germany',
    state: 'Berlin',
    region: 'Europe' as Region,
    name: 'Berlin SaaS Launchpad',
    article:
      'EU market entry support with GDPR compliance frameworks, multilingual customer success templates, and introductions to European VCs.',
  },
  {
    id: 9,
    initiative: 'AI Innovation Residency',
    country: 'France',
    state: 'Paris',
    region: 'Europe' as Region,
    name: 'Paris AI Collective',
    article:
      'French market penetration program with AI research partnerships, enterprise buyer introductions, and EU expansion playbooks.',
  },
  {
    id: 10,
    initiative: 'Emerging Market Gateway',
    country: 'South Africa',
    state: 'Western Cape',
    region: 'Africa' as Region,
    name: 'Cape Town Tech Bridge',
    article:
      'Pan-African market entry with localization support, mobile-first outreach strategies, and introductions to African tech investors.',
  },
  {
    id: 11,
    initiative: 'E-commerce Scale Program',
    country: 'New Zealand',
    state: 'Auckland',
    region: 'ANZ' as Region,
    name: 'Auckland Commerce Hub',
    article:
      'ANZ e-commerce ecosystem access with logistics partner integrations, cross-border tax optimization, and introductions to retail investors.',
  },
  {
    id: 12,
    initiative: 'Healthtech Innovation Lab',
    country: 'Israel',
    state: 'Tel Aviv',
    region: 'MENA' as Region,
    name: 'Tel Aviv Healthtech Network',
    article:
      'Medical device and healthtech commercialization support with regulatory guidance, hospital partnerships, and investor connections.',
  },
  // Global Government & Regional Startup Programs
  {
    id: 13,
    initiative: 'DPIIT – Startup India',
    country: 'India',
    state: 'National',
    region: 'APAC' as Region,
    name: 'Government of India Startup Support',
    article:
      'Tax Exemption (80-IAC), Angel Tax Exemption, Patent/IPR Rebates (50–80%), Public Procurement Relaxations, Fund of Funds for Startups (FFS – ₹10,000 Cr), Startup India Seed Fund Scheme, Credit Guarantee Scheme for Startups, Global Incubator & Accelerator Network.',
  },
  {
    id: 14,
    initiative: 'Karnataka Startup Policy',
    country: 'India',
    state: 'Karnataka',
    region: 'APAC' as Region,
    name: 'Elevate Grants & Innovation Hubs',
    article:
      'Elevate Grants (up to ₹50L), Karnataka Acceleration Network, Innovation Hubs in 24 districts, LEAP (Local Economy Accelerator Programme), Karnataka Startup Policy 2025–2030.',
  },
  {
    id: 15,
    initiative: 'SSIP 2.0',
    country: 'India',
    state: 'Gujarat',
    region: 'APAC' as Region,
    name: 'Gujarat Student & Startup Innovation',
    article:
      'i-Hub (Student Startup Innovation Policy), SSIP 2.0 with Grants + Incubation support for early-stage startups.',
  },
  {
    id: 16,
    initiative: 'Fintech Valley Vizag',
    country: 'India',
    state: 'Andhra Pradesh',
    region: 'APAC' as Region,
    name: 'AP Innovation & Startup Policy',
    article:
      'Fintech Valley Vizag initiative, comprehensive Innovation & Startup Policy with incubators and seed funds.',
  },
  {
    id: 17,
    initiative: 'Mumbai Fintech Hub',
    country: 'India',
    state: 'Maharashtra',
    region: 'APAC' as Region,
    name: 'Maharashtra State Innovation Society',
    article:
      'Mumbai Fintech Hub, Maharashtra State Innovation Society (MSInS) supporting financial technology startups.',
  },
  {
    id: 18,
    initiative: 'StartupTN',
    country: 'India',
    state: 'Tamil Nadu',
    region: 'APAC' as Region,
    name: 'Tamil Nadu Startup Support',
    article:
      'StartupTN Seed Fund + Incubation, TANSEED grants for startup founders and entrepreneurs.',
  },
  {
    id: 19,
    initiative: 'Kerala Startup Mission',
    country: 'India',
    state: 'Kerala',
    region: 'APAC' as Region,
    name: 'KSUM Global Accelerator',
    article:
      'Kerala Startup Mission (KSUM) with Global Accelerator Program for scaling startups.',
  },
  {
    id: 20,
    initiative: 'Startup SG',
    country: 'Singapore',
    state: 'Singapore',
    region: 'APAC' as Region,
    name: 'Singapore Government Startup Program',
    article:
      'Startup SG Founder (grant + mentorship), Startup SG Tech (POC & POV grants), Startup SG Equity (co-investment), Enterprise SG support schemes.',
  },
  {
    id: 21,
    initiative: 'J-Startup Japan',
    country: 'Japan',
    state: 'National',
    region: 'APAC' as Region,
    name: 'METI Startup Support',
    article:
      'J-Startup Japan (METI) with subsidies for Deep Tech/Hardware Innovation, Global Acceleration Programs via JETRO.',
  },
  {
    id: 22,
    initiative: 'TIPS Program',
    country: 'South Korea',
    state: 'Seoul',
    region: 'APAC' as Region,
    name: 'Tech Incubator Program for Startups',
    article:
      'TIPS Program, KISED Founder Programs, Seoul Global Startup Center supporting tech innovation.',
  },
  {
    id: 23,
    initiative: 'Torch High-Tech Program',
    country: 'China',
    state: 'National',
    region: 'APAC' as Region,
    name: 'Chinese Government Innovation Support',
    article:
      'Torch High-Tech Development Program, Mass Innovation & Entrepreneurship Policy, City-level startup hubs in Shenzhen, Shanghai, Beijing.',
  },
  {
    id: 24,
    initiative: 'MDEC Programs',
    country: 'Malaysia',
    state: 'National',
    region: 'APAC' as Region,
    name: 'Malaysia Digital Economy Support',
    article:
      'Malaysia Digital Economy Corporation (MDEC), Cradle Fund – CIP Ignite, CIP Accelerate, MDAP acceleration schemes.',
  },
  {
    id: 25,
    initiative: 'Kemenparekraf Startups',
    country: 'Indonesia',
    state: 'National',
    region: 'APAC' as Region,
    name: 'Indonesian Government Startup Programs',
    article:
      'Kemenparekraf Startup Programs, BEKRAF and Kominfo Digital Startup Academy for digital entrepreneurs.',
  },
  {
    id: 26,
    initiative: 'Startup Filipinas',
    country: 'Philippines',
    state: 'National',
    region: 'APAC' as Region,
    name: 'Philippine Innovation Grants',
    article:
      'Startup Filipinas initiative, QBO Innovation Hub, DOST & DTI Innovation Grants for Filipino entrepreneurs.',
  },
  {
    id: 27,
    initiative: 'Australian Commercialisation',
    country: 'Australia',
    state: 'National',
    region: 'ANZ' as Region,
    name: 'Austrade Landing Pads & CSIRO Support',
    article:
      'Accelerating Commercialisation Grant, Austrade Landing Pads (San Francisco, Berlin, Tel Aviv, Shanghai, Singapore), CSIRO Kick-Start Program.',
  },
  {
    id: 28,
    initiative: 'LaunchVic & NSW Jobs',
    country: 'Australia',
    state: 'Multiple States',
    region: 'ANZ' as Region,
    name: 'State-Level Australian Programs',
    article:
      'LaunchVic (Victoria), Jobs for NSW Funds supporting state-level startup ecosystems.',
  },
  {
    id: 29,
    initiative: 'Callaghan Innovation',
    country: 'New Zealand',
    state: 'National',
    region: 'ANZ' as Region,
    name: 'New Zealand Innovation Grants',
    article:
      'Callaghan Innovation (grants + R&D support), NZTE Global Growth Program, Kiwi Launchpad & Founder Incubators.',
  },
  {
    id: 30,
    initiative: 'African Union EIP',
    country: 'African Union',
    state: 'Continental',
    region: 'Africa' as Region,
    name: 'AU Entrepreneurship Support',
    article:
      'AU-EIP (African Union Entrepreneurship Support), African Development Bank Youth Entrepreneurship Support (YES).',
  },
  {
    id: 31,
    initiative: 'Kenya Startup Bill',
    country: 'Kenya',
    state: 'National',
    region: 'Africa' as Region,
    name: 'Kenya National Innovation Agency',
    article:
      'Kenya Startup Bill initiatives, Kenya National Innovation Agency (KENIA), Konza Technopolis Startup Ecosystem.',
  },
  {
    id: 32,
    initiative: 'Tony Elumelu Foundation',
    country: 'Nigeria',
    state: 'Lagos',
    region: 'Africa' as Region,
    name: 'Nigeria Entrepreneurship Programs',
    article:
      'Tony Elumelu Foundation Entrepreneurship Program, Lagos Innovates (incubation credits, workspaces), Bank of Industry BOI-YES Program.',
  },
  {
    id: 33,
    initiative: 'SA SME Fund',
    country: 'South Africa',
    state: 'National',
    region: 'Africa' as Region,
    name: 'South African Innovation Agencies',
    article:
      'SA SME Fund, Technology Innovation Agency (TIA), SEDA (Small Enterprise Development Agency) supporting SMEs.',
  },
  {
    id: 34,
    initiative: 'ITIDA Support',
    country: 'Egypt',
    state: 'National',
    region: 'Africa' as Region,
    name: 'Egyptian Digital Startups',
    article:
      'ITIDA Startup Support, Falak Startups + Flat6Labs for Egyptian digital entrepreneurs.',
  },
  {
    id: 35,
    initiative: 'Dubai Future Foundation',
    country: 'United Arab Emirates',
    state: 'Dubai',
    region: 'MENA' as Region,
    name: 'UAE Innovation Hubs',
    article:
      'Dubai Future Foundation, DIFC Innovation Hub, Abu Dhabi Hub71 (equity-free incentives), Dubai Startup Hub.',
  },
  {
    id: 36,
    initiative: 'Monsha\'at SME Authority',
    country: 'Saudi Arabia',
    state: 'National',
    region: 'MENA' as Region,
    name: 'Saudi Arabian Government Support',
    article:
      'Monsha\'at SME Authority Programs, Saudi Venture Capital Company (SVC), Badir Technology Incubators.',
  },
  {
    id: 37,
    initiative: 'Qatar Science & Tech Park',
    country: 'Qatar',
    state: 'National',
    region: 'MENA' as Region,
    name: 'Qatar Innovation Support',
    article:
      'Qatar Science & Technology Park (QSTP), Qatar Development Bank – SME & Startup Support.',
  },
  {
    id: 38,
    initiative: 'Israel Innovation Authority',
    country: 'Israel',
    state: 'National',
    region: 'MENA' as Region,
    name: 'Israeli Tech Investment Programs',
    article:
      'Israel Innovation Authority (IIA) grants, Yozma tech investment program, Military tech transfer ecosystem.',
  },
  {
    id: 39,
    initiative: 'Oasis500 Accelerator',
    country: 'Jordan',
    state: 'Amman',
    region: 'MENA' as Region,
    name: 'Jordanian Startup Support',
    article:
      'Oasis500 Accelerator, Innovative Startups & SMEs Fund (ISSF) for Jordanian entrepreneurs.',
  },
  {
    id: 40,
    initiative: 'SBA Programs',
    country: 'United States',
    state: 'National',
    region: 'Americas' as Region,
    name: 'US Small Business Administration',
    article:
      'SBA (Small Business Administration) Programs, SBIR & STTR Grants, SBDC (Small Business Development Centers), SCORE Mentorship, SelectUSA Tech Program, Economic Development Grants.',
  },
  {
    id: 41,
    initiative: 'NSF I-Corps',
    country: 'United States',
    state: 'National',
    region: 'Americas' as Region,
    name: 'National Science Foundation Innovation',
    article:
      'NSF I-Corps Program supporting academic innovation to commercial ventures.',
  },
  {
    id: 42,
    initiative: 'Startup Visa Program',
    country: 'Canada',
    state: 'National',
    region: 'Americas' as Region,
    name: 'Canadian Startup Immigration',
    article:
      'Startup Visa Program (permanent residency for founders), IRAP (Industrial Research Assistance Program), SR&ED R&D Tax Incentive, MaRS Discovery District, Communitech.',
  },
  {
    id: 43,
    initiative: 'Start-Up Chile',
    country: 'Chile',
    state: 'National',
    region: 'Americas' as Region,
    name: 'Chilean Equity-Free Funding',
    article:
      'Start-Up Chile (equity-free funding), Follow-on Scale/Ignite programs for scaling startups.',
  },
  {
    id: 44,
    initiative: 'Startup Brasil',
    country: 'Brazil',
    state: 'National',
    region: 'Americas' as Region,
    name: 'Brazilian Startup Support',
    article:
      'Startup Brasil, SEBRAE Support Programs, FINEP Innovation Grants for Brazilian entrepreneurs.',
  },
  {
    id: 45,
    initiative: 'INADEM Programs',
    country: 'Mexico',
    state: 'National',
    region: 'Americas' as Region,
    name: 'Mexican Entrepreneurship Institute',
    article:
      'INADEM (National Entrepreneurship Institute), Angel/VC-backed accelerators supported by government.',
  },
  {
    id: 46,
    initiative: 'INNpulsa Colombia',
    country: 'Colombia',
    state: 'National',
    region: 'Americas' as Region,
    name: 'Colombian Innovation Agency',
    article:
      'INNpulsa Colombia, Ruta N (Medellín Innovation District) supporting entrepreneurial innovation.',
  },
  {
    id: 47,
    initiative: 'Startup Europe',
    country: 'European Union',
    state: 'EU-Wide',
    region: 'Europe' as Region,
    name: 'EU Startup Programs',
    article:
      'Startup Europe, EU Startup Nation Standard, Scaleup Europe Fund, Horizon Europe Grants (Deep Tech, AI, Climate), Enterprise Europe Network (EEN), INNOVATE-EU (Deep-tech accelerator), StepUp Startups Initiative.',
  },
  {
    id: 48,
    initiative: 'Innovate UK',
    country: 'United Kingdom',
    state: 'National',
    region: 'Europe' as Region,
    name: 'UK Innovation & Tax Incentives',
    article:
      'Innovate UK Smart Grants, Global Entrepreneur Programme (UKTI), SEIS/EIS Tax Incentives for investors.',
  },
  {
    id: 49,
    initiative: 'High-Tech Gründerfonds',
    country: 'Germany',
    state: 'National',
    region: 'Europe' as Region,
    name: 'German Tech Founder Support',
    article:
      'High-Tech Gründerfonds (HTGF), EXIST Founder Scholarships, Digital Hub Initiative for tech startups.',
  },
  {
    id: 50,
    initiative: 'La French Tech',
    country: 'France',
    state: 'National',
    region: 'Europe' as Region,
    name: 'French Tech Innovation',
    article:
      'La French Tech initiative, Bpifrance Innovation Funding supporting French entrepreneurs.',
  },
  {
    id: 51,
    initiative: 'Startup Visa NL',
    country: 'Netherlands',
    state: 'National',
    region: 'Europe' as Region,
    name: 'Dutch Startup Support',
    article:
      'Startup Visa NL, Innovation Credit, TechLeap NL supporting Dutch tech startups.',
  },
  {
    id: 52,
    initiative: 'Nordic Startup Support',
    country: 'Nordic Region',
    state: 'Multiple Countries',
    region: 'Europe' as Region,
    name: 'Scandinavian Innovation Programs',
    article:
      'Enterprise Finland, Vinnova (Sweden innovation agency), Innovation Fund Denmark, Norwegian startup grants across Nordic countries.',
  },
];

const resourceLibrary = [
  {
    title: 'Founder Field Notes',
    description:
      'Bi-weekly tactical roundup covering outreach scripts, nurture sequences, and pricing experiments proven by top startups in the program.',
    icon: FileText,
    cta: 'Read the latest edition',
    href: '/blog/category/startups',
  },
  {
    title: 'Glasshouse KPI Dashboard',
    description:
      'Interactive Notion workspace with templates for investor updates, GTM experiments, and retention metrics aligned to the program milestones.',
    icon: Sparkles,
    cta: 'Duplicate the workspace',
    href: '/resources/performance-calculator',
  },
  {
    title: 'Partner Insights Hub',
    description:
      'Curated interviews with venture scouts, channel partners, and RevOps leaders sharing what they look for before backing a startup.',
    icon: Lightbulb,
    cta: 'Watch on-demand sessions',
    href: '/resources/tutorials-webinars',
  },
];

const faqs = [
  {
    question: 'Who qualifies for the Sales Centri Startup Program?',
    answer:
      'We support venture-backed and bootstrapped startups with fewer than 200 employees that are building AI-driven, SaaS, or service-led revenue platforms. We prioritize teams with a defined ICP and proof of early traction, even if pre-revenue.',
  },
  {
    question: 'What support is included after acceptance?',
    answer:
      'Accepted teams receive Sales Centri platform credits, onboarding sprints, RevOps office hours, investor and partner intros, and localized templates. You also gain access to our private founder community and demo days.',
  },
  {
    question: 'Is there any cost or equity requirement?',
    answer:
      'There is no equity taken. Platform credits and partner perks are offered at no cost. Startups only pay if they choose to scale usage beyond the sponsored tier or add custom analyst pods.',
  },
  {
    question: 'How long does the program last?',
    answer:
      'The core activation runs for 12 weeks with optional extensions. Most teams continue in alumni pods where they share insights, co-market launches, and receive advanced benchmarking updates.',
  },
];

const schema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOccupationalProgram',
  name: 'Sales Centri Startup Program',
  provider: {
    '@type': 'Organization',
    name: 'Sales Centri',
    url: 'https://salescentri.com',
  },
  programPrerequisites: 'Early-stage to growth-stage startups focused on AI, SaaS, or automation-led revenue models.',
  timeToComplete: 'P3M',
  educationalCredentialAwarded: 'Sales Centri GTM Certification & Startup Partner Badge',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Complimentary access to Sales Centri platform credits, GTM playbooks, and partner network.',
  },
  hasCourse: programCatalog.map((program) => ({
    '@type': 'Course',
    name: program.name,
    description: program.article,
    provider: {
      '@type': 'Organization',
      name: 'Sales Centri',
    },
    areaServed: {
      '@type': 'Place',
      name: `${program.country}${program.state ? `, ${program.state}` : ''}`,
    },
  })),
};

export default function StartupProgramContent() {
  const [selectedRegion, setSelectedRegion] = useState<Region>('All');

  const filteredPrograms = useMemo(() => {
    if (selectedRegion === 'All') {
      return programCatalog;
    }
    return programCatalog.filter((program) => program.region === selectedRegion);
  }, [selectedRegion]);

  const regions: Region[] = ['All', 'APAC', 'ANZ', 'Africa', 'Americas', 'MENA', 'UK&I', 'Europe'];

  return (
    <>
      <Script id="startup-program-jsonld" type="application/ld+json">
        {JSON.stringify(schema)}
      </Script>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(24)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
              animate={{
                x: [0, Math.random() * 120 - 60],
                y: [0, Math.random() * 120 - 60],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Hero */}
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-5 py-2 text-sm font-medium mb-6 backdrop-blur-md">
                <Rocket className="w-4 h-4 text-blue-300" />
                <span className="text-blue-200 uppercase tracking-wider">Startup Program</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Launch Faster with the Sales Centri Startup Program
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
                Unlock tailored go-to-market support, investor-ready collateral, and a curated partner network.
                Our glasshouse framework combines data-backed playbooks with hands-on automation experts to
                scale your revenue engine from day one.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer"
                >
                  Contact Us
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/resources/case-studies"
                  className="border border-blue-500/40 text-blue-200 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 cursor-pointer"
                >
                  Review Success Stories
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="relative py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative overflow-hidden rounded-2xl bg-gray-800/40 border border-gray-700/50 backdrop-blur-xl p-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
                  <div className="relative">
                    <div className="text-3xl font-bold text-white mb-2">{item.value}</div>
                    <div className="text-gray-300 text-sm uppercase tracking-wide mb-3">{item.label}</div>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Initiative Highlights */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/40">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Startup Initiatives Built for Momentum</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Every track is engineered to reduce the time from idea to repeatable revenue. Mix-and-match
                initiatives based on your market, funding stage, and go-to-market maturity.
              </p>
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-2">
              {initiativeHighlights.map((highlight, index) => (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative overflow-hidden rounded-3xl bg-gray-800/40 border border-gray-700/50 backdrop-blur-xl p-8"
                >
                  <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
                  <div className="relative flex flex-col gap-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                      <highlight.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white">{highlight.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{highlight.description}</p>
                    <div className="flex items-center gap-2 text-blue-200 text-sm font-medium">
                      <Sparkles className="w-4 h-4" />
                      {highlight.result}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Program Catalog */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Global Program Directory</h2>
              <p className="text-lg text-gray-300 max-w-4xl mx-auto mb-8">
                Browse curated initiatives across regions. Each listing outlines the core focus, program partners,
                and the narrative you can share with stakeholders.
              </p>
            </motion.div>

            {/* Region Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div className="flex flex-wrap items-center gap-3 justify-center">
                <div className="flex items-center gap-2 text-gray-300 text-sm font-medium">
                  <Filter className="w-4 h-4 text-blue-300" />
                  Filter by Region:
                </div>
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                      selectedRegion === region
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                        : 'bg-gray-800/40 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:border-blue-500/30'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
              {selectedRegion !== 'All' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-400 text-sm mt-4"
                >
                  Showing {filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''} in {selectedRegion}
                </motion.p>
              )}
            </motion.div>

            <div className="overflow-hidden rounded-3xl border border-gray-700/60 bg-gray-900/40 backdrop-blur-xl">
              <div className="grid grid-cols-6 gap-4 text-xs sm:text-sm text-gray-300 uppercase tracking-wider px-6 py-4 bg-white/5">
                <div>Startup initiatives</div>
                <div>Region</div>
                <div>Country</div>
                <div>State / Province</div>
                <div>Program Name</div>
                <div>Article details</div>
              </div>
              <div className="divide-y divide-gray-800/60">
                {filteredPrograms.length > 0 ? (
                  filteredPrograms.map((program, index) => (
                    <motion.div
                      key={program.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                      className="grid grid-cols-1 md:grid-cols-6 gap-6 px-6 py-8 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <Compass className="w-5 h-5 text-blue-300 mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-white font-semibold text-base">{program.initiative}</div>
                          <p className="text-gray-400 text-xs">Cohort #{program.id}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-blue-500/20 text-blue-200 border border-blue-500/30">
                          {program.region}
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-gray-300">
                        <Globe2 className="w-4 h-4 mt-1 text-blue-200 flex-shrink-0" />
                        <span>{program.country}</span>
                      </div>
                      <div className="flex items-start gap-2 text-gray-300">
                        <MapPin className="w-4 h-4 mt-1 text-blue-200 flex-shrink-0" />
                        <span>{program.state}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="text-white font-medium">{program.name}</div>
                        <span className="inline-flex items-center gap-1 text-xs text-blue-200">
                          <ArrowUpRight className="w-3 h-3" />
                          Partner-led
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed md:pr-2">{program.article}</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="px-6 py-12 text-center">
                    <p className="text-gray-400 text-lg">No programs found for {selectedRegion} region.</p>
                    <button
                      onClick={() => setSelectedRegion('All')}
                      className="mt-4 text-blue-300 hover:text-blue-200 text-sm font-medium underline"
                    >
                      View all programs
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Resource Library */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/40">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Founder Resources & Articles</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Extend your learning with curated articles, whitepapers, and community hubs designed around startup FAQs.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {resourceLibrary.map((resource, index) => (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative overflow-hidden rounded-3xl bg-gray-800/40 border border-gray-700/50 backdrop-blur-xl p-8 hover:translate-y-[-6px] transition-transform duration-300"
                >
                  <div className="absolute -left-10 -top-10 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl" />
                  <div className="relative flex flex-col gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <resource.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white">{resource.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed flex-1">{resource.description}</p>
                    <Link
                      href={resource.href}
                      className="inline-flex items-center gap-2 text-blue-200 font-medium hover:text-blue-100 transition-colors"
                    >
                      {resource.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Transparent answers inspired by our FAQ and whitepaper hubs, so founders know exactly what to expect.
              </p>
            </motion.div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-gray-700/60 bg-gray-800/40 backdrop-blur-xl p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-white/5 backdrop-blur-2xl px-10 py-12"
            >
              <div className="absolute -right-20 top-0 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />
              <div className="absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />
              <div className="relative">
                <h2 className="text-4xl font-bold text-white mb-6">Ready to Accelerate Your Growth?</h2>
                <p className="text-lg text-gray-200 mb-8">
                  Submit your startup profile to receive a tailored activation plan, partner perks, and next steps
                  within two business days.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/market-place/register"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer"
                  >
                    Submit Startup Profile
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/get-started/contact"
                    className="border border-blue-300/40 text-blue-100 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 cursor-pointer"
                  >
                    Explore Strategy Guides
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}


