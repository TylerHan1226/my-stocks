from app.models import db, Instrument, environment, SCHEMA
from sqlalchemy.sql import text
import json


def seed_instruments():
    e_guitar_1 = Instrument(
        seller_id = 2,
        make = "Fender",
        model = "Fender American Vintage II 1951 Telecaster",
        color = "Butterscotch Blonde",
        category = "Electric Guitar",
        price = 2449.99,
        details = "The Fender American Vintage II 1951 Telecaster is a premium electric guitar, meticulously crafted to capture the essence of the original 1951 Telecaster. With its vintage style and iconic sound, it's a true tribute to Fender's historic legacy.",
        body = "Maple",
        fretboard = "Maple",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1712351131/Riff-Harbor/eg-1_ahmvqc.png",
        discount = 1
    )
    e_guitar_2 = Instrument(
        seller_id = 2,
        model = "Fender American Ultra Stratocaster HSS",
        make = "Fender",
        color = "Arctic Pearl",
        category = "Electric Guitar",
        price = 2249.99,
        details = "Iconic for 60+ years, the Fender American Ultra Strat HSS offers precision, performance, and tone. Modern design, Ultra Noiseless pickups, and versatile sound.",
        body = "Alder",
        fretboard = "Maple",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1711508631/Riff-Harbor/eg-2_wikka6.jpg",
        discount = 0.9
    )
    e_guitar_3 = Instrument(
        seller_id = 2,
        make = "Gibson",
        model = "Gibson SG Standard",
        color = "Vintage Cherry",
        category = "Electric Guitar",
        price = 1999.99,
        details = "The Gibson SG Standard 61: Iconic devil horns, double-cut design, Burstbucker 61 pickups, SlimTaper neck, rosewood fretboard, solid mahogany body—a timeless classic of innovation and versatility.",
        body = "Mahogany",
        fretboard = "Rosewood",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1711508633/Riff-Harbor/eg-3_qx38jb.jpg",
        discount = 1
    )
    e_guitar_4 = Instrument(
        seller_id = 2,
        make = "Gibson",
        model = "Gibson Les Paul Traditional Pro V Flame Top",
        color = "Transparent Ebony Burst",
        category = "Electric Guitar",
        price = 3199.99,
        details = "The Gibson Les Paul Traditional Pro V Flame Top elevates a classic design with advanced electronics. Featuring a mahogany body, maple top, and TradBucker pickups, it delivers versatile tones with push/pull controls for coil splitting. A comfortable asymmetrical neck and Grover tuners ensure a premium playing experience. Gibson proudly presents this innovative Les Paul.",
        body = "Mahogany",
        fretboard = "Rosewood",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1711508636/Riff-Harbor/eg-4_xlvihd.jpg",
        discount = 1
    )
    e_guitar_5 = Instrument(
        seller_id = 2,
        make = "Gibson",
        model = "Gibson Les Paul Standard '50s P-90",
        color = "Gold Top",
        category = "Electric Guitar",
        price = 2799.99,
        details = "The Gibson Les Paul Standard '50s P-90 reimagines a classic with vintage aesthetics and modern features. Mahogany body, maple top, and P-90 pickups offer rich tones, while hand-wired electronics ensure premium sound. With its nostalgic design and high-quality craftsmanship, this guitar pays homage to Gibson's legendary legacy.",
        body = "Mahogany",
        fretboard = "Rosewood",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1711509117/Riff-Harbor/eg-5_rpezwk.jpg",
        discount = 1
    )
    e_guitar_6 = Instrument(
        seller_id = 2,
        make = "ESP",
        model = "LTD EX-7 Baritone Black Metal 7-String",
        color = "Black Satin",
        category = "Electric Guitar",
        price = 1099.00,
        details = "The ESP LTD EX-7 Baritone Black Metal guitar boasts a menacing all-black design with premium features like Macassar ebony fingerboards, glow-in-the-dark markers, and a single EMG 81-7H pickup. Its 27” scale baritone version delivers the intense feel of ESP's Black Metal Series in a 7-string format, featuring a mahogany body, set-thru maple neck, and TonePros locking bridge.",
        body = "Mahogany",
        fretboard = "Ebony",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1711509293/Riff-Harbor/eg-6_w5dqan.jpg",
        discount = 1
    )
    e_guitar_7 = Instrument(
        seller_id = 2,
        make = "ESP",
        model = "ESP E-II Horizon-III FR",
        color = "Black Sunburst",
        category = "Electric Guitar",
        price = 2699.00,
        details = "The ESP E-II Horizon-III offers uncompromising tone and reliability. Its neck-through construction, mahogany body with flamed maple top, and Floyd Rose Original bridge ensure stability and control. With Seymour Duncan pickups, Gotoh locking tuners, and coil-splitting controls, it's a versatile powerhouse. Comes with an ESP hardshell case for protection on the go.",
        body = "Mahogany",
        fretboard = "Ebony",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1711509668/Riff-Harbor/eg-7_ygb6ah.jpg",
        discount = 1
    )
    e_guitar_8 = Instrument(
        seller_id = 2,
        make = "ESP",
        model = "LTD EX-7 Baritone Black Metal 7-String",
        color = "Black Satin",
        category = "Electric Guitar",
        price = 1699.00,
        details = "The ESP LTD Arrow-1000 electric guitar features a quilted maple top with a satin finish. Its neck-thru-body construction, mahogany body, and 3-piece maple neck offer stability and resonance. The Macassar ebony fingerboard sports pearloid inlays, while the Fishman Fluence Modern humbuckers provide a wide range of tones. With push-pull controls for voicing selection, a Floyd Rose 1000SE bridge, and Grover tuners, it's a versatile and reliable instrument.",
        body = "Mahogany",
        fretboard = "Ebony",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1711509874/Riff-Harbor/eg-8_strtro.jpg",
        discount = 0.8
    )
    e_guitar_9 = Instrument(
        seller_id = 2,
        make = "ESP",
        model = "ESP E-II Eclipse",
        color = "Vintage Black",
        category = "Electric Guitar",
        price = 2399.00,
        details = "The ESP E-II Eclipse DB is a powerhouse for rock and metal enthusiasts. Featuring a set-neck design and 22 extra jumbo frets on a rosewood fingerboard, it offers swift playability. With active EMG 60 and 81 pickups, it delivers a spectrum of tones from warm to aggressive.",
        body = "Mahogany",
        fretboard = "Ebony",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1711510116/Riff-Harbor/eg-9_ptbrvp.jpg",
        discount = 1
    )
    e_guitar_10 = Instrument(
        seller_id = 2,
        make = "ESP",
        model = "ESP USA Horizon II",
        color = "See-Thru Purple Fade",
        category = "Electric Guitar",
        price = 4299.00,
        details = "The ESP USA Horizon-II, made in Southern California, is a dream for shredders. Its set-thru neck construction ensures stability and sustain, complemented by an extra thin U-shaped maple neck and mahogany body. With premium components like Jescar stainless steel frets, Sperzel Trim-Lok, Schaller straplocks, and high-end pickups, it's a top-tier instrument. Comes with an ESP USA hardshell case.",
        body = "Mahogany",
        fretboard = "Ebony",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1711510276/Riff-Harbor/eg-10_fxnrlu.jpg",
        discount = 1
    )
    e_guitar_11 = Instrument(
        seller_id = 2,
        make = "PRS",
        model = "PRS SE Hollowbody II",
        color = "Charcoal Burst",
        category = "Electric Guitar",
        price = 1199.00,
        details = "The PRS SE Hollowbody II blends solid-body stability with hollowbody resonance. Featuring 58/15 “S” pickups, it delivers clear, balanced tones. With a figured maple top/back, mahogany sides, and set-neck construction, it suits players of both styles. Includes a hardshell case.",
        body = "Maple",
        fretboard = "Ebony",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1711510540/Riff-Harbor/eg-11_rp4fve.jpg",
        discount = 0.8
    )
    e_guitar_12 = Instrument(
        seller_id = 2,
        make = "PRS",
        model = "PRS Private Stock Modern Eagle V Curly Maple Top",
        color = "Laguna Dragon's Breath",
        category = "Electric Guitar",
        price = 11550.00,
        details = "The PRS Private Stock Modern Eagle V embodies pinnacle guitar craftsmanship. Crafted from exotic black limba with a curly maple top, its high gloss finish radiates luxury. The pattern-shaped black limba neck, adorned with curly maple binding, ensures sublime playability. Adorned with old-style bird inlays of green select abalone outlined in mother of pearl, it's visually unparalleled. Equipped with dual 408B humbuckers and a narrow single coil, its tonal versatility is unmatched. Hardware in smoked black, including the Gen III tremolo and PRS Phase III locking tuners with ebony buttons, adds a touch of elegance. Limited in availability, it comes with a paisley hardshell case and hand-signed certificate of authenticity.",
        body = "Exotic (Curly Maple Top)",
        fretboard = "Ebony",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1712795334/Riff-Harbor/eg-12_wu3u5y.png",
        discount = 0.85
    )
    a_guitar_1 = Instrument(
        seller_id = 2,
        make = "Taylor",
        model = "Taylor 814ce V-Class Grand Auditorium",
        color = "Natural",
        category = "Acoustic Guitar",
        price = 3999.00,
        details = "The Taylor 814ce V-Class Grand Auditorium blends innovative design and top-notch features for an exceptional playing experience. Renowned for its craftsmanship and rich sound, it's a masterpiece meant to be cherished and played by discerning musicians.",
        body = "Mahogany",
        fretboard = "Ebony",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1711511261/Riff-Harbor/ag-1_celjqi.jpg",
        discount = 1
    )
    a_guitar_2 = Instrument(
        seller_id = 2,
        make = "Martin",
        model = "Martin D-18 Standard Dreadnought",
        color = "Natural",
        category = "Acoustic Guitar",
        price = 2799.00,
        details = "The Martin D-18, a classic from Martin's Standard Series, epitomizes the dreadnought tone. Handcrafted with Sitka spruce and mahogany, it delivers a balanced, resonant sound. With a High Performance neck and dreadnought body, it offers enhanced playability, volume, and projection. Versatile for various genres, it embodies Martin's heritage and prestige.",
        body = "Mahogany",
        fretboard = "Ebony",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1711511269/Riff-Harbor/ag-2_ydzev5.jpg",
        discount = 1
    )
    a_guitar_3 = Instrument(
        seller_id = 2,
        make = "Martin",
        model = "Martin Special X Style 000 Cutaway",
        color = "Black",
        category = "Acoustic Guitar",
        price = 589.00,
        details = "The Martin Special X Style 000 cutaway acoustic-electric guitar merges traditional craftsmanship with modern electronics. Featuring a sleek black satin finish, solid Jett Black HPL top, and Fishman MX electronics, it's perfect for live gigs or studio sessions.",
        body = "Mahogany",
        fretboard = "Ebony",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1711511958/Riff-Harbor/ag-3_nd7csl.jpg",
        discount = 0.9
    )
    a_guitar_4 = Instrument(
        seller_id = 2,
        make = "Fender",
        model = "Fender CD-60SCE Dreadnought",
        color = "Natural",
        category = "Acoustic Guitar",
        price = 329.00,
        details = "The Fender CD-60SCE offers beginner to intermediate players a versatile experience with its powerful onboard electronics and solid spruce top. Its Venetian-cutaway body allows for easy access to upper frets, while the mahogany back and sides ensure rich, resonant tones. Perfect for any setting, from the couch to the coffeehouse.",
        body = "Mahogany",
        fretboard = "Rosewood",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1711514825/Riff-Harbor/ag-4_hejvke.jpg",
        discount = 0.9
    )
    bass_1 = Instrument(
        seller_id = 2,
        make = "Fender",
        model = "Fender Suona Jazz Bass Thinline Violin",
        color = "Burst",
        category = "Bass",
        price = 3099.00,
        details = "The limited-edition Fender Suona Jazz Bass Thinline blends classic design with refined elegance, delivering warm tones and unmatched beauty. Crafted with a semi-hollow ash body and bound Italian alpine spruce top, it offers clarity and resonance. The roasted flame maple modern “C” neck and compound-radius ebony fingerboard provide comfort and playability. Equipped with custom Suona Jazz Bass pickups and HiMass Vintage bridge, it delivers dynamic tones with rich harmonics and sustain.",
        body = "Ash",
        fretboard = "Ebony",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1711512107/Riff-Harbor/b-1_paekkg.jpg",
        discount = 0.75
    )
    bass_2 = Instrument(
        seller_id = 2,
        make = "Fender",
        model = "Fender American Ultra Precision Bass Limited-Edition",
        color = "Umbra Burst",
        category = "Bass",
        price = 2799.00,
        details = "The limited-edition Fender American Ultra Precision Bass offers precision, performance, and tone. With a unique Modern D neck profile and Ultra rolled fingerboard edges, it ensures playing comfort. The Ultra Noiseless Vintage pickups and advanced wiring options deliver versatile tones without hum. Other features include a compound-radius ebony fingerboard and lightweight vintage-paddle tuning machines. Comes with a premium molded hardshell case.",
        body = "Alder",
        fretboard = "Ebony",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1711513320/Riff-Harbor/b-2_btvnbr.jpg",
        discount = 1
    )
    bass_3 = Instrument(
        seller_id = 2,
        make = "Fender",
        model = "Fender Precision Bass Limited-Edition",
        color = "Black",
        category = "Bass",
        price = 999.00,
        details = "Authentically classic, the limited-edition Fender Player Precision Bass with ebony fingerboard delivers iconic style and thunderous sound for studio or stage.",
        body = "Alder",
        fretboard = "Ebony",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1711513528/Riff-Harbor/b-3_wmr4zd.jpg",
        discount = 0.9
    )
    bass_4 = Instrument(
        seller_id = 2,
        make = "Ernie Ball",
        model = "Music Man StingRay5 Special HH 5-String",
        color = "Candyman",
        category = "Bass",
        price = 2899.00,
        details = "The Ernie Ball Music Man StingRay bass, an icon of modern music, combines craftsmanship and innovation. With its onboard active equalization and new 18-volt 3-band preamp, the StingRay Special 5HH offers versatile tones, from modern to vintage, with warmth and punch.",
        body = "Select hardwoods",
        fretboard = "Maple",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1711513685/Riff-Harbor/b-4_wpi6a5.jpg",
        discount = 1
    )
    bass_5 = Instrument(
        seller_id = 2,
        make = "Ernie Ball",
        model = "Music Man DarkRay 4-String",
        color = "Shadow Korina",
        category = "Bass",
        price = 3099.00,
        details = "Designed with Darkglass Electronics, this four-string bass offers diverse sonic capabilities. Its modern 2-band EQ preamp features Clean, Alpha (tight distortion), and Omega (fuzz) modes, fully mixable via onboard controls. With a neodymium humbucking pickup, roasted maple neck, and 22 stainless steel frets, it maintains the StingRay Special's essence.",
        body = "Black Limba",
        fretboard = "Maple",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1711514142/Riff-Harbor/b-5_s3leed.jpg",
        discount = 1
    )
    bass_6 = Instrument(
        seller_id = 2,
        make = "Gibson",
        model = "Gibson Rex Brown Thunderbird",
        color = "Ebony",
        category = "Bass",
        price = 2799.00,
        details = "Introducing the Rex Brown Thunderbird Electric Bass by Gibson, the signature instrument of Pantera's Rex Brown. Crafted for powerful low end, it features a mahogany body and neck, with Rexbucker T-Bird pickups for bone-rattling output. Active electronics offer versatile sound control at your fingertips.",
        body = "Mahogany",
        fretboard = "Rosewood",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1711514298/Riff-Harbor/b-6_bzajvj.jpg",
        discount = 0.85
    )
    bass_7 = Instrument(
        seller_id = 2,
        make = "Schecter",
        model = "Schecter Guitar Research Charles Berthoud CB-4",
        color = "See Thru Black Satin",
        category = "Bass",
        price = 1499.00,
        details = "The Charles Berthoud CB-4 Electric Bass offers professional performance with premium features. EMG pickups and a 3-band EQ deliver versatile tones. With a flamed maple top, abalone inlays, and Grover tuners, it's a standout instrument for bassists of all genres.",
        body = "Ash",
        fretboard = "Maple",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1711514560/Riff-Harbor/b-7_zhcnrm.jpg",
        discount = 1
    )
    bass_8 = Instrument(
        seller_id = 2,
        make = "Schecter",
        model = "Schecter Guitar Research FreeZesicle-5 5-String",
        color = "Freeze Purple",
        category = "Bass",
        price = 1499.00,
        details = "The Schecter FreeZesicle-5 electric bass combines premium specs with stunning style. Built for professionals, it features a swamp ash body, active EMG pickups, and a versatile 3-band EQ. With a Graphtech nut, Schecter Custom bridge, and Grover tuners, it's the ultimate bass. Optional SGR-Universal bass case sold separately.",
        body = "Ash",
        fretboard = "Maple",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1711514602/Riff-Harbor/b-8_npdm9g.jpg",
        discount = 1
    )
    bass_9 = Instrument(
        seller_id = 2,
        make = "Gibson",
        model = "Gibson SG Standard Bass Heritage",
        color = "Cherry",
        category = "Bass",
        price = 1999.00,
        details = "The Gibson SG Standard Bass, known for its iconic look, sound, and feel, features a 30-inch short scale length that enhances its distinctive tone. Ideal for smaller players, this bass is cherished for its strong, fundamental sound. With a solid mahogany body and a comfortable, rounded neck, it's a classic.",
        body = "Mahogany",
        fretboard = "Rosewood",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1724453041/Riff-Harbor/b-10_q2aacn.jpg",
        discount = 1
    )
    bass_10 = Instrument(
        seller_id = 2,
        make = "Gibson",
        model = "Gibson SG Standard Bass Heritage",
        color = "Ebony",
        category = "Bass",
        price = 1999.00,
        details = "The Gibson SG Standard Bass, known for its iconic look, sound, and feel, features a 30-inch short scale length that enhances its distinctive tone. Ideal for smaller players, this bass is cherished for its strong, fundamental sound. With a solid mahogany body and a comfortable, rounded neck, it's a classic.",
        body = "Mahogany",
        fretboard = "Rosewood",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1724454328/Riff-Harbor/b-11_xbpelw.png",
        discount = 1
    )
    e_guitar_13 = Instrument(
        seller_id = 2,
        make = "Jackson",
        model = "Jackson American Series Soloist SL2MG HT",
        color = "Satin Black",
        category = "Electric Guitar",
        price = 2499.99,
        details = "Jackson's American Series Soloist SL2MG HT is a premium shred machine designed in Corona, CA for virtuosic players. With exceptional stability and sustain, it offers heavy tones ideal for modern metal, alongside a contoured body and specialized neck profile for stupefying fretboard antics, embodying high-octane speed and iconic metal attitude.",
        body = "Alder",
        fretboard = "Ebony",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1712637594/Riff-Harbor/eg-13_pssfbb.png",
        discount = 1
    )
    e_guitar_14 = Instrument(
        seller_id = 2,
        make = "Jackson",
        model = "Jackson KE2 Kelly USA",
        color = "Black",
        category = "Electric Guitar",
        price = 4199.99,
        details = "The Jackson KE2 Kelly USA Electric Guitar is a pro-level instrument. It features an alder body, quartersawn eastern hard rock maple neck-thru-body, compound-radius ebony fingerboard, Seymour Duncan humbucking pickups, Floyd Rose Original tremolo and black hardware (flame maple top and chrome hardware on trans finishes). Comes with hardshell case.",
        body = "Solid wood",
        fretboard = "Ebony",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1712637759/Riff-Harbor/eg-14_epxdgu.jpg",
        discount = 1
    )
    e_guitar_15 = Instrument(
        seller_id = 2,
        make = "Jackson",
        model = "Jackson USA RR1 Randy Rhoads Select Series",
        color = "Snow White Pearl",
        category = "Electric Guitar",
        price = 4499.99,
        details = "The Jackson USA RR1 Randy Rhoads Select Series Electric Guitar revives the legendary ax of metal pioneer Randy Rhoads. This high-performance version boasts an alder body, maple neck, and ebony fretboard with sharkfin inlays, delivering unmatched sustain and effortless soloing across its 22 jumbo frets.",
        body = "Alder",
        fretboard = "Ebony",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1712637946/Riff-Harbor/eg-15_vqyxhy.jpg",
        discount = 1
    )
    e_guitar_16 = Instrument(
        seller_id = 2,
        make = "Jackson",
        model = "Jackson MJ Series Rhoads RR24-MG",
        color = "Black with Yellow Pinstripes",
        category = "Electric Guitar",
        price = 2999.99,
        details = "The MJ Series Rhoads RR24-MG carries Randy Rhoads' metal legacy with an alder body, maple neck, and graphite-reinforced construction for stability. Its 24 jumbo frets, compound radius ebony fingerboard, and EMG pickups deliver intense, harmonically clear tones. With premium hardware like a Gotoh tremolo bridge and Dunlop strap buttons, it's built for daring performances.",
        body = "Alder",
        fretboard = "Ebony",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1712638069/Riff-Harbor/eg-16_oost1a.jpg",
        discount = 0.9
    )
    e_guitar_17 = Instrument(
        seller_id = 2,
        make = "Fender",
        model = "Fender American Professional II Telecaster Deluxe",
        color = "Black with Yellow Pinstripes",
        category = "Electric Guitar",
        price = 1849.99,
        details = "The Fender American Professional II Telecaster Deluxe modernizes the iconic Telecaster with V-Mod II Double Tap humbuckers, delivering both punchy humbucking tones and single-coil-like split sounds. Its cut Tele bridge offers flexible string tension options for any playing style.",
        body = "Alder",
        fretboard = "Rosewood",
        is_used = True,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1712638159/Riff-Harbor/eg-17_c0l8hp.jpg",
        discount = 1
    )
    e_guitar_18 = Instrument(
        seller_id = 2,
        make = "Schecter",
        model = "Schecter Guitar Research Solo-II Supreme",
        color = "Black Burst",
        category = "Electric Guitar",
        price = 1599.99,
        details = "The Schecter Solo-II Supreme electric guitar blends vintage vibe with modern features. With a flamed maple top, mahogany body, and 3-piece mahogany neck, it offers enhanced stability. Equipped with Lundgren Black Heaven humbuckers, it delivers versatile tones. Other features include a compound radius ebony fingerboard, coil-splitting controls, and premium hardware like GraphTech Ratio tuners and a TonePros Tune-O-Matic bridge.",
        body = "Mahogany",
        fretboard = "Ebony",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1712685922/Riff-Harbor/eg-18_guaiss.jpg",
        discount = 1
    )
    bass_11 = Instrument(
        seller_id = 2,
        make = "Fender",
        model = "Fender Player Plus Meteora",
        color = "Silver Burst",
        category = "Bass",
        price = 1099.99,
        details = "The Fender Player Plus Meteora active bass celebrates Fender's legacy while embracing innovation. As part of the Meteora series, it introduces a sleek bass design accessible to all players. Fender's commitment to innovation extends beyond classic models like the Stratocaster and Telecaster, evident in its Custom Shop and series like Alternate Reality and Parallel Universe, continually refining designs, electronics, and player-centric features.",
        body = "Alder",
        fretboard = "Maple",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1712686157/Riff-Harbor/b-9_bm1alk.jpg",
        discount = 1
    )
    a_guitar_5 = Instrument(
        seller_id = 2,
        make = "Taylor",
        model = "Taylor 414ce V-Class Special-Edition Grand Auditorium",
        color = "Shaded Edge Burst",
        category = "Acoustic Guitar",
        price = 3099.99,
        details = "The Taylor 414ce V-Class Special-Edition Grand Auditorium guitar delivers powerful tone and comfort. Crafted with Sitka spruce and Indian rosewood, it produces iconic acoustic timbre. Enhanced by V-Class bracing and Expression System 2 electronics, it offers an unforgettable sound. Responsive and visually stunning, it's a fantastic choice for musicians.",
        body = "Solid Indian rosewood",
        fretboard = "Tropical mahogany",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1712696223/Riff-Harbor/ag-5_bm9clo.jpg",
        discount = 1
    )
    a_guitar_6 = Instrument(
        seller_id = 2,
        make = "Gibson",
        model = "Gibson SJ-200 Standard",
        color = "Rosewood Burst",
        category = "Acoustic Guitar",
        price = 5999.99,
        details = "The Gibson SJ-200 Standard Rosewood acoustic-electric is a reissue of the iconic “King of the Flat Tops,” with its distinctive Super Jumbo shape that is produced full, balanced tone since 1937. You will appreciate the rosewood back and sides matched with a Sitka spruce top for a warm, resonant sound that has helped define acoustic music for over 70 years. Own a piece of Gibson history with the ageless SJ-200.",
        body = "Rosewood",
        fretboard = "Rosewood",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1712696542/Riff-Harbor/ag-6_e94nf7.png",
        discount = 0.85
    )
    a_guitar_7 = Instrument(
        seller_id = 2,
        make = "Gibson",
        model = "Gibson J-45 Standard Rosewood",
        color = "Rosewood Burst",
        category = "Acoustic Guitar",
        price = 3699.99,
        details = "The Gibson J-45 Standard Rosewood is an iconic dreadnought-style acoustic-electric guitar, renowned since the 1940s for its vintage appeal and rich tone. With a solid wood body and articulate highs, robust lows, and a projecting midrange, it's a versatile choice for studio recording and live performances. Known as The Workhorse, it sets the benchmark for professional instruments.",
        body = "Rosewood",
        fretboard = "Rosewood",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1712696727/Riff-Harbor/ag-7_kbbbi6.png",
        discount = 0.85
    )
    used_inst_1 = Instrument(
        seller_id = 1,
        make = "B.C. Rich",
        model = "B.C. Rich Ironbird Extreme with Floyd Rose",
        color = "Matte Black",
        category = "Electric Guitar",
        price = 1799.99,
        details = "The BC Rich Ironbird, designed by Joey Rico in 1983, is a metal artists favorite. Its angular body shape features sharp, dagger-like points. With a 24-fret neck and licensed Floyd Rose tremolo, it is built for shredding.",
        body = "Basswood",
        fretboard = "Rosewood",
        is_used = True,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1711557057/Riff-Harbor/test-eg-1_esfxhj.jpg",
        discount = 0.65
    )
    used_inst_2 = Instrument(
        seller_id = 1,
        make = "Jackson",
        model = "Jackson Pro Series Signature Jeff Loomis Soloist 7-String",
        color = "Satin Black",
        category = "Electric Guitar",
        price = 1699.99,
        details = "Jackson's Jeff Loomis Signature Soloist SL7: a high-speed, aggressive extended-range guitar crafted for clarity. Developed with Jeff Loomis, it offers a streamlined design, lightweight body, and satin-finished neck for shredders' comfort.",
        body = "Alder",
        fretboard = "Ebony",
        is_used = True,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1712637202/Riff-Harbor/test-eg-2_lc8yfn.jpg",
        discount = 0.7
    )
    used_inst_3 = Instrument(
        seller_id = 2,
        make = "Gibson",
        model = "Epiphone Inspired by Gibson Custom J-180 LS",
        color = "Pink",
        category = "Acoustic Guitar",
        price = 1299.99,
        details = "The Epiphone Inspired by Gibson Custom J-180 LS acoustic-electric guitar offers an authentic playing experience with premium materials like solid spruce and mahogany. Featuring iconic star inlays, it pays homage to the legendary Gibson J-180. In collaboration with the Gibson Custom Shop, it brings classic looks, feel, and sound to players at an affordable price.",
        body = "Solid mahogany",
        fretboard = "Laurel",
        is_used = True,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1712696972/Riff-Harbor/test-eg-3_dn0t2h.png",
        discount = 0.95
    )
    used_inst_4 = Instrument(
        seller_id = 2,
        make = "Gibson",
        model = "Gibson Hummingbird Standard",
        color = "Vintage Sunburst",
        category = "Acoustic Guitar",
        price = 3999.99,
        details = "Gibson's Hummingbird Standard, an iconic design since 1960, boasts a square shoulder dreadnought build. Renowned for its versatile sound and distinctive pickguard adorned with a hummingbird motif, exemplified in the 2019 acoustic/electric model.",
        body = "Mahogany",
        fretboard = "Rosewood",
        is_used = True,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1712697484/Riff-Harbor/used-4_lb0pcg.png",
        discount = 0.85
    )
    used_inst_5 = Instrument(
        seller_id = 2,
        make = "Fender",
        model = "Fender Player II Mustang Bass PJ",
        color = "Coral Red",
        category = "Bass",
        price = 799.99,
        details = "The Fender Player II Mustang Bass PJ offers flexible, thunderous tone with sleek style. Since 1964, it's been a favorite among bassists. This update adds versatile pickups: the P Bass middle for punchy lows and mids, and the Jazz Bass neck for rich lows—perfect for any genre.",
        body = "Alder",
        fretboard = "Ebony",
        is_used = True,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1724454424/Riff-Harbor/used-bass-4_lw6z7a.jpg",
        discount = 0.65
    )
    used_inst_6 = Instrument(
        seller_id = 2,
        make = "ESP",
        model = "ESP Original Snapper",
        color = "Nebula Black Burst",
        category = "Electric Guitar",
        price = 5499.00,
        details = "The ESP Original Snapper CTMN Electric Guitar in Nebula Black Burst is a high-end, handcrafted instrument featuring a swamp ash body with a burled poplar top, a one-piece maple neck and fingerboard, and Seymour Duncan pickups. It includes Gotoh locking tuners and an ESP Flicker-III tremolo system, all wrapped in a stunning Nebula Black Burst finish. Perfect for players seeking top-notch craftsmanship and versatile performance.",
        body = "Mahogany",
        fretboard = "Maple",
        is_used = True,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1724454799/Riff-Harbor/used-inst-6_lzufot.jpg",
        discount = 0.95
    )
    a_guitar_8 = Instrument(
        seller_id = 2,
        make = "Gibson",
        model = "Epiphone Inspired by Gibson Custom J-180 LS",
        color = "Blue",
        category = "Acoustic Guitar",
        price = 1299.99,
        details = "The Epiphone Inspired by Gibson Custom J-180 LS acoustic-electric guitar offers an authentic playing experience with premium materials like solid spruce and mahogany. Featuring iconic star inlays, it pays homage to the legendary Gibson J-180. In collaboration with the Gibson Custom Shop, it brings classic looks, feel, and sound to players at an affordable price.",
        body = "Solid mahogany",
        fretboard = "Laurel",
        is_used = False,
        image_url = "https://res.cloudinary.com/do8l6gpqp/image/upload/v1712697201/Riff-Harbor/ag-8_g9wlee.png",
        discount = 1
    )


    db.session.add_all([e_guitar_1, e_guitar_2, e_guitar_3, e_guitar_4, e_guitar_5, e_guitar_6, e_guitar_7, e_guitar_8, e_guitar_9, e_guitar_10, e_guitar_11, e_guitar_12, a_guitar_1, a_guitar_2, a_guitar_3, a_guitar_4, a_guitar_5, a_guitar_6, a_guitar_7, a_guitar_8, bass_1, bass_2, bass_3, bass_4, bass_5, bass_6, bass_7, bass_8, bass_9, bass_10, bass_11, used_inst_1, used_inst_2, e_guitar_13, e_guitar_14, e_guitar_15, e_guitar_16, e_guitar_17, e_guitar_18, used_inst_3, used_inst_4, used_inst_5,used_inst_6])
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_instruments():
   if environment == "production":
       db.session.execute(f"TRUNCATE table {SCHEMA}.instruments RESTART IDENTITY CASCADE;")
   else:
       db.session.execute(text("DELETE FROM instruments"))

   db.session.commit()
