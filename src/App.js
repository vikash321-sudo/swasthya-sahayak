import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_KEY
);

// ─── Nepal Geographic Data ─────────────────────────────────────
const PROVINCES = ["Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"];
const DISTRICTS_BY_PROVINCE = {
  "Koshi": ["Taplejung", "Panchthar", "Ilam", "Jhapa", "Morang", "Sunsari", "Dhankuta", "Terhathum", "Sankhuwasabha", "Bhojpur", "Solukhumbu", "Okhaldhunga", "Khotang", "Udayapur"],
  "Madhesh": ["Saptari", "Siraha", "Dhanusha", "Mahottari", "Sarlahi", "Rautahat", "Bara", "Parsa"],
  "Bagmati": ["Kathmandu", "Bhaktapur", "Lalitpur", "Kavrepalanchok", "Sindhupalchok", "Rasuwa", "Dhading", "Nuwakot", "Makwanpur", "Chitwan", "Sindhuli", "Ramechhap"],
  "Gandaki": ["Kaski", "Syangja", "Parbat", "Baglung", "Mustang", "Myagdi", "Nawalpur", "Gorkha", "Lamjung", "Tanahu", "Manang"],
  "Lumbini": ["Rupandehi", "Kapilvastu", "Arghakhanchi", "Gulmi", "Palpa", "Nawalparasi West", "Dang", "Pyuthan", "Rolpa", "Rukum East", "Banke", "Bardiya"],
  "Karnali": ["Surkhet", "Dailekh", "Jajarkot", "Dolpa", "Mugu", "Humla", "Jumla", "Kalikot", "Rukum West", "Salyan"],
  "Sudurpashchim": ["Kanchanpur", "Kailali", "Dadeldhura", "Baitadi", "Darchula", "Bajhang", "Bajura", "Achham"],
};
const LOCAL_LEVELS = {
  "Taplejung": ["Phungling", "Sirijangha RM", "Meringden RM", "Mikwakhola RM", "Maiwakhola RM", "Pathivara Yangwarak RM", "Fakatappe RM"],
  "Panchthar": ["Phidim", "Tumbewa RM", "Phalelung RM", "Kummayak RM", "Miklajung RM", "Yangwarak RM", "Hilihang RM"],
  "Ilam": ["Ilam", "Deumai", "Mai", "Suryodaya", "Maijogmai RM", "Chulachuli RM", "Rong RM", "Sandakpur RM"],
  "Jhapa": ["Birtamod", "Mechinagar", "Bhadrapur", "Damak", "Kankai", "Arjundhara", "Gauriganj", "Barhadashi RM", "Buddhashanti RM", "Gauradhaha RM", "Haldibari RM", "Kamal RM", "Kechanakawel RM"],
  "Morang": ["Biratnagar Metro", "Rangeli", "Sundarharaicha", "Urlabari", "Letang", "Pathari Shanischare", "Belbari", "Jahada RM", "Gramthan RM", "Dhanpalthan RM"],
  "Sunsari": ["Inaruwa", "Dharan Sub-Metro", "Itahari Sub-Metro", "Duhabi", "Barahakshetra", "Ramdhuni", "Harinagara RM", "Koshi RM"],
  "Dhankuta": ["Dhankuta", "Pakhribas", "Mahalaxmi", "Chhathar Jorpati RM", "Sahidbhumi RM", "Sangurigadhi RM"],
  "Terhathum": ["Myanglung", "Laligurans", "Phedap RM", "Chhathar RM", "Aathrai Tribeni RM"],
  "Sankhuwasabha": ["Khandbari", "Chainpur", "Dharmadevi", "Madi", "Panchkhapan", "Silichong RM", "Chichila RM", "Bhotkhola RM"],
  "Bhojpur": ["Bhojpur", "Shadananda", "Hatuwagadhi RM", "Ramprasad Rai RM", "Salpasilichho RM"],
  "Solukhumbu": ["Solu Dudhkunda", "Necha Salyan RM", "Thulung Dudhkoshi RM", "Mahakulung RM", "Likhupike RM", "Khumbu Pasanglhamu RM"],
  "Okhaldhunga": ["Okhaldhunga", "Siddhicharan", "Manebhanjyang RM", "Molung RM", "Chisankhugadhi RM"],
  "Khotang": ["Diktel Rupakot Majhuwagadhi", "Halesi Tuwachung", "Khotehang RM", "Barahapokhari RM", "Kepilasagadhi RM", "Rawabesi RM"],
  "Udayapur": ["Triyuga", "Katari", "Udayapurgadhi RM", "Chaudandigadhi", "Belaka", "Tapli RM"],
  "Saptari": ["Rajbiraj", "Kanchanrup", "Dakneshwori", "Hanumannagar Kankalini", "Surunga", "Saptakoshi RM", "Agnisair Krishna Savaran RM", "Chhinnamasta RM", "Rajgadh RM", "Rupani RM", "Tilathi Koiladi RM"],
  "Siraha": ["Lahan", "Siraha", "Golbazar", "Mirchaiya", "Karjanha", "Kalyanpur", "Dhangadhimai", "Naraha RM", "Aurahi RM", "Bariyarpatti RM", "Bhagawanpur RM"],
  "Dhanusha": ["Janakpurdham Sub-Metro", "Chhireshwornath", "Dhanushadham", "Ganeshman Charnath", "Hansapur", "Kamala", "Mithila", "Mithila Bihari", "Nagarain", "Sabaila", "Shahidnagar", "Bateshwar RM", "Janak Nandini RM", "Lakshminiya RM"],
  "Mahottari": ["Jaleshwar", "Bardibas", "Gaushala", "Loharpatti", "Manra Siswa RM", "Matihani", "Pipra RM", "Ramgopalpur"],
  "Sarlahi": ["Malangawa", "Bagmati", "Balara", "Barahathwa", "Godaita", "Haripur", "Hariwan", "Ishworpur", "Kabilasi", "Lalbandi", "Ramnagar"],
  "Rautahat": ["Gaur", "Baudhimai", "Brindaban", "Chandrapur", "Garuda", "Gadhimai", "Ishanath", "Katahariya", "Madhav Narayan", "Maulapur", "Paroha", "Rajdevi"],
  "Bara": ["Kalaiya Sub-Metro", "Jitpur Simara Sub-Metro", "Mahagadhimai", "Nijgadh", "Parwanipur", "Pacharauta", "Simraungadh", "Adarsha Kotwal RM", "Baragadhi RM", "Bishrampur RM", "Devtal RM", "Fattepur RM"],
  "Parsa": ["Birgunj Metro", "Bahudarmai", "Chhipaharmai", "Jagarnathpur", "Paterwa Sugauli", "Pokhariya", "Parsagadhi", "Thori RM", "Bindabasini RM", "Dhobini RM", "Jirabhawani RM"],
  "Kathmandu": ["Kathmandu Metro", "Kirtipur", "Gokarneshwar", "Budhanilkantha", "Tokha", "Tarakeshwar", "Nagarjun", "Kageshwori Manohara", "Dakshinkali", "Chandragiri", "Shankharapur"],
  "Bhaktapur": ["Bhaktapur", "Madhyapur Thimi", "Changunarayan", "Suryabinayak"],
  "Lalitpur": ["Lalitpur Metro", "Godawari", "Mahalaxmi", "Konjyosom RM"],
  "Kavrepalanchok": ["Dhulikhel", "Banepa", "Panauti", "Panchkhal", "Mandanpur", "Namobuddha", "Bethanchowk RM", "Bhumlu RM", "Roshi RM", "Temal RM", "Tinpatan RM"],
  "Sindhupalchok": ["Chautara Sangachokgadhi", "Melamchi", "Bahrabise", "Helambu RM", "Indrawati RM", "Jugal RM", "Lisankhu Pakhar RM", "Balefi RM", "Sunkoshi RM", "Bhotekoshi RM", "Golchhe RM"],
  "Rasuwa": ["Uttargaya RM", "Naukunda RM", "Gosaikunda RM", "Kalika RM", "Parbatikunda RM"],
  "Dhading": ["Nilakantha", "Dhading Besi", "Benighat Rorang RM", "Gajuri RM", "Galchi RM", "Gangajamuna RM", "Khaniyabas RM", "Netrawati Dabyoung RM", "Rubi Valley RM", "Siddhalek RM", "Thakre RM"],
  "Nuwakot": ["Bidur", "Belkotgadhi", "Dupcheshwar RM", "Kakani RM", "Kispang RM", "Likha RM", "Panchakanya RM", "Shivapuri RM", "Suryagadhi RM", "Tadi RM", "Tarkeshwar RM"],
  "Makwanpur": ["Hetauda Sub-Metro", "Thaha", "Manahari RM", "Bagmati RM", "Bakaiya RM", "Bhimphedi RM", "Indrasarowar RM", "Kailash RM", "Makawanpurgadhi RM", "Raksirang RM"],
  "Chitwan": ["Bharatpur Metro", "Ratnanagar", "Khairhani", "Madi", "Ichchhyakamana RM", "Rapti", "Kalika"],
  "Sindhuli": ["Kamalamai", "Dudhauli", "Golanjor RM", "Hariharpurgadhi RM", "Marin RM", "Phikkal RM", "Sunkoshi RM", "Tinpatan RM"],
  "Ramechhap": ["Manthali", "Ramechhap", "Doramba RM", "Gokulganga RM", "Khandadevi RM", "Likhu Tamakoshi RM", "Sunapati RM", "Umakunda RM"],
  "Kaski": ["Pokhara Metro", "Annapurna RM", "Madi RM", "Machhapuchhre RM", "Rupa RM"],
  "Syangja": ["Waling", "Galyang", "Putalibazar", "Chapakot", "Bhirkot", "Arjunchaupari RM", "Biruwa RM", "Harinas RM", "Kaligandaki RM", "Phedikhola RM"],
  "Parbat": ["Kushma", "Jaljala RM", "Modi RM", "Paiyun RM", "Phalewas", "Bihadi RM"],
  "Baglung": ["Baglung", "Jaimini", "Badigad RM", "Dhorpatan", "Galkot", "Nisikhola RM", "Taman Khola RM", "Kathekhola RM"],
  "Mustang": ["Mustang RM", "Thasang RM", "Gharapjhong RM", "Lomanthang RM", "Lo-Ghekar Damodarkunda RM"],
  "Myagdi": ["Beni", "Annapurna RM", "Dhaulagiri RM", "Malika RM", "Mangala RM", "Raghuganga RM"],
  "Nawalpur": ["Kawasoti", "Devchuli", "Madhyabindu", "Gaindakot", "Hupsekot", "Baudikali RM", "Bulingtar RM", "Palhinandan RM", "Triveni RM"],
  "Gorkha": ["Gorkha", "Palungtar", "Arughat RM", "Ajirkot RM", "Barpak Sulikot RM", "Bhimsen Thapa RM", "Chumnubri RM", "Dharche RM", "Gandaki RM", "Liglig", "Sahid Lakhan RM", "Siranchok RM"],
  "Lamjung": ["Besishahar", "Sundarbazar", "Marsyangdi RM", "Kwholasothar RM", "Dordi RM", "Rainas", "Chamde RM"],
  "Tanahu": ["Bhimad", "Shuklagandaki", "Vyas", "Abukhaireni RM", "Bandipur RM", "Devghat RM", "Ghiring RM", "Myagde RM", "Rishing RM"],
  "Manang": ["Chame RM", "Neshyang RM", "Narpa Bhumi RM", "Nasho RM"],
  "Rupandehi": ["Butwal Sub-Metro", "Tilottama", "Devdaha", "Lumbini Sanskritik", "Sainamaina", "Marchawari RM", "Maya Devi RM", "Rohini RM", "Sammarimai RM", "Siyari RM"],
  "Kapilvastu": ["Kapilvastu", "Banganga", "Buddhabhumi", "Maharajgunj", "Shivaraj", "Krishnanagar", "Bijaynagar RM", "Yashodhara RM"],
  "Arghakhanchi": ["Sandhikharka", "Sitganga", "Bhumekasthan", "Chhatradev RM", "Malarani RM", "Panini RM"],
  "Gulmi": ["Resunga", "Musikot", "Isma RM", "Malika RM", "Madane RM", "Ruru RM", "Satyawati RM", "Chatrakot RM", "Chandrakot RM", "Dhurkot RM", "Gulmidarbar RM"],
  "Palpa": ["Tansen", "Rampur", "Mathagadhi RM", "Nisdi RM", "Rainadevi Chhahara RM", "Ribdikot RM", "Tinau RM"],
  "Nawalparasi West": ["Sunwal", "Bardaghat", "Palhi Nandan RM", "Pratappur RM", "Susta RM"],
  "Dang": ["Tulsipur Sub-Metro", "Ghorahi Sub-Metro", "Lamahi", "Banglachuli RM", "Babai RM", "Dangisharan RM", "Gadhawa RM", "Rajpur RM", "Rapti RM", "Shantinagar RM"],
  "Pyuthan": ["Pyuthan", "Swargadwary", "Ayirawati RM", "Gaumukhi RM", "Jhimruk RM", "Lungri RM", "Mallarani RM", "Mandavi RM", "Naubahini RM"],
  "Rolpa": ["Rolpa", "Lungri RM", "Madi RM", "Pariwartan RM", "Runtigadhi RM", "Sunchhahari RM", "Suwarnabati RM", "Tribeni RM"],
  "Rukum East": ["Putha Uttarganga RM", "Sisne RM"],
  "Banke": ["Nepalgunj Sub-Metro", "Kohalpur", "Narainapur RM", "Baijanath RM", "Duduwa RM", "Janki RM", "Khajura RM", "Raptisonari RM"],
  "Bardiya": ["Gulariya", "Madhuwan", "Rajapur", "Thakurbaba", "Bansgadhi", "Barbardiya", "Badhaiyatal RM", "Geruwa RM"],
  "Surkhet": ["Birendranagar", "Bheriganga", "Lekbesi", "Gurbhakot", "Panchpuri", "Bafikot RM", "Chaukune RM", "Chingad RM", "Simta RM"],
  "Dailekh": ["Narayan", "Aathabis", "Chamunda Bindrasaini", "Dullu", "Dungeshwar RM", "Bhagawatimai RM", "Gurans RM", "Mahabu RM", "Naumule RM"],
  "Jajarkot": ["Bheri", "Chhedagad", "Nalgad", "Junichande RM", "Kuse RM", "Shiwalaya RM", "Tribeni RM"],
  "Dolpa": ["Thuli Bheri", "Dunai", "Chharka Tangsong RM", "Dolpo Buddha RM", "Jagadulla RM", "Kaike RM", "She Phoksundo RM", "Tripurasundari RM"],
  "Mugu": ["Chhayanath Rara", "Khatyad RM", "Mugum Karmarong RM", "Soru RM"],
  "Humla": ["Simkot RM", "Adanchuli RM", "Chankheli RM", "Kharpunath RM", "Namkha RM", "Sarkegad RM"],
  "Jumla": ["Chandannath", "Guthichaur RM", "Kanaka Sundari RM", "Patarasi RM", "Sinja RM", "Tatopani RM", "Tila RM"],
  "Kalikot": ["Khandachakra", "Raskot", "Shubha Kalika", "Tilagufa", "Mahawai RM", "Naraharinath RM", "Pachaljharana RM"],
  "Rukum West": ["Musikot", "Aathbiskot", "Chaurjahari", "Banfikot RM", "Triveni RM"],
  "Salyan": ["Sharada", "Bagchaur", "Bangad Kupinde", "Darma RM", "Dhorchaur RM", "Kapurkot RM", "Kuntari RM", "Tribeni Sutar RM"],
  "Kanchanpur": ["Bhimdatta", "Belauri", "Bedkot", "Krishnapur", "Mahakali", "Punarbas", "Shuklaphanta", "Laljhadi RM"],
  "Kailali": ["Dhangadhi Sub-Metro", "Godawari", "Tikapur", "Gauriganga", "Ghodaghodi", "Bhajani", "Lamkichuha", "Masuriya", "Joshipur RM", "Kailari RM", "Mohanyal RM", "Chure RM", "Janaki RM", "Phatepur RM"],
  "Dadeldhura": ["Amargadhi", "Parashuram", "Aalital RM", "Ajayameru RM", "Bhageshwar RM", "Gangapur RM", "Navadurga RM"],
  "Baitadi": ["Dasharathchand", "Melauli", "Patan", "Purchandi RM", "Shivanath RM", "Dilasaini RM", "Dogadakedar RM", "Pancheshwar RM", "Sigas RM"],
  "Darchula": ["Shailyashikhar", "Malikarjun RM", "Byans RM", "Duhun RM", "Lekam RM", "Marma RM", "Naugad RM"],
  "Bajhang": ["Bungal", "Chainpur", "Talkot", "Jaya Prithvi", "Durgathali RM", "Chhabis Pathibhera RM", "Khaptad Chhanna RM", "Masta RM", "Surma RM", "Thalara RM", "Chhapri RM", "Saipal RM"],
  "Bajura": ["Budhiganga", "Badimalika", "Chhededaha RM", "Gaumul RM", "Himali RM", "Jagannath RM", "Pandav Gupha RM", "Swami Kartik Khapar RM", "Tribeni RM"],
  "Achham": ["Mangalsen", "Panchadewal Binayak", "Sanphebagar", "Bannigadhi Jayagadh RM", "Chaurpati RM", "Dhakari RM", "Mellekh RM", "Ramaroshan RM", "Turmakhand RM"],
};

// ─── Colors ────────────────────────────────────────────────────
const C = {
  bg:"#F7F8FA", white:"#FFFFFF",
  primary:"#2563EB", primaryLight:"#EFF6FF", primaryDark:"#1D4ED8",
  green:"#059669", greenLight:"#ECFDF5",
  red:"#DC2626", redLight:"#FEF2F2",
  orange:"#D97706", orangeLight:"#FFFBEB",
  purple:"#7C3AED", purpleLight:"#F5F3FF",
  teal:"#0D9488", tealLight:"#F0FDFA",
  text:"#111827", textMid:"#6B7280", textLight:"#9CA3AF",
  border:"#E5E7EB",
  shadow:"0 1px 3px rgba(0,0,0,0.08)",
  shadowMd:"0 4px 12px rgba(0,0,0,0.08)",
};

// ─── Transliteration ───────────────────────────────────────────
const WM = {"tauko":"टाउको","dukhxa":"दुख्छ","dukhcha":"दुख्छ","jworo":"ज्वरो","jwaro":"ज्वरो","fever":"ज्वरो","pet":"पेट","khansi":"खाँसी","cough":"खाँसी","ulti":"उल्टी","chhati":"छाती","chakkar":"चक्कर","sas":"सास","garho":"गाह्रो","paani":"पानी","dherai":"धेरै"};
function r2n(t){if(!t||/[\u0900-\u097F]/.test(t))return null;const w=t.toLowerCase().split(/\s+/).map(x=>WM[x]||x).join(" ");return w!==t.toLowerCase()?w:null;}
function isRom(t){if(!t||/[\u0900-\u097F]/.test(t))return false;return Object.keys(WM).some(k=>t.toLowerCase().includes(k));}

// ─── Symptoms ──────────────────────────────────────────────────
const SYMPTOMS=[
  {id:"headache",icon:"🤕",ne:"टाउको दुख्छ",en:"Headache",roman:["tauko","headache"],causesEn:["Migraine","Tension","Dehydration"],causesNe:["माइग्रेन","तनाव","डिहाइड्रेसन"],advEn:"Rest in a quiet room and drink water.",advNe:"शान्त कोठामा आराम गर्नुहोस् र पानी पिउनुहोस्।",warnEn:"See doctor if sudden severe pain or vision changes.",warnNe:"अचानक तीव्र दुखाई भए डाक्टर देखाउनुहोस्।",sev:"low"},
  {id:"fever",icon:"🌡️",ne:"ज्वरो आउँछ",en:"Fever",roman:["jworo","jwaro","fever"],causesEn:["Flu","Malaria","Typhoid","Dengue"],causesNe:["फ्लु","म्यालेरिया","टाइफाइड","डेंगी"],advEn:"Drink plenty of fluids and ORS. Rest.",advNe:"धेरै पानी र ORS पिउनुहोस्।",warnEn:"See doctor if fever over 40°C or lasts 3+ days.",warnNe:"ज्वरो ४०°C भन्दा बढी वा ३+ दिन रहे डाक्टर देखाउनुहोस्।",sev:"medium"},
  {id:"stomach",icon:"🫃",ne:"पेट दुख्छ",en:"Stomach Pain",roman:["pet","stomach"],causesEn:["Gastric","Indigestion","Food poisoning"],causesNe:["ग्यास्ट्रिक","अपच","फूड पोइजनिङ"],advEn:"Drink warm water. Avoid heavy meals.",advNe:"तातो पानी पिउनुहोस्। भारी खाना नखानुहोस्।",warnEn:"Emergency if abdomen is rigid or blood in stool.",warnNe:"पेट कडा भयो वा दिसामा रगत भए तुरुन्त अस्पताल।",sev:"medium"},
  {id:"breathing",icon:"🫁",ne:"सास फेर्न गाह्रो",en:"Breathing Difficulty",roman:["sas","breathing"],causesEn:["Asthma","Pneumonia","COVID"],causesNe:["अस्थमा","निमोनिया","COVID"],advEn:"Sit upright. Get fresh air.",advNe:"सिधा बसेर ताजा हावा लिनुहोस्।",warnEn:"Call 102 immediately.",warnNe:"तुरुन्त 102 मा फोन गर्नुहोस्।",sev:"high"},
  {id:"cough",icon:"😮‍💨",ne:"खाँसी लाग्छ",en:"Cough",roman:["khansi","cough"],causesEn:["Cold","Bronchitis","TB"],causesNe:["रुघाखोकी","ब्रोन्काइटिस","TB"],advEn:"Warm water with honey and ginger.",advNe:"तातो पानीमा मह र अदुवा मिसाएर पिउनुहोस्।",warnEn:"TB test if cough persists 2+ weeks.",warnNe:"२+ हप्ता खोकी भए TB परीक्षण गराउनुहोस्।",sev:"low"},
  {id:"vomiting",icon:"🤢",ne:"उल्टी हुन्छ",en:"Vomiting",roman:["ulti","vomiting"],causesEn:["Food poisoning","Gastric"],causesNe:["फूड पोइजनिङ","ग्यास्ट्रिक"],advEn:"Sip ORS or salt-sugar water frequently.",advNe:"ORS वा नुन-चिनीको पानी थोरथोर गरी पिउनुहोस्।",warnEn:"See doctor if blood present or 6+ hours of vomiting.",warnNe:"रगत आयो वा ६+ घण्टा उल्टी भयो भने डाक्टर।",sev:"medium"},
  {id:"chest",icon:"💔",ne:"छाती दुख्छ",en:"Chest Pain",roman:["chhati","chest"],causesEn:["Heart","Gastric","Pneumonia"],causesNe:["मुटुरोग","ग्यास्ट्रिक","निमोनिया"],advEn:"Sit or lie comfortably. Loosen clothing.",advNe:"आरामदायक अवस्थामा बस्नुहोस्।",warnEn:"Call 102 immediately — all chest pain is an emergency.",warnNe:"तुरुन्त 102 — छाती दुखाई सधैँ आपतकालीन।",sev:"high"},
  {id:"dizzy",icon:"😵",ne:"चक्कर लाग्छ",en:"Dizziness",roman:["chakkar","dizzy"],causesEn:["Blood pressure","Anemia","Dehydration"],causesNe:["रक्तचाप","एनिमिया","डिहाइड्रेसन"],advEn:"Sit or lie down. Drink water.",advNe:"बस्नुहोस् वा सुत्नुहोस्। पानी पिउनुहोस्।",warnEn:"See doctor if fainting or recurring dizziness.",warnNe:"बेहोस भयो वा बारम्बार आए डाक्टर देखाउनुहोस्।",sev:"low"},
];

// ─── First Aid ──────────────────────────────────────────────────
const FIRST_AID=[
  {id:"fever",icon:"🌡️",color:C.orange,bg:C.orangeLight,en:"Fever",ne:"ज्वरो",stepsEn:["Check temperature with thermometer","Give paracetamol if over 38.5°C","Give plenty of fluids (water, ORS)","Apply cool damp cloth on forehead","Wear light loose clothing","Keep in cool ventilated room"],stepsNe:["थर्मोमिटरले तापक्रम जाँच्नुहोस्","३८.५°C भन्दा बढी भए पारासिटामोल दिनुहोस्","धेरै तरल पदार्थ (पानी, ORS) पिउनुहोस्","निधारमा चिसो भिजेको कपडा राख्नुहोस्","हल्का ढिलो कपडा लगाउनुहोस्","चिसो हावादार कोठामा राख्नुहोस्"],whenEn:"Fever above 40°C, seizures, rash, difficulty breathing, fever lasting 3+ days",whenNe:"ज्वरो ४०°C भन्दा बढी, थर्थराइ, छाला दाग, सास गाह्रो, ३+ दिन ज्वरो",noteEn:"This is basic first aid. Always consult a doctor for persistent symptoms.",noteNe:"यो सामान्य प्राथमिक उपचार हो। गम्भीर अवस्थामा डाक्टर देखाउनुहोस्।"},
  {id:"wound",icon:"🩹",color:C.orange,bg:C.orangeLight,en:"Wound / Cut",ne:"घाउ / काटा",stepsEn:["Apply firm pressure with clean cloth to stop bleeding","Rinse under clean running water for 5–10 minutes","Remove visible debris gently","Apply antiseptic (Dettol/Betadine) if available","Cover with clean bandage","Change dressing daily, keep dry"],stepsNe:["सफा कपडाले थिचेर रगत रोक्नुहोस्","सफा बग्ने पानीले ५–१० मिनेट धुनुहोस्","देखिने फोहर बिस्तारै हटाउनुहोस्","एन्टिसेप्टिक लगाउनुहोस्","सफा पट्टीले बाँध्नुहोस्","दैनिक पट्टी बदल्नुहोस्"],whenEn:"Deep wound, bleeding after 10 min, signs of infection, animal bite, rusty object",whenNe:"गहिरो घाउ, १० मिनेटपछि पनि रगत, संक्रमणको चिन्ह, जनावरको टोकाइ",noteEn:"Ensure tetanus vaccination is up to date for deep wounds.",noteNe:"गहिरो घाउको लागि टिटानस खोप जाँच गर्नुहोस्।"},
  {id:"burn",icon:"🔥",color:C.red,bg:C.redLight,en:"Burn",ne:"जलन",stepsEn:["Cool with running water (not ice) for 10–20 minutes","Remove jewellery near burn — do NOT remove stuck clothing","Do NOT apply butter, oil, or ice","Cover loosely with clean wrap","Give paracetamol for pain","Keep person warm to prevent shock"],stepsNe:["चिसो बग्ने पानीले (बरफ होइन) १०–२० मिनेट राख्नुहोस्","जलेकानजिकका गहना हटाउनुहोस् — टाँसिएको कपडा नहटाउनुहोस्","मक्खन, तेल वा बरफ नलगाउनुहोस्","सफा कपडाले ढिलो छोप्नुहोस्","दुखाइको लागि पारासिटामोल दिनुहोस्","झट्का नलागोस् भनी न्यानो राख्नुहोस्"],whenEn:"Burn larger than palm, on face/hands/feet/joints, white or charred skin, chemical/electrical burn, children",whenNe:"जलाएको भाग हत्केलाभन्दा ठूलो, अनुहार/हात/खुट्टा/जोर्नीमा, कालो वा सेतो छाला",noteEn:"Never burst blisters. Seek emergency care for serious burns immediately.",noteNe:"फोका कहिल्यै नफोड्नुहोस्। गम्भीर जलनमा तुरुन्त 102।"},
  {id:"fainting",icon:"😵",color:C.purple,bg:C.purpleLight,en:"Fainting",ne:"बेस्सरी आउनु",stepsEn:["Lay flat on back","Raise legs 30cm above heart","Loosen clothing around neck and waist","Check breathing — if not breathing start CPR","Place in recovery position if breathing","Do not give anything until fully conscious"],stepsNe:["पिठ्यूँमा सुताउनुहोस्","खुट्टा मुटुभन्दा ३० सेमी माथि उठाउनुहोस्","घाँटी र कम्मरको कपडा फुकाउनुहोस्","सास जाँच्नुहोस् — नभए CPR सुरु गर्नुहोस्","सास फेरेको छ भने रिकभरी अवस्थामा राख्नुहोस्","पूरै होश नआउञ्जेल केही नदिनुहोस्"],whenEn:"Did not regain consciousness in 1 min, head injury, irregular heartbeat, pregnancy",whenNe:"१ मिनेटमा होश नआएको, टाउको चोट, अनियमित मुटु, गर्भावस्था",noteEn:"Always call 102 if person doesn't regain consciousness quickly.",noteNe:"व्यक्ति छिट्टै होशमा नआए 102 मा फोन गर्नुहोस्।"},
  {id:"chestpain",icon:"💔",color:C.red,bg:C.redLight,en:"Chest Pain",ne:"छाती दुखाई",stepsEn:["Call 102 IMMEDIATELY — do not wait","Help person sit or lie comfortably","Loosen all tight clothing","If prescribed aspirin/nitrate, help them take it","Stay calm, keep person calm","Do NOT leave person alone","Monitor breathing continuously"],stepsNe:["तुरुन्त 102 मा फोन गर्नुहोस्","आरामदायक अवस्थामा बसाउनुहोस्","सबै कसिलो कपडा फुकाउनुहोस्","डाक्टरले तोकेको औषधि छ भने दिनुहोस्","शान्त रहनुहोस् र व्यक्तिलाई शान्त राख्नुहोस्","एक्लो नछोड्नुहोस्","सास निरन्तर जाँच गर्नुहोस्"],whenEn:"ALL chest pain requires emergency evaluation. Call 102 immediately.",whenNe:"सबै छाती दुखाईलाई आपतकालीन मान्नुहोस्। तुरुन्त 102।",noteEn:"Chest pain is ALWAYS an emergency. Never dismiss it.",noteNe:"छाती दुखाई सधैँ आपतकालीन हो। कहिल्यै बेवास्ता नगर्नुहोस्।"},
  {id:"snakebite",icon:"🐍",color:C.green,bg:C.greenLight,en:"Snake Bite",ne:"सर्पदंश",stepsEn:["Call 102 and go to hospital IMMEDIATELY","Keep person still and calm","Remove watches, rings, tight clothing near bite","Mark bite site with pen, note the time","Keep bitten limb below heart level","Do NOT cut, suck, or apply tourniquet"],stepsNe:["तुरुन्त 102 मा फोन गरेर अस्पताल जानुहोस्","व्यक्तिलाई शान्त राख्नुहोस्","टोकाइनजिकको घडी, औँठी, कपडा हटाउनुहोस्","टोकाइमा कलमले चिन्ह लगाएर समय नोट गर्नुहोस्","टोकिएको अंग मुटुभन्दा तल राख्नुहोस्","काट्नु, चुस्नु, वा टोर्निकेट नलगाउनुहोस्"],whenEn:"ALL snake bites require immediate hospital care.",whenNe:"सबै सर्पदंशलाई आपतकालीन मान्नुहोस्।",noteEn:"Do NOT apply tourniquet or cut the wound. Go to hospital immediately.",noteNe:"टोर्निकेट नलगाउनुहोस्। घाउ नकाट्नुहोस्। तुरुन्त अस्पताल।"},
  {id:"foodpoisoning",icon:"🤢",color:C.orange,bg:C.orangeLight,en:"Food Poisoning",ne:"खाना विग्रने",stepsEn:["Give ORS frequently in small sips","If no ORS: 1L water + 6 tsp sugar + 1/2 tsp salt","Do not stop vomiting/diarrhea artificially","Give bland food when able (rice, bread, banana)","Avoid dairy, fatty, spicy food","Monitor for severe dehydration"],stepsNe:["ORS थोरथोर गरी बारम्बार दिनुहोस्","ORS नभए: १ लिटर पानी + ६ चम्चा चिनी + आधा चम्चा नुन","उल्टी वा झाडापखाला कृत्रिम रूपमा नरोक्नुहोस्","खान सकेपछि हल्का खाना दिनुहोस्","दूध, तेल, मसालेदार खाना नखानुहोस्","गम्भीर निर्जलीकरणको नजर राख्नुहोस्"],whenEn:"Blood in vomit/stool, severe dehydration, high fever, unable to keep fluids down, 2+ days",whenNe:"उल्टी/दिसामा रगत, गम्भीर निर्जलीकरण, उच्च ज्वरो, २+ दिन लक्षण",noteEn:"Keep sipping fluids even if vomiting. Small amounts frequently.",noteNe:"उल्टी भए पनि थोरथोर गरी पानी पिइरहनुहोस्।"},
  {id:"electricshock",icon:"⚡",color:C.purple,bg:C.purpleLight,en:"Electric Shock",ne:"विद्युत झटका",stepsEn:["Do NOT touch — turn off electricity first","Switch off at main or use dry wood to push wire","Call 102 immediately","Start CPR if unconscious and not breathing","Treat burns with cool water","Keep person warm and lying down"],stepsNe:["व्यक्तिलाई नछुनुहोस् — पहिले बिजुली काट्नुहोस्","मुख्य स्विच बन्द गर्नुहोस् वा सुख्खा काठले तार हटाउनुहोस्","तुरुन्त 102 मा फोन गर्नुहोस्","बेहोस र सास नफेरेको छ भने CPR सुरु गर्नुहोस्","जलनलाई चिसो पानीले उपचार गर्नुहोस्","न्यानो र सुतेको अवस्थामा राख्नुहोस्"],whenEn:"ALL electric shock cases require hospital evaluation.",whenNe:"सबै विद्युत झटकाका मामिलामा अस्पताल जाँच आवश्यक।",noteEn:"Internal injuries may not be visible. Always seek medical evaluation.",noteNe:"भित्री चोट देखिँदैन। सधैँ डाक्टरी जाँच गराउनुहोस्।"},
];

const DOCTORS=[
  {init:"S",ne:"डा. सुनिता श्रेष्ठ",en:"Dr. Sunita Shrestha",specNe:"सामान्य चिकित्सक",specEn:"General Physician",avail:true,rating:4.9,reviews:284,fee:"NPR 500",waitNe:"अहिले",waitEn:"Now",expEn:"12 yrs",expNe:"१२ वर्ष",color:C.primary},
  {init:"R",ne:"डा. रमेश थापा",en:"Dr. Ramesh Thapa",specNe:"बाल रोग विशेषज्ञ",specEn:"Pediatrician",avail:true,rating:4.8,reviews:196,fee:"NPR 700",waitNe:"२० मि.",waitEn:"20 min",expEn:"8 yrs",expNe:"८ वर्ष",color:C.teal},
  {init:"P",ne:"डा. प्रिया गुरुङ",en:"Dr. Priya Gurung",specNe:"स्त्री रोग विशेषज्ञ",specEn:"Gynecologist",avail:false,rating:4.9,reviews:341,fee:"NPR 800",waitNe:"भोलि",waitEn:"Tomorrow",expEn:"15 yrs",expNe:"१५ वर्ष",color:C.purple},
  {init:"A",ne:"डा. अमित पाण्डे",en:"Dr. Amit Pande",specNe:"हड्डी विशेषज्ञ",specEn:"Orthopedic",avail:true,rating:4.7,reviews:158,fee:"NPR 600",waitNe:"१ घण्टा",waitEn:"1 hr",expEn:"10 yrs",expNe:"१० वर्ष",color:C.orange},
];

// ─── AI ────────────────────────────────────────────────────────
async function askAI(text,history,lang){
  const conv=isRom(text)?r2n(text):null;
  const msg=conv?text+" (meaning: "+conv+")":text;
  const sys=lang==="en"
    ?"You are Swasthya Sahayak, a warm AI health assistant for Nepal. Be conversational and brief — 2-4 sentences max. For new symptoms, ask 1-2 clarifying questions first (how long? severity? other symptoms?). Once you have context, give practical advice in natural paragraph form. For emergencies say 'Call 102 now' first. Never diagnose. Suggest real doctor for serious issues. If user mentions being sick and you have enough context, naturally offer 'Would you like me to help you book a doctor appointment?'"
    :"तपाईं स्वास्थ्य सहायक हुनुहुन्छ — नेपालका मानिसहरूको लागि मित्रवत् AI। कुराकानी शैलीमा संक्षिप्त जवाफ दिनुहोस् — अधिकतम २-४ वाक्य। नयाँ लक्षणमा पहिले १-२ वटा प्रश्न सोध्नुहोस् (कति दिनदेखि? कत्तिको तीव्र?)। पर्याप्त जानकारीपछि संक्षिप्त सल्लाह दिनुहोस्। आपतकालमा पहिले '102 मा फोन गर्नुहोस्' भन्नुहोस्। पक्का निदान नगर्नुहोस्। यदि व्यक्ति बिरामी छ र पर्याप्त जानकारी छ भने स्वाभाविक रूपमा सोध्नुहोस् 'के म डाक्टर अपोइन्टमेन्ट बुक गर्न मद्दत गर्ने?'";
  const res=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+process.env.REACT_APP_OPENAI_KEY},body:JSON.stringify({model:"gpt-4o-mini",max_tokens:350,messages:[{role:"system",content:sys},...history,{role:"user",content:msg}]})});
  const d=await res.json();
  return d.choices?.[0]?.message?.content||(lang==="en"?"Sorry, try again.":"माफ गर्नुहोस्, पुनः प्रयास गर्नुहोस्।");
}

// ─── Follow-up AI ───────────────────────────────────────────────
//const FOLLOWUP_QUESTIONS_EN=["How are you feeling compared to yesterday?","Have you taken your medicine today?","What is your temperature right now?","Are you able to eat and drink?","Any new symptoms since we last spoke?"];
//const FOLLOWUP_QUESTIONS_NE=["हिजोको तुलनामा आज कस्तो महसुस गर्दैहुनुहुन्छ?","आज औषधि खानुभयो?","अहिले तापक्रम कति छ?","खानापिना गर्न सक्नुभएको छ?","पछिल्लो पटकपछि नयाँ लक्षण देखियो?"];

// ─── Small Components ──────────────────────────────────────────
function Av({init,color,size=44}){return <div style={{width:size,height:size,borderRadius:"50%",background:color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:size*0.35,fontWeight:700,flexShrink:0}}>{init}</div>;}
function SevBadge({s,lang}){const m={low:{bg:C.greenLight,c:C.green},medium:{bg:C.orangeLight,c:C.orange},high:{bg:C.redLight,c:C.red}};const lb={low:{en:"Mild",ne:"सामान्य"},medium:{en:"Moderate",ne:"मध्यम"},high:{en:"Urgent!",ne:"तत्काल!"}};return <span style={{background:m[s].bg,color:m[s].c,borderRadius:6,padding:"3px 10px",fontSize:11,fontWeight:600}}>{lb[s][lang]}</span>;}
function Sh({title,action,onAction}){return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><span style={{fontSize:16,fontWeight:700,color:C.text}}>{title}</span>{action&&<button onClick={onAction} style={{background:"none",border:"none",color:C.primary,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{action} ›</button>}</div>;}

// ─── Voice Input ───────────────────────────────────────────────
function VoiceInput({input,setInput,onSend,loading,lang}){
  const [on,setOn]=useState(false);const ref=useRef(null);
  function start(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return;const r=new SR();r.lang=lang==="ne"?"ne-NP":"en-US";r.interimResults=false;ref.current=r;r.onstart=()=>setOn(true);r.onend=()=>setOn(false);r.onerror=(e)=>{setOn(false);if(e.error==="language-not-supported"){const r2=new SR();r2.lang="en-US";r2.interimResults=false;r2.onstart=()=>setOn(true);r2.onend=()=>setOn(false);r2.onerror=()=>setOn(false);r2.onresult=(e2)=>setInput(e2.results[0][0].transcript);ref.current=r2;r2.start();}};r.onresult=(e)=>setInput(e.results[0][0].transcript);r.start();}
  function stop(){ref.current?.stop();setOn(false);}
  return(
    <div>
      {on&&<div style={{marginBottom:8,padding:"8px 14px",background:C.primaryLight,borderRadius:10,fontSize:12,color:C.primary,fontWeight:600,display:"flex",alignItems:"center",gap:8}}><span style={{animation:"vp 0.8s infinite",display:"inline-block"}}>🎤</span>{lang==="ne"?"सुनिरहेको छु...":"Listening..."}</div>}
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onSend()} placeholder={lang==="ne"?"लक्षण बताउनुहोस्...":"Describe your symptoms..."} style={{flex:1,border:"1.5px solid "+(on?C.primary:C.border),borderRadius:24,padding:"11px 18px",fontSize:14,fontFamily:"inherit",color:C.text,outline:"none",background:C.bg,transition:"border-color 0.2s"}} onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>{if(!on)e.target.style.borderColor=C.border;}}/>
        <button onClick={on?stop:start} style={{width:46,height:46,borderRadius:"50%",flexShrink:0,background:on?"#FEE2E2":C.primaryLight,border:"2px solid "+(on?C.red:C.primary),cursor:"pointer",fontSize:19,display:"flex",alignItems:"center",justifyContent:"center",animation:on?"vp 1s infinite":"none"}}>{on?"⏹":"🎤"}</button>
        <button onClick={onSend} disabled={loading||!input.trim()} style={{width:46,height:46,borderRadius:"50%",flexShrink:0,background:input.trim()&&!loading?C.primary:C.border,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:18}}>➤</button>
      </div>
    </div>
  );
}

// ─── DRAWER MENU ───────────────────────────────────────────────
function Drawer({open,onClose,setTab,user,onLogout,lang,onLangChange}){
  if(!open)return null;
  const items=[
    {icon:"👤",label:lang==="en"?"Profile":"प्रोफाइल",tab:"profile"},
    {icon:"🔔",label:lang==="en"?"Follow-up":"फलो-अप",tab:"followup"},
    {icon:"💊",label:lang==="en"?"Health History":"स्वास्थ्य इतिहास",tab:"history"},
  ];
  return(
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:200}}/>
      <div style={{position:"fixed",top:0,left:0,bottom:0,width:280,background:C.white,zIndex:201,boxShadow:"4px 0 20px rgba(0,0,0,0.15)",display:"flex",flexDirection:"column",animation:"slideIn 0.25s ease"}}>
        {/* User header */}
        <div style={{background:"linear-gradient(135deg,#1D4ED8,#2563EB)",padding:"32px 20px 20px",color:"#fff"}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:10}}>👤</div>
          <div style={{fontSize:16,fontWeight:800}}>{user?.name||"User"}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.75)",marginTop:2}}>{user?.district||"Nepal"}</div>
        </div>
        {/* Menu items */}
        <div style={{flex:1,padding:"12px 0",overflowY:"auto"}}>
          {items.map(it=>(
            <button key={it.tab} onClick={()=>{setTab(it.tab);onClose();}} style={{width:"100%",display:"flex",alignItems:"center",gap:14,padding:"14px 20px",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:600,color:C.text,textAlign:"left"}}>
              <span style={{fontSize:20,width:28}}>{it.icon}</span>{it.label}
            </button>
          ))}
          <div style={{margin:"12px 16px",height:1,background:C.border}}/>
          {/* Language */}
          <div style={{padding:"8px 20px"}}>
            <div style={{fontSize:12,fontWeight:600,color:C.textLight,marginBottom:8,textTransform:"uppercase",letterSpacing:0.5}}>🌐 {lang==="en"?"Language":"भाषा"}</div>
            <div style={{display:"flex",background:C.bg,borderRadius:10,padding:3,gap:3}}>
              {[["en","English"],["ne","नेपाली"]].map(([l,label])=>(
                <button key={l} onClick={()=>onLangChange(l)} style={{flex:1,background:lang===l?C.white:"transparent",color:lang===l?C.primary:C.textLight,border:"none",borderRadius:8,padding:"8px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{label}</button>
              ))}
            </div>
          </div>
        </div>
        {/* Logout */}
        <div style={{padding:"16px 20px",borderTop:"1px solid "+C.border}}>
          <button onClick={onLogout} style={{width:"100%",background:C.redLight,color:C.red,border:"1px solid #FECACA",borderRadius:10,padding:"12px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🚪 {lang==="en"?"Sign Out":"साइन आउट"}</button>
        </div>
      </div>
    </>
  );
}

// ─── BOTTOM NAV ────────────────────────────────────────────────
function NavBar({tab,setTab,lang}){
  const L={en:["Home","Symptoms","First Aid","Chat","Doctors"],ne:["घर","लक्षण","प्राथमिक","सहायक","डाक्टर"]};
  const items=[{id:"home",e:"🏠"},{id:"check",e:"🩺"},{id:"firstaid",e:"🩹"},{id:"chat",e:"💬"},{id:"doctors",e:"👨‍⚕️"}];
  return(
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:C.white,borderTop:"1px solid "+C.border,display:"flex",zIndex:100,boxShadow:"0 -1px 8px rgba(0,0,0,0.06)"}}>
      {items.map((it,i)=>{const a=tab===it.id;return(
        <button key={it.id} onClick={()=>setTab(it.id)} style={{flex:1,padding:"8px 2px 10px",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,borderTop:"2px solid "+(a?C.primary:"transparent")}}>
          <span style={{fontSize:19}}>{it.e}</span>
          <span style={{fontSize:9,fontWeight:a?700:400,color:a?C.primary:C.textLight,fontFamily:"inherit"}}>{L[lang][i]}</span>
        </button>
      );} )}
    </div>
  );
}

// ─── AUTH SCREEN ───────────────────────────────────────────────
function AuthScreen({onLogin}){
  const [mode,setMode]=useState("login");
  const [step,setStep]=useState(1);
  const [lang,setLang]=useState("en");
  const [name,setName]=useState("");const [email,setEmail]=useState("");const [password,setPassword]=useState("");
  const [phone,setPhone]=useState("");
  const [province,setProvince]=useState("");const [district,setDistrict]=useState("");const [localLevel,setLocalLevel]=useState("");
  const [age,setAge]=useState("");
  const [loading,setLoading]=useState(false);const [error,setError]=useState("");

  const districts=province?DISTRICTS_BY_PROVINCE[province]||[]:[];
  const localLevels=district?LOCAL_LEVELS[district]||[]:[];

  async function handleSignUp(){
    if(!name.trim()||!email.trim()||!password.trim()){setError(lang==="en"?"Fill all required fields":"सबै अनिवार्य फिल्ड भर्नुहोस्");return;}
    if(password.length<6){setError(lang==="en"?"Password min 6 characters":"पासवर्ड कम्तीमा ६ अक्षर");return;}
    setLoading(true);setError("");
    try{
      const {data,error:err}=await supabase.auth.signUp({email,password});
      if(err)throw err;
      const uid=data.user.id;
      const profile={user_id:uid,name:name.trim(),age,province,district,local_level:localLevel,lang,phone};
      await supabase.from("health_profiles").insert([profile]);
      localStorage.setItem("ss_user",JSON.stringify(profile));
      onLogin(profile);
    }catch(e){setError(e.message||"Error. Try again.");}
    setLoading(false);
  }

  async function handleLogin(){
    if(!email.trim()||!password.trim()){setError(lang==="en"?"Fill all required fields":"सबै अनिवार्य फिल्ड भर्नुहोस्");return;}
    setLoading(true);setError("");
    try{
      const {data,error:err}=await supabase.auth.signInWithPassword({email,password});
      if(err)throw err;
      const uid=data.user.id;
      const {data:profile}=await supabase.from("health_profiles").select("*").eq("user_id",uid).single();
      const u=profile||{user_id:uid,name:email.split("@")[0],lang:"en"};
      localStorage.setItem("ss_user",JSON.stringify(u));
      onLogin(u);
    }catch(e){setError(e.message||"Invalid credentials.");}
    setLoading(false);
  }

  const inp=(v,s,t="text",ph="")=><input value={v} onChange={e=>s(e.target.value)} type={t} placeholder={ph} style={{width:"100%",border:"1.5px solid "+C.border,borderRadius:10,padding:"12px 14px",fontSize:14,fontFamily:"inherit",color:C.text,outline:"none",boxSizing:"border-box",background:C.white}} onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.border}/>;
  const sel=(v,s,opts,ph)=><select value={v} onChange={e=>{s(e.target.value);}} style={{width:"100%",border:"1.5px solid "+C.border,borderRadius:10,padding:"12px 14px",fontSize:13,fontFamily:"inherit",color:v?C.text:C.textLight,outline:"none",boxSizing:"border-box",background:C.white,appearance:"none"}}><option value="">{ph}</option>{opts.map(o=><option key={o} value={o}>{o}</option>)}</select>;

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#1D4ED8 0%,#2563EB 45%,#0D9488 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Inter','Noto Sans Devanagari',system-ui,sans-serif"}}>
      <style>{}</style>
      {/* Lang toggle */}
      <div style={{position:"absolute",top:20,right:20,display:"flex",background:"rgba(255,255,255,0.15)",borderRadius:20,padding:3,gap:2}}>
        {["en","ne"].map(l=><button key={l} onClick={()=>setLang(l)} style={{background:lang===l?"#fff":"transparent",color:lang===l?C.primary:"#fff",border:"none",borderRadius:16,padding:"5px 12px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{l==="en"?"English":"नेपाली"}</button>)}
      </div>
      {/* Logo */}
      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{width:68,height:68,borderRadius:18,background:"rgba(255,255,255,0.15)",border:"2px solid rgba(255,255,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 14px"}}>🏥</div>
        <div style={{fontSize:24,fontWeight:800,color:"#fff",marginBottom:4}}>{lang==="en"?"Swasthya Sahayak":"स्वास्थ्य सहायक"}</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.75)"}}>Nepal AI Health Assistant</div>
      </div>
      <div style={{background:C.white,borderRadius:20,padding:24,width:"100%",maxWidth:390,boxShadow:"0 24px 48px rgba(0,0,0,0.18)"}}>
        {/* Tabs */}
        <div style={{display:"flex",background:C.bg,borderRadius:12,padding:4,marginBottom:20,gap:4}}>
          {[["login",lang==="en"?"Login":"लग इन"],["signup",lang==="en"?"Create Account":"नयाँ खाता"]].map(([m,label])=>(
            <button key={m} onClick={()=>{setMode(m);setStep(1);setError("");}} style={{flex:1,background:mode===m?C.white:"transparent",color:mode===m?C.primary:C.textLight,border:"none",borderRadius:9,padding:"9px 8px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:mode===m?"0 1px 4px rgba(0,0,0,0.08)":"none"}}>{label}</button>
          ))}
        </div>
        {error&&<div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:C.red}}>{error}</div>}

        {mode==="login"?(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div><div style={{fontSize:12,fontWeight:600,color:C.textMid,marginBottom:5}}>{lang==="en"?"Email":"इमेल"} *</div>{inp(email,setEmail,"email","name@example.com")}</div>
            <div><div style={{fontSize:12,fontWeight:600,color:C.textMid,marginBottom:5}}>{lang==="en"?"Password":"पासवर्ड"} *</div>
              <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={{width:"100%",border:"1.5px solid "+C.border,borderRadius:10,padding:"12px 14px",fontSize:14,fontFamily:"inherit",color:C.text,outline:"none",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.border}/>
            </div>
            <button onClick={handleLogin} disabled={loading} style={{width:"100%",marginTop:8,background:C.primary,color:"#fff",border:"none",borderRadius:12,padding:"14px",fontSize:15,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",opacity:loading?0.75:1}}>{loading?(lang==="en"?"Loading...":"लोड हुँदैछ..."):(lang==="en"?"Login":"लग इन")}</button>
          </div>
        ):(
          <div>
            {/* Step indicator */}
            <div style={{display:"flex",alignItems:"center",marginBottom:20,gap:4}}>
              {[1,2].map(s=>(
                <div key={s} style={{display:"flex",alignItems:"center",gap:4,flex:1}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:step>=s?C.primary:C.bg,color:step>=s?"#fff":C.textLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,border:"2px solid "+(step>=s?C.primary:C.border)}}>{s}</div>
                  {s<2&&<div style={{flex:1,height:2,background:step>s?C.primary:C.border}}/>}
                </div>
              ))}
            </div>

            {step===1&&(
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div><div style={{fontSize:12,fontWeight:600,color:C.textMid,marginBottom:5}}>{lang==="en"?"Full Name":"पूरा नाम"} *</div>{inp(name,setName,"text",lang==="en"?"Your name":"तपाईंको नाम")}</div>
                <div><div style={{fontSize:12,fontWeight:600,color:C.textMid,marginBottom:5}}>{lang==="en"?"Email":"इमेल"} *</div>{inp(email,setEmail,"email","name@example.com")}</div>
                <div><div style={{fontSize:12,fontWeight:600,color:C.textMid,marginBottom:5}}>{lang==="en"?"Phone (optional)":"फोन (ऐच्छिक)"}</div>{inp(phone,setPhone,"tel","98XXXXXXXX")}</div>
                <div><div style={{fontSize:12,fontWeight:600,color:C.textMid,marginBottom:5}}>{lang==="en"?"Password":"पासवर्ड"} *</div>
                  <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="••••••••" style={{width:"100%",border:"1.5px solid "+C.border,borderRadius:10,padding:"12px 14px",fontSize:14,fontFamily:"inherit",color:C.text,outline:"none",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.border}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div><div style={{fontSize:12,fontWeight:600,color:C.textMid,marginBottom:5}}>{lang==="en"?"Age":"उमेर"}</div>{inp(age,setAge,"text","25")}</div>
                </div>
                <button onClick={()=>{if(!name.trim()||!email.trim()||!password.trim()){setError(lang==="en"?"Fill required fields":"अनिवार्य फिल्ड भर्नुहोस्");return;}if(password.length<6){setError(lang==="en"?"Password min 6 chars":"पासवर्ड कम्तीमा ६ अक्षर");return;}setError("");setStep(2);}} style={{width:"100%",marginTop:8,background:C.primary,color:"#fff",border:"none",borderRadius:12,padding:"14px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{lang==="en"?"Next: Location →":"अर्को: ठेगाना →"}</button>
              </div>
            )}

            {step===2&&(
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div style={{fontSize:13,color:C.textMid,marginBottom:4}}>{lang==="en"?"Select your location (for hospital info)":"आफ्नो ठेगाना छान्नुहोस् (अस्पताल जानकारीको लागि)"}</div>
                <div><div style={{fontSize:12,fontWeight:600,color:C.textMid,marginBottom:5}}>{lang==="en"?"Province":"प्रदेश"}</div>{sel(province,p=>{setProvince(p);setDistrict("");setLocalLevel("");},PROVINCES,lang==="en"?"Select Province":"प्रदेश छान्नुहोस्")}</div>
                <div><div style={{fontSize:12,fontWeight:600,color:C.textMid,marginBottom:5}}>{lang==="en"?"District":"जिल्ला"}</div>{sel(district,d=>{setDistrict(d);setLocalLevel("");},districts,lang==="en"?"Select District":"जिल्ला छान्नुहोस्")}</div>
                <div><div style={{fontSize:12,fontWeight:600,color:C.textMid,marginBottom:5}}>{lang==="en"?"Local Level":"स्थानीय तह"}</div>{sel(localLevel,setLocalLevel,localLevels,lang==="en"?"Select Local Level":"स्थानीय तह छान्नुहोस्")}</div>
                <div style={{display:"flex",gap:8,marginTop:8}}>
                  <button onClick={()=>{setStep(1);setError("");}} style={{flex:1,background:C.bg,color:C.textMid,border:"1px solid "+C.border,borderRadius:12,padding:"13px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{lang==="en"?"← Back":"← पछाडि"}</button>
                  <button onClick={handleSignUp} disabled={loading} style={{flex:2,background:C.primary,color:"#fff",border:"none",borderRadius:12,padding:"13px",fontSize:14,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",opacity:loading?0.75:1}}>{loading?(lang==="en"?"Creating...":"बनाउँदैछ..."):(lang==="en"?"Create Account":"खाता बनाउनुहोस्")}</button>
                </div>
                <div style={{fontSize:11,color:C.textLight,textAlign:"center"}}>{lang==="en"?"Location is optional but helps us show nearby hospitals.":"ठेगाना ऐच्छिक तर नजिकका अस्पताल देखाउन मद्दत गर्छ।"}</div>
              </div>
            )}
          </div>
        )}
        <div style={{marginTop:14,textAlign:"center",fontSize:13,color:C.textLight}}>
          {mode==="login"?(lang==="en"?"No account?":"खाता छैन?"):(lang==="en"?"Have an account?":"खाता छ?")}{" "}
          <button onClick={()=>{setMode(mode==="login"?"signup":"login");setStep(1);setError("");}} style={{background:"none",border:"none",color:C.primary,fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>{mode==="login"?(lang==="en"?"Create Account":"नयाँ खाता"):(lang==="en"?"Login":"लग इन")}</button>
        </div>
        <div style={{marginTop:10,fontSize:11,color:C.textLight,textAlign:"center"}}>{lang==="en"?"Your information is private and secure.":"तपाईंको जानकारी सुरक्षित छ।"}</div>
      </div>
    </div>
  );
}

// ─── HOME ──────────────────────────────────────────────────────
function HomeScreen({setTab,pickSym,user,lang}){
  const h=new Date().getHours();
  const gr=h<12?(lang==="en"?"Good morning":"शुभ प्रभात"):h<17?(lang==="en"?"Hello":"नमस्ते"):(lang==="en"?"Good evening":"शुभ सन्ध्या");
  const first=user?.name?.split(" ")[0]||"";
  return(
    <div style={{paddingBottom:90}}>
      <div style={{background:"linear-gradient(135deg,#1D4ED8 0%,#2563EB 55%,#0D9488 100%)",padding:"22px 20px 28px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-50,right:-40,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.8)",marginBottom:3,fontWeight:500}}>{gr}{first?", "+first:""} 👋</div>
          <div style={{fontSize:22,fontWeight:800,color:"#fff",lineHeight:1.25,marginBottom:16}}>{lang==="en"?"How are you feeling today?":"तपाईंलाई आज कस्तो छ?"}</div>
          <button onClick={()=>setTab("check")} style={{background:"rgba(255,255,255,0.14)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:12,padding:"11px 16px",display:"flex",alignItems:"center",gap:10,width:"100%",cursor:"pointer",textAlign:"left"}}>
            <span style={{fontSize:15,color:"rgba(255,255,255,0.7)"}}>🔍</span>
            <span style={{color:"rgba(255,255,255,0.65)",fontSize:14,fontFamily:"inherit"}}>{lang==="en"?"Search symptoms... headache, fever":"लक्षण खोज्नुहोस्... टाउको, ज्वरो"}</span>
          </button>
        </div>
      </div>
      <div style={{padding:"0 16px"}}>
        {/* Emergency */}
        <div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:14,padding:"12px 16px",margin:"14px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:C.red,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🚨</div>
            <div><div style={{fontSize:13,fontWeight:700,color:C.red}}>{lang==="en"?"Emergency":"आपतकालीन"}</div><div style={{fontSize:11,color:"#B91C1C"}}>{lang==="en"?"Ambulance · Police":"एम्बुलेन्स · प्रहरी"}</div></div>
          </div>
          <a href="tel:102" style={{background:C.red,color:"#fff",borderRadius:10,padding:"8px 18px",fontSize:16,fontWeight:800,textDecoration:"none"}}>📞 102</a>
        </div>
        {/* Quick actions */}
        <Sh title={lang==="en"?"Quick Actions":"के गर्नु छ?"}/>
        {/* Featured AI */}
        <div onClick={()=>setTab("chat")} style={{background:"linear-gradient(135deg,"+C.teal+" 0%,#0F766E 100%)",borderRadius:16,padding:"18px 20px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 6px 16px "+C.teal+"33"}}>
          <div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.7)",fontWeight:600,letterSpacing:1.2,marginBottom:5}}>AI HEALTH ASSISTANT</div>
            <div style={{fontSize:17,fontWeight:800,color:"#fff",marginBottom:4}}>{lang==="en"?"Chat with AI Assistant":"AI सँग कुरा गर्नुहोस्"}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.8)"}}>{lang==="en"?"Ask in any language · Voice 🎤":"जुनसुकै भाषामा · Voice 🎤"}</div>
          </div>
          <div style={{width:52,height:52,borderRadius:14,background:"rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>💬</div>
        </div>
        {/* 4-col grid */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:20}}>
          {[
            {icon:"🩺",label:lang==="en"?"Symptoms":"लक्षण",tab:"check",bg:C.primaryLight,c:C.primary},
            {icon:"👨‍⚕️",label:lang==="en"?"Doctors":"डाक्टर",tab:"doctors",bg:C.purpleLight,c:C.purple},
            {icon:"🩹",label:lang==="en"?"First Aid":"प्राथमिक",tab:"firstaid",bg:C.redLight,c:C.red},
            {icon:"🔔",label:lang==="en"?"Follow-up":"फलो-अप",tab:"followup",bg:C.tealLight,c:C.teal},
          ].map(it=>(
            <div key={it.tab} onClick={()=>setTab(it.tab)} style={{background:it.bg,borderRadius:12,padding:"12px 8px",cursor:"pointer",border:"1px solid "+it.c+"22",textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:5}}>{it.icon}</div>
              <div style={{fontSize:10,fontWeight:600,color:C.text,lineHeight:1.3}}>{it.label}</div>
            </div>
          ))}
        </div>
        {/* Symptoms scroll */}
        <Sh title={lang==="en"?"Common Symptoms":"सामान्य लक्षणहरू"} action={lang==="en"?"See all":"सबै"} onAction={()=>setTab("check")}/>
        <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8,marginBottom:20}}>
          {SYMPTOMS.map(s=>(
            <button key={s.id} onClick={()=>{pickSym(s);setTab("check");}} style={{background:C.white,border:"1px solid "+C.border,borderRadius:14,padding:"12px 10px",flexShrink:0,cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:5,minWidth:72,boxShadow:C.shadow}}>
              <span style={{fontSize:22}}>{s.icon}</span>
              <span style={{fontSize:10,color:C.textMid,fontWeight:500,textAlign:"center",lineHeight:1.3}}>{lang==="en"?s.en:s.ne}</span>
            </button>
          ))}
        </div>
        {/* Available doctors */}
        <Sh title={lang==="en"?"Available Doctors":"उपलब्ध डाक्टरहरू"} action={lang==="en"?"See all":"सबै"} onAction={()=>setTab("doctors")}/>
        {DOCTORS.filter(d=>d.avail).slice(0,2).map((d,i)=>(
          <div key={i} onClick={()=>setTab("doctors")} style={{background:C.white,border:"1px solid "+C.border,borderRadius:14,padding:"14px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:12,boxShadow:C.shadow}}>
            <Av init={d.init} color={d.color} size={48}/>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:2}}>{lang==="en"?d.en:d.ne}</div>
              <div style={{fontSize:11,color:C.textLight,marginBottom:4}}>{lang==="en"?d.specEn:d.specNe}</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{color:C.orange,fontSize:12}}>★</span><span style={{fontSize:12,color:C.textMid,fontWeight:600}}>{d.rating}</span><span style={{fontSize:11,color:C.textLight}}>({d.reviews})</span></div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{background:C.greenLight,color:C.green,borderRadius:6,padding:"3px 10px",fontSize:11,fontWeight:600,marginBottom:4}}>{lang==="en"?d.waitEn:d.waitNe}</div>
              <div style={{fontSize:12,color:C.textMid,fontWeight:600}}>{d.fee}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FIRST AID ──────────────────────────────────────────────────
function FirstAidScreen({lang}){
  const [sel,setSel]=useState(null);
  if(sel){const fa=sel;const steps=lang==="en"?fa.stepsEn:fa.stepsNe;return(
    <div style={{paddingBottom:100}}>
      <div style={{background:fa.bg,padding:"16px 16px 14px",borderBottom:"1px solid "+C.border}}>
        <button onClick={()=>setSel(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:C.textMid,fontFamily:"inherit",fontWeight:600,marginBottom:10,display:"flex",alignItems:"center",gap:4}}>← {lang==="en"?"Back":"पछाडि"}</button>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:52,height:52,borderRadius:14,background:fa.bg,border:"2px solid "+fa.color+"33",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>{fa.icon}</div>
          <div><div style={{fontSize:20,fontWeight:800,color:C.text}}>{lang==="en"?fa.en:fa.ne}</div><div style={{fontSize:12,color:C.textLight,marginTop:2}}>{lang==="en"?"First Aid Guide":"प्राथमिक उपचार"}</div></div>
        </div>
      </div>
      <div style={{padding:"14px 16px"}}>
        <div style={{background:C.primaryLight,borderRadius:12,padding:"10px 14px",marginBottom:14,display:"flex",gap:10,alignItems:"flex-start"}}>
          <span style={{fontSize:18}}>ℹ️</span>
          <span style={{fontSize:12,color:C.primary,lineHeight:1.6}}>{lang==="en"?"General first aid guidance only. For serious conditions, call 102 or go to hospital immediately.":"यो सामान्य प्राथमिक उपचार जानकारी मात्र हो। गम्भीर अवस्थामा तुरुन्त 102 मा फोन गर्नुहोस्।"}</span>
        </div>
        <div style={{background:C.white,borderRadius:16,padding:16,marginBottom:12,boxShadow:C.shadow,border:"1px solid "+C.border}}>
          <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:14,display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>🩹</span>{lang==="en"?"Steps to follow":"गर्नुपर्ने चरणहरू"}</div>
          {steps.map((s,i)=>(
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:i<steps.length-1?12:0,paddingBottom:i<steps.length-1?12:0,borderBottom:i<steps.length-1?"1px solid "+C.border:"none"}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:C.primary,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{i+1}</div>
              <div style={{fontSize:13,color:C.text,lineHeight:1.6,paddingTop:4}}>{s}</div>
            </div>
          ))}
        </div>
        <div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:14,padding:14,marginBottom:12}}>
          <div style={{fontSize:13,fontWeight:700,color:C.red,marginBottom:8}}>⚠️ {lang==="en"?"When to see a doctor":"डाक्टर कहिले देखाउने"}</div>
          <div style={{fontSize:13,color:"#B91C1C",lineHeight:1.7}}>{lang==="en"?fa.whenEn:fa.whenNe}</div>
        </div>
        <div style={{background:C.greenLight,border:"1px solid #A7F3D0",borderRadius:14,padding:14}}>
          <div style={{fontSize:13,fontWeight:700,color:C.green,marginBottom:6}}>✅ {lang==="en"?"Important Note":"महत्वपूर्ण सल्लाह"}</div>
          <div style={{fontSize:13,color:"#065F46",lineHeight:1.7}}>{lang==="en"?fa.noteEn:fa.noteNe}</div>
        </div>
      </div>
    </div>
  );}
  return(
    <div style={{padding:"20px 16px 100px"}}>
      <div style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:4}}>{lang==="en"?"First Aid Guide":"प्राथमिक उपचार मार्गदर्शिका"}</div>
      <div style={{fontSize:13,color:C.textLight,marginBottom:8}}>{lang==="en"?"Step-by-step emergency guidance":"चरणबद्ध आपतकालीन मार्गदर्शन"}</div>
      <div style={{background:C.redLight,border:"1px solid #FECACA",borderRadius:12,padding:"10px 14px",marginBottom:18,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22}}>🚨</span>
          <div><div style={{fontSize:12,fontWeight:700,color:C.red}}>{lang==="en"?"Life-threatening?":"जीवन खतरामा?"}</div><div style={{fontSize:11,color:"#B91C1C"}}>{lang==="en"?"Call 102 immediately":"तुरुन्त 102 मा फोन गर्नुहोस्"}</div></div>
        </div>
        <a href="tel:102" style={{background:C.red,color:"#fff",borderRadius:8,padding:"6px 14px",fontSize:14,fontWeight:800,textDecoration:"none"}}>102</a>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {FIRST_AID.map(fa=>(
          <button key={fa.id} onClick={()=>setSel(fa)} style={{background:C.white,border:"1px solid "+C.border,borderRadius:14,padding:"14px 16px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:14,textAlign:"left",boxShadow:C.shadow}}>
            <div style={{width:46,height:46,borderRadius:12,background:fa.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{fa.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:C.text}}>{lang==="en"?fa.en:fa.ne}</div>
              <div style={{fontSize:12,color:C.textLight,marginTop:2}}>{(lang==="en"?fa.stepsEn[0]:fa.stepsNe[0]).slice(0,50)}...</div>
            </div>
            <span style={{color:C.textLight,fontSize:18}}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── CHECK ─────────────────────────────────────────────────────
function CheckScreen({initSym,setTab,setChatSeed,lang}){
  const [q,setQ]=useState("");const [sel,setSel]=useState(initSym?[initSym]:[]);const [res,setRes]=useState(initSym?[initSym]:null);const [prev,setPrev]=useState("");
  useEffect(()=>{if(initSym){setSel([initSym]);setRes([initSym]);}},[initSym]);
  function search(){const lo=q.toLowerCase();const f=SYMPTOMS.filter(s=>sel.includes(s)||s.roman.some(r=>lo.includes(r))||lo.includes(s.ne.slice(0,2))||lo.includes(s.en.toLowerCase()));setRes(f.length?f:[]);}
  const worst=res?.reduce((w,s)=>{const o={low:0,medium:1,high:2};return o[s.sev]>o[w]?s.sev:w;},"low");
  return(
    <div style={{padding:"20px 16px 100px"}}>
      <div style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:4}}>{lang==="en"?"Symptom Check":"लक्षण जाँच"}</div>
      <div style={{fontSize:13,color:C.textLight,marginBottom:20}}>{lang==="en"?"Type in English, Nepali, or Roman Nepali":"English, नेपाली, वा Roman मा टाइप गर्नुहोस्"}</div>
      <div style={{background:C.white,borderRadius:16,padding:16,border:"1px solid "+C.border,marginBottom:16,boxShadow:C.shadow}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:10,border:"1.5px solid "+C.border,borderRadius:12,padding:"10px 14px",background:C.bg,marginBottom:10}}>
          <span style={{color:C.textLight,marginTop:3}}>🔍</span>
          <textarea value={q} onChange={e=>{setQ(e.target.value);setRes(null);setPrev(r2n(e.target.value)||"");}} placeholder={lang==="en"?"headache and fever for 2 days...":"tauko dukhxa, jworo..."} rows={2} style={{flex:1,border:"none",background:"none",outline:"none",fontSize:14,fontFamily:"inherit",color:C.text,resize:"none",lineHeight:1.6}}/>
        </div>
        {prev&&<div style={{padding:"7px 12px",background:C.primaryLight,borderRadius:8,fontSize:13,color:C.primary,fontWeight:600,marginBottom:10}}>✓ {lang==="en"?"Understood":"बुझियो"}: {prev}</div>}
        <button onClick={search} style={{width:"100%",background:C.primary,color:"#fff",border:"none",borderRadius:10,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{lang==="en"?"Check Symptoms":"जाँच गर्नुहोस्"}</button>
      </div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:12,fontWeight:600,color:C.textLight,textTransform:"uppercase",letterSpacing:0.5,marginBottom:10}}>{lang==="en"?"Or select":"वा छान्नुहोस्"}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {SYMPTOMS.map(s=>{const on=sel.includes(s);return <button key={s.id} onClick={()=>{setSel(p=>on?p.filter(x=>x!==s):[...p,s]);setRes(null);}} style={{background:on?C.primary:C.white,color:on?"#fff":C.textMid,border:"1.5px solid "+(on?C.primary:C.border),borderRadius:20,padding:"8px 16px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}>{s.icon} {lang==="en"?s.en:s.ne}</button>;})}
        </div>
      </div>
      {sel.length>0&&!res&&<button onClick={()=>setRes(sel)} style={{width:"100%",background:C.primary,color:"#fff",border:"none",borderRadius:12,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:16}}>{sel.length} {lang==="en"?"symptom(s) — check now":"वटा लक्षण जाँच गर्नुहोस्"}</button>}
      {res!==null&&(res.length===0?(
        <div style={{background:C.white,borderRadius:14,padding:28,textAlign:"center",border:"1px solid "+C.border}}>
          <div style={{fontSize:40,marginBottom:8}}>🤔</div>
          <div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:4}}>{lang==="en"?"Symptom not found":"लक्षण भेटिएन"}</div>
          <div style={{fontSize:13,color:C.textLight}}>{lang==="en"?"Try chatting with the AI assistant":"AI सहायकसँग कुरा गर्नुहोस्"}</div>
        </div>
      ):(
        <>
          <div style={{background:worst==="high"?C.redLight:worst==="medium"?C.orangeLight:C.greenLight,borderRadius:12,padding:"12px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:24}}>{worst==="high"?"🚨":worst==="medium"?"⚠️":"✅"}</span>
            <div><SevBadge s={worst} lang={lang}/><div style={{fontSize:11,color:C.textMid,marginTop:3}}>{res.length} {lang==="en"?"symptom(s) analyzed":"वटा लक्षण विश्लेषण गरियो"}</div></div>
          </div>
          {res.map((s,i)=>(
            <div key={i} style={{background:C.white,borderRadius:14,padding:16,marginBottom:12,border:"1px solid "+C.border,boxShadow:C.shadow}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <div style={{width:44,height:44,borderRadius:12,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{s.icon}</div>
                  <div><div style={{fontSize:15,fontWeight:700,color:C.text}}>{lang==="en"?s.en:s.ne}</div><div style={{fontSize:11,color:C.textLight}}>{lang==="en"?s.ne:s.en}</div></div>
                </div>
                <SevBadge s={s.sev} lang={lang}/>
              </div>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:11,fontWeight:600,color:C.textLight,textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>{lang==="en"?"Possible causes":"सम्भावित कारण"}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{(lang==="en"?s.causesEn:s.causesNe).map((c,j)=><span key={j} style={{background:C.bg,border:"1px solid "+C.border,borderRadius:6,padding:"3px 10px",fontSize:11,color:C.textMid}}>{c}</span>)}</div>
              </div>
              <div style={{background:C.primaryLight,borderLeft:"3px solid "+C.primary,borderRadius:"0 10px 10px 0",padding:"10px 14px",fontSize:13,color:"#1E40AF",lineHeight:1.7,marginBottom:8}}>{lang==="en"?s.advEn:s.advNe}</div>
              {s.sev!=="low"&&<div style={{background:s.sev==="high"?C.redLight:C.orangeLight,borderRadius:10,padding:"10px 14px",fontSize:13,color:s.sev==="high"?C.red:C.orange,fontWeight:500}}>⚠️ {lang==="en"?s.warnEn:s.warnNe}</div>}
            </div>
          ))}
          <button onClick={()=>{setChatSeed(lang==="en"?"I have: "+res.map(s=>s.en).join(", ")+". What should I do?":"मलाई: "+res.map(s=>s.ne).join(", ")+"। के गर्नु पर्छ?");setTab("chat");}} style={{width:"100%",background:C.white,color:C.primary,border:"1.5px solid "+C.primary,borderRadius:12,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            💬 {lang==="en"?"Get more info from AI":"AI सहायकसँग थप जानकारी"}
          </button>
        </>
      ))}
    </div>
  );
}

// ─── CHAT ──────────────────────────────────────────────────────
function ChatScreen({seed,setSeed,online,user,lang}){
  const welcome=lang==="en"?"Hello! I'm your health assistant. 🙏\n\nWhat's bothering you today? Tell me your symptoms and I'll ask a few questions to give you the best guidance.":"नमस्ते! म तपाईंको स्वास्थ्य सहायक हुँ। 🙏\n\nआज तपाईंलाई के समस्या छ? लक्षण बताउनुहोस् — म केही प्रश्न सोधेर राम्रो सहायता गर्नेछु।";
  const [msgs,setMsgs]=useState([{role:"assistant",text:welcome}]);
  const [input,setInput]=useState("");const [loading,setLoading]=useState(false);const [history,setHistory]=useState([]);const [prev,setPrev]=useState("");
  const bottom=useRef();
  useEffect(()=>{if(seed){setInput(seed);setSeed(null);}},[seed,setSeed]);
  useEffect(()=>{bottom.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  function hi(v){setInput(v);setPrev(isRom(v)?(r2n(v)||""):"");}
  async function saveChat(m,r){if(user?.user_id)await supabase.from("health_chats").insert([{user_id:user.user_id,message:m,role:r}]);}
  async function send(){
    const text=input.trim();if(!text||loading)return;
    setInput("");setPrev("");setMsgs(p=>[...p,{role:"user",text}]);await saveChat(text,"user");setLoading(true);
    if(!online){setTimeout(()=>{const m=SYMPTOMS.find(s=>s.roman.some(r=>text.toLowerCase().includes(r)));const rep=m?(lang==="en"?m.advEn+" "+m.warnEn:m.advNe+" "+m.warnNe):(lang==="en"?"Offline mode — limited response.":"अफलाइन मोड।");setMsgs(p=>[...p,{role:"assistant",text:rep}]);setLoading(false);},600);return;}
    try{const rep=await askAI(text,history,lang);setHistory(h=>[...h,{role:"user",content:text},{role:"assistant",content:rep}].slice(-12));setMsgs(p=>[...p,{role:"assistant",text:rep}]);await saveChat(rep,"assistant");}
    catch{setMsgs(p=>[...p,{role:"assistant",text:lang==="en"?"Sorry, connection failed.":"माफ गर्नुहोस्, जडान भएन।"}]);}
    setLoading(false);
  }
  const qs=lang==="en"?["What should I do?","Should I see a doctor?","Home remedies?","Book a doctor"]:["के गर्नु पर्छ?","डाक्टर जानुपर्छ?","घरमा उपाय?","डाक्टर बुक गर्नुहोस्"];
  return(
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 108px)"}}>
      <div style={{flex:1,overflowY:"auto",padding:"16px 16px 8px"}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:14,gap:8}}>
            {m.role==="assistant"&&<Av init="AI" color={C.primary} size={32}/>}
            <div style={{maxWidth:"78%",background:m.role==="user"?C.primary:C.white,border:m.role==="user"?"none":"1px solid "+C.border,borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"10px 14px",boxShadow:C.shadow}}>
              <div style={{fontSize:13,color:m.role==="user"?"#fff":C.text,lineHeight:1.75,whiteSpace:"pre-wrap"}}>{m.text}</div>
            </div>
          </div>
        ))}
        {loading&&(
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <Av init="AI" color={C.primary} size={32}/>
            <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:"18px 18px 18px 4px",padding:"14px 16px",display:"flex",gap:5,alignItems:"center"}}>
              {[0,0.15,0.3].map((d,j)=><div key={j} style={{width:7,height:7,borderRadius:"50%",background:C.primary,opacity:0.7,animation:"td 1s "+d+"s infinite"}}/>)}
            </div>
          </div>
        )}
        <div ref={bottom}/>
      </div>
      <div style={{padding:"6px 12px 8px",display:"flex",gap:6,overflowX:"auto"}}>
        {qs.map((q,i)=><button key={i} onClick={()=>setInput(q)} style={{background:C.white,border:"1px solid "+C.border,borderRadius:20,padding:"6px 14px",whiteSpace:"nowrap",color:C.textMid,fontSize:11,fontFamily:"inherit",cursor:"pointer",flexShrink:0,boxShadow:C.shadow}}>{q}</button>)}
      </div>
      <div style={{padding:"8px 12px 16px",borderTop:"1px solid "+C.border,background:C.white}}>
        {prev&&<div style={{marginBottom:6,padding:"5px 12px",background:C.primaryLight,borderRadius:8,fontSize:12,color:C.primary,fontWeight:600}}>✓ {prev}</div>}
        <VoiceInput input={input} setInput={hi} onSend={send} loading={loading} lang={lang}/>
      </div>
    </div>
  );
}

// ─── DOCTORS ───────────────────────────────────────────────────
function DoctorsScreen({lang}){
  const [booked,setBooked]=useState(null);const [filter,setFilter]=useState("all");
  const filtered=filter==="available"?DOCTORS.filter(d=>d.avail):DOCTORS;
  return(
    <div style={{padding:"20px 16px 100px"}}>
      <div style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:4}}>{lang==="en"?"Doctors":"डाक्टरहरू"}</div>
      <div style={{fontSize:13,color:C.textLight,marginBottom:16}}>{lang==="en"?"Video consultation from home":"भिडियो परामर्श — घरैबाट"}</div>
      {booked&&<div style={{background:C.greenLight,border:"1px solid #A7F3D0",borderRadius:14,padding:"14px 16px",marginBottom:16}}>
        <div style={{fontSize:14,fontWeight:700,color:C.green,marginBottom:2}}>✅ {lang==="en"?"Appointment Booked!":"बुक भयो!"}</div>
        <div style={{fontSize:12,color:"#065F46"}}>{lang==="en"?booked.en:booked.ne} · {lang==="en"?booked.waitEn:booked.waitNe}</div>
        <button onClick={()=>setBooked(null)} style={{marginTop:8,background:"none",border:"1px solid "+C.green+"44",color:C.green,borderRadius:8,padding:"4px 12px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{lang==="en"?"Close":"बन्द"}</button>
      </div>}
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[["all",lang==="en"?"All":"सबै"],["available",lang==="en"?"Available":"उपलब्ध"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{background:filter===v?C.primary:C.white,color:filter===v?"#fff":C.textMid,border:"1px solid "+(filter===v?C.primary:C.border),borderRadius:20,padding:"7px 18px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>
        ))}
      </div>
      {filtered.map((d,i)=>(
        <div key={i} style={{background:C.white,borderRadius:16,padding:16,marginBottom:12,border:"1px solid "+C.border,opacity:d.avail?1:0.65,boxShadow:C.shadow}}>
          <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
            <Av init={d.init} color={d.color} size={52}/>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:2}}>{lang==="en"?d.en:d.ne}</div>
              <div style={{fontSize:12,color:C.textLight,marginBottom:6}}>{lang==="en"?d.specEn:d.specNe} · {lang==="en"?d.expEn:d.expNe}</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{color:C.orange,fontSize:12}}>★</span><span style={{fontSize:12,color:C.textMid,fontWeight:600}}>{d.rating}</span><span style={{fontSize:11,color:C.textLight}}>({d.reviews})</span></div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{background:d.avail?C.greenLight:C.bg,color:d.avail?C.green:C.textLight,borderRadius:6,padding:"3px 10px",fontSize:11,fontWeight:600,marginBottom:6}}>{d.avail?(lang==="en"?"Available":"उपलब्ध"):(lang==="en"?"Busy":"व्यस्त")}</div>
              <div style={{fontSize:11,color:C.textLight}}>⏱ {lang==="en"?d.waitEn:d.waitNe}</div>
            </div>
          </div>
          <div style={{background:C.bg,borderRadius:10,padding:"8px 12px",display:"flex",justifyContent:"space-between",marginBottom:12}}>
            <span style={{fontSize:12,color:C.textMid}}>{lang==="en"?"Consultation fee":"परामर्श शुल्क"}</span>
            <span style={{fontSize:14,fontWeight:700,color:C.text}}>{d.fee}</span>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>d.avail&&setBooked(d)} disabled={!d.avail} style={{flex:2,background:d.avail?C.primary:C.border,color:"#fff",border:"none",borderRadius:10,padding:"11px",fontSize:13,fontWeight:700,cursor:d.avail?"pointer":"not-allowed",fontFamily:"inherit"}}>📅 {lang==="en"?"Book Appointment":"अपोइन्टमेन्ट बुक"}</button>
            <button style={{flex:1,background:C.primaryLight,color:C.primary,border:"none",borderRadius:10,padding:"11px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{lang==="en"?"Profile":"प्रोफाइल"}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── FOLLOW-UP ─────────────────────────────────────────────────
function FollowUpScreen({user,lang,setTab}){
  const [followups]=useState([
    {id:1,symptom:lang==="en"?"Fever Follow-up":"ज्वरो फलो-अप",date:"2026-05-24",time:"10:00 AM",status:"upcoming",color:C.orange,icon:"🌡️"},
    {id:2,symptom:lang==="en"?"Headache Follow-up":"टाउको दुखाई फलो-अप",date:"2026-05-22",time:"09:00 AM",status:"done",color:C.primary,icon:"🤕"},
  ]);
  const [active,setActive]=useState(null);
  const [step,setStep]=useState(1);
  const [temp,setTemp]=useState("37.0");
  const [feeling,setFeeling]=useState("");
  const [medicine,setMedicine]=useState("");
  const [note,setNote]=useState("");

  if(active){return(
    <div style={{padding:"20px 16px 100px"}}>
      <button onClick={()=>{setActive(null);setStep(1);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:C.textMid,fontFamily:"inherit",fontWeight:600,marginBottom:16,display:"flex",alignItems:"center",gap:4}}>← {lang==="en"?"Back":"पछाडि"}</button>
      <div style={{fontSize:20,fontWeight:800,color:C.text,marginBottom:4}}>{lang==="en"?"Update Follow-up":"फलो-अप अपडेट"}</div>
      <div style={{fontSize:13,color:C.textLight,marginBottom:20}}>{active.symptom}</div>

      {/* Step indicator */}
      <div style={{display:"flex",alignItems:"center",marginBottom:24,gap:4}}>
        {[1,2,3].map(s=>(
          <div key={s} style={{display:"flex",alignItems:"center",gap:4,flex:1}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:step>=s?C.primary:C.bg,color:step>=s?"#fff":C.textLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,border:"2px solid "+(step>=s?C.primary:C.border),flexShrink:0}}>{step>s?"✓":s}</div>
            {s<3&&<div style={{flex:1,height:2,background:step>s?C.primary:C.border}}/>}
          </div>
        ))}
      </div>

      {step===1&&(
        <div>
          <div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:16}}>{lang==="en"?"How is your temperature?":"तापक्रम कति छ?"}</div>
          <div style={{background:C.white,borderRadius:16,padding:20,border:"1px solid "+C.border,marginBottom:16,textAlign:"center"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,marginBottom:12}}>
              <button onClick={()=>setTemp(p=>(parseFloat(p)-0.1).toFixed(1))} style={{width:40,height:40,borderRadius:"50%",background:C.bg,border:"1px solid "+C.border,fontSize:20,cursor:"pointer"}}>−</button>
              <div>
                <div style={{fontSize:36,fontWeight:800,color:C.primary}}>{temp} °C</div>
                <div style={{fontSize:12,color:C.textLight}}>{lang==="en"?"Normal: 36.1°C – 37.2°C":"सामान्य: ३६.१°C – ३७.२°C"}</div>
              </div>
              <button onClick={()=>setTemp(p=>(parseFloat(p)+0.1).toFixed(1))} style={{width:40,height:40,borderRadius:"50%",background:C.bg,border:"1px solid "+C.border,fontSize:20,cursor:"pointer"}}>+</button>
            </div>
            <div style={{background:parseFloat(temp)>37.5?C.redLight:parseFloat(temp)>37.2?C.orangeLight:C.greenLight,borderRadius:8,padding:"6px 14px",display:"inline-block",fontSize:12,fontWeight:600,color:parseFloat(temp)>37.5?C.red:parseFloat(temp)>37.2?C.orange:C.green}}>
              {parseFloat(temp)>37.5?(lang==="en"?"High fever":"उच्च ज्वरो"):parseFloat(temp)>37.2?(lang==="en"?"Mild fever":"हल्का ज्वरो"):(lang==="en"?"Normal":"सामान्य")}
            </div>
          </div>
          <button onClick={()=>setStep(2)} style={{width:"100%",background:C.primary,color:"#fff",border:"none",borderRadius:12,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{lang==="en"?"Next →":"अर्को →"}</button>
        </div>
      )}

      {step===2&&(
        <div>
          <div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:16}}>{lang==="en"?"How are you feeling?":"अवस्था कस्तो छ?"}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:20}}>
            {[{e:"😄",l:lang==="en"?"Great":"धेरै राम्रो"},{e:"🙂",l:lang==="en"?"Good":"राम्रो"},{e:"😐",l:lang==="en"?"OK":"उस्तै छ"},{e:"😟",l:lang==="en"?"Bad":"खराब"},{e:"😣",l:lang==="en"?"Very bad":"धेरै खराब"}].map(f=>(
              <button key={f.l} onClick={()=>setFeeling(f.l)} style={{background:feeling===f.l?C.primaryLight:C.white,border:"2px solid "+(feeling===f.l?C.primary:C.border),borderRadius:12,padding:"10px 4px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <span style={{fontSize:22}}>{f.e}</span>
                <span style={{fontSize:9,color:feeling===f.l?C.primary:C.textLight,fontWeight:600,textAlign:"center",lineHeight:1.2}}>{f.l}</span>
              </button>
            ))}
          </div>
          <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:10}}>{lang==="en"?"Taking medicine?":"औषधि लिइरहनुभएको छ?"}</div>
          {[lang==="en"?"Yes, taking it":"लिइरहेको छु",lang==="en"?"Started taking":"लिन सुरु गरेको छैन",lang==="en"?"Not taking":"लिएको छैन"].map(m=>(
            <div key={m} onClick={()=>setMedicine(m)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:C.white,border:"1.5px solid "+(medicine===m?C.primary:C.border),borderRadius:10,marginBottom:8,cursor:"pointer"}}>
              <div style={{width:18,height:18,borderRadius:"50%",border:"2px solid "+(medicine===m?C.primary:C.border),background:medicine===m?C.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                {medicine===m&&<div style={{width:8,height:8,borderRadius:"50%",background:"#fff"}}/>}
              </div>
              <span style={{fontSize:13,color:C.text}}>{m}</span>
            </div>
          ))}
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <button onClick={()=>setStep(1)} style={{flex:1,background:C.bg,color:C.textMid,border:"1px solid "+C.border,borderRadius:12,padding:"12px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>← {lang==="en"?"Back":"पछाडि"}</button>
            <button onClick={()=>setStep(3)} style={{flex:2,background:C.primary,color:"#fff",border:"none",borderRadius:12,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{lang==="en"?"Next →":"अर्को →"}</button>
          </div>
        </div>
      )}

      {step===3&&(
        <div>
          <div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:4}}>{lang==="en"?"Summary":"सारांश"}</div>
          <div style={{fontSize:13,color:C.textLight,marginBottom:16}}>{lang==="en"?"Add any additional notes (optional)":"थप टिप्पणी थप्नुहोस् (ऐच्छिक)"}</div>
          <div style={{background:C.white,borderRadius:14,padding:14,border:"1px solid "+C.border,marginBottom:12}}>
            {[
              {l:lang==="en"?"Temperature":"तापक्रम",v:temp+"°C"},
              {l:lang==="en"?"Feeling":"अवस्था",v:feeling||"—"},
              {l:lang==="en"?"Medicine":"औषधि",v:medicine||"—"},
            ].map(({l,v})=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid "+C.border}}>
                <span style={{fontSize:13,color:C.textMid}}>{l}</span>
                <span style={{fontSize:13,fontWeight:600,color:C.text}}>{v}</span>
              </div>
            ))}
          </div>
          <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={lang==="en"?"E.g. Fever reduced slightly, still have headache...":"जस्तै: ज्वरो अलि कम भयो, टाउको अझै दुखिरहेको छ..."} rows={3} style={{width:"100%",border:"1.5px solid "+C.border,borderRadius:12,padding:"12px 14px",fontSize:13,fontFamily:"inherit",color:C.text,outline:"none",resize:"none",boxSizing:"border-box",marginBottom:12}} onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.border}/>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setStep(2)} style={{flex:1,background:C.bg,color:C.textMid,border:"1px solid "+C.border,borderRadius:12,padding:"12px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>← {lang==="en"?"Back":"पछाडि"}</button>
            <button onClick={()=>{setActive(null);setStep(1);}} style={{flex:2,background:C.green,color:"#fff",border:"none",borderRadius:12,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✅ {lang==="en"?"Submit Update":"अपडेट पठाउनुहोस्"}</button>
          </div>
        </div>
      )}
    </div>
  );}

  return(
    <div style={{padding:"20px 16px 100px"}}>
      <div style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:4}}>{lang==="en"?"Follow-up Reminders":"फलो-अप रिमाइन्डर"}</div>
      <div style={{fontSize:13,color:C.textLight,marginBottom:16}}>{lang==="en"?"Track your health progress":"आफ्नो स्वास्थ्य अवस्थाको नियमित फलो-अप"}</div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
        {[
          {v:followups.filter(f=>f.status==="upcoming").length,l:lang==="en"?"Upcoming":"आगामी",c:C.orange},
          {v:followups.filter(f=>f.status==="done").length,l:lang==="en"?"Completed":"पूरा भयो",c:C.green},
          {v:0,l:lang==="en"?"Missed":"छुटेको",c:C.red},
        ].map(({v,l,c})=>(
          <div key={l} style={{background:C.white,borderRadius:14,padding:"14px 10px",textAlign:"center",border:"1px solid "+C.border,boxShadow:C.shadow}}>
            <div style={{fontSize:24,fontWeight:800,color:c}}>{v}</div>
            <div style={{fontSize:10,color:C.textMid,marginTop:3}}>{l}</div>
          </div>
        ))}
      </div>

      <Sh title={lang==="en"?"Upcoming Follow-ups":"आगामी फलो-अप"} action={lang==="en"?"+ Add":"+ थप्नुहोस्"} onAction={()=>{}}/>
      {followups.filter(f=>f.status==="upcoming").map(f=>(
        <div key={f.id} onClick={()=>setActive(f)} style={{background:C.white,border:"1px solid "+C.border,borderRadius:14,padding:"14px",marginBottom:10,cursor:"pointer",boxShadow:C.shadow,display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:12,background:f.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{f.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:2}}>{f.symptom}</div>
            <div style={{fontSize:12,color:C.textLight}}>📅 {f.date} · ⏱ {f.time}</div>
          </div>
          <span style={{background:C.orangeLight,color:C.orange,borderRadius:8,padding:"4px 10px",fontSize:11,fontWeight:600}}>{lang==="en"?"Upcoming":"आगामी"}</span>
        </div>
      ))}

      <Sh title={lang==="en"?"Past Follow-ups":"हालैका फलो-अप"}/>
      {followups.filter(f=>f.status==="done").map(f=>(
        <div key={f.id} style={{background:C.white,border:"1px solid "+C.border,borderRadius:14,padding:"14px",marginBottom:10,boxShadow:C.shadow,display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:12,background:C.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{f.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:2}}>{f.symptom}</div>
            <div style={{fontSize:12,color:C.textLight}}>📅 {f.date} · ⏱ {f.time}</div>
          </div>
          <span style={{background:C.greenLight,color:C.green,borderRadius:8,padding:"4px 10px",fontSize:11,fontWeight:600}}>✓ {lang==="en"?"Done":"पूरा"}</span>
        </div>
      ))}

      {followups.length===0&&(
        <div style={{background:C.white,borderRadius:14,padding:24,textAlign:"center",border:"1px solid "+C.border}}>
          <div style={{fontSize:36,marginBottom:8}}>🔔</div>
          <div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:4}}>{lang==="en"?"No follow-ups yet":"फलो-अप छैन"}</div>
          <div style={{fontSize:12,color:C.textLight}}>{lang==="en"?"Chat with AI to start a follow-up":"AI सँग कुरा गर्नुहोस्"}</div>
        </div>
      )}
    </div>
  );
}

// ─── PROFILE ───────────────────────────────────────────────────
function ProfileScreen({user,onLogout,lang,onLangChange}){
  const [history,setHistory]=useState([]);const [loading,setLoading]=useState(true);
  useEffect(()=>{async function load(){const{data}=await supabase.from("health_chats").select("*").eq("user_id",user.user_id).eq("role","user").order("created_at",{ascending:false}).limit(20);setHistory(data||[]);setLoading(false);}load();},[user.user_id]);
  async function handleLangChange(l){onLangChange(l);await supabase.from("health_profiles").update({lang:l}).eq("user_id",user.user_id);const s=JSON.parse(localStorage.getItem("ss_user")||"{}");localStorage.setItem("ss_user",JSON.stringify({...s,lang:l}));}
  async function handleLogout(){await supabase.auth.signOut();localStorage.removeItem("ss_user");onLogout();}
  return(
    <div style={{padding:"20px 16px 100px"}}>
      <div style={{background:"linear-gradient(135deg,#1D4ED8,#2563EB)",borderRadius:20,padding:"20px",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
          <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>👤</div>
          <div>
            <div style={{fontSize:18,fontWeight:800,color:"#fff"}}>{user.name}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.75)",marginTop:2}}>{[user.local_level,user.district,user.province].filter(Boolean).join(", ")||"Nepal"}</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          {[{l:lang==="en"?"Chats":"कुराकानी",v:history.length},{l:lang==="en"?"District":"जिल्ला",v:user.district||"—"},{l:lang==="en"?"Age":"उमेर",v:user.age||"—"}].map(({l,v})=>(
            <div key={l} style={{background:"rgba(255,255,255,0.15)",borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
              <div style={{fontSize:14,fontWeight:800,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.7)",marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:C.white,borderRadius:14,padding:"14px 16px",marginBottom:12,border:"1px solid "+C.border,boxShadow:C.shadow}}>
        <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:10}}>🌐 {lang==="en"?"Language":"भाषा"}</div>
        <div style={{display:"flex",background:C.bg,borderRadius:12,padding:4,gap:4}}>
          {[["en","English"],["ne","नेपाली"]].map(([l,label])=>(
            <button key={l} onClick={()=>handleLangChange(l)} style={{flex:1,background:lang===l?C.white:"transparent",color:lang===l?C.primary:C.textLight,border:"none",borderRadius:9,padding:"10px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:lang===l?"0 1px 4px rgba(0,0,0,0.08)":"none"}}>{label}</button>
          ))}
        </div>
      </div>
      <Sh title={lang==="en"?"Health History":"स्वास्थ्य इतिहास"}/>
      {loading?<div style={{textAlign:"center",padding:20,color:C.textLight}}>{lang==="en"?"Loading...":"लोड हुँदैछ..."}</div>:
      history.length===0?(
        <div style={{background:C.white,borderRadius:14,padding:24,textAlign:"center",border:"1px solid "+C.border}}>
          <div style={{fontSize:36,marginBottom:8}}>💬</div>
          <div style={{fontSize:14,fontWeight:600,color:C.text}}>{lang==="en"?"No conversations yet":"कुराकानी छैन"}</div>
        </div>
      ):history.map((h,i)=>(
        <div key={i} style={{background:C.white,borderRadius:12,padding:"12px 14px",marginBottom:8,border:"1px solid "+C.border,boxShadow:C.shadow}}>
          <div style={{fontSize:13,color:C.text,marginBottom:4,lineHeight:1.5}}>{h.message.length>80?h.message.slice(0,80)+"...":h.message}</div>
          <div style={{fontSize:10,color:C.textLight}}>{new Date(h.created_at).toLocaleDateString(lang==="ne"?"ne-NP":"en-US",{year:"numeric",month:"short",day:"numeric"})}</div>
        </div>
      ))}
      <div style={{marginTop:16,borderTop:"1px solid "+C.border,paddingTop:16}}>
        <button onClick={handleLogout} style={{width:"100%",background:"#FEF2F2",color:C.red,border:"1px solid #FECACA",borderRadius:12,padding:"13px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🚪 {lang==="en"?"Sign Out":"साइन आउट"}</button>
      </div>
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────
export default function App(){
  const [user,setUser]=useState(null);const [authLoading,setAuthLoading]=useState(true);
  const [lang,setLang]=useState("en");const [tab,setTab]=useState("home");
  const [online,setOnline]=useState(navigator.onLine);
  const [pickedSym,setPickedSym]=useState(null);const [chatSeed,setChatSeed]=useState(null);
  const [drawerOpen,setDrawerOpen]=useState(false);

  useEffect(()=>{
    const s=localStorage.getItem("ss_user");
    if(s){try{const p=JSON.parse(s);setUser(p);setLang(p.lang||"en");}catch(e){}}
    setAuthLoading(false);
    window.addEventListener("online",()=>setOnline(true));
    window.addEventListener("offline",()=>setOnline(false));
  },[]);

  function handleLangChange(l){setLang(l);const s=JSON.parse(localStorage.getItem("ss_user")||"{}");localStorage.setItem("ss_user",JSON.stringify({...s,lang:l}));}

  if(authLoading)return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#1D4ED8,#2563EB)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:12}}>🏥</div>
        <div style={{fontSize:16,color:"#fff",fontWeight:700}}>Swasthya Sahayak</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",marginTop:6}}>Loading...</div>
      </div>
    </div>
  );

  if(!user)return <AuthScreen onLogin={(u)=>{setUser(u);setLang(u.lang||"en");}}/>;

  return(
    <div style={{background:C.bg,minHeight:"100vh",maxWidth:480,margin:"0 auto",position:"relative",fontFamily:"'Inter','Noto Sans Devanagari','Segoe UI',system-ui,sans-serif",color:C.text}}>
      <style>{}</style>

      {/* Header */}
      <div style={{background:C.white,padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid "+C.border,position:"sticky",top:0,zIndex:50,boxShadow:"0 1px 6px rgba(0,0,0,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:9,background:C.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🏥</div>
          <div>
            <div style={{fontSize:15,fontWeight:800,color:C.text,lineHeight:1}}>{lang==="en"?"Swasthya Sahayak":"स्वास्थ्य सहायक"}</div>
            <div style={{fontSize:9,color:C.textLight,marginTop:1}}>Nepal AI Health Assistant</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {/* Lang toggle */}
          <div style={{display:"flex",background:C.bg,borderRadius:16,padding:3,border:"1px solid "+C.border,gap:2}}>
            {["en","ne"].map(l=><button key={l} onClick={()=>handleLangChange(l)} style={{background:lang===l?C.primary:"transparent",color:lang===l?"#fff":C.textLight,border:"none",borderRadius:12,padding:"3px 9px",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s"}}>{l==="en"?"EN":"ने"}</button>)}
          </div>
          {/* Online badge */}
          <div style={{display:"flex",alignItems:"center",gap:4,background:online?C.greenLight:C.orangeLight,padding:"4px 8px",borderRadius:20}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:online?C.green:C.orange}}/>
            <span style={{fontSize:9,fontWeight:700,color:online?C.green:C.orange}}>{online?"Live":"Offline"}</span>
          </div>
          {/* Hamburger */}
          <button onClick={()=>setDrawerOpen(true)} style={{background:"none",border:"none",cursor:"pointer",padding:"4px",display:"flex",flexDirection:"column",gap:4,justifyContent:"center"}}>
            <div style={{width:20,height:2,background:C.textMid,borderRadius:2}}/>
            <div style={{width:20,height:2,background:C.textMid,borderRadius:2}}/>
            <div style={{width:14,height:2,background:C.textMid,borderRadius:2}}/>
          </button>
        </div>
      </div>

      {!online&&<div style={{background:C.orangeLight,padding:"7px 16px",fontSize:12,color:C.orange,fontWeight:500,borderBottom:"1px solid #FDE68A"}}>⚠️ {lang==="en"?"No internet — basic features available":"इन्टरनेट छैन — मूल सुविधा उपलब्ध"}</div>}

      <div style={{height:"calc(100vh - "+(online?55:80)+"px - 54px)",overflowY:"auto"}}>
        {tab==="home"     && <HomeScreen setTab={setTab} pickSym={setPickedSym} user={user} lang={lang}/>}
        {tab==="check"    && <CheckScreen initSym={pickedSym} setTab={setTab} setChatSeed={setChatSeed} lang={lang}/>}
        {tab==="firstaid" && <FirstAidScreen lang={lang}/>}
        {tab==="chat"     && <ChatScreen seed={chatSeed} setSeed={setChatSeed} online={online} user={user} lang={lang}/>}
        {tab==="doctors"  && <DoctorsScreen lang={lang}/>}
        {tab==="followup" && <FollowUpScreen user={user} lang={lang} setTab={setTab}/>}
        {tab==="profile"  && <ProfileScreen user={user} onLogout={()=>setUser(null)} lang={lang} onLangChange={handleLangChange}/>}
        {tab==="history"  && <ProfileScreen user={user} onLogout={()=>setUser(null)} lang={lang} onLangChange={handleLangChange}/>}
      </div>

      <NavBar tab={tab} setTab={setTab} lang={lang}/>

      <Drawer open={drawerOpen} onClose={()=>setDrawerOpen(false)} setTab={(t)=>setTab(t)} user={user} onLogout={async()=>{await supabase.auth.signOut();localStorage.removeItem("ss_user");setUser(null);}} lang={lang} onLangChange={handleLangChange}/>
    </div>
  );
}