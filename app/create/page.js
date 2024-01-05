"use client";
import React, { useState } from "react";

import FormData from "form-data";
import axios from "axios";

import { ethers, utils } from "ethers";

import digitalProduct from "../digitalProduct.json";

import { useAddress, useSigner } from "@thirdweb-dev/react";

import Loading from "react-loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NFTForm = () => {
  const API_KEY = "0c61222bc1ea3c068ab4";
  const API_SECRET =
    "ad8d7ccf60595dc5af6149eac18b1f6556a64f61bcf82c27903d2761e3a472b2";

  const userAddress = useAddress();
  const signer = useSigner();

  // the endpoint needed to upload the file
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  const [metadata, setMetadata] = useState({
    name: "",
    description: "",
    image: "",
    attributes: [],
  });

  const [price, setPrice] = useState(0);
  const [productIsUploading, setProductIsUploading] = useState(false);
  const [productIsMinting, setProductIsMinting] = useState(false);
  const [metadataUri, setMetadataUri] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMetadata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    e.preventDefault();
    setProductIsUploading(true);
    try {
      const file = e.target.files[0];
      console.log("filename:", file.name);
      // initialize the form data
      const formData = new FormData();

      // append the file form data to
      formData.append("file", file);

      const response = await axios.post(url, formData, {
        maxContentLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data;boundary=${formData._boundary}`,
          pinata_api_key: API_KEY,
          pinata_secret_api_key: API_SECRET,
        },
      });

      console.log(`https://ipfs.io/ipfs/${response.data.IpfsHash}`);

      setMetadata((prevData) => ({
        ...prevData,
        image: `https://ipfs.io/ipfs/${response.data.IpfsHash}`,
      }));
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
    setProductIsUploading(false);
  };

  const handleAttributeChange = (index, attribute) => {
    setMetadata((prevData) => {
      const newAttributes = [...prevData.attributes];
      newAttributes[index] = attribute;
      return {
        ...prevData,
        attributes: newAttributes,
      };
    });
  };

  const handleAddAttribute = () => {
    setMetadata((prevData) => ({
      ...prevData,
      attributes: [...prevData.attributes, { trait_type: "", value: "" }],
    }));
  };

  const handleRemoveAttribute = (index) => {
    setMetadata((prevData) => {
      const newAttributes = [...prevData.attributes];
      newAttributes.splice(index, 1);
      return {
        ...prevData,
        attributes: newAttributes,
      };
    });
  };

  const handlePrice = (e) => {
    console.log(e.target.value);
    const weiValue = utils.parseUnits(e.target.value.toString(), "ether");
    console.log(weiValue);
    setPrice(weiValue);
  };

  async function metadataToIpfs() {
    try {
      // Convert the metadata object to a JSON string
      const metadataJSON = JSON.stringify(metadata);

      // Convert the JSON string to a Blob
      const metadataBlob = new Blob([metadataJSON], {
        type: "application/json",
      });

      // Create FormData and append the metadata Blob
      const formData = new FormData();
      formData.append("file", metadataBlob, "metadata.json");

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: API_KEY,
          pinata_secret_api_key: API_SECRET,
        },
      });

      console.log("metadata", `https://ipfs.io/ipfs/${response.data.IpfsHash}`);
      setMetadataUri(`https://ipfs.io/ipfs/${response.data.IpfsHash}`);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast("Upload failed!", { type: "error" });
    }
  }

  async function listItem() {
    console.log(JSON.stringify(metadata));
    metadataToIpfs();
    setProductIsMinting(true);
    try {
      const contract = new ethers.Contract(
        digitalProduct.address,
        digitalProduct.abi,
        signer
      );
      const transaction = await contract.listItem(metadataUri, price);
      await transaction.wait();
      console.log(transaction);

      toast("Product Minted on Blockchain successfully !", {
        type: "success",
      });
    } catch (error) {
      console.log(error);
    }
    setProductIsMinting(false);
  }

  return (
    <div className="max-w-md mx-auto mt-2">
      <ToastContainer />
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={metadata.name}
          onChange={handleChange}
          className="border rounded w-full py-2 px-3"
          required
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={metadata.description}
          onChange={handleChange}
          className="border rounded w-full py-2 px-3"
          required
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="price"
        >
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          onChange={handlePrice}
          className="border rounded w-full py-2 px-3"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Attributes
        </label>
        {metadata.attributes.map((attribute, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={attribute.trait_type}
              onChange={(e) =>
                handleAttributeChange(index, {
                  ...attribute,
                  trait_type: e.target.value,
                })
              }
              className="border rounded w-full py-2 px-3 mr-2"
              placeholder={`Trait ${index + 1} Type`}
              required
            />
            <input
              type="text"
              value={attribute.value}
              onChange={(e) =>
                handleAttributeChange(index, {
                  ...attribute,
                  value: e.target.value,
                })
              }
              className="border rounded w-full py-2 px-3"
              placeholder={`Trait ${index + 1} Value`}
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveAttribute(index)}
              className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddAttribute}
          className="bg-violet-950 text-white py-2 px-4 rounded-md hover:bg-violet-900"
        >
          Add Attribute
        </button>
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="image"
        >
          Upload your product (PDF,PNG,...)
        </label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleImageChange}
          className="border rounded w-full py-2 px-3"
          required
        />
        {productIsUploading && (
          <div className="mt-2 flex justify-center">
            <Loading type="spin" color="black" height={25} width={25} />
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center items-center gap-4">
        <button
          onClick={listItem}
          className="bg-violet-950 text-white py-2 px-4 rounded hover:bg-violet-900"
        >
          List Product
        </button>
        {productIsMinting && (
          <div className="mt-2 flex justify-center">
            <Loading type="spin" color="black" height={20} width={20} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTForm;
