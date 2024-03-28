'use client';
import React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import {
  Bars3Icon,
} from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Single page app where pages just go down the that heading
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <header
      className="absolute inset-x-0 top-0 z-50 flex h-32 border-b border-gray-900/10"
      style={{ background: '#072232' }}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-1 items-center gap-x-6">
          <button
            type="button"
            className="-m-3 p-3 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-5 w-5 text-gray-100" aria-hidden="true" />
          </button>
          <Image
            src="/solarpowerbreakeven.png"
            className="h-auto w-auto"
            width={85}
            height={85}
            alt="Solar Power Breakeven Logo"
          />
        </div>
        <nav className="hidden md:flex md:gap-x-11 md:text-sm md:font-semibold md:leading-6 md:text-gray-100 hover:bg-500">
          {navigation.map((item, itemIdx) => (
            <a key={itemIdx} href={item.href}>
              {item.name}
            </a>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-x-8"></div>
      </div>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel
          className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto px-4 pb-6 sm:max-w-sm sm:px-6 sm:ring-1 sm:ring-gray-900/10"
          style={{ background: '#072232' }}
        >
          <div className="-ml-0.5 flex h-16 items-center gap-x-6">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="-ml-0.5">
              <a href="/" className="-m-1.5 block p-1.5">
                <span className="sr-only">Your Company</span>
                <Image
                  src="/solarpowerbreakeven.png"
                  className="h-auto w-auto"
                  width={60}
                  height={60}
                  alt="Solar Power Breakeven Logo"
                />
              </a>
            </div>
          </div>
          <div className="mt-2 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-100 hover:bg-gray-500"
              >
                {item.name}
              </a>
            ))}
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}

export default Header;
