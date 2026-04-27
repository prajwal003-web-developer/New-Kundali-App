export interface Province {
  name: string
  districts: District[]
}

export interface District {
  name: string
  lat: number
  lng: number
  altitude: number
}

export interface IndiaState {
  name: string
  lat: number
  lng: number
  altitude: number
}

export const NEPAL_PROVINCES: Province[] = [
  {
    name: 'कोशी प्रदेश',
    districts: [
      { name: 'भोजपुर', lat: 27.1737, lng: 87.0536, altitude: 1680 },
      { name: 'धनकुटा', lat: 26.9833, lng: 87.35, altitude: 1120 },
      { name: 'इलाम', lat: 26.9104, lng: 87.9261, altitude: 1200 },
      { name: 'झापा', lat: 26.5369, lng: 87.8988, altitude: 90 },
      { name: 'खोटाङ', lat: 27.0229, lng: 86.8365, altitude: 1700 },
      { name: 'मोरङ', lat: 26.5106, lng: 87.2757, altitude: 80 },
      { name: 'ओखलढुंगा', lat: 27.3085, lng: 86.4974, altitude: 1720 },
      { name: 'पाँचथर', lat: 27.1471, lng: 87.7874, altitude: 1500 },
      { name: 'सङ्खुवासभा', lat: 27.5504, lng: 87.1839, altitude: 1220 },
      { name: 'सोलुखुम्बु', lat: 27.6716, lng: 86.5987, altitude: 2800 },
      { name: 'सुनसरी', lat: 26.5993, lng: 87.2783, altitude: 120 },
      { name: 'ताप्लेजुङ', lat: 27.3565, lng: 87.6642, altitude: 1800 },
      { name: 'तेह्रथुम', lat: 27.2547, lng: 87.5313, altitude: 1540 },
      { name: 'उदयपुर', lat: 26.7416, lng: 86.5479, altitude: 620 },
    ],
  },
  {
    name: 'मधेश प्रदेश',
    districts: [
      { name: 'बारा', lat: 27.0174, lng: 85.0001, altitude: 100 },
      { name: 'धनुषा', lat: 26.8175, lng: 86.0152, altitude: 75 },
      { name: 'महोत्तरी', lat: 26.6441, lng: 85.8105, altitude: 70 },
      { name: 'पर्सा', lat: 27.0136, lng: 84.8713, altitude: 95 },
      { name: 'रौतहट', lat: 27.0194, lng: 85.3011, altitude: 80 },
      { name: 'सर्लाही', lat: 26.9948, lng: 85.5702, altitude: 75 },
      { name: 'सिरहा', lat: 26.6553, lng: 86.5843, altitude: 65 },
      { name: 'सप्तरी', lat: 26.5789, lng: 86.7267, altitude: 70 },
    ],
  },
  {
    name: 'बागमती प्रदेश',
    districts: [
      { name: 'भक्तपुर', lat: 27.6722, lng: 85.4298, altitude: 1401 },
      { name: 'चितवन', lat: 27.5291, lng: 84.354, altitude: 200 },
      { name: 'धादिङ', lat: 27.8694, lng: 84.9065, altitude: 890 },
      { name: 'काठमाडौं', lat: 27.7172, lng: 85.324, altitude: 1400 },
      { name: 'काभ्रेपलाञ्चोक', lat: 27.5745, lng: 85.6699, altitude: 1600 },
      { name: 'ललितपुर', lat: 27.6644, lng: 85.3188, altitude: 1350 },
      { name: 'मकवानपुर', lat: 27.4319, lng: 85.0348, altitude: 610 },
      { name: 'नुवाकोट', lat: 27.9945, lng: 85.1568, altitude: 1128 },
      { name: 'रामेछाप', lat: 27.3274, lng: 86.0881, altitude: 1160 },
      { name: 'रसुवा', lat: 28.0819, lng: 85.2676, altitude: 1880 },
      { name: 'सिन्धुली', lat: 27.2561, lng: 85.9717, altitude: 1200 },
      { name: 'सिन्धुपाल्चोक', lat: 27.9518, lng: 85.6848, altitude: 860 },
    ],
  },
  {
    name: 'गण्डकी प्रदेश',
    districts: [
      { name: 'बाग्लुङ', lat: 28.2674, lng: 83.5873, altitude: 1370 },
      { name: 'गोरखा', lat: 28.1552, lng: 84.6264, altitude: 1100 },
      { name: 'कास्की', lat: 28.2096, lng: 83.9856, altitude: 827 },
      { name: 'लमजुङ', lat: 28.1542, lng: 84.3975, altitude: 1800 },
      { name: 'मनाङ', lat: 28.7198, lng: 84.1434, altitude: 3519 },
      { name: 'मुस्ताङ', lat: 28.9971, lng: 83.8613, altitude: 2810 },
      { name: 'म्याग्दी', lat: 28.5348, lng: 83.5743, altitude: 1070 },
      { name: 'नवलपुर', lat: 27.7138, lng: 84.1257, altitude: 182 },
      { name: 'पर्वत', lat: 28.3875, lng: 83.7009, altitude: 1300 },
      { name: 'स्याङ्जा', lat: 28.0944, lng: 83.8799, altitude: 870 },
      { name: 'तनहुँ', lat: 27.8999, lng: 84.3448, altitude: 540 },
    ],
  },
  {
    name: 'लुम्बिनी प्रदेश',
    districts: [
      { name: 'अर्घाखाँची', lat: 27.9546, lng: 83.0822, altitude: 1400 },
      { name: 'बाँके', lat: 28.0671, lng: 81.6361, altitude: 165 },
      { name: 'बर्दिया', lat: 28.3441, lng: 81.5037, altitude: 170 },
      { name: 'दाङ', lat: 27.9498, lng: 82.2778, altitude: 670 },
      { name: 'गुल्मी', lat: 28.0687, lng: 83.2723, altitude: 1200 },
      { name: 'कपिलवस्तु', lat: 27.5629, lng: 83.0567, altitude: 110 },
      { name: 'नवलपरासी', lat: 27.4818, lng: 83.6702, altitude: 130 },
      { name: 'पाल्पा', lat: 27.8654, lng: 83.5393, altitude: 1070 },
      { name: 'प्युठान', lat: 28.0922, lng: 82.8199, altitude: 1230 },
      { name: 'रुपन्देही', lat: 27.4864, lng: 83.4484, altitude: 115 },
      { name: 'रोल्पा', lat: 28.3152, lng: 82.6589, altitude: 2100 },
      { name: 'रुकुम पूर्व', lat: 28.6201, lng: 82.6241, altitude: 2490 },
    ],
  },
  {
    name: 'कर्णाली प्रदेश',
    districts: [
      { name: 'डोल्पा', lat: 29.0569, lng: 82.9788, altitude: 3700 },
      { name: 'हुम्ला', lat: 29.9799, lng: 81.923, altitude: 3060 },
      { name: 'जाजरकोट', lat: 28.7006, lng: 82.1948, altitude: 2200 },
      { name: 'जुम्ला', lat: 29.2743, lng: 82.1836, altitude: 2475 },
      { name: 'कालिकोट', lat: 29.0989, lng: 81.6393, altitude: 1740 },
      { name: 'मुगु', lat: 29.5498, lng: 82.3975, altitude: 3500 },
      { name: 'रुकुम पश्चिम', lat: 28.6009, lng: 82.4238, altitude: 2100 },
      { name: 'सल्यान', lat: 28.3702, lng: 82.1426, altitude: 1400 },
      { name: 'सुर्खेत', lat: 28.6003, lng: 81.6354, altitude: 720 },
    ],
  },
  {
    name: 'सुदूरपश्चिम प्रदेश',
    districts: [
      { name: 'अछाम', lat: 29.0528, lng: 81.1999, altitude: 1820 },
      { name: 'बाजुरा', lat: 29.4573, lng: 81.4095, altitude: 1900 },
      { name: 'बझाङ', lat: 29.5748, lng: 81.1743, altitude: 2200 },
      { name: 'बैतडी', lat: 29.5246, lng: 80.6629, altitude: 1650 },
      { name: 'डडेलधुरा', lat: 29.3007, lng: 80.5842, altitude: 1660 },
      { name: 'डोटी', lat: 29.2648, lng: 80.9696, altitude: 1220 },
      { name: 'डार्चुला', lat: 29.8556, lng: 80.5498, altitude: 1070 },
      { name: 'कैलाली', lat: 28.6494, lng: 80.8998, altitude: 180 },
      { name: 'कञ्चनपुर', lat: 28.8577, lng: 80.3427, altitude: 175 },
    ],
  },
]

export const INDIA_STATES: IndiaState[] = [
  { name: 'आन्ध्र प्रदेश', lat: 15.9129, lng: 79.74, altitude: 300 },
  { name: 'अरुणाचल प्रदेश', lat: 28.218, lng: 94.7278, altitude: 1500 },
  { name: 'असम', lat: 26.2006, lng: 92.9376, altitude: 100 },
  { name: 'बिहार', lat: 25.0961, lng: 85.3131, altitude: 60 },
  { name: 'छत्तीसगढ', lat: 21.2787, lng: 81.8661, altitude: 350 },
  { name: 'गोवा', lat: 15.2993, lng: 74.124, altitude: 20 },
  { name: 'गुजरात', lat: 22.2587, lng: 71.1924, altitude: 50 },
  { name: 'हरियाणा', lat: 29.0588, lng: 76.0856, altitude: 220 },
  { name: 'हिमाचल प्रदेश', lat: 31.1048, lng: 77.1734, altitude: 2000 },
  { name: 'झारखण्ड', lat: 23.6102, lng: 85.2799, altitude: 500 },
  { name: 'कर्नाटक', lat: 15.3173, lng: 75.7139, altitude: 800 },
  { name: 'केरल', lat: 10.8505, lng: 76.2711, altitude: 100 },
  { name: 'मध्य प्रदेश', lat: 22.9734, lng: 78.6569, altitude: 500 },
  { name: 'महाराष्ट्र', lat: 19.7515, lng: 75.7139, altitude: 600 },
  { name: 'मणिपुर', lat: 24.6637, lng: 93.9063, altitude: 800 },
  { name: 'मेघालय', lat: 25.467, lng: 91.3662, altitude: 1000 },
  { name: 'मिजोरम', lat: 23.1645, lng: 92.9376, altitude: 1100 },
  { name: 'नागालैण्ड', lat: 26.1584, lng: 94.5624, altitude: 1200 },
  { name: 'ओडिशा', lat: 20.9517, lng: 85.0985, altitude: 200 },
  { name: 'पञ्जाब', lat: 31.1471, lng: 75.3412, altitude: 240 },
  { name: 'राजस्थान', lat: 27.0238, lng: 74.2179, altitude: 370 },
  { name: 'सिक्किम', lat: 27.533, lng: 88.5122, altitude: 1500 },
  { name: 'तमिल नाडु', lat: 11.1271, lng: 78.6569, altitude: 200 },
  { name: 'तेलंगाना', lat: 18.1124, lng: 79.0193, altitude: 500 },
  { name: 'त्रिपुरा', lat: 23.9408, lng: 91.9882, altitude: 200 },
  { name: 'उत्तर प्रदेश', lat: 26.8467, lng: 80.9462, altitude: 100 },
  { name: 'उत्तराखण्ड', lat: 30.0668, lng: 79.0193, altitude: 1500 },
  { name: 'पश्चिम बंगाल', lat: 22.9868, lng: 87.855, altitude: 15 },
  { name: 'दिल्ली', lat: 28.6139, lng: 77.209, altitude: 216 },
]
