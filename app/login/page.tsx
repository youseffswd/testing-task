import { Suspense } from 'react'; import LoginForm from './login-form';
export default function LoginPage() { return <main className="container flex min-h-[calc(100vh-64px)] items-center justify-center py-10"><Suspense fallback={<div className="h-96 w-full max-w-md animate-pulse rounded-2xl bg-slate-200"/>}><LoginForm /></Suspense></main>; }
