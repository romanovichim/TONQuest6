import { LiteClient, LiteRoundRobinEngine, LiteSingleEngine, LiteEngine } from "ton-lite-client";
import { Address, Cell, loadTransaction,parseTuple, TupleReader } from "ton-core";
import { getConfig,liteserverConfig,serverID } from './config/networkConfig'


function intToIP(int: number) {
    var part1 = int & 255;
    var part2 = ((int >> 8) & 255);
    var part3 = ((int >> 16) & 255);
    var part4 = ((int >> 24) & 255);

    return part4 + "." + part3 + "." + part2 + "." + part1;
}




export const get_sale_data = async(addrStr: string,client: any,master: any) => {
	let executed = await client.runMethod(Address.parse(addrStr), 'get_sale_data', Buffer.alloc(0), master.last);
	if (!executed.result) {
		return
	}
	let resultTuple = parseTuple(Cell.fromBoc(Buffer.from(executed.result, 'base64'))[0])
	let parsed = new TupleReader(resultTuple);
	//int 0x46495850,    ;; fix price sale ("FIXP")
	//int is_complete 
	//int created_at
	//slice marketplace_address
	//slice nft_address
	//slice nft_owner_address
	//int full_price
	//slice marketplace_fee_address
	//int marketplace_fee
	//slice royalty_address
	//int royalty_amount
	let p_fixp = parsed.readBigNumber();
	let p_is_complete = parsed.readBigNumber();
	let p_created_at = parsed.readBigNumber();
	let p_marketplace_address = parsed.readAddress();
	let p_nft_address = parsed.readAddress();
	let p_nft_owner_address = parsed.readAddress();
	let p_full_price = parsed.readBigNumber();
	//let p_marketplace_fee_address = parsed.readAddress();
	//let p_marketplace_fee = parsed.readBigNumber();
	//let p_royalty_address = parsed.readAddress();
	//let p_royalty_amount = parsed.readBigNumber();
	
	//const [str, num] = getValues();
	//condition ? true_expression : false_expression
	return [p_nft_address, p_nft_owner_address,p_full_price,resultTuple.length == 20 ? "bid":"sale"] as const;
	//return p_nft_address;
}

export const get_offer_data = async(addrStr: string,client: any,master: any) => {
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
	let p_marketplace_fee_address = parsed.readAddress();
	let p_marketplace_factor = parsed.readBigNumber();
	let p_marketplace_base = parsed.readBigNumber();
	let p_royalty_address = parsed.readAddress();
	let p_royalty_factor = parsed.readBigNumber();
	let p_royalty_base = parsed.readBigNumber();
	let p_profit_price = parsed.readBigNumber();
	
	return [p_nft_address, p_offer_owner_address,p_full_price,"offer"] as const;
	//return p_nft_address
}

const get_bid_data = async(addrStr: string,client: any,master: any) => {
	// тестовая функция - в реальности нужно соединить её с sale
	let executed = await client.runMethod(Address.parse(addrStr), 'get_sale_data', Buffer.alloc(0), master.last);
	if (!executed.result) {
		return
	}
	let resultTuple = parseTuple(Cell.fromBoc(Buffer.from(executed.result, 'base64'))[0])
	//кол-во
	//console.log(resultTuple.length)
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
	let p_nft_addr = parsed.readAddress();
	let p_nft_owner = parsed.readAddress();
	let p_last_bid = parsed.readBigNumber();
	
	return [p_nft_addr, p_nft_owner,p_last_bid] as const;
	}

export const getMeth = async() => {
	try { 
	const server = await getConfig() as liteserverConfig
	//console.log(server.ip)
    const engines: LiteEngine[] = [];
    engines.push(new LiteSingleEngine({
       host: `tcp://${intToIP(server.ip)}:${server.port}`,
        publicKey: Buffer.from(server.id.key, 'base64'),
    }));
    const engine: LiteEngine = new LiteRoundRobinEngine(engines);
    const client = new LiteClient({ engine });
	const master = await client.getMasterchainInfo();
	//let res = await client.runMethod(Address.parse('EQCkR1cGmnsE45N4K0otPl5EnxnRakmGqeJUNua5fkWhales'), 'get_staking_status', Buffer.alloc(0), master.last);
	//let executed = await client.runMethod(Address.parse('UQApA79Qt8VEOeTfHu9yKRPdJ_dADvspqh5BqV87PgWD998f'), 'get_collection_data', Buffer.alloc(0), master.last);
	//res.result.toString('base64') - это возвращает runMethod
	//console.log(executed.result)
	//if (!executed.result) {
	//	return
	//}
	//let resultTuple = parseTuple(Cell.fromBoc(Buffer.from(executed.result, 'base64'))[0])
	//let parsed = new TupleReader(resultTuple);
	//console.log(parsed)
	//let nextItemIndex = parsed.readBigNumber();
	//let contentRoot = parsed.readCell();
	//let owner = parsed.readAddress();
	//console.log('nextItemIndex', nextItemIndex.toString());
	//console.log('contentRoot', contentRoot);
	//console.log('owner', owner);
	
	console.log('-------------------------------------------');
	// get_sales_data
	//let executed = await client.runMethod(Address.parse('EQCJYX0kLXYSVKb6vwVCYUUyUdQI-mFQvTkEB5WeuFMOIoM8'), 'get_sale_data', Buffer.alloc(0), master.last);
	//if (!executed.result) {
	//	return
	//}
	//console.log(executed)
	//let resultTuple = parseTuple(Cell.fromBoc(Buffer.from(executed.result, 'base64'))[0])
	
	//let parsed = new TupleReader(resultTuple);
	//console.log(parsed)
	//let item1 = parsed.readBigNumber();
	//let item2 = parsed.readBigNumber();
	//console.log('nextItemIndex', item1.toString());
	//console.log('nextItemIndex', item2.toString());
	
	
	let num = await	get_sale_data('EQCJYX0kLXYSVKb6vwVCYUUyUdQI-mFQvTkEB5WeuFMOIoM8',client,master);
	//let num = await	get_offer_data('EQD6evpHiSqrdWgnO2-FTJDsncfCgteuYMMq2U8B4DHdoODV',client,master);
	//let num = await	get_sale_data('EQBLQRjs7unG_ruz3Ismly_3_aXFD_wthmbTSUtdh6te4B1e',client,master);
	console.log(num);
	}
	catch (e: any) { 
		console.log(e.message);
	}
}

//getMeth()