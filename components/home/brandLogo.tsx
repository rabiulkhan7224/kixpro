import Image from "next/image";
import { Marquee } from "../ui/marquee";

const BrandLogo = () => {
  const logos = [
    { name: "essentials", image: "/FOG-LOGO.avif" },
{ name: "ASICS", image: "/ASICS-LOGO.png" },
    { name: "nick", image: "/nick-logo.png" },
    { name: "nick", image: "/nick-logo.png" },
    { name: "nick", image: "/nick-logo.png" },
    { name: "nick", image: "/nick-logo.png" },
    { name: "nick", image: "/nick-logo.png" },
  ];
  return (
  <div  className="relative flex w-full flex-col items-center justify-center overflow-hidden">
    <Marquee pauseOnHover className="[--duration:20s]">
        {logos.map((logo,index)=>(
            <div key={index}>
                <Image src={logo.image} alt={logo.name} height={60} width={100}/>
            </div>
        ))}
    </Marquee>
  </div>);
};

export default BrandLogo;
