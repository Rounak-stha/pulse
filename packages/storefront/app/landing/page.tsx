import { Globe, Package, Rocket, ShoppingCart, Store, Zap } from 'lucide-react';
import React from 'react';

export default function PlatformLandingPage() {
    return (
        <div>
            <Header />
            <HeroSection />
            <ComparisonSection />
            <FeaturesSection />
            <StepsSection />
            <UseCasesSection />
            <CTASection />
            <Footer />
        </div>
    );
}

const Header: React.FC = () => (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <Package className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">Pulse</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                    Product
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                    Solutions
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                    Pricing
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                    Resources
                </a>
            </div>

            <div className="flex items-center gap-2">
                <a
                    href="https://tdata.app/dashboard/login"
                    className="bg-muted/50 hover:bg-muted text-muted-foreground px-5 py-2  border border-gray-200 rounded-lg text-sm font-medium cursor-pointer"
                >
                    Log In
                </a>
                <a
                    href="https://tdata.app/dashboard/signup"
                    className="bg-primary/90 hover:bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium cursor-pointer"
                >
                    Start Free
                </a>
            </div>
        </nav>
    </header>
);

// Hero Section
const HeroSection: React.FC = () => (
    <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h1 className="text-4xl md:text-5xl lg:6xl font-bold leading-tight mb-6">
                    Everything You Need to Run and Grow Your Online Store.
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                    Design your store, manage products, and scale your business—all from one unified
                    dashboard.
                </p>
                <div className="flex items-center gap-4 mb-8">
                    <a
                        href="https://tdata.app/dashboard/signup"
                        className="bg-primary/90 hover:bg-primary text-white px-6 py-3 rounded-lg font-medium"
                    >
                        Start Free
                    </a>
                </div>
                <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span className="text-gray-600">No credit card required</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span className="text-gray-600">Setup: Free trial</span>
                    </div>
                </div>
            </div>

            <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 to-teal-100 rounded-3xl p-8 h-96 relative overflow-hidden">
                    <div className="absolute top-8 right-8 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Sales</span>
                    </div>
                    <div className="absolute top-24 right-12 bg-blue-600 rounded-full p-4 shadow-xl">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute bottom-12 right-16 bg-white rounded-full px-4 py-2 shadow-lg">
                        <span className="text-sm font-medium">Orders</span>
                    </div>
                    <div className="absolute bottom-8 left-8 bg-white rounded-full px-4 py-2 shadow-lg">
                        <span className="text-sm font-medium">Analytics</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const ComparisonSection: React.FC = () => (
    <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Stop juggling fragmented tools</h2>
            <p className="text-gray-600">
                Why settle for dozens of disconnected plugins when you can have a unified operating system for
                your business?
            </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border-2 border-red-200">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-red-600 text-xl">✕</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">The Old Way</h3>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                        <span className="text-gray-400 mt-1">—</span>
                        <span className="text-gray-600">Too many pug-ins to trial and adapt</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-gray-400 mt-1">—</span>
                        <span className="text-gray-600">Sign in to customize without code</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-gray-400 mt-1">—</span>
                        <span className="text-gray-600">Expensive maintenance & updates</span>
                    </li>
                </ul>
            </div>

            <div className="bg-blue-600 rounded-2xl p-8 text-white">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">The Pulse Way</h3>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                        <span className="text-blue-200">✓</span>
                        <span>One unified platform for everything</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-blue-200">✓</span>
                        <span>Built-in visual design tools</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-blue-200">✓</span>
                        <span>Infrastructure that scales with you</span>
                    </li>
                </ul>
            </div>
        </div>
    </section>
);

const FeaturesSection: React.FC = () => (
    <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful features built for growth</h2>
            <p className="text-gray-600">
                Everything you need to manage your business, built directly into one clean interface.
            </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8">
                <div className="bg-white rounded-xl p-6 shadow-sm mb-6 h-48 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block bg-blue-100 rounded-lg p-3 mb-3">
                            <Globe className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="bg-blue-600 text-white px-6 py-3 rounded-full inline-block font-medium">
                            BUTTON
                        </div>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Build Your Store Visually</h3>
                <p className="text-gray-600">
                    Drag and drop builder lets you create stunning, branded storefronts with zero coding
                    knowledge needed. Just drag, drop, and edit.
                </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-white rounded-2xl p-8">
                <div className="bg-white rounded-xl p-6 shadow-sm mb-6 h-48 flex items-center justify-center">
                    <div className="flex gap-4">
                        <div className="w-16 h-20 bg-blue-600 rounded-lg"></div>
                        <div className="w-16 h-20 bg-teal-400 rounded-lg"></div>
                        <div className="w-16 h-20 bg-purple-400 rounded-lg"></div>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Manage Everything in One Place</h3>
                <p className="text-gray-600">
                    Handle bulk inventory, Manage products, orders, customers, marketing—everything unified.
                    One dashboard for efficiency.
                </p>
            </div>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8">
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 mb-6 h-48 flex items-center justify-center">
                    <div className="flex items-end gap-4">
                        <div className="w-16 h-8 bg-blue-600 rounded-lg"></div>
                        <div className="w-16 h-14 bg-teal-400 rounded-lg"></div>
                        <div className="w-16 h-28 bg-purple-400 rounded-lg"></div>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Made to Grow With You</h3>
                <p className="text-gray-600">
                    Start simple and scale seamlessly. Our infrastructure grows alongside your business—from
                    startup to platform migrations.
                </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 rounded-2xl p-8 text-white">
                <div className="rounded-xl p-6 mb-6 h-48 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600/30 rounded-full blur-3xl"></div>
                    <div className="w-20 h-24 bg-blue-100 rounded-2xl flex items-center justify-center relative z-10">
                        <ShoppingCart className="w-10 h-10 text-blue-600" />
                    </div>
                </div>
                <h3 className="text-gray-900 text-xl font-bold mb-3">Fast, Reliable, and Secure</h3>
                <p className="text-gray-600">
                    Built for high performance and always-online security. Your store, your products, your
                    data is safe and your store is always online.
                </p>
            </div>
        </div>
    </section>
);

const StepsSection: React.FC = () => (
    <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Launch in three simple steps</h2>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
            <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Store className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">1. Set up your store</h3>
                <p className="text-gray-600 text-sm">
                    Create your account and add your products in minutes with our built-in tools.
                </p>
            </div>

            <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Globe className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">2. Design your website</h3>
                <p className="text-gray-600 text-sm">
                    Choose a theme and customize it with our visual builder to match your brand.
                </p>
            </div>

            <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Rocket className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">3. Start selling</h3>
                <p className="text-gray-600 text-sm">
                    Launch your store to the world and start accepting payments securely.
                </p>
            </div>
        </div>
    </section>
);

const UseCasesSection: React.FC = () => (
    <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for every stage of growth</h2>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-2xl p-8">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                    <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">DTC Brands</h3>
                <p className="text-gray-600 text-sm">
                    Perfect for direct-to-consumer brands looking to build sustainable customer relationships
                    and brand experience.
                </p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-8">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                    <Store className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Local Businesses</h3>
                <p className="text-gray-600 text-sm">
                    Take your brick-and-mortar online. Manage products, inventory and manage local pickup
                    options.
                </p>
            </div>
        </div>
    </section>
);

const CTASection: React.FC = () => (
    <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Ready to scale your business?</h2>
                <p className="text-blue-100 mb-8">
                    Join thousands of merchants growing with Pulse. Start your 14-day free trial today.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <a
                        href="https://tdata.app/dashboard/signup"
                        className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium"
                    >
                        Get Started Free
                    </a>
                    <a
                        href="mailto:rsthaofficial@gmail.com"
                        className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium"
                    >
                        Contact Sales
                    </a>
                </div>
            </div>
        </div>
    </section>
);

const Footer: React.FC = () => (
    <footer className="bg-gray-50 py-12 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
            <div className="mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                            <Package className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-gray-900">Pulse</span>
                    </div>
                    <p className="text-sm text-gray-600">Shopkeep: Simple, Flexible, and easy to use</p>
                </div>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-600">© 2024 Pulse Inc. All rights reserved.</p>
            </div>
        </div>
    </footer>
);
