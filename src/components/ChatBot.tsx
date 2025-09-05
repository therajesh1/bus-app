import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Globe, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';

interface ChatBotProps {
  userRole: 'passenger' | 'driver';
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  language: string;
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇮🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' }
];

const translations = {
  en: {
    chatTitle: 'BusTracker Assistant',
    typePlaceholder: 'Ask about routes, schedules, or any questions...',
    send: 'Send',
    selectLanguage: 'Select Language',
    voiceOn: 'Voice On',
    voiceOff: 'Voice Off',
    listening: 'Listening...',
    quickReplies: {
      passenger: [
        'When is the next bus?',
        'What routes go to downtown?',
        'Is bus 42A running late?',
        'Set an alarm for my stop',
        'Report a problem'
      ],
      driver: [
        'How do I start a trip?',
        'Update my bus number',
        'Report GPS issues',
        'End my shift',
        'Technical support'
      ]
    }
  },
  hi: {
    chatTitle: 'BusTracker सहायक',
    typePlaceholder: 'रूट, समय-सारणी या किसी भी प्रश्न के बारे में पूछें...',
    send: 'भेजें',
    selectLanguage: 'भाषा चुनें',
    voiceOn: 'आवाज़ चालू',
    voiceOff: 'आवाज़ बंद',
    listening: 'सुन रहा है...',
    quickReplies: {
      passenger: [
        'अगली बस कब आएगी?',
        'शहर जाने वाले रूट कौन से हैं?',
        'क्या 42A बस देर से चल रही है?',
        'मेरे स्टॉप के लिए अलार्म सेट करें',
        'समस्या की रिपोर्ट करें'
      ],
      driver: [
        'यात्रा कैसे शुरू करूं?',
        'बस नंबर अपडेट करें',
        'GPS समस्याओं की रिपोर्ट करें',
        'अपनी शिफ्ट समाप्त करें',
        'तकनीकी सहायता'
      ]
    }
  },
  bn: {
    chatTitle: 'BusTracker সহায়ক',
    typePlaceholder: 'রুট, সময়সূচী বা যেকোনো প্রশ্ন সম্পর্কে জিজ্ঞাসা করুন...',
    send: 'পাঠান',
    selectLanguage: 'ভাষা নির্বাচন করুন',
    voiceOn: 'ভয়েস চালু',
    voiceOff: 'ভয়েস বন্ধ',
    listening: 'শুনছে...',
    quickReplies: {
      passenger: [
        'পরবর্তী বাস কখন আসবে?',
        'শহরে যাওয়ার রুট কোনগুলো?',
        '42A বাস দেরিতে চলছে কি?',
        'আমার স্টপের জন্য অ্যালার্ম সেট করুন',
        'সমস্যার রিপোর্ট করুন'
      ],
      driver: [
        'কীভাবে ট্রিপ শুরু করব?',
        'বাস নম্বর আপডেট করুন',
        'GPS সমস্যার রিপোর্ট করুন',
        'আমার শিফট শেষ করুন',
        'প্রযুক্তিগত সহায়তা'
      ]
    }
  },
  ta: {
    chatTitle: 'BusTracker உதவியாளர்',
    typePlaceholder: 'வழித்தடங்கள், அட்டவணைகள் அல்லது எந்த கேள்விகளையும் கேளுங்கள்...',
    send: 'அனுப்பு',
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    voiceOn: 'குரல் இயக்கம்',
    voiceOff: 'குரல் நிறுத்தம்',
    listening: 'கேட்டுக்கொண்டிருக்கிறது...',
    quickReplies: {
      passenger: [
        'அடுத்த பேருந்து எப்போது வரும்?',
        'நகரத்திற்குச் செல்லும் வழித்தடங்கள் எவை?',
        '42A பேருந்து தாமதமாக ஓடுகிறதா?',
        'என் நிறுத்தத்திற்கு அலாரம் வைக்கவும்',
        'சிக்கலைப் புகாரளிக்கவும்'
      ],
      driver: [
        'பயணத்தை எப்படி தொடங்குவது?',
        'பேருந்து எண்ணைப் புதுப்பிக்கவும்',
        'GPS சிக்கல்களைப் புகாரளிக்கவும்',
        'என் ஷிப்டை முடிக்கவும்',
        'தொழில்நுட்ப ஆதரவு'
      ]
    }
  },
  te: {
    chatTitle: 'BusTracker సహాయకుడు',
    typePlaceholder: 'రూట్లు, షెడ్యూల్స్ లేదా ఏవైనా ప్రశ్నల గురించి అడగండి...',
    send: 'పంపండి',
    selectLanguage: 'భాషను ఎంచుకోండి',
    voiceOn: 'వాయిస్ ఆన్',
    voiceOff: 'వాయిస్ ఆఫ్',
    listening: 'వింటోంది...',
    quickReplies: {
      passenger: [
        'తదుపరి బస్ ఎప్పుడు వస్తుంది?',
        'నగరానికి వెళ్ళే రూట్లు ఏవి?',
        '42A బస్ ఆలస్యంగా నడుస్తుందా?',
        'నా స్టాప్ కోసం అలారం సెట్ చేయండి',
        'సమస్యను రిపోర్ట్ చేయండి'
      ],
      driver: [
        'ట్రిప్ ఎలా ప్రారంభించాలి?',
        'బస్ నంబర్ అప్డేట్ చేయండి',
        'GPS సమస్యలను రిపోర్ట్ చేయండి',
        'నా షిఫ్ట్ ముగించండి',
        'సాంకేతిక మద్దతు'
      ]
    }
  },
  mr: {
    chatTitle: 'BusTracker सहाय्यक',
    typePlaceholder: 'मार्ग, वेळापत्रक किंवा कोणत्याही प्रश्नांबद्दल विचारा...',
    send: 'पाठवा',
    selectLanguage: 'भाषा निवडा',
    voiceOn: 'आवाज चालू',
    voiceOff: 'आवाज बंद',
    listening: 'ऐकत आहे...',
    quickReplies: {
      passenger: [
        'पुढची बस कधी येईल?',
        'शहरात जाणारे मार्ग कोणते?',
        '42A बस उशिरा चालू आहे का?',
        'माझ्या स्टॉपसाठी अलार्म सेट करा',
        'समस्येची तक्रार करा'
      ],
      driver: [
        'ट्रिप कशी सुरू करावी?',
        'बस नंबर अपडेट करा',
        'GPS समस्यांची तक्रार करा',
        'माझी शिफ्ट संपवा',
        'तांत्रिक मदत'
      ]
    }
  },
  gu: {
    chatTitle: 'BusTracker સહાયક',
    typePlaceholder: 'રૂટ્સ, શેડ્યૂલ્સ અથવા કોઈપણ પ્રશ્નો વિશે પૂછો...',
    send: 'મોકલો',
    selectLanguage: 'ભાષા પસંદ કરો',
    voiceOn: 'વૉઇસ ચાલુ',
    voiceOff: 'વૉઇસ બંધ',
    listening: 'સાંભળી રહ્યું છે...',
    quickReplies: {
      passenger: [
        'આગળની બસ ક્યારે આવશે?',
        'શહેરમાં જવાના રૂટ્સ કયા છે?',
        '42A બસ મોડી ચાલી રહી છે?',
        'મારા સ્ટોપ માટે અલાર્મ સેટ કરો',
        'સમસ્યાની જાણ કરો'
      ],
      driver: [
        'ટ્રિપ કેવી રીતે શરૂ કરવી?',
        'બસ નંબર અપડેટ કરો',
        'GPS સમસ્યાઓની જાણ કરો',
        'મારી શિફ્ટ સમાપ્ત કરો',
        'ટેકનિકલ સપોર્ટ'
      ]
    }
  },
  kn: {
    chatTitle: 'BusTracker ಸಹಾಯಕ',
    typePlaceholder: 'ಮಾರ್ಗಗಳು, ವೇಳಾಪಟ್ಟಿಗಳು ಅಥವಾ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ...',
    send: 'ಕಳುಹಿಸಿ',
    selectLanguage: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    voiceOn: 'ಧ್ವನಿ ಆನ್',
    voiceOff: 'ಧ್ವನಿ ಆಫ್',
    listening: 'ಕೇಳುತ್ತಿದೆ...',
    quickReplies: {
      passenger: [
        'ಮುಂದಿನ ಬಸ್ ಯಾವಾಗ ಬರುತ್ತದೆ?',
        'ನಗರಕ್ಕೆ ಹೋಗುವ ಮಾರ್ಗಗಳು ಯಾವುವು?',
        '42A ಬಸ್ ತಡವಾಗಿ ಓಡುತ್ತಿದೆಯೇ?',
        'ನನ್ನ ನಿಲ್ದಾಣಕ್ಕೆ ಅಲಾರಂ ಹೊಂದಿಸಿ',
        'ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ'
      ],
      driver: [
        'ಪ್ರಯಾಣವನ್ನು ಹೇಗೆ ಪ್ರಾರಂಭಿಸುವುದು?',
        'ಬಸ್ ಸಂಖ್ಯೆಯನ್ನು ನವೀಕರಿಸಿ',
        'GPS ಸಮಸ್ಯೆಗಳನ್ನು ವರದಿ ಮಾಡಿ',
        'ನನ್ನ ಶಿಫ್ಟ್ ಮುಗಿಸಿ',
        'ತಾಂತ್ರಿಕ ಬೆಂಬಲ'
      ]
    }
  }
};

const responses = {
  en: {
    greeting: "Hello! I'm your BusTracker assistant. How can I help you today?",
    nextBus: "The next bus on your route is arriving in 8 minutes. Would you like me to set a notification?",
    routes: "Here are the routes to downtown: 42A (8 min), 15B (15 min), 23C (22 min). Which one would you like to track?",
    busStatus: "Bus 42A is currently running 3 minutes late due to traffic on Main St. The updated ETA is 11 minutes.",
    setAlarm: "I'd be happy to help you set an alarm! Which bus and stop would you like to be notified about?",
    problem: "I'm sorry to hear about the issue. Please describe the problem and I'll help you report it to our support team.",
    startTrip: "To start a trip: 1) Make sure your bus number is correct, 2) Press the green 'Start Trip' button, 3) GPS tracking will begin automatically.",
    updateBus: "To update your bus number, tap the 'Edit' button next to your current bus number and enter the new number.",
    gpsIssues: "If you're experiencing GPS issues, try: 1) Check your location permissions, 2) Restart the app, 3) Contact support if the problem persists.",
    endShift: "To end your shift, press the red 'End Trip' button. This will stop GPS tracking and log your trip duration.",
    support: "For technical support, you can: 1) Check our FAQ section, 2) Contact support at support@bustracker.com, 3) Call our 24/7 helpline.",
    default: "I understand you're asking about bus services. Could you please be more specific about what you need help with?"
  },
  hi: {
    greeting: "नमस्ते! मैं आपका BusTracker सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
    nextBus: "आपके रूट पर अगली बस 8 मिनट में आ रही है। क्या आप चाहते हैं कि मैं एक नोटिफिकेशन सेट कर दूं?",
    routes: "शहर जाने वाले रूट हैं: 42A (8 मिनट), 15B (15 मिनट), 23C (22 मिनट)। आप कौन सा ट्रैक करना चाहते हैं?",
    busStatus: "बस 42A मुख्य सड़क पर ट्रैफिक के कारण 3 मिनट देरी से चल रही है। अपडेटेड ETA 11 मिनट है।",
    setAlarm: "मैं अलार्म सेट करने में आपकी मदद करूंगा! आप किस बस और स्टॉप के लिए नोटिफिकेशन चाहते हैं?",
    problem: "समस्या के बारे में सुनकर दुख हुआ। कृपया समस्या का वर्णन करें और मैं इसे हमारी सपोर्ट टीम को रिपोर्ट करने में मदद करूंगा।",
    startTrip: "यात्रा शुरू करने के लिए: 1) सुनिश्चित करें कि आपका बस नंबर सही है, 2) हरे 'यात्रा शुरू करें' बटन को दबाएं, 3) GPS ट्रैकिंग अपने आप शुरू हो जाएगी।",
    updateBus: "बस नंबर अपडेट करने के लिए, अपने वर्तमान बस नंबर के पास 'संपादित करें' बटन पर टैप करें और नया नंबर दर्ज करें।",
    gpsIssues: "यदि आपको GPS समस्याएं आ रही हैं, तो कोशिश करें: 1) अपनी लोकेशन परमिशन चेक करें, 2) ऐप को रीस्टार्ट करें, 3) समस्या बनी रहने पर सपोर्ट से संपर्क करें।",
    endShift: "अपनी शिफ्ट समाप्त करने के लिए, लाल 'यात्रा समाप्त करें' बटन दबाएं। यह GPS ट्रैकिंग बंद कर देगा और आपकी यात्रा की अवधि लॉग करेगा।",
    support: "तकनीकी सहायता के लिए, आप कर सकते हैं: 1) हमारा FAQ सेक्शन देखें, 2) support@bustracker.com पर सपोर्ट से संपर्क करें, 3) हमारी 24/7 हेल्पलाइन कॉल करें।",
    default: "मैं समझ गया कि आप बस सेवाओं के बारे में पूछ रहे हैं। क्या आप कृपया बता सकते हैं कि आपको किस चीज़ में मदद चाहिए?"
  },
  bn: {
    greeting: "নমস্কার! আমি আপনার BusTracker সহায়ক। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
    nextBus: "আপনার রুটের পরবর্তী বাস ৮ মিনিটে আসছে। আপনি কি চান আমি একটি নোটিফিকেশন সেট করি?",
    routes: "শহরে যাওয়ার রুটগুলো হলো: 42A (৮ মিনিট), 15B (১৫ মিনিট), 23C (২২ মিনিট)। আপনি কোনটি ট্র্যাক করতে চান?",
    busStatus: "বাস 42A মেইন স্ট্রিটে ট্রাফিকের কারণে ৩ মিনিট দেরিতে চলছে। আপডেটেড ETA ১১ মিনিট।",
    setAlarm: "আমি অ্যালার্ম সেট করতে সাহায্য করব! আপনি কোন বাস এবং স্টপের জন্য নোটিফিকেশন চান?",
    problem: "সমস্যার কথা শুনে দুঃখিত। দয়া করে সমস্যাটি বর্ণনা করুন এবং আমি আমাদের সাপোর্ট টিমে রিপোর্ট করতে সাহায্য করব।",
    startTrip: "ট্রিপ শুরু করতে: ১) নিশ্চিত করুন আপনার বাস নম্বর সঠিক, ২) সবুজ 'ট্রিপ শুরু করুন' বাটন চাপুন, ৩) GPS ট্র্যাকিং স্বয়ংক্রিয়ভাবে শুরু হবে।",
    updateBus: "বাস নম্বর আপডেট করতে, আপনার বর্তমান বাস নম্বরের পাশে 'সম্পাদনা' বাটনে ট্যাপ করুন এবং নতুন নম্বর দিন।",
    gpsIssues: "যদি GPS সমস্যা হয়, চেষ্টা করুন: ১) আপনার লোকেশন পারমিশন চেক করুন, ২) অ্যাপ রিস্টার্ট করুন, ৩) সমস্যা অব্যাহত থাকলে সাপোর্টে যোগাযোগ করুন।",
    endShift: "আপনার শিফট শেষ করতে, লাল 'ট্রিপ শেষ করুন' বাটন চাপুন। এটি GPS ট্র্যাকিং বন্ধ করবে এবং আপনার ট্রিপের সময় লগ করবে।",
    support: "প্রযুক্তিগত সহায়তার জন্য: ১) আমাদের FAQ বিভাগ দেখুন, ২) support@bustracker.com এ সাপোর্টে যোগাযোগ করুন, ৩) আমাদের ২৪/৭ হেল্পলাইনে কল করুন।",
    default: "আমি বুঝতে পারছি আপনি বাস সেবা সম্পর্কে জিজ্ঞাসা করছেন। আপনি কী নিয়ে সাহায্য চান তা আরও স্পষ্ট করে বলতে পারেন?"
  },
  ta: {
    greeting: "வணக்கம்! நான் உங்கள் BusTracker உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
    nextBus: "உங்கள் பாதையில் அடுத்த பேருந்து 8 நிமிடங்களில் வரும். நான் ஒரு அறிவிப்பை அமைக்க வேண்டுமா?",
    routes: "நகரத்திற்கு செல்லும் வழித்தடங்கள்: 42A (8 நிமிடம்), 15B (15 நிமிடம்), 23C (22 நிமிடம்). எதை கண்காணிக்க விரும்புகிறீர்கள்?",
    busStatus: "பேருந்து 42A மெயின் ஸ்ட்ரீட்டில் ட்ராஃபிக் காரணமாக 3 நிமிடங்கள் தாமதமாக ஓடுகிறது. புதுப்பிக்கப்பட்ட ETA 11 நிமிடங்கள்.",
    setAlarm: "நான் அலாரம் அமைக்க உதவுகிறேன்! எந்த பேருந்து மற்றும் நிறுத்தத்திற்கு அறிவிப்பு வேண்டும்?",
    problem: "சிக்கல் பற்றி கேட்டு வருந்துகிறேன். தயவுசெய்து சிக்கலை விவரித்து, எங்கள் ஆதரவு குழுவிடம் புகாரளிக்க உதவுகிறேன்.",
    startTrip: "பயணத்தைத் தொடங்க: 1) உங்கள் பேருந்து எண் சரியானதா என்பதை உறுதிசெய்யுங்கள், 2) பச்சை 'பயணத்தைத் தொடங்கு' பட்டனை அழுத்துங்கள், 3) GPS கண்காணிப்பு தானாகவே தொடங்கும்.",
    updateBus: "பேருந்து எண்ணைப் புதுப்பிக்க, உங்கள் தற்போதைய பேருந்து எண்ணின் அருகில் உள்ள 'திருத்து' பட்டனைத் தட்டி புதிய எண்ணை உள்ளிடுங்கள்.",
    gpsIssues: "GPS சிக்கல்கள் இருந்தால், முயற்சிக்கவும்: 1) உங்கள் இருப்பிட அனுமதிகளைச் சரிபார்க்கவும், 2) ஆப்ஸை மறுதொடக்கம் செய்யவும், 3) சிக்கல் தொடர்ந்தால் ஆதரவைத் தொடர்பு கொள்ளவும்.",
    endShift: "உங்கள் ஷிப்ட்டை முடிக்க, சிவப்பு 'பயணத்தை முடி' பட்டனை அழுத்துங்கள். இது GPS கண்காணிப்பை நிறுத்தி உங்கள் பயண நேரத்தை பதிவு செய்யும்.",
    support: "தொழில்நுட்ப ஆதரவிற்கு: 1) எங்கள் FAQ பிரிவைப் பார்க்கவும், 2) support@bustracker.com இல் ஆதரவைத் தொடர்பு கொள்ளவும், 3) எங்கள் 24/7 உதவி எண்ணை அழைக்கவும்.",
    default: "நீங்கள் பேருந்து சேவைகள் பற்றி கேட்கிறீர்கள் என்பதை நான் புரிந்துகொள்கிறேன். உங்களுக்கு என்ன உதவி தேவை என்பதை இன்னும் குறிப்பாக சொல்ல முடியுமா?"
  },
  te: {
    greeting: "నమస్కారం! నేను మీ BusTracker సహాయకుడను. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?",
    nextBus: "మీ రూట్‌లో తదుపరి బస్ 8 నిమిషాల్లో వస్తుంది. నేను నోటిఫికేషన్ సెట్ చేయాలా?",
    routes: "నగరానికి వెళ్ళే రూట్లు: 42A (8 నిమిషాలు), 15B (15 నిమిషాలు), 23C (22 నిమిషాలు). మీరు ఏది ట్రాక్ చేయాలనుకుంటున్నారు?",
    busStatus: "బస్ 42A మెయిన్ స్ట్రీట్‌లో ట్రాఫిక్ కారణంగా 3 నిమిషాలు ఆలస్యంగా నడుస్తుంది. అప్‌డేట్ చేసిన ETA 11 నిమిషాలు.",
    setAlarm: "నేను అలారం సెట్ చేయడంలో సహాయం చేస్తాను! మీరు ఏ బస్ మరియు స్టాప్ కోసం నోటిఫికేషన్ కావాలి?",
    problem: "సమస్య గురించి విని బాధపడ్డాను. దయచేసి సమస్యను వివరించండి మరియు మా సపోర్ట్ టీమ్‌కు రిపోర్ట్ చేయడంలో సహాయం చేస్తాను.",
    startTrip: "ట్రిప్ ప్రారంభించడానికి: 1) మీ బస్ నంబర్ సరైనదేనని నిర్ధారించుకోండి, 2) ఆకుపచ్చ 'ట్రిప్ ప్రారంభించు' బటన్ నొక్కండి, 3) GPS ట్రాకింగ్ స్వయంచాలకంగా ప్రారంభమవుతుంది.",
    updateBus: "బస్ నంబర్ అప్‌డేట్ చేయడానికి, మీ ప్రస్తుత బస్ నంబర్ పక్కన ఉన్న 'ఎడిట్' బటన్‌ను నొక్కి కొత్త నంబర్ ఎంటర్ చేయండి.",
    gpsIssues: "GPS సమస్యలు ఉంటే, ప్రయత్నించండి: 1) మీ లొకేషన్ అనుమతులను తనిఖీ చేయండి, 2) యాప్‌ను రీస్టార్ట్ చేయండి, 3) సమస్య కొనసాగితే సపోర్ట్‌ను సంప్రదించండి.",
    endShift: "మీ షిఫ్ట్ ముగించడానికి, ఎరుపు 'ట్రిప్ ముగించు' బటన్ నొక్కండి. ఇది GPS ట్రాకింగ్‌ను ఆపి మీ ట్రిప్ వ్యవధిని లాగ్ చేస్తుంది.",
    support: "సాంకేతిక మద్దతు కోసం: 1) మా FAQ విభాగాన్ని చూడండి, 2) support@bustracker.com వద్ద సపోర్ట్‌ను సంప్రదించండి, 3) మా 24/7 హెల్ప్‌లైన్‌కు కాల్ చేయండి.",
    default: "మీరు బస్ సేవల గురించి అడుగుతున్నారని నేను అర్థం చేసుకున్నాను. మీకు ఏ విషయంలో సహాయం కావాలో మరింత స్పష్టంగా చెప్పగలరా?"
  },
  mr: {
    greeting: "नमस्कार! मी तुमचा BusTracker सहाय्यक आहे. आज मी तुम्हाला कशी मदत करू शकतो?",
    nextBus: "तुमच्या मार्गावरील पुढची बस 8 मिनिटांत येत आहे. मी एक नोटिफिकेशन सेट करू का?",
    routes: "शहरात जाणारे मार्ग: 42A (8 मिनिटे), 15B (15 मिनिटे), 23C (22 मिनिटे). तुम्ही कोणता ट्रॅक करू इच्छिता?",
    busStatus: "बस 42A मेन स्ट्रीटवरील ट्रॅफिकमुळे 3 मिनिटे उशिरा चालली आहे. अपडेटेड ETA 11 मिनिटे आहे.",
    setAlarm: "मी अलार्म सेट करण्यात मदत करतो! तुम्हाला कोणत्या बस आणि स्टॉपसाठी नोटिफिकेशन हवे?",
    problem: "समस्येबद्दल ऐकून वाईट वाटले. कृपया समस्येचे वर्णन करा आणि मी आमच्या सपोर्ट टीमला रिपोर्ट करण्यात मदत करतो.",
    startTrip: "ट्रिप सुरू करण्यासाठी: 1) तुमचा बस नंबर बरोबर असल्याची खात्री करा, 2) हिरवे 'ट्रिप सुरू करा' बटण दाबा, 3) GPS ट्रॅकिंग आपोआप सुरू होईल.",
    updateBus: "बस नंबर अपडेट करण्यासाठी, तुमच्या सध्याच्या बस नंबरच्या बाजूला 'एडिट' बटणावर टॅप करा आणि नवीन नंबर एंटर करा.",
    gpsIssues: "GPS समस्या असल्यास, प्रयत्न करा: 1) तुमच्या लोकेशन परवानग्या तपासा, 2) अॅप रीस्टार्ट करा, 3) समस्या कायम राहिल्यास सपोर्टशी संपर्क साधा.",
    endShift: "तुमची शिफ्ट संपवण्यासाठी, लाल 'ट्रिप संपवा' बटण दाबा. हे GPS ट्रॅकिंग थांबवेल आणि तुमच्या ट्रिपचा कालावधी लॉग करेल.",
    support: "तांत्रिक मदतीसाठी: 1) आमचा FAQ विभाग पहा, 2) support@bustracker.com वर सपोर्टशी संपर्क साधा, 3) आमच्या 24/7 हेल्पलाइनला कॉल करा.",
    default: "तुम्ही बस सेवांबद्दल विचारत आहात हे मला समजते. तुम्हाला कोणत्या गोष्टीत मदत हवी आहे ते अधिक स्पष्टपणे सांगू शकाल का?"
  },
  gu: {
    greeting: "નમસ્તે! હું તમારો BusTracker સહાયક છું. આજે હું તમારી કેવી રીતે મદદ કરી શકું?",
    nextBus: "તમારા રૂટ પર આગળની બસ 8 મિનિટમાં આવી રહી છે. શું તમે ચાહો છો કે હું એક નોટિફિકેશન સેટ કરું?",
    routes: "શહેરમાં જવાના રૂટ્સ: 42A (8 મિનિટ), 15B (15 મિનિટ), 23C (22 મિનિટ). તમે કયા રૂટને ટ્રેક કરવા માંગો છો?",
    busStatus: "બસ 42A મેઈન સ્ટ્રીટ પર ટ્રાફિકને કારણે 3 મિનિટ મોડી ચાલી રહી છે. અપડેટેડ ETA 11 મિનિટ છે.",
    setAlarm: "હું અલાર્મ સેટ કરવામાં મદદ કરીશ! તમને કઈ બસ અને સ્ટોપ માટે નોટિફિકેશન જોઈએ છે?",
    problem: "સમસ્યા વિશે સાંભળીને દુઃખ થયું. કૃપા કરીને સમસ્યાનું વર્ણન કરો અને હું અમારી સપોર્ટ ટીમને રિપોર્ટ કરવામાં મદદ કરીશ.",
    startTrip: "ટ્રિપ શરૂ કરવા માટે: 1) ખાતરી કરો કે તમારો બસ નંબર સાચો છે, 2) લીલા 'ટ્રિપ શરૂ કરો' બટન દબાવો, 3) GPS ટ્રેકિંગ આપોઆપ શરૂ થશે.",
    updateBus: "બસ નંબર અપડેટ કરવા માટે, તમારા વર્તમાન બસ નંબરની બાજુના 'એડિટ' બટન પર ટેપ કરો અને નવો નંબર દાખલ કરો.",
    gpsIssues: "GPS સમસ્યાઓ હોય તો, પ્રયાસ કરો: 1) તમારી લોકેશન પરમિશન ચેક કરો, 2) અેપ રિસ્ટાર્ટ કરો, 3) સમસ્યા ચાલુ રહે તો સપોર્ટનો સંપર્ક કરો.",
    endShift: "તમારી શિફ્ટ સમાપ્ત કરવા માટે, લાલ 'ટ્રિપ સમાપ્ત કરો' બટન દબાવો. આ GPS ટ્રેકિંગ બંધ કરશે અને તમારા ટ્રિપનો સમય લોગ કરશે.",
    support: "ટેકનિકલ સપોર્ટ માટે: 1) અમારો FAQ સેક્શન જુઓ, 2) support@bustracker.com પર સપોર્ટનો સંપર્ક કરો, 3) અમારી 24/7 હેલ્પલાઈનને કોલ કરો.",
    default: "હું સમજી ગયો કે તમે બસ સેવાઓ વિશે પૂછી રહ્યા છો. તમને કઈ બાબતમાં મદદ જોઈએ છે તે વધુ સ્પષ્ટતાથી કહી શકશો?"
  },
  kn: {
    greeting: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ BusTracker ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    nextBus: "ನಿಮ್ಮ ಮಾರ್ಗದಲ್ಲಿ ಮುಂದಿನ ಬಸ್ 8 ನಿಮಿಷಗಳಲ್ಲಿ ಬರುತ್ತಿದೆ. ನಾನು ಒಂದು ಅಧಿಸೂಚನೆಯನ್ನು ಹೊಂದಿಸಬೇಕೇ?",
    routes: "ನಗರಕ್ಕೆ ಹೋಗುವ ಮಾರ್ಗಗಳು: 42A (8 ನಿಮಿಷ), 15B (15 ನಿಮಿಷ), 23C (22 ನಿಮಿಷ). ನೀವು ಯಾವುದನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಬಯಸುತ್ತೀರಿ?",
    busStatus: "ಬಸ್ 42A ಮೇನ್ ಸ್ಟ್ರೀಟ್‌ನಲ್ಲಿ ಟ್ರಾಫಿಕ್‌ನಿಂದಾಗಿ 3 ನಿಮಿಷ ತಡವಾಗಿ ಓಡುತ್ತಿದೆ. ಅಪ್‌ಡೇಟ್ ಮಾಡಿದ ETA 11 ನಿಮಿಷಗಳು.",
    setAlarm: "ನಾನು ಅಲಾರಂ ಹೊಂದಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ! ನಿಮಗೆ ಯಾವ ಬಸ್ ಮತ್ತು ನಿಲ್ದಾಣಕ್ಕೆ ಅಧಿಸೂಚನೆ ಬೇಕು?",
    problem: "ಸಮಸ್ಯೆಯ ಬಗ್ಗೆ ಕೇಳಿ ವಿಷಾದವಾಯಿತು. ದಯವಿಟ್ಟು ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ ಮತ್ತು ನಮ್ಮ ಬೆಂಬಲ ತಂಡಕ್ಕೆ ವರದಿ ಮಾಡಲು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.",
    startTrip: "ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸಲು: 1) ನಿಮ್ಮ ಬಸ್ ಸಂಖ್ಯೆ ಸರಿಯಾಗಿದೆ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ, 2) ಹಸಿರು 'ಪ್ರಯಾಣ ಪ್ರಾರಂಭಿಸಿ' ಬಟನ್ ಒತ್ತಿ, 3) GPS ಟ್ರ್ಯಾಕಿಂಗ್ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ.",
    updateBus: "ಬಸ್ ಸಂಖ್ಯೆಯನ್ನು ಅಪ್‌ಡೇಟ್ ಮಾಡಲು, ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಬಸ್ ಸಂಖ್ಯೆಯ ಪಕ್ಕದಲ್ಲಿರುವ 'ಎಡಿಟ್' ಬಟನ್ ಟ್ಯಾಪ್ ಮಾಡಿ ಮತ್ತು ಹೊಸ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
    gpsIssues: "GPS ಸಮಸ್ಯೆಗಳಿದ್ದರೆ, ಪ್ರಯತ್ನಿಸಿ: 1) ನಿಮ್ಮ ಸ್ಥಾನ ಅನುಮತಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ, 2) ಅಪ್ಲಿಕೇಶನ್ ಅನ್ನು ಮರುಪ್ರಾರಂಭಿಸಿ, 3) ಸಮಸ್ಯೆ ಮುಂದುವರಿದರೆ ಬೆಂಬಲವನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    endShift: "ನಿಮ್ಮ ಶಿಫ್ಟ್ ಮುಗಿಸಲು, ಕೆಂಪು 'ಪ್ರಯಾಣ ಮುಗಿಸಿ' ಬಟನ್ ಒತ್ತಿ. ಇದು GPS ಟ್ರ್ಯಾಕಿಂಗ್ ನಿಲ್ಲಿಸುತ್ತದೆ ಮತ್ತು ನಿಮ್ಮ ಪ್ರಯಾಣದ ಅವಧಿಯನ್ನು ಲಾಗ್ ಮಾಡುತ್ತದೆ.",
    support: "ತಾಂತ್ರಿಕ ಬೆಂಬಲಕ್ಕಾಗಿ: 1) ನಮ್ಮ FAQ ವಿಭಾಗವನ್ನು ನೋಡಿ, 2) support@bustracker.com ನಲ್ಲಿ ಬೆಂಬಲವನ್ನು ಸಂಪರ್ಕಿಸಿ, 3) ನಮ್ಮ 24/7 ಸಹಾಯವಾಣಿಗೆ ಕರೆ ಮಾಡಿ.",
    default: "ನೀವು ಬಸ್ ಸೇವೆಗಳ ಬಗ್ಗೆ ಕೇಳುತ್ತಿರುವಿರಿ ಎಂದು ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ. ನಿಮಗೆ ಯಾವ ವಿಷಯದಲ್ಲಿ ಸಹಾಯ ಬೇಕು ಎಂಬುದನ್ನು ಹೆಚ್ಚು ನಿರ್ದಿಷ್ಟವಾಗಿ ಹೇಳಬಹುದೇ?"
  }
};

export function ChatBot({ userRole }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: responses[currentLanguage as keyof typeof responses]?.greeting || responses.en.greeting,
        sender: 'bot',
        timestamp: new Date(),
        language: currentLanguage
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, currentLanguage]);

  const getResponse = (userMessage: string, language: string): string => {
    const langResponses = responses[language as keyof typeof responses] || responses.en;
    const message = userMessage.toLowerCase();

    if (message.includes('next bus') || message.includes('when') || message.includes('अगली बस') || message.includes('পরবর্তী বাস') || 
        message.includes('அடுத்த பேருந்து') || message.includes('తదుపరి బస్') || message.includes('पुढची बस') || 
        message.includes('આગળની બસ') || message.includes('ಮುಂದಿನ ಬಸ್')) {
      return langResponses.nextBus;
    } else if (message.includes('route') || message.includes('downtown') || message.includes('रूट') || message.includes('শহর') || 
               message.includes('வழித்தட') || message.includes('రూట్') || message.includes('मार्ग') || 
               message.includes('રૂટ') || message.includes('ಮಾರ್ಗ')) {
      return langResponses.routes;
    } else if (message.includes('42a') || message.includes('late') || message.includes('status') || message.includes('देरी') || 
               message.includes('দেরি') || message.includes('தாமதம்') || message.includes('ఆలస్యం') || 
               message.includes('उशीर') || message.includes('મોડું') || message.includes('ತಡವಾಗಿ')) {
      return langResponses.busStatus;
    } else if (message.includes('alarm') || message.includes('notification') || message.includes('अलार्म') || 
               message.includes('অ্যালার্ম') || message.includes('அலாரம்') || message.includes('అలారం') || 
               message.includes('अलार्म') || message.includes('અલાર્મ') || message.includes('ಅಲಾರಂ')) {
      return langResponses.setAlarm;
    } else if (message.includes('problem') || message.includes('issue') || message.includes('समस्या') || 
               message.includes('সমস্যা') || message.includes('சிக்கல்') || message.includes('సమస్య') || 
               message.includes('समस्या') || message.includes('સમસ્યા') || message.includes('ಸಮಸ್ಯೆ')) {
      return langResponses.problem;
    } else if (message.includes('start trip') || message.includes('यात्रा शुरू') || message.includes('ট্রিপ শুরু') || 
               message.includes('பயணம் தொடங்கு') || message.includes('ట्रिप शुरू') || message.includes('ट्रिप सुरू') || 
               message.includes('ટ્રિપ શરૂ') || message.includes('ಪ್ರಯಾಣ ಪ್ರಾರಂಭ')) {
      return langResponses.startTrip;
    } else if (message.includes('bus number') || message.includes('update') || message.includes('बस नंबर') || 
               message.includes('বাস নম্বর') || message.includes('பேருந்து எண்') || message.includes('బస్ నంబర్') || 
               message.includes('बस नंबर') || message.includes('બસ નંબર') || message.includes('ಬಸ್ ಸಂಖ್ಯೆ')) {
      return langResponses.updateBus;
    } else if (message.includes('gps') || message.includes('location') || message.includes('स्थान') || 
               message.includes('অবস্থান') || message.includes('இடம்') || message.includes('స్థానం') || 
               message.includes('स्थान') || message.includes('સ્થાન') || message.includes('ಸ್ಥಾನ')) {
      return langResponses.gpsIssues;
    } else if (message.includes('end') || message.includes('shift') || message.includes('शिफ्ट') || 
               message.includes('শিফট') || message.includes('ஷிப்ட்') || message.includes('షిఫ్ట్') || 
               message.includes('शिफ्ट') || message.includes('શિફ્ટ') || message.includes('ಶಿಫ್ಟ್')) {
      return langResponses.endShift;
    } else if (message.includes('support') || message.includes('help') || message.includes('सहायता') || 
               message.includes('সাহায্য') || message.includes('உதவி') || message.includes('సహాయం') || 
               message.includes('मदत') || message.includes('મદદ') || message.includes('ಸಹಾಯ')) {
      return langResponses.support;
    } else {
      return langResponses.default;
    }
  };

  const sendMessage = (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      language: currentLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getResponse(text, currentLanguage),
        sender: 'bot',
        timestamp: new Date(),
        language: currentLanguage
      };

      setMessages(prev => [...prev, botResponse]);

      // Text-to-speech for bot responses
      if (voiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(botResponse.text);
        utterance.lang = currentLanguage === 'en' ? 'en-IN' : 
                         currentLanguage === 'hi' ? 'hi-IN' : 
                         currentLanguage === 'bn' ? 'bn-IN' : 
                         currentLanguage === 'ta' ? 'ta-IN' : 
                         currentLanguage === 'te' ? 'te-IN' : 
                         currentLanguage === 'mr' ? 'mr-IN' : 
                         currentLanguage === 'gu' ? 'gu-IN' : 
                         currentLanguage === 'kn' ? 'kn-IN' : 'en-IN';
        utterance.rate = 0.9;
        utterance.volume = 0.7;
        speechSynthesis.speak(utterance);
      }
    }, 1000);
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = currentLanguage === 'en' ? 'en-IN' : 
                        currentLanguage === 'hi' ? 'hi-IN' : 
                        currentLanguage === 'bn' ? 'bn-IN' : 
                        currentLanguage === 'ta' ? 'ta-IN' : 
                        currentLanguage === 'te' ? 'te-IN' : 
                        currentLanguage === 'mr' ? 'mr-IN' : 
                        currentLanguage === 'gu' ? 'gu-IN' : 
                        currentLanguage === 'kn' ? 'kn-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  const currentTranslations = translations[currentLanguage as keyof typeof translations] || translations.en;

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg z-50"
        size="sm"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 max-w-[calc(100vw-2rem)] h-[32rem] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-3 rounded-t-2xl flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <Bot className="w-4 h-4" />
          <h3 className="font-medium text-sm truncate">{currentTranslations.chatTitle}</h3>
        </div>
        <div className="flex items-center space-x-1">
          {/* Language Selector */}
          <select
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value)}
            className="bg-white/20 text-white rounded px-1 py-0.5 text-xs border-0 outline-none max-w-20"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code} className="text-black">
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          
          {/* Voice Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="text-white hover:bg-white/20 h-7 w-7 p-0"
          >
            {voiceEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
          </Button>
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 h-7 w-7 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-3 space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-2.5 rounded-xl break-words ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <div className="flex items-start space-x-2">
                  {message.sender === 'bot' && <Bot className="w-3 h-3 mt-0.5 text-emerald-600 shrink-0" />}
                  {message.sender === 'user' && <User className="w-3 h-3 mt-0.5 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Replies */}
      <div className="px-3 pb-2 shrink-0">
        <div className="flex flex-wrap gap-1">
          {currentTranslations.quickReplies[userRole].slice(0, 2).map((reply, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => sendMessage(reply)}
              className="text-xs h-6 px-2 rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 truncate max-w-32"
            >
              {reply}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-200 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={currentTranslations.typePlaceholder}
              className="pr-10 h-9 text-sm"
              disabled={isListening}
            />
            {isListening && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
          
          {/* Voice Input Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={startVoiceRecognition}
            className="h-9 w-9 p-0 text-emerald-600 hover:bg-emerald-50"
            disabled={isListening}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          
          {/* Send Button */}
          <Button
            onClick={() => sendMessage()}
            className="h-9 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
            size="sm"
            disabled={!inputMessage.trim() || isListening}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {isListening && (
          <p className="text-xs text-center mt-2 text-muted-foreground">
            {currentTranslations.listening}
          </p>
        )}
      </div>
    </div>
  );
}