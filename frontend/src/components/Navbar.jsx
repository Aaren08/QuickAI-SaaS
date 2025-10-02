import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { motion as Motion } from "motion/react";
import { assets } from "../assets/assets.js";
const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <Motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed z-5 w-full flex items-center justify-between backdrop-blur-2xl py-3 px-4 xl:px-32 sm:px-20 "
    >
      <img
        src={assets.logo}
        alt="logo"
        className="w-32 sm:w-40 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {user ? (
        <UserButton />
      ) : (
        <button
          onClick={openSignIn}
          className="group flex items-center gap-2 justify-center 
             bg-[var(--color-primary)] text-white 
             py-1.5 px-3 text-sm 
             sm:py-2 sm:px-4 sm:text-base
             rounded-full hover:scale-105 active:scale-95 transition-all"
        >
          <span>Get Started</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      )}
    </Motion.div>
  );
};

export default Navbar;
