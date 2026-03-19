export type Profile = {
    id: string
    username: string | null
    created_at: string
}

export type Flower = {
    id: string
    user_id: string
    seed: string
    petal_count: number
    petal_color: string
    center_color: string
    stem_height: number
    leaf_count: number
    petal_shape: string
    size_scale: number
    rotation: number
    background_tone: string | null
    svg_data: string | null
    created_at: string
}
