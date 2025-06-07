
import InsiderHeader from "@/components/InsiderHeader";
import Sidebar from "@/components/Sidebar";


export default function Page() {
    return(
        <div className="min-h-screen">
            <InsiderHeader />

            <div className="flex pt-4">
                <div className="hidden sm:block">
                    <Sidebar />
                </div>

                <main className="flex-1 p-4 sm:ml-64">
                    <div className="space-y-4">
                        <h1 className="text-4xl text-orange-600 text-center mt-2">
                            Agenda
                        </h1>
                    </div>
                </main>
            </div>

        </div>
    );

}