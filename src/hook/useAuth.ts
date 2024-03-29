/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type registerUserType } from '@/type'
import { createBrowserClient } from '@supabase/ssr'
import { type User, type UserResponse } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

interface signinUserType {
  email: string
  password: string
}

function useAuth () {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const getUser = async (): Promise<UserResponse> => {
    return await supabase.auth.getUser()
  }

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/auth/verification/provider'
        }
      })
      if (error != null) console.error('A ocurido un error al autenticar', error)
      return { data, error }
    } catch (error) {
      console.log(error)
    }
  }

  const registerUser = async ({ email, password, name }: registerUserType) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      })

      const id = data.user?.id
      await createRowDataImage(id)

      if (error != null) console.error('A ocurido un error al autenticar', error)
      return { data, error }
    } catch (error) {
      console.log(error)
    }
  }

  const loginUser = async ({ email, password }: signinUserType) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error != null) console.error('A ocurido un error al autenticar', error)
      return { data, error }
    } catch (error) {
      console.log(error)
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.log(error)
    }
  }

  const changePassword = async () => {
    try {
      const email = user?.email
      if (email === undefined) { console.log('email undefined'); return }
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3000/app/setting/change/password'
      })

      if (error != null) console.error('A ocurido un error al cambiar de password', error)
      return { data, error }
    } catch (error) {
      console.log(error)
    }
  }

  const changeName = async (name: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { name }
      })

      if (error != null) console.error('A ocurido un error al cambiar de nombre', error)
      return { data, error }
    } catch (error) {
      console.log(error)
    }
  }

  const createRowDataImage = async (id: string | undefined) => {
    try {
      if (id === undefined) { console.log('email undefined'); return }
      const { data, error } = await supabase
        .from('data_image')
        .insert([
          { user_id: id, list_image: null }
        ])
        .select()
      if (error != null) console.error('A ocurido un error al autenticar', error)
      return { data, error }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUser()
      .then(res => {
        setUser(res.data.user)
      })
  }, [])

  return {
    supabase,
    registerUser,
    loginUser,
    signOut,
    signInWithGoogle,
    changePassword,
    changeName,
    getUser,
    user
  }
}

export default useAuth
