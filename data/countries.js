// Static reference data for the export section's country pages. Matches the
// country set already referenced in the "Agro M24 Market" planning material.
const countries = [
    { code: 'AE', name: { uz: 'BAA', ru: 'ОАЭ', en: 'UAE' }, flag: '🇦🇪', currency: 'AED' },
    { code: 'RU', name: { uz: 'Rossiya', ru: 'Россия', en: 'Russia' }, flag: '🇷🇺', currency: 'RUB' },
    { code: 'KZ', name: { uz: "Qozog'iston", ru: 'Казахстан', en: 'Kazakhstan' }, flag: '🇰🇿', currency: 'KZT' },
    { code: 'CN', name: { uz: 'Xitoy', ru: 'Китай', en: 'China' }, flag: '🇨🇳', currency: 'CNY' },
    { code: 'TR', name: { uz: 'Turkiya', ru: 'Турция', en: 'Turkey' }, flag: '🇹🇷', currency: 'TRY' },
    { code: 'EU', name: { uz: 'Yevropa Ittifoqi', ru: 'Европейский союз', en: 'European Union' }, flag: '🇪🇺', currency: 'EUR', isBloc: true },
    { code: 'AF', name: { uz: "Afg'oniston", ru: 'Афганистан', en: 'Afghanistan' }, flag: '🇦🇫', currency: 'AFN' },
    { code: 'KR', name: { uz: 'Janubiy Koreya', ru: 'Южная Корея', en: 'South Korea' }, flag: '🇰🇷', currency: 'KRW' },
    { code: 'SA', name: { uz: 'Saudiya Arabistoni', ru: 'Саудовская Аравия', en: 'Saudi Arabia' }, flag: '🇸🇦', currency: 'SAR' },
    { code: 'IN', name: { uz: 'Hindiston', ru: 'Индия', en: 'India' }, flag: '🇮🇳', currency: 'INR' },
];

module.exports = countries;
