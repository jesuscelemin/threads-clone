'use server'

import * as auth from '@/auth'

export async function signOut() {
  console.log('hello')

  return auth.signOut()
}
