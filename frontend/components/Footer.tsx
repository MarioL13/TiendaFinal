import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 body-font">
      <div className="container mx-auto px-5 py-16 overflow-x-auto">
        {/* Section Links */}
        <div className="flex flex-wrap justify-between mb-8 min-w-[350px]">
          <div className="w-1/2 md:w-1/4 px-4 mb-6">
            <h2 className="text-white font-semibold tracking-wider text-sm mb-3">CATEGORIES</h2>
            <ul className="list-none">
              <li><Link href="/" className="hover:text-white">First Link</Link></li>
              <li><Link href="/" className="hover:text-white">Second Link</Link></li>
              <li><Link href="/" className="hover:text-white">Third Link</Link></li>
              <li><Link href="/" className="hover:text-white">Fourth Link</Link></li>
            </ul>
          </div>
          <div className="w-1/2 md:w-1/4 px-4 mb-6">
            <h2 className="text-white font-semibold tracking-wider text-sm mb-3">ABOUT US</h2>
            <ul className="list-none">
              <li><Link href="/" className="hover:text-white">Our Story</Link></li>
              <li><Link href="/" className="hover:text-white">Team</Link></li>
              <li><Link href="/" className="hover:text-white">Careers</Link></li>
              <li><Link href="/" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="flex flex-wrap items-center border-t border-gray-800 pt-8">
          <div className="w-full md:w-2/3">
            <p className="text-sm mb-4 md:mb-0">
              Subscribe to our newsletter to stay updated with our latest news and offers.
            </p>
          </div>
          <div className="w-full md:w-1/3">
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-grow bg-gray-800 text-gray-200 px-4 py-2 rounded-l border border-gray-700 focus:outline-none focus:border-purple-500"
              />
              <button className="bg-purple-500 text-white px-6 py-2 rounded-r hover:bg-purple-600">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gray-800">
        <div className="container mx-auto py-4 px-5 flex flex-wrap items-center justify-between">
          <p className="text-sm">
            © 2025 Ingenio - All rights reserved
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
              </svg>
            </a>
            <a href="#" className="hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.94 4.06a9.94 9.94 0 10-11.88 11.88A10.94 10.94 0 0022 12a10.94 10.94 0 00-1.06-7.94zm-6.59 13.36h-4.7l.92-3.64H8.76V8.8h1.81l1.2-3.44h2.6l-1.16 3.44h2.92l-1.2 3.6H14l-.65 3.62z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
