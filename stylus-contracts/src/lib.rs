#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

mod erc721;

use self::erc721::{Erc721, Erc721Params, Erc721Error};
use alloy_primitives::{Address, U256};
use stylus_sdk::{prelude::*, storage::StorageU256};

// Remove the global allocator as it's provided by stylus-sdk
// #[global_allocator]
// static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

pub struct SimpleNftParams;
impl Erc721Params for SimpleNftParams {
    const NAME: &'static str = "SimpleNFT";
    const SYMBOL: &'static str = "SNFT";

    fn token_uri(token_id: U256) -> String {
        format!("https://my-nft-metadata.com/{}.json", token_id)
    }
}

sol_storage! {
    #[entrypoint]
    pub struct SimpleNFT {
        #[borrow]
        Erc721<SimpleNftParams> erc721;
        StorageU256 next_token_id;
    }
}

#[external]
impl SimpleNFT {
    pub fn mint(&mut self, to: Address) -> Result<U256, Erc721Error> {
        let token_id = self.next_token_id.get();
        self.next_token_id.set(token_id + U256::from(1));
        self.erc721.mint(to)?;
        Ok(token_id)
    }

    pub fn owner_of(&self, token_id: U256) -> Result<Address, Erc721Error> {
        self.erc721.owner_of(token_id)
    }

    pub fn token_uri(&self, token_id: U256) -> Result<String, Erc721Error> {
        self.erc721.token_uri(token_id)
    }
}