import Link from "next/link";
import Image from "next/image";

const CollectionsPage = () => {
  const collections = [
    { id: 1, name: "Adidas", slug: "adidas", image: "/ADIDAS-HEADER.webp" },
    { id: 2, name: "Essentials", slug: "essentials", image: "/ACCESSORIES.webp" },
    { id: 3, name: "Nike", slug: "nike", image: "/jorden.jpeg" },
    { id: 4, name: "Asics", slug: "asics", image: "/air-jordan-3-retro-multi-camo-DO.webp" },
    { id: 5, name: "Cleens", slug: "cleens", image: "/cleens.png" },
    { id: 6, name: "Denim Tears", slug: "denim-tears", image: "/denim-tears.png" },
    { id: 7, name: "New Balance", slug: "new-balance", image: "/new-balance.png" },
    { id: 8, name: "Jordan", slug: "jordan", image: "/air-jordan-4-retro-red.webp" },
    { id: 9, name: "Samuel Bailey", slug: "samuel-bailey", image: "/samuel-bailey.png" },
    { id: 10, name: "Yeezy", slug: "yeezy", image: "/yeezy.png" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-16 bg-white">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter ">
          All Collections
        </h1>
        
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {collections.map((item) => (
          <div key={item.id} className="group flex flex-col space-y-4">
            {/* Image Container with Hover Effect */}
            <Link href={`/collections/${item.slug}`} className="relative aspect-[1/1] overflow-hidden rounded-sm bg-[#F5F5F3]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            {/* Brand Title */}
            <div className="flex justify-between items-center px-1">
              <Link href={`/collections/${item.slug}`}>
                <h2 className="text-lg font-bold uppercase tracking-tight group-hover:underline underline-offset-4 decoration-2">
                  {item.name}
                </h2>
              </Link>
              <span className="text-md font-bold text-black">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionsPage;