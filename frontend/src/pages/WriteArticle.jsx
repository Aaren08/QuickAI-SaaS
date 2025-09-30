import { Edit, Sparkles } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const [input, setInput] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const articleLength = [
    {
      length: 800,
      text: "Short (500-800 words)",
    },
    {
      length: 1500,
      text: "Medium (1000-1500 words)",
    },
    {
      length: 3000,
      text: "Long (1500+ words)",
    },
  ];
  const [selectedLength, setSelectedLength] = useState(articleLength[0]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Write an article about ${input}. The article must be around ${selectedLength.length} words long, detailed, and well-structured.  Do not stop mid-sentence. Ensure the article has a clear conclusion.`;
      const { data } = await axios.post(
        "/api/ai/generate-article",
        { prompt, length: selectedLength.length },
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
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-4">
          <Sparkles className="w-5 h-5 text-[#4a7aff]" />
          <h1 className="text-xl font-semibold">Article Configuration</h1>
        </div>
        <p className="mt-6 mb-2 text-sm font-medium">Article Topic</p>
        <input
          type="text"
          className="w-full p-2 px-3 rounded-lg border border-gray-300 text-sm"
          placeholder="The future of artificial intelligence is..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <p className="mt-6 text-sm font-medium">Article Length</p>
        <div className="mt-3 flex flex-wrap gap-4 sm:max-w-9/11">
          {articleLength.map((length, index) => (
            <span
              key={index}
              className={`cursor-pointer text-xs px-4 py-1.5 rounded-full border ${
                selectedLength.text === length.text
                  ? "bg-blue-50 text-blue-700"
                  : "border-gray-300 text-gray-600"
              }`}
              onClick={() => setSelectedLength(length)}
            >
              {length.text}
            </span>
          ))}
        </div>{" "}
        <br />
        <button
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full mt-2 px-4 py-2 bg-gradient-to-r from-[#226bff] to-[#65adff] text-white rounded-lg"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-t-black border-gray-300 rounded-full animate-spin"></div>
          ) : (
            <Edit className="w-5 h-5 text-white" />
          )}
          Generate article
        </button>
      </form>

      {/* RIGHT COLUMN */}
      <div className="w-full flex flex-col max-w-lg max-h-[600px] min-h-96 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Edit className="w-5 h-5 text-[#4a7aff]" />
          <h1 className="text-xl font-semibold">Generated Article</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Edit className="w-9 h-9" />
              <p>Enter a topic and click "Generate article" to get started</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-gray-600">
            <div className="reset-tw">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteArticle;
