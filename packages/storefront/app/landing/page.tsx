import {
    ArrowRight,
    BarChart3,
    Check,
    Globe,
    Layers,
    MousePointerClick,
    Package,
    Palette,
    Rocket,
    ShoppingBag,
    Sparkles,
    Store,
    X,
    Zap,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const CURRENT_YEAR = new Date().getFullYear();

export default function PlatformLandingPage() {
    return (
        <div className="bg-white overflow-x-hidden">
            <Header />
            <HeroSection />
            <ProblemSection />
            <FeaturesSection />
            <StepsSection />
            <CTASection />
            <Footer />
        </div>
    );
}

/* ─── Header ─── */
const Header: React.FC = () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-md shadow-primary/20">
                    <Package className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">Pulse</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    Features
                </a>
                <a
                    href="#how-it-works"
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                    How it works
                </a>
            </div>

            <div className="flex items-center gap-3">
                <a
                    href="https://tdata.app/dashboard/login"
                    className="hidden sm:inline-flex text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    Log in
                </a>
                <a
                    href="https://tdata.app/dashboard/signup"
                    className="bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
                >
                    Start free trial
                </a>
            </div>
        </nav>
    </header>
);

/* ─── Hero ─── */
const HeroSection: React.FC = () => (
    <section className="relative pt-36 pb-24 px-6 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 -z-10">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-gradient-to-br from-primary/8 via-accent/5 to-transparent rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-48 -right-32 w-[500px] h-[500px] bg-gradient-to-bl from-accent/8 to-transparent rounded-full blur-3xl" />
            <div className="absolute top-64 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-primary/6 to-transparent rounded-full blur-3xl" />
            {/* Grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />
        </div>

        <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/15 rounded-full px-5 py-2 mb-10 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary tracking-wide">
                    NOW IN PUBLIC BETA — TRY IT FREE
                </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-8">
                <span className="block">Launch your</span>
                <span className="block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                    dream store
                </span>
                <span className="block text-gray-300 text-4xl md:text-6xl lg:text-7xl font-extrabold mt-2">
                    in minutes.
                </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
                Design your storefront visually, manage products with ease, and start selling — all from one
                powerful dashboard. No code. No hassle.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
                <a
                    href="https://tdata.app/dashboard/signup"
                    className="group bg-gradient-to-r from-primary to-primary/90 text-white font-semibold px-10 py-4 rounded-full hover:shadow-xl hover:shadow-primary/25 transition-all flex items-center gap-2.5 text-base shadow-lg shadow-primary/20"
                >
                    Get started for free
                    <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                    href="mailto:rsthaofficial@gmail.com"
                    className="font-medium text-gray-600 hover:text-gray-900 border border-gray-200 px-10 py-4 rounded-full hover:border-gray-300 hover:shadow-md transition-all text-base"
                >
                    Talk to sales
                </a>
            </div>

            <div className="flex items-center justify-center gap-6 md:gap-10 text-sm text-gray-400">
                {['No credit card required', '14-day free trial', 'Cancel anytime'].map((text, i) => (
                    <span
                        key={text}
                        className={`flex items-center gap-2 ${i === 2 ? 'hidden sm:flex' : ''}`}
                    >
                        <Check className="w-4 h-4 text-accent" />
                        {text}
                    </span>
                ))}
            </div>
        </div>

        {/* Dashboard preview — the hero visual */}
        <div className="max-w-6xl mx-auto mt-20 perspective-[2000px]">
            <div className="relative [transform:rotateX(2deg)] hover:[transform:rotateX(0deg)] transition-transform duration-700">
                {/* Glow behind the card */}
                <div className="absolute -inset-4 bg-gradient-to-b from-primary/10 via-accent/5 to-transparent rounded-3xl blur-2xl -z-10" />

                <div className="rounded-2xl border border-gray-200/80 bg-gradient-to-b from-white to-gray-50/50 shadow-2xl shadow-gray-300/30 p-1.5">
                    <div className="rounded-xl bg-white border border-gray-100 overflow-hidden">
                        {/* Browser bar */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/60">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-300" />
                                <div className="w-3 h-3 rounded-full bg-amber-300" />
                                <div className="w-3 h-3 rounded-full bg-green-300" />
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="bg-gray-100 rounded-lg px-4 py-1.5 text-xs text-gray-400 w-72 text-center font-mono">
                                    dashboard.pulse.com
                                </div>
                            </div>
                        </div>

                        {/* Dashboard content */}
                        <div className="p-5 md:p-6 grid grid-cols-12 gap-4 min-h-[360px]">
                            {/* Sidebar */}
                            <div className="col-span-2 space-y-2">
                                <div className="h-9 bg-gradient-to-r from-primary/15 to-primary/5 rounded-lg" />
                                {[70, 55, 60, 50, 45].map((w, i) => (
                                    <div
                                        key={i}
                                        className="h-7 bg-gray-50 rounded-lg"
                                        style={{ width: `${w}%` }}
                                    />
                                ))}
                            </div>

                            {/* Main */}
                            <div className="col-span-10 space-y-4">
                                {/* Stats */}
                                <div className="grid grid-cols-4 gap-3">
                                    {[
                                        {
                                            label: 'Revenue',
                                            value: '$24,580',
                                            change: '+12.5%',
                                            accent: true,
                                        },
                                        { label: 'Orders', value: '384', change: '+8.2%' },
                                        { label: 'Customers', value: '1,247', change: '+5.1%' },
                                        { label: 'Conversion', value: '3.24%', change: '+0.8%' },
                                    ].map(stat => (
                                        <div
                                            key={stat.label}
                                            className={`rounded-xl p-4 border ${
                                                stat.accent
                                                    ? 'bg-gradient-to-br from-primary/8 to-primary/3 border-primary/15'
                                                    : 'bg-gray-50/80 border-gray-100'
                                            }`}
                                        >
                                            <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                                                {stat.label}
                                            </div>
                                            <div className="text-lg font-bold text-gray-900">
                                                {stat.value}
                                            </div>
                                            <div className="text-xs text-accent font-semibold mt-0.5">
                                                {stat.change}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Chart */}
                                <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-5">
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="text-sm font-semibold text-gray-700">
                                            Sales overview
                                        </div>
                                        <div className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">
                                            Last 7 days
                                        </div>
                                    </div>
                                    <div className="flex items-end gap-2.5 h-36">
                                        {[35, 60, 42, 78, 52, 88, 68].map((h, i) => (
                                            <div key={i} className="flex-1 flex flex-col justify-end">
                                                <div
                                                    className={`rounded-t-lg w-full ${
                                                        i === 5
                                                            ? 'bg-gradient-to-t from-primary to-primary/70'
                                                            : 'bg-gradient-to-t from-primary/25 to-primary/10'
                                                    }`}
                                                    style={{ height: `${h}%` }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-2 text-[10px] text-gray-300 font-medium">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                                            <span key={d}>{d}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

/* ─── Problem / comparison ─── */
const ProblemSection: React.FC = () => (
    <section className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 to-white -z-10" />

        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <span className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-4 block">
                    Why Pulse?
                </span>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
                    Stop juggling
                    <br />
                    <span className="text-gray-300">fragmented tools</span>
                </h2>
                <p className="text-gray-500 max-w-xl mx-auto text-lg">
                    Why manage dozens of disconnected plugins when everything can live in one place?
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* The old way */}
                <div className="rounded-2xl border border-gray-200 p-8 md:p-10 relative overflow-hidden bg-white group hover:border-red-200 transition-colors">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-400 to-orange-300" />
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-8">
                        <X className="w-5 h-5 text-red-400" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
                        The old way
                    </p>
                    <ul className="space-y-5">
                        {[
                            'Cobble together a dozen different plugins',
                            'Hire a developer for every small change',
                            'Pay for expensive maintenance & updates',
                            'Slow page loads frustrate customers',
                        ].map(item => (
                            <li key={item} className="flex items-start gap-3 text-gray-500">
                                <span className="mt-0.5 w-6 h-6 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                    <span className="text-red-400 text-xs font-bold">✕</span>
                                </span>
                                <span className="text-sm leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* The Pulse way */}
                <div className="rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/90 text-white p-8 md:p-10 relative overflow-hidden shadow-xl shadow-primary/20 group hover:shadow-2xl hover:shadow-primary/30 transition-all">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                    <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-8">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-6">
                            The Pulse way
                        </p>
                        <ul className="space-y-5">
                            {[
                                'One unified platform for everything',
                                'Drag-and-drop visual builder — no code needed',
                                'Automatic updates, zero maintenance',
                                'Lightning-fast performance out of the box',
                            ].map(item => (
                                <li key={item} className="flex items-start gap-3">
                                    <span className="mt-0.5 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                        <Check className="w-3.5 h-3.5 text-white" />
                                    </span>
                                    <span className="text-sm text-white/90 leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

/* ─── Features ─── */
const features = [
    {
        icon: Palette,
        title: 'Visual storefront builder',
        description:
            'Drag-and-drop your way to a stunning storefront. No code required — just pick, place, and publish.',
        gradient: 'from-primary/10 to-primary/5',
        iconBg: 'bg-primary/10 text-primary',
        badge: null,
    },
    {
        icon: Layers,
        title: 'Unified dashboard',
        description:
            'Products, orders, customers — manage your entire business from a single clean interface.',
        gradient: 'from-accent/10 to-accent/5',
        iconBg: 'bg-accent/10 text-accent',
        badge: null,
    },
    {
        icon: BarChart3,
        title: 'Built-in analytics',
        description:
            'Understand your customers with real-time insights. Track revenue, conversion rates, and growth trends.',
        gradient: 'from-violet-100/80 to-violet-50/50',
        iconBg: 'bg-violet-100 text-violet-600',
        badge: 'Coming Soon',
    },
    {
        icon: Globe,
        title: 'Your own custom domain',
        description:
            'Connect your domain and go live with SSL included. Your brand, your store, your rules.',
        gradient: 'from-amber-100/80 to-amber-50/50',
        iconBg: 'bg-amber-100 text-amber-600',
        badge: null,
    },
    {
        icon: ShoppingBag,
        title: 'Product management',
        description:
            'Bulk import, variant management, inventory tracking — handle thousands of products with ease.',
        gradient: 'from-rose-100/80 to-rose-50/50',
        iconBg: 'bg-rose-100 text-rose-600',
        badge: null,
    },
];

const FeaturesSection: React.FC = () => (
    <section id="features" className="py-28 px-6 relative">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
                <span className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-4 block">
                    Features
                </span>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
                    Everything you need,
                    <br />
                    <span className="text-gray-300">nothing you don&apos;t</span>
                </h2>
                <p className="text-gray-500 max-w-xl mx-auto text-lg">
                    Powerful features built into one clean platform — so you can focus on selling, not
                    configuring.
                </p>
            </div>

            {/* Top row — two hero-size cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                {features.slice(0, 2).map(f => (
                    <div
                        key={f.title}
                        className={`group relative rounded-3xl bg-gradient-to-br ${f.gradient} p-8 md:p-10 border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all overflow-hidden`}
                    >
                        <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative">
                            {/* Mini illustration */}
                            <div className="mb-8 h-44 rounded-2xl bg-white/80 border border-white flex items-center justify-center overflow-hidden shadow-sm">
                                {f.icon === Palette ? (
                                    <BuilderIllustration />
                                ) : (
                                    <DashboardIllustration />
                                )}
                            </div>
                            <div
                                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.iconBg}`}
                            >
                                <f.icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                                {f.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom row — three compact cards */}
            <div className="grid sm:grid-cols-3 gap-6">
                {features.slice(2).map(f => (
                    <div
                        key={f.title}
                        className="group relative rounded-2xl bg-white p-8 border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/60 transition-all overflow-hidden"
                    >
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gray-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-5">
                                <div
                                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${f.iconBg}`}
                                >
                                    <f.icon className="w-5 h-5" />
                                </div>
                                {f.badge && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-100 text-violet-600 px-2.5 py-1 rounded-full">
                                        {f.badge}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

/* ─── Mini illustrations for feature cards ─── */
const BuilderIllustration: React.FC = () => (
    <div className="w-full h-full p-4 flex gap-3">
        {/* Sidebar blocks */}
        <div className="w-20 space-y-2 pt-2">
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                Blocks
            </div>
            {['Header', 'Hero', 'Gallery', 'CTA'].map(b => (
                <div
                    key={b}
                    className="bg-gray-100 rounded-lg px-2 py-2 text-[10px] font-medium text-gray-500 text-center"
                >
                    {b}
                </div>
            ))}
        </div>
        {/* Canvas */}
        <div className="flex-1 border-2 border-dashed border-primary/20 rounded-xl p-3 relative bg-primary/[0.02]">
            <div className="h-6 bg-primary/10 rounded-md mb-2" />
            <div className="h-16 bg-gradient-to-r from-primary/15 to-accent/10 rounded-lg mb-2 flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary/50">Hero Block</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
                <div className="h-10 bg-gray-100 rounded" />
                <div className="h-10 bg-gray-100 rounded" />
                <div className="h-10 bg-gray-100 rounded" />
            </div>
            {/* Floating cursor */}
            <div className="absolute bottom-4 right-4">
                <MousePointerClick className="w-5 h-5 text-primary/40" />
            </div>
        </div>
    </div>
);

const DashboardIllustration: React.FC = () => (
    <div className="w-full h-full p-4 grid grid-cols-3 gap-2">
        {/* Product cards */}
        {[
            { name: 'Sneakers', price: '$89', color: 'bg-primary/10' },
            { name: 'Jacket', price: '$129', color: 'bg-accent/10' },
            { name: 'Watch', price: '$249', color: 'bg-amber-100/80' },
        ].map(p => (
            <div key={p.name} className="flex flex-col">
                <div className={`${p.color} rounded-lg flex-1 min-h-[60px] mb-2`} />
                <div className="text-[10px] font-semibold text-gray-700">{p.name}</div>
                <div className="text-[10px] text-gray-400">{p.price}</div>
            </div>
        ))}
        {/* Bottom row mini stats */}
        <div className="col-span-3 flex gap-2 mt-1">
            <div className="flex-1 bg-accent/10 rounded-md p-2">
                <div className="text-[9px] text-accent font-bold">12 Orders</div>
            </div>
            <div className="flex-1 bg-primary/10 rounded-md p-2">
                <div className="text-[9px] text-primary font-bold">$1.2k Today</div>
            </div>
        </div>
    </div>
);

/* ─── Steps ─── */
const steps = [
    {
        number: '01',
        icon: Store,
        title: 'Create your store',
        description: 'Sign up, name your store, and add your first products in under 5 minutes.',
        color: 'from-primary to-primary/80',
    },
    {
        number: '02',
        icon: Palette,
        title: 'Design your storefront',
        description: 'Use the visual builder to craft a branded experience — no coding needed.',
        color: 'from-accent to-accent/80',
    },
    {
        number: '03',
        icon: Rocket,
        title: 'Go live & sell',
        description: 'Connect your domain, enable payments, and start accepting orders worldwide.',
        color: 'from-primary to-accent',
    },
];

const StepsSection: React.FC = () => (
    <section id="how-it-works" className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 to-white -z-10" />

        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
                <span className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-4 block">
                    How it works
                </span>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
                    Three steps to
                    <br />
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        your first sale
                    </span>
                </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
                {/* Connector line */}
                <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30" />

                {steps.map(step => (
                    <div key={step.number} className="text-center relative group">
                        <div
                            className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-8 relative z-10 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                            style={{
                                boxShadow: '0 8px 30px -5px rgba(17, 50, 212, 0.2)',
                            }}
                        >
                            <step.icon className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-sm font-black text-primary/20 uppercase tracking-widest">
                            Step {step.number}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 mt-3 mb-3">{step.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

/* ─── CTA ─── */
const CTASection: React.FC = () => (
    <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
            <div className="relative rounded-[2rem] bg-gradient-to-br from-primary via-primary to-primary/90 overflow-hidden px-8 py-20 md:px-20 md:py-28 text-center">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
                        backgroundSize: '50px 50px',
                    }}
                />

                <div className="relative">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                        Ready to launch
                        <br />
                        your store?
                    </h2>
                    <p className="text-white/60 max-w-lg mx-auto mb-12 text-lg">
                        Join merchants growing with Pulse. Start your free trial today — no credit card
                        needed.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="https://tdata.app/dashboard/signup"
                            className="group bg-white text-primary font-semibold px-10 py-4 rounded-full hover:bg-gray-50 transition-all flex items-center gap-2.5 text-base shadow-xl shadow-black/10"
                        >
                            Get started for free
                            <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a
                            href="mailto:rsthaofficial@gmail.com"
                            className="font-medium text-white/90 border-2 border-white/25 px-10 py-4 rounded-full hover:bg-white/10 transition-all text-base"
                        >
                            Contact sales
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

/* ─── Footer ─── */
const Footer: React.FC = () => (
    <footer className="border-t border-gray-100 py-12 px-6">
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-sm shadow-primary/20">
                        <Package className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">Pulse</span>
                </div>

                <div className="flex items-center gap-8">
                    <a
                        href="#features"
                        className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        Features
                    </a>
                    <a
                        href="#how-it-works"
                        className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        How it works
                    </a>
                    <a
                        href="mailto:rsthaofficial@gmail.com"
                        className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        Contact
                    </a>
                </div>

                <p className="text-sm text-gray-400">© {CURRENT_YEAR} Pulse Inc.</p>
            </div>
        </div>
    </footer>
);
