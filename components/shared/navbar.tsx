'use client'

import { Menu, SearchIcon, ShoppingCartIcon, User2 } from "lucide-react";
import { Input } from "../ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
const collection=[
    {
        name:"New Arrivals",
        link:'#',
    },
    {
        name:"New Sneakers",
        link:'#',
    },
    {
        name:"Apparel ",
        link:'#',
    },
    {
        name:"Accessories",
        link:'#',
    },
    {
        name:"Winter Sale",
        link:'#',
    },
       




    
]
const Navbar = () => {
    
    return (
        <section className="container mx-auto fixed top-0 z-50 right-0 left-0 gap-2 bg-background/95 px-4 py-2 shadow-md backdrop-blur ">
           
           <div className="flex items-center justify-between">
          
            {/* mobile view */}

              <Sheet >
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex items-center gap-2">
                      <img src={'/kix-pro.png'} className="h-8" alt="Logo" />
                      <span className="font-bold">Zaheen Knitwears</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

               
              </SheetContent>
            </Sheet>   


            {/* desktop view */}
        <nav className="flex lg:flex items-center justify-between w-full">

             {/* Search form */}
              <form  className="relative">
                <Input
                  
                  name="search"
                  className="peer h-8 ps-8 pe-2"
                  placeholder={'Search...'}
                  type="search"
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
                  <SearchIcon size={16} />
                </div>
              </form> 
                {/* logo */}
             <div className={`max-w-[250px]  w-full `}>
  <Image
    src="/kix-pro.png"
    alt="Kix Pro"
    width={300}
    height={80}
    className="w-full h-[50px] object-cover "
  />
</div>
        {/*  */}
        <div className="flex item-center justify-between">
<User2 size={24}/>
<ShoppingCartIcon size={24}/>


        </div>
        

        </nav>
          
           </div>

        </section>
    );
};

export default Navbar;