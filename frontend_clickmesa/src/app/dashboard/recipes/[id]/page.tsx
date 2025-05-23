
import InsiderHeader from "@/app/components/InsiderHeader";
import Sidebar from "@/app/components/Sidebar";

export default function Page(){
    return (
        <div className="min-h-screen">

            <div className="sticky top-0 z-10">
                <InsiderHeader />
            </div>

            <div className="flex pt-16">

                <Sidebar />

                <main className="ml-64 flex-1 p-4">
                    
                </main>

            </div>
        </div>
        
    );
}