"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";
import Link from "next/link";

import digitalProduct from "../digitalProduct.json";

const Explore = () => {
  const [products, setProducts] = useState([]);
  const [metadata, setMetadata] = useState();

  async function fetchProducts() {
    try {
      const provider = new ethers.providers.AlchemyProvider(
        "maticmum",
        "mrvXire3FFkkoWo_HFHsBmRpJDRh1snd"
      );

      const contract = new ethers.Contract(
        digitalProduct.address,
        digitalProduct.abi,
        provider
      );
      const data = await contract.getListedItems();
      console.log(data);
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  }

  const weiToEth = (valueInWei) => {
    const valueInBN = ethers.BigNumber.from(valueInWei);
    const valueInEth = ethers.utils.formatEther(valueInBN);
    return valueInEth;
  };

  const fetchMetadata = async () => {
    try {
      const response = await axios.get(
        "https://ipfs.io/ipfs/QmQYedBFsDCeyjb8vHeTJbwHz3AEwq13Zxfa2bVizJLKSq"
      );
      console.log(response.data);
      setMetadata(response.data); // Assuming metadata is in JSON format
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-4xl font-bold mb-8">Explore NFTs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((nft, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <img
              src="/animate.webp"
              alt={`product_${nft[0].toString()}`}
              className="w-full h-48 object-cover mb-4 rounded-md"
            />
            <h2 className="text-xl font-bold mb-2">
              Product Id : {nft[0].toString()}
            </h2>

            <div className="flex justify-between items-center">
              <span className="text-gray-800">
                {weiToEth(nft[3].toString())} MATIC
              </span>
              <Link href={nft[0].toString()} target="_blank">
                <button
                  onClick={fetchMetadata}
                  className="bg-violet-950 text-white py-2 px-4 rounded hover:bg-violet-900"
                >
                  Buy Now
                </button>
              </Link>
            </div>
            <div className="mt-4">
              Owned by : {nft[1].slice(0, 7)}....{nft[1].slice(-7)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
