// Mainnet DAI, Optimism and Arbitrium Rollup Contracts with local addresses
module.exports = {
  1666600000: {
    contracts: {
      AUCTIONS: {
        address: "0x13a65B9F8039E2c032Bc022171Dc05B30c3f2892",
        abi: require("./abis/SaleAuction.json"),
      },
      BANK: {
        address: "0xA9cE83507D872C5e1273E745aBcfDa849DAA654F",
        abi: require("./abis/Bank.json"),
      },
      GARDENS: {
        address: "0xDB30643c71aC9e2122cA0341ED77d09D5f99F924",
        abi: require("./abis/MasterGardener.json"),
      },
      JEWEL: {
        address: "0x72Cb10C6bfA5624dD07Ef608027E366bd690048F",
        abi: require("./abis/ERC20.json"),
      },
      HERO: {
        address: "0x5F753dcDf9b1AD9AabC1346614D1f4746fd6Ce5C",
        abi: require("./abis/hero.json"),
      },
    },
  },
};
