/* All visitor interactions remain in memory. No storage, analytics or wallet SDKs. */
'use strict';
const translations = {
  tr: {
    skip:'İçeriğe geç',homeLabel:'SEXY Coin ana sayfa',navLabel:'Ana gezinme',languageLabel:'Dil',mobileNavLabel:'Mobil gezinme',menuOpen:'Menüyü aç',menuClose:'Menüyü kapat',
    navAbout:'Hikâyemiz',navTokenomics:'Tokenomics',navRoadmap:'Yol haritası',navSecurity:'Şeffaflık',navRisk:'Riskleri oku',
    heroStatus:'YEREL PROTOTİP TAMAM · DEVNET BEKLİYOR',heroDescription:'Güçlü bir karakter. Getiri vaadi yok. Neon bir kalbi ve açık bir geliştirme yolculuğu olan Solana meme deneyi.',explore:'SEXY Coin ile tanış',followBuild:'Gelişimi takip et',heroNote:'Deneysel proje. Ana ağ tokenı ve satış yok.',mascotAlt:'Pembe saçlı, kedi kulaklı, altın madalyonlu SEXY Coin maskotu',artLabel:'KARAKTER, BLOCKCHAIN İLE TANIŞIYOR.',
    aboutIndex:'KARAKTERİMİZ',aboutEyebrow:'KENDİ TARZI OLAN BİR MEME',aboutHeadingOne:'Biraz eğlence.',aboutHeadingTwo:'Daima açık sözlü.',aboutLead:'SEXY Coin, oyun karakteri estetiğini bir Solana meme projesine taşıyor. Tasarımda cesur. İlk günden şeffaf.',aboutBody:'darklove tarafından geliştirilen bu proje; marka, topluluk ve token geliştirme üzerine erken bir deney. Yerel blockchain prototipinde token basımı ve transfer doğrulandı. Sonuçları belgelerken kamuya açık Devnet aşaması bekliyor.',aboutNote:'İsim ve sembol geçicidir. Marka ve hukuki incelemeler henüz tamamlanmadı.',manifesto:'Karakterini ortaya koy.\nVaatlerini dürüst tut.',
    developmentHeading:'Geliştirme durumu',localPrototype:'Yerel blockchain prototipi',localComplete:'Tamamlandı',publicDevnet:'Kamuya açık Devnet',devnetPending:'Bekliyor',mainnetNotLaunched:'Başlatılmadı',tokenSale:'Token satışı',saleNotAvailable:'Mevcut değil',localIdentityNote:'Yalnız LOCALNET. DAY 04 mintinde zincir üstü isim, sembol veya maskot metadata kaydı yoktur. Metadata geliştirmesi ayrı ve izole bir test ağında yapılır. Satın alınabilecek kamuya açık Devnet veya ana ağ tokenı yoktur.',
    tokenIndex:'DENEYİMİZ',tokenEyebrow:'DOĞRULANMIŞ YEREL TEST DEĞERLERİ',tokenHeading:'Başlangıç noktamız net.',devnetOnly:'YALNIZCA YEREL VALIDATOR',tokenIntro:'İzole yerel validator üzerinde bir milyar test tokenı basıldı ve 100 token aktarıldı. Bu tokenların parasal değeri yoktur. Kamuya açık Devnet aşaması bekliyor.',supplyLabel:'Doğrulanmış yerel test arzı',supplyNote:'Bir milyar token · yalnız yerel test',networkLabel:'Test ağı',decimalsLabel:'Ondalık basamak',precision:'Token hassasiyeti',taxLabel:'Transfer vergisi',taxNote:'Yerel test · transfer vergisi yok',mintLabel:'DAY 04 mint · LOCALNET',mintValue:'Bhb3xhvhxVhMBkGDJkSTrkieyuw8nxBXic2sFyno8CX1',mintTag:'LOCALNET',allocationNote:'Bu adres yalnız DAY 04 yerel ledgerına aittir. Mint ve freeze yetkileri yerel geliştiricide kalır. Kamuya açık piyasa, ana ağ dağılımı veya likidite oluşturulmadı.',
    roadmapIndex:'YOLCULUĞUMUZ',roadmapEyebrow:'KÜÇÜK ADIMLAR. GÖRÜNÜR İLERLEME.',roadmapHeading:'Önce geliştir. Sonra doğrula.',roadmapAside:'Kilometre taşları; lansman vaatleri değil.\nHer adım bir öncekine bağlı.',inProgress:'DEVAM EDİYOR',planned:'PLANLANIYOR',conditional:'KOŞULLU',phase1Title:'Temelleri kur',phase1Body:'Marka görselleri, iki dilli site, proje belgeleri ve güvenlik sınırları.',phase1Foot:'ŞU ANDA BURADAYIZ ↗',phase2Title:'Devnet üzerinde test et',phase2Body:'CLI araçlarını kur, ücretsiz test SOL iste, test mintini oluştur; arzı, transferleri ve yetkileri doğrula.',phase2Foot:'YALNIZCA ÜCRETSİZ TEST TOKENI',phase3Title:'İncele ve iyileştir',phase3Body:'Güvenliği incele, marka uygunluğunu kontrol et ve Türkiye’deki ilgili hukuki gereklilikleri değerlendir.',phase3Foot:'İDDİADAN ÖNCE KANIT',phase4Title:'Sonraki adımı değerlendir',phase4Body:'Ana ağı yalnızca teknik, hukuki ve bütçe incelemeleri sonrası değerlendir. Lansman tarihi veya listeleme taahhüdü yok.',phase4Foot:'ANA AĞ TAAHHÜDÜ YOK',
    securityIndex:'TEMEL İLKELERİMİZ',securityEyebrow:'GÜVENLİK VE ŞEFFAFLIK',securityHeadingOne:'Pozitif enerji.',securityHeadingTwo:'Net sınırlar.',securityIntro:'Güven, kontrol edilebilen bilgilere dayanır. Projenin mevcut durumu burada.',security1Title:'Geliştirme aşaması',security1Body:'Yerel blockchain prototipi tamamlandı. Token basımı ve 100 token transferi yerel ağda finalized oldu. Kamuya açık Devnet bekliyor; ana ağ başlatılmadı.',security2Title:'Cüzdanın sana ait kalır',security2Body:'Bu site cüzdan bağlamaz, fon kabul etmez, kişisel veri toplamaz. Analitik veya izleme betiği içermez.',security3Title:'Yetkiler açıklanacak',security3Body:'DAY 04 yerel mint ve freeze yetkileri doğrulandı ve geliştiricinin kontrolünde kalır. Yetki değişikliği veya iptali yapılmadı.',security4Title:'Tanıtımdan önce kanıt',security4Body:'Denetim, borsa listelemesi, likidite kilidi veya getiri iddiası yoktur. Yerel test kanıtları kamuya açık Devnet sonuçlarından ayrı belgelenir.',
    riskEyebrow:'DEVAM ETMEDEN ÖNCE',riskHeading:'Riskleri bil. Bakış açını koru.',riskBody:'SEXY Coin deneysel bir meme projesidir; yatırım tavsiyesi veya getiri garantisi değildir. Gelecekteki herhangi bir ana ağ tokenı tüm değerini kaybedebilir. Geliştirme değişebilir veya durabilir. Yerel ağ ve Devnet test tokenlarının parasal değeri yoktur.',riskSecondary:'Satış veya fon toplama yoktur. Hukuki ve marka incelemeleri bekliyor; SEXY COIN ve SEXY başka projelerce kullanılıyor olabilir. İsim ve sembol üzerinde münhasır hak iddia edilmez. Türkiye’de halka satış veya yatırım tanıtımı öncesi hukuki uygunluk incelemesi gerekir.',
    communityEyebrow:'TOPLULUK DÜRÜSTLÜKLE BAŞLAR',communityHeading:'Aynı enerji. Gelecekte birlikte.',communityBody:'Resmî kanallar henüz açılmadı. Hazır olduklarında doğrulanmış bağlantıları buraya ekleyeceğiz.',notSetUp:'HENÜZ AÇILMADI',communityNote:'O zamana kadar bu ismi kullanan hesapları doğrulanmamış kabul et. Gizli anahtarını veya kurtarma kelimelerini asla paylaşma.',footerBy:'Geliştiren:',footerRisk:'Risk açıklaması ↗',footerStatus:'YEREL TAMAM · DEVNET BEKLİYOR'
  }
};
const textElements = [...document.querySelectorAll('[data-i18n]')];
const attributeElements = [...document.querySelectorAll('[data-i18n-aria],[data-i18n-alt]')];
const english = Object.fromEntries(textElements.map(element => [element.dataset.i18n,element.innerText]));
const englishAttributes = new Map(attributeElements.map(element => [element,{aria:element.getAttribute('aria-label'),alt:element.getAttribute('alt')}]));
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
let currentLanguage = 'en';
function setMenu(open, restoreFocus = false) {
  menuButton.setAttribute('aria-expanded',String(open));
  mobileNav.hidden = !open;
  menuButton.setAttribute('aria-label',currentLanguage === 'tr' ? translations.tr[open ? 'menuClose':'menuOpen'] : open ? 'Close navigation':'Open navigation');
  if (restoreFocus) menuButton.focus();
}
function setLanguage(language) {
  if (!['en','tr'].includes(language)) return;
  currentLanguage = language;
  document.documentElement.lang = language;
  for (const element of textElements) {
    const value = language === 'en' ? english[element.dataset.i18n] : translations.tr[element.dataset.i18n];
    element.textContent = value;
    if (value.includes('\n')) element.style.whiteSpace = 'pre-line';
  }
  for (const element of attributeElements) {
    if (element.dataset.i18nAria) element.setAttribute('aria-label',language === 'en' ? englishAttributes.get(element).aria : translations.tr[element.dataset.i18nAria]);
    if (element.dataset.i18nAlt) element.setAttribute('alt',language === 'en' ? englishAttributes.get(element).alt : translations.tr[element.dataset.i18nAlt]);
  }
  for (const button of document.querySelectorAll('[data-language]')) button.setAttribute('aria-pressed',String(button.dataset.language === language));
  document.title = language === 'tr' ? 'SEXY Coin · Bir Solana Meme Deneyi' : 'SEXY Coin · Too Sexy to Be Serious';
  document.querySelector('meta[name="description"]').content = language === 'tr' ? 'SEXY Coin — darklove tarafından geliştirilen Solana meme deneyi. Yerel blockchain prototipi tamamlandı; kamuya açık Devnet bekliyor. Ana ağ tokenı veya satış yok.' : 'SEXY Coin — a Solana meme experiment by darklove. Local blockchain prototype complete; public Devnet pending. No mainnet token or sale.';
  setMenu(false);
}
for (const button of document.querySelectorAll('[data-language]')) button.addEventListener('click',() => setLanguage(button.dataset.language));
menuButton.addEventListener('click',() => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
for (const link of mobileNav.querySelectorAll('a')) link.addEventListener('click',() => setMenu(false));
document.addEventListener('keydown',event => { if (event.key === 'Escape' && !mobileNav.hidden) setMenu(false,true); });
document.addEventListener('click',event => { if (!mobileNav.hidden && !event.target.closest('.site-header')) setMenu(false); });
matchMedia('(min-width: 761px)').addEventListener('change',event => { if (event.matches) setMenu(false); });
