import { FullKundaliData } from './astrology'

export async function generateAIInterpretation(chartData: FullKundaliData, name: string): Promise<string> {
  const AI_API_URL = process.env.AI_API_URL || 'https://api.anthropic.com/v1/messages'
  const AI_API_KEY = process.env.AI_API_KEY

  if (!AI_API_KEY) {
    return generateFallbackInterpretation(chartData, name)
  }

  const prompt = `तपाईं एक विद्वान वैदिक ज्योतिषी हुनुहुन्छ। तलको कुण्डली डेटाको आधारमा नेपाली भाषामा विस्तृत र अर्थपूर्ण व्याख्या गर्नुहोस्।

**जातकको नाम:** ${name}

**कुण्डली विवरण:**
- लग्न: ${chartData.lagna} (${chartData.lagnaSign + 1} नं राशि)
- राशि: ${chartData.rashi}
- नक्षत्र: ${chartData.nakshatra} (पाद ${chartData.nakshatraPada})
- योग: ${chartData.yoga}
- करण: ${chartData.karana}

**ग्रह स्थिति (D1 चार्ट):**
${chartData.D1.planets.map(p =>
  `- ${p.nameNepali}: ${p.signNameNepali} (${p.house} भाव), ${p.degree.toFixed(1)}°${p.isRetrograde ? ' (वक्री)' : ''}`
).join('\n')}

**वर्तमान दशा:**
- महादशा: ${chartData.dasha.planetNepali}
- समाप्ति: ${chartData.dasha.endDate}
- बाँकी वर्ष: ${chartData.dasha.yearsRemaining}

**नवमांश (D9):**
- लग्न: ${chartData.D9.ascendant.signNameNepali}

कृपया निम्न विषयमा नेपाली भाषामा व्याख्या गर्नुहोस्:
१. व्यक्तित्व र स्वभाव
२. करियर र व्यवसाय
३. स्वास्थ्य
४. प्रेम र विवाह
५. धन र सम्पत्ति
६. वर्तमान दशाको प्रभाव र भविष्यवाणी
७. शुभ र अशुभ ग्रह

स्पष्ट, अर्थपूर्ण र भविष्यवाणीयुक्त व्याख्या दिनुहोस्।`

  try {
    const response = await fetch(`https://chatbot.codexapi.workers.dev/?prompt=${prompt}&model=anthropic%2Fclaude-sonnet-4`)

    if (!response.ok) {
      const err = await response.text()
      console.error('AI API error:', err)
      return generateFallbackInterpretation(chartData, name)
    }

    const data = await response.json()

    console.log(data)
    return data?.answer|| generateFallbackInterpretation(chartData, name)
  } catch (error) {
    console.error('AI interpretation error:', error)
    return generateFallbackInterpretation(chartData, name)
  }
}

function generateFallbackInterpretation(chartData: FullKundaliData, name: string): string {
  const lagnaTraits: Record<string, string> = {
    'मेष': 'साहसी, उत्साही र नेतृत्वकारी स्वभाव',
    'वृष': 'धैर्यशील, व्यावहारिक र भौतिक सुखमा रुचि',
    'मिथुन': 'बुद्धिमान, चंचल र संचारमा कुशल',
    'कर्कट': 'भावनाशील, पारिवारिक र सहानुभूतिशील',
    'सिंह': 'आत्मविश्वासी, उदार र नेतृत्वप्रिय',
    'कन्या': 'विश्लेषणात्मक, परिश्रमी र विस्तारमा ध्यान दिने',
    'तुला': 'न्यायप्रिय, कलात्मक र सन्तुलनप्रिय',
    'वृश्चिक': 'गहन, रहस्यमय र परिवर्तनशील',
    'धनु': 'आशावादी, दार्शनिक र स्वतन्त्रताप्रिय',
    'मकर': 'महत्वाकांक्षी, अनुशासित र व्यावहारिक',
    'कुम्भ': 'मौलिक, मानवतावादी र प्रगतिशील',
    'मीन': 'सहानुभूतिशील, कलात्मक र आध्यात्मिक',
  }

  return `## ${name}को कुण्डली विश्लेषण

### व्यक्तित्व र स्वभाव
${name}को लग्न **${chartData.lagna}** भएकाले यिनी ${lagnaTraits[chartData.lagna] || 'विशेष स्वभाव'}का व्यक्ति हुनुहुन्छ। चन्द्र राशि **${chartData.rashi}** ले भावनात्मक संवेदनशीलता थप्दछ। **${chartData.nakshatra}** नक्षत्रमा जन्म भएकाले यिनीमा विशेष प्रतिभा र सूक्ष्म बुद्धि छ।

### करियर र व्यवसाय
ग्रह स्थितिको आधारमा ${name}लाई ${chartData.D1.planets.find(p => p.name === 'Jupiter') ? `बृहस्पति ${chartData.D1.planets.find(p => p.name === 'Jupiter')!.signNameNepali}मा भएकाले` : ''} शिक्षा, व्यापार वा प्रशासनिक क्षेत्रमा सफलता मिल्ने संभावना छ। मेहनत र लगनशीलताले उच्च पद प्राप्त गर्न सकिन्छ।

### स्वास्थ्य
सूर्य **${chartData.D1.planets.find(p => p.name === 'Sun')?.signNameNepali || chartData.lagna}**मा भएकाले सामान्यतया स्वास्थ्य ठीक रहने छ। तनाव र मानसिक चापबाट सावधान रहनु आवश्यक छ। नियमित व्यायाम र सन्तुलित आहार महत्वपूर्ण छ।

### प्रेम र विवाह
शुक्र **${chartData.D1.planets.find(p => p.name === 'Venus')?.signNameNepali || 'अनुकूल स्थान'}**मा भएकाले प्रेम जीवन सुखद रहने संकेत छ। नवमांश लग्न **${chartData.D9.ascendant.signNameNepali}** ले विवाह जीवनमा सहयोग र सद्भाव देखाउँछ।

### धन र सम्पत्ति
कुण्डलीमा ग्रहहरूको स्थितिले मध्यम आयुमा आर्थिक स्थिरता र सम्पत्ति सञ्चयको संकेत गर्दछ। बचत र लगानीमा ध्यान दिनु लाभदायक हुनेछ।

### वर्तमान दशा: **${chartData.dasha.planetNepali} महादशा**
हाल **${chartData.dasha.planetNepali}** महादशा चलिरहेको छ जुन **${chartData.dasha.endDate}**सम्म रहनेछ। यो दशामा ${getDashaPrediction(chartData.dasha.planet)} यस अवधिमा सकारात्मक सोच र परिश्रमले राम्रो फल दिनेछ।

### सुझाव
- **शुभ वार:** ${getAuspiciousDays(chartData.lagnaSign)}
- **शुभ रंग:** ${getAuspiciousColor(chartData.lagnaSign)}
- **इष्टदेव:** ${getDeity(chartData.nakshatra)}
- **मन्त्र:** ॐ नमः शिवाय जप गर्नु लाभदायक हुनेछ।`
}

function getDashaPrediction(planet: string): string {
  const predictions: Record<string, string> = {
    'Sun': 'सरकारी काम, स्वास्थ्य र आत्मविश्वासमा वृद्धि हुनेछ।',
    'Moon': 'मानसिक शान्ति, परिवारिक सुख र यात्राको अवसर मिल्नेछ।',
    'Mars': 'साहस, ऊर्जा र नयाँ काम शुरू गर्ने समय हो।',
    'Mercury': 'व्यापार, सञ्चार र शिक्षामा प्रगति हुनेछ।',
    'Jupiter': 'ज्ञान, धर्म र सौभाग्यको समय हो। आध्यात्मिक उन्नति हुनेछ।',
    'Venus': 'प्रेम, कला र भौतिक सुखको समय हो।',
    'Saturn': 'मेहनत र धैर्यले सफलता मिल्नेछ। अनुशासन महत्वपूर्ण छ।',
    'Rahu': 'अप्रत्याशित परिवर्तन र नयाँ अवसरहरू आउनेछन्।',
    'Ketu': 'आध्यात्मिक विकास र पुरानो कर्मको फल मिल्नेछ।',
  }
  return predictions[planet] || 'सावधानीपूर्वक निर्णय लिनुहोस्।'
}

function getAuspiciousDays(lagnaSign: number): string {
  const days = ['आइतवार र बिहीवार', 'शुक्रवार र बुधवार', 'बुधवार र शुक्रवार', 'सोमवार र बिहीवार', 'आइतवार र सोमवार', 'बुधवार र शुक्रवार', 'शुक्रवार र बुधवार', 'मङ्गलवार र आइतवार', 'बिहीवार र मङ्गलवार', 'शनिवार र बुधवार', 'शनिवार र आइतवार', 'बिहीवार र सोमवार']
  return days[lagnaSign] || 'बिहीवार'
}

function getAuspiciousColor(lagnaSign: number): string {
  const colors = ['रातो', 'सेतो', 'हरियो', 'क्रिम', 'सुनौलो', 'हरियो', 'नीलो', 'रातो', 'पहेँलो', 'नीलो', 'आकाशे नीलो', 'पहेँलो']
  return colors[lagnaSign] || 'सेतो'
}

function getDeity(nakshatra: string): string {
  const deities: Record<string, string> = {
    'अश्विनी': 'अश्विनी कुमार', 'भरणी': 'यमराज', 'कृत्तिका': 'अग्निदेव',
    'रोहिणी': 'ब्रह्मा', 'मृगशिर': 'चन्द्रमा', 'आर्द्रा': 'शिव',
    'पुनर्वसु': 'अदिति', 'पुष्य': 'बृहस्पति', 'आश्लेषा': 'सर्प',
    'मघा': 'पितृ', 'पूर्वा फाल्गुनी': 'भग', 'उत्तरा फाल्गुनी': 'आर्यमान',
    'हस्त': 'सूर्य', 'चित्रा': 'विश्वकर्मा', 'स्वाती': 'वायु',
    'विशाखा': 'इन्द्र', 'अनुराधा': 'मित्र', 'ज्येष्ठा': 'इन्द्र',
    'मूल': 'निरृति', 'पूर्वाषाढ': 'जल', 'उत्तराषाढ': 'विश्वेदेव',
    'श्रवण': 'विष्णु', 'धनिष्ठा': 'अष्टवसु', 'शतभिषा': 'वरुण',
    'पूर्वा भाद्रपद': 'अजएकपाद', 'उत्तरा भाद्रपद': 'अहिर्बुध्न्य', 'रेवती': 'पूषा',
  }
  return deities[nakshatra] || 'शिव'
}
