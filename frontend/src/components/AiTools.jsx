import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import { motion as Motion } from "motion/react";
import { AiToolsData } from "../assets/assets.js";

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  return (
    <Motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="px-4 sm:px-20 xl:px-32 my-30"
    >
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-semibold">
          Powerful AI Tools
        </h2>
        <Motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-4 text-gray-500 max-w-3xl mx-auto text-lg"
        >
          Everything you need to create, enhance and optimize your content with
          cutting-edge AI technology.
        </Motion.p>
      </Motion.div>

      {/* AI TOOLS */}
      <Motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 m-auto max-w-6xl px-4 xl:px-0 sm:px-6"
      >
        {AiToolsData.map((tool, index) => (
          <div
            key={index}
            onClick={() => {
              if (user) {
                navigate(tool.path);
              } else {
                toast.error("No user found");
              }
            }}
            className="p-10 rounded-lg bg-[#fdfdfe] shadow-lg border border-gray-100 hover:-translate-y-1 duration-300 transition-all cursor-pointer"
          >
            <tool.Icon
              className="w-12 h-12 p-3 text-white rounded-full"
              style={{
                background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})`,
              }}
            />
            <h3 className="mt-6 mb-4 text-lg font-semibold">{tool.title}</h3>
            <p className="text-gray-400 text-sm max-w-[95%]">
              {tool.description}
            </p>
          </div>
        ))}
      </Motion.div>
    </Motion.div>
  );
};

export default AiTools;
