import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, ImageIcon, Leaf, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

// Reusable Falling Leaves Animation specifically scoped to a container
const ContainerFallingLeaves = () => (
    <div className="absolute inset-x-0 top-0 bottom-0 overflow-hidden pointer-events-none z-0 rounded-3xl">
        <style>{`
            @keyframes fall-container {
                0% { transform: translate(0, -20px) rotate(0deg); opacity: 0; }
                10% { opacity: 0.4; }
                90% { opacity: 0.4; }
                100% { transform: translate(30px, 300px) rotate(180deg); opacity: 0; }
            }
            .leaf-anim-container {
                position: absolute;
                top: -20px;
                animation: fall-container linear infinite;
            }
            .del-0 { animation-delay: 0s; animation-duration: 4s; left: 10%; color: #16a34a; }
            .del-1 { animation-delay: 1.5s; animation-duration: 5s; left: 30%; color: #14532d; }
            .del-2 { animation-delay: 0.5s; animation-duration: 4.5s; left: 50%; color: #22c55e; }
            .del-3 { animation-delay: 2s; animation-duration: 6s; left: 70%; color: #166534; }
            .del-4 { animation-delay: 1s; animation-duration: 4s; left: 90%; color: #4ade80; }
        `}</style>
        {[...Array(5)].map((_, i) => (
            <Leaf key={i} className={`leaf-anim-container del-${i} w-4 h-4 opacity-0 fill-current`} />
        ))}
    </div>
)

const TransformMyGarden = () => {
    const [file, setFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [resultImage, setResultImage] = useState(null)
    const [error, setError] = useState(null)
    const fileInputRef = useRef(null)

    // Handle File Selection
    const handleFileChange = (e) => {
        const selected = e.target.files[0]
        if (selected && selected.type.startsWith('image/')) {
            setFile(selected)
            setPreviewUrl(URL.createObjectURL(selected))
            setResultImage(null)
            setError(null)
            setProgress(0)
        } else {
            setError("Please select a valid image file.")
        }
    }

    const handleDragOver = (e) => e.preventDefault()
    const handleDrop = (e) => {
        e.preventDefault()
        const selected = e.dataTransfer.files[0]
        if (selected && selected.type.startsWith('image/')) {
            setFile(selected)
            setPreviewUrl(URL.createObjectURL(selected))
            setResultImage(null)
            setError(null)
            setProgress(0)
        }
    }

    // Convert File to Base64 for AI API
    const fileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result.split(',')[1])
        reader.onerror = error => reject(error)
    })

    // Initiate AI Transformation via Free AI Horde API
    const handleTransform = async () => {
        if (!file) return
        setIsProcessing(true)
        setError(null)
        setProgress(0)

        try {
            const base64Image = await fileToBase64(file)

            // 1. Submit Request to AI Horde
            const submitResponse = await fetch('https://aihorde.net/api/v2/generate/async', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': '0000000000', // Anonymous key
                    'Client-Agent': 'O2needGardenApp:1.0:unknown'
                },
                body: JSON.stringify({
                    prompt: "A beautiful, clean, well-maintained lush green indoor garden space with potted plants, grass mats, tidy arrangement, highly professional, realistic, architectural photography, vibrant greens",
                    params: {
                        sampler_name: "k_euler_a",
                        steps: 25,
                        cfg_scale: 7,
                        width: 512,
                        height: 512,
                        denoising_strength: 0.65 // Keep structure but change contents
                    },
                    nsfw: false,
                    censor_nsfw: true,
                    trusted_workers: false,
                    models: ["stable_diffusion"],
                    source_image: base64Image,
                    source_processing: "img2img"
                })
            })

            const submitData = await submitResponse.json()
            if (!submitResponse.ok || !submitData.id) throw new Error(submitData.message || "Failed to submit task")

            const jobId = submitData.id

            // 2. Poll for Progress & Completion
            const pollInterval = setInterval(async () => {
                const checkResponse = await fetch(`https://aihorde.net/api/v2/generate/check/${jobId}`)
                const checkData = await checkResponse.json()

                // Update Progress (AI Horde provides wait_time, we simulate structural progress)
                if (checkData.is_possible === false) {
                    clearInterval(pollInterval)
                    setIsProcessing(false)
                    setError("Request rejected by network. Try again later.")
                    return
                }

                // Calculate progress % based on queue status (Grok Style)
                let currentProgress = progress
                if (checkData.waiting > 0) currentProgress = Math.min(30, 30 - checkData.waiting)
                if (checkData.processing > 0) currentProgress = 30 + Math.min(60, checkData.processing * 10)
                if (checkData.done) currentProgress = 100

                // Fake creeping progress to keep UI alive
                setProgress(prev => Math.min(99, Math.max(prev + 2, currentProgress)))

                // Handle Completion
                if (checkData.done) {
                    clearInterval(pollInterval)
                    const resultResponse = await fetch(`https://aihorde.net/api/v2/generate/status/${jobId}`)
                    const resultData = await resultResponse.json()

                    if (resultData.generations && resultData.generations.length > 0) {
                        setProgress(100)
                        setTimeout(() => {
                            setResultImage(resultData.generations[0].img) // URL link to generated image
                            setIsProcessing(false)
                        }, 500)
                    } else {
                        throw new Error("No image generated")
                    }
                }
            }, 3000)

            // Timeout safety (2 minutes)
            setTimeout(() => {
                clearInterval(pollInterval)
                if (isProcessing) {
                    setIsProcessing(false)
                    setError("Generation timed out. The network might be too busy.")
                }
            }, 120000)

        } catch (err) {
            console.error(err)
            setError(err.message || "An error occurred during transformation.")
            setIsProcessing(false)
            setProgress(0)
        }
    }

    // Grok-style text progress bar generator
    const getProgressBar = (percent) => {
        const totalBars = 20;
        const filledBars = Math.floor((percent / 100) * totalBars);
        const emptyBars = totalBars - filledBars;
        return `[${'='.repeat(Math.max(0, filledBars - 1))}${filledBars > 0 && percent < 100 ? '>' : (percent === 100 ? '=' : '')}${' '.repeat(emptyBars)}]`;
    }

    return (
        <div className="min-h-screen bg-background py-12 font-sans relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent -z-10" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

                {/* Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6"
                    >
                        <Sparkles className="w-4 h-4" />
                        AI Garden Designer
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-heading font-black text-text tracking-tight mb-6"
                    >
                        Transform My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Garden</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-lg text-subtext max-w-2xl mx-auto leading-relaxed"
                    >
                        Upload a photo of your unmaintained space or empty balcony, and watch our AI instantly redesign it into a clean, lush, and professional mini-garden.
                    </motion.p>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Left/Top Column: Upload & Original */}
                    <div className="w-full lg:w-1/2 space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-6">
                            <h3 className="font-heading font-bold text-xl text-text mb-4 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-primary" />
                                Your Space
                            </h3>

                            {!previewUrl ? (
                                <div
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-primary/30 hover:border-primary/60 bg-primary/5 hover:bg-primary/10 rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 group"
                                >
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                    <div className="mx-auto w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform">
                                        <Upload className="w-8 h-8 text-primary" />
                                    </div>
                                    <p className="font-semibold text-text mb-2">Click or drag image here</p>
                                    <p className="text-sm text-subtext">JPG, PNG up to 10MB</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="relative rounded-2xl overflow-hidden aspect-video shadow-inner bg-gray-50 border border-gray-100 group">
                                        <img src={previewUrl} alt="Original Workspace" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button onClick={() => fileInputRef.current?.click()} className="bg-white text-text font-bold px-6 py-2 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors">
                                                Change Photo
                                            </button>
                                        </div>
                                    </div>

                                    {!isProcessing && !resultImage && (
                                        <button
                                            onClick={handleTransform}
                                            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-lg"
                                        >
                                            <Sparkles className="w-5 h-5" />
                                            Transform with AI
                                        </button>
                                    )}
                                </div>
                            )}

                            {error && (
                                <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <p>{error}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right/Bottom Column: Result & Processing */}
                    <div className="w-full lg:w-1/2">
                        {/* Empty State */}
                        {!isProcessing && !resultImage && (
                            <div className="h-full min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-12 text-subtext">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 opacity-50">
                                    <Leaf className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="font-heading font-medium text-xl text-gray-400 mb-2">Awaiting Transformation</h3>
                                <p className="text-sm max-w-xs">Upload your image and click transform to see the magic happen.</p>
                            </div>
                        )}

                        {/* Processing State with Grok UI */}
                        {isProcessing && (
                            <div className="w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-primary/20 overflow-hidden relative">
                                <ContainerFallingLeaves />

                                <div className="relative z-10 p-8 sm:p-12 flex flex-col items-center justify-center min-h-[400px]">
                                    {/* Grok Terminal Loader */}
                                    <div className="w-full max-w-sm bg-gray-900 rounded-xl p-6 shadow-2xl font-mono text-green-400 text-sm overflow-hidden border border-gray-700">
                                        <div className="flex items-center gap-2 mb-4 text-gray-400 border-b border-gray-700 pb-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            <span className="ml-2 text-xs">AI_Engine_v2.sh</span>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-gray-300">$ analyzing_space --target image</p>
                                            {progress > 10 && <p className="text-gray-300">$ identifying_optimal_plant_placements...</p>}
                                            {progress > 40 && <p className="text-gray-300">$ generating_lush_textures...</p>}
                                            {progress > 70 && <p className="text-gray-300">$ applying_natural_lighting...</p>}

                                            <div className="mt-6 pt-4 border-t border-gray-800">
                                                <p className="text-xs text-gray-500 mb-1">status: {progress < 100 ? 'rendering_in_cloud' : 'finalizing_output'}</p>
                                                <div className="flex items-center justify-between font-bold text-green-400 text-sm sm:text-base whitespace-pre">
                                                    <span>{getProgressBar(progress)}</span>
                                                    <span>{progress}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="mt-8 font-heading font-bold text-2xl text-text animate-pulse">Planting virtual seeds...</h3>
                                    <p className="text-subtext text-center max-w-xs mt-2">This usually takes about 15-30 seconds depending on network traffic.</p>
                                </div>
                            </div>
                        )}

                        {/* Result Output State */}
                        {resultImage && !isProcessing && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-green-100 overflow-hidden"
                            >
                                <div className="p-4 sm:p-6 bg-gradient-to-r from-primary/10 to-transparent border-b border-green-50 flex items-center justify-between">
                                    <h3 className="font-heading font-bold text-xl text-primary flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5" />
                                        Transformed Space
                                    </h3>
                                    <span className="text-xs font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full uppercase tracking-wider">AI Generated</span>
                                </div>

                                <div className="p-4 sm:p-6">
                                    <div className="rounded-2xl overflow-hidden aspect-video shadow-md relative group">
                                        <img src={resultImage} alt="Transformed Garden outcome" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                                    </div>

                                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                                        <a
                                            href={resultImage}
                                            download="o2need-transformation.jpg"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex-1 bg-green-50 hover:bg-green-100 text-primary font-bold py-3 px-4 rounded-xl text-center transition-colors shadow-sm"
                                        >
                                            Download Result
                                        </a>
                                        <button
                                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                            className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all"
                                        >
                                            Love it? Subscribe Now
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default TransformMyGarden
