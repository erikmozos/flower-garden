import * as React from "react"
import { Flower } from "@/lib/types"

interface FlowerRendererProps {
    flower: Flower
    className?: string
}

function getPetalPath(shape: string, length: number, width: number) {
    switch (shape) {
        case 'round':
            return `M 0,0 C ${width},${-length / 2} ${width},${-length} 0,${-length} C ${-width},${-length} ${-width},${-length / 2} 0,0`
        case 'pointed':
            return `M 0,0 L ${width / 2},${-length / 2} L 0,${-length} L ${-width / 2},${-length / 2} Z`
        case 'oval':
            return `M 0,0 C ${width * 1.5},${-length / 3} ${width / 2},${-length} 0,${-length} C ${-width / 2},${-length} ${-width * 1.5},${-length / 3} 0,0`
        case 'heart':
            return `M 0,0 C ${width},${-length / 2} ${width * 1.5},${-length} 0,${-length * 0.75} C ${-width * 1.5},${-length} ${-width},${-length / 2} 0,0`
        default:
            return `M 0,0 C ${width},${-length / 2} ${width},${-length} 0,${-length} C ${-width},${-length} ${-width},${-length / 2} 0,0`
    }
}

export function FlowerRenderer({ flower, className }: FlowerRendererProps) {
    if (flower.svg_data) {
        return (
            <div
                className={className}
                dangerouslySetInnerHTML={{ __html: flower.svg_data }}
            />
        )
    }

    const svgSize = 400
    const center = { x: svgSize / 2, y: svgSize / 2 }

    const petalLength = 80 * flower.size_scale
    const petalWidth = 30 * flower.size_scale
    const centerRadius = 25 * flower.size_scale

    const angleStep = 360 / flower.petal_count

    const petals = Array.from({ length: flower.petal_count }).map((_, i) => {
        const angle = i * angleStep + flower.rotation
        return (
            <g key={`petal-${i}`} transform={`rotate(${angle} ${center.x} ${center.y})`}>
                <path
                    d={getPetalPath(flower.petal_shape, petalLength, petalWidth)}
                    transform={`translate(${center.x}, ${center.y})`}
                    fill={flower.petal_color}
                    opacity={0.9}
                />
            </g>
        )
    })

    // Leaves
    const leaves = Array.from({ length: flower.leaf_count }).map((_, i) => {
        const yPos = center.y + 40 + (i * (flower.stem_height / (flower.leaf_count + 1)))
        const direction = i % 2 === 0 ? 1 : -1
        const rot = i % 2 === 0 ? 30 : -30
        return (
            <g key={`leaf-${i}`} transform={`translate(${center.x}, ${yPos}) rotate(${rot})`}>
                <path
                    d={`M 0,0 Q ${20 * direction},${-10} ${40 * direction},${-20} Q ${20 * direction},${10} 0,0`}
                    fill="#4ade80" // Simple green for leaves
                    opacity={0.8}
                />
            </g>
        )
    })

    return (
        <div
            className={`relative w-full aspect-square flex items-center justify-center overflow-hidden rounded-[2.5rem] ${className}`}
            style={{ backgroundColor: flower.background_tone || '#fdfbf7' }}
        >
            <svg
                viewBox={`0 0 ${svgSize} ${svgSize}`}
                className="w-full h-full max-w-sm max-h-sm origin-center animate-in fade-in zoom-in duration-1000 ease-out fill-mode-both"
            >
                {/* Stem */}
                <path
                    d={`M ${center.x},${center.y} Q ${center.x + 10},${center.y + flower.stem_height / 2} ${center.x},${center.y + flower.stem_height}`}
                    stroke="#4ade80"
                    strokeWidth={4 * flower.size_scale}
                    fill="none"
                />

                {/* Leaves */}
                {leaves}

                {/* Petals */}
                <g style={{ transformOrigin: `${center.x}px ${center.y}px`, transition: 'transform 10s linear', animation: 'spin 120s linear infinite' }}>
                    {petals}

                    {/* Inner details for petals (optional) */}
                    {flower.petal_count > 6 && Array.from({ length: flower.petal_count }).map((_, i) => {
                        const angle = i * angleStep + flower.rotation + (angleStep / 2)
                        return (
                            <g key={`petal-inner-${i}`} transform={`rotate(${angle} ${center.x} ${center.y})`}>
                                <path
                                    d={getPetalPath(flower.petal_shape, petalLength * 0.7, petalWidth * 0.6)}
                                    transform={`translate(${center.x}, ${center.y})`}
                                    fill={flower.petal_color}
                                    opacity={0.6}
                                    style={{ mixBlendMode: 'overlay' }}
                                />
                            </g>
                        )
                    })}
                </g>

                {/* Center */}
                <circle
                    cx={center.x}
                    cy={center.y}
                    r={centerRadius}
                    fill={flower.center_color}
                />

                {/* Center details */}
                <circle
                    cx={center.x}
                    cy={center.y}
                    r={centerRadius * 0.6}
                    fill="#000000"
                    opacity={0.2}
                />
            </svg>
            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    )
}
