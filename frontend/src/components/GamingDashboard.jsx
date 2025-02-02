import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { 
  Trophy, Sword, Target, Crown, Star,
  Loader2, Search, Filter, SlidersHorizontal,
  Gamepad2, Coins, Medal, Shield,
  Sparkles, BarChart3, PieChart as PieChartIcon,
  Gem, Award
} from 'lucide-react';
// Import your custom components
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
// Import the useContract hook
import { useContract } from '../hooks/useContract';
import { formatEther } from 'ethers';

// Custom Chart Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 border border-emerald-500/20 rounded-lg p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <Gamepad2 className="w-4 h-4 text-emerald-400" />
          <p className="text-emerald-400 font-medium">
            {`${payload[0].payload.address?.slice(0, 6)}...${payload[0].payload.address?.slice(-4)}`}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-white font-bold">Score: {payload[0].value}</p>
          <p className="text-gray-400 text-sm">AI Rewards: {payload[0].payload.rewards || 0} ETH</p>
          <p className="text-gray-400 text-sm">NFTs: {payload[0].payload.nftCount || 0}</p>
        </div>
      </div>
    );
  }
  return null;
};

// Player Card Component
const PlayerCard = ({ player, rank }) => {
  const rankColors = {
    1: 'from-yellow-500 to-amber-600',
    2: 'from-gray-300 to-gray-400',
    3: 'from-amber-700 to-amber-800'
  };

  const getBadge = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-8 h-8 text-yellow-500" />;
      case 2: return <Medal className="w-8 h-8 text-gray-300" />;
      case 3: return <Trophy className="w-8 h-8 text-amber-700" />;
      default: return <Shield className="w-8 h-8 text-emerald-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="h-full relative overflow-hidden group border border-emerald-500/20">
        {/* Rank Badge */}
        <div className="absolute top-4 right-4">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center
            bg-gradient-to-br ${rankColors[rank] || 'from-emerald-500 to-teal-500'}
          `}>
            <span className="text-white font-bold text-lg">#{rank}</span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-emerald-500/10 rounded-full">
              {getBadge(rank)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {`${player.address.slice(0, 6)}...${player.address.slice(-4)}`}
              </h3>
              <p className="text-gray-400">Game Master</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-sm text-gray-400">Reputation</p>
              <p className="text-2xl font-bold text-white">{player.score}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-sm text-gray-400">AI Based Rewards</p>
              <p className="text-2xl font-bold text-white">
                {player.rewards}
              </p>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="flex gap-2">
            {player.score > 5 && (
              <div className="p-2 bg-emerald-500/10 rounded-full" title="Expert Player">
                <Sword className="w-4 h-4 text-emerald-400" />
              </div>
            )}
            {player.rewards > 0 && (
              <div className="p-2 bg-emerald-500/10 rounded-full" title="AI Reward Winner">
                <Gem className="w-4 h-4 text-emerald-400" />
              </div>
            )}
            {rank <= 3 && (
              <div className="p-2 bg-emerald-500/10 rounded-full" title="Top Player">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Filter Panel Component
const FilterPanel = ({ 
  sortOption, 
  onSortChange,
  timeRange,
  onTimeRangeChange,
  searchTerm,
  onSearchChange,
  isOpen
}) => (
  <motion.div
    initial={false}
    animate={{ height: isOpen ? 'auto' : 0 }}
    transition={{ duration: 0.3 }}
    className="overflow-hidden"
  >
    <Card className="p-6 mb-8 border border-emerald-500/20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Search Player</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by address..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Sort By</label>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="score">Reputation (High to Low)</option>
            <option value="rewards">Rewards (High to Low)</option>
            <option value="nfts">NFTs Owned</option>
          </select>
        </div>

        {/* Time Range */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Time Range</label>
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
            <option value="day">Today</option>
          </select>
        </div>
      </div>
    </Card>
  </motion.div>
);

// Metric Card Component
const MetricCard = ({ icon: Icon, title, value, subtitle, trend = [], percentage }) => (
  <motion.div whileHover={{ y: -4 }} className="h-full">
    <Card className="h-full border border-emerald-500/20 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <Icon className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">
                  {value}
                </p>
                {percentage && (
                  <span className={`text-sm ${
                    percentage > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {percentage > 0 ? '↑' : '↓'} {Math.abs(percentage)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {trend.length > 0 && (
          <div className="h-10 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {subtitle && (
          <p className="text-sm text-gray-400 mt-2">{subtitle}</p>
        )}
      </div>
    </Card>
  </motion.div>
);

export const GamingDashboard = ({  }) => {
  // const { address } = useAccount();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState('bar');
  const [sortOption, setSortOption] = useState('score');
  const [timeRange, setTimeRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [trendData, setTrendData] = useState([]);
  const [totalRewards, setRewards] = useState(0);

  const COLORS = ['#10B981', '#14B8A6', '#0EA5E9', '#6366F1', '#8B5CF6'];
  const { contract, address, isConnected } = useContract();

  // Generate trend data
  useEffect(() => {
    const generateTrendData = () => {
      const data = [];
      for (let i = 0; i < 10; i++) {
        data.push({
          value: Math.floor(Math.random() * 50) + 50
        });
      }
      setTrendData(data);
    };
    generateTrendData();
  }, []);

  // Fetch player data
  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!contract) return;

      try {
        const addresses = await contract.getAllUsers();
        let uniqueAddresses = [...new Set(addresses)];
        const playerData = await Promise.all(
          uniqueAddresses.map(async (addr) => {
            const score = await contract.reputation_score(addr);
            const rewards = await contract.rewards_earned(addr);
            console.log(Number(rewards));
            setRewards(totalRewards+Number(rewards));
            return {
              address: addr,
              score: Number(score),
              rewards: Number(rewards),
              nftCount: Math.floor(Math.random() * 10) // Mock NFT count
            };
          })
        );

        setPlayers(playerData);
      } catch (error) {
        console.error('Error fetching player data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [contract]);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = [...players];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(player => 
        player.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortOption) {
      case 'score':
        filtered.sort((a, b) => b.score - a.score);
        break;
      case 'rewards':
        filtered.sort((a, b) => b.rewards - a.rewards);
        break;
      case 'nfts':
        filtered.sort((a, b) => b.nftCount - a.nftCount);
        break;
      default:
        break;
    }

    return filtered;
  }, [players, searchTerm, sortOption]);

  // Calculate metrics
  const totalPlayers = players.length;
  const avgScore = totalPlayers > 0 
    ? Math.round(players.reduce((sum, player) => sum + player.score, 0) / totalPlayers) 
    : 0;
  const totalNFTs = players.reduce((sum, player) => sum + (player.nftCount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 mx-auto text-emerald-500 mb-4" />
          <p className="text-gray-400">Loading game data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      {/* Background Effects */}
     {/* Background Effects */}
     <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent bg-clip-text">
              Game Analytics Dashboard
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Track player performance, AI rewards, and NFT achievements
          </p>

          {/* Filter Toggle Button */}
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="secondary"
            className="group border border-emerald-500/20 hover:border-emerald-500/50"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </motion.div>

        {/* Filter Panel */}
        <FilterPanel
          sortOption={sortOption}
          onSortChange={setSortOption}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isOpen={showFilters}
        />

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={Gamepad2}
            title="Total Players"
            value={totalPlayers}
            subtitle="Active gamers"
            trend={trendData}
            percentage={3.5}
          />
          <MetricCard
            icon={Coins}
            title="Total AI Rewards"
            value={totalRewards}
            subtitle="Distributed rewards"
            trend={trendData}
            percentage={15.7}
          />
          <MetricCard
            icon={Award}
            title="Average Score"
            value={avgScore}
            subtitle="Per player"
            trend={trendData}
            percentage={1.3}
          />
          <MetricCard
            icon={Gem}
            title="Total NFTs"
            value={totalNFTs}
            subtitle="Assets created"
            trend={trendData}
            percentage={2.1}
          />
        </div>

        {/* Chart Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => setSelectedChart('bar')}
            variant={selectedChart === 'bar' ? 'primary' : 'secondary'}
            className={`group ${
              selectedChart === 'bar' 
                ? 'border-emerald-500/50' 
                : 'border border-emerald-500/20 hover:border-emerald-500/50'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Distribution
          </Button>
          <Button
            onClick={() => setSelectedChart('pie')}
            variant={selectedChart === 'pie' ? 'primary' : 'secondary'}
            className={`group ${
              selectedChart === 'pie'
                ? 'border-emerald-500/50'
                : 'border border-emerald-500/20 hover:border-emerald-500/50'
            }`}
          >
            <PieChartIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Breakdown
          </Button>
        </div>

        {/* Charts */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedChart}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 border border-emerald-500/20">
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  {selectedChart === 'bar' ? (
                    <BarChart data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="address"
                        tick={{ fill: '#9CA3AF' }}
                        tickFormatter={(value) => `${value.slice(0, 4)}...${value.slice(-4)}`}
                      />
                      <YAxis tick={{ fill: '#9CA3AF' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar 
                        name="Reputation Score"
                        dataKey="score" 
                        fill="#10B981"
                        radius={[4, 4, 0, 0]}
                      >
                        {filteredData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={filteredData}
                        dataKey="score"
                        nameKey="address"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={({ address }) => `${address.slice(0, 4)}...${address.slice(-4)}`}
                      >
                        {filteredData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Current Player Stats */}
        {address && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent bg-clip-text">
                Your Stats
              </span>
            </h2>
            <Card className="p-6 border border-emerald-500/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-lg">
                    <Target className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Your Rank</p>
                    <p className="text-2xl font-bold text-white">
                      #{filteredData.findIndex(p => p.address === address) + 1}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-lg">
                    <Trophy className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Your Score</p>
                    <p className="text-2xl font-bold text-white">
                      {players.find(p => p.address === address)?.score || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-lg">
                    <Coins className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Your AI Rewards</p>
                    <p className="text-2xl font-bold text-white">
                      {players.find(p => p.address === address)?.rewards || 0} gameRIZZ
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Top Players */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent bg-clip-text">
              Top Players
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.slice(0, 3).map((player, index) => (
              <PlayerCard
                key={player.address}
                player={player}
                rank={index + 1}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GamingDashboard;