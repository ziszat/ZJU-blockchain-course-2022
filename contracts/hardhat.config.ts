import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'http://localhost:8545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        '746b6585c73b54b832219f639d313e92b5d5d0e68f584bf30fe79f75741235fc',
        '7881d0cb23ed9f6ef21b30942fbb698d7bb6e6d395018662d71c3f80d983fe19',
        '8e3ccc0bc41646304236993780ef075a61afaf1fe8882920e27390f4ad725ea6',
        '84088dcfe3999f49cf908f5c8955fcb15af55081aa1d46d21568a524f2bfcf17',
        '40a3c68d57001c408f590513acc7a0d8ccd163a19da84f3a8c7fd6ed87a15e64',
        '449e2470d4d9dc1fb36cdce8d847cedd0deec75f283b7542161b72a3aa178a23',
        'e35600a87a6dc31319a8de89e141c2265569bd417a555b702a5404dccc2320a9',
        'b4ca1e67a901ab16636e256abacfd6e889132eb1e8e20e5afbef589db015765a',
        '5c5f1a5c921c9980bfafe0ef45293a53a0f10c5ecf3b27403740cba1ef49d950',
        'da10089d75704b05ab4b37b304fd0c312e4021a18f88b9997b83ae76560d4397',
      ]
    },
  },
};

export default config;
