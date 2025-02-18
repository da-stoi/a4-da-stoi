import AuthStatus from './AuthStatus';
import { ChefHatIcon } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <ChefHatIcon className="h-8 w-8" />
        <h1 className="hidden text-2xl font-bold tracking-tight sm:block">
          Recipe App
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <AuthStatus />
        <ThemeSwitcher />
      </div>
    </header>
  );
}
