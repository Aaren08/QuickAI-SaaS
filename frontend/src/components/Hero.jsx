import { useNavigate } from "react-router-dom";
import BlobBackground from "./BlobBackground";
import { assets } from "../assets/assets";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="relative inline-flex flex-col w-full h-full justify-center px-4 sm:px-20 xl:px-32 bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]">
          Create amazing content <br /> with{" "}
          <span className="text-[var(--color-primary)]">AI tools</span>
        </h1>
        <p className="mt-4 text-lg max-sm:text-sm sm:max-w-lg m-auto 2xl:max-w-xl text-gray-600">
          Transform your content creation with our suite of premium AI tools.
          Write articles, generate images and enhance your workflow.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-5 text-sm max-sm:text-xs">
        <button className="fancy-btn" onClick={() => navigate("/ai")}>
          Start creating now
        </button>
        <button className="bg-white px-10 py-3 rounded-lg hover:scale-105 active:scale-95 transition-all">
          Watch demo
        </button>
      </div>

      <div className="flex items-center gap-4 mt-10 mx-auto text-gray-600">
        <img src={assets.user_group} alt="users" className="h-8" />
        <span>Trusted by 10k+ users</span>
      </div>
      <BlobBackground />
    </div>
  );
};

export default Hero;
