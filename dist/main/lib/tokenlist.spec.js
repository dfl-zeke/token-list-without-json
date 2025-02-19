"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const ava_1 = __importDefault(require("ava"));
const tokenlist_1 = require("./tokenlist");
ava_1.default('Token list is filterable by a tag', async (t) => {
    const list = (await new tokenlist_1.TokenListProvider().resolve(tokenlist_1.Strategy.CDN))
        .filterByChainId(tokenlist_1.ENV.MainnetBeta)
        .filterByTag('nft')
        .getList();
    t.false(list.some((item) => item.symbol === 'SOL'));
});
ava_1.default('Token list can exclude by a tag', async (t) => {
    const list = (await new tokenlist_1.TokenListProvider().resolve(tokenlist_1.Strategy.CDN))
        .filterByChainId(tokenlist_1.ENV.MainnetBeta)
        .excludeByTag('nft')
        .getList();
    t.false(list.some((item) => item.tags === ['nft']));
});
ava_1.default('Token list can exclude by a chain', async (t) => {
    const list = (await new tokenlist_1.TokenListProvider().resolve(tokenlist_1.Strategy.CDN))
        .excludeByChainId(tokenlist_1.ENV.MainnetBeta)
        .getList();
    t.false(list.some((item) => item.chainId === tokenlist_1.ENV.MainnetBeta));
});
ava_1.default('Token list returns new object upon filter', async (t) => {
    const list = await new tokenlist_1.TokenListProvider().resolve(tokenlist_1.Strategy.CDN);
    const filtered = list.filterByChainId(tokenlist_1.ENV.MainnetBeta);
    t.true(list !== filtered);
    t.true(list.getList().length !== filtered.getList().length);
});
ava_1.default('Token list throws error when calling filterByClusterSlug with slug that does not exist', async (t) => {
    const list = await new tokenlist_1.TokenListProvider().resolve(tokenlist_1.Strategy.CDN);
    const error = await t.throwsAsync(async () => list.filterByClusterSlug('whoop'), { instanceOf: Error });
    t.is(error.message, `Unknown slug: whoop, please use one of ${Object.keys(tokenlist_1.CLUSTER_SLUGS)}`);
});
ava_1.default('Token list is a valid json', async (t) => {
    t.notThrows(() => {
        const content = fs_1.default
            .readFileSync('./src/tokens/solana.tokenlist.json')
            .toString();
        JSON.parse(content.toString());
    });
});
ava_1.default('Token list does not have duplicate entries', async (t) => {
    const list = await new tokenlist_1.TokenListProvider().resolve(tokenlist_1.Strategy.CDN);
    list
        .filterByChainId(tokenlist_1.ENV.MainnetBeta)
        .getList()
        .reduce((agg, item) => {
        if (agg.has(item.address)) {
            console.log(item.address);
        }
        t.false(agg.has(item.address));
        agg.set(item.address, item);
        return agg;
    }, new Map());
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5saXN0LnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3Rva2VubGlzdC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNENBQW9CO0FBRXBCLDhDQUF1QjtBQUV2QiwyQ0FNcUI7QUFFckIsYUFBSSxDQUFDLG1DQUFtQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNwRCxNQUFNLElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSw2QkFBaUIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxvQkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQy9ELGVBQWUsQ0FBQyxlQUFHLENBQUMsV0FBVyxDQUFDO1NBQ2hDLFdBQVcsQ0FBQyxLQUFLLENBQUM7U0FDbEIsT0FBTyxFQUFFLENBQUM7SUFFYixDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN0RCxDQUFDLENBQUMsQ0FBQztBQUVILGFBQUksQ0FBQyxpQ0FBaUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDbEQsTUFBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksNkJBQWlCLEVBQUUsQ0FBQyxPQUFPLENBQUMsb0JBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUMvRCxlQUFlLENBQUMsZUFBRyxDQUFDLFdBQVcsQ0FBQztTQUNoQyxZQUFZLENBQUMsS0FBSyxDQUFDO1NBQ25CLE9BQU8sRUFBRSxDQUFDO0lBRWIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RELENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFB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