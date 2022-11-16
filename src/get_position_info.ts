import getABI from './utils/get_abi';
import Web3 from 'web3';

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

const NonfungiblePositionManagerABI = JSON.parse(getABI('./src/assets/uniV3/NonfungiblePositionManager.json'));

const getPosition = async (tokenId:number) => {
    const web3 = new Web3("https://rpc.ankr.com/eth");
    const NonfungiblePositionManager = new web3.eth.Contract(NonfungiblePositionManagerABI, NonfungiblePositionManagerAdress);
    const position = NonfungiblePositionManager.methods.postions(tokenId).call();
    console.log(position);
}

const main = async () => {
    const result = await getPosition(204867);
}

main().then();
