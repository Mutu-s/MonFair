import { globalActions } from '@/store/globalSlices'
import Link from 'next/link'
import React from 'react'
import { useDispatch } from 'react-redux'
import { FaShieldAlt, FaLock } from 'react-icons/fa'
import Image from 'next/image'

const Hero: React.FC = () => {
  const dispatch = useDispatch()
  const { setCreateModal } = globalActions

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_50%)] animate-pulse-slow"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.15),transparent_50%)] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <main className="relative lg:w-4/5 w-full mx-auto flex flex-col justify-center items-center text-center px-4 py-20 z-10">
        <div className="mb-12 animate-fade-in space-y-6">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-semibold">
              ✨ Verifiably Fair Gaming
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold mb-4 leading-tight tracking-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-300 bg-clip-text text-transparent block mt-2 font-brand drop-shadow-lg">MonFair</span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-gray-100 mb-3 max-w-3xl mx-auto font-light tracking-tight leading-relaxed">
            Provable Randomness.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400 font-semibold">Transparent Fairness.</span>{' '}
            Built on Monad.
          </p>
          <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto font-medium tracking-wide">
            Every game outcome is verifiable on-chain. No trust required.
          </p>
        </div>


        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <div className="card text-center group hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-primary-500/20 to-primary-600/10 rounded-xl text-primary-500 border border-primary-500/20 shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
                <FaShieldAlt size={32} />
              </div>
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-100 tracking-tight">VRF Powered</h3>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-medium">Verifiable randomness for fair gameplay</p>
          </div>
          
          <div className="card text-center group hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-secondary-400/20 to-secondary-500/10 rounded-xl text-secondary-400 border border-secondary-400/20 shadow-lg shadow-secondary-500/20 group-hover:shadow-secondary-500/40 transition-shadow">
                <FaLock size={32} />
              </div>
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-100 tracking-tight">Transparent</h3>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-medium">Fully verifiable and auditable</p>
          </div>
          
          <div className="card text-center group hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-accent-400/20 to-accent-500/10 rounded-xl border border-accent-400/20 shadow-lg shadow-accent-500/20 group-hover:shadow-accent-500/40 transition-shadow flex items-center justify-center">
                <Image 
                  src="/images/monad-icon.png" 
                  alt="Monad" 
                  width={32} 
                  height={32}
                  className="object-contain"
                />
              </div>
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-100 tracking-tight">On Monad</h3>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-medium">Fast transactions, low fees</p>
          </div>
        </div>
      </main>
    </section>
  )
}

export default Hero
