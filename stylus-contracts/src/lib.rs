#![no_std]

extern crate alloc;
use stylus_sdk::{
    prelude::*,
    storage::{StorageMap, StorageValue, StorageVec},
};
use alloc::{string::String, vec::Vec};

#[solidity_storage]
#[derive(Default)]
pub struct BaseArenaStorage {
    reputation_score: StorageMap<Address, u64>,
    rewards_earned: StorageMap<Address, u64>,
    ai_responses: StorageMap<Address, String>,
    token_id: StorageValue<u64>,
    all_users: StorageVec<Address>,
    games_of_user: StorageMap<Address, StorageVec<BARNNFT>>,
}

#[derive(Clone, Debug, AbiType, SolidityType)]
pub struct BARNNFT {
    owner: Address,
    reputation_score: u64,
    ai_rewards: u64,
    image_asset: String,
    doppleganger_asset: String,
    token_id: u64,
}

#[external]
impl BaseArena {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn safe_mint(
        &mut self,
        to: Address,
        rewards_earned_user: u64,
        uri: String,
        doppleganger_uri: String,
    ) {
        let current_token_id = self.token_id.get().unwrap_or(0) + 1;
        self.token_id.set(current_token_id);

        let new_reputation = self.reputation_score.get(to).unwrap_or(0) + 1;
        self.reputation_score.insert(to, new_reputation);

        let new_rewards = self.rewards_earned.get(to).unwrap_or(0) + rewards_earned_user;
        self.rewards_earned.insert(to, new_rewards);

        let new_nft = BARNNFT {
            owner: to,
            reputation_score: new_reputation,
            ai_rewards: new_rewards,
            image_asset: uri.clone(),
            doppleganger_asset: doppleganger_uri.clone(),
            token_id: current_token_id,
        };

        let mut user_nfts = self.games_of_user.get(to).unwrap_or_default();
        user_nfts.push(new_nft);
        self.games_of_user.insert(to, user_nfts);

        self.all_users.push(to);
    }

    pub fn get_all_users(&self) -> Vec<Address> {
        self.all_users.iter().collect()
    }

    pub fn save_response(&mut self, user: Address, data: String) {
        self.ai_responses.insert(user, data);
    }

    pub fn get_nfts(&self, user: Address) -> Vec<BARNNFT> {
        self.games_of_user.get(user).unwrap_or_default().iter().collect()
    }
}
