import { BackgroundImage } from "@mantine/core";

// main Image
import mainImage from "../../assets/mainImage.webp";

export default function Dashboard() {
  return (
    <div className="h-full ">
      <BackgroundImage src={mainImage} h={"100%"} content="center">
        <div className=" h-full flex flex-col pt-40  items-center px-4 lg:px-12  text-white gap-8">
          <div>
            <h1 className="text-[#84fc03] uppercase font-Montserrat font-bold text-[24px] md:text-[32px] lg:text-[36px] xl:text-[40px] 2xl:text-[46px] ">
              WELCOME BACK
            </h1>
          </div>
        </div>
      </BackgroundImage>
    </div>
  );
}
