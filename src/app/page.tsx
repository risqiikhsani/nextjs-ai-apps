"use client"
import ModelCard from "@/components/model-card";
import { audio_items, text_items, visual_items } from "@/const/links";
import { LinkType } from '@/types/links';
import { motion } from 'framer-motion';
import { Brain, Eye, Mic, Sparkles } from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Page() {
  return (
    <div className="">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div 
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 md:p-16 mb-20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          </div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6" />
              <span className="text-sm font-semibold tracking-wider uppercase">Welcome to</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Hypernova AI
            </h1>
            <p className="text-xl md:text-2xl font-medium text-purple-100 max-w-2xl">
              The ultimate AI platform for all your needs.
              As beautiful as Hypernova in galaxy.
            </p>
          </motion.div>
        </motion.div>

        {/* Natural Language Section */}
        <Section
          title="Natural Language"
          icon={<Brain />}
          items={text_items}
        />

        {/* Computer Vision Section */}
        <Section
          title="Computer Vision"
          icon={<Eye />}
          items={visual_items}
        />

        {/* Audio Section */}
        <Section
          title="Audio"
          icon={<Mic />}
          items={audio_items}
        />
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Section = ({ title, icon, items }:{title:string,icon:any,items:any}) => (
  <motion.div
    className="mb-20"
    initial="initial"
    whileInView="animate"
    viewport={{ once: true }}
    variants={fadeIn}
  >
    <div className="flex items-center gap-3 mb-8">
      <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
        {icon}
      </div>
      <h2 className="text-3xl md:text-4xl font-bold">
        {title}
      </h2>
    </div>
    
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={staggerContainer}
    >
      {items.map((item: LinkType, index:number) => (
        <motion.div
          key={index}
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 }
          }}
        >
          <ModelCard item={item} />
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
);