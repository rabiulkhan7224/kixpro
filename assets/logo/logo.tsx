import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center gap-2.5">
      {/* Logo image */}
      <Image
        src="/kix-pro.png"
        alt="KixPro Logo"
        width={32}
        height={32}
        className="rounded-full"
      />
      {/* Logo text */}
      <span className="text-lg font-bold text-foreground">KixPro</span>
    </div>
  );
};

export default Logo;
