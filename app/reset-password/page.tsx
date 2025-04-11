import ResetPasswordForm from '@/components/auth/reset-password-form';
import Image from 'next/image';
import Link from 'next/link';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.svg" alt="VeriFact" width={32} height={32} />
            <span className="font-bold text-xl">VeriFact</span>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center">
        <ResetPasswordForm />
      </main>
    </div>
  );
}
