"use client";
import Link from "next/link";
import {
  User,
  LayoutDashboard,
  NotebookPen,
  BookOpenCheck,
  Brain,
} from "lucide-react";

export default function NavBar({ currentPage = "dashboard" }) {
  const isActive = (page) => currentPage === page;

  const navItems = [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      label: "Dashboard",
    },
    {
      id: "journals",
      icon: NotebookPen,
      href: "/journals",
      label: "Journals",
    },
    // Uncomment when needed:
    // {
    //   id: "blogs",
    //   icon: BookOpenCheck,
    //   href: "/blogs",
    //   label: "Blogs",
    // },
    {
      id: "profile",
      icon: User,
      href: "/profile",
      label: "Profile",
    },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-r border-gray-200/50 h-screen w-20 hover:w-64 transition-all duration-300 ease-in-out fixed left-0 top-0 z-50 shadow-xl group">
      <div className="p-6 border-b border-gray-200/50">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Brain size={20} className="text-white" />
        </div>
      </div>

      <ul className="flex flex-col space-y-2 p-4 mt-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.id);

          return (
            <li key={item.id}>
              <Link href={item.href} className="block">
                <div
                  className={`relative flex items-center px-3 py-4 rounded-xl transition-all duration-300 cursor-pointer group/item
                    ${
                      active
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25"
                        : "text-gray-600 hover:bg-gray-100 hover:text-purple-600"
                    }
                  `}
                >
                  {active && (
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-r-full" />
                  )}

                  <div className="min-w-[2rem] flex justify-center">
                    <Icon
                      size={24}
                      className={`transition-transform duration-300 ${
                        active ? "scale-110" : "group-hover/item:scale-110"
                      }`}
                    />
                  </div>

                  <span
                    className={`ml-4 font-medium whitespace-nowrap transition-all duration-300 overflow-hidden
                      ${
                        active
                          ? "opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto"
                          : "opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto"
                      }
                    `}
                  >
                    {item.label}
                  </span>

                  {!active && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-hover/item:from-purple-500/10 group-hover/item:to-blue-500/10 transition-all duration-300" />
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="absolute bottom-8 left-0 right-0 px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-4" />
        <div className="flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="ml-2 text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
            Online
          </span>
        </div>
      </div>
    </nav>
  );
}
