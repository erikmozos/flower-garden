import { supabase } from './supabaseClient'
import { Profile } from './types'

export async function getCurrentUser() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return null

    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
        if (error.message !== 'Auth session missing!') {
            console.error('Error getting user:', error.message)
        }
        return null
    }
    return user
}

export async function getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

    if (error) {
        console.error('Error fetching profile:', error.message)
        return null
    }
    return data as Profile | null
}

export async function signUp(email: string, password: string, username?: string) {
    const finalUsername = username && username.trim() !== '' ? username : email.split('@')[0]

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username: finalUsername,
            }
        }
    })

    if (error) throw error

    if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            username: finalUsername
        } as any)

        if (profileError) {
            console.error('Error creating user profile:', profileError.message)
            // Lanza el error para que AuthForm lo atrape y te lo muestre en pantalla
            throw new Error(`Error en Supabase (RLS o base de datos): ${profileError.message}`)
        }
    }

    return data
}

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) throw error
    return data
}

export async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}
