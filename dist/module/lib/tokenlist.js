import { fetch } from 'cross-fetch';
export var ENV;
(function (ENV) {
    ENV[ENV["MainnetBeta"] = 101] = "MainnetBeta";
    ENV[ENV["Testnet"] = 102] = "Testnet";
    ENV[ENV["Devnet"] = 103] = "Devnet";
})(ENV || (ENV = {}));
export const CLUSTER_SLUGS = {
    'mainnet-beta': ENV.MainnetBeta,
    testnet: ENV.Testnet,
    devnet: ENV.Devnet,
};
export class GitHubTokenListResolutionStrategy {
    constructor() {
        this.repositories = [
            'https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json',
        ];
        this.resolve = () => {
            return queryJsonFiles(this.repositories);
        };
    }
}
export class CDNTokenListResolutionStrategy {
    constructor() {
        this.repositories = [
            'https://cdn.jsdelivr.net/gh/solana-labs/token-list@latest/src/tokens/solana.tokenlist.json',
        ];
        this.resolve = () => {
            return queryJsonFiles(this.repositories);
        };
    }
}
export class SolanaTokenListResolutionStrategy {
    constructor() {
        this.repositories = ['https://token-list.solana.com/solana.tokenlist.json'];
        this.resolve = () => {
            return queryJsonFiles(this.repositories);
        };
    }
}
const queryJsonFiles = async (files) => {
    const responses = (await Promise.all(files.map(async (repo) => {
        try {
            const response = await fetch(repo);
            return (await response.json());
        }
        catch {
            console.info(`@solana/token-registry: falling back to static repository.`);
            return undefined;
        }
    })));
    return responses
        .map((tokenlist) => tokenlist.tokens || [])
        .reduce((acc, arr) => acc.concat(arr), []);
};
export var Strategy;
(function (Strategy) {
    Strategy["GitHub"] = "GitHub";
    Strategy["Solana"] = "Solana";
    Strategy["CDN"] = "CDN";
})(Strategy || (Strategy = {}));
export class TokenListProvider {
    constructor() {
        this.resolve = async (strategy = Strategy.CDN) => {
            return new TokenListContainer(await TokenListProvider.strategies[strategy].resolve());
        };
    }
}
TokenListProvider.strategies = {
    [Strategy.GitHub]: new GitHubTokenListResolutionStrategy(),
    [Strategy.Solana]: new SolanaTokenListResolutionStrategy(),
    [Strategy.CDN]: new CDNTokenListResolutionStrategy(),
};
export class TokenListContainer {
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
            if (slug in CLUSTER_SLUGS) {
                return this.filterByChainId(CLUSTER_SLUGS[slug]);
            }
            throw new Error(`Unknown slug: ${slug}, please use one of ${Object.keys(CLUSTER_SLUGS)}`);
        };
        this.getList = () => {
            return this.tokenList;
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5saXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi90b2tlbmxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUVwQyxNQUFNLENBQU4sSUFBWSxHQUlYO0FBSkQsV0FBWSxHQUFHO0lBQ2IsNkNBQWlCLENBQUE7SUFDakIscUNBQWEsQ0FBQTtJQUNiLG1DQUFZLENBQUE7QUFDZCxDQUFDLEVBSlcsR0FBRyxLQUFILEdBQUcsUUFJZDtBQStDRCxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQTBCO0lBQ2xELGNBQWMsRUFBRSxHQUFHLENBQUMsV0FBVztJQUMvQixPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU87SUFDcEIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNO0NBQ25CLENBQUM7QUFFRixNQUFNLE9BQU8saUNBQWlDO0lBQTlDO1FBQ0UsaUJBQVksR0FBRztZQUNiLGdHQUFnRztTQUNqRyxDQUFDO1FBRUYsWUFBTyxHQUFHLEdBQUcsRUFBRTtZQUNiLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUM7SUFDSixDQUFDO0NBQUE7QUFFRCxNQUFNLE9BQU8sOEJBQThCO0lBQTNDO1FBQ0UsaUJBQVksR0FBRztZQUNiLDRGQUE0RjtTQUM3RixDQUFDO1FBRUYsWUFBTyxHQUFHLEdBQUcsRUFBRTtZQUNiLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUM7SUFDSixDQUFDO0NBQUE7QUFFRCxNQUFNLE9BQU8saUNBQWlDO0lBQTlDO1FBQ0UsaUJBQVksR0FBRyxDQUFDLHFEQUFxRCxDQUFDLENBQUM7UUFFdkUsWUFBTyxHQUFHLEdBQUcsRUFBRTtZQUNiLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMzQyxD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