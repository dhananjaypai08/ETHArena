use alloc::{string::String, vec::Vec};
use alloy_primitives::{Address, U256, FixedBytes};
use alloy_sol_types::sol;
use core::marker::PhantomData;
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

sol! {
    event Transfer(address indexed from, address indexed to, uint256 indexed token_id);
    event Approval(address indexed owner, address indexed approved, uint256 indexed token_id);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    error InvalidTokenId(uint256 token_id);
    error NotOwner(address from, uint256 token_id, address real_owner);
    error TransferToZero(uint256 token_id);
}

#[derive(SolidityError)]
pub enum Erc721Error {
    InvalidTokenId(InvalidTokenId),
    NotOwner(NotOwner),
    TransferToZero(TransferToZero),
}

impl<T: Erc721Params> Erc721<T> {
    pub fn mint(&mut self, to: Address) -> Result<(), Erc721Error> {
        if to.is_zero() {
            return Err(Erc721Error::TransferToZero(TransferToZero {
                token_id: self.total_supply.get(),
            }));
        }

        let token_id = self.total_supply.get();
        self.total_supply.set(token_id + U256::from(1));

        self.owners.insert(token_id, to);
        let balance = self.balances.get(to);
        self.balances.insert(to, balance + U256::from(1));

        evm::log(Transfer {
            from: Address::ZERO,
            to,
            token_id,
        });

        Ok(())
    }

    pub fn owner_of(&self, token_id: U256) -> Result<Address, Erc721Error> {
        let owner = self.owners.get(token_id);
        if owner.is_zero() {
            return Err(Erc721Error::InvalidTokenId(InvalidTokenId { token_id }));
        }
        Ok(owner)
    }

    pub fn token_uri(&self, token_id: U256) -> Result<String, Erc721Error> {
        self.owner_of(token_id)?;
        Ok(T::token_uri(token_id))
    }
}