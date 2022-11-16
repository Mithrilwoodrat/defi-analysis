import { readFileSync } from 'fs';
import path from 'path';
import { resolve } from 'path';

const getABI = (fileName:string) => {
    
    let abs_path = resolve(fileName)
    let abi = readFileSync(abs_path, 'utf8');
    return abi;
}

export default getABI