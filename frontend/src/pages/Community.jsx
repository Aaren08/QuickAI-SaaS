import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { dummyPublishedCreationData } from "../assets/assets.js";
import { Heart } from "lucide-react";
const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();

  const fetchCreations = async () => {
    setCreations(dummyPublishedCreationData);
  };

  useEffect(() => {
    user && fetchCreations();
  }, [user]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-6 h-full">
      <span className="text-3xl w-fit font-semibold bg-gradient-to-r from-orange-400 to-indigo-600 bg-clip-text text-transparent">
        Creations
      </span>
      <div className="bg-white h-full w-full rounded-xl overflow-y-scroll">
        {creations.map((creation, index) => (
          <div
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
              <div className="flex gap-1 items-center">
                <p>{creation.likes.length}</p>
                <Heart
                  className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${
                    creation.likes.includes(user.id)
                      ? "fill-red-500 text-red-600"
                      : "text-white"
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
