import { Button } from "../ui/button";


const HeroSection = () => {
  
    return(
    <div className="min-h-[80vh] mx-auto w-full px-2 relative bg-cover bg-center">
        <video className="absolute inset-0 " autoPlay loop muted>
            <source src="/banner-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        <Button variant={'outline'} className="absolute bottom-4 left-4   font-semibold rounded ">
            Shop Now
        </Button>
    </div>
    )
    
};

export default HeroSection
;