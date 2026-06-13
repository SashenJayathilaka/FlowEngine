"use client";

import {
  CreditCardIcon,
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  SparklesIcon,
  ZapIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscriptions";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Workspace",
    items: [
      {
        title: "Workflows",
        icon: ZapIcon,
        url: "/workflows",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "Credentials",
        icon: KeyIcon,
        url: "/credentials",
      },
      {
        title: "Executions",
        icon: HistoryIcon,
        url: "/executions",
      },
    ],
  },
];

const AppSidebar = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { hasActiveSubscription, isLoading } = useHasActiveSubscription();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="pb-4">
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="gap-x-3 h-11 px-3 hover:bg-accent/50 group">
            <Link href="/workflows">
              <div className="size-7 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm shadow-primary/30 flex-shrink-0">
                <Image
                  src="/images/logoimage.png"
                  alt="nodebase"
                  width={18}
                  height={18}
                  className="brightness-0 invert"
                />
              </div>
              <span className="font-bold text-sm tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">NodeBase</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>

      <SidebarSeparator className="opacity-50" />

      <SidebarContent className="pt-3">
        {menuItems.map((group) => (
          <SidebarGroup key={group.title} className="py-1">
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 px-3 mb-1">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    item.url === "/"
                      ? pathName === "/"
                      : pathName.startsWith(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive}
                        asChild
                        className={cn(
                          "gap-x-3 h-9 px-3 rounded-lg transition-all duration-200",
                          isActive
                            ? "bg-primary/15 text-primary font-medium shadow-sm"
                            : "hover:bg-accent/40 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Link href={item.url}>
                          <item.icon className={cn("size-4", isActive && "text-primary")} />
                          <span className="text-sm">{item.title}</span>
                          {isActive && (
                            <div className="ml-auto size-1.5 rounded-full bg-primary" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator className="opacity-50" />

      <SidebarFooter className="pt-3 pb-4">
        <SidebarMenu className="gap-y-1">
          {!hasActiveSubscription && !isLoading && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Upgrade to Pro"
                className="gap-x-3 h-9 px-3 rounded-lg text-muted-foreground hover:text-foreground bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-200"
                onClick={() =>
                  authClient.checkout({
                    slug: "pro",
                  })
                }
              >
                <SparklesIcon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Upgrade Pro</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Billing Portal"
              className="gap-x-3 h-9 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-all duration-200"
              onClick={() => authClient.customer.portal()}
            >
              <CreditCardIcon className="h-4 w-4" />
              <span className="text-sm">Billing Portal</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign Out"
              className="gap-x-3 h-9 px-3 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/login");
                    },
                  },
                })
              }
            >
              <LogOutIcon className="h-4 w-4" />
              <span className="text-sm">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
