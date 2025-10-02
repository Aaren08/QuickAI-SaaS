import { Scissors, Sparkles } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import { motion as Motion } from "motion/react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState("");
  const [selectedObject, setSelectedObject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (selectedObject.split(",").length > 1) {
        toast.error("Please select only one object");
      }
      const formData = new FormData();
      formData.append("image", input);
      formData.append("object", selectedObject);

      const { data } = await axios.post(
        "/api/ai/remove-image-object",
        formData,
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
          <Sparkles className="w-5 h-5 text-[#4a7aff]" />
          <h1 className="text-xl font-semibold">Object Removal</h1>
        </div>
        {/* UPLOAD IMAGE */}
        <div className="max-w-lg mt-6 mb-6">
          <label className="text-base text-slate-700 text-sm font-medium mb-1 block">
            Upload file
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setInput(e.target.files[0])}
            className="w-full text-slate-500 font-medium text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-slate-500 rounded"
            required
          />
          <p className="text-xs text-[#4a6aee] mt-2">
            PNG, JPG SVG, WEBP, and GIF are Allowed.
          </p>
        </div>

        <div className="max-w-lg mt-6 mb-6">
          <label className="text-base text-slate-700 text-sm font-medium mb-1 block">
            Describe the object to remove
          </label>
          <textarea
            rows={4}
            value={selectedObject}
            onChange={(e) => setSelectedObject(e.target.value)}
            className="w-full p-2 text-slate-500 font-medium text-sm bg-white border border-gray-400 rounded"
            placeholder="e.g. car in background, person in foreground, etc."
            required
          />
          <p className="text-xs text-gray-600">
            Be specific about what you want to remove
          </p>
        </div>
        <button
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full mt-2 px-4 py-2 bg-gradient-to-r from-[#417df6] to-[#8e37eb] text-white rounded-lg"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-t-black border-gray-300 rounded-full animate-spin"></div>
          ) : (
            <Scissors className="w-5 h-5 text-white" />
          )}
          Remove object
        </button>
      </Motion.form>

      {/* RIGHT COLUMN */}
      <Motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full flex flex-col max-w-lg max-h-[600px] min-h-96 p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#4a7aff]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Scissors className="w-9 h-9" />
              <p>Upload an image and click "Remove object" to get started</p>
            </div>
          </div>
        ) : (
          <img
            src={content}
            alt="image"
            className="mt-3 w-full h-full object-cover"
          />
        )}
      </Motion.div>
    </div>
  );
};

export default RemoveObject;
