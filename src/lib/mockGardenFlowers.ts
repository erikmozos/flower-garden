import type { Flower } from '@/lib/types'

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomItem<T>(items: T[]) {
    return items[Math.floor(Math.random() * items.length)]
}

/**
 * Genera flores ficticias para pruebas de rendimiento / densidad del jardín.
 * Solo debe usarse en el cliente (tras una interacción del usuario).
 */
export function generateMockGardenFlowers(count: number): (Flower & { username: string })[] {
    const petalShapes = ['round', 'pointed', 'oval', 'heart'] as const
    const backgroundTones = ['#fdfbf7', '#f8f9fa', '#fffafa', '#fdf8f5']
    const colors = [
        '#ff6b6b', '#fca311', '#4ecdc4', '#1a535c', '#ffe66d',
        '#ff9f1c', '#2ec4b6', '#e71d36', '#fdffb6', '#caffbf',
        '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff', '#ffd6a5',
    ]
    const darkColors = ['#1a1a2e', '#16213e', '#0f3460', '#e94560']

    const now = new Date().toISOString()

    return Array.from({ length: count }, (_, i) => {
        const id = `stress-preview-${i}-${crypto.randomUUID()}`
        return {
            id,
            user_id: `mock-user-${i}`,
            seed: crypto.randomUUID(),
            petal_count: randomInt(4, 12),
            petal_color: randomItem(colors),
            center_color: randomItem([...colors, ...darkColors]),
            stem_height: randomInt(100, 200),
            leaf_count: randomInt(1, 4),
            petal_shape: randomItem([...petalShapes]),
            size_scale: randomInt(80, 120) / 100,
            rotation: randomInt(0, 360),
            background_tone: randomItem(backgroundTones),
            svg_data: null,
            created_at: now,
            username: `Demo ${i + 1}`,
        }
    })
}
