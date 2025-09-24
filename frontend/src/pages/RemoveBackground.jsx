import { Eraser, Sparkles } from "lucide-react";
import { useState } from "react";
const RemoveBackground = () => {
  const [input, setInput] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  };
  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* LEFT COLUMN */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-4">
          <Sparkles className="w-5 h-5 text-[#ff4938]" />
          <h1 className="text-xl font-semibold">Background Removal</h1>
        </div>
        <div className="max-w-lg mt-6 mb-6">
          <label className="text-base text-slate-700 text-sm font-medium mb-1 block">
            Upload file
          </label>
          <input
            type="file"
            accept="image/*"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full text-slate-500 font-medium text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-slate-500 rounded"
          />
          <p className="text-xs text-[#ff4938] mt-2">
            PNG, JPG SVG, WEBP, and GIF are Allowed.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 w-full mt-2 px-4 py-2 bg-gradient-to-r from-[#f6ab41] to-[#ff4938] text-white rounded-lg">
          <Eraser className="w-5 h-5 text-white" />
          Remove background
        </button>
      </form>

      {/* RIGHT COLUMN */}
      <div className="w-full flex flex-col max-w-lg max-h-[600px] min-h-96 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Eraser className="w-5 h-5 text-[#ff4938]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Eraser className="w-9 h-9" />
            <p>Upload an image and click "Remove background" to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveBackground;
