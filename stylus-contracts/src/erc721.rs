// src/erc721.rs
use alloc::{string::String, vec::Vec};
use alloy_primitives::{Address, U256, FixedBytes};
use alloy_sol_types::sol;
use core::{borrow::BorrowMut, marker::PhantomData};  // Add BorrowMut import
use stylus_sdk::{abi::Bytes, evm, msg, prelude::*};

pub trait Erc721Params {
    const NAME: &'static str;
    const SYMBOL: &'static str;
    fn token_uri(token_id: U256) -> String;
}

sol_storage! {
    pub struct Erc721<T: Erc721Params> {
        mapping(uint256 => address) owners;
        mapping(address => uint256) balances;
        mapping(uint256 => address) token_approvals;
        mapping(address => mapping(address => bool)) operator_approvals;
        uint256 total_supply;
        PhantomData<T> phantom;
    }
}

// Rest of the code remains unchanged...