# TON Speedrun 

## 🚩 Challenge 6: Analyzing NFT sales on the Getgems marketplace

🎫 Analyzing NFT sales on the Getgems marketplace. We will get information about sales through get-methods of smart contracts

🌟 Script that will return the latest sales from the marketplace and distinguish between types of sales.

💬 Meet other builders working in TON and get help in the [official dev chat](https://t.me/tondev_eng) or [TON learn tg](https://t.me/ton_learn)

---

# Checkpoint 0:  📦 Install 📚

Required: 
* [Git](https://git-scm.com/downloads)
* [Node](https://nodejs.org/en/download/) (Use Version 18 LTS)
* [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)

(⚠️ Don't install the linux package `yarn` make sure you install yarn with `npm i -g yarn` or even `sudo npm i -g yarn`!)

```sh
git clone https://github.com/romanovichim/TONQuest6.git
```
```sh
cd challenge-6
yarn install
```
---


# Checkpoint 1: 🔬 Analyze Logic 😮

Understanding how smart contracts work, you can get almost any information from the network. In TON, the actor model, respectively, in order to understand where to get information, you need to understand the chain of smart contracts.

Let's try to go this way for the Getgems marketplace, take some NFT and, moving from it, try to find the information we need.


> In this quest, you have to search a lot for addresses in the TON network, if you have problems with this, at the end of each script there will be a hint - the correct address with which the script will work - but this is an extreme case.

---

# Checkpoint 2: 📡 Search for Marketplace Contract 📡

So we have a clean slate in front of us and we need to start from something. The simplest thing seems to be to take the address of the NFT from the marketplace and try to look at it in detail.

Go to https://getgems.io/ and search any NFT collection, make sure that NFT has sales (history at the very bottom of the page)
Example:

![image](https://user-images.githubusercontent.com/18370291/255934735-e85211b6-93cf-4eef-a307-dac828f2e10e.png)


Find Getgems Marketplace in the sales contract

![image](https://user-images.githubusercontent.com/18370291/255934320-03f1ca5c-4379-4444-aca0-d81be13aa50d.png)

As you can understand, royalties from each sale come here, which means that we can track all sales of the Getgems marketplace, getting the addresses of smart contracts for the sale from the transactions of the Getgems marketplace contract, and then take information about the sale. 

Run the script and check in the exporter https://tonscan.org/ that the transactions are correct.


```sh
yarn getmarketplace
```
Result:

![image](https://user-images.githubusercontent.com/18370291/256162939-064223c3-c25e-47ea-86bf-36d9cd80b13c.png)

---

# Checkpoint 3: 👩‍🚀 Search for Types of sales 👩‍🚀

Now we have all the sales, but they are different, I’ll tell you right away that Getgems have:
- Simple Sale
- Offer
- Auction

By making requests to the Getmethods of these smart contracts, you can get information about what NFT is being sold for and at what price. Get methods they have the following:

- Simple Sale - get_sale_data()
- Offer - get_offer_data()
- Auction - get_sale_data()

Find all three types of addresses in the marketplace transactions in the scripts below and run them:

Simple Sale:

```sh
yarn getsale
```

Offer:

```sh
yarn getoffer
```

Auction:

```sh
yarn getauction
```

---

# Checkpoint 4:🎩  Query last sales  🎩

Let's collect everything we learned in past checkpoints and display information about the last NFTs sold

```sh
yarn getnftsold
```

Result:

![image](https://user-images.githubusercontent.com/18370291/256186681-0325df41-8fa2-4e90-9747-cbbea13ff3b5.png)


Cool, but not enough, an additional script that would display at the NFT address what kind of collection and NFT would be in place.

---


# ⚔️ Side Quests

Quick results are great, but to play longer, enjoy the ecosystem, I suggest you the following tutorials:
- [Introductory](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/requests/ADNL/adnlintro.md) about ADNL and connecting to it
- Run [Get Method](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/requests/ADNL/adnlgetsale.md) and how sales contracts work 
- [Collect](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/requests/ADNL/adnltxes.md) transactions on ADNL


# 🏆 Reward 

Congratulations on successfully completing this challenge! Before we conclude, let's take a quick look at the exciting reward awaiting you from the <a target="_blank" href="https://getgems.io/collection/EQCHmSDdqcpV7EWe0BCsj6ZbH-3z6mKWJSeVEUHmfEug-ONQ">"TON Speedrun"</a> collection:

<img style="border-radius: 10pt; margin: 25pt auto; display: block;" width="40%" src="https://ton-devrel.s3.eu-central-1.amazonaws.com/tonspeedrun/4/image.jpg">

Ready to claim your reward? Just scan the QR code, which can be generated using the script below:

```sh
yarn reward
```