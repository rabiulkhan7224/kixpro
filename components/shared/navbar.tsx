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
import { getUser, logout } from "@/lib/actions/auth";
import UserDropdown from "./user-dropdown";
const collection = [
  {
    name: "New Arrivals",
    link: "#",
  },
  {
    name: "Best Sellers",
    link: "#",
  },
  {
    name: "Sneakers ",
    link: "#",
  },
  {
    name: "Apparel ",
    link: "#",
  },
  {
    name: "Accessories",
    link: "#",
  },
  {
    name: "Winter Sale",
    link: "#",
  },
];
export default async function Navbar() {
  const user = await getUser();

  return (
    <section className="container mx-auto fixed top-0 z-50 right-0 left-0 gap-2 bg-background/95 px-4 py-1 shadow-md backdrop-blur ">
      <div className="flex items-center justify-between">
        {/* mobile view */}

        <Sheet>
          <SheetTrigger className="block lg:hidden" asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SheetHeader>
              <SheetTitle>
                <Link href="/" className="flex items-center gap-2">
                  <img src={"/kix-pro.png"} className="h-8" alt="Logo" />
                  {/* <span className="font-bold">KIX PRO</span> */}
                </Link>
              </SheetTitle>
            </SheetHeader>
            {/* collection */}
            {collection.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className="text-sm hover:underline block py-2"
              >
                {item.name}
              </Link>
            ))}

            {!user && (
              <Link
                href="/login"
                className="text-sm hover:underline block py-2 font-medium"
              >
                Login
              </Link>
            )}
          </SheetContent>
        </Sheet>

        {/* desktop view */}
        <nav className="flex lg:flex items-center justify-between w-full">
          {/* Search form */}
          <form className="relative">
            <Input
              name="search"
              className="peer h-8 ps-8 pe-2"
              placeholder={"Search..."}
              type="search"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
          </form>
          {/* logo */}
          <div className="max-w-62.5 w-full">
            <Image
              src="/kix-pro.png"
              alt="Kix Pro"
              width={300}
              height={80}
              className="w-full h-12.5 object-cover"
            />
          </div>

          {/*  */}
          <div className="flex items-center justify-between gap-2">
            {user ? (
              <UserDropdown
                user={user}
                userLogOut={logout}
                defaultOpen={false}
                trigger={
                  <div className="rounded-full border border-input bg-muted p-1.5 cursor-pointer">
                    <User2 className="h-5 w-5" />
                  </div>
                }
              />
            ) : (
              <>
                <Link href="/login" className="hidden lg:inline-flex">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/login" className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <User2 className="h-5 w-5" />
                  </Button>
                </Link>
              </>
            )}
            <ShoppingCartIcon size={24} />
          </div>
        </nav>
      </div>

      <div className="flex items-center justify-center">
        <div className="hidden lg:flex  gap-4">
          {collection.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              className="text-sm hover:underline"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
