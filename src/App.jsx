import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Sparkles, Languages, Heart, Menu, X } from "lucide-react";
import "./App.css";
import html2canvas from "html2canvas";

const greetings = {
  English: { label: "English", headline: "Happy Diwali", sub: "May your life shine as bright as the diyas.", wish: "Wishing you and your family a Diwali filled with light, laughter, prosperity and endless happiness.", button: "Send warm wishes" },
  Hindi: { label: "हिन्दी", headline: "शुभ दीपावली", sub: "आपका जीवन दीपों की तरह प्रकाशमय हो।", wish: "आपको और आपके परिवार को दीपावली की हार्दिक शुभकामनाएँ। यह त्योहार आपके जीवन में सुख, शांति, समृद्धि और खुशियाँ लाए।", button: "शुभकामनाएँ भेजें" },
  Marathi: { label: "मराठी", headline: "शुभ दीपावली", sub: "तुमचे जीवन आनंदाने आणि प्रकाशाने उजळून निघो.", wish: "तुम्हाला आणि तुमच्या परिवाराला दीपावलीच्या हार्दिक शुभेच्छा! हा सण तुमच्या आयुष्यात सुख, समृद्धी आणि आनंद घेऊन येवो.", button: "शुभेच्छा पाठवा" },
  Gujarati: { label: "ગુજરાતી", headline: "દિવાળીની શુભકામનાઓ", sub: "તમારું જીવન પ્રકાશ અને આનંદથી ઝળહળતું રહે.", wish: "તમને અને તમારા પરિવારને દિવાળીની હાર્દિક શુભકામનાઓ. આ તહેવાર તમારા જીવનમાં સુખ, શાંતિ અને સમૃદ્ધિ લાવે.", button: "શુભેચ્છાઓ મોકલો" },
  Bengali: { label: "বাংলা", headline: "শুভ দীপাবলি", sub: "আপনার জীবন আলো ও আনন্দে ভরে উঠুক।", wish: "আপনাকে ও আপনার পরিবারকে জানাই দীপাবলির আন্তরিক শুভেচ্ছা। সুখ, শান্তি ও সমৃদ্ধিতে ভরে উঠুক আপনার জীবন।", button: "শুভেচ্ছা পাঠান" },
  Tamil: { label: "தமிழ்", headline: "இனிய தீபாவளி", sub: "உங்கள் வாழ்வு ஒளியும் மகிழ்ச்சியும் நிறைந்ததாக இருக்கட்டும்.", wish: "உங்களுக்கும் உங்கள் குடும்பத்தினருக்கும் இனிய தீபாவளி நல்வாழ்த்துகள். இந்தத் திருநாள் மகிழ்ச்சி, அமைதி, செழிப்பு ஆகியவற்றைக் கொண்டு வரட்டும்.", button: "வாழ்த்துகளை அனுப்புங்கள்" },
  Telugu: { label: "తెలుగు", headline: "దీపావళి శుభాకాంక్షలు", sub: "మీ జీవితం వెలుగులతో, ఆనందంతో నిండాలి.", wish: "మీకు మరియు మీ కుటుంబ సభ్యులకు దీపావళి శుభాకాంక్షలు. ఈ పండుగ మీ జీవితంలో సంతోషం, శాంతి, ఐశ్వర్యం నింపాలి.", button: "శుభాకాంక్షలు పంపండి" },
  Kannada: { label: "ಕನ್ನಡ", headline: "ದೀಪಾವಳಿ ಹಬ್ಬದ ಶುಭಾಶಯಗಳು", sub: "ನಿಮ್ಮ ಬದುಕು ಬೆಳಕು ಮತ್ತು ಸಂತೋಷದಿಂದ ತುಂಬಿರಲಿ.", wish: "ನಿಮಗೆ ಮತ್ತು ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕೆ ದೀಪಾವಳಿಯ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು. ಈ ಹಬ್ಬ ನಿಮ್ಮ ಜೀವನದಲ್ಲಿ ಸಂತೋಷ, ಶಾಂತಿ ಮತ್ತು ಸಮೃದ್ಧಿ ತರಲಿ.", button: "ಶುಭಾಶಯ ಕಳುಹಿಸಿ" },
  Malayalam: { label: "മലയാളം", headline: "ദീപാവലി ആശംസകൾ", sub: "നിങ്ങളുടെ ജീവിതം വെളിച്ചവും സന്തോഷവും നിറഞ്ഞതാകട്ടെ.", wish: "നിങ്ങൾക്കും കുടുംബത്തിനും ഹൃദയം നിറഞ്ഞ ദീപാവലി ആശംസകൾ. ഈ ആഘോഷം സന്തോഷവും സമാധാനവും സമൃദ്ധിയും കൊണ്ടുവരട്ടെ.", button: "ആശംസകൾ അയയ്ക്കുക" },
  Punjabi: { label: "ਪੰਜਾਬੀ", headline: "ਦੀਵਾਲੀ ਦੀਆਂ ਮੁਬਾਰਕਾਂ", sub: "ਤੁਹਾਡਾ ਜੀਵਨ ਰੌਸ਼ਨੀ ਅਤੇ ਖੁਸ਼ੀਆਂ ਨਾਲ ਭਰਿਆ ਰਹੇ।", wish: "ਤੁਹਾਨੂੰ ਅਤੇ ਤੁਹਾਡੇ ਪਰਿਵਾਰ ਨੂੰ ਦੀਵਾਲੀ ਦੀਆਂ ਲੱਖ-ਲੱਖ ਵਧਾਈਆਂ। ਇਹ ਤਿਉਹਾਰ ਤੁਹਾਡੇ ਜੀਵਨ ਵਿੱਚ ਖੁਸ਼ਹਾਲੀ ਅਤੇ ਸ਼ਾਂਤੀ ਲਿਆਵੇ।", button: "ਸ਼ੁਭਕਾਮਨਾਵਾਂ ਭੇਜੋ" }
};

const randomGreetings = {
  English: [
    "May this Diwali bring new hopes, endless happiness and success into your life.",
    "May every diya light up your dreams and every moment bring you joy. Happy Diwali!",
    "Wishing you a festival filled with beautiful memories, prosperity and love.",
    "May the lights of Diwali guide you towards success and brighter beginnings."
  ],

  Hindi: [
    "यह दीपावली आपके जीवन में नई खुशियाँ, सफलता और समृद्धि लेकर आए।",
    "हर दीप आपके जीवन को रोशन करे और हर दिन खुशियों से भर जाए। शुभ दीपावली!",
    "आपके घर में सुख, शांति और प्रेम का सदैव वास हो। दीपावली की हार्दिक शुभकामनाएँ।"
  ],

  Marathi: [
    "ही दिवाळी तुमच्या आयुष्यात आनंद, यश आणि समृद्धी घेऊन येवो.",
    "प्रत्येक दिवा तुमच्या स्वप्नांना नवी दिशा देवो. दिवाळीच्या हार्दिक शुभेच्छा!",
    "तुमचे आयुष्य सुख, समाधान आणि प्रेमाने उजळून निघो."
  ],

  Gujarati: [
    "આ દિવાળી તમારા જીવનમાં સુખ, શાંતિ અને સમૃદ્ધિ લાવે.",
    "દરેક દીવો તમારા જીવનમાં નવી આશા અને ખુશીઓ લાવે. દિવાળીની શુભકામનાઓ!",
    "તમારું જીવન પ્રેમ, આનંદ અને સફળતાથી ઝળહળતું રહે."
  ]
};

function Fireworks() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height, raf;
    const particles = [];
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth; height = canvas.clientHeight;
      canvas.width = width * dpr; canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
  
const burst = (clickX, clickY) => {
  const x = Number.isFinite(clickX)
    ? clickX
    : width * (0.12 + Math.random() * 0.76);

  const y = Number.isFinite(clickY)
    ? clickY
    : height * (0.12 + Math.random() * 0.48);

  const hue = [35, 43, 5, 330, 270][
    Math.floor(Math.random() * 5)
  ];

  for (let i = 0; i < 65; i++) {
    const a = Math.PI * 2 * i / 65;
    const speed = 0.8 + Math.random() * 3.5;

    particles.push({
      x,
      y,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed,
      life: 65 + Math.random() * 30,
      max: 95,
      hue,
      size: 1 + Math.random() * 2
    });
  }
};
const handleClick = (event) => {
  const rect = canvas.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  burst(x, y);
};
    let tick = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      if (tick % 72 === 0) burst();
      tick++;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]; p.x += p.vx; p.y += p.vy; p.vy += 0.018; p.vx *= 0.99; p.life--;
        ctx.beginPath(); ctx.fillStyle = `hsla(${p.hue}, 100%, 68%, ${Math.max(0, p.life / p.max)})`;
        ctx.shadowBlur = 12; ctx.shadowColor = `hsl(${p.hue}, 100%, 60%)`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        if (p.life <= 0) particles.splice(i, 1);
      }
      raf = requestAnimationFrame(draw);
    };
  resize();

window.addEventListener("resize", resize);
window.addEventListener("click", handleClick);

draw();
   return () => {
  cancelAnimationFrame(raf);
  window.removeEventListener("resize", resize);
  window.removeEventListener("click", handleClick);
};
  }, []);
  return <canvas className="fireworks" ref={canvasRef} aria-hidden="true" />;
}

function Diya({ className = "" }) {
  return <div className={`diya-wrap ${className}`} aria-hidden="true">
    <div className="flame"><span /></div>
    <div className="wick" />
    <div className="diya-bowl"><div className="diya-rim" /></div>
    <div className="diya-glow" />
  </div>;
}

export default function App() {
  const [language, setLanguage] = useState("English");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [greetingMessage, setGreetingMessage] = useState("");
  const [showPersonal, setShowPersonal] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cardTheme, setCardTheme] = useState("royal");
  const [surpriseOpened, setSurpriseOpened] = useState(false);
  const [experienceStep, setExperienceStep] = useState("gift");
  const [countdown, setCountdown] = useState({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

useEffect(() => {
  const targetDate = new Date("2027-10-29T00:00:00+05:30").getTime();

  const updateCountdown = () => {
    const difference = targetDate - Date.now();

    if (difference <= 0) {
      setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    setCountdown({
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    });
  };

  updateCountdown();

  const timer = setInterval(updateCountdown, 1000);

  return () => clearInterval(timer);
}, []);
const cardRef = useRef(null);
  const t = greetings[language];
 const personalWish = useMemo(() => {
  const message = greetingMessage.trim() || t.wish;

  return `${recipient ? `${recipient}, ` : ""}${message}${sender ? ` — ${sender}` : ""}`;
}, [recipient, sender, greetingMessage, t]);

  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audio = new AudioCtx();
      [659.25, 783.99, 987.77].forEach((freq, i) => {
        const osc = audio.createOscillator(); const gain = audio.createGain();
        osc.type = "sine"; osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, audio.currentTime + i * 0.16);
        gain.gain.exponentialRampToValueAtTime(0.08, audio.currentTime + i * 0.16 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + i * 0.16 + 0.55);
        osc.connect(gain); gain.connect(audio.destination); osc.start(audio.currentTime + i * 0.16); osc.stop(audio.currentTime + i * 0.16 + 0.6);
      });
      setTimeout(() => audio.close(), 1800);
    } catch { /* Audio may be unavailable or blocked by browser settings. */ }
  };

  const copyWish = async () => {
    try {
      await navigator.clipboard.writeText(personalWish);
      setCopied(true); setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy your Diwali wish:", personalWish);
    }
  };
 

  const revealWish = () => {
    setShowPersonal(true);
    if (soundOn) playChime();
    document.getElementById("personal-wish")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
const downloadGreetingCard = async () => {
  if (!cardRef.current) return;

  try {
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
    });

    const link = document.createElement("a");

    link.download = "deepotsav-greeting.png";
    link.href = canvas.toDataURL("image/png");

    link.click();
  } catch (error) {
    console.error("Greeting card download failed:", error);
    alert("Unable to download the card. Please try again.");
  }
};

const generateRandomGreeting = () => {
  const options = randomGreetings[language] || [t.wish];

  const availableOptions = options.filter(
    (message) => message !== greetingMessage.trim()
  );

  const choices = availableOptions.length
    ? availableOptions
    : options;

  const randomIndex = Math.floor(Math.random() * choices.length);

  setGreetingMessage(choices[randomIndex]);
};

const continueToGreeting = (event) => {
  event.preventDefault();

  if (!recipient.trim() || !sender.trim()) {
    return;
  }

  setExperienceStep("greeting");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

 
    if (experienceStep !== "website") {
    return (
    <main className="intro-experience">
      <header className="navbar intro-navbar">
  <a className="brand" href="#home">
    <span className="brand-mark">✦</span> DEEP<span>OTSAV</span>
  </a>

  <div className="nav-actions">
    <label className="language-select">
      <Languages size={16} />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        aria-label="Choose language"
      >
        {Object.keys(greetings).map((lang) => (
          <option key={lang} value={lang}>
            {greetings[lang].label}
          </option>
        ))}
      </select>
    </label>
  </div>
</header>
      <div className="intro-glow intro-glow-one" />
      <div className="intro-glow intro-glow-two" />

      <div className="intro-content">

        {experienceStep === "gift" && (
          <motion.div
            className="intro-gift-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="section-kicker">
              ✦ A FESTIVAL OF LOVE & LIGHT ✦
            </span>

            <h1>
              A special gift <em>awaits you.</em>
            </h1>

            <p>
              We have prepared something special for you.
              Open your Diwali gift to discover it.
            </p>

            <motion.button
              className="gift-box"
              onClick={() => setExperienceStep("personalize")}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              aria-label="Open your Diwali gift"
            >
              <span className="gift-lid">
                <span className="gift-bow">🎀</span>
              </span>

              <span className="gift-body">
                <span className="gift-ribbon" />
                <span className="gift-emoji">🎁</span>
              </span>
            </motion.button>

            <span className="intro-instruction">
              CLICK TO OPEN YOUR GIFT
            </span>
          </motion.div>
        )}

        {experienceStep === "personalize" && (
          <motion.div
            className="intro-personalize-screen"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-kicker">
              ✦ YOUR LITTLE DIWALI SURPRISE ✦
            </span>

            <div className="intro-diya">🪔</div>

            <h1>
              Happy Diwali! <em>With love.</em>
            </h1>

            <p className="intro-message">
              May your home shine with happiness, your heart
              overflow with joy, and your life be filled with
              peace and prosperity.
            </p>

            <div className="intro-form-card">
              <h2>A wish made just for you.</h2>

              <p>
                Tell us who this greeting is for and who is
                sending it.
              </p>

             <form onSubmit={continueToGreeting}>
                <label>
                  RECIPIENT NAME
                  <input
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Who are you wishing?"
                    maxLength={50}
                    required
                  />
                </label>

                <label>
                  YOUR NAME
                  <input
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    placeholder="Enter your name"
                    maxLength={40}
                    required
                  />
                </label>

                <label>
  EDIT YOUR DIWALI GREETING

  <textarea
    value={greetingMessage}
    onChange={(e) => setGreetingMessage(e.target.value)}
    placeholder={t.wish}
    rows={4}
    maxLength={500}
  />
  <button
  type="button"
  className="random-greeting-button"
  onClick={generateRandomGreeting}
>
  🎲 Generate Random Greeting
</button>
</label>

<div className="greeting-live-preview">
  <span>MESSAGE THAT WILL BE SENT</span>
  <p>{personalWish}</p>
</div>

                <button type="submit" className="primary-button">
                  Create My Diwali Wishes <span>↗</span>
                </button>
              </form>
            </div>
          </motion.div>
        )}


        {experienceStep === "greeting" && (
          <motion.div
            className="generated-greeting-screen"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-kicker">
              ✦ YOUR PERSONALIZED DIWALI WISH ✦
            </span>

            <h1>
              A greeting made <em>just for you.</em>
            </h1>

            <div
              className={`greeting-card-preview theme-${cardTheme}`}
              ref={cardRef}
              id="generated-greeting-card"
            >
              <div className="card-ornament">✦ ✧ ✦</div>
              <span className="card-subtitle">THE FESTIVAL OF LIGHTS</span>
              <h2>{t.headline}</h2>
              <div className="card-diya">🪔</div>
              <div className="card-divider">✧</div>
              <p className="card-message">{personalWish}</p>
              <div className="card-footer">WITH LIGHT & LOVE</div>
              <div className="card-ornament bottom-ornament">✦ ✧ ✦</div>
            </div>

            <div className="generated-greeting-actions">
              <button
                className="primary-button"
                onClick={downloadGreetingCard}
              >
                Download Greeting ↓
              </button>

              <button
                className="outline-button"
                onClick={() => {
                  const message = encodeURIComponent(personalWish);
                  window.open(
                    `https://wa.me/?text=${message}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
              >
                Share on WhatsApp
              </button>

              <button className="outline-button" onClick={copyWish}>
                {copied ? "Copied!" : "Copy Message"}
              </button>
            </div>

            <button
              className="primary-button greeting-home-button"
              onClick={() => {
                setExperienceStep("website");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              ← Return to Home
            </button>
          </motion.div>
        )}

      </div>
    </main>
    
  );
}
return (
  <main>
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <Fireworks />
    <header className="navbar">
      <a className="brand" href="#home"><span className="brand-mark">✦</span> DEEP<span>OTSAV</span></a>
      <nav className={mobileMenu ? "nav-links open" : "nav-links"}>
        <a href="#celebrate" onClick={() => setMobileMenu(false)}>Celebrate</a>
        <a href="#wishes" onClick={() => setMobileMenu(false)}>Wishes</a>
        <a href="#personalize" onClick={() => setMobileMenu(false)}>Personalize</a>
      </nav>
      <div className="nav-actions">
        <label className="language-select"><Languages size={16} /><select value={language} onChange={e => setLanguage(e.target.value)} aria-label="Choose language">
          {Object.keys(greetings).map(lang => <option key={lang} value={lang}>{greetings[lang].label}</option>)}
        </select></label>
        <button className="sound-button" onClick={() => { setSoundOn(v => !v); if (!soundOn) playChime(); }} aria-label="Toggle sound">{soundOn ? <Volume2 size={18}/> : <VolumeX size={18}/>}</button>
        <button className="menu-button" onClick={() => setMobileMenu(v => !v)} aria-label="Toggle menu">{mobileMenu ? <X/> : <Menu/>}</button>
      </div>
    </header>

    <section className="hero" id="home">
      <div className="hero-copy">
        <motion.div className="eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
          <Sparkles size={14}/> THE FESTIVAL OF LIGHTS <Sparkles size={14}/>
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div key={language} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: .35 }}>
            <h1>{t.headline.split(" ").map((word, i) => <span key={i} className={i === 1 || t.headline.split(" ").length === 1 ? "gold-text" : ""}>{word} </span>)}</h1>
            <p className="hero-subtitle">{t.sub}</p>
          </motion.div>
        </AnimatePresence>
        <p className="hero-description">A little light can brighten a thousand hearts. Celebrate the joy, hope and togetherness of this beautiful festival.</p>
        <div className="hero-buttons">
          <button className="primary-button" onClick={revealWish}>{t.button} <span>↗</span></button>
          <a className="text-button" href="#wishes">Explore wishes <span>↓</span></a>
        </div>
        <div className="hero-note"><span className="note-line"/> MADE WITH LIGHT & LOVE <Heart size={12} fill="currentColor"/></div>
      </div>
      <div className="hero-art">
        <div className="mandala mandala-one" /><div className="mandala mandala-two" />
        <div className="halo halo-large" /><div className="halo halo-small" />
        <motion.div className="central-diya" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          <div className="big-flame"><span/></div><div className="big-wick"/>
          <div className="big-bowl"><div/></div>
          <div className="big-glow"/>
        </motion.div>
        <Diya className="small-diya diya-left"/><Diya className="small-diya diya-right"/>
        <div className="spark spark-a">✦</div><div className="spark spark-b">✧</div><div className="spark spark-c">✦</div>
        <div className="art-caption">LIGHT • JOY • PROSPERITY</div>
      </div>
      <div className="scroll-cue"><span/> SCROLL TO CELEBRATE</div>
    </section>

    <section className="wish-strip" id="celebrate">
      <div className="strip-item"><span>✧</span> LIGHT OVER DARKNESS</div><div className="strip-divider"/>
      <div className="strip-item"><span>✧</span> HOPE OVER FEAR</div><div className="strip-divider"/>
      <div className="strip-item"><span>✧</span> LOVE OVER EVERYTHING</div>
    </section>

   
<section className="rangoli-section" id="rangoli">
  <img
    src="/rangoli-diwali.png"
    alt="Traditional colourful Diwali rangoli decorated with marigold flowers and glowing diyas"
    className="rangoli-realistic-image"
  />
</section>


    <section className="personal-section" id="personalize">
      <div className="personal-decoration">✺</div>
      <div className="personal-inner">
        <div className="section-heading centered"><span className="section-kicker">MAKE IT PERSONAL</span><h2>A wish made <em>just for them.</em></h2><p>Add a name and your own signature. We'll prepare a message you can copy or share instantly.</p></div>
        <div className="personal-card">
          <div className="form-grid">
            <label>THEIR NAME <input value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="e.g. Dear Friends" maxLength={50}/></label>
            <label>YOUR NAME <input value={sender} onChange={e => setSender(e.target.value)} placeholder="Your name" maxLength={40}/></label>
          </div>
          
<div className="card-theme-selector">
  <span>CHOOSE YOUR CARD DESIGN</span>

  <div className="theme-options">
    <button
      className={cardTheme === "royal" ? "active" : ""}
      onClick={() => setCardTheme("royal")}
    >
      Royal Gold
    </button>

    <button
      className={cardTheme === "sunset" ? "active" : ""}
      onClick={() => setCardTheme("sunset")}
    >
      Festive Sunset
    </button>

    <button
      className={cardTheme === "midnight" ? "active" : ""}
      onClick={() => setCardTheme("midnight")}
    >
      Midnight Gold
    </button>
  </div>
</div>

          <div className="preview-label"><span/> YOUR GREETING PREVIEW</div>
          
<div
  className={`greeting-card-preview theme-${cardTheme}`}
  ref={cardRef}
  id="personal-wish"
>
  <div className="card-ornament">✦ ✧ ✦</div>

  <span className="card-subtitle">
    THE FESTIVAL OF LIGHTS
  </span>

  <h2>
    {t.headline}
  </h2>

  <div className="card-diya">🪔</div>

  <div className="card-divider">✧</div>

  <p className="card-message">
    {personalWish}
  </p>

  <div className="card-footer">
    WITH LIGHT & LOVE
  </div>

  <div className="card-ornament bottom-ornament">
    ✦ ✧ ✦
  </div>
</div>

         
<div className="personal-actions">
  <button
    className="primary-button"
    onClick={downloadGreetingCard}
  >
    Download Greeting Card ↓
  </button>

  <button
    className="outline-button"
    onClick={copyWish}
  >
    {copied ? "Copied!" : "Copy Message"}
  </button>

  <button
    className="outline-button"
    onClick={() => {
      const message = encodeURIComponent(personalWish);
      window.open(
        `https://wa.me/?text=${message}`,
        "_blank",
        "noopener,noreferrer"
      );
    }}
  >
    Share on WhatsApp
  </button>
</div>

          {showPersonal && <motion.p className="success-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Your greeting is ready. Copy it or share it with someone special.</motion.p>}
        </div>
      </div>
    </section>

<section className="countdown-section" id="countdown">
  <div className="countdown-container">

    <span className="section-kicker">
      THE MAGIC IS COMING
    </span>

    <h2>
      Countdown to <em>Diwali 2027</em>
    </h2>

    <p className="countdown-description">
      The festival of lights is on its way.
      Get ready to celebrate happiness, hope and togetherness.
    </p>

    <div className="countdown-timer">

      <div className="countdown-box">
        <strong>{String(countdown.days).padStart(3, "0")}</strong>
        <span>DAYS</span>
      </div>

      <div className="countdown-separator">:</div>

      <div className="countdown-box">
        <strong>{String(countdown.hours).padStart(2, "0")}</strong>
        <span>HOURS</span>
      </div>

      <div className="countdown-separator">:</div>

      <div className="countdown-box">
        <strong>{String(countdown.minutes).padStart(2, "0")}</strong>
        <span>MINUTES</span>
      </div>

      <div className="countdown-separator">:</div>

      <div className="countdown-box">
        <strong>{String(countdown.seconds).padStart(2, "0")}</strong>
        <span>SECONDS</span>
      </div>

    </div>

    <div className="countdown-footer">
      <span>🪔</span>
      FRIDAY, 29 OCTOBER 2027
      <span>🪔</span>
    </div>

  </div>
</section>
    <footer className="footer">
      <a className="brand" href="#home"><span className="brand-mark">✦</span> DEEP<span>OTSAV</span></a>
      <p>May your days be bright and your heart be lighter.</p>
      <span className="footer-copy">CRAFTED WITH <Heart size={12} fill="currentColor"/> FOR THE FESTIVAL OF LIGHTS</span>
    </footer>
   </main>
);
}