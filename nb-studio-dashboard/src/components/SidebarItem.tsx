'use client';

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isCollapsed: boolean;
}

export function SidebarItem({ icon: Icon, label, href, isCollapsed }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={clsx(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
        'hover:bg-zinc-800 group',
        isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
      )}
      title={isCollapsed ? label : undefined}
    >
      <Icon className={clsx(
        'flex-shrink-0 transition-all duration-200',
        isActive ? 'text-white' : 'text-zinc-500 group-hover:text-white'
      )} size={20} />
      {!isCollapsed && (
        <span className="font-medium truncate">{label}</span>
      )}
    </Link>
  );
}
