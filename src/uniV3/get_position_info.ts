import getABI from '../utils/get_abi';
import Web3 from 'web3';
import { Token } from '@src/types/token';
import { BigNumber } from 'ethers';
import { Token as TokenWrapper } from '@uniswap/sdk-core';
import { Pool, Position } from '@uniswap/v3-sdk';
import { UniswapV3LiquidityPositionContractData, UniswapV3LiquiditySlotContractData } from './uniV3interface';

const tokenIds = [
    362887, 358665, 335201, 321865, 310166, 310152, 308478,
    298970, 294852, 294846, 294843, 294835, 294314, 294310,
    294293, 294266, 294248, 294242, 291794, 289874, 289528,
    289168, 288664, 288646, 288278, 287707, 287639, 287571,
    287545, 287542, 287539, 286809, 286102, 283557, 283264,
    277877, 277686, 277360, 274630, 274627, 272624, 272623,
    272621, 272613, 272608, 271262, 270938, 270744, 270740,
    270505, 269729, 269727, 269139, 269004, 269001, 267276,
    265319, 265210, 265154, 264122, 263888, 263860, 263759,
    263751, 263745, 263742, 262129, 262126, 262124, 261744,
    261391, 261389, 261037, 261030, 261026, 261014, 257763,
    240544, 240532, 240505, 240387, 237137, 230485, 230476,
    227112, 226958, 226954, 226948, 226941, 226939, 226935,
    226934, 218508, 215169, 209461, 209427, 207017, 206508,
    204870, 204867
];


const NonfungiblePositionManagerAdress = "0xc36442b4a4522e871399cd717abdd847ab11fe88"
const UniswapV3Factory = "0x1F98431c8aD98523631AE4a59f267346ea31F984".toLowerCase()
const UniswapV3FactoryABI = JSON.parse(getABI('./src/assets/uniV3/UniswapV3Factory.json'));
const NonfungiblePositionManagerABI = JSON.parse(getABI('./src/assets/uniV3/NonfungiblePositionManager.json'));
const UniswapV3PoolABI = JSON.parse(getABI('./src/assets/uniV3/UniswapV3Pool.json'));
const ERC20Abi = JSON.parse(getABI('./src/assets/erc20_abi.json'));

export class UniswapV3PositionBuilder {
    private rpcURL = "https://rpc.ankr.com/eth";
    private web3 = new Web3(this.rpcURL);
    private factoryContract;
    private NonfungiblePositionManager;

    constructor() {
        this.factoryContract = new this.web3.eth.Contract(UniswapV3FactoryABI, UniswapV3Factory);
        this.NonfungiblePositionManager = new this.web3.eth.Contract(NonfungiblePositionManagerABI, NonfungiblePositionManagerAdress);

    }

    //  nonce uint96, operator address, token0 address, token1 address, fee uint24, tickLower int24, tickUpper int24, liquidity uint128, feeGrowthInside0LastX128 uint256, feeGrowthInside1LastX128 uint256, tokensOwed0 uint128, tokensOwed1 uint128
    async getPosition(tokenId: number) {
        const position = await this.NonfungiblePositionManager.methods.positions(tokenId).call();
        return position;
    }

    async getERC20Contract(tokenAddress: string) {
        const erc20contract = new this.web3.eth.Contract(ERC20Abi, tokenAddress);
        return erc20contract;
    }

    async getPoolAddress(token0Address: string, token1Address: string, fee: number) {
        const poolAddress = this.factoryContract.methods.getPool(token0Address, token1Address, fee).call();
        return poolAddress;
    }

    async getRange({
        position,
        slot,
        token0,
        token1,
        liquidity,
    }: {
        position: UniswapV3LiquidityPositionContractData;
        slot: UniswapV3LiquiditySlotContractData;
        token0: Token;
        token1: Token;
        liquidity: BigNumber;
    }) {
        const sqrtPriceX96 = slot.sqrtPriceX96; // sqrt(token1/token0) Q64.96 value
        const tickCurrent = Number(slot.tick);

        const tickLower = Number(position.tickLower);
        const tickUpper = Number(position.tickUpper);
        const feeBips = Number(position.fee);

        const networkId = 1;
        const t0Wrapper = new TokenWrapper(networkId, token0.address, token0.decimals, token0.symbol);
        const t1Wrapper = new TokenWrapper(networkId, token1.address, token1.decimals, token1.symbol);
        const pool = new Pool(t0Wrapper, t1Wrapper, feeBips, sqrtPriceX96.toString(), liquidity.toString(), tickCurrent);
        const positionZ = new Position({ pool, liquidity: position.liquidity.toString(), tickLower, tickUpper });

        const positionLowerBound = Number(positionZ.token0PriceLower.toFixed(4));
        const positionUpperBound = Number(positionZ.token0PriceUpper.toFixed(4));
        return [positionLowerBound, positionUpperBound];
    };

    async getSupplied ({
        position,
        slot,
        token0,
        token1,
        liquidity,
      }: {
        position: UniswapV3LiquidityPositionContractData;
        slot: UniswapV3LiquiditySlotContractData;
        token0: Token;
        token1: Token;
        liquidity: BigNumber;
      }) {
        const tickLower = Number(position.tickLower);
        const tickUpper = Number(position.tickUpper);
        const feeBips = Number(position.fee);
      
        const networkId = 1;
        const t0 = new TokenWrapper(networkId, token0.address, token0.decimals, token0.symbol);
        const t1 = new TokenWrapper(networkId, token1.address, token1.decimals, token1.symbol);
        const pool = new Pool(t0, t1, feeBips, slot.sqrtPriceX96.toString(), liquidity.toString(), Number(slot.tick));
        const pos = new Position({ pool, liquidity: position.liquidity.toString(), tickLower, tickUpper });
      
        //https://sourcegraph.com/github.com/Uniswap/v3-sdk/-/blob/src/entities/position.ts?L68
        const token0BalanceRaw = pos.amount0.multiply(10 ** token0.decimals).toFixed(0);
        const token1BalanceRaw = pos.amount1.multiply(10 ** token1.decimals).toFixed(0);
        //return [token0BalanceRaw, token1BalanceRaw];
        return [pos.amount0.toFixed(8), pos.amount1.toFixed(8)];
      };
      
    
    async buildPositionInfo(tokenID: number) {
        const position = await this.getPosition(tokenID);
        const fee = position.fee;
        const token0Address = position.token0.toLowerCase();
        const token1Address = position.token1.toLowerCase();

        const poolAddress = await this.getPoolAddress(token0Address, token1Address, fee);
        const poolContract = new this.web3.eth.Contract(UniswapV3PoolABI, poolAddress);
        const token0Contract = new this.web3.eth.Contract(ERC20Abi, token0Address);
        const token1Contract = new this.web3.eth.Contract(ERC20Abi, token1Address);
        const token0: Token = {
            address: token0Address,
            symbol: await token0Contract.methods.symbol().call(),
            decimals: Number(await token0Contract.methods.decimals().call())
        };
        const token1: Token = {
            address: token1Address,
            symbol: await token1Contract.methods.symbol().call(),
            decimals: Number(await token1Contract.methods.decimals().call())
        };
        const [slot, liquidity, feeGrowth0, feeGrowth1, ticksLower, ticksUpper, reserveRaw0, reserveRaw1] =
            await Promise.all([
                poolContract.methods.slot0().call(),
                poolContract.methods.liquidity().call(),
                poolContract.methods.feeGrowthGlobal0X128().call(),
                poolContract.methods.feeGrowthGlobal1X128().call(),
                poolContract.methods.ticks(Number(position.tickLower)).call(),
                poolContract.methods.ticks(Number(position.tickUpper)).call(),
                token0Contract.methods.balanceOf(poolAddress.toLowerCase()),
                token1Contract.methods.balanceOf(poolAddress.toLowerCase()),
            ]);
        const range = await this.getRange({position,slot,token0,token1,liquidity});
        const suppliedBalances = await this.getSupplied({ position, slot, token0, token1, liquidity });
        //console.log(suppliedBalances);
        console.log(`symbol:  ${token0.symbol}, balance: ${suppliedBalances[0]}`);
        console.log(`symbol:  ${token1.symbol}, balance: ${suppliedBalances[1]}`);
    }
}

const main = async () => {
    const service = new UniswapV3PositionBuilder();
    const result = await service.buildPositionInfo(362887);
}

main().then();
