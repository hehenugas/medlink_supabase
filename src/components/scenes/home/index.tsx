import { SelectedPage } from "@/utils/types";
import ActionButton from "@/components/ActionButton";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { motion } from "framer-motion";

type Props = {
  setSelectedPage: (value: SelectedPage) => void;
};

const Home = ({ setSelectedPage }: Props) => {
  return (
    <section id="home" className="gap-16 bg-gray-20 py-10 md:h-full md:pb-0">
      <motion.div
        className="mx-auto w-5/6 items-center justify-center md:flex md:h-5/6"
        onViewportEnter={() => setSelectedPage(SelectedPage.Home)}
      >
        <div className="z-10 mt-32 md:basis-3/5">
          <motion.div
            className="md:-mt-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <div className="relative">
              <div className="before:absolute before:-top-20 before:-left-20 before:z-[-1] md:before:content-evolvetext">
                <img alt="home-page-text" src={"/HomePageText.png"} />
              </div>
            </div>
            <p className="mt-8 text-sm">
              Our Product offers an efficiency that brings together various
              healtcare services, such as medical records, doctor consultations,
              medication ordering and treatment reminder.
            </p>
          </motion.div>
          <motion.div
            className="mt-8 flex items-center gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <ActionButton setSelectedPage={setSelectedPage}>
              Read More
            </ActionButton>
            <AnchorLink
              className="text-sm font-bold hover:underline hover:text-secondary-500 transition duration-300"
              onClick={() => setSelectedPage(SelectedPage.Team)}
              href={`#${SelectedPage.Team}`}
            >
              <p>Learn More</p>
            </AnchorLink>
          </motion.div>
        </div>
        <div
          className="flex basis-3/5 justify-center md:z-10
          md:ml-40 md:mt-16 md:justify-items-end"
        >
          <img alt="home-pageGraphic" src={"/HomePageGraphic.jpg"} />
        </div>
      </motion.div>
    </section>
  );
};

export default Home;
