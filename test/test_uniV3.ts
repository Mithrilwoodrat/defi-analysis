import { UniswapV3PositionBuilder } from "../src/uniV3/get_position_info";
import { getAllResults } from "../src/uniV3/get_nft_holder";


const main = async () => {
    const result = await getAllResults("0x26fcbd3afebbe28d0a8684f790c48368d21665b5", "0xc36442b4a4522e871399cd717abdd847ab11fe88");
    const tokenIds = result.map((item:any) => Number(item.token_id));
    const service = new UniswapV3PositionBuilder();
    for (let tokenID of tokenIds) {
        await service.buildPositionInfo(tokenID);
        console.log("-----------------");
    }
}

main().then();