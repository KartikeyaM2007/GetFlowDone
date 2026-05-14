'use client'

import React, { useState } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Sparkles, Code2, Terminal, MousePointer2, Bot, Split, Flag, Server, MessageSquare, Menu, X, Apple, Monitor, Smartphone, Send, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import Image from 'next/image'

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
        "group relative border border-gray-200 bg-white overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow",
        className
      )}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.08),
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
  const { scrollYProgress } = useScroll()

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden selection:bg-orange-500/20 font-sans">

      <div className="fixed inset-0 z-0 h-full w-full bg-white bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-10 blur-[100px]"></div>
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-lg font-bold text-gray-900">AgentFlow</span>
          </Link>

          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden md:flex items-center gap-4">
              <SignedOut>
                <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Log in</Link>
                <Link href="/sign-up">
                  <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-5 h-9 text-sm font-medium transition-transform hover:scale-105 active:scale-95">
                    Sign up
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-violet-400 to-violet-600 hover:opacity-90 text-white rounded-full px-5 h-9 text-sm">Dashboard</Button>
                </Link>
                <UserButton />
              </SignedIn>
            </div>

            <button className="md:hidden text-gray-600 hover:text-gray-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* NEW HERO SECTION */}
      <section className="relative pt-32 lg:pt-40 pb-20 px-6 overflow-hidden min-h-screen flex items-center">

        {/* Abstract Ribbon Background Mockup */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <svg className="absolute right-[-20%] top-[-10%] w-[120%] h-[120%] opacity-80" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <defs>
              <linearGradient id="ribbonGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb923c" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ef4444" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="ribbonGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M1000,0 C800,300 900,600 400,800 C100,900 -100,700 0,1000 L1000,1000 Z" fill="url(#ribbonGrad1)" className="animate-pulse duration-[10s]" />
            <path d="M1000,200 C700,400 800,700 300,900 C50,1000 -50,800 0,1100 L1000,1100 Z" fill="url(#ribbonGrad2)" />
            <path d="M1000,-100 C700,200 900,400 400,600 C-100,800 -100,400 -200,600 L1000,1000 Z" fill="url(#ribbonGrad1)" opacity="0.5" />
          </svg>
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />
        </div>

        <motion.div
          className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Column Content */}
          <div className="text-left mt-12 lg:mt-0">

            <FadeIn delay={0.2}>
              <h1 className="text-5xl md:text-[64px] font-medium mb-6 tracking-tight leading-[1.05] text-gray-900">
                Build Powerful AI Agents <br className="hidden md:block" />
                With Visual Workflows
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-lg text-gray-600 max-w-xl mb-10 leading-relaxed">
                No coding required. Connect API calls, add conditional logic, and create custom AI agents through an intuitive drag-and-drop interface powered by Gemini.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-16">
                <Link href="/sign-up">
                  <Button className="h-12 px-8 rounded-full bg-[#FF4500] hover:bg-[#E03E00] text-white text-base font-medium shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5">
                    Start Building Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

              </div>
            </FadeIn>
          </div>

          {/* Right Column Interactive Visuals */}
          <div className="relative h-[450px] md:h-[500px] lg:h-[600px] w-full mt-8 md:mt-0">

            {/* Top Dropdown Menu Graphic */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute top-0 right-4 md:right-32 w-56 md:w-64 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-2 z-30"
            >
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 shrink-0"><Server className="w-4 h-4" /></div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-semibold text-gray-900 truncate">REST API Integration</div>
                  <div className="text-[10px] text-gray-500 truncate">Connect GET/POST endpoints...</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 shrink-0"><Split className="w-4 h-4" /></div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-semibold text-gray-900 truncate">If-Else Branching</div>
                  <div className="text-[10px] text-gray-500 truncate">Intelligent conditional logic...</div>
                </div>
              </div>
            </motion.div>

            {/* Main Floating Chat/Agent Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute top-20 right-0 lg:right-[-20px] w-full max-w-[380px] bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_30px_60px_-15px_rgba(234,88,12,0.3)] border-[3px] border-white p-6 z-20 flex flex-col"
            >
              <div className="flex flex-col gap-3 mb-6 relative w-full">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-100/50 to-red-50/20 -m-6 rounded-t-3xl -z-10" />

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }} className="flex justify-end w-full">
                  <div className="bg-white text-gray-700 border border-gray-100 rounded-2xl px-4 py-3 text-xs md:text-sm shadow-sm w-fit max-w-[85%] text-left whitespace-normal break-words overflow-hidden">
                    Check if the user email exists in the database.
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6 }} className="flex justify-end w-full">
                  <div className="bg-white text-gray-700 border border-gray-100 rounded-2xl px-4 py-3 text-xs md:text-sm shadow-sm w-fit max-w-[85%] text-left whitespace-normal break-words overflow-hidden">
                    If yes, fetch their profile via the CRM API.
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }} className="mt-6 w-full">
                  <div className="bg-gradient-to-r from-orange-100 via-white to-orange-50 rounded-2xl p-1 relative overflow-hidden shadow-sm w-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/5 to-orange-500/10 animate-[pulse_2s_ease-in-out_infinite]" />
                    <div className="bg-white rounded-xl px-4 py-3.5 flex items-center justify-between relative z-10 border border-orange-100/50">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Sparkles className="text-[#FF4500] w-5 h-5 fill-[#FF4500]/20 shrink-0" />
                        <span className="text-gray-800 font-medium text-sm truncate">Executing workflow...</span>
                      </div>
                      <Send className="w-4 h-4 text-orange-400 rotate-45 shrink-0" />
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="pt-1 border-t border-gray-100 bg-white w-full">
                <h3 className="font-semibold pl-2 text-gray-900 text-[17px]">Workflow</h3>
                <p className="text-gray-500 text-[13px] mt-2 pl-2 leading-relaxed whitespace-normal break-words">
                  Executes complex multi-step workflows autonomously, handling dynamic API calls and conditional if-else branch logic.
                </p>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* THE REST OF YOUR EXISTING PAGE */}
      <section className="py-10 border-y border-gray-200 bg-gray-50/50">
        <div className="max-w-7xl mx-auto overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="flex gap-16 animate-infinite-scroll">
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                {['Next.js', 'React', 'ConvexDB', 'Clerk', 'Arcjet ', 'TypeScript', 'TailwindCSS'].map((tech) => (
                  <div key={tech} className="flex items-center gap-4 group cursor-pointer">
                    <span className="text-xl font-semibold text-gray-400 group-hover:text-blue-600 transition-colors shrink-0 select-none">
                      {tech}
                    </span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">Visual Power. No Code Required.</h2>
              <p className="text-xl text-gray-600 max-w-2xl">From visual flow to production code in seconds. Built on modern infrastructure.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[300px]">

            <SpotlightCard className="md:col-span-2 row-span-2 bg-gradient-to-br from-gray-50 to-white min-h-[500px] md:min-h-full">
              <div className="h-full flex flex-col relative overflow-hidden">

                <div className="relative md:absolute top-0 left-0 right-0 p-8 z-20 bg-gradient-to-b from-white/90 to-transparent md:pointer-events-none">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-semibold text-gray-900">Visual Workflow Builder</h3>
                  </div>
                  <p className="text-gray-600 max-w-sm">Connect custom API nodes, AI agents, and logic gates visually. Use live data from any API (Weather, Stock, etc.) instantly.</p>
                </div>

                <div className="relative md:absolute inset-0 top-0 overflow-y-auto overflow-x-hidden md:overflow-hidden flex items-center justify-center p-6 md:p-0 min-h-[400px]">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:20px_20px]" />

                  <div className="relative w-full h-full flex flex-col md:block items-center justify-center gap-4 md:gap-0">


                    <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-visible hidden md:block">
                      <motion.path d="M 170 280 L 200 280" fill="none" stroke="#334155" strokeWidth="2" />
                      <motion.circle r="3" fill="#3b82f6">
                        <animateMotion dur="2s" repeatCount="indefinite" path="M 170 280 L 200 280" />
                      </motion.circle>

                      <motion.path d="M 320 280 L 350 280" fill="none" stroke="#334155" strokeWidth="2" />
                      <motion.circle r="3" fill="#3b82f6">
                        <animateMotion dur="2s" begin="0.5s" repeatCount="indefinite" path="M 320 280 L 350 280" />
                      </motion.circle>

                      <motion.path d="M 470 280 C 490 280, 480 200, 500 200" fill="none" stroke="#334155" strokeWidth="2" />
                      <motion.circle r="3" fill="#a855f7">
                        <animateMotion dur="1.5s" begin="1s" repeatCount="indefinite" path="M 470 280 C 490 280, 480 200, 500 200" />
                      </motion.circle>

                      <motion.path d="M 620 200 C 640 200, 630 280, 650 280" fill="none" stroke="#334155" strokeWidth="2" />
                      <motion.circle r="3" fill="#a855f7">
                        <animateMotion dur="1.5s" begin="1.5s" repeatCount="indefinite" path="M 620 200 C 640 200, 630 280, 650 280" />
                      </motion.circle>
                    </svg>


                    <MockNode x={50} y={240} color="blue" icon={<Play size={14} className="ml-0.5" />} title="Start" sub="On Request" />
                    <ConnectorLine />
                    <MockNode x={200} y={240} color="purple" icon={<Bot size={14} />} title="Gemini Agent" sub="Process Input" />
                    <ConnectorLine color="purple" />
                    <MockNode x={350} y={240} color="orange" icon={<Split size={14} />} title="Condition" sub="If Approved" />
                    <ConnectorLine color="orange" />
                    <MockNode x={500} y={160} color="green" icon={<Server size={14} />} title="Weather API" sub="GET /current" />
                    <ConnectorLine color="green" />
                    <MockNode x={650} y={240} color="gray" icon={<Flag size={14} />} title="End" sub="Return JSON" />



                  </div>
                </div>
              </div>
            </SpotlightCard>


            <SpotlightCard>
              <div className="p-8 h-full flex flex-col justify-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 border border-green-500/30">
                  <Sparkles className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No-Code Platform</h3>
                <p className="text-gray-600 text-sm">
                  Design complex AI behaviors without writing code. Use drag-and-drop nodes to create agents that think and act.
                </p>
              </div>
            </SpotlightCard>


            <SpotlightCard>
              <div className="p-8 h-full flex flex-col justify-center">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 border border-purple-500/30">
                  <Code2 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Export to Code</h3>
                <p className="text-gray-600 text-sm">
                  Once your workflow is ready, publish it and copy the code to integrate directly into your own Next.js or React projects.
                </p>
              </div>
            </SpotlightCard>


            <SpotlightCard className="md:col-span-3">
              <div className="p-8 flex flex-col md:flex-row items-center gap-8 h-full">

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center border border-orange-500/30">
                      <Terminal className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="h-8 w-[1px] bg-gray-300" />
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/30">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-2 text-gray-900">Dual Deployment Mode</h3>
                  <p className="text-gray-600">
                    Your choice: Integrate into your codebase via SDK or use the ready-made chat interface.
                  </p>
                </div>


                <div className="flex-1 w-full h-auto min-h-[300px] md:min-h-[200px] bg-gray-900 rounded-xl border border-gray-700 relative overflow-hidden flex flex-col md:flex-row shadow-2xl">


                  <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-700 bg-gray-950 p-4 font-mono text-[9px] md:text-[10px] text-gray-400 flex flex-col gap-1 overflow-hidden">
                    <div className="flex gap-1.5 mb-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className="text-purple-400">const</span> res = <span className="text-purple-400">await</span> <span className="text-blue-400">fetch</span>(
                      <span className="text-green-400">&apos;https://agentflow.com/api/agent-chat&apos;</span>, {'{'}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="pl-2"
                    >
                      method: <span className="text-green-400">&apos;POST&apos;</span>,
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="pl-2"
                    >
                      headers: {'{'}<span className="text-green-400">&apos;Content-Type&apos;</span>: <span className="text-green-400">&apos;application/json&apos;</span>{'}'},
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 1.4 }}
                      className="pl-2"
                    >
                      body: JSON.<span className="text-blue-400">stringify</span>({'{'}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 1.6 }}
                      className="pl-4 text-orange-300"
                    >
                      agentId: &lt;agentId&gt;,
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 1.8 }}
                      className="pl-4 text-orange-300"
                    >
                      userInput: &lt;input&gt;
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 2.0 }}
                      className="pl-2"
                    >
                      {'}'})
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 2.2 }}
                    >
                      {'}'})
                    </motion.div>
                  </div>

                  <div className="w-full md:w-1/2 bg-gray-800 p-4 flex flex-col justify-end gap-3 relative min-h-[150px]">
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none" />


                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2.5 }}
                      className="bg-blue-600/20 border border-blue-500/30 text-blue-100 p-2 rounded-lg rounded-br-none text-[10px] md:text-xs self-end max-w-[90%]"
                    >
                      Get the weather for delhi
                    </motion.div>


                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 3.2 }}
                      className="bg-white/5 border border-white/10 text-gray-300 p-2 rounded-lg rounded-bl-none text-[10px] md:text-xs self-start max-w-[90%]"
                    >
                      The current weather in Delhi is 32°C with clear skies.
                    </motion.div>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl p-12 overflow-hidden text-center group bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 shadow-lg">

            <div className="absolute inset-0 bg-gradient-to-b from-blue-100/30 to-transparent opacity-50" />
            <motion.div
              className="absolute inset-0 bg-blue-600/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Start Building Today</h2>
              <p className="text-gray-700 mb-8 max-w-lg mx-auto">
                Join developers building the next generation of AI agents with custom APIs and logic.
              </p>
              <Link href="/sign-up">
                <Button className="h-14 px-8 rounded-full bg-gray-900 text-white hover:bg-gray-800 text-lg font-semibold transition-transform hover:-translate-y-1 shadow-lg">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>


      <footer className="bg-gray-50 border-t border-gray-200 relative flex flex-col items-center overflow-hidden">
        <div className="relative w-full pt-20 pb-6 px-6">

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
            <h1 className="text-[18vw] font-bold text-gray-900/[0.03] tracking-tighter leading-none whitespace-nowrap">
              AgentFlow
            </h1>
          </div>

          <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col min-h-[100px]">

          </div>

        </div>
      </footer>

    </div>
  )
}

const MockNode = ({ x, y, color, icon, title, sub }: { x: number, y: number, color: string, icon: any, title: string, sub: string }) => {
  const colors: Record<string, string> = {
    blue: 'border-blue-300 shadow-md',
    purple: 'border-purple-300 shadow-md',
    orange: 'border-orange-300 shadow-md',
    green: 'border-green-300 shadow-md',
    gray: 'border-gray-300 shadow-md',
  }

  const iconColors: Record<string, string> = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    green: 'bg-green-500',
    gray: 'bg-gray-500',
  }

  return (
    <motion.div
      className={cn(
        "md:absolute w-32 bg-white rounded-xl border-2 p-2.5 flex flex-col gap-2 z-20",
        colors[color]
      )}
      style={{ left: x, top: y }}
      whileHover={{ scale: 1.05 }}
    >

      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded flex items-center justify-center text-white ${iconColors[color]}`}>
            {icon}
          </div>
          <span className="text-[10px] font-semibold text-gray-900">{title}</span>
        </div>
      </div>

      <div className="px-1">
        <div className="text-[9px] text-gray-600 font-mono bg-gray-50 rounded p-1 border border-gray-200 truncate">
          {sub}
        </div>
      </div>

      <div className="hidden md:block absolute top-7 -left-1 w-2 h-2 bg-white border-2 border-gray-400 rounded-full" />
      <div className="hidden md:block absolute top-7 -right-1 w-2 h-2 bg-white border-2 border-gray-400 rounded-full" />
      <div className="md:hidden absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-2 border-gray-400 rounded-full" />
      <div className="md:hidden absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-2 border-gray-400 rounded-full" />
    </motion.div>
  )
}

const ConnectorLine = ({ color = 'blue' }: { color?: string }) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-400',
    purple: 'bg-purple-400',
    orange: 'bg-orange-400',
    green: 'bg-green-400',
  }

  return (
    <div className="md:hidden flex flex-col items-center h-8 w-px bg-gray-200 relative">
      <motion.div
        className={`absolute w-1.5 h-1.5 rounded-full ${colors[color]} shadow-[0_0_8px_rgba(59,130,246,0.5)]`}
        animate={{ y: [0, 32] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}

export default LandingPage