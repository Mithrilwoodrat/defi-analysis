import getABI from './utils/get_abi';
import Web3 from 'web3';
const InputDataDecoder = require('ethereum-input-data-decoder');


const NonfungiblePositionManagerAdress = "0xc36442b4a4522e871399cd717abdd847ab11fe88"

const NonfungiblePositionManagerABI = JSON.parse(getABI('./src/assets/uniV3/NonfungiblePositionManager.json'));

// (address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256)

// function mint(MintParams calldata params)
// struct MintParams {
//     address token0;
//     address token1;
//     uint24 fee;
//     int24 tickLower;
//     int24 tickUpper;
//     uint256 amount0Desired;
//     uint256 amount1Desired;
//     uint256 amount0Min;
//     uint256 amount1Min;
//     address recipient;
//     uint256 deadline;
// }
const decodeMintTx = async (txdata:string) => {
    // const web3 = new Web3("https://rpc.ankr.com/eth");
    // const decoded = web3.eth.abi.decodeParameters(
    //     NonfungiblePositionManagerABI,
    //     txdata.slice(10));

    const decoder = new InputDataDecoder('./src/assets/uniV3/NonfungiblePositionManager.json');

    const result = decoder.decodeData(txdata);
    return result;
}

const main = async () => {
    const result = await decodeMintTx("0x883164560000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c599000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000bb8000000000000000000000000000000000000000000000000000000000003e9b8000000000000000000000000000000000000000000000000000000000003ee2c000000000000000000000000000000000000000000000000000000008321560000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000083215600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000026fcbd3afebbe28d0a8684f790c48368d21665b500000000000000000000000000000000000000000000000000000000636cfa37");
    console.log(result);
}

main().then();