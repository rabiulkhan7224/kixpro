import BrandCard from "@/components/home/brandCard";
import BrandLogo from "@/components/home/brandLogo";
import HeroSection from "@/components/home/heroSection";
import ProductSection from "@/components/home/productSection";
import Reviews from "@/components/home/Reviews";

export default function Home() {

  
  return (
    <div className="container mx-auto overflow-hidden">
      <HeroSection />
      <BrandCard />
      <ProductSection />
      <BrandLogo />
      <Reviews/>
    </div>
  );
}
