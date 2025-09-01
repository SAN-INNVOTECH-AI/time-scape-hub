import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Users, BarChart3, Moon, Sun, Menu, X } from "lucide-react";

export default function Layout() {
  const [isDark, setIsDark] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    document.documentElement.classList.toggle('light');
  };

  const navItems = [
    { path: "/tracker", label: "Tracker", icon: MapPin },
    { path: "/admin", label: "Admin", icon: Users },
  ];

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <div className="min-h-screen bg-background relative">
        {/* Background gradient */}
        <div className="fixed inset-0 bg-gradient-primary opacity-20 pointer-events-none" />
        
        {/* Navigation */}
        <nav className="relative z-10 glass-card m-4 mb-0 md:mx-6 md:mt-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <NavLink to="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-semibold">Realcon Tracker</span>
                </NavLink>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-1 ml-8">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-surface-hover text-primary font-medium'
                            : 'text-foreground hover:bg-surface-hover'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="hover:bg-surface-hover"
                >
                  {isDark ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
                
                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden hover:bg-surface-hover"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Menu className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="md:hidden mt-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center w-full px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-surface-hover text-primary font-medium'
                            : 'text-foreground hover:bg-surface-hover'
                        }`
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <main className="relative z-10 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}