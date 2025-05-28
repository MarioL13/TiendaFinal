import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
      <footer className="bg-[#97DF4D] text-[#FBFEF9] text-center lg:text-left">
        {/* Social Section */}
        <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center p-6 border-b border-[#5D008F]">
          <div className="hidden lg:block">
            <span>Conéctate con nosotros. No te pierdas ninguna novedad, evento o sorpresa:</span>
          </div>
          <div className="flex justify-center space-x-6 mt-4 lg:mt-0">
            <a href="#" className="text-[#FBFEF9] hover:text-[#5D008F]">
              <Facebook />
            </a>
            <a href="#" className="text-[#FBFEF9] hover:text-[#5D008F]">
              <Instagram />
            </a>
            <a href="#" className="text-[#FBFEF9] hover:text-[#5D008F]">
              <Linkedin />
            </a>
          </div>
        </div>

        {/* Main Section */}
        <div className="container mx-auto py-10 px-6 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About Us */}
            <div>
              <h6 className="uppercase font-bold mb-4 text-[#5D008F]">Rincón Del Friki</h6>
              <p>
                Tu tienda de confianza para juegos de mesa, cartas y productos frikis. Sumérgete en un mundo de aventuras, estrategia y diversión.
              </p>
            </div>

            {/* Enlaces útiles */}
            <div>
              <h6 className="uppercase font-bold mb-4">Enlaces útiles</h6>
              <ul>
<<<<<<< HEAD
                <li className="mb-2"><Link href="/" className="hover:text-[#5D008F]">Inicio</Link></li>
                <li className="mb-2"><Link href="/tienda" className="hover:text-[#5D008F]">Tienda</Link></li>
                <li className="mb-2"><Link href="/cartas" className="hover:text-[#5D008F]">Cartas</Link></li>
=======
                <li className="mb-2"><Link href="/" className="hover:text-gray-800">Inicio</Link></li>
                <li className="mb-2"><Link href="/tienda" className="hover:text-gray-800">Tienda</Link></li>
                <li className="mb-2"><Link href="/Cartas" className="hover:text-gray-800">Cartas</Link></li>
>>>>>>> 19ac19790130306c258fe5a552d440dfb5b8a617
              </ul>
            </div>

            {/* Información legal */}
            <div>
              <h6 className="uppercase font-bold mb-4">Información legal</h6>
              <ul>
<<<<<<< HEAD
                <li className="mb-2"><Link href="/privacidad" className="hover:text-[#5D008F]">Política de privacidad</Link></li>
                <li className="mb-2"><Link href="/terminos" className="hover:text-[#5D008F]">Términos y condiciones</Link></li>
                <li className="mb-2"><Link href="/cookies" className="hover:text-[#5D008F]">Política de cookies</Link></li>
=======
                <li className="mb-2"><Link href="#" className="hover:text-gray-800">Política de privacidad</Link></li>
                <li className="mb-2"><Link href="#" className="hover:text-gray-800">Términos y condiciones</Link></li>
                <li className="mb-2"><Link href="#" className="hover:text-gray-800">Política de cookies</Link></li>
>>>>>>> 19ac19790130306c258fe5a552d440dfb5b8a617
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h6 className="uppercase font-bold mb-4">Contacto</h6>
              <p className="mb-2"> Av. Onze de Setembre, 62, 08208 Sabadell, Barcelona</p>
              <p className="mb-2">hola@rincondelfriki.com</p>
              <p className="mb-2">937 16 71 32</p>
              <p>Lunes a Sabado: 10:00 - 20:00</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center p-6 bg-[#5D008F] text-[#FBFEF9]">
          <p className="text-sm">
            © {new Date().getFullYear()} <span className="font-semibold">Rincón Del Friki</span>. Todos los derechos reservados.
          </p>
        </div>
      </footer>
  );
};

export default Footer;
