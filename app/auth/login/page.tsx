import { Suspense } from 'react'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6EF] flex items-center justify-center text-gray-400">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
