/**
 * About Us Page - AI Style with Animations
 */

'use client';

import Link from 'next/link';
import { ChevronLeft, Sparkles, Target, Users, Zap, Award, Globe, Heart, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full mb-8 animate-bounce">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">AI-Powered Sports Platform</span>
          </div>

          {/* Title with Gradient */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-gradient">
              Revolutionizing
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Sports Booking
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
            We're on a mission to connect athletes with venues using cutting-edge technology
            and seamless experiences.
          </p>

          {/* Animated CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/venues"
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2">
                Explore Venues
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/auth/signup"
              className="px-8 py-4 border-2 border-purple-500/50 rounded-full font-semibold hover:bg-purple-500/20 transition-all hover:scale-105"
            >
              Join Us Today
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section with Counter Animation */}
      <section className="relative py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Venues Listed', icon: Globe },
              { value: '10K+', label: 'Active Users', icon: Users },
              { value: '50K+', label: 'Bookings Made', icon: Zap },
              { value: '4.9', label: 'User Rating', icon: Award },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-8 h-8 text-purple-400" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Our Mission
                </span>
              </h2>
              <p className="text-xl text-gray-300">
                Making sports accessible to everyone, anytime, anywhere
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Target,
                  title: 'Accessibility',
                  description: 'Breaking down barriers to sports participation with easy booking',
                  gradient: 'from-blue-500 to-cyan-500',
                },
                {
                  icon: Zap,
                  title: 'Innovation',
                  description: 'Leveraging AI to match players with perfect venues',
                  gradient: 'from-purple-500 to-pink-500',
                },
                {
                  icon: Heart,
                  title: 'Community',
                  description: 'Building a global network of sports enthusiasts',
                  gradient: 'from-pink-500 to-red-500',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group relative p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-3xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-purple-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story Timeline */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Our Journey
              </span>
            </h2>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 transform -translate-x-1/2 hidden md:block" />

              {/* Timeline Items */}
              {[
                { year: '2023', title: 'Inception', desc: 'Born from a passion for sports and technology' },
                { year: '2024', title: 'Launch', desc: 'Platform goes live with 100+ venues' },
                { year: '2025', title: 'Growth', desc: 'Expanding to new sports and regions' },
                { year: 'Future', title: 'Vision', desc: 'Becoming the global leader in sports booking' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative flex items-center mb-16 last:mb-0 group"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:ml-auto md:pl-12 md:w-5/12'}`}>
                    <div className="p-6 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 group-hover:border-purple-500/50 transition-all group-hover:scale-105">
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        {item.year}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-400">{item.desc}</p>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 top-6 w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full transform -translate-x-1/2 border-4 border-purple-900 group-hover:scale-150 transition-transform hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Meet the Team
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Passionate individuals driving change
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Alex Nguyen', role: 'CEO & Founder', image: '👨‍💻' },
              { name: 'Sarah Tran', role: 'CTO', image: '👩‍💻' },
              { name: 'Mike Le', role: 'Head of Design', image: '🎨' },
            ].map((member, index) => (
              <div
                key={index}
                className="group text-center"
              >
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center text-6xl border-2 border-purple-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    {member.image}
                  </div>
                  <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity -z-10" />
                </div>
                <h3 className="text-xl font-bold mb-1 group-hover:text-purple-300 transition-colors">
                  {member.name}
                </h3>
                <p className="text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="relative max-w-4xl mx-auto text-center p-12 md:p-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl border border-purple-500/30 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse delay-700" />

            <div className="relative">
              <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-6 animate-bounce" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Join the Revolution?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Be part of the future of sports booking
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 transition-all"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-40px) translateX(-10px); }
          75% { transform: translateY(-20px) translateX(-5px); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}
