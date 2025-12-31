import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LoginDialog = () => {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <Button variant="outline" className="flex items-center space-x-2 glass border-primary/20" disabled>
        <LogIn size={18} />
        <span className="hidden sm:inline">Loading...</span>
      </Button>
    );
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center space-x-2 glass border-primary/20 hover:border-primary/40 hover:bg-primary/10">
            <User size={18} />
            <span className="hidden sm:inline truncate max-w-[100px]">
              {user.user_metadata?.display_name || user.email?.split("@")[0]}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={signOut} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link to="/auth">
      <Button variant="outline" className="flex items-center space-x-2 glass border-primary/20 hover:border-primary/40 hover:bg-primary/10">
        <LogIn size={18} />
        <span className="hidden sm:inline">Login</span>
      </Button>
    </Link>
  );
};

export default LoginDialog;