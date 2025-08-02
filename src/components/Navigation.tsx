import { Link, useLocation } from "react-router-dom";
import { Home, BarChart3, Users } from "lucide-react";
import LoginDialog from "./LoginDialog";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/dashboard", label: "My Reviews", icon: BarChart3 },
    { path: "/community", label: "Community Reviews", icon: Users },
  ];

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">F</span>
            </div>
            <span className="gradient-text text-xl font-bold">Flash Feedback</span>
          </Link>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-primary text-primary-foreground shadow-glow"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="hidden sm:inline font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            
            <LoginDialog />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;