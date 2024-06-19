import NavigationContainer from "@/components/banner/navigationContainer";

export default async function Home() {
    return (
        <div className="flex flex-col flex-grow gap-8 max-w-3xl">
            <NavigationContainer></NavigationContainer>
        </div>
    );
}