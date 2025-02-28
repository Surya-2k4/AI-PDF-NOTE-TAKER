"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {  useUser } from "@clerk/nextjs"; // Import useUser
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { motion } from 'framer-motion';
import Link from 'next/link';


export default function Home() {
  const { user } = useUser(); // Use useUser hook
  const createUser = useMutation(api.user.createUser);

  const [showFeatures, setShowFeatures] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);

  useEffect(() => {
    user && CheckUser();
  }, [user]);

  const CheckUser = async () => {
    const result = await createUser({
      email: user?.primaryEmailAddress?.emailAddress,
      imageUrl: user?.imageUrl,
      userName: user?.fullName // Changed userName to name
    });

    console.log(result);
  };

  return (
    <div className=" min-h-screen flex flex-col overflow-hidden  bg-gradient-to-b from-blue-200 via-red-200 to-white backdrop-blur-2xl"> {/* Corrected overflow */}
     
      {/* Header Bar */}
      <header className="fixed top-0 left-0 w-full bg-transparent z-50 px-6 py-4 flex justify-between items-center">

        <Image src={'/homeLogo.png'} alt='logo' width={140} height={100} className="cursor-pointer" />
        <nav className="hidden md:flex gap-6">
        
<nav className="hidden md:flex gap-6">
  <button className="text-gray-700 hover:text-black transition-all duration-200 text-sm md:text-base lg:text-lg px-4 py-2 md:px-6 md:py-3 rounded-md md:rounded-lg" onClick={() => setShowFeatures(!showFeatures)}>
    Features
  </button>
  <button className="text-gray-700 hover:text-black transition-all duration-200 text-sm md:text-base lg:text-lg px-4 py-2 md:px-6 md:py-3 rounded-md md:rounded-lg" onClick={() => setShowSolutions(!showSolutions)}>
    Solutions
  </button>
</nav>
        </nav>
        <Link href="/dashboard">
          <button className="bg-black text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-800 transition">Get Started</button>
        </Link>
      </header>
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl px-6 mt-24 mx-auto text-center">
        {/* Hero Section */}
        <motion.h2 className="text-5xl font-extrabold leading-tight"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          Simplify <span className="text-red-500">PDF</span> <span className="text-blue-500">Note</span>-Taking with AI-Powered
        </motion.h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
          Elevate your note-taking experience with our AI-powered PDF app. Seamlessly extract key insights, summaries, and annotations from any PDF with just a few clicks.
        </p>
        <motion.div className="mt-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}>
           <Link href="/dashboard">
            <button className="bg-black text-white px-6 py-3 rounded-xl shadow-md hover:bg-gray-900 transition">
              Get Started
            </button>
          </Link>
        </motion.div>
        </div>
       {/* Features Section */}
       {showFeatures && (
        <motion.section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}>
          <FeatureCard title="AI-Powered Summaries" description="Automatically generate summaries from your PDFs." />
          <FeatureCard title="Smart Annotations" description="Highlight and annotate key points with ease." />
          <FeatureCard title="Seamless Integration" description="Integrate with your favorite tools and platforms." />
        </motion.section>
      )}
      {/* Solutions Section */}
      {showSolutions && (
        <motion.section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}>
          <FeatureCard title="Educational Use" description="Enhance learning with AI-powered note-taking." />
          <FeatureCard title="Business Solutions" description="Streamline your workflow with smart PDF tools." />
          <FeatureCard title="Personal Use" description="Organize your personal documents effortlessly." />
        </motion.section>
      )}
    </div>
  );
}
const FeatureCard = ({ title, description }) => (
  <motion.div className="bg-white shadow-lg rounded-2xl p-6"
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-gray-500 mt-2">{description}</p>
  </motion.div>
);
 // Make sure to export your component
  