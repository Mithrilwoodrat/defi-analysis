import axios from 'axios';
import * as  fs from 'fs';
require("dotenv").config();

const APIKEY: string = process.env.ChainBaseAPI || '';

export const GetAccountNFTs = async (address: string, contract_address :string, page:number=1) => {
    const requestUrl = `https://api.chainbase.online/v1/account/nfts?chain_id=1&address=${address}&contract_address=${contract_address}&page=${page}&limit=100`;
    let data:any = {
    };
    if (page > 0 ) {
        data["page"] = page ;
        data["limit"] = 100;
    }
    
    const response = await axios.get(requestUrl, {
        headers: {
            "X-API-Key": APIKEY,
            "Content-Type": "application/json"
        }
    });

    const result = response.data;
    return result;
};

export const getAllResults = async(address: string, contract_address :string,) => {
    const result = await GetAccountNFTs(address, contract_address);
    const InitData= result.data
    const total = result.count;
    console.log("total: ", total);
    let cnt =100;
    let page = 1;
    let has_next = true;
    let resultArr: Object[] = [];
    resultArr.push(...InitData);
    while(cnt < total && has_next) {
        page +=1;
        cnt += 100;
        console.log("process result page: ", page);
        const { data } = await GetAccountNFTs(address, contract_address, page);
        if ( data.next_page == undefined) {
            has_next=false;
            break;
        }
        resultArr.push(...data.data);
    }
    return resultArr;
} 

const main = async () => {
    const result = await getAllResults("0x26fcbd3afebbe28d0a8684f790c48368d21665b5", "0xc36442b4a4522e871399cd717abdd847ab11fe88");
    const tokenIds = result.map((item:any) => Number(item.token_id));
    console.log(tokenIds);
}

//main().then();