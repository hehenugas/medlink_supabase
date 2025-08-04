import { SelectedPage } from "@/utils/types";
import AnchorLink from "react-anchor-link-smooth-scroll";

type Props = {
  page: string;
  selectedPage: SelectedPage;
  setSelectedPage: (value: SelectedPage) => void;
  isTopOfPage: boolean;
};

const Link = ({ page, selectedPage, setSelectedPage, isTopOfPage }: Props) => {
  const lowerCasePage = page.toLowerCase().replace(/ /g, "") as SelectedPage;
  return (
    <AnchorLink
      className={`${
        isTopOfPage ? "text-teal-500" : ""
      } transition duration-500 hover:text-red-100`}
      href={`#${lowerCasePage}`}
      onClick={() => setSelectedPage(lowerCasePage)}
    >
      {page}
      {selectedPage === lowerCasePage && <div className={`${isTopOfPage ? "bg-teal-500" : "bg-white"} w-full h-0.5 rounded-full`}></div>}

    </AnchorLink>
  );
};

export default Link;
