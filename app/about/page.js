// components/About.js
import React from "react";
import { FaUsers, FaGem, FaCogs } from "react-icons/fa";

const Feature = ({ icon, title, description }) => (
  <div className="flex flex-col items-center">
    {icon}
    <h3 className="text-xl font-semibold mt-4">{title}</h3>
    <p className="text-gray-600 text-center mt-2">{description}</p>
  </div>
);

const About = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center m-8 py-8">
        <h1 className="text-3xl md:text-5xl font-bold mb-8">How it works ?</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Feature
            icon={<FaUsers size={40} />}
            title="Decentralized"
            description="DIGIFTI operates on a decentralized network, ensuring security and transparency."
          />
          <Feature
            icon={<FaGem size={40} />}
            title="NFT Integration"
            description="Turn your digital products into unique NFTs, providing authenticity and ownership."
          />
          <Feature
            icon={<FaCogs size={40} />}
            title="User-friendly"
            description="Enjoy a seamless experience with our user-friendly interface and intuitive design."
          />
        </div>
      </div>
    </div>
  );
};

export default About;
