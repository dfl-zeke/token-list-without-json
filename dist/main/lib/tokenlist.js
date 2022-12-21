"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenListContainer = exports.TokenListProvider = exports.Strategy = exports.SolanaTokenListResolutionStrategy = exports.CDNTokenListResolutionStrategy = exports.GitHubTokenListResolutionStrategy = exports.CLUSTER_SLUGS = exports.ENV = void 0;
const cross_fetch_1 = require("cross-fetch");
var ENV;
(function (ENV) {
    ENV[ENV["MainnetBeta"] = 101] = "MainnetBeta";
    ENV[ENV["Testnet"] = 102] = "Testnet";
    ENV[ENV["Devnet"] = 103] = "Devnet";
})(ENV = exports.ENV || (exports.ENV = {}));
exports.CLUSTER_SLUGS = {
    'mainnet-beta': ENV.MainnetBeta,
    testnet: ENV.Testnet,
    devnet: ENV.Devnet,
};
class GitHubTokenListResolutionStrategy {
    constructor() {
        this.repositories = [
            'https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json',
        ];
        this.resolve = () => {
            return queryJsonFiles(this.repositories);
        };
    }
}
exports.GitHubTokenListResolutionStrategy = GitHubTokenListResolutionStrategy;
class CDNTokenListResolutionStrategy {
    constructor() {
        this.repositories = [
            'https://cdn.jsdelivr.net/gh/solana-labs/token-list@latest/src/tokens/solana.tokenlist.json',
        ];
        this.resolve = () => {
            return queryJsonFiles(this.repositories);
        };
    }
}
exports.CDNTokenListResolutionStrategy = CDNTokenListResolutionStrategy;
class SolanaTokenListResolutionStrategy {
    constructor() {
        this.repositories = ['https://token-list.solana.com/solana.tokenlist.json'];
        this.resolve = () => {
            return queryJsonFiles(this.repositories);
        };
    }
}
exports.SolanaTokenListResolutionStrategy = SolanaTokenListResolutionStrategy;
const queryJsonFiles = async (files) => {
    const responses = (await Promise.all(files.map(async (repo) => {
        try {
            const response = await cross_fetch_1.fetch(repo);
            return (await response.json());
        }
        catch (_a) {
            console.info(`@solana/token-registry: falling back to static repository.`);
            return undefined;
        }
    })));
    return responses
        .map((tokenlist) => tokenlist.tokens || [])
        .reduce((acc, arr) => acc.concat(arr), []);
};
var Strategy;
(function (Strategy) {
    Strategy["GitHub"] = "GitHub";
    Strategy["Solana"] = "Solana";
    Strategy["CDN"] = "CDN";
})(Strategy = exports.Strategy || (exports.Strategy = {}));
class TokenListProvider {
    constructor() {
        this.resolve = async (strategy = Strategy.CDN) => {
            return new TokenListContainer(await TokenListProvider.strategies[strategy].resolve());
        };
    }
}
exports.TokenListProvider = TokenListProvider;
TokenListProvider.strategies = {
    [Strategy.GitHub]: new GitHubTokenListResolutionStrategy(),
    [Strategy.Solana]: new SolanaTokenListResolutionStrategy(),
    [Strategy.CDN]: new CDNTokenListResolutionStrategy(),
};
class TokenListContainer {
    constructor(tokenList) {
        this.tokenList = tokenList;
        this.filterByTag = (tag) => {
            return new TokenListContainer(this.tokenList.filter((item) => (item.tags || []).includes(tag)));
        };
        this.filterByChainId = (chainId) => {
            return new TokenListContainer(this.tokenList.filter((item) => item.chainId === chainId));
        };
        this.excludeByChainId = (chainId) => {
            return new TokenListContainer(this.tokenList.filter((item) => item.chainId !== chainId));
        };
        this.excludeByTag = (tag) => {
            return new TokenListContainer(this.tokenList.filter((item) => !(item.tags || []).includes(tag)));
        };
        this.filterByClusterSlug = (slug) => {
            if (slug in exports.CLUSTER_SLUGS) {
                return this.filterByChainId(exports.CLUSTER_SLUGS[slug]);
            }
            throw new Error(`Unknown slug: ${slug}, please use one of ${Object.keys(exports.CLUSTER_SLUGS)}`);
        };
        this.getList = () => {
            return this.tokenList;
        };
    }
}
exports.TokenListContainer = TokenListContainer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5saXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi90b2tlbmxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQW9DO0FBRXBDLElBQVksR0FJWDtBQUpELFdBQVksR0FBRztJQUNiLDZDQUFpQixDQUFBO0lBQ2pCLHFDQUFhLENBQUE7SUFDYixtQ0FBWSxDQUFBO0FBQ2QsQ0FBQyxFQUpXLEdBQUcsR0FBSCxXQUFHLEtBQUgsV0FBRyxRQUlkO0FBK0NZLFFBQUEsYUFBYSxHQUEwQjtJQUNsRCxjQUFjLEVBQUUsR0FBRyxDQUFDLFdBQVc7SUFDL0IsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPO0lBQ3BCLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTTtDQUNuQixDQUFDO0FBRUYsTUFBYSxpQ0FBaUM7SUFBOUM7UUFDRSxpQkFBWSxHQUFHO1lBQ2IsZ0dBQWdHO1NBQ2pHLENBQUM7UUFFRixZQUFPLEdBQUcsR0FBRyxFQUFFO1lBQ2IsT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FBQTtBQVJELDhFQVFDO0FBRUQsTUFBYSw4QkFBOEI7SUFBM0M7UUFDRSxpQkFBWSxHQUFHO1lBQ2IsNEZBQTRGO1NBQzdGLENBQUM7UUFFRixZQUFPLEdBQUcsR0FBRyxFQUFFO1lBQ2IsT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FBQTtBQVJELHdFQVFDO0FBRUQsTUFBYSxpQ0FBaUM7SUFBOUM7UUFDRSxpQkFBWSxHQUFHLENBQUMscURBQXFELENBQUMsQ0FBQztRQUV2RSxZQUFPLEdBQUcsR0FBRyxFQUFFO1lBQ2IsT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FBQTtBQU5E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