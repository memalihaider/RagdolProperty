'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  signInAsAdmin: (email: string, password: string) => Promise<{ error: AuthError | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch profile (function decl to be hoisted and usable in effects)
  async function fetchProfile(userId: string) {
    try {
      // Try up to 2 times for transient REST errors (e.g., 406 Not Acceptable)
      let profile: any = null
      let error: any = null
      for (let attempt = 1; attempt <= 2; attempt++) {
        const res = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        profile = res.data
        error = res.error
        if (!error) break
        // Retry once on 406 which can be transient due to REST negotiation
        if (error?.status === 406 && attempt === 1) {
          await new Promise(resolve => setTimeout(resolve, 300))
          continue
        }
        break
      }

      if (error) {
        console.error('Error fetching profile for user:', userId)
        const authErr = error as any
        console.error('Error details:', {
          message: authErr?.message,
          status: authErr?.status,
          code: authErr?.code,
          raw: JSON.stringify(authErr)
        })
        console.error('Error object type:', typeof error)
        console.error('Error object keys:', error ? Object.keys(error) : 'No keys')
        console.error('Full error object:', error)

        // If profile doesn't exist (PostgREST code for no rows)
        if (error.code === 'PGRST116') {
          console.log('Profile not found, attempting to create it...')
          try {
            const { data: userData, error: userError } = await supabase.auth.getUser()
            if (!userError && userData.user) {
              const profileData = {
                id: userId,
                full_name: userData.user.user_metadata?.full_name || '',
                phone: userData.user.user_metadata?.phone || '',
                role: userData.user.user_metadata?.user_type || 'customer',
                email_verified: userData.user.email_confirmed_at ? true : false
              }

              const { error: createError } = await supabase
                .from('profiles')
                .insert(profileData)

              if (createError) {
                console.error('Failed to create profile (anon client):', createError)
                console.error('Attempting service-side insertion because anon client failed. Create error details:', JSON.stringify(createError))
                // Try server-side creation via API (service role)
                try {
                  const headers: any = { 'Content-Type': 'application/json' }
                  // If public key is provided (dev convenience), include it in header
                  if (process.env.NEXT_PUBLIC_INTERNAL_API_KEY) {
                    headers['x-internal-api-key'] = process.env.NEXT_PUBLIC_INTERNAL_API_KEY
                  }
                  const resp = await fetch('/api/create-profile', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(profileData)
                  })
                  const result = await resp.json()
                  if (result?.ok && result.data?.[0]) {
                    setProfile(result.data[0])
                    return
                  } else {
                    console.error('Service profile creation failed:', result)
                  }
                } catch (err) {
                  console.error('Service profile creation error:', err)
                }
              } else {
                console.log('Profile created successfully')
                const { data: newProfile } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', userId)
                  .single()
                if (newProfile) {
                  setProfile(newProfile)
                  return
                }
              }
            }
          } catch (createErr) {
            console.error('Error creating profile:', createErr)
          }
        }

        // If we got a 406 (Not Acceptable), attempt to fetch via service-side API
        if (error?.status === 406) {
          try {
            const resp = await fetch(`/api/get-profile/${userId}`)
            const body = await resp.json()
            if (resp.ok && body?.ok && body.data) {
              setProfile(body.data)
              return
            }
          } catch (apiErr) {
            console.error('Service-side profile fetch failed:', apiErr)
          }
        }

        // Don't set profile to null on error, keep existing profile
      } else {
        setProfile(profile)
      }
    } catch (error) {
      console.error('Profile fetch error:', error)
    }
  }

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting initial session')
        const authErr = error as any
        console.error('Error details:', {
          message: authErr?.message,
          status: authErr?.status,
          code: authErr?.code,
          raw: JSON.stringify(authErr)
        })
        console.error('Error object type:', typeof error)
        console.error('Error object keys:', error ? Object.keys(error) : 'No keys')
        console.error('Full error object:', error)
      }
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    }).catch((error) => {
      console.error('Session initialization error:', error)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])


  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, userData?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })

    // If signup is successful, attempt to create profile on server-side to avoid RLS/foreign key issues
    if (!error && data?.user) {
      try {
        const profileData = {
          id: data.user.id,
          full_name: userData?.full_name || data.user.user_metadata?.full_name || '',
          phone: userData?.phone || data.user.user_metadata?.phone || '',
          role: userData?.user_type || data.user.user_metadata?.user_type || 'customer',
          email_verified: data.user.email_confirmed_at ? true : false
        }

        // Attempt to create via server API (uses service role)
        await fetch('/api/create-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profileData),
        })
      } catch (err) {
        console.error('Server-side profile creation failed during signUp:', err)
      }
    }

    return { error }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        // Log error but proceed to clear local state for robustness
        console.error('Supabase signOut error:', error)
      }
    } catch (err) {
      console.error('Error calling supabase.auth.signOut():', err)
    } finally {
      // Capture role before clearing local state
      const role = profile?.role
      // Always clear local state so UI is consistent even if external sign out fails
      setUser(null)
      setSession(null)
      setProfile(null)
      // Clear any stored tokens set by other auth flows
      try { localStorage.removeItem('auth_token') } catch (e) { /* ignore */ }
      try { localStorage.removeItem('supabase.auth.token') } catch (e) { /* ignore */ }
      try { localStorage.removeItem('sb:token') } catch (e) { /* ignore */ }
      // Navigate to a safe public page — admin users should go to /admin/login
      const redirectTo = role === 'admin' ? '/admin/login' : '/auth/login'
      try {
        router.push(redirectTo)
      } catch (navErr) {
        // If router not available, fallback to window.location
        try { window.location.href = redirectTo } catch (e) { /* ignore */ }
      }
    }
  }

  const signInAsAdmin = async (email: string, password: string) => {
    // Check hardcoded admin credentials
    const adminCredentials = [
      { email: 'admin@ragdol.com', password: 'Admin123!' },
      { email: 'superadmin@ragdol.com', password: 'SuperAdmin123!' },
      { email: 'manager@ragdol.com', password: 'Manager123!' }
    ]

    const isValidAdmin = adminCredentials.some(
      cred => cred.email === email && cred.password === password
    )

    if (!isValidAdmin) {
      return { error: { message: 'Invalid admin credentials' } as AuthError }
    }

    // For admin login, create a mock session and profile
    const mockUser = {
      id: 'admin-' + email.split('@')[0],
      email: email,
      user_metadata: { full_name: 'Admin User' },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      role: 'authenticated',
      confirmation_sent_at: undefined,
      recovery_sent_at: undefined,
      email_change_sent_at: undefined,
      new_email: undefined,
      invited_at: undefined,
      action_link: undefined,
      email_confirmed_at: new Date().toISOString(),
      phone_confirmed_at: undefined,
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      phone: '',
      identities: []
    } as User

    const mockSession = {
      user: mockUser,
      access_token: 'admin-token',
      refresh_token: 'admin-refresh',
      expires_in: 3600,
      token_type: 'bearer'
    } as Session

    // Set admin state directly
    setUser(mockUser)
    setSession(mockSession)
    setProfile({
      id: mockUser.id,
      full_name: 'Admin User',
      role: 'admin',
      phone: '+971501234567',
      avatar_url: null,
      bio: null,
      location: null,
      email_verified: true,
      phone_verified: false,
      last_login: new Date().toISOString(),
      login_count: 1,
      preferences: {},
      social_links: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    return { error: null }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInAsAdmin,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
