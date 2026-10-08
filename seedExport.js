const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const RegulatoryRequirement = require('./models/RegulatoryRequirement');

dotenv.config({ path: path.join(__dirname, '.env') });
connectDB();

// Every row here is a "pending slot": it names the official body that owns
// the rule and nothing else. No rule text is invented — an admin has to open
// source_url, confirm it, and only then set verificationStatus to 'verified'.
// See docs discussed with the user: never author customs/certification text.
const destinationSources = {
    AE: { name: 'UAE Ministry of Climate Change and Environment', url: 'https://www.moccae.gov.ae' },
    RU: { name: 'Rosselkhoznadzor (fsvps.gov.ru)', url: 'https://fsvps.gov.ru' },
    KZ: { name: 'Eurasian Economic Commission (EAEU)', url: 'https://eec.eaeunion.org' },
    CN: { name: 'General Administration of Customs of China', url: 'http://english.customs.gov.cn' },
    TR: { name: 'Turkey Ministry of Agriculture and Forestry', url: 'https://www.tarimorman.gov.tr' },
    EU: { name: 'EU Access2Markets', url: 'https://trade.ec.europa.eu/access-to-markets' },
    KR: { name: 'Animal and Plant Quarantine Agency (Korea)', url: 'https://www.qia.go.kr' },
    SA: { name: 'Saudi Food and Drug Authority', url: 'https://www.sfda.gov.sa' },
};

const UZ_EXPORT_REGISTRATION = { name: "O'zbekiston bojxona qo'mitasi (customs.uz)", url: 'https://customs.uz' };

const countryCodes = ['AE', 'RU', 'KZ', 'CN', 'TR', 'EU', 'AF', 'KR', 'SA', 'IN'];

const buildRows = () =>
    countryCodes.flatMap((countryCode) => {
        const dest = destinationSources[countryCode];
        const rows = [
            {
                countryCode,
                requirementType: 'exporter_registration',
                title: { uz: "Eksportyor sifatida ro'yxatdan o'tish" },
                sourceName: UZ_EXPORT_REGISTRATION.name,
                sourceUrl: UZ_EXPORT_REGISTRATION.url,
                verificationStatus: 'pending',
            },
        ];

        rows.push({
            countryCode,
            requirementType: 'phytosanitary',
            title: { uz: `${countryCode} uchun fitosanitariya talablari` },
            sourceName: dest ? dest.name : 'International Plant Protection Convention (ippc.int)',
            sourceUrl: dest ? dest.url : 'https://www.ippc.int',
            verificationStatus: 'pending',
        });

        return rows;
    });

const importData = async () => {
    try {
        await RegulatoryRequirement.deleteMany();
        await RegulatoryRequirement.insertMany(buildRows());
        console.log('Export requirement slots seeded!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await RegulatoryRequirement.deleteMany();
        console.log('Export requirement slots removed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
