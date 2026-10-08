// Rough, clearly-labeled estimates per destination country — NOT real carrier
// quotes. No logistics company names are invented here; this is only meant
// to give a seller a ballpark figure before they talk to an actual forwarder.
const logisticsEstimates = {
    RU: { mode: 'land', pricePerTonUsd: 120, transitDays: [5, 8] },
    KZ: { mode: 'land', pricePerTonUsd: 60, transitDays: [2, 4] },
    CN: { mode: 'land', pricePerTonUsd: 180, transitDays: [7, 12] },
    TR: { mode: 'land', pricePerTonUsd: 200, transitDays: [8, 14] },
    EU: { mode: 'multimodal', pricePerTonUsd: 320, transitDays: [14, 21] },
    AF: { mode: 'land', pricePerTonUsd: 90, transitDays: [3, 6] },
    KR: { mode: 'air', pricePerTonUsd: 950, transitDays: [3, 5] },
    SA: { mode: 'air', pricePerTonUsd: 780, transitDays: [4, 7] },
    AE: { mode: 'air', pricePerTonUsd: 650, transitDays: [3, 5] },
    IN: { mode: 'multimodal', pricePerTonUsd: 400, transitDays: [10, 16] },
};

module.exports = logisticsEstimates;
