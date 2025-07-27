import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 lg:px-8 xl:px-12">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Image src={"https://cdn.10minuteschool.com/images/svg/10mslogo-svg.svg"} alt="logo" height={1000} width={1000} className="w-full h-[27px]"/>
          </div>
        </div>
      </div>
    </nav>
  );
}
