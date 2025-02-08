import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { Network, Cpu, Database, MessageCircle, Send, Loader2, ChevronDown } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import ReactMarkdown from 'react-markdown';

const COLORS = ['#10B981', '#FACC15', '#E11D48', '#6366F1'];

const fetchGraphData = async (endpoint, query) => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const result = await response.json();
    return result?.data || null;
  } catch (error) {
    console.error('Error fetching graph data:', error);
    return null;
  }
};

const DataCard = ({ title, value, icon: Icon, trend }) => (
    <Card className="p-4 border border-emerald-500/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <Icon className="w-8 h-8 text-emerald-500 opacity-50" />
      </div>
      {trend && (
        <div className="mt-2 text-sm">
          <span className={trend.type === 'increase' ? 'text-green-500' : 'text-red-500'}>
            {trend.value}%
          </span>
          <span className="text-gray-400 ml-1">vs last period</span>
        </div>
      )}
    </Card>
);

const GraphChatbot = ({ graphData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [userPrompt, setUserPrompt] = useState('');
    const [chatResponse, setChatResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSendPrompt = async () => {
      if (!userPrompt.trim()) return;
      setIsLoading(true);
      try {
        const response = await fetch('https://0x0c8923d457934eae1a4ce708f07a980f1ce57a32.gaia.domains/v1/chat/completions', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: `You are a helpful assistant that knows about the graph data and can quickly give correct answers. Answer from this data : ${JSON.stringify(graphData.ethArena)}. Answer everything in a fun and pun way with some jokes even if you don't know stuff`},
              { role: 'user', content: `Answer this question: ${userPrompt}` }
            ],
            model: 'llama-3.2-3B-Instruct'
          })
        });
        const data = await response.json();
        setChatResponse(data.choices[0].message.content);
      } catch (error) {
        console.error('Chat error:', error);
        setChatResponse('Error fetching response. Please try again.');
      } finally {
        setIsLoading(false);
        setUserPrompt('');
      }
    };
  
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <motion.div 
          className="w-[28rem] h-[36rem] bg-gray-900 border border-emerald-500/20 rounded-xl shadow-2xl p-6 overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 50, pointerEvents: isOpen ? 'auto' : 'none' }}
          transition={{ duration: 0.3 }}
        >
          {isOpen && (
            <div className="flex flex-col h-full">
              <div className="flex-grow overflow-y-auto text-gray-300 p-4 border-b border-gray-700">
                {chatResponse ? (
                  <ReactMarkdown className="prose prose-invert">{chatResponse}</ReactMarkdown>
                ) : (
                  <p className="text-gray-500 text-center">Ask me anything about the graph data!</p>
                )}
              </div>
              <div className="flex space-x-2 p-4">
                <input 
                  type="text"
                  value={userPrompt}
                  autoFocus={isOpen}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="Ask a question about the data..."
                  className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500"
                />
                <Button 
                  onClick={handleSendPrompt}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
        <Button 
          onClick={() => setIsOpen((prev) => !prev)}
          className="fixed bottom-4 right-4 rounded-full p-3 bg-emerald-500 hover:bg-emerald-600"
        >
          {isOpen ? <ChevronDown /> : <MessageCircle />}
        </Button>
      </div>
    );
};

export const GraphExplorerDashboard = () => {
  const [graphData, setGraphData] = useState({ substream: [], ethArena: [], gameSubgraph: [] });
  const [loading, setLoading] = useState(true);
  const [selectedGraph, setSelectedGraph] = useState('ethArena');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const substreamData = await fetchGraphData('https://api.studio.thegraph.com/query/103194/djsubstream/version/latest', `{
          contracts { id, blockNumber, timestamp }
        }`);
        console.log(substreamData);

        const ethArenaData = await fetchGraphData('https://api.studio.thegraph.com/query/103194/etharenasubgraph/version/latest', `{
          rewardAdds(first: 1000) { user, score }
        }`);
        console.log(ethArenaData);
        const gameSubgraphData = await fetchGraphData('https://gateway.thegraph.com/api/a8f71950ae2eb31731ad9ff720a9b866/subgraphs/id/Fs8CXT44JRnPrG8ipustHyPwqAg8d3xcgFUW4ogkCb6g', `{
          accounts(first: 1000) { id, mana, updatedAt }
        }`);

        setGraphData({
          substream: substreamData?.contracts || [],
          ethArena: ethArenaData?.rewardAdds || [],
          gameSubgraph: gameSubgraphData?.accounts || []
        });
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = useMemo(() => {
    switch (selectedGraph) {
      case 'substream':
        return (graphData.substream || [])
          .slice(0, 20)
          .map(contract => ({
            name: `Block ${contract.blockNumber}`,
            value: parseInt(contract.blockNumber),
            timestamp: new Date(parseInt(contract.timestamp) * 1000).toLocaleDateString()
          }))
          .reverse();
      case 'ethArena':
        return graphData.ethArena.map(({ user, score }) => ({
          name: user,
          value: parseInt(score)
        }));
      case 'gameSubgraph':
        return graphData.gameSubgraph.map((account, index) => ({
          name: `Account ${index + 1}`,
          mana: parseInt(account.mana) || 0
        }));
      default:
        return [];
    }
  }, [selectedGraph, graphData]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <motion.h1 className="text-4xl font-bold text-center text-emerald-400">
        Query on subgraph and substream powered subgraph data using Gaianet AI agent node
      </motion.h1>
      <div className="flex justify-center space-x-4 mt-8">
        <Button onClick={() => setSelectedGraph('ethArena')}><Cpu className="w-4 h-4" /> EthArena</Button>
        <Button onClick={() => setSelectedGraph('gameSubgraph')}><Database className="w-4 h-4" /> Game Subgraph</Button>
      </div>
      <Card className="p-6 border border-emerald-500/20 mt-8">
        {loading ? (
          <div className="flex justify-center"><Loader /></div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            { selectedGraph === 'ethArena' ? (
              <PieChart><Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120}>{chartData.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip /></PieChart>
            ) : (
              <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis dataKey="mana" /><Tooltip /><Line type="monotone" dataKey="mana" stroke="#10B981" /></LineChart>
            )}
          </ResponsiveContainer>
        )}
      </Card>
      <Card>
        <motion.h3 className="text  text-center text-emerald-400">Tracking contract minting events via substream powered subgraph</motion.h3>
        <motion.h5 className="text  text-center text-emerald-400">Max cap for recent contracts for graph out is 1000</motion.h5>
      <>
                  <DataCard
                    title="Total Contracts"
                    value={graphData.substream?.length || 0}
                    icon={Database}
                    trend={{ type: 'increase', value: 12 }}
                  />
                  <DataCard
                    title="Latest Block"
                    value={graphData.substream?.[0]?.blockNumber || 0}
                    icon={Network}
                  />
                </>
      </Card>
      <GraphChatbot graphData={graphData} />
    </div>
  );
};
export default GraphExplorerDashboard;
