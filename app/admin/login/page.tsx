'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon, UserGroupIcon, HomeIcon, ArrowLeftIcon, BuildingOfficeIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'

type UserRole = 'customer' | 'admin'

export default function EnhancedLoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const { signIn, signUp, signInAsAdmin } = useAuth()

  // Hardcoded admin credentials for testing
  const ADMIN_CREDENTIALS = [
    { email: 'admin@ragdol.com', password: 'Admin123!' },
    { email: 'superadmin@ragdol.com', password: 'Admin123!' },
    { email: 'manager@ragdol.com', password: 'Admin123!' }
  ]

  // Demo credentials for different roles
  const DEMO_CREDENTIALS = {
    admin: { email: 'admin@ragdol.com', password: 'Admin123!' },
    customer: { email: 'customer@ragdol.com', password: 'Customer123!' }
  }

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role)
    setError('')
    setSuccess('')
    // Clear form when switching roles
    setFormData({
      email: '',
      password: '',
      fullName: '',
      phone: ''
    })
  }

  const fillDemoCredentials = () => {
    const credentials = DEMO_CREDENTIALS[selectedRole]
    setFormData(prev => ({
      ...prev,
      email: credentials.email,
      password: credentials.password
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isLogin) {
        // Handle login
        let result

        if (selectedRole === 'admin') {
          // Check hardcoded admin credentials first
          const adminCred = ADMIN_CREDENTIALS.find(cred => cred.email === formData.email)
          if (adminCred && formData.password === adminCred.password) {
            result = await signInAsAdmin(formData.email, formData.password)
          } else {
            result = await signInAsAdmin(formData.email, formData.password)
          }
        } else {
          result = await signIn(formData.email, formData.password)
        }

        if (result.error) {
          setError(result.error.message || 'Login failed. Please try again.')
        } else {
          // Redirect based on role
          switch (selectedRole) {
            case 'admin':
              router.push('/admin')
              break
            case 'customer':
              router.push('/')
              break
          }
        }
      } else {
        // Handle signup (only for customers)
        if (selectedRole !== 'customer') {
          setError('Registration is currently only available for customers. Please contact support for agent or admin accounts.')
          setIsLoading(false)
          return
        }

        const { error } = await signUp(formData.email, formData.password, {
          fullName: formData.fullName,
          phone: formData.phone,
          role: selectedRole
        })

        if (error) {
          setError(error.message || 'Sign up failed. Please try again.')
        } else {
          setSuccess('Account created successfully! Please check your email to verify your account.')
          // Switch to login mode after successful signup
          setTimeout(() => {
            setIsLogin(true)
            setSuccess('')
          }, 3000)
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <ShieldCheckIcon className="h-8 w-8" />
      case 'customer':
        return <HomeIcon className="h-8 w-8" />
    }
  }

  const getRoleTitle = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Admin Portal'
      case 'customer':
        return 'Welcome Back'
    }
  }

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Access the RAGDOL administration dashboard'
      case 'customer':
        return 'Find your dream property in Dubai'
    }
  }

  const getRoleFeatures = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return ['User Management', 'Property Oversight', 'Analytics Dashboard', 'System Settings']
      case 'customer':
        return ['Property Search', 'Saved Properties', 'Inquire About Listings', 'Property Valuations']
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gradient">RAGDOL</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Content */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    {getRoleTitle(selectedRole)}
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-lg">
                    {getRoleDescription(selectedRole)}
                  </p>
                </div>

                {/* Role Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">What you can do:</h3>
                  <ul className="space-y-2">
                    {getRoleFeatures(selectedRole).map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Role Selector */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Select Account Type</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(['customer', 'admin'] as UserRole[]).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleChange(role)}
                        className={`p-6 rounded-xl border text-center transition-all duration-200 group ${
                          selectedRole === role
                            ? 'border-primary bg-primary/5 shadow-lg scale-105'
                            : 'border-border bg-card hover:border-primary/50 hover:shadow-md'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className={`p-3 rounded-full transition-colors ${
                            selectedRole === role
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                          }`}>
                            {getRoleIcon(role)}
                          </div>
                          <div>
                            <span className="text-sm font-medium capitalize">{role}</span>
                            <p className="text-xs text-muted-foreground mt-1">
                              {role === 'customer' ? 'Find Properties' : 'Admin Control'}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Login Form */}
              <div className="lg:pl-8">
                <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      {getRoleIcon(selectedRole)}
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {isLogin ? 'Sign In' : 'Create Account'}
                    </h2>
                    <p className="text-muted-foreground mt-2">
                      {isLogin
                        ? `Welcome back to your ${selectedRole} portal`
                        : 'Join RAGDOL to find your dream property'
                      }
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                      <p className="text-destructive text-sm">{error}</p>
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                      <p className="text-green-600 text-sm">{success}</p>
                    </div>
                  )}

                  {/* Sign In/Sign Up Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && selectedRole === 'customer' && (
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                          Full Name
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                          required={!isLogin}
                          className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                          placeholder="Enter your full name"
                        />
                      </div>
                    )}

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                        placeholder={`Enter your ${selectedRole} email`}
                      />
                    </div>

                    {!isLogin && selectedRole === 'customer' && (
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    )}

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          required
                          className="w-full px-4 py-3 pr-12 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                          {isLogin ? 'Signing In...' : 'Creating Account...'}
                        </div>
                      ) : (
                        isLogin ? `Sign In as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}` : 'Create Account'
                      )}
                    </button>
                  </form>

                  {/* Demo Credentials */}
                  <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border/50">
                    <h3 className="text-foreground font-medium mb-3 text-sm">Demo Credentials</h3>
                    <div className="text-sm text-muted-foreground space-y-1 mb-3">
                      <p><strong>Email:</strong> {DEMO_CREDENTIALS[selectedRole].email}</p>
                      <p><strong>Password:</strong> {DEMO_CREDENTIALS[selectedRole].password}</p>
                    </div>
                    <button
                      onClick={fillDemoCredentials}
                      className="w-full bg-background hover:bg-muted text-foreground text-sm py-2 px-3 rounded-lg transition-colors border border-border"
                    >
                      Use Demo Credentials
                    </button>
                  </div>

                  {/* Toggle between Login/Signup */}
                  {selectedRole === 'customer' && (
                    <div className="text-center mt-6">
                      <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        {isLogin
                          ? "Don't have an account? Sign up"
                          : "Already have an account? Sign in"
                        }
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-card">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-gradient">RAGDOL</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the difference with our premium real estate platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <BuildingOfficeIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Premium Properties</h3>
              <p className="text-muted-foreground">Access to Dubai's most exclusive and high-quality properties</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <SparklesIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Premium Service</h3>
              <p className="text-muted-foreground">End-to-end support for all your real estate needs</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <SparklesIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Premium Service</h3>
              <p className="text-muted-foreground">End-to-end support for all your real estate needs</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}