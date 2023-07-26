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

//for transaction
export function bigIntToBuffer(data: bigint | undefined) {
  if (!data) {
    return Buffer.from([])
  }
  const hexStr = data.toString(16)
  const pad = hexStr.padStart(64)
  const hashHex = Buffer.from(pad, 'hex')

  return hashHex
}

export interface PlainTransaction {
  address: string // raw
  lt: string // bigint
  hash: string // base64
  data: string // base64

  prevLt: string
  prevHash: string
}



export function msgToStr(msg: Cell | undefined){
  if (!msg) {
	return
  }
  const body = msg.asSlice()
  if (body.remainingBits < 32) {
    return undefined
  }
  const opcode = body.loadUint(32)
  if (opcode !== 0) {
    return 'OP: 0x' + opcode.toString(16)
  }
  if (body.remainingBits < 8 || body.remainingBits % 8 !== 0) {
    return undefined
  }
  //console.log('body.remainingBits', body.remainingBits)
  return body.loadBuffer(body.remainingBits / 8).toString('utf-8')
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

	//transactions
	const address = Address.parse('EQCjk1hh952vWaE9bRguFkAhDAL5jj3xj9p0uPWrFBq_GEMS');
    const accountState = await client.getAccountState(address, master.last)
	if (!accountState.lastTx) {
		return
	}
	
	let lastTxLt = accountState.lastTx.lt.toString()
	let lastTxHash = bigIntToBuffer(accountState.lastTx.hash)
	
	let limit = 16 as number 
	const temp = await client.getAccountTransactions(address,lastTxLt,lastTxHash,limit)
	
	//console.log(temp);
	
	const cell = Cell.fromBoc(temp.transactions)
	const ltToHash: Map<string, Buffer> = new Map()
		ltToHash.set(lastTxLt, lastTxHash)

	const transactions = cell.map((c) => {
		const tx = loadTransaction(c.beginParse())
		ltToHash.set(tx.prevTransactionLt.toString(), bigIntToBuffer(tx.prevTransactionHash))
		return tx
	})
	
	const txes = transactions.map((tx, i): PlainTransaction => {
		const lt = tx.lt.toString()
		const hash = ltToHash.get(lt)

		if (!hash) {
			throw new Error('Tx hash not found')
		}

		return Object.freeze({
			address: address.toString(),
			lt,
			hash: hash.toString('hex'),
			data: cell[i].toBoc().toString('base64'),
			prevLt: tx.prevTransactionLt.toString(),
			prevHash: bigIntToBuffer(tx.prevTransactionHash).toString('hex'),
		})
	})
	
	
	for (const transaction of txes) {
		const txCell = Cell.fromBoc(Buffer.from(transaction.data, 'base64'))[0]
		const data = loadTransaction(txCell.asSlice())
		//console.log("Type: ",data.inMessage?.info.type); //external and internal
		//console.log("Addr: ",data.inMessage?.info.src);  // from who tx
		//console.log("Msg: ", msgToStr(data.inMessage?.body));
		//console.log("Date:",new Date(data.now*1000));
		if (data.inMessage?.info.type !== 'internal') {
			continue
		}
		try {
		if(msgToStr(data.inMessage?.body) == 'Offer fee') {
			const nftArr = await get_offer_data(data.inMessage?.info.src.toString(),client,master)
			console.log("NFT Sold Address: ", nftArr?.[0]);
			console.log("New Owner Address: ",nftArr?.[1]);
			console.log("Price: ",nftArr?.[2]);
			console.log("Sale Type: ",nftArr?.[3]);
		} else{
			const nftArr = await get_sale_data(data.inMessage?.info.src.toString(),client,master)
			console.log("NFT Sold Address: ", nftArr?.[0]);
			console.log("New Owner Address: ",nftArr?.[1]);
			console.log("Price: ",nftArr?.[2]);
			console.log("Sale Type: ",nftArr?.[3]);
		}
		} catch {continue}
		
	}		

	
}

main()













//Help:
//https://tonscan.org/address/EQCjk1hh952vWaE9bRguFkAhDAL5jj3xj9p0uPWrFBq_GEMS