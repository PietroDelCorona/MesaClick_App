
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function LandingPage(){
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow"></main>
            <Footer />
        </div>
    
    );
}