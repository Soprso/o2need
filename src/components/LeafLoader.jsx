import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'

// Particle component for the falling leaves
const Particle = ({ delay, size, xStart, xEnd, yEnd, duration, rotate, opacity }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: '-10vh', x: `${xStart}vw`, rotate: 0, scale: 0 }}
            animate={{
                opacity: opacity,
                y: [`-10vh`, `${yEnd / 2}vh`, `${yEnd}vh`],
                x: [`${xStart}vw`, `${(xStart + xEnd) / 2}vw`, `${xEnd}vw`],
                rotate: [0, rotate / 2, rotate],
                scale: [0, size, size * 0.8]
            }}
            transition={{ duration, delay, ease: "easeInOut", times: [0, 0.4, 1] }}
            className="absolute top-0 left-0 pointer-events-none"
            style={{ color: '#14532d' }} // Deep green
        >
            <Leaf className="w-full h-full" fill="currentColor" fillOpacity={0.2} style={{ filter: 'drop-shadow(0px 10px 15px rgba(20, 83, 45, 0.2)) blur(1px)' }} />
        </motion.div>
    )
}

const LeafLoader = ({ onComplete }) => {
    useEffect(() => {
        // Prevent scrolling while loading
        document.body.style.overflow = 'hidden'

        const t = setTimeout(() => {
            document.body.style.overflow = ''
            onComplete()
        }, 2200) // 2.2 seconds loader

        return () => {
            clearTimeout(t)
            document.body.style.overflow = ''
        }
    }, [onComplete])

    return (
        <motion.div
            initial={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-[#f6fff6]/90 flex items-center justify-center overflow-hidden"
        >
            {/* The Main Logo Reveal */}
            <div className="relative z-10 flex flex-col items-center gap-5">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0.5, duration: 1, delay: 0.2 }}
                    className="w-24 h-24 bg-gradient-to-br from-[#0a2e18] via-[#14532d] to-[#22c55e] rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden ring-4 ring-white"
                >
                    <Leaf className="w-12 h-12 text-white drop-shadow-md" />

                    {/* Shimmer effect inside logo */}
                    <motion.div
                        initial={{ x: '-150%', skewX: -20 }}
                        animate={{ x: '150%' }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-3xl font-heading font-black tracking-tight text-[#1a1a1a]"
                >
                    O2<span className="text-[#14532d]">need</span>
                </motion.h1>
            </div>

            {/* Particle System: Falling leaves diagonally with trail */}
            <div className="absolute inset-0 z-0">
                {/* Main big leaf */}
                <div className="w-32 h-32 absolute">
                    <Particle delay={0.1} size={1} xStart={-10} xEnd={110} yEnd={110} duration={2.5} rotate={180} opacity={[0, 0.6, 0]} />
                </div>
                {/* Trail leaves */}
                <div className="w-16 h-16 absolute">
                    <Particle delay={0.3} size={0.7} xStart={-5} xEnd={90} yEnd={100} duration={2.2} rotate={120} opacity={[0, 0.4, 0]} />
                </div>
                <div className="w-20 h-20 absolute">
                    <Particle delay={0.5} size={0.5} xStart={0} xEnd={100} yEnd={90} duration={2.0} rotate={240} opacity={[0, 0.5, 0]} />
                </div>
                <div className="w-12 h-12 absolute">
                    <Particle delay={0.7} size={0.4} xStart={5} xEnd={80} yEnd={105} duration={1.8} rotate={90} opacity={[0, 0.3, 0]} />
                </div>
                <div className="w-24 h-24 absolute">
                    <Particle delay={0.8} size={0.8} xStart={15} xEnd={105} yEnd={85} duration={1.9} rotate={-100} opacity={[0, 0.4, 0]} />
                </div>
            </div>

            {/* Ambient Background Glows */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-32 -left-32 w-96 h-96 bg-green-300/30 rounded-full blur-[100px] pointer-events-none"
            />
            <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#14532d]/20 rounded-full blur-[100px] pointer-events-none"
            />
        </motion.div>
    )
}

export default LeafLoader
