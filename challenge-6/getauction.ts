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
	
	const addrStr="EQBLQRjs7unG_ruz3Ismly_3_aXFD_wthmbTSUtdh6te4B1e";
	let executed = await client.runMethod(Address.parse(addrStr), 'get_sale_data', Buffer.alloc(0), master.last);
	if (!executed.result) {
		return
	}
	let resultTuple = parseTuple(Cell.fromBoc(Buffer.from(executed.result, 'base64'))[0])
	let parsed = new TupleReader(resultTuple);
	//int auc 0x415543, ;; 1 nft aucion ("AUC")
    //int end?, ;; 2
    //int end_time, ;; 3
    //slice  mp_addr, ;; 4
    //slice nft_addr, ;; 5
    //slice nft_owner, ;; 6
    //int last_bid, ;; 7
	let p_auc = parsed.readBigNumber();
	let p_end = parsed.readBigNumber();
	let p_end_time = parsed.readBigNumber(); 
	let p_mp_addr = parsed.readAddress();
	let p_nft_address = parsed.readAddress();
	let p_nft_owner = parsed.readAddress();
	let p_last_bid = parsed.readBigNumber();
	console.log("NFT Address: ", p_nft_address);
	console.log("Full price: ", p_last_bid);
	

	
}

main()













//Help:
//https://tonscan.org/address/EEQBLQRjs7unG_ruz3Ismly_3_aXFD_wthmbTSUtdh6te4B1e