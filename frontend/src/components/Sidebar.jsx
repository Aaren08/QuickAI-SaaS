import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  LogOut,
  Scissors,
  SquarePen,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/ai", label: "Dashboard", Icon: House },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
  { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors },
  { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
  { to: "/ai/community", label: "Community", Icon: Users },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  return (
    <div
      className={`w-60 flex flex-col justify-between items-center bg-white border-r border-gray-200
    sm:relative sm:translate-x-0
    max-sm:fixed max-sm:top-14 max-sm:bottom-0 max-sm:left-0
    transform transition-transform duration-300 ease-in-out
    ${sidebar ? "translate-x-0" : "max-sm:-translate-x-full"}`}
    >
      <div className="my-7 w-full">
        <img
          src={user?.imageUrl}
          alt="user"
          className="w-13 rounded-full mx-auto"
        />
        <h1 className="mt-2 text-center">{user?.fullName}</h1>

        {/* DASHBOARD NAV */}
        <div className="mt-6 text-gray-600 font-medium">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/ai"}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-[#3c81f6] to-[#9234ea] text-white"
                    : ""
                }`
              }
            >
              {({ isActive }) => {
                const DynamicIcon = Icon;
                return (
                  <>
                    <DynamicIcon
                      className={`w-4 h-4 ${
                        isActive ? "text-white horizontal-shaking" : ""
                      }`}
                    />
                    {label}
                  </>
                );
              }}
            </NavLink>
          ))}
        </div>
      </div>

      {/* FOOTER SECTION - LOGOUT */}
      <div className="p-4 w-full flex items-center justify-between border-t border-gray-200">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={openUserProfile}
        >
          <img src={user?.imageUrl} alt="user" className="w-7 rounded-full" />
          <div className="flex flex-col leading-tight">
            <h1 className="text-sm font-medium">{user?.fullName}</h1>
            <p className="text-xs text-gray-400">
              <Protect plan={"premium"} fallback={"free"}>
                Premium
              </Protect>{" "}
              Plan
            </p>
          </div>
        </div>
        <LogOut
          onClick={signOut}
          className="cursor-pointer w-5 h-5 text-gray-400 hover:text-gray-700 transition-all duration-300"
        />
      </div>
    </div>
  );
};

export default Sidebar;
