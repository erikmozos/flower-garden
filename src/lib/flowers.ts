import { supabase } from './supabaseClient'
import { Flower } from './types'

export async function getFlowerByUserId(userId: string): Promise<Flower | null> {
    const { data, error } = await supabase
        .from('flowers')
        .select('*')
        .eq('user_id', userId)
        .single()

    if (error) {
        if (error.code === 'PGRST116') {
            return null
        }
        console.error('Error fetching flower:', error.message)
        return null
    }

    return data as Flower
}

export async function getAllFlowersWithProfiles(limit = 100) {
    try {
        const { data: flowers, error } = await supabase
            .from('flowers')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) {
            console.error('Error fetching all flowers:', error.message, error)
            return []
        }

        if (!flowers || flowers.length === 0) return []

        const typedFlowers = flowers as any[]
        const userIds = Array.from(new Set(typedFlowers.map(f => f.user_id)))

        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username')
            .in('id', userIds)

        if (profilesError) {
            console.error('Error fetching profiles:', profilesError.message, profilesError)
        }

        const profilesMap = new Map<string, string | null>()
        if (profiles) {
            ; (profiles as any[]).forEach(p => {
                profilesMap.set(p.id, p.username)
            })
        }

        return typedFlowers.map(flower => ({
            ...flower,
            username: profilesMap.get(flower.user_id) || 'Explorador Anónimo'
        }))
    } catch (err) {
        console.error('Exception in getAllFlowersWithProfiles:', err instanceof Error ? err.message : String(err))
        return []
    }
}

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomItem<T>(items: T[]) {
    return items[Math.floor(Math.random() * items.length)]
}

export async function createFlowerForUser(userId: string): Promise<Flower | null> {
    const seed = crypto.randomUUID()

    const petalShapes = ['round', 'pointed', 'oval', 'heart']
    const backgroundTones = ['#fdfbf7', '#f8f9fa', '#fffafa', '#fdf8f5']
    const colors = [
        '#ff6b6b', '#fca311', '#4ecdc4', '#1a535c', '#ffe66d',
        '#ff9f1c', '#2ec4b6', '#e71d36', '#fdffb6', '#caffbf',
        '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff', '#ffd6a5'
    ]
    const darkColors = ['#1a1a2e', '#16213e', '#0f3460', '#e94560']

    const newFlower = {
        user_id: userId,
        seed,
        petal_count: randomInt(4, 12),
        petal_color: randomItem(colors),
        center_color: randomItem([...colors, ...darkColors]),
        stem_height: randomInt(100, 200),
        leaf_count: randomInt(1, 4),
        petal_shape: randomItem(petalShapes),
        size_scale: (randomInt(80, 120) / 100),
        rotation: randomInt(0, 360),
        background_tone: randomItem(backgroundTones),
    }

    // Insert to DB
    const { data, error } = await supabase
        .from('flowers')
        .insert([newFlower] as any)
        .select()
        .single()

    if (error) {
        if (error.code === '23505') {
            // unique violation (user_id)
            throw new Error('User already has a flower.')
        }
        throw error
    }

    return data as Flower
}
