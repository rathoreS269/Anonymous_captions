'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { useRouter } from 'next/navigation';

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const router = useRouter();

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-y-4">
        
        {/* Left: Website Title */}
        <a href="#" className="text-xl font-bold">
          Anonymous Captions
        </a>

        {/* Center: Welcome Message */}
        {session && (
          <span className="w-full md:w-auto text-center text-lg md:flex-grow">
            Welcome, {user.username || user.email}
          </span>
        )}

        {/* Right: Buttons */}
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          {session ? (
            <>
              <Button
                onClick={() => router.push('/social-share')}
                className="bg-gray-800 text-white w-full md:w-auto"
              >
                Social Share
              </Button>
              <Button
                onClick={() => signOut()}
                className="bg-gray-800 text-white w-full md:w-auto"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-slate-100 text-black w-full md:w-auto" variant="outline">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
