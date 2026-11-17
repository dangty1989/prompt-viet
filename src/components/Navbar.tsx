'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Heart, Home, Search, BookOpen } from 'lucide-react';
import { Github } from '@/components/CustomIcons';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { siteLinks } from '@/config/site';

const NAV_LINKS = [
  { href: '/', label: 'Trang chủ', icon: Home },
  { href: '/#prompts', label: 'Tìm prompt', icon: Search },
  { href: '/support', label: 'Ủng hộ', icon: Heart },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  // Đóng menu khi bấm Escape hoặc khi chuyển sang desktop
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Khoá scroll của body khi menu mobile đang mở
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-sticky bg-card/90 backdrop-blur border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between gap-3 h-14 sm:h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg sm:text-xl text-primary shrink-0 min-w-0"
            aria-label="Prompt Việt - Trang chủ"
          >
            <span className="text-accent">Prompt</span>
            <span className="truncate">Việt</span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2 shrink-0" aria-label="Điều hướng chính">
            {/* Desktop links */}
            <div className="hidden sm:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="btn btn-sm btn-ghost gap-1.5 text-sm whitespace-nowrap"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                </Link>
              ))}
              {siteLinks.blogUrl && (
                <a
                  href={siteLinks.blogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-ghost gap-1.5 text-sm whitespace-nowrap"
                >
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                  Blog
                </a>
              )}
            </div>

            <DarkModeToggle />

            {/* Nút hamburger — chỉ hiện trên mobile */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="btn btn-icon btn-ghost sm:hidden"
              aria-label={open ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </nav>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        id="mobile-menu"
        className={`sm:hidden overflow-hidden border-t border-border bg-card transition-[max-height] duration-200 ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <nav className="container py-2 flex flex-col" aria-label="Điều hướng mobile">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-2 py-3 text-sm rounded-lg hover:bg-muted transition-colors"
            >
              <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
              {label}
            </Link>
          ))}
          {siteLinks.blogUrl && (
            <a
              href={siteLinks.blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-2 py-3 text-sm rounded-lg hover:bg-muted transition-colors"
            >
              <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
              Blog
            </a>
          )}
          {siteLinks.githubRepo && (
            <a
              href={siteLinks.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-2 py-3 text-sm rounded-lg hover:bg-muted transition-colors"
            >
              <Github className="w-4 h-4 text-primary" aria-hidden="true" />
              Mã nguồn mở
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}