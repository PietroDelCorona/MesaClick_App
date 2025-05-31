
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
    return(
        <footer className="bg-gray-100 py-8">
            <div className="container mx-auto px-4 text-center">
                <div className="flex justify-center space-x-6 mb-4">
                    <Link href="/" className="text-gray-600 hover:text-orange-500">Termos de Uso</Link>
                    <Link href="/" className="text-gray-600 hover:text-orange-500">Privacidade</Link>
                </div>
                <div className="flex justify-center space-x-4">
                    <a href="#"><FaFacebook className="text-gray-500 hover:text-orange-500" /></a>
                    <a href="#"><FaInstagram className="text-gray-500 hover:text-orange-500" /></a>
                    <a href="#"><FaTwitter className="text-gray-500 hover:text-orange-500" /></a>
                </div>
            </div>

        </footer>
    );
}