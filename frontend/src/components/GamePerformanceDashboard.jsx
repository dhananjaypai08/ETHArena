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

// Helper: converts BigInt values to strings if necessary.
const convert = (value) => (typeof value === 'bigint' ? value.toString() : value);

// News Ticker Component - a subtle, slowly moving headline
const NewsTicker = ({ text }) => (
  <div className="relative overflow-hidden mb-6">
    <motion.div
      className="whitespace-nowrap"
      initial={{ x: '100%' }}
      animate={{ x: '-100%' }}
      transition={{ repeat: Infinity, duration: 30, ease: 'linear' }} // slower ticker
    >
      <span className="text-xs text-gray-300 tracking-wide">{text}</span>
    </motion.div>
  </div>
);

// Small and crisp performance metric card
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

// Achievement badge with subtle styling
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

// Radar Chart for game genres
const GameGenreRadar = ({ genres = [] }) => {
  const genreData = [
    { genre: 'Action', value: genres.includes('Action') ? 80 : 30 },
    { genre: 'Arcade', value: genres.includes('Arcade') ? 90 : 40 },
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

// Card for each recommended game
const RecommendedGameCard = ({ game }) => (
  <Card className="border border-indigo-500/20 p-4">
    <h3 className="text-xs font-semibold text-indigo-300 mb-1">
      {game['game scope'] || 'Game Title'}
    </h3>
    <p className="text-[10px] text-gray-400 mb-1">
      <span className="font-medium">Popularity: </span>
      {convert(game['game popularity']) || 'N/A'}
    </p>
    <p className="text-[10px] text-gray-400">
      <span className="font-medium">Benefits: </span>
      {game['game benefits in terms of money and tournaments'] || 'N/A'}
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
          `http://localhost:8000/getAIResponse?walletAddress=${walletAddress}`
        );
        // The API returns an object keyed by wallet addresses.
        // To simplify front-end access, extract the inner object for the current wallet.
        const data = response.data;
        console.log(data);
        
        setGameData(data);
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

  // Now you can directly destructure properties from gameData.
  const {
    "fun pun": funPun = "You're a gaming legend!",
    "gamer match/doppleganger": gamerDopple = "Unknown",
    "overall performance": overallPerformanceRaw = "Keep playing and improving!",
    "Personalized Feeds": personalizedFeeds = [],
    "game download links": gameDownloadLinks = "#",
    "estimated rewards": estimatedRewardsRaw = "N/A",
    "accuracy": accuracyRaw = "N/A",
    overall_benefit: overallBenefit = "",
    "recommended games for esports players": recommendedGames = [],
  } = gameData;

  const overallPerformance = convert(overallPerformanceRaw);
  const estimatedRewards = convert(estimatedRewardsRaw);
  const accuracy = convert(accuracyRaw);

  const personalData = personalizedFeeds[0] || {
    "rewards earned": 0,
    "user reputation": "Newcomer",
    percentile: "N/A",
    "onchain footprints": "N/A",
    "game genres": [],
  };

  // Define performance metrics with subtle text sizes
  const performanceMetrics = [
    {
      title: "Accuracy",
      value: accuracy,
      icon: Crosshair,
      subtitle: "Precision in every shot.",
    },
    {
      title: "Estimated Rewards",
      value: estimatedRewards,
      icon: Coins,
      subtitle: "What you might earn.",
    },
    {
      title: "Overall Performance",
      value: overallPerformance,
      icon: Trophy,
      subtitle: "A snapshot of your progress.",
    },
    {
      title: "On-chain Footprints",
      value: convert(personalData["onchain footprints"]),
      icon: Star,
      subtitle: "Your blockchain impact.",
    },
  ];

  // Define achievements using personalized feed data
  const achievements = [
    {
      icon: Crown,
      title: "Gamer Doppelganger",
      description: gamerDopple,
    },
    {
      icon: Flame,
      title: "Reputation",
      description: personalData["user reputation"],
    },
    {
      icon: Star,
      title: "Top Percentile",
      description: personalData.percentile,
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-gray-900 text-gray-900 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/1.5 w-80 h-80 bg-indigo-500/10 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-0 right-1/1.5 w-80 h-80 bg-teal-500/10 rounded-full blur-2xl animate-pulse" />

      <div className="max-w-7xl mx-auto relative">
        {/* News Ticker with a slow moving headline */}
        <NewsTicker text={funPun} class="text-20xl" />

        {/* Main Intro (subtle secondary headline) */}
        {overallBenefit && (
          <div className="mb-6 text-center">
            <p className="text-xs text-gray-400">{overallBenefit}</p>
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
        {recommendedGames.length > 0 && (
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
              {recommendedGames.map((game, index) => (
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
            onClick={() => window.open(gameDownloadLinks, '_blank')}
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
