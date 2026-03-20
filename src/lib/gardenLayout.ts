import type { CSSProperties } from "react"

/** Secuencia de Halton (baja discrepancia): puntos bien repartidos sin cuadrícula visible */
function halton(index: number, base: number): number {
    let result = 0
    let f = 1 / base
    let i = index + 1
    while (i > 0) {
        result += f * (i % base)
        i = Math.floor(i / base)
        f /= base
    }
    return result
}

/** Pseudoaleatorio determinista por índice (estable entre renders) */
function seeded01(n: number): number {
    const x = Math.sin(n * 12.9898 + n * 78.233 + 31.415) * 43758.5453
    return x - Math.floor(x)
}

function clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n))
}

function meadowScatter(
    index: number,
    total: number,
    salt: number,
    options: { stress: boolean }
): CSSProperties {
    const { stress } = options
    // Desfase distinto por “tanda” para que no se repita el mismo patrón
    const h = index + salt * 17 + (total % 7) * 3

    // Halton en bases coprimos → no alineación en filas/columnas
    const hx = halton(h, 2)
    const hy = halton(h, 3)

    // Jitter extra para romper simetría y sensación de rejilla
    const jx = (seeded01(h * 9973) - 0.5) * (stress ? 10 : 8)
    const jy = (seeded01(h * 7919) - 0.5) * (stress ? 9 : 7)

    let leftPct = 5 + hx * 86 + jx
    let bottomPct = 7 + hy * 78 + jy

    // Ligeras ondas: menos “bloque” rectangular
    const wobble =
        Math.sin(index * 0.73 + salt) * (stress ? 1.8 : 2.2) +
        Math.cos(index * 0.41) * (stress ? 1.2 : 1.5)
    leftPct += wobble * 0.35
    bottomPct += Math.sin(index * 0.51 + total) * (stress ? 1.5 : 2)

    leftPct = clamp(leftPct, 3, 94)
    bottomPct = clamp(bottomPct, 6, 90)

    // Escala: en demo muchas flores → algo más pequeñas y variadas (menos “petado” visual)
    const scaleMin = stress ? 0.62 : 0.82
    const scaleMax = stress ? 0.94 : 1.08
    const s = scaleMin + seeded01(h * 4567) * (scaleMax - scaleMin)

    const z = Math.floor(25 + bottomPct * 0.35 + seeded01(h * 888) * 8)

    return {
        left: `${leftPct}%`,
        bottom: `${bottomPct}%`,
        transform: `translateX(-50%) scale(${s})`,
        zIndex: z,
    }
}

/**
 * Pocas flores: grupo compacto al centro.
 * Muchas: dispersión tipo prado (Halton + jitter), sin patrón de módulo repetitivo.
 */
export function getPlantedStyle(index: number, total: number, _isLogged: boolean): CSSProperties {
    if (total <= 3) {
        if (total === 1) {
            return {
                left: "50%",
                bottom: "14%",
                transform: "translateX(-50%) scale(1)",
                zIndex: 45,
            }
        }
        if (total === 2) {
            const positions = [
                { left: 44, bottom: 13 },
                { left: 56, bottom: 13 },
            ]
            const p = positions[index] ?? positions[0]
            return {
                left: `${p.left}%`,
                bottom: `${p.bottom}%`,
                transform: "translateX(-50%) scale(1)",
                zIndex: 44 + index,
            }
        }
        const trio = [
            { left: 38, bottom: 13 },
            { left: 50, bottom: 15 },
            { left: 62, bottom: 13 },
        ]
        const p = trio[index] ?? trio[1]
        return {
            left: `${p.left}%`,
            bottom: `${p.bottom}%`,
            transform: "translateX(-50%) scale(1)",
            zIndex: 43 + index,
        }
    }

    return meadowScatter(index, total, 0, { stress: false })
}

/** Demo con muchas flores: mismo sistema, escalas algo más bajas para aire entre ellas */
export function getStressTestPlantStyle(index: number, total: number): CSSProperties {
    if (total <= 0) {
        return {
            left: "50%",
            bottom: "20%",
            transform: "translateX(-50%) scale(1)",
            zIndex: 10,
        }
    }
    return meadowScatter(index, total, 101, { stress: true })
}
