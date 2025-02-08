// src/lib.rs
#![cfg_attr(not(any(feature = "export-abi", test)), no_main)]
extern crate alloc;

mod erc721;
mod barn_nft;

use alloy_primitives::{Address, U256};
use stylus_sdk::{msg, prelude::*};
use crate::barn_nft::{BaseArena, BARNNFT};
use crate::erc721::Erc721Error;

sol_storage! {
    #[entrypoint]
    pub struct BaseArenaContract {
        #[borrow]
        BaseArena base_arena;
    }
}

#[public]
impl BaseArenaContract {
    pub fn safe_mint(
        &mut self,
        rewards_earned_user: U256,
        uri: String,
        doppleganger_uri: String,
        to: Address,
    ) -> Result<(), Erc721Error> {
        self.base_arena.safe_mint(rewards_earned_user, uri, doppleganger_uri, to)
    }

    pub fn get_all_users(&self) -> Vec<Address> {
        self.base_arena.get_all_users()
    }

    pub fn save_response(&mut self, user: Address, data: String) {
        self.base_arena.save_response(user, data);
    }

    pub fn get_nfts(&self, user: Address) -> Vec<BARNNFT> {
        self.base_arena.get_nfts(user)
    }
}