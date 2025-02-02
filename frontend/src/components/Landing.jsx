import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Gamepad2, 
  Brain,
  Target,
  ArrowRight,
  Trophy,
  Rocket,
  Bird
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

const FeatureCard = ({ icon: Icon, title, description, techDetail }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="relative"
  >
    <Card glowing className="h-full">
      <div className="relative z-10 space-y-4">
        <Icon className="w-8 h-8 text-violet-500" />
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-gray-400">{description}</p>
        <div className="pt-2 border-t border-gray-800">
          <p className="text-sm text-violet-400">{techDetail}</p>
        </div>
      </div>
    </Card>
  </motion.div>
);

const StatCard = ({ value, label, description }) => (
  <div className="text-center p-6">
    <h4 className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-pink-500 text-transparent bg-clip-text mb-2">
      {value}
    </h4>
    <p className="text-white font-medium mb-2">{label}</p>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);

export const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Get personalized feedback on your bird-flinging skills from our smart AI coach. It's like having Jesse Pollak watching your game, but with fewer Base puns!",
      techDetail: "Advanced ML models analyzing player trajectories on Base L2"
    },
    {
      icon: Trophy,
      title: "Skill Progression System",
      description: "Level up your gaming skills with detailed analytics and recommendations. We're not as generous as Jesse with Base grants, but we're close!",
      techDetail: "Real-time performance tracking and achievement system"
    },
    {
      icon: Rocket,
      title: "Game Discovery Engine",
      description: "Discover new AI-enhanced games based on your playing style. More addictive than watching Jesse's Base presentations!",
      techDetail: "Personalized game recommendations using Base protocol"
    },
    {
      icon: Target,
      title: "Strategic Insights",
      description: "Learn optimal strategies and get better at destroying those pesky pig fortresses. Built on Base, because pigs deserve L2 efficiency!",
      techDetail: "Advanced pattern recognition for gameplay optimization"
    }
  ];

  const stats = [
    {
      value: "100ms",
      label: "AI Response Time",
      description: "Faster than a Base transaction!"
    },
    {
      value: "1000+",
      label: "Game Patterns",
      description: "Analyzed by our AI coach"
    },
    {
      value: "24/7",
      label: "Gaming Support",
      description: "Unlike Jesse's pun supply"
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="relative pt-32 pb-20 px-4">
        {/* Gradient Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center items-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Gamepad2 className="w-16 h-16 text-violet-500" />
              </motion.div>
            </div>

            <h1 className="text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text">
                Master the Fling
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 text-transparent bg-clip-text">
                with AI
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
              Level up your gameplay with our AI coach built on Base. Get personalized feedback,
              strategic insights, and game recommendations. It's like having a mini Jesse Pollak in your pocket,
              but with more bird-flinging advice!
            </p>

            <div className="flex justify-center gap-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => navigate('/performance')} className="group">
                  <span>AI Companion</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => navigate('/gaming')}
                  variant="secondary"
                  className="group border border-violet-500/20 hover:border-violet-500/50"
                >
                  <span>View On-chain Reputation</span>
                  <Bird className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-24 mb-32"
          >
            <Card glowing className="border border-violet-500/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 text-center">
                <div>
                  <p className="text-violet-400 font-medium">AI Analysis</p>
                  <p className="text-gray-400 mt-1">Real-time gameplay feedback</p>
                </div>
                <div>
                  <p className="text-violet-400 font-medium">Base Powered</p>
                  <p className="text-gray-400 mt-1">L2 speed, L1 security</p>
                </div>
                <div>
                  <p className="text-violet-400 font-medium">Game Discovery</p>
                  <p className="text-gray-400 mt-1">Personalized recommendations</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32"
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </motion.div>

          {/* Platform Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card glowing className="border border-violet-500/20">
              <h3 className="text-2xl font-bold text-center pt-8 mb-8">
                Platform Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                  <StatCard key={index} {...stat} />
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing;