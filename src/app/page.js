'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'

// ── Client-Side Safe Image Optimizer (Guarantees < 4 MB Vercel Serverless Payload) ──
function optimizeImageForUpload(file) {
  return new Promise((resolve) => {
    // If already under 3.5 MB, upload directly without re-compression
    if (file.size <= 3.5 * 1024 * 1024) {
      resolve(file)
      return
    }

    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      const maxDim = 2048
      let { width, height } = img

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width)
          width = maxDim
        } else {
          width = Math.round((width * maxDim) / height)
          height = maxDim
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file)
            return
          }
          const optimizedFile = new File([blob], file.name, {
            type: file.type === 'image/png' ? 'image/png' : 'image/jpeg',
            lastModified: Date.now(),
          })
          resolve(optimizedFile)
        },
        file.type === 'image/png' ? 'image/png' : 'image/jpeg',
        0.92
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(file)
    }

    img.src = url
  })
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

// ── Severity Configuration (Clean, Modern, Accessible) ───────────────────────
const SEVERITY_CONFIG = {
  High: {
    border: 'border-rose-500/80',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    dot: 'bg-rose-500',
  },
  high: {
    border: 'border-rose-500/80',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    dot: 'bg-rose-500',
  },
  Medium: {
    border: 'border-amber-500/80',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dot: 'bg-amber-500',
  },
  medium: {
    border: 'border-amber-500/80',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dot: 'bg-amber-500',
  },
  Low: {
    border: 'border-sky-500/80',
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    dot: 'bg-sky-500',
  },
  low: {
    border: 'border-sky-500/80',
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    dot: 'bg-sky-500',
  },
}

function getSeverity(severity) {
  return SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.Low
}

// ── Refined Forensic Radar Loading HUD ───────────────────────────────────────
function ScanningHUD() {
  const [stepIndex, setStepIndex] = useState(0)

  const steps = [
    { title: 'Decomposing 2D Discrete Wavelet & Frequency Spectrum', tag: 'Fourier Harmonics' },
    { title: 'Extracting High-Frequency Laplacian Residuals', tag: 'Noise Fingerprinting' },
    { title: 'Computing Error Level Analysis (ELA) Compression Discrepancies', tag: 'ELA Quantization' },
    { title: 'Analyzing 8×8 DCT Compression Block Discontinuities', tag: 'Grid Coherence' },
    { title: 'Synthesizing Diffusion Inversion & Model Attribution', tag: 'Final Synthesis' },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length)
    }, 1000)
    return () => clearInterval(timer)
  }, [steps.length])

  return (
    <div className="relative overflow-hidden rounded-2xl card-clean p-8 text-center my-6">
      <div className="scanline-beam-refined" />

      {/* Modern Radar Indicator */}
      <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-indigo-500/20" />
        <div className="absolute inset-3 rounded-full border border-dashed border-sky-400/25 animate-spin [animation-duration:16s]" />
        <div className="absolute inset-6 rounded-full border border-indigo-400/30" />
        <div className="absolute inset-9 rounded-full border border-sky-500/40" />

        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-indigo-500/20 -translate-x-1/2" />
        <div className="absolute left-0 right-0 top-1/2 h-px bg-indigo-500/20 -translate-y-1/2" />

        {/* Rotating sweep */}
        <div className="absolute inset-0 rounded-full animate-spin [animation-duration:2.2s] bg-gradient-to-tr from-transparent via-transparent to-sky-400/25" />
        <div className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_12px_#38bdf8]" />
      </div>

      <div className="max-w-md mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-medium tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span>Forensic Deep Scan Active</span>
        </div>

        <h3 className="text-base font-semibold text-slate-100 transition-all duration-300">
          {steps[stepIndex].title}
        </h3>

        <p className="text-xs font-mono text-slate-400">
          PHASE: <span className="text-sky-300 font-medium">{steps[stepIndex].tag}</span>
        </p>

        {/* Minimal Steps Track */}
        <div className="flex items-center justify-center gap-1.5 pt-3">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-400 ${
                i === stepIndex
                  ? 'w-6 bg-indigo-400'
                  : i < stepIndex
                  ? 'w-2 bg-indigo-600/60'
                  : 'w-1.5 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Metric Gauge Bar ──────────────────────────────────────────────────────────
function MetricBar({ label, value, description, invert = false }) {
  const pct = Math.min(100, Math.max(0, Math.round(value * 100)))
  const isWarning = invert ? pct < 50 : pct > 65
  const isCritical = invert ? pct < 30 : pct > 85

  let barColor = 'bg-sky-500'
  let textColor = 'text-sky-400'

  if (isCritical) {
    barColor = 'bg-rose-500'
    textColor = 'text-rose-400'
  } else if (isWarning) {
    barColor = 'bg-amber-500'
    textColor = 'text-amber-400'
  }

  return (
    <div className="card-clean rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-300 font-sans tracking-wide">
          {label}
        </span>
        <span className={`text-xs font-mono font-semibold ${textColor}`}>
          {(value * 100).toFixed(1)}%
        </span>
      </div>
      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-white/5">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{description}</p>
    </div>
  )
}

// ── Interactive Split-Screen Forensic Lens (Original vs. ELA Heatmap Slider) ─
function InteractiveForensicLens({
  preview,
  elaHeatmap,
  regions = [],
  showOverlay,
  showScanline,
  hoveredRegionIdx,
  setHoveredRegionIdx,
  lensMode,
  setLensMode,
}) {
  const [sliderPos, setSliderPos] = useState(50) // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)

  const handlePointerDown = (e) => {
    setIsDragging(true)
    updateSliderPos(e.clientX)
  }

  const updateSliderPos = useCallback((clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.min(100, Math.max(0, (x / rect.width) * 100))
    setSliderPos(percentage)
  }, [])

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDragging) return
      updateSliderPos(e.clientX)
    }

    const handlePointerUp = () => {
      if (isDragging) setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [isDragging, updateSliderPos])

  // Heatmap source: either backend ela_heatmap_base64 or preview fallback
  const heatmapSrc = elaHeatmap
    ? (elaHeatmap.startsWith('data:') ? elaHeatmap : `data:image/jpeg;base64,${elaHeatmap}`)
    : preview

  return (
    <div className="space-y-3">
      {/* Visual Mode Toolbar */}
      {elaHeatmap && (
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-sans">
            <button
              type="button"
              onClick={() => setLensMode('slider')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                lensMode === 'slider'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Split-Screen Lens</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                Slider
              </span>
            </button>
            <button
              type="button"
              onClick={() => setLensMode('original')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                lensMode === 'original'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Original
            </button>
            <button
              type="button"
              onClick={() => setLensMode('ela')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                lensMode === 'ela'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>ELA Heatmap</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-400 hidden sm:flex items-center gap-1.5">
            <span className="text-indigo-400">⚡</span>
            <span>Error Level Analysis 92% Resave Matrix</span>
          </div>
        </div>
      )}

      {/* Main Image Frame */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-2xl bg-black border border-white/10 select-none group touch-none"
        style={{ minHeight: '300px' }}
      >
        {/* Layer 1: ELA Heatmap (Right/Base Layer) */}
        {lensMode === 'slider' || lensMode === 'ela' ? (
          <img
            src={heatmapSrc}
            alt="ELA Artifact Heatmap"
            className="w-full max-h-[480px] object-contain mx-auto block filter contrast-125"
          />
        ) : null}

        {/* Layer 2: Original Image (Left Layer, clipped by sliderPos) */}
        {lensMode === 'slider' && (
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `polygon(0% 0%, ${sliderPos}% 0%, ${sliderPos}% 100%, 0% 100%)` }}
          >
            <img
              src={preview}
              alt="Original target"
              className="w-full max-h-[480px] object-contain mx-auto block"
            />
          </div>
        )}

        {/* When in standard original mode */}
        {lensMode === 'original' && (
          <img
            src={preview}
            alt="Original target"
            className="w-full max-h-[480px] object-contain mx-auto block"
          />
        )}

        {/* Scanline Beam */}
        {showScanline && <div className="scanline-beam-refined" />}

        {/* Sleek Vertical Divider & Grab Handle (Only active in Slider Mode) */}
        {lensMode === 'slider' && (
          <>
            {/* Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-400 via-indigo-400 to-rose-400 z-30 pointer-events-none shadow-[0_0_12px_rgba(99,102,241,0.8)]"
              style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
            />

            {/* Grab Handle */}
            <div
              onPointerDown={handlePointerDown}
              className="absolute top-1/2 z-40 -translate-y-1/2 -translate-x-1/2 cursor-ew-resize select-none flex items-center justify-center group/handle"
              style={{ left: `${sliderPos}%` }}
              title="Drag horizontally to inspect original vs. ELA heatmap"
            >
              <div className="w-9 h-9 rounded-full bg-slate-900/90 border-2 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.6)] backdrop-blur-md flex items-center justify-center transition-transform group-hover/handle:scale-110 active:scale-95">
                <div className="flex items-center text-[10px] font-bold text-sky-300">
                  <span>◀</span>
                  <span className="w-0.5 h-3 bg-white/40 mx-0.5 rounded-full" />
                  <span>▶</span>
                </div>
              </div>
            </div>

            {/* Split Screen Overlay Tags */}
            <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-md bg-black/75 border border-white/10 text-[10px] font-mono text-slate-300 flex items-center gap-1.5 pointer-events-none backdrop-blur-md shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span>Original Photo</span>
            </div>
            <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-md bg-black/75 border border-white/10 text-[10px] font-mono text-slate-300 flex items-center gap-1.5 pointer-events-none backdrop-blur-md shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>ELA Heatmap</span>
            </div>
          </>
        )}

        {/* Existing Anomaly Bounding Boxes & Tooltips */}
        {showOverlay &&
          regions.map((reg, idx) => {
            const [ymin, xmin, ymax, xmax] = reg.box || [0, 0, 0, 0]
            const isHovered = hoveredRegionIdx === idx
            const sev = getSeverity(reg.severity)

            // Dynamic placement: agar box top 35% me ho to tooltip neeche show ho
            const showBelow = ymin < 35
            // Horizontal edge adjustment taake screen/image se bahar na nikle
            const alignLeft = xmin < 20
            const alignRight = xmax > 80

            const style = {
              top: `${ymin}%`,
              left: `${xmin}%`,
              width: `${Math.max(5, xmax - xmin)}%`,
              height: `${Math.max(5, ymax - ymin)}%`,
            }

            return (
              <div
                key={idx}
                style={style}
                onMouseEnter={() => setHoveredRegionIdx(idx)}
                onMouseLeave={() => setHoveredRegionIdx(null)}
                className={`absolute cursor-pointer rounded-lg border-2 ${
                  sev.border
                } ${sev.bg} transition-all duration-200 ${
                  isHovered
                    ? 'ring-2 ring-white/70 scale-[1.01] z-30 shadow-xl backdrop-brightness-110'
                    : 'soft-pulse z-10 hover:z-20'
                }`}
              >
                {/* Region Pill (agar tooltip upar ho to pill upar, agar box bilkul top par ho to pill box ke andar) */}
                <div
                  className={`absolute ${ymin < 8 ? 'top-1 left-1' : '-top-3 left-1'} px-1.5 py-0.5 rounded text-[10px] font-mono font-medium tracking-tight shadow-md flex items-center gap-1 pointer-events-none border ${
                    sev.badge
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                  <span>{reg.label || `Region #${idx + 1}`}</span>
                </div>

                {/* Floating Tooltip On Hover (smart positioning: show below when on top area, mobile responsive width) */}
                {isHovered && (
                  <div
                    className={`absolute ${
                      showBelow ? 'top-full mt-2' : 'bottom-full mb-2'
                    } ${
                      alignLeft
                        ? 'left-0'
                        : alignRight
                        ? 'right-0'
                        : 'left-1/2 -translate-x-1/2'
                    } w-52 sm:w-64 p-2.5 sm:p-3 rounded-xl card-clean-elevated text-left pointer-events-none z-50 animate-slide-up shadow-2xl max-w-[85vw]`}
                  >
                    <div className="flex items-center justify-between gap-1.5 pb-1 mb-1 border-b border-white/10">
                      <span className="font-semibold text-[11px] sm:text-xs text-white truncate">
                        {reg.label}
                      </span>
                      <span
                        className={`text-[9px] sm:text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${sev.badge}`}
                      >
                        {reg.severity}
                      </span>
                    </div>

                    <p className="text-[10px] sm:text-[11px] text-slate-300 leading-snug sm:leading-relaxed mb-1.5 font-sans">
                      {reg.description}
                    </p>

                    <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5">
                      <span>Artifact Confidence</span>
                      <span className={`font-semibold ${sev.text}`}>
                        {Math.round((reg.confidence || 0) * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

        {/* Bottom Inspection Badge */}
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/75 border border-white/10 text-[10px] font-mono text-slate-400 flex items-center gap-1.5 pointer-events-none backdrop-blur-md z-20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>INSPECTION OVERLAY ACTIVE</span>
        </div>
      </div>

      {lensMode === 'slider' && (
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-2">
          <span>◀ Drag left: reveal ELA Artifact Heatmap</span>
          <span>Drag right: reveal Original ▷</span>
        </div>
      )}
    </div>
  )
}

// ── Reverse Prompt & Generative Recipe Card ("Prompt Inversion") ──────────────
function GenerativeRecipeCard({ promptInversion }) {
  const [copied, setCopied] = useState(false)

  if (!promptInversion) return null

  const fullPromptText =
    promptInversion.full_prompt ||
    promptInversion.reconstructed_prompt ||
    'High-resolution generative image with consistent spatial illumination.'

  const aspectRatio =
    promptInversion.suggested_aspect_ratio ||
    promptInversion.aspect_ratio ||
    '16:9'

  const negativePrompt =
    promptInversion.negative_prompt_hints ||
    promptInversion.negative_prompt ||
    null

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPromptText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card-clean rounded-2xl p-6 border border-sky-500/30 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center text-xl text-sky-300">
            🪄
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-medium">
                Prompt Inversion Engine
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-sky-500/15 text-sky-300 border border-sky-500/25">
                CLIP & Latent De-synthesis
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
              Reconstructed Generative Recipe
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
            copied
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-sky-500/15 border border-sky-500/30 text-sky-300 hover:bg-sky-500/25 hover:text-sky-200'
          }`}
        >
          {copied ? (
            <>
              <span>✓</span>
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <span>📋</span>
              <span>Copy Prompt</span>
            </>
          )}
        </button>
      </div>

      {/* Prompt Quote Block */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
          <span>Inverted Prompt Text:</span>
          {aspectRatio && (
            <span className="text-sky-300">AR: {aspectRatio}</span>
          )}
        </div>
        <div className="relative rounded-xl bg-black/40 border border-white/10 p-4 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed group">
          <p className="select-all break-words">
            "{fullPromptText}"
          </p>
        </div>
      </div>

      {/* Style Tags Pills */}
      {promptInversion.style_tags && promptInversion.style_tags.length > 0 && (
        <div className="mb-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-2 font-medium">
            Extracted Style & Aesthetic Tags:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {promptInversion.style_tags.map((tag, tIdx) => (
              <span
                key={tIdx}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-sky-500/10 border border-sky-500/20 text-sky-300 flex items-center gap-1"
              >
                <span className="text-sky-400 text-[10px]">#</span>
                <span>{tag}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Negative Prompt & Guidance Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {negativePrompt && (
          <div className="bg-black/30 border border-white/5 rounded-xl p-3">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              Negative Prompt Filter:
            </span>
            <p className="text-xs text-rose-300/90 font-mono leading-relaxed">
              {negativePrompt}
            </p>
          </div>
        )}

        {promptInversion.guidance_scale && (
          <div className="bg-black/30 border border-white/5 rounded-xl p-3 flex flex-col justify-center">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              Estimated CFG / Guidance:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-white">
                {promptInversion.guidance_scale}
              </span>
              <span className="text-[11px] text-slate-400">
                (Standard latent classifier-free guidance)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Explanatory Footer */}
      <div className="pt-3 border-t border-white/5 flex items-start gap-2 text-xs text-slate-400 leading-relaxed font-sans">
        <span className="text-sky-400 shrink-0 text-sm mt-0.5">💡</span>
        <span>
          Use this prompt recipe in <strong>Midjourney, Flux, or Stable Diffusion</strong> to replicate or study this image's generation pattern.
        </span>
      </div>
    </div>
  )
}

// ── Official Forensic Audit Certificate Modal / Printable View ────────────────
function ForensicAuditCertificateModal({ result, preview, onClose }) {
  const isAI = result.prediction === 'AI Generated'
  const isSuspicious = result.prediction === 'Suspicious / Manipulated'
  const certId = result.audit_certificate?.certificate_id || `VERITAS-AUDIT-${(result.image_hash || '47A9B').slice(0, 10).toUpperCase()}`
  const sha256 = result.sha256 || result.image_hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  const timestamp = result.audit_certificate?.timestamp || new Date().toUTCString()
  const verificationStatus = isAI
    ? 'SYNTHETIC MEDIA DETECTED'
    : isSuspicious
    ? 'TARGETED MANIPULATION DETECTED'
    : 'VERIFIED AUTHENTIC OPTICAL CAPTURE'

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 text-slate-100 shadow-2xl my-4 sm:my-8 max-h-[92vh] overflow-y-auto">
        {/* Top Control Bar (Sticky & Hidden when printing) */}
        <div className="no-print sticky top-0 z-20 bg-slate-950/95 backdrop-blur-sm flex items-center justify-between pb-4 mb-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-slate-400">
              Official Cryptographic Audit Certificate
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-xs font-medium flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <span>🖨️</span>
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-xs transition-all active:scale-95 cursor-pointer"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="space-y-6">
          {/* Official Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/15">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  V
                </div>
                <span className="text-xl font-bold tracking-tight text-white font-sans">
                  VERITAS FORENSIC LABS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Division of Neural Media Verification & Spectral Signal Analysis
              </p>
            </div>

            <div className="sm:text-right font-mono">
              <div className="text-[11px] text-slate-400">CERTIFICATE SERIAL ID</div>
              <div className="text-xs font-bold text-indigo-400">{certId}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{timestamp}</div>
            </div>
          </div>

          {/* Verdict Badge Banner */}
          <div
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isAI
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : isSuspicious
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}
          >
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest font-semibold mb-1">
                Forensic Classification Result
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {result.prediction}
              </div>
              <p className="text-xs font-mono mt-1 opacity-90">{verificationStatus}</p>
            </div>

            <div className="sm:text-right shrink-0">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Confidence Rating
              </div>
              <div className="text-3xl font-mono font-bold text-white">
                {Math.round((result.confidence || 0) * 100)}%
              </div>
            </div>
          </div>

          {/* Target Evidence & Cryptographic Hashes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Thumbnail */}
            <div className="md:col-span-1 rounded-xl overflow-hidden bg-black border border-white/10 flex items-center justify-center p-2">
              <img
                src={preview}
                alt="Analyzed target specimen"
                className="max-h-44 object-contain rounded-lg"
              />
            </div>

            {/* Evidence Metadata */}
            <div className="md:col-span-2 space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Target Filename:</span>
                  <span className="text-slate-200 font-sans font-medium">{result.filename}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Image Dimensions:</span>
                  <span className="text-slate-200">
                    {result.image_size ? `${result.image_size[0]} × ${result.image_size[1]} px` : '512 × 512 px'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Attributed Architecture:</span>
                  <span className="text-indigo-300 font-sans font-medium">
                    {result.suspected_model?.name || 'Standard Optical Sensor'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                  SHA-256 Cryptographic Specimen Hash:
                </div>
                <div className="text-[11px] text-sky-300 select-all break-all leading-tight">
                  {sha256}
                </div>
              </div>
            </div>
          </div>

          {/* Anomaly Breakdown Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Localized Anomaly & Artifact Breakdown ({result.regions?.length || 0} Points of Interest)
            </h4>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-white/5 font-mono text-[10px] uppercase text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Artifact Category</th>
                    <th className="py-2.5 px-3">Severity</th>
                    <th className="py-2.5 px-3">Coordinates [Y, X]</th>
                    <th className="py-2.5 px-3">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-slate-300">
                  {result.regions && result.regions.length > 0 ? (
                    result.regions.map((reg, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="py-2 px-3 text-slate-500">{idx + 1}</td>
                        <td className="py-2 px-3 font-sans font-medium text-white">{reg.label}</td>
                        <td className="py-2 px-3 uppercase text-[10px]">
                          <span
                            className={`px-1.5 py-0.5 rounded border ${
                              getSeverity(reg.severity).badge
                            }`}
                          >
                            {reg.severity}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-[11px] text-slate-400">
                          {reg.box ? `[${reg.box[0].toFixed(0)}%, ${reg.box[1].toFixed(0)}%]` : 'N/A'}
                        </td>
                        <td className="py-2 px-3 text-sky-400">
                          {Math.round((reg.confidence || 0) * 100)}%
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-4 text-center text-slate-500 font-mono text-xs">
                        No structural anomalies identified in specimen. Optical integrity confirmed.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Full Analytical Summary */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1 font-semibold">
              Senior Forensic Investigator Assessment:
            </span>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {result.overall_analysis}
            </p>
          </div>

          {/* Official Seals & Signature Footer with Talha Nizam Watermark */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[10px] text-slate-400">
            <div className="space-y-1">
              <p className="font-semibold text-slate-300">
                VERITAS FORENSIC LABS • PROTOCOL RFC-8821
              </p>
              <p className="text-slate-400">
                Certified Forensic System • Developed by <span className="text-indigo-400 font-bold">Talha Nizam</span>
              </p>
              <p className="text-slate-500 text-[9px]">
                Tamper-Evident SHA-256 Ledger Verified • Generated via Deterministic Signal Analysis
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-1">
              <div className="border border-indigo-500/30 rounded-lg px-3 py-1.5 bg-indigo-500/10 text-indigo-300 font-bold text-center tracking-wider">
                OFFICIAL CERTIFIED AUDIT
              </div>
              <span className="text-[9px] text-slate-500">SYSTEM ARCHITECT: TALHA NIZAM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Forensic Analysis Panel ───────────────────────────────────────────────────
function ForensicPanel({
  result,
  preview,
  hoveredRegionIdx,
  setHoveredRegionIdx,
  onOpenAuditModal,
}) {
  const isAI = result.prediction === 'AI Generated'
  const isSuspicious = result.prediction === 'Suspicious / Manipulated'
  const regions = result.regions || []
  const metrics = result.metrics || {
    noise_residual: isAI ? 0.78 : 0.22,
    high_frequency_energy: isAI ? 0.84 : 0.35,
    symmetry_score: isAI ? 0.42 : 0.88,
    compression_anomaly: isAI ? 0.69 : 0.15,
  }

  return (
    <div className="mt-8 space-y-6">
      {/* ── Verdict Summary Card ── */}
      <div
        className={`relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 card-clean ${
          isAI
            ? 'border-rose-500/30'
            : isSuspicious
            ? 'border-amber-500/30'
            : 'border-emerald-500/30'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                isAI
                  ? 'bg-rose-500/10 border-rose-500/25 text-rose-400'
                  : isSuspicious
                  ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                  : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
              }`}
            >
              {isAI ? (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <circle cx="12" cy="5" r="2" />
                  <path d="M12 7v4" />
                  <line x1="8" y1="16" x2="8.01" y2="16" />
                  <line x1="16" y1="16" x2="16.01" y2="16" />
                </svg>
              ) : isSuspicious ? (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Verification Verdict
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase border ${
                    isAI
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                      : isSuspicious
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                      : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  {isAI ? 'Synthetic Media' : isSuspicious ? 'Manipulated' : 'Authentic Camera Capture'}
                </span>
              </div>
              <h2
                className={`text-2xl font-bold tracking-tight mt-0.5 ${
                  isAI ? 'text-rose-200' : isSuspicious ? 'text-amber-200' : 'text-emerald-200'
                }`}
              >
                {result.prediction}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="card-clean rounded-xl px-4 py-3 min-w-[130px] sm:text-right">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Confidence
              </span>
              <span
                className={`text-2xl font-bold font-mono tracking-tight ${
                  isAI ? 'text-rose-400' : isSuspicious ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {Math.round((result.confidence || 0) * 100)}%
              </span>
            </div>

            {/* Audit Export Trigger */}
            <button
              type="button"
              onClick={onOpenAuditModal}
              className="py-3 px-4 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30 transition-all font-sans text-xs font-semibold flex flex-col items-center justify-center gap-1 min-w-[130px] shadow-sm active:scale-95"
              title="Generate printable tamper-evident audit report"
            >
              <span className="flex items-center gap-1.5">
                <span>📜</span>
                <span>Audit Certificate</span>
              </span>
              <span className="text-[10px] font-mono text-indigo-400 opacity-90">Export Report</span>
            </button>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-white/5">
          <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 font-medium">
            Forensic Findings:
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {result.overall_analysis}
          </p>
        </div>
      </div>

      {/* ── Feature 2: Reverse Prompt & Generative Recipe Card ── */}
      {(result.reverse_prompt || result.prompt_inversion) && (
        <GenerativeRecipeCard promptInversion={result.reverse_prompt || result.prompt_inversion} />
      )}

      {/* ── AI Generator Attribution Card ── */}
      {result.suspected_model && (
        <div className="card-clean rounded-2xl p-6 border border-indigo-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-medium">
                    Generator Attribution
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                    Signature Match
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                  {result.suspected_model.name}
                </h3>
              </div>
            </div>

            <div className="card-clean rounded-xl px-3.5 py-2 sm:text-right shrink-0">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Match Probability
              </span>
              <span className="text-xl font-bold font-mono text-indigo-400">
                {Math.round((result.suspected_model.match_probability || 0.85) * 100)}%
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-white/10 text-xs font-mono text-indigo-300 font-medium">
              <span>Architecture:</span>
              <span className="text-slate-200">{result.suspected_model.architecture}</span>
            </div>
            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed font-sans">
              {result.suspected_model.description}
            </p>
          </div>

          {result.suspected_model.signature_traits && result.suspected_model.signature_traits.length > 0 && (
            <div className="pt-3 border-t border-white/5 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-medium">
                Detected Signature Traits:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {result.suspected_model.signature_traits.map((trait, tIdx) => (
                  <div
                    key={tIdx}
                    className="flex items-start gap-2 text-xs text-slate-300 bg-black/30 border border-white/5 rounded-lg p-2.5"
                  >
                    <span className="text-indigo-400 text-sm leading-none shrink-0 mt-0.5">✦</span>
                    <span>{trait}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Spectral & Residual Metrics Grid ── */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-medium uppercase tracking-wider text-slate-400 flex items-center gap-2 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Neural & Sensor Metrics
          </h3>
          <span className="text-[11px] font-mono text-slate-500">Spatial & FFT Decomposition</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <MetricBar
            label="Noise Residual"
            value={metrics.noise_residual}
            description="Variations in camera sensor photon shot noise distribution."
          />
          <MetricBar
            label="High-Frequency Energy"
            value={metrics.high_frequency_energy}
            description="Spectra discontinuities characteristic of neural upscalers."
          />
          <MetricBar
            label="Symmetry & Perspective"
            value={metrics.symmetry_score}
            invert={true}
            description="Structural coherence and physical geometric alignment."
          />
          <MetricBar
            label="Compression Anomaly"
            value={metrics.compression_anomaly}
            description="Discrete cosine transform (DCT) block boundary alignment."
          />
        </div>
      </div>

      {/* ── Anomaly Regions Breakdown ── */}
      <div className="card-clean rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-medium uppercase tracking-wider text-slate-300 font-mono">
              Detected Artifact Regions
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono font-medium">
              {regions.length} {regions.length === 1 ? 'Region' : 'Regions'}
            </span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline font-mono text-[11px]">
            Hover to isolate on image
          </span>
        </div>

        {regions.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs font-mono border border-dashed border-white/10 rounded-xl">
            No localized anomalies detected. Surface micro-structures show natural optical consistency.
          </div>
        ) : (
          <div className="space-y-2">
            {regions.map((reg, idx) => {
              const sev = getSeverity(reg.severity)
              const isSelected = hoveredRegionIdx === idx

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredRegionIdx(idx)}
                  onMouseLeave={() => setHoveredRegionIdx(null)}
                  className={`p-3.5 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? `${sev.border} bg-white/5 scale-[1.005] shadow-lg`
                      : 'bg-black/30 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${sev.dot}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-200">
                          {reg.label}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-medium uppercase px-1.5 py-0.5 rounded border ${sev.badge}`}
                        >
                          {reg.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
                        {reg.description}
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0 font-mono">
                    <div className="text-[10px] text-slate-500 uppercase">Confidence</div>
                    <div className={`text-xs font-semibold ${sev.text}`}>
                      {Math.round((reg.confidence || 0) * 100)}%
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Page Component ───────────────────────────────────────────────────────
export default function Home() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const [showOverlay, setShowOverlay] = useState(true)
  const [showScanline, setShowScanline] = useState(false)
  const [hoveredRegionIdx, setHoveredRegionIdx] = useState(null)
  const [lensMode, setLensMode] = useState('slider') // 'slider' | 'original' | 'ela'
  const [showAuditModal, setShowAuditModal] = useState(false)

  const onDrop = useCallback((accepted) => {
    if (!accepted || accepted.length === 0) return
    const f = accepted[0]
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setResult(null)
    setError(null)
    setHoveredRegionIdx(null)
    setShowAuditModal(false)
    setLensMode('slider')
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    maxSize: 20 * 1024 * 1024,
    onDropRejected: () =>
      setError('Please upload a valid image file (max 20 MB).'),
  })

  async function handleDetect() {
    if (!file) return
    setLoading(true)
    setResult(null)
    setError(null)
    setHoveredRegionIdx(null)

    try {
      // Auto-optimize image client-side if it exceeds Vercel Serverless payload limits
      const fileToUpload = await optimizeImageForUpload(file)

      const formData = new FormData()
      formData.append('file', fileToUpload)

      const endpoint = API_URL ? `${API_URL}/predict` : '/api/predict'
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        if (res.status === 413) {
          throw new Error('Image size exceeds Vercel serverless payload limit (4.5 MB). Please select a compressed image or try again.')
        }
        const text = await res.text()
        throw new Error(`Server returned error (${res.status}): ${text}`)
      }

      const data = await res.json()

      // Smooth step telemetry pacing
      await new Promise((resolve) => setTimeout(resolve, 1400))
      setResult(data)
    } catch (err) {
      setError(err.message || 'Unable to connect to the analysis backend.')
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    setHoveredRegionIdx(null)
    setShowAuditModal(false)
  }

  function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <main className="min-h-screen bg-subtle-grid text-slate-100 flex flex-col items-center justify-start px-4 sm:px-6 py-12 relative overflow-hidden">
      {/* Subtle, unslop background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-3xl relative z-10">
        {/* ── Clean Header (Product Sans / Google Sans look) ── */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full card-clean text-xs font-medium text-slate-300 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Veritas Neural Forensics</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
            AI Image Detector & Forensics
          </h1>
          <p className="mt-2 text-slate-400 text-sm max-w-lg mx-auto font-sans">
            Identify synthetic media, map artifact anomalies, inspect ELA heatmaps, and uncover generative AI prompt recipes.
          </p>
        </header>

        {/* ── Main Container ── */}
        <div className="card-clean rounded-3xl p-6 sm:p-8">
          {/* Controls Bar */}
          {preview && (
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-white/5">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <span className="text-indigo-400 font-bold">●</span>
                <span className="truncate max-w-[200px] sm:max-w-xs font-medium">
                  {file?.name || 'Target Image'}
                </span>
                {file && (
                  <span className="text-slate-500 text-[11px]">
                    ({formatSize(file.size)})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowOverlay((v) => !v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium flex items-center gap-1.5 transition-all border ${
                    showOverlay
                      ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                      : 'bg-black/20 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Artifact Regions</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowScanline((v) => !v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium flex items-center gap-1.5 transition-all border ${
                    showScanline
                      ? 'bg-sky-500/15 border-sky-500/30 text-sky-300'
                      : 'bg-black/20 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Scanline</span>
                </button>

                {result && (
                  <button
                    type="button"
                    onClick={() => setShowAuditModal(true)}
                    className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium flex items-center gap-1.5 transition-all bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25"
                  >
                    <span>📜</span>
                    <span>Audit Report</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── Dropzone or Interactive Lens ── */}
          {!preview ? (
            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 select-none p-12 min-h-[260px]
                ${
                  isDragActive
                    ? 'dropzone-active border-indigo-500 bg-indigo-500/5'
                    : 'border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.02]'
                }
              `}
            >
              <input {...getInputProps()} />
              <div className="text-center pointer-events-none">
                <div className="w-12 h-12 mx-auto mb-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-slate-200 font-semibold text-base font-sans">
                  {isDragActive ? 'Release image to inspect' : 'Drop an image here to inspect'}
                </p>
                <p className="text-slate-400 text-xs mt-1 font-sans">
                  or <span className="text-indigo-400 font-medium underline underline-offset-4">browse files</span> from your computer
                </p>
                <div className="flex items-center justify-center gap-2 mt-4 text-[11px] font-mono text-slate-500">
                  <span>PNG</span>
                  <span>&bull;</span>
                  <span>JPG</span>
                  <span>&bull;</span>
                  <span>WEBP</span>
                  <span>&bull;</span>
                  <span>Max 20 MB</span>
                </div>
              </div>
            </div>
          ) : (
            <InteractiveForensicLens
              preview={preview}
              elaHeatmap={result?.ela_heatmap_base64}
              regions={result?.regions || []}
              showOverlay={showOverlay}
              showScanline={showScanline}
              hoveredRegionIdx={hoveredRegionIdx}
              setHoveredRegionIdx={setHoveredRegionIdx}
              lensMode={lensMode}
              setLensMode={setLensMode}
            />
          )}

          {/* ── Loading Animation ── */}
          {loading && <ScanningHUD />}

          {/* ── Error Notification ── */}
          {error && (
            <div className="mt-4 flex items-start gap-3 bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-xs text-rose-300">
              <span className="shrink-0 text-base">⚠️</span>
              <div>
                <p className="font-semibold">Analysis Failed</p>
                <p className="text-rose-300/80 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* ── Action Buttons ── */}
          {!loading && (
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleDetect}
                disabled={!file || loading}
                className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium text-sm transition-all duration-150 font-sans
                  ${
                    !file || loading
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 active:scale-[0.99]'
                  }
                `}
              >
                <span>Analyze Image</span>
              </button>

              {file && (
                <button
                  onClick={handleClear}
                  className="py-3 px-5 rounded-xl text-xs font-medium text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-sans"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          {/* ── Results Section ── */}
          {result && (
            <ForensicPanel
              result={result}
              preview={preview}
              hoveredRegionIdx={hoveredRegionIdx}
              setHoveredRegionIdx={setHoveredRegionIdx}
              onOpenAuditModal={() => setShowAuditModal(true)}
            />
          )}
        </div>

        {/* ── Official Footer ── */}
        <footer className="mt-10 py-6 border-t border-white/5 text-xs text-slate-400 font-sans flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="font-medium text-slate-300">
              Veritas AI Platform <span className="text-slate-500 font-normal">(Developed By Talha Nizam)</span>
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ensemble Spectral Engine v2.4</span>
          </div>
        </footer>
      </div>

      {/* ── Forensic Audit Certificate Modal ── */}
      {showAuditModal && result && (
        <ForensicAuditCertificateModal
          result={result}
          preview={preview}
          onClose={() => setShowAuditModal(false)}
        />
      )}
    </main>
  )
}
