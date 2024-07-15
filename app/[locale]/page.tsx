import NavigationContainer from "@/components/banner/navigationContainer";
import Image from "next/image";

export default async function Home() {
    return (
        <div className="flex flex-col h-screen">
            <div className="grid grid-rows-[1fr_4fr] grid-cols-1 md:grid-rows-1 md:grid-cols-[2fr_3fr] h-full p-1">
                <div className="flex items-start justify-center order-2 md:order-1 md:items-center">
                    <NavigationContainer />
                </div>
                <div className="flex items-center justify-center">
                    <h1 className="text-4xl text-center font-semibold text-white">Etsi junamatkoja</h1>
                </div>
            </div>
            <div className="absolute -z-10 w-full h-full items-center">
                <Image
                    src="/tapio-haaja-zEQBpRm9iJA-unsplash.jpg"
                    fill
                    style={{ objectFit: 'cover' }}
                    alt="Banner"
                    priority={true}
                    quality={80}
                    sizes="(max-width: 600px) 600px, 
                   (max-width: 1200px) 1400px, 
                   1800px"
                    className="drop-shadow-lg"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 to-transparent"></div>
            </div>
        </div>

    );
}