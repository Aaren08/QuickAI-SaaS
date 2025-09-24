import { Hash, Sparkles } from "lucide-react";
import { useState } from "react";

const BlogTitles = () => {
  const [input, setInput] = useState("");

  const blogCategories = [
    "Business",
    "Entertainment",
    "Health",
    "Science",
    "Sports",
    "Technology",
    "Travel",
  ];
  const [selectedCategory, setSelectedCategory] = useState(blogCategories[0]);

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
          <Sparkles className="w-5 h-5 text-[#8e37eb]" />
          <h1 className="text-xl font-semibold">AI Title Generator</h1>
        </div>
        <p className="mt-6 mb-2 text-sm font-medium">Keyword</p>
        <input
          type="text"
          className="w-full p-2 px-3 rounded-lg border border-gray-300 text-sm"
          placeholder="The future of artificial intelligence is..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <p className="mt-6 text-sm font-medium">Category</p>
        <div className="mt-3 flex flex-wrap gap-4 sm:max-w-9/11">
          {blogCategories.map((item) => (
            <span
              key={item}
              className={`cursor-pointer text-xs px-4 py-1.5 rounded-full border ${
                selectedCategory === item
                  ? "bg-purple-50 text-purple-700"
                  : "border-gray-300 text-gray-600"
              }`}
              onClick={() => setSelectedCategory(item)}
            >
              {item}
            </span>
          ))}
        </div>{" "}
        <br />
        <button className="flex items-center justify-center gap-2 w-full mt-2 px-4 py-2 bg-gradient-to-r from-[#c341f6] to-[#8e37eb] text-white rounded-lg">
          <Hash className="w-5 h-5 text-white" />
          Generate title
        </button>
      </form>

      {/* RIGHT COLUMN */}
      <div className="w-full flex flex-col max-w-lg min-h-96 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#8e37eb]" />
          <h1 className="text-xl font-semibold">Generated Titles</h1>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Hash className="w-9 h-9" />
            <p>Enter a topic and click "Generate title" to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogTitles;
