import { PricingTable } from "@clerk/clerk-react";
import { motion as Motion } from "motion/react";

const Plan = () => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="max-w-2xl mx-auto z-20 my-30"
    >
      <Motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-semibold mb-3">
          Choose Your Plan
        </h2>
        <Motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-gray-500 max-w-lg mx-auto"
        >
          Start for free and scale up as you grow. Find the perfect plan for
          your content creation needs.
        </Motion.p>
      </Motion.div>

      <Motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="mt-14 max-sm:mx-8"
      >
        <PricingTable />
      </Motion.div>
    </Motion.div>
  );
};

export default Plan;
