import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { 
  Heart, 
  Loader2, 
  ImageIcon, 
  Users,
  User,
  ExternalLink
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useContract } from '../hooks/useContract';

export const NFTMarketplace = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('personal');
  const [transactions, setTransactions] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  
  // Use ConnectKit's hooks instead of custom connection logic
 const { contract, address, isConnected, signer } = useContract(); 

  // Fetch NFTs based on view mode
  useEffect(() => {
    const fetchNFTs = async () => {
      if (!contract || !isConnected) return;
      let allNFTS = [];
      setLoading(true);
      try {
        if (viewMode === 'personal') {
          const userNFTs = await contract.getNFTs(address);
          console.log(userNFTs);
          
          for(let i=0;i<userNFTs.length;i++){
            const data = {
                "owner": userNFTs[i][0],
                "reputation_score": Number(userNFTs[i][1]),
                "ai_rewards" : Number(userNFTs[i][2]),
                "image_asset": userNFTs[i][3],
                "tokenId": Number(userNFTs[i][5])

            };
            allNFTS.push(data);
          }
          console.log(allNFTS)
          setNfts(allNFTS);
          
        } else {
          const addresses = await contract.getAllUsers();
          const uniqueAddresses = [...new Set(addresses)];
          
          
          for (const addr of uniqueAddresses) {
            const userNFTs = await contract.getNFTs(addr);
            
            for(let i=0;i<userNFTs.length;i++){
                const data = {
                    "owner": userNFTs[i][0],
                    "reputation_score": Number(userNFTs[i][1]),
                    "ai_rewards" : Number(userNFTs[i][2]),
                    "image_asset": userNFTs[i][3],
                    "tokenId": Number(userNFTs[i][5])

                };
                console.log(data);
                allNFTS.push(data);
            
          }
          
          setNfts(allNFTS);
            // allNFTs = [...allNFTs, ...userNFTs];
          }
        //   setNfts(allNFTs);
        }
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [contract, address, viewMode, isConnected]);

  // Handle cheering (sending ETH)
  const handleCheer = async (nft) => {
    if (!isConnected) return;

    setLoadingStates(prev => ({ ...prev, [nft.tokenId]: true }));

    try {
      
    //   console.log(signer, nft.owner);
    //   const gasEstimate = await provider.estimateGas({
    //     to: nft.owner,
    //     value: ethers.parseEther('0.1'),
    //     from: address
    //   });
  
    //   // Add 20% buffer to gas estimate
    //   const gasLimit = gasEstimate.mul(120).div(100);
    const fromAddress = await signer.getAddress();
      // Prepare the transaction
      const txRequest = {
        from: fromAddress,
        to: nft.owner,
        value: ethers.parseEther('0.1'),
        gasLimit: 21000,
        // Optionally add current gas price
        
      };

      const tx = await signer.sendTransaction(txRequest);

      setTransactions(prev => ({
        ...prev,
        [nft.tokenId]: tx.hash
      }));

      await tx.wait();
    } catch (error) {
      console.error('Error cheering NFT:', error);
      alert('Failed to cheer NFT. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [nft.tokenId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto text-emerald-500 animate-spin mb-4" />
          <p className="text-gray-400">Loading NFTs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
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
              AI based NFT Gallery
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Discover and cheer amazing NFTs from our community
          </p>

          {/* View Mode Selector */}
          {isConnected && (
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setViewMode('personal')}
                variant={viewMode === 'personal' ? 'primary' : 'secondary'}
                className={`group ${
                  viewMode === 'personal' 
                    ? 'border-emerald-500/50' 
                    : 'border border-emerald-500/20 hover:border-emerald-500/50'
                }`}
              >
                <User className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                My NFTs
              </Button>
              <Button
                onClick={() => setViewMode('all')}
                variant={viewMode === 'all' ? 'primary' : 'secondary'}
                className={`group ${
                  viewMode === 'all'
                    ? 'border-emerald-500/50'
                    : 'border border-emerald-500/20 hover:border-emerald-500/50'
                }`}
              >
                <Users className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                All NFTs
              </Button>
            </div>
          )}
        </motion.div>

        {/* NFT Grid */}
        {isConnected ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {nfts.map((nft, key) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4 }}
                  className="h-full"
                >
                  <Card className="h-full border border-emerald-500/20 overflow-hidden group">
                    {/* NFT Image */}
                    <div className="relative aspect-square">
                        
                      <img
                        src={nft.image_asset}
                        alt={`NFT #${nft.tokenId}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/api/placeholder/400/400';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    {/* NFT Info */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">
                          NFT #{nft.tokenId}
                        </h3>
                        <div className="px-3 py-1 bg-emerald-500/10 rounded-full">
                          <span className="text-sm text-emerald-400">
                            Score: {nft.reputation_score.toString()}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-6">
                        <p className="text-sm text-gray-400">
                          Owner: {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
                        </p>
                        <p className="text-sm text-gray-400">
                          AI Rewards: {nft.ai_rewards.toString()}
                        </p>
                      </div>

                      {/* Cheer Button */}
                      {nft.owner !== address && (
                        <div className="space-y-4">
                          <Button
                            onClick={() => handleCheer(nft)}
                            disabled={loadingStates[nft.tokenId]}
                            className="w-full group border border-emerald-500/20 hover:border-emerald-500/50"
                          >
                            {loadingStates[nft.tokenId] ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Heart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                            )}
                            Cheer (0.1 ETH)
                          </Button>

                          {transactions[nft.tokenId] && (
                            <a
                              href={`https://sepolia.arbiscan.io/tx/${transactions[nft.tokenId]}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                              View Transaction
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center mt-12">
            <p className="text-xl text-gray-400">
              Connect your wallet to view NFTs
            </p>
          </div>
        )}

        {/* Empty State */}
        {isConnected && nfts.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <ImageIcon className="w-12 h-12 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">No NFTs Found</h3>
            <p className="text-gray-400">
              {viewMode === 'personal' 
                ? "You don't have any NFTs yet"
                : "No NFTs have been minted yet"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NFTMarketplace;