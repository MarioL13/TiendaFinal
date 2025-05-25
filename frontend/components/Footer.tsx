import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
      <footer className="bg-gray-100 text-gray-600 text-center lg:text-left">
        {/* Social Section */}
        <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center p-6 border-b border-gray-200">
          <div className="hidden lg:block">
            <span>Conéctate con nosotros. No te pierdas ninguna novedad, evento o sorpresa:</span>
          </div>
          <div className="flex justify-center space-x-6 mt-4 lg:mt-0">
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <Facebook />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <Instagram />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <Linkedin />
            </a>
          </div>
        </div>

        {/* Main Section */}
        <div className="container mx-auto py-10 px-6 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About Us */}
            <div>
              <h6 className="uppercase font-bold mb-4 text-purple-600">Rincón Del Friki</h6>
              <p>
                Tu tienda de confianza para juegos de mesa, cartas y productos frikis. Sumérgete en un mundo de aventuras, estrategia y diversión.
              </p>
            </div>

            {/* Enlaces útiles */}
            <div>
              <h6 className="uppercase font-bold mb-4">Enlaces útiles</h6>
              <ul>
                <li className="mb-2"><Link href="/" className="hover:text-gray-800">Inicio</Link></li>
                <li className="mb-2"><Link href="/tienda" className="hover:text-gray-800">Tienda</Link></li>
                <li className="mb-2"><Link href="/cartas" className="hover:text-gray-800">Cartas</Link></li>
              </ul>
            </div>

            {/* Información legal */}
            <div>
              <h6 className="uppercase font-bold mb-4">Información legal</h6>
              <ul>
                <li className="mb-2"><Link href="/privacidad" className="hover:text-gray-800">Política de privacidad</Link></li>
                <li className="mb-2"><Link href="/terminos" className="hover:text-gray-800">Términos y condiciones</Link></li>
                <li className="mb-2"><Link href="/cookies" className="hover:text-gray-800">Política de cookies</Link></li>
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
        <div className="text-center p-6 bg-gray-200">
          <p className="text-sm">
            © {new Date().getFullYear()} <span className="font-semibold">Rincón Del Friki</span>. Todos los derechos reservados.
          </p>
        </div>
      </footer>
  );
};

export default Footer;
