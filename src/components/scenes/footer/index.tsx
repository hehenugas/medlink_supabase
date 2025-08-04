const Footer = () => {
  return (
    <footer className="bg-teal-400">
      <div className="justify-content mx-auto gap-16 md:flex px-16 pt-12">
        <div className="flex-1 w-full">
          <div className="flex flex-col w-auto">
            <div>
              <img alt="logo" src={"/assets/Logo/medlink.png"} className="h-10 w-13" />
              <p className="font-montserrat block text-xl font-bold">
                MedLink
              </p>
            </div>
            <p className="my-5 max-w-[100%][3000px]">
              Our research successfully developed MedLink Smart, an Internet of medical things (IoMT) system that integrates MPX5050DP
              (blood pressure measurement), MLX90614 (body temperature measurement), ammd GY-MAX30102 (oxygen saturation and heart rate
              measurement) sensors with ESP32 module for automation in the healthcare sector.
            </p>
          </div>

        </div>
        {/* <div className="md:mt-0 w-full flex-1 flex flex-col">

        </div> */}

        <div className="w-64 flex flex-col mb:items-end mb-10">
          <div>
            <h4 className="font-bold mb-5">Contact Us</h4>
            <p className="mb:my-5 ">Muhammad Akmal Indratma.</p>
            <p>+62 82157749916</p>
          </div>
        </div>

      </div>
      <div className="px-16 pb-10">
        <p>© MedLink Smart All Rights Reserved.</p>
        <p className="mt-2 font-bold">Sponsorship</p>
        <div className="flex gap-4">
          <img className="h-12" src={"/assets/dynatech logo.png"}/>
          <img className="h-12" src={"/assets/ptskajaya.png"}/>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
