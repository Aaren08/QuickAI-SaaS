import { useCallback, useEffect, useState } from "react";
import { Gem, Sparkles } from "lucide-react";
import { Protect } from "@clerk/clerk-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import { motion as Motion } from "motion/react";
import CreationItems from "../components/CreationItems.jsx";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const getDashboardData = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/user/get-user-creations", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if (data.success) {
        setCreations(data.creations);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    getDashboardData();
  }, [getDashboardData]);

  return (
    <div className="h-full overflow-y-scroll p-6">
      <Motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-start flex-wrap gap-4"
      >
        {/* TOTAL CREATIONS CARD */}
        <div className="flex justify-between items-center gap-4 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600 ">
            <p className="text-sm">Total Creations</p>
            <h2 className="text-xl font-semibold">{creations.length}</h2>
          </div>
          <div className="w-10 h-10 ml-10 rounded-lg bg-gradient-to-br from-[#3588f2] to-[#0bb0d7] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* ACTIVE PLAN CARD */}
        <Motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-between items-center gap-4 p-4 px-6 bg-white rounded-xl border border-gray-200"
        >
          <div className="text-slate-600 ">
            <p className="text-sm">Active Plan</p>
            <h2 className="text-xl font-semibold">
              <Protect plan={"premium"} fallback={"free"}>
                Premium
              </Protect>
            </h2>
          </div>
          <div className="w-10 h-10 ml-10 rounded-lg bg-gradient-to-br from-[#ff61c5] to-[#9e53ee] flex items-center justify-center">
            <Gem className="w-5 h-5 text-white" />
          </div>
        </Motion.div>
      </Motion.div>

      {loading ? (
        <div className="absolute top-1/2 left-1/2 w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
      ) : (
        <Motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-3"
        >
          {/* RECENT CREATIONS */}
          <p className="mt-6 mb-4">Recent Creations</p>
          {creations.map((item, index) => (
            <CreationItems key={index} item={item} />
          ))}
        </Motion.div>
      )}
    </div>
  );
};

export default Dashboard;
