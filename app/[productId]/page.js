"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
// Import the JSON data for the contract and other configurations
import digitalProduct from "../digitalProduct.json";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import Loading from "react-loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Use lowercase for the function name, as per conventions
const Page = ({ params }) => {
  const userAddress = useAddress();
  const signer = useSigner();
  // Use object destructuring to initialize item state
  const [item, setItem] = useState({});
  // Use camelCase for variable names, and avoid using global arrays
  const [metadata, setMetadata] = useState(null);

  const [purchase, setPurchase] = useState(false);

  // Fetch product details and metadata
  async function fetchProduct() {
    try {
      // Initialize the provider and contract instances
      const provider = new ethers.providers.AlchemyProvider(
        "maticmum",
        "mrvXire3FFkkoWo_HFHsBmRpJDRh1snd"
      );

      const contract = new ethers.Contract(
        digitalProduct.address,
        digitalProduct.abi,
        provider
      );

      // Fetch product details from the blockchain
      const product = await contract.itemMapping(params.productId);
      console.log("product", product);
      setItem(product);

      // Fetch metadata using Axios
      const metadataResponse = await axios.get(product[2]);
      console.log("product metadata", metadataResponse.data);
      setMetadata(metadataResponse.data);
    } catch (error) {
      console.error(error);
    }
  }

  const weiToEth = (valueInWei) => {
    const valueInBN = ethers.BigNumber.from(valueInWei);
    const valueInEth = ethers.utils.formatEther(valueInBN);
    return valueInEth;
  };

  async function buyItem() {
    setPurchase(true);
    try {
      const contract = new ethers.Contract(
        digitalProduct.address,
        digitalProduct.abi,
        signer
      );
      const transaction = await contract.buyItem(params.productId, {
        value: item[3],
      });
      await transaction.wait();
      console.log(transaction);

      toast("Successful Purchase!", {
        type: "success",
      });
    } catch (error) {
      console.log(error);
    }
    setPurchase(false);
  }

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <>
      <ToastContainer />
      {metadata && (
        <div className="flex flex-col gap-4  m-4 justify-center items-center">
          <div className="flex flex-row  md:p-12 w-full bg-yellow-50 gap-8 m-6 border-double border-2 border-violet-900 p-4 lg:p-8 rounded-lg ">
            <div className="flex flex-col items-start justify-start gap-2 ">
              <h2 className="font-bold">Product Id : {params.productId}</h2>
              <img
                src="/animate.webp"
                alt={params.productId}
                className="md:w-96 md:h-96 w-48 h-48  mb-4 rounded-md"
              />
            </div>
            <div className=" flex flex-col gap-2 text-violet-950 p-4">
              <h1 className="font-bold text-xl md:text-3xl">{metadata.name}</h1>
              <h2 className="font-bold text-md md:text-2xl">
                {metadata.description}
              </h2>
              <h3 className="font-bold text-md md:text-xl ">
                <span className="bg-violet-950 text-slate-100 p-2 rounded-lg">
                  Price : {weiToEth(item[3].toString())} MATIC
                </span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
                {metadata.attributes &&
                  metadata.attributes.map((attribute, index) => (
                    <div key={index} className="text-violet-950">
                      <span className="font-bold">{attribute.trait_type}:</span>{" "}
                      {attribute.value}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <button
              onClick={buyItem}
              className="bg-violet-950 text-white py-2 px-4 rounded hover:bg-violet-900"
            >
              Buy Now
            </button>
            {purchase && (
              <div className="mt-2 flex justify-center">
                <Loading type="spin" color="black" height={20} width={20} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
