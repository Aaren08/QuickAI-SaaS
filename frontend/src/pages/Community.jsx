import { useUser } from "@clerk/clerk-react";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import { motion as Motion } from "motion/react";
import HeartLike from "../components/HeartLike.jsx";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingLikes, setPendingLikes] = useState(new Set());
  const { user } = useUser();
  const { getToken } = useAuth();

  const fetchCreations = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/user/get-publish-creations", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  const imageLike = async (id) => {
    // If this creation is already being processed, ignore further clicks
    if (pendingLikes.has(id)) return;

    // Mark this creation as pending
    setPendingLikes((prev) => new Set(prev).add(id));

    // Optimistic update
    setCreations((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              likes: c.likes.includes(user.id)
                ? c.likes.filter((uid) => uid !== user.id)
                : [...c.likes, user.id],
            }
          : c
      )
    );

    try {
      const { data } = await axios.post(
        "/api/user/toggle-like-and-unlike",
        { id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (!data.success) {
        rollbackLike(id);
        toast.error(data.message);
      }
    } catch (err) {
      rollbackLike(id);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      // Remove from pending after response
      setPendingLikes((prev) => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
    }
  };

  // ROLLBACK HELPER
  const rollbackLike = (id) => {
    setCreations((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              likes: c.likes.includes(user.id)
                ? c.likes.filter((uid) => uid !== user.id)
                : [...c.likes, user.id],
            }
          : c
      )
    );
  };

  useEffect(() => {
    user && fetchCreations();
  }, [user, fetchCreations]);

  return !loading ? (
    <div className="flex flex-1 flex-col gap-4 p-6 h-full">
      <Motion.span
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl w-fit font-semibold bg-gradient-to-r from-orange-400 to-indigo-600 bg-clip-text text-transparent"
      >
        Creations
      </Motion.span>
      <Motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="bg-white h-full w-full rounded-xl overflow-y-scroll"
      >
        {creations.map((creation, index) => (
          <Motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 * index }}
            key={index}
            className="relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3"
          >
            <img
              src={creation.content}
              alt="image"
              className="w-full h-full object-cover rounded-lg"
            />

            <div className="absolute inset-0 left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg">
              <p className="text-sm hidden group-hover:block">
                {creation.prompt}
              </p>
              <div className="flex gap-1 items-center px-2 py-1 rounded-lg backdrop-blur-sm bg-white/10">
                <p>{creation.likes.length}</p>
                <HeartLike
                  onClick={() => imageLike(creation.id)}
                  className={`cursor-pointer ${
                    creation.likes.includes(user.id.toString())
                      ? "text-red-500"
                      : "text-black"
                  }`}
                />
              </div>
            </div>
          </Motion.div>
        ))}
      </Motion.div>
    </div>
  ) : (
    <div className="absolute top-1/2 left-1/2 w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
  );
};

export default Community;
