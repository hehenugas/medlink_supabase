import { SelectedPage } from "@/utils/types";
import { motion } from "framer-motion";

const childVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

type Props = {
  icon: any;
  title: string;
  desc: string;
  setSelectedPage: (value: SelectedPage) => void;
};

const Services = ({ icon, title, desc, setSelectedPage }: Props) => {
  return (
    <motion.div
      className="mt-5 rounded-md border-2 min-h-[400px] border-gray-100 px-5 py-16 text-center"
      variants={childVariant}
    >
      <div className="mb-4 flex justify-center">
        <div className="rounded-full border-2 border-gray-100 bg-primary-100 p-4">
          {icon}
        </div>
      </div>
      <h4 className="font-bold">{title}</h4>
      <p className="my-3">{desc}</p>
    </motion.div>
  );
};

export default Services;
