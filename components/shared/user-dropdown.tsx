"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LucideIcon,
  CircleUserRound,
  Settings,
  LogOut,
  User as UserIcon,
} from "lucide-react";

import { User } from "@/types";

type Props = {
  trigger?: ReactNode;
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
  user?: User | null;
  userLogOut?: () => Promise<{ success: boolean } | void>;
};

type MenuItem = {
  label: string;
  icon: LucideIcon;
  destructive?: boolean;
  href?: string;
};

const PROFILE_ITEMS: MenuItem[] = [
  { label: "My Profile", icon: CircleUserRound, href: "/profile" },
];

const SETTINGS_ITEMS: MenuItem[] = [
  { label: "Account Settings", icon: Settings, href: "/settings" },
];

const LOGOUT_ITEM: MenuItem = {
  label: "Logout",
  icon: LogOut,
  destructive: true,
};

const itemClass =
  "p-2 text-sm font-medium text-popover-foreground cursor-pointer gap-2";

function getInitials(firstName?: string, lastName?: string) {
  if (!firstName && !lastName) {
    return "GU";
  }
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

const UserDropdown = ({
  trigger,
  defaultOpen,
  user,
  align = "end",
  userLogOut,
}: Props) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (!userLogOut) return;

    setIsLoggingOut(true);
    try {
      await userLogOut();
      // No need for router.refresh() or push because server action does redirect
    } catch (error) {
      console.error("Logout failed", error);
      setIsLoggingOut(false);
    }
  };

  const displayName = user
    ? `${user.firstName} ${user.lastName}`
    : "Guest user";
  const displayEmail = user?.email ?? "Not signed in";
  const initials = getInitials(user?.firstName, user?.lastName);

  const menuTrigger = trigger ?? (
    <div className="rounded-full border border-input bg-muted p-2 cursor-pointer">
      <Avatar className="size-8">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    </div>
  );

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu defaultOpen={defaultOpen}>
        <DropdownMenuTrigger>{menuTrigger}</DropdownMenuTrigger>
        <DropdownMenuContent
          align={align}
          className="w-3xs rounded-2xl data-open:slide-in-from-bottom-20! data-closed:slide-out-to-bottom-20 data-open:fade-in-0 data-closed:fade-out-0 data-closed:zoom-out-100 duration-400"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-3 px-4 py-3">
              <div className="relative">
                <Avatar className="data-[size=lg]:size-8">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                {user && (
                  <span className="ring-card absolute right-0 bottom-0 size-2 rounded-full bg-green-600 ring-2" />
                )}
              </div>

              <div className="flex flex-col">
                <span className="text-popover-foreground text-sm font-medium">
                  {displayName}
                </span>
                <span className="text-muted-foreground text-sm">
                  {displayEmail}
                </span>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {user ? (
            <>
              <DropdownMenuGroup>
                {PROFILE_ITEMS.map(({ label, icon: Icon, href }) => (
                  <DropdownMenuItem key={label} className={itemClass} asChild>
                    <Link
                      href={href ?? "/"}
                      className="flex items-center gap-2"
                    >
                      <Icon size={20} />
                      <span>{label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                {SETTINGS_ITEMS.map(({ label, icon: Icon, href }) => (
                  <DropdownMenuItem key={label} className={itemClass} asChild>
                    <Link
                      href={href ?? "/"}
                      className="flex items-center gap-2"
                    >
                      <Icon size={20} />
                      <span>{label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                className={itemClass}
                onClick={handleLogout}
              >
                <LOGOUT_ITEM.icon size={20} />
                <span>
                  {isLoggingOut ? "Logging out..." : LOGOUT_ITEM.label}
                </span>
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuGroup>
              <DropdownMenuItem className={itemClass} asChild>
                <Link href="/login" className="flex items-center gap-2">
                  <UserIcon size={20} />
                  <span>Login</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserDropdown;
