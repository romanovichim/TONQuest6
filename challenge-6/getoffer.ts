import { LiteClient, LiteRoundRobinEngine, LiteSingleEngine, LiteEngine } from "ton-lite-client";
import { Address, Cell, loadTransaction,parseTuple, TupleReader, beginCell  } from "ton-core";
import { Buffer } from 'buffer';

function intToIP(int: number) {
    var part1 = int & 255;
    var part2 = ((int >> 8) & 255);
    var part3 = ((int >> 16) & 255);
    var part4 = ((int >> 24) & 255);

    return part4 + "." + part3 + "." + part2 + "." + part1;
}

let server = {
    "ip": -2018145068,
    "port": 13206,
    "id": {
		"@type": "pub.ed25519",
        "key": "K0t3+IWLOXHYMvMcrGZDPs+pn58a17LFbnXoQkKc2xw="
    }
}

async function main() {
    const engines: LiteEngine[] = [];
    engines.push(new LiteSingleEngine({
        host: `tcp://${intToIP(server.ip)}:${server.port}`,
        publicKey: Buffer.from(server.id.key, 'base64'),
    }));
    const engine: LiteEngine = new LiteRoundRobinEngine(engines);
    const client = new LiteClient({ engine });
    const master = await client.getMasterchainInfo()

	
	//GET METHOD
	
	const addrStr="EQAWTzdusYC9gY3MAXLoEKzdSnYYBGOK9f2vMEiQfUcQOzsQ";
	let executed = await client.runMethod(Address.parse(addrStr), 'get_offer_data', Buffer.alloc(0), master.last);
	if (!executed.result) {
		return
	}
	let resultTuple = parseTuple(Cell.fromBoc(Buffer.from(executed.result, 'base64'))[0])
	let parsed = new TupleReader(resultTuple);
	//int offer
	//int is_complete == 1
	//int created_at 
	//int finish_at
	//slice marketplace_address
	//slice nft_address
	//slice offer_owner_address
	//int full_price
	//slice marketplace_fee_address
	//int marketplace_factor
	//int marketplace_base
	//slice royalty_address
	//int royalty_factor
	//int royalty_base
	//int profit_price
	
	
	let p_offer = parsed.readBigNumber();
	let p_is_complete = parsed.readBigNumber();
	let p_created_at = parsed.readBigNumber(); 
	let p_finish_at = parsed.readBigNumber();
	let p_marketplace_address = parsed.readAddress();
	let p_nft_address = parsed.readAddress();
	let p_offer_owner_address = parsed.readAddress();
	let p_full_price = parsed.readBigNumber();
	//let p_marketplace_fee_address = parsed.readAddress();
	//let p_marketplace_factor = parsed.readBigNumber();
	//let p_marketplace_base = parsed.readBigNumber();
	//let p_royalty_address = parsed.readAddress();
	//let p_royalty_factor = parsed.readBigNumber();
	//let p_royalty_base = parsed.readBigNumber();
	//let p_profit_price = parsed.readBigNumber();
	console.log("NFT Address: ", p_nft_address);
	console.log("Full price: ", p_full_price);
	

	
}

main()













//Help:
//https://tonscan.org/address/EQAWTzdusYC9gY3MAXLoEKzdSnYYBGOK9f2vMEiQfUcQOzsQ