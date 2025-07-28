import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const handleClick = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer
      className="relative  border-t py-12"
      // bg-[#fcf8ed]
      id="contact"
      style={{
        backgroundImage:
          "url('https://source.unsplash.com/1600x900/?food,restaurant')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          {/* Logo and Tagline */}
          <div className="text-center md:text-left">
            <Link
              to="/"
              className="flex items-center justify-center md:justify-start transform hover:scale-105 transition-transform duration-300"
            >
              <h1 className="text-5xl font-bold">
                <span className="text-orange-500">Food</span>
                <span className="text-[#a32424]">yy</span>
              </h1>
            </Link>
            <p className="mt-2 text-gray-600 italic">
              Savor the flavors of delight
            </p>
          </div>

          {/* Navigation Links - Updated to match navbar sections */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
            {[
              {
                title: "Explore",
                links: [
                  { name: "Home", section: "home" },
                  { name: "Menu", section: "goslider" },
                  { name: "Contact", section: "contact" },
                  { name: "Service", section: "services" },
                ],
              },
              {
                title: "Quick Links",
                links: [
                  { name: "Restaurant Deals", section: "resnav" },
                  { name: "Food Types", section: "goslider" },
                  { name: "Delivery Options", section: "#" },
                ],
              },
              {
                title: "Contact Us",
                links: [{ name: "support@foodyy.com", section: "contact" }],
              },
            ].map((section, index) => (
              <div key={index}>
                <h2 className="mb-4 text-sm font-semibold text-gray-700 uppercase tracking-wider border-b-2 pb-2 border-orange-400 inline-block">
                  {section.title}
                </h2>
                <ul className="text-gray-500 font-medium space-y-2">
                  {section.links.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        to="/"
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick(link.section);
                        }}
                        className="hover:text-[#f5896b] transition-colors duration-300 relative inline-block after:block after:h-0.5 after:w-full after:bg-[#f5896b] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 border-t pt-8 text-gray-500">
          <span className="text-sm mb-4 md:mb-0">
            © 2025 Foodyy. All Rights Reserved.
          </span>
          <div className="flex space-x-6">
            {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube].map(
              (Icon, index) => (
                <Link
                  to="#"
                  key={index}
                  className="bg-[#f5896b] text-white p-3 rounded-full transition-transform duration-300 transform hover:scale-110 hover:bg-orange-400 shadow-md"
                >
                  <Icon />
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}