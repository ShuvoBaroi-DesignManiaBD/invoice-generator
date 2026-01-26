"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  Users,
  CreditCard,
  BarChart3,
  Palette,
  Moon,
  ArrowRight,
  Eye,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0F0F11] text-zinc-900 dark:text-white font-sans selection:bg-indigo-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Abstract Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 blur-[100px] rounded-full" />

        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-indigo-600 dark:text-indigo-300 text-xs font-semibold tracking-wide uppercase shadow-sm dark:shadow-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              V2.0 Now Live
            </div>

            <h2 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-balance">
              Professional invoices <br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent italic">
                rendered live.
              </span>
            </h2>

            <p className="text-lg md:text-xl text-zinc-600 dark:text-white/60 max-w-lg leading-relaxed font-light">
              Create and manage pixel-perfect professional invoices with a
              real-time editor designed for the modern freelancer.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/dashboard/invoices/new">
                <button className="bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group w-full sm:w-auto text-white">
                  Start Generating{" "}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </Link>
              <Link href="/dashboard/signup">
                <button className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/10 px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 backdrop-blur-sm shadow-sm dark:shadow-none">
                  Create account <ArrowRight size={18} />
                </button>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-8">
              <div className="flex -space-x-3 grayscale opacity-70">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0F0F11] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden"
                  >
                    <Users size={20} className="text-zinc-500" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-zinc-500 dark:text-white/50 tracking-tight">
                Trusted by 2,000+ businesses globally
              </p>
            </div>
          </div>

          <div className="relative group animate-in fade-in slide-in-from-right duration-1000">
            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-white dark:bg-[#161618] rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden shadow-2xl">
              <Image
                src="/invoice_creation_form.webp"
                alt="Invoice Editor Interface"
                width={800}
                height={600}
                className="w-full h-auto object-cover transform transition duration-700 group-hover:scale-[1.01]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid - Bento Style */}
      <section id="features" className="container mx-auto px-6 py-24 relative">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">
            Built for peak productivity.
          </h2>
          <p className="text-zinc-500 dark:text-white/50 text-lg">
            Everything you need to get paid faster, all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Main Feature */}
          <div className="bg-white dark:bg-[#161618] border border-zinc-200 dark:border-white/10 rounded-3xl p-8 flex flex-col justify-between group overflow-hidden relative shadow-sm dark:shadow-none">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mb-6">
                <Eye size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                What you see is what you get.
              </h3>
              <p className="text-zinc-600 dark:text-white/60 leading-relaxed max-w-sm">
                Our dynamic rendering engine generates your invoice preview
                instantly as you type. No more switching between tabs to check
                your work.
              </p>
            </div>
          </div>

          {/* Side Features */}
          <div className="bg-white dark:bg-[#161618] border border-zinc-200 dark:border-white/10 rounded-3xl p-8 hover:border-indigo-500/50 transition-colors group shadow-sm dark:shadow-none">
            <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <Download size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">High-Res Exports</h3>
            <p className="text-zinc-600 dark:text-white/60 text-sm">
              Export pixel-perfect PDF files with embedded fonts and optimized
              vector graphics for clear printing.
            </p>
          </div>

          <div className="bg-white dark:bg-[#161618] border border-zinc-200 dark:border-white/10 rounded-3xl p-8 hover:border-indigo-500/50 transition-colors group shadow-sm dark:shadow-none">
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Client Management</h3>
            <p className="text-zinc-600 dark:text-white/60 text-sm">
              Save your frequent clients to our database and fill invoices in a
              single click. Reduce manual entry error.
            </p>
          </div>

          {/* Dashboard Feature */}
          <div className="bg-white dark:bg-[#161618] border border-zinc-200 dark:border-white/10 rounded-3xl p-8 flex flex-col items-center gap-12 overflow-hidden group shadow-sm dark:shadow-none">
            <div className="flex-1 space-y-4">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-2xl font-bold italic">
                Intelligent Analytics Dashboard
              </h3>
              <p className="text-zinc-600 dark:text-white/60 leading-relaxed">
                Monitor your business health with a birds-eye view of your
                revenue, pending payments, and recent sales. Visual charts make
                tracking simple.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Invoice List / Management Section */}
      <section
        id="invoices"
        className="bg-zinc-100 dark:bg-white/5 py-24 relative overflow-hidden"
      >
        <div className="container mx-auto px-6 flex flex-col items-center">
          <div className="text-center mb-16 space-y-4 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold">
              Centralized Invoice Hub
            </h2>
            <p className="text-zinc-500 dark:text-white/50 text-lg">
              Manage, track status, and organize every invoice you&apos;ve ever
              created in a clean, filterable list.
            </p>
          </div>

          <div className="w-full relative group">
            <div className="absolute -inset-10 bg-indigo-500/10 blur-[100px] rounded-full"></div>
            <Image
              src="/invoices_management_page.webp"
              className="relative rounded-2xl border border-zinc-200 dark:border-white/10 shadow-3xl w-full"
              alt="Invoice management list"
              width={1200}
              height={600}
            />
          </div>
        </div>
      </section>

      {/* Theme/Settings Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
              <Palette size={24} />
            </div>
            <h2 className="text-4xl font-bold italic tracking-tight">
              Your App, Your Way
            </h2>
            <p className="text-xl text-zinc-600 dark:text-white/70 leading-relaxed font-light">
              We know your workspace environment matters. Toggle between light
              and dark modes instantly to suit your lighting conditions and
              preferences.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-white dark:bg-white/5 p-4 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm dark:shadow-none">
                <Moon size={20} className="text-indigo-400" />
                <span className="text-sm font-medium">Dark Theme</span>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-white/5 p-4 rounded-2xl border border-zinc-200 dark:border-white/10 opacity-50 shadow-sm dark:shadow-none">
                <Smartphone size={20} className="text-zinc-400" />
                <span className="text-sm font-medium">Responsive</span>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-purple-500/20 blur-[60px] rounded-full"></div>
            <Image
              src="/appearance-settings.svg"
              className="relative rounded-2xl border border-zinc-200 dark:border-white/10 shadow-2xl transform transition-transform group-hover:scale-[1.02]"
              alt="Appearance settings"
              width={800}
              height={600}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-12 text-center">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[3rem] p-12 md:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150">
            <CreditCard size={300} />
          </div>
          <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              Ready to streamline your billing?
            </h2>
            <p className="text-indigo-100 text-lg opacity-80 leading-relaxed">
              Start creating professional invoices for free. No setup fees, no
              complex onboarding. Just results.
            </p>
            <Link href="/signup">
              <button className="bg-white text-indigo-700 px-10 py-5 rounded-2xl font-extrabold hover:bg-indigo-50 transition-all shadow-2xl active:scale-95 text-lg">
                Get Started Now
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
