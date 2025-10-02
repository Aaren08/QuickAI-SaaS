import { Image, Sparkles } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import { motion as Motion } from "motion/react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const [input, setInput] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const imageStyle = [
    "Abstract Art",
    "Cartoon",
    "Cinematic",
    "Sketch",
    "Digital Art",
    "Minimalist",
    "Artistic",
    "Visual Art",
    "Conceptual",
    "Realistic",
    "Illustration",
  ];
  const [selectedStyle, setSelectedStyle] = useState(imageStyle[0]);
  const [publish, setPublish] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate an image of ${input} in the style of ${selectedStyle}`;
      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* LEFT COLUMN */}
      <Motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-4">
          <Sparkles className="w-5 h-5 text-[#00ad25]" />
          <h1 className="text-xl font-semibold">AI Image Generator</h1>
        </div>
        <p className="mt-6 mb-2 text-sm font-medium">Describe Your Image</p>
        <textarea
          type="text"
          rows={4}
          className="w-full p-2 px-3 rounded-lg border border-gray-300 text-sm"
          placeholder="Describe your image..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <p className="mt-6 text-sm font-medium">Style</p>
        <div className="mt-3 flex flex-wrap gap-4 sm:max-w-9/11">
          {imageStyle.map((item, index) => (
            <span
              key={index}
              className={`cursor-pointer text-xs px-4 py-1.5 rounded-full border ${
                selectedStyle === item
                  ? "bg-green-50 text-green-700"
                  : "border-gray-300 text-gray-600"
              }`}
              onClick={() => setSelectedStyle(item)}
            >
              {item}
            </span>
          ))}
        </div>{" "}
        {/* TOGGLE BUTTON */}
        <div className="flex items-center gap-2 mt-5">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
            />
            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition"></div>
            <span className="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition peer-checked:translate-x-4"></span>
          </label>
          <p className="text-sm">Make this image Public</p>
        </div>
        <br />
        <button
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full mt-2 px-4 py-2 bg-gradient-to-r from-[#00ad25] to-[#04ff50] text-white rounded-lg"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-t-black border-gray-300 rounded-full animate-spin"></div>
          ) : (
            <Image className="w-5 h-5 text-white" />
          )}
          Generate image
        </button>
      </Motion.form>

      {/* RIGHT COLUMN */}
      <Motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full flex flex-col max-w-lg min-h-96 p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Image className="w-5 h-5 text-[#00ad25]" />
          <h1 className="text-xl font-semibold">Generated Image</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Image className="w-9 h-9" />
              <p>Enter a topic and click "Generate image" to get started</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full">
            <img src={content} alt="image" className="w-full h-full" />
          </div>
        )}
      </Motion.div>
    </div>
  );
};

export default GenerateImages;
