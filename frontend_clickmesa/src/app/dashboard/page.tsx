import InsiderHeader from "../../components/InsiderHeader";
import Sidebar from "../../components/Sidebar";

export default function Page() {
    return (
        <div className="min-h-screen">
            
            <div className="sticky top-0 z-10">
                <InsiderHeader />
            </div>

            <div className="flex pt-4">
                    {/* Sidebar Desktop */}
                    <div className="hidden sm:block w-64 flex-shrink-0">
                      <Sidebar />
                    </div>
            </div>
            
            
            
            
        </div>
    );
}