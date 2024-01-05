import React from "react";
import localFont from "next/font/local";
import Link from "next/link";
import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLink,
} from "react-icons/fa";
import Image from "next/image";

const myFont = localFont({ src: "../Vastago_Bold.otf" });
const myFont1 = localFont({ src: "../GraphikLight.otf" });

const Hero = () => {
  return (
    <div className=" text-black h-min-screen flex flex-col items-center justify-start  py-8 md:py-4">
      <div className="text-center md:w-full w-96 ">
        <h2
          className={`${myFont1.className} md:text-base text-sm text-[#2b257c] font-extrabold `}
        >
          CLEVER SOLUTIONS FOR YOUR DIGITAL PRODUCTS{" "}
        </h2>
        <h1
          className={`${myFont.className} text-4xl p-4 md:text-5xl md:m-4 m-2 `}
        >
          Turning Your{" "}
          <span className="bg-violet-950 text-white italic rounded-2xl px-2">
            Digital Products
          </span>{" "}
          Into{" "}
          <span className="md:bg-violet-950 text-black md:text-white  md:rounded-2xl italic underline px-2">
            NFTs
          </span>
        </h1>
        <p
          className={`${myFont1.className} md:text-lg text-sm m-2 md:m-0 font-semibold `}
        >
          Elevate your online presence and generate new revenue streams through{" "}
          <span className={`${myFont.className} italic underline `}>
            A Web 3.0 Solution
          </span>
          .
        </p>
        <div
          className={`${myFont.className} md:text-base text-sm text-[#090815] font-extrabold flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 m-4 md:m-8 `}
        >
          <h2>ROYALTIES</h2>
          <h2>SECURE TRANSACTIONS</h2>
          <h2>COPYRIGHT</h2>
          <h2>IMMUTABILITY</h2>
        </div>
        <div className="flex flex-row items-center justify-center text-2xl gap-6 m-2 text-[#090815] cursor-pointer ">
          <Link
            href="https://www.linkedin.com/in/soufiane-masad-2a8836286/"
            target="_blank"
          >
            <FaLinkedin className=" hover:scale-105 hover:text-violet-950" />
          </Link>
          <Link href="https://twitter.com/soufien_msd" target="_blank">
            <FaTwitter className=" hover:scale-105 hover:text-violet-950" />
          </Link>
          <Link href="https://www.facebook.com/souf.msd/" target="_blank">
            <FaFacebook className=" hover:scale-105 hover:text-violet-950" />
          </Link>
          <Link href="https://www.instagram.com/soufien.msd/" target="_blank">
            <FaInstagram className=" hover:scale-105 hover:text-violet-950" />
          </Link>
        </div>
        <div className="flex flex-row items-center justify-center">
          <Image src="/lpp.png" alt="image" width={300} height={300} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
