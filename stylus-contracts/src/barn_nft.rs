// src/barn_nft.rs
use crate::erc721::{Erc721, Erc721Params, Erc721Error};
use alloy_primitives::{Address, U256};
use stylus_sdk::{msg, prelude::*};

pub struct BARNNFT {
    pub owner: Address,
    pub reputation_score: U256,
    pub ai_rewards: U256,
    pub image_asset: String,
    pub doppleganger_asset: String,
    pub token_id: U256,
}

pub struct BaseArenaParams;
impl Erc721Params for BaseArenaParams {
    const NAME: &'static str = "BaseArena";
    const SYMBOL: &'static str = "BARN";

    fn token_uri(token_id: U256) -> String {
        format!("https://my-nft-metadata.com/{}.json", token_id)
    }
}

sol_storage! {
    pub struct BaseArena {
        #[borrow]
        Erc721<BaseArenaParams> erc721;
        mapping(address => U256) reputation_score;
        mapping(address => U256) rewards_earned;
        mapping(address => StorageVec<BARNNFT>) games_of_user;  // Use StorageVec instead of Vec
        mapping(address => StorageString) ai_response;          // Use StorageString instead of String
        StorageVec<Address> all_users;                          // Use StorageVec instead of Vec
        U256 token_id;
    }
}

#[public]
impl BaseArena {
    pub fn safe_mint(
        &mut self,
        rewards_earned_user: U256,
        uri: String,
        doppleganger_uri: String,
        to: Address,
    ) -> Result<(), Erc721Error> {
        self.reputation_score.setter(to).set(self.reputation_score.getter(to).get() + U256::from(1));
        self.rewards_earned.setter(to).set(self.rewards_earned.getter(to).get() + rewards_earned_user);
        self.token_id.set(self.token_id.get() + U256::from(1));
        self.erc721.mint(to)?;
        self.erc721.token_uri(self.token_id.get())?;

        let new_barn_nft = BARNNFT {
            owner: to,
            reputation_score: self.reputation_score.getter(to).get(),
            ai_rewards: rewards_earned_user,
            image_asset: uri,
            doppleganger_asset: doppleganger_uri,
            token_id: self.token_id.get(),
        };

        self.games_of_user.setter(to).push(new_barn_nft);
        self.all_users.push(to);
        Ok(())
    }

    pub fn get_all_users(&self) -> Vec<Address> {
        self.all_users.iter().collect()
    }

    pub fn save_response(&mut self, user: Address, data: String) {
        self.ai_response.setter(user).set(data);
    }

    pub fn get_nfts(&self, user: Address) -> Vec<BARNNFT> {
        self.games_of_user.getter(user).iter().collect()
    }
}