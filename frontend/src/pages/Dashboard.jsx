import { useEffect, useState } from "react";
import { Gem, Sparkles } from "lucide-react";
import { Protect } from "@clerk/clerk-react";
import CreationItems from "../components/CreationItems.jsx";
import { dummyCreationData } from "../assets/assets.js";

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const getDashboardData = async () => {
    setCreations(dummyCreationData);
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="h-full overflow-y-scroll p-6">
      <div className="flex justify-start flex-wrap gap-4">
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
        <div className="flex justify-between items-center gap-4 p-4 px-6 bg-white rounded-xl border border-gray-200">
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
        </div>
      </div>

      {/* RECENT CREATIONS */}
      <div className="space-y-3">
        <p className="mt-6 mb-4">Recent Creations</p>
        {creations.map((item, index) => (
          <CreationItems key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
