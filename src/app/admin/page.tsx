'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function AdminLogin() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')

    const router = useRouter()
    const handleLogin = (e : React.FormEvent) => {
        e.preventDefault()


        if (email === 'uzair@hotmail.com' && password === 'admin') {
            localStorage.setItem('isLoggedIn', 'true')
            router.push('/admin/dashboard')
        } else {
            alert('Invalid email or password')
        }
    }
  return (
   <div className='flex justify-center ' >
    <form onSubmit={handleLogin} className='flex flex-col space-y-4' >
        <h2 className='text-2xl font-bold' >Admin Login</h2>
        <input type="email" placeholder='Email' value={email} 
        onChange={(e) => setEmail(e.target.value)} className='border border-gray-300 rounded-md p-2' />
        <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} className='border border-gray-300 rounded-md p-2' />
        <button type='submit' className='bg-red-600 text-white rounded-md p-2' >Login</button>
    </form>


   </div>
  )
}
