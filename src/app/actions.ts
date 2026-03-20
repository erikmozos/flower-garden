'use server'

import { revalidatePath } from 'next/cache'

/**
 * Invalida el caché de la página home para que las flores recién creadas
 * aparezcan inmediatamente sin esperar a que expire revalidate.
 */
export async function revalidateGarden() {
    revalidatePath('/')
}
