import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import {
  Trophy,
  Crosshair,
  Coins,
  Star,
  Gamepad2,
  Crown,
  Flame,
  Zap,
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useContract } from '../hooks/useContract';

// Helper: converts BigInt values to strings if necessary
const convert = (value) => (typeof value === 'bigint' ? value.toString() : value);

// News Ticker Component
const NewsTicker = ({ text }) => (
  <div className="relative overflow-hidden mb-6">
    <motion.div
      className="whitespace-nowrap"
      initial={{ x: '100%' }}
      animate={{ x: '-100%' }}
      transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
    >
      <span className="text-xs text-gray-300 tracking-wide">{text}</span>
    </motion.div>
  </div>
);

// Performance metric card
const GamePerformanceCard = ({ icon: Icon, title, value, subtitle }) => (
  <motion.div whileHover={{ y: -2 }} className="h-full">
    <Card className="h-full border border-indigo-500/20 relative overflow-hidden p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-indigo-500/10 rounded">
          <Icon className="w-5 h-5 text-indigo-300" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-200">{title}</h3>
          <p className="text-base font-bold bg-gradient-to-r from-indigo-300 to-teal-300 text-transparent bg-clip-text">
            {value}
          </p>
        </div>
      </div>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </Card>
  </motion.div>
);

// Achievement badge
const AchievementBadge = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="flex items-center gap-3 bg-gray-800/50 rounded p-3 border border-indigo-500/20"
  >
    <div className="p-2 bg-indigo-500/10 rounded-full">
      <Icon className="w-5 h-5 text-indigo-300" />
    </div>
    <div>
      <h4 className="text-xs font-semibold text-white">{title}</h4>
      <p className="text-[10px] text-gray-400">{description}</p>
    </div>
  </motion.div>
);

// Game genre radar chart
const GameGenreRadar = ({ genres = [] }) => {
  const genreData = [
    { genre: 'Action', value: genres.includes('Action') ? 80 : 30 },
    { genre: 'First-Person Shooter', value: genres.includes('First-Person Shooter') ? 90 : 40 },
    { genre: 'Casual', value: genres.includes('Casual') ? 85 : 35 },
    { genre: 'Strategy', value: genres.includes('Strategy') ? 75 : 25 },
    { genre: 'Puzzle', value: genres.includes('Puzzle') ? 70 : 20 },
  ];

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={genreData}>
          <PolarGrid stroke="#4B5563" />
          <PolarAngleAxis dataKey="genre" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
          <PolarRadiusAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} />
          <Radar
            name="Genre Affinity"
            dataKey="value"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Recommended game card
const RecommendedGameCard = ({ game }) => (
  <Card className="border border-indigo-500/20 p-4">
    <h3 className="text-xs font-semibold text-indigo-300 mb-1">
      Rating: {game['game scope']}
    </h3>
    <p className="text-[10px] text-gray-400 mb-1">
      <span className="font-medium">Popularity: </span>
      {game['game popularity']}
    </p>
    <p className="text-[10px] text-gray-400">
      <span className="font-medium">Benefits: </span>
      {game['game benefits in terms of money and tournaments']}
    </p>
  </Card>
);

// Main Dashboard Component
export const GamePerformanceDashboard = () => {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { address } = useContract();

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        if (!address) return;
        const walletAddress = address.toString();
        const response = await axios.get(
          `https://basearena.onrender.com/getAIResponse?walletAddress=${walletAddress}`
        );
        
        // Parse the response data if it's a string
        const parsedData = typeof response.data === 'string' 
          ? JSON.parse(response.data) 
          : response.data;
        
        setGameData(parsedData);
      } catch (error) {
        console.error('Error fetching game data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchGameData();
    }
  }, [address]);

  if (loading || !gameData) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Gamepad2 className="w-8 h-8 text-indigo-500" />
        </motion.div>
        <p className="text-gray-400 mt-4 text-sm">Loading your gaming stats...</p>
      </div>
    );
  }

  // Get the personalized feed data
  const personalData = gameData["Personalized Feeds"]?.[0] || {
    "rewards earned": 0,
    "user reputation": "Newcomer",
    percentile: "N/A",
    "onchain footprints": "N/A",
    "game genres": [],
  };
  // console.log(gameData)
  // Define performance metrics
  const performanceMetrics = [
    {
      title: "Accuracy",
      value: gameData.accuracy || "N/A",
      icon: Crosshair,
      subtitle: "Precision in every shot.",
    },
    {
      title: "Estimated Rewards",
      value: gameData["estimated rewards"] || "N/A",
      icon: Coins,
      subtitle: "What you might earn.",
    },
    {
      title: "Overall Performance",
      value: gameData["overall performance"] || "N/A",
      icon: Trophy,
      subtitle: "A snapshot of your progress.",
    },
    {
      title: "On-chain Footprints",
      value: personalData["onchain footprints"] || "0",
      icon: Star,
      subtitle: "Your blockchain impact.",
    },
  ];

  // Define achievements
  const achievements = [
    {
      icon: Crown,
      title: "Gamer Doppelganger",
      description: gameData["gamer match/doppleganger"] || "Matt Hamilton",
    },
    {
      icon: Flame,
      title: "Reputation",
      description: personalData["user reputation"] || "Play game to earn some reputation",
    },
    {
      icon: Star,
      title: "Top Percentile",
      description: personalData.percentile || "N/A",
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-gray-900 text-gray-900 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/1.5 w-80 h-80 bg-indigo-500/10 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-0 right-1/1.5 w-80 h-80 bg-teal-500/10 rounded-full blur-2xl animate-pulse" />

      <div className="max-w-7xl mx-auto relative">
        {/* News Ticker */}
        <NewsTicker text={gameData["fun pun"] || "Welcome to your gaming dashboard!"} />

        {/* Main Intro */}
        {gameData.overall_benefit && (
          <div className="mb-6 text-center">
            <p className="text-xs text-gray-400">{gameData.overall_benefit}</p>
          </div>
        )}

        {/* Performance Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {performanceMetrics.map((metric, index) => (
            <GamePerformanceCard
              key={index}
              icon={metric.icon}
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
            />
          ))}
        </div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-base font-semibold text-indigo-300 mb-4 text-center">
            Your Achievements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {achievements.map((achievement, index) => (
              <AchievementBadge
                key={index}
                icon={achievement.icon}
                title={achievement.title}
                description={achievement.description}
              />
            ))}
          </div>
        </motion.div>

        {/* Gaming Profile: Genre Radar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <Card className="border border-indigo-500/20 p-4">
            <h2 className="text-base font-semibold text-indigo-300 mb-3 text-center">
              Your Gaming Profile
            </h2>
            <GameGenreRadar genres={personalData["game genres"]} />
          </Card>
        </motion.div>

        {/* Recommended Games Section */}
        {gameData["recommended games for esports players"]?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-base font-semibold text-indigo-300 mb-3 text-center">
              Recommended Games for Aspiring Esports Stars
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gameData["recommended games for esports players"].map((game, index) => (
                <RecommendedGameCard key={index} game={game} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Download / Play Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <Button
            className="bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-white px-6 py-2 rounded text-xs font-medium"
            onClick={() => window.open(gameData["game download links"], '_blank')}
          >
            <Zap className="w-4 h-4 inline-block mr-1" />
            Play / Download Now
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default GamePerformanceDashboard;