'use client'

import React, { useState } from 'react'
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Sparkles, Code2, Terminal, Bot, Split, Server, MessageSquare, Menu, X, Send } from 'lucide-react'
import Link from 'next/link'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

const FadeIn = ({ children, delay = 0, className }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
)

const SpotlightCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <div
      className={cn(
        "group relative border border-white/10 bg-black/60 backdrop-blur-md overflow-hidden rounded-2xl transition-all duration-300 hover:border-[#111111]/30 hover:shadow-[0_0_30px_rgba(17,17,17,0.1)]",
        className
      )}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(17, 17, 17, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  )
}

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-gray-100 overflow-x-hidden selection:bg-[#111111]/30 font-sans">

      {/* Cyber Dynamic Lighting (Inheriting body grid) */}
      <div className="theme-ambient fixed inset-0 z-0 h-full w-full bg-transparent pointer-events-none overflow-hidden">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[400px] w-[500px] rounded-full bg-[#111111] opacity-10 blur-[120px]"></div>
        <div className="absolute right-10 bottom-10 -z-10 h-[300px] w-[300px] rounded-full bg-[#6b7280] opacity-5 blur-[100px]"></div>
      </div>

      {/* Premium Glass Cyber Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl shadow-black/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#111111] to-[#111111] flex items-center justify-center shadow-[0_0_15px_rgba(17,17,17,0.5)] group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-black font-bold" />
            </div>
            <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#111111] to-[#111111] tracking-wider neon-text-cyan">
              GetFlowDone
            </span>
          </Link>

          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden md:flex items-center gap-4">
              <SignedOut>
                <Link href="/sign-in" className="text-sm font-medium text-gray-400 hover:text-[#111111] transition-colors pr-2">Log in</Link>
                <Link href="/sign-up">
                  <Button className="relative group overflow-hidden rounded-full bg-transparent text-white border border-[#111111]/50 hover:border-[#111111] px-6 h-10 text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(17,17,17,0.3)]">
                    <span className="relative z-10 flex items-center gap-1">
                      Sign up <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 -z-0 bg-gradient-to-r from-[#111111] to-[#111111] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-[#111111] to-[#111111] hover:shadow-[0_0_25px_rgba(17,17,17,0.5)] text-black font-bold rounded-full px-6 h-10 text-sm transition-all">
                    Dashboard
                  </Button>
                </Link>
                <div className="border border-white/20 rounded-full p-0.5">
                  <UserButton />
                </div>
              </SignedIn>
            </div>

            <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/95 px-6 py-4 shadow-xl">
            <SignedOut>
              <div className="flex flex-col gap-3">
                <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-600">
                  Log in
                </Link>
                <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-black text-white hover:bg-neutral-800">
                    Sign up <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-black text-white hover:bg-neutral-800">
                  Dashboard
                </Button>
              </Link>
            </SignedIn>
          </div>
        )}
      </header>

      {/* Cyber Neon Hero Section */}
      <section className="relative pt-36 lg:pt-44 pb-24 px-6 overflow-hidden min-h-screen flex items-center">

        {/* Abstract Dynamic Mesh Lights */}
        <div className="hero-mesh absolute top-0 right-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <svg className="absolute right-[-10%] top-[-10%] w-[110%] h-[110%] opacity-30 filter blur-[60px]" viewBox="0 0 1000 1000">
            <defs>
              <linearGradient id="cyanMesh" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#111111" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#4f46e5" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="pinkMesh" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6b7280" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M1000,0 C800,300 900,600 400,800 C100,900 -100,700 0,1000 L1000,1000 Z" fill="url(#cyanMesh)" className="animate-pulse duration-[8s]" />
            <path d="M1000,200 C700,400 800,700 300,900 C50,1000 -50,800 0,1100 L1000,1100 Z" fill="url(#pinkMesh)" />
          </svg>
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        <motion.div
          className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left Hero Pitch */}
          <div className="text-left mt-8 lg:mt-0">

            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 bg-[#111111]/10 border border-[#111111]/30 px-4 py-1.5 rounded-full mb-8">
                <div className="w-2 h-2 bg-[#111111] rounded-full animate-pulse shadow-[0_0_8px_#111111]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#111111]">Next-Gen Agent Orchestrator</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="text-5xl md:text-[72px] font-black mb-8 tracking-tight leading-[0.95] text-white">
                Build High-Power <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#111111] via-[#111111] to-[#4b5563] neon-text-cyan animate-gradient">
                  AI Agents
                </span> <br />
                Visually.
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-lg text-gray-400 max-w-xl mb-12 leading-relaxed font-light">
                Forget simple chatbots. Orchestrate dynamic, multi-threaded visual AI pipelines. Securely chain live APIs, evaluate logic gates, and automate decisions with zero code required.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row items-start gap-5 mb-16">
                <Link href="/sign-up">
                  <Button className="h-14 px-10 rounded-full bg-gradient-to-r from-[#111111] to-[#111111] hover:to-[#111111] text-black font-black text-base shadow-[0_0_30px_rgba(17,17,17,0.3)] hover:shadow-[0_0_45px_rgba(17,17,17,0.6)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300">
                    Start Building Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Right Hero Neon Visual Visualizer */}
          <div className="relative h-[500px] w-full flex items-center justify-center lg:justify-end">
            
            {/* Top floating action module */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute top-0 left-1/4 lg:left-12 w-64 bg-black/80 backdrop-blur-xl rounded-2xl shadow-[0_0_25px_rgba(17,17,17,0.15)] border border-[#111111]/25 p-3 z-30"
            >
              <div className="flex items-center gap-3 p-3 hover:bg-[#111111]/5 rounded-xl transition-colors">
                <div className="w-9 h-9 rounded-lg bg-[#111111]/10 border border-[#111111]/40 flex items-center justify-center text-[#111111] shrink-0 shadow-[0_0_8px_rgba(17,17,17,0.2)]">
                  <Server className="w-5 h-5" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-bold text-gray-100">REST API Sync</div>
                  <div className="text-[10px] text-gray-400 font-mono">GET /api/execute</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-[#4b5563]/5 rounded-xl transition-colors mt-1">
                <div className="w-9 h-9 rounded-lg bg-[#4b5563]/10 border border-[#4b5563]/40 flex items-center justify-center text-[#4b5563] shrink-0">
                  <Split className="w-5 h-5" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-bold text-gray-100">Logic Branching</div>
                  <div className="text-[10px] text-gray-400 font-mono">IF user.authenticated</div>
                </div>
              </div>
            </motion.div>

            {/* Cyber Chat Card Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute bottom-12 right-4 lg:right-4 w-full max-w-[390px] bg-black/80 backdrop-blur-xl rounded-3xl shadow-[0_0_60px_-10px_rgba(17,17,17,0.25)] border border-white/10 p-7 z-20 flex flex-col hover:border-[#111111]/40 transition-all duration-500"
            >
              <div className="flex flex-col gap-4 mb-6 relative w-full">
                <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/10 to-transparent -m-7 rounded-t-3xl -z-10" />

                <div className="flex justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                    <span className="text-xs text-gray-400 font-mono font-bold tracking-wide uppercase">Live Pipeline Active</span>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-red-500/30" />
                </div>

                <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }} className="flex justify-end w-full">
                  <div className="bg-[#111111]/5 text-gray-200 border border-[#111111]/20 rounded-2xl px-4 py-3 text-xs md:text-sm shadow-[0_0_10px_rgba(17,17,17,0.05)] w-fit max-w-[85%] text-left">
                    Running node validator: Does user email exist?
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6 }} className="flex justify-end w-full">
                  <div className="bg-white/5 text-gray-200 border border-white/10 rounded-2xl px-4 py-3 text-xs md:text-sm w-fit max-w-[85%] text-left">
                    Fetch CRM context from Salesforce API.
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }} className="mt-4 w-full">
                  <div className="bg-gradient-to-r from-[#111111]/20 to-[#4b5563]/20 rounded-2xl p-[1px] overflow-hidden shadow-[0_0_15px_rgba(17,17,17,0.15)] w-full">
                    <div className="bg-black/95 rounded-[15px] px-4 py-4 flex items-center justify-between relative border border-white/5">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Sparkles className="text-[#111111] w-5 h-5 animate-pulse" />
                        <span className="text-white font-bold text-sm font-mono">PIPELINE_EXECUTING</span>
                      </div>
                      <Send className="w-4 h-4 text-[#111111] animate-bounce shrink-0" />
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <h3 className="font-bold text-gray-100 text-[16px] tracking-wide font-mono uppercase">Visual Agent State</h3>
                <p className="text-gray-400 text-[13px] mt-2 font-light leading-relaxed">
                  Processing multi-layered branch endpoints via Gemini API orchestrator backend.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Infinite Tech Stack Grid Slider */}
      <section className="py-12 border-y border-white/5 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />

          <div className="flex gap-20 animate-infinite-scroll">
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                {['Next.js 16', 'Gemini AI', 'React 19', 'Convex Cloud', 'Clerk Auth', 'Arcjet Guard', 'TypeScript', 'Tailwind v4'].map((tech) => (
                  <div key={tech} className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#111111]/60 shadow-[0_0_5px_#111111]" />
                    <span className="text-xl font-black font-mono uppercase text-white/20 group-hover:text-[#111111] transition-colors duration-300 select-none tracking-widest">
                      {tech}
                    </span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Cyber Bento Grid Features */}
      <section id="features" className="py-36 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="mb-24 border-l-4 border-[#111111] pl-8">
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tight uppercase">
                Ultimate Precision. <br />
                No Barriers.
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl font-light">From visual mapping to production execution in single milliseconds.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:auto-rows-[320px]">

            <SpotlightCard className="md:col-span-2 row-span-2 bg-black/50 relative overflow-hidden min-h-[500px] border border-[#111111]/20">
              <div className="h-full flex flex-col relative overflow-hidden">

                <div className="relative md:absolute top-0 left-0 right-0 p-8 z-20 bg-gradient-to-b from-black to-transparent">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 rounded-full bg-[#111111] animate-ping" />
                    <h3 className="text-2xl font-black font-mono text-white tracking-widest uppercase">Virtual Pipeline Sandbox</h3>
                  </div>
                  <p className="text-gray-400 max-w-sm text-sm">
                    Orchestrate custom APIs, variables, logic gateways, and LLM actions. Fully mapped instantly to executable backend functions.
                  </p>
                </div>

                {/* The visual node connector simulation */}
                <div className="relative md:absolute inset-0 top-16 overflow-hidden flex items-center justify-center p-6 md:p-0 min-h-[400px]">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(17,17,17,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,17,17,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />

                  <div className="relative w-full h-full flex flex-col md:block items-center justify-center mt-16">

                    <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-visible hidden md:block">
                      <defs>
                        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="4" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      <motion.path d="M 170 280 L 200 280" fill="none" stroke="#111111" strokeWidth="2" opacity="0.6" filter="url(#neonGlow)" />
                      <motion.circle r="3.5" fill="#111111" filter="url(#neonGlow)">
                        <animateMotion dur="1.8s" repeatCount="indefinite" path="M 170 280 L 200 280" />
                      </motion.circle>

                      <motion.path d="M 320 280 L 350 280" fill="none" stroke="#4b5563" strokeWidth="2" opacity="0.6" filter="url(#neonGlow)" />
                      <motion.circle r="3.5" fill="#4b5563" filter="url(#neonGlow)">
                        <animateMotion dur="1.8s" begin="0.5s" repeatCount="indefinite" path="M 320 280 L 350 280" />
                      </motion.circle>

                      <motion.path d="M 470 280 C 490 280, 480 200, 500 200" fill="none" stroke="#6b7280" strokeWidth="2" opacity="0.6" filter="url(#neonGlow)" />
                      <motion.circle r="3.5" fill="#6b7280" filter="url(#neonGlow)">
                        <animateMotion dur="1.5s" begin="1s" repeatCount="indefinite" path="M 470 280 C 490 280, 480 200, 500 200" />
                      </motion.circle>
                    </svg>

                    <MockNode x={50} y={240} color="blue" icon={<Play size={14} />} title="Start Trigger" sub="API_REQUEST" />
                    <MockNode x={200} y={240} color="purple" icon={<Bot size={14} />} title="AI Decider" sub="GEMINI_2.0" />
                    <MockNode x={350} y={240} color="orange" icon={<Split size={14} />} title="Branch Logic" sub="EVAL_COND" />
                    <MockNode x={500} y={160} color="green" icon={<Server size={14} />} title="CRM Action" sub="POST_LEAD" />
                  </div>
                </div>
              </div>
            </SpotlightCard>

            {/* Card 2 */}
            <SpotlightCard className="border border-white/5">
              <div className="p-8 h-full flex flex-col justify-center">
                <div className="w-12 h-12 bg-[#111111]/10 border border-[#111111]/30 rounded-xl flex items-center justify-center mb-6 text-[#111111] shadow-[0_0_15px_rgba(17,17,17,0.15)]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-mono mb-3 text-white tracking-wide uppercase">No-Code Logic Engine</h3>
                <p className="text-gray-400 text-sm font-light leading-relaxed">
                  Build complete algorithms and execute deep decision graphs completely within a high-performance visual editor.
                </p>
              </div>
            </SpotlightCard>

            {/* Card 3 */}
            <SpotlightCard className="border border-white/5">
              <div className="p-8 h-full flex flex-col justify-center">
                <div className="w-12 h-12 bg-[#4b5563]/10 border border-[#4b5563]/30 rounded-xl flex items-center justify-center mb-6 text-[#4b5563] shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-mono mb-3 text-white tracking-wide uppercase">Native SDK Export</h3>
                <p className="text-gray-400 text-sm font-light leading-relaxed">
                  Publish with a single click. Copy your compiled JSON SDK object and run your visual agents anywhere in production.
                </p>
              </div>
            </SpotlightCard>

            {/* Card 4 */}
            <SpotlightCard className="md:col-span-3 border border-[#6b7280]/20 overflow-hidden bg-black/90">
              <div className="p-8 flex flex-col md:flex-row items-center gap-12 h-full relative">
                <div className="absolute top-0 right-0 -z-0 w-48 h-48 rounded-full bg-[#6b7280]/10 filter blur-[70px] pointer-events-none" />
                
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-[#111111]/10 rounded-xl flex items-center justify-center border border-[#111111]/40 text-[#111111] shadow-[0_0_10px_rgba(17,17,17,0.15)]">
                      <Terminal className="w-6 h-6" />
                    </div>
                    <div className="h-8 w-[1px] bg-white/10" />
                    <div className="w-12 h-12 bg-[#6b7280]/10 rounded-xl flex items-center justify-center border border-[#6b7280]/40 text-[#6b7280]">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-extrabold mb-3 text-white uppercase font-mono tracking-wider">Dual Execution Modes</h3>
                  <p className="text-gray-400 font-light leading-relaxed">
                    Your visual workflows serve as native standalone Chat Endpoints instantly, or callable REST APIs for automated machine integrations.
                  </p>
                </div>

                <div className="flex-1 w-full h-auto min-h-[260px] bg-black border border-white/10 rounded-2xl relative overflow-hidden flex flex-col md:flex-row shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                  
                  <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-white/10 bg-[#080808] p-5 font-mono text-[10px] text-gray-400 flex flex-col gap-1.5 overflow-hidden">
                    <div className="flex gap-1.5 mb-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#6b7280]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#111111]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    </div>

                    <div>
                      <span className="text-[#4b5563]">const</span> res = <span className="text-[#4b5563]">await</span> <span className="text-[#111111]">fetch</span>(
                    </div>
                    <div className="pl-4">
                      <span className="text-[#22c55e]">&apos;https://getflowdone.ai/api/agent&apos;</span>, {'{'}
                    </div>
                    <div className="pl-6 font-bold text-white">
                      method: <span className="text-[#22c55e]">&apos;POST&apos;</span>,
                    </div>
                    <div className="pl-6">
                      headers: {'{'}<span className="text-gray-500">...</span>{'}'},
                    </div>
                    <div className="pl-6">
                      body: JSON.<span className="text-[#111111]">stringify</span>({'{'}
                    </div>
                    <div className="pl-8 text-[#111111]">
                      agentId: <span className="text-white">&quot;X-402&quot;</span>,
                    </div>
                    <div className="pl-8 text-[#111111]">
                      input: <span className="text-white">&quot;Fetch CRM&quot;</span>
                    </div>
                    <div className="pl-6">{'}'})</div>
                    <div>{'}'})</div>
                  </div>

                  <div className="w-full md:w-1/2 bg-black p-5 flex flex-col justify-end gap-3 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/10 to-transparent pointer-events-none" />
                    <div className="bg-[#111111]/10 border border-[#111111]/30 text-[#111111] px-3 py-2 rounded-xl rounded-br-none text-[10px] font-mono self-end max-w-[90%] shadow-[0_0_10px_rgba(17,17,17,0.1)]">
                      Querying Lead pipeline...
                    </div>
                    <div className="bg-white/5 border border-white/10 text-gray-300 px-3 py-2 rounded-xl rounded-bl-none text-[10px] font-mono self-start max-w-[90%]">
                      Done. Lead updated in CRM.
                    </div>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* CTA Pulse Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-[32px] p-16 overflow-hidden text-center group bg-black border border-[#111111]/30 shadow-[0_0_50px_rgba(17,17,17,0.15)] transition-all duration-500 hover:border-[#111111]">

            <div className="absolute inset-0 bg-gradient-to-br from-[#111111]/5 via-transparent to-[#4b5563]/5 pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[#111111]/10 filter blur-[80px] group-hover:bg-[#111111]/20 transition-colors" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-[#4b5563]/10 filter blur-[80px]" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tight uppercase font-mono">
                Ready for <br />Visual Flow?
              </h2>
              <p className="text-gray-400 mb-10 max-w-lg mx-auto font-light">
                Deploy intelligent workflow structures instantly on modern infrastructure. Limitless capacity.
              </p>
              <Link href="/sign-up">
                <Button className="h-16 px-12 rounded-full bg-gradient-to-r from-[#111111] to-[#111111] text-black text-lg font-black tracking-wider hover:shadow-[0_0_40px_rgba(17,17,17,0.7)] transition-all hover:-translate-y-1">
                  GET STARTED NOW
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Massive Cyber Footer */}
      <footer className="bg-black border-t border-white/5 relative flex flex-col items-center overflow-hidden">
        <div className="relative w-full pt-24 pb-8 px-6">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-[0.04] overflow-hidden">
            <h1 className="text-[18vw] font-black text-[#111111] tracking-tighter leading-none whitespace-nowrap font-mono">
              GETFLOWDONE
            </h1>
          </div>
          <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center">
            <div className="text-xs text-gray-600 font-mono uppercase tracking-widest">
              (c) 2026 GetFlowDone. Powered by Gemini.
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}

const MockNode = ({ x, y, color, icon, title, sub }: { x: number, y: number, color: string, icon: any, title: string, sub: string }) => {
  const colors: Record<string, string> = {
    blue: 'border-[#111111]/50 shadow-[0_0_15px_rgba(17,17,17,0.2)]',
    purple: 'border-[#4b5563]/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
    orange: 'border-[#6b7280]/50 shadow-[0_0_15px_rgba(236,72,153,0.2)]',
    green: 'border-[#22c55e]/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]',
  }

  const textColors: Record<string, string> = {
    blue: 'text-[#111111]',
    purple: 'text-[#4b5563]',
    orange: 'text-[#6b7280]',
    green: 'text-[#22c55e]',
  }

  return (
    <motion.div
      className={cn(
        "md:absolute w-36 bg-black/90 backdrop-blur-xl rounded-xl border p-3 flex flex-col gap-2.5 z-20 transition-all",
        colors[color]
      )}
      style={{ left: x, top: y }}
      whileHover={{ scale: 1.05, borderColor: '#ffffff' }}
    >
      <div className="flex items-center gap-2 pb-1.5 border-b border-white/10">
        <div className={cn("shrink-0", textColors[color])}>
          {icon}
        </div>
        <span className="text-[10px] font-extrabold text-white tracking-wider font-mono uppercase">{title}</span>
      </div>

      <div className="text-[9px] text-gray-400 font-mono bg-white/5 rounded-md p-1.5 text-center border border-white/5">
        {sub}
      </div>
    </motion.div>
  )
}

export default LandingPage
