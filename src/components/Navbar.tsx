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
      <div className="container mx-auto flex items-center justify-between">
        
        {/* Left: Website Title */}
        <a href="#" className="text-xl font-bold">
          Anonymous Captions
        </a>

        {/* Center: Welcome Message (Use flex-grow for centering) */}
        {session && (
          <span className="flex-grow text-center text-lg">
            Welcome, {user.username || user.email}
          </span>
        )}

        {/* Right: Buttons */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Button
                onClick={() => router.push('/social-share')}
                className="bg-gray-800 text-white"
              >
                Social Share
              </Button>
              <Button
                onClick={() => signOut()}
                className="bg-gray-800 text-white"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-slate-100 text-black" variant="outline">
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
