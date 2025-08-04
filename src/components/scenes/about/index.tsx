"use client";

import { SelectedPage } from "@/utils/types";
import { motion } from "framer-motion";
import HText from "@/components/HText";
import Carousel from "./carousel";

const images = ["/image1.png", "/image2.png", "/image3.png", "/image4.png"];

type Props = {
  setSelectedPage: (value: SelectedPage) => void;
};

const About = ({ setSelectedPage }: Props) => {
  return (
    <section id="about" className="w-full py-40">
      <motion.div onViewportEnter={() => setSelectedPage(SelectedPage.About)}>
        <motion.div
          className="mx-auto w-5/6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <div className="md:w-full">
            <HText>What is MedLink?</HText>
            <p className="py-5">
              MedLink Smart is an innovative prototype based on the Internet of
              Things (IoT) designed to monitor and manage health data in
              real-time. This device uses MPX and MLX sensors to measure
              specific health parameters, such as pressure or temperature, which
              are then processed and stored in a server-based system. This data
              can be accessed through a web interface, allowing users, both
              healthcare professionals and patients, to obtain accurate and fast
              information. MedLink Smart aims to improve healthcare service
              efficiency, provide transparent data access, and support more
              timely medical decision-making.
            </p>
          </div>
        </motion.div>
        <div className="flex justify-center bg-gradient-to-r from-black/20 via-transparent to-black/20 py-10">
          <Carousel images={images} />
          {/* <ul className="flex w-fit h-fit whitespace-nowrap">
            {classes.map((item, index) => (
              <Class
                // key={`${item.name}-${index}`}
                // name={item.name}
                // desc={item.desc}
                image={item.image}
              />
            ))}
          </ul> */}
        </div>
      </motion.div>
    </section>
  );
};

export default About;
