import ActionButton from "@/components/ActionButton";
import HText from "@/components/HText";
import { BenefitType, SelectedPage } from "@/utils/types";
import {
  HomeModernIcon,
  UserGroupIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
// import ServicePageGraphic from "../../../public/ServicePageGraphic.jpg";
import Services from "./Services";

const sdg3 = "/sdg3.png";
const sdg9 = "/sdg9.png";
const sdg16 = "/sdg16.png";
const sdg17 = "/sdg17.png";

const services: Array<BenefitType> = [
  {
    icon: <img src={sdg3} className="h-40 w-40" />,
    title: "Good Health and Well-being",
    desc: "SDG 3 aims to ensure healthy lives and promote well-being for all at all ages. This includes access to quality healthcare services, reducing mortality from infectious diseases, and providing rapid responses to medical conditions. MedLink Smart supports SDG 3 by offering an IoT-based system that enables real-time health monitoring. With MPX and MLX sensor technology integrated with a server, MedLink Smart facilitates accurate medical information access and helps improve the efficiency of healthcare services.",
  },
  {
    icon: <img src={sdg9} className="h-40 w-40" />,
    title: "Industry, Innovation, and Infrastructure",
    desc: "SDG 9 highlights the importance of building resilient infrastructure, fostering innovation, and promoting sustainable industrialization. MedLink Smart contributes to this goal by utilizing IoT technology and developing innovative devices relevant to the healthcare sector. This system not only improves the efficiency of health monitoring but also encourages cross-sector collaboration between technology and healthcare services",
  },
  {
    icon: <img src={sdg16} className="h-40 w-40" />,
    title: "Peace, Justice, and Strong Institutions",
    desc: "SDG 16 aims to promote strong institutions, transparency, and justice for all. By enabling real-time health data monitoring, MedLink Smart enhances transparency in medical information management and supports data-driven decision-making. This project can contribute to a fairer healthcare system by providing equal access to medical technology, particularly for underserved communities.",
  },
  {
    icon: <img src={sdg17} className="h-40 w-40" />,
    title: "Partnerships for the Goals",
    desc: "SDG 17 emphasizes the importance of global partnerships to support the achievement of sustainable development goals. MedLink Smart aligns with this goal by creating opportunities for collaboration among technology developers, healthcare providers, universities, and governments. The synergy of these stakeholders in the development and implementation of MedLink Smart can accelerate the adoption of IoT-based solutions in healthcare, expand access to this technology, and strengthen global healthcare systems.",
  },
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

type Props = {
  setSelectedPage: (value: SelectedPage) => void;
};

const Benefits = ({ setSelectedPage }: Props) => {
  return (
    <section id="services" className="px-4 py-20 mx-auto max-w-7xl overflow-hidden">
      <motion.div onViewportEnter={() => setSelectedPage(SelectedPage.Services)}>
        <motion.div
          className="text-center md:text-left md:w-3/5 mx-auto md:mx-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <HText>MORE THAN JUST A MEDICAL INNOVATION</HText>
          <p className="my-5 text-sm">
            MedLink Smart Can Support Sustainable Development Goals (SDGs)
          </p>
        </motion.div>

        {/* Service Cards */}
        <motion.div
          className="grid gap-8 mt-10 sm:grid-cols-2 md:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
        >
          {services.map((benefit) => (
            <Services
              key={benefit.title}
              icon={benefit.icon}
              title={benefit.title}
              desc={benefit.desc}
              setSelectedPage={setSelectedPage}
            />
          ))}
        </motion.div>

        {/* About MedLink Smart Section */}
        <div className="mt-20 flex flex-col-reverse md:flex-row items-center gap-10">
          <img
            className="w-full max-w-md mx-auto"
            alt="benefits-page-graphic"
            src="/ServicePageGraphic.jpg"
          />
          <div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0 },
              }}
            >
              <HText>
                ABOUT MEDLINK <span className="text-primary-300">SMART</span>
              </HText>
              <p className="my-4">
                We created MedLink Smart to address the challenges of improving
                healthcare efficiency through real-time monitoring of patient
                vital signs, reducing manual errors, and expanding access to
                remote areas.
              </p>
              <p>
                MedLink Smart is the result of interdisciplinary collaboration
                among students from Mechanical, Electrical, and Informatics
                Engineering. Its integration benefits institutions such as RS UMS
                and MMC to support efficient healthcare.
              </p>
            </motion.div>
            <div className="mt-10">
              <ActionButton setSelectedPage={setSelectedPage}>Diagnose Now</ActionButton>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Benefits;
