import { Menu, Bell, ChevronDown, LogOut, User, MapPin } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks';
import { cn } from '../../lib/utils';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { profile, organization, locations, currentLocation, setCurrentLocation, signOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const locationMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (locationMenuRef.current && !locationMenuRef.current.contains(event.target as Node)) {
        setIsLocationMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {locations.length > 1 && (
          <div className="relative" ref={locationMenuRef}>
            <button
              onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
            >
              <MapPin className="h-4 w-4 text-slate-500" />
              <span className="max-w-[150px] truncate">{currentLocation?.name}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {isLocationMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 rounded-lg border bg-white py-1 shadow-lg">
                {locations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => {
                      setCurrentLocation(location);
                      setIsLocationMenuOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-slate-50',
                      currentLocation?.id === location.id && 'bg-rose-50 text-rose-700'
                    )}
                  >
                    <MapPin className="h-4 w-4" />
                    {location.name}
                    {location.is_primary && (
                      <span className="ml-auto text-xs text-slate-400">Primary</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button className="relative rounded-lg p-2 hover:bg-slate-100">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500" />
        </button>

        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 rounded-lg p-2 hover:bg-slate-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-sm font-medium text-white">
              {profile?.first_name?.[0]}
              {profile?.last_name?.[0]}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-slate-900">
                {profile?.first_name} {profile?.last_name}
              </p>
              <p className="text-xs text-slate-500">{organization?.name}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border bg-white py-1 shadow-lg">
              <div className="border-b px-4 py-3">
                <p className="text-sm font-medium text-slate-900">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-xs text-slate-500">{organization?.name}</p>
              </div>
              <button className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-slate-50">
                <User className="h-4 w-4" />
                Profile Settings
              </button>
              <button
                onClick={signOut}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
