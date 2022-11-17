## get all NonfungiblePositionManager function signature

select * from (select substring(input,1,10) as sig from ethereum.transactions where from_address ="0x26fcbd3afebbe28d0a8684f790c48368d21665b5" and to_address = "0xc36442b4a4522e871399cd717abdd847ab11fe88") as A group by A.sig


```
sig
0x88316456  // mint
0xac9650d8  // multicall  increse & decrese in multicall
0xfc6f7865  // collect
```


# contract

NonfungiblePositionManagerAdress 0xc36442b4a4522e871399cd717abdd847ab11fe88
UniswapV3Factory 0x1F98431c8aD98523631AE4a59f267346ea31F984 // using getPool to get pool address


# subgraph

https://thegraph.com/hosted-service/subgraph/uniswap/uniswap-v3

```
{
  position(id:362887) {
    id
    depositedToken0
    depositedToken1
    withdrawnToken0
    withdrawnToken1
    collectedFeesToken0
    collectedFeesToken1
    liquidity
    token0 {
      id
      symbol
    }
    token1
    {
      id
      symbol
    }
  }
}
```