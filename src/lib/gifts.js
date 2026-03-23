/**
 * gifts.js
 *
 * Local gift recommendation engine — works without an API key.
 * Curated database of gifts matched by occasion, personality, age, relationship, and budget.
 */

const GIFT_DB = [
  // ── Experiences ────────────────────────────────────────────────
  { name: "Cooking class for two", price: 65, type: "Experience", tags: ["foodie", "adventurous", "social", "creative"], occasions: ["Birthday", "Anniversary", "Valentine's Day", "Just because"], ageRange: [20, 70], where: "Search Airbnb Experiences or Eatwith for cooking classes in their city" },
  { name: "Pottery or ceramics workshop", price: 55, type: "Experience", tags: ["creative", "artsy", "mindful", "hands-on"], occasions: ["Birthday", "Just because", "Thank you", "Graduation"], ageRange: [18, 65], where: "Search Viator or Airbnb Experiences for pottery workshops nearby" },
  { name: "Wine or cocktail tasting experience", price: 50, type: "Experience", tags: ["foodie", "social", "adventurous", "sophisticated"], occasions: ["Birthday", "Anniversary", "Thank you", "Retirement"], ageRange: [21, 75], where: "Search Viator or GetYourGuide for tasting experiences in their area" },
  { name: "Outdoor adventure day (kayaking, hiking tour, or climbing)", price: 70, type: "Experience", tags: ["outdoorsy", "adventurous", "active", "sporty", "nature"], occasions: ["Birthday", "Graduation", "Just because"], ageRange: [16, 55], where: "Search GetYourGuide or Viator for outdoor adventures near their city" },
  { name: "Photography walking tour", price: 45, type: "Experience", tags: ["creative", "artsy", "curious", "introverted", "photography"], occasions: ["Birthday", "Graduation", "Just because", "Thank you"], ageRange: [18, 65], where: "Search Airbnb Experiences for photo walks in their city" },
  { name: "Spa day or wellness experience", price: 80, type: "Experience", tags: ["mindful", "relaxed", "self-care", "stressed"], occasions: ["Birthday", "Mother's Day", "Thank you", "Get well soon", "Anniversary"], ageRange: [25, 75], where: "Search for spa day packages or ClassPass in their area" },
  { name: "Live music or theatre tickets", price: 60, type: "Experience", tags: ["music", "creative", "social", "cultured", "artsy"], occasions: ["Birthday", "Anniversary", "Valentine's Day", "Just because", "Thank you"], ageRange: [18, 75], where: "Check local venue listings, Eventbrite, or StubHub for upcoming shows" },
  { name: "Food tour of their neighbourhood", price: 55, type: "Experience", tags: ["foodie", "social", "adventurous", "curious"], occasions: ["Birthday", "Housewarming", "Just because"], ageRange: [20, 65], where: "Search Airbnb Experiences or Withlocals for food tours in their city" },
  { name: "Flower arranging or wreath-making class", price: 50, type: "Experience", tags: ["creative", "nature", "mindful", "botanical"], occasions: ["Birthday", "Mother's Day", "Just because", "Housewarming"], ageRange: [22, 70], where: "Search for floral workshops in their area on Eventbrite or local florists" },
  { name: "Stargazing or astronomy experience", price: 40, type: "Experience", tags: ["curious", "nerdy", "nature", "introverted", "science"], occasions: ["Birthday", "Graduation", "Just because"], ageRange: [12, 70], where: "Search for stargazing events or observatory visits near their city" },

  // ── Books & Reading ────────────────────────────────────────────
  { name: "Beautifully curated book subscription (3 months)", price: 45, type: "Subscription", tags: ["bookish", "introverted", "curious", "nerdy", "reader"], occasions: ["Birthday", "Graduation", "Holiday / Christmas", "Just because"], ageRange: [16, 75], where: "Book of the Month, Literati, or The Folio Society" },
  { name: "Gorgeous coffee table book on their interest", price: 40, type: "Physical gift", tags: ["artsy", "creative", "photography", "curious", "cultured"], occasions: ["Birthday", "Housewarming", "Holiday / Christmas", "Graduation"], ageRange: [22, 75], where: "Search for coffee table books on their specific interest at Bookshop.org" },
  { name: "Personalised bookplate stamps or literary prints", price: 30, type: "Local craft", tags: ["bookish", "reader", "vintage", "nostalgic"], occasions: ["Birthday", "Graduation", "Holiday / Christmas"], ageRange: [18, 65], where: "Search Etsy for custom bookplates or literary art prints" },

  // ── Food & Drink ───────────────────────────────────────────────
  { name: "Specialty coffee or tea subscription", price: 40, type: "Subscription", tags: ["coffee", "tea", "foodie", "routine", "cozy"], occasions: ["Birthday", "Holiday / Christmas", "Thank you", "Housewarming"], ageRange: [20, 70], where: "Trade Coffee, Atlas Coffee Club, or a local roaster subscription" },
  { name: "Artisan chocolate selection from a craft chocolatier", price: 35, type: "Food & drink", tags: ["foodie", "sweet-tooth", "sophisticated", "indulgent"], occasions: ["Birthday", "Valentine's Day", "Thank you", "Holiday / Christmas", "Mother's Day"], ageRange: [18, 80], where: "Search for craft chocolatiers in their city or try Cocoa Runners" },
  { name: "Build-your-own hot sauce or spice kit", price: 30, type: "Food & drink", tags: ["foodie", "adventurous", "cooking", "bold"], occasions: ["Birthday", "Holiday / Christmas", "Housewarming", "Just because"], ageRange: [20, 55], where: "Search Etsy or specialty food shops for hot sauce making kits" },
  { name: "Local brewery or distillery gift set", price: 45, type: "Food & drink", tags: ["social", "beer", "spirits", "foodie", "fun"], occasions: ["Birthday", "Father's Day", "Holiday / Christmas", "Housewarming", "Thank you"], ageRange: [21, 65], where: "Search for craft breweries or distilleries in their area" },
  { name: "Premium olive oil and vinegar set", price: 35, type: "Food & drink", tags: ["foodie", "cooking", "sophisticated", "healthy"], occasions: ["Housewarming", "Birthday", "Thank you", "Wedding"], ageRange: [25, 75], where: "Search for artisan olive oil producers or try Brightland, Graza" },
  { name: "Homemade pasta making kit", price: 30, type: "Food & drink", tags: ["foodie", "cooking", "creative", "hands-on", "italian"], occasions: ["Birthday", "Housewarming", "Holiday / Christmas", "Just because"], ageRange: [20, 60], where: "Search for pasta making kits on Uncommon Goods or Etsy" },

  // ── Home & Living ──────────────────────────────────────────────
  { name: "Handmade ceramic mug or bowl from a local potter", price: 35, type: "Local craft", tags: ["cozy", "minimalist", "artsy", "coffee", "tea", "mindful"], occasions: ["Birthday", "Housewarming", "Holiday / Christmas", "Thank you", "Just because"], ageRange: [20, 75], where: "Search Etsy for handmade ceramics or visit local pottery studios" },
  { name: "Luxury scented candle from an independent maker", price: 40, type: "Local craft", tags: ["cozy", "homebody", "self-care", "relaxed", "aesthetic"], occasions: ["Birthday", "Housewarming", "Holiday / Christmas", "Thank you", "Mother's Day"], ageRange: [22, 70], where: "Search for independent candle makers in their city or try Boy Smells, P.F. Candle Co" },
  { name: "Linen apron or kitchen textiles", price: 35, type: "Local craft", tags: ["cooking", "foodie", "minimalist", "practical", "homemaker"], occasions: ["Housewarming", "Birthday", "Wedding", "Holiday / Christmas"], ageRange: [25, 70], where: "Search Etsy for handmade linen aprons or try MagicLinen" },
  { name: "Custom illustrated house portrait", price: 50, type: "Local craft", tags: ["sentimental", "nostalgic", "artsy", "homebody"], occasions: ["Housewarming", "Wedding", "Anniversary", "Holiday / Christmas"], ageRange: [25, 70], where: "Search Etsy for custom house portrait illustrations" },
  { name: "Indoor plant with a beautiful handmade pot", price: 35, type: "Physical gift", tags: ["nature", "botanical", "minimalist", "plant", "green"], occasions: ["Housewarming", "Birthday", "Thank you", "Get well soon"], ageRange: [20, 65], where: "Visit a local plant shop or nursery in their area" },
  { name: "Weighted blanket or premium throw", price: 55, type: "Physical gift", tags: ["cozy", "homebody", "anxious", "relaxed", "comfort"], occasions: ["Birthday", "Holiday / Christmas", "Get well soon", "Just because"], ageRange: [18, 65], where: "Bearaby, Brooklinen, or search for weighted blankets at local home stores" },

  // ── Fashion & Accessories ──────────────────────────────────────
  { name: "Handcrafted leather wallet or card holder", price: 45, type: "Local craft", tags: ["minimalist", "practical", "stylish", "professional"], occasions: ["Birthday", "Graduation", "Father's Day", "Holiday / Christmas"], ageRange: [20, 65], where: "Search Etsy for handmade leather goods or visit local leather shops" },
  { name: "Silk scarf or pocket square from an independent designer", price: 50, type: "Local craft", tags: ["stylish", "fashionable", "elegant", "artsy", "sophisticated"], occasions: ["Birthday", "Mother's Day", "Anniversary", "Holiday / Christmas"], ageRange: [25, 75], where: "Search for independent designers on Etsy or local boutiques" },
  { name: "Custom engraved jewellery (bracelet or necklace)", price: 45, type: "Physical gift", tags: ["sentimental", "stylish", "romantic", "elegant"], occasions: ["Birthday", "Anniversary", "Valentine's Day", "Graduation", "Mother's Day"], ageRange: [16, 70], where: "Search Etsy for personalised jewellery or visit local jewellers" },
  { name: "Quality sunglasses from an independent brand", price: 55, type: "Physical gift", tags: ["stylish", "outdoorsy", "trendy", "adventurous"], occasions: ["Birthday", "Graduation", "Just because"], ageRange: [18, 50], where: "Check out Ace & Tate, Local Supply, or independent eyewear shops" },

  // ── Tech & Gadgets ─────────────────────────────────────────────
  { name: "Portable Bluetooth speaker (compact, quality sound)", price: 50, type: "Physical gift", tags: ["music", "outdoorsy", "social", "tech", "active"], occasions: ["Birthday", "Graduation", "Holiday / Christmas"], ageRange: [16, 50], where: "JBL Go, Marshall Willen, or search for portable speakers" },
  { name: "Kindle or e-reader with a premium case", price: 90, type: "Physical gift", tags: ["bookish", "reader", "traveler", "introverted", "tech"], occasions: ["Birthday", "Graduation", "Holiday / Christmas"], ageRange: [16, 70], where: "Amazon Kindle Paperwhite or Kobo Clara" },
  { name: "Desk organiser or tech accessories set", price: 35, type: "Physical gift", tags: ["practical", "minimalist", "professional", "organised", "tech"], occasions: ["Birthday", "Graduation", "Holiday / Christmas", "New job"], ageRange: [20, 55], where: "Grovemade, Ugmonk, or search Etsy for desk organisers" },

  // ── Creative & Hobby ───────────────────────────────────────────
  { name: "Premium sketchbook and artist pen set", price: 35, type: "Physical gift", tags: ["artsy", "creative", "drawing", "introverted"], occasions: ["Birthday", "Graduation", "Holiday / Christmas", "Just because"], ageRange: [14, 60], where: "Moleskine Art Collection, Leuchtturm1917, or local art supply shops" },
  { name: "Beginner embroidery or cross-stitch kit", price: 25, type: "Physical gift", tags: ["creative", "crafty", "patient", "mindful", "hands-on"], occasions: ["Birthday", "Holiday / Christmas", "Just because", "Get well soon"], ageRange: [18, 65], where: "Search Etsy for modern embroidery kits or try Wool and the Gang" },
  { name: "Vinyl record of their favourite album + display frame", price: 40, type: "Physical gift", tags: ["music", "nostalgic", "vintage", "collector", "hipster"], occasions: ["Birthday", "Holiday / Christmas", "Just because", "Graduation"], ageRange: [18, 55], where: "Check local record shops, Discogs, or vinyl subscription services" },
  { name: "Premium journaling set (notebook + quality pen)", price: 35, type: "Physical gift", tags: ["mindful", "introverted", "creative", "organised", "writer"], occasions: ["Birthday", "Graduation", "Holiday / Christmas", "Just because"], ageRange: [16, 65], where: "Leuchtturm1917, Hobonichi, or local stationery shops" },
  { name: "DIY terrarium kit", price: 30, type: "Physical gift", tags: ["nature", "creative", "botanical", "mindful", "plant"], occasions: ["Birthday", "Housewarming", "Just because", "Get well soon"], ageRange: [16, 55], where: "Search Etsy for terrarium kits or check local garden centres" },

  // ── Wellness & Self-care ───────────────────────────────────────
  { name: "Luxury bath soak and body care set (small-batch)", price: 40, type: "Local craft", tags: ["self-care", "relaxed", "mindful", "cozy", "stressed"], occasions: ["Birthday", "Mother's Day", "Thank you", "Get well soon", "Holiday / Christmas"], ageRange: [20, 70], where: "Search for small-batch bath products on Etsy or local apothecaries" },
  { name: "Yoga mat and accessories bundle", price: 50, type: "Physical gift", tags: ["active", "mindful", "yoga", "wellness", "healthy"], occasions: ["Birthday", "Holiday / Christmas", "Just because"], ageRange: [18, 60], where: "Liforme, Manduka, or local yoga studios that sell equipment" },
  { name: "Meditation app subscription (1 year)", price: 45, type: "Subscription", tags: ["mindful", "stressed", "introverted", "wellness", "anxious"], occasions: ["Birthday", "Holiday / Christmas", "Just because", "Get well soon"], ageRange: [18, 65], where: "Headspace, Calm, or Insight Timer premium" },

  // ── For Kids & Teens ───────────────────────────────────────────
  { name: "Art supply kit with quality materials", price: 30, type: "Physical gift", tags: ["creative", "artsy", "curious", "crafty"], occasions: ["Birthday", "Holiday / Christmas", "Graduation"], ageRange: [6, 16], where: "Local art supply stores or curated kids art kits on Etsy" },
  { name: "Science experiment or STEM kit", price: 35, type: "Physical gift", tags: ["curious", "nerdy", "science", "smart", "hands-on"], occasions: ["Birthday", "Holiday / Christmas"], ageRange: [6, 14], where: "KiwiCo, Thames & Kosmos, or local toy shops" },
  { name: "Personalised story book", price: 30, type: "Physical gift", tags: ["bookish", "imaginative", "young", "creative"], occasions: ["Birthday", "Holiday / Christmas", "Baby shower"], ageRange: [1, 10], where: "Wonderbly, Hooray Heroes, or Etsy personalised children's books" },

  // ── For Older Recipients ───────────────────────────────────────
  { name: "Premium loose-leaf tea collection with tasting notes", price: 35, type: "Food & drink", tags: ["tea", "cozy", "mindful", "sophisticated", "calm"], occasions: ["Birthday", "Mother's Day", "Father's Day", "Retirement", "Holiday / Christmas"], ageRange: [40, 90], where: "T2, Harney & Sons, or local tea shops in their area" },
  { name: "Digital photo frame pre-loaded with family photos", price: 60, type: "Physical gift", tags: ["sentimental", "family", "nostalgic", "connected"], occasions: ["Birthday", "Mother's Day", "Father's Day", "Retirement", "Holiday / Christmas"], ageRange: [55, 90], where: "Aura Frames, Nixplay, or Skylight" },
  { name: "Garden tool set or seed subscription", price: 35, type: "Physical gift", tags: ["nature", "gardening", "outdoorsy", "patient", "green"], occasions: ["Birthday", "Retirement", "Father's Day", "Mother's Day", "Holiday / Christmas"], ageRange: [40, 85], where: "Local garden centres or search for garden subscriptions on Bloomscape" },

  // ── Sentimental & Personal ─────────────────────────────────────
  { name: "Custom star map of a meaningful date", price: 35, type: "Local craft", tags: ["romantic", "sentimental", "nostalgic", "thoughtful"], occasions: ["Anniversary", "Wedding", "Valentine's Day", "Baby shower"], ageRange: [20, 65], where: "Search Etsy for custom star maps or try The Night Sky" },
  { name: "Personalised map print of their city", price: 30, type: "Local craft", tags: ["sentimental", "minimalist", "traveler", "nostalgic", "homebody"], occasions: ["Housewarming", "Birthday", "Graduation", "Anniversary"], ageRange: [20, 65], where: "Search Etsy for custom city map prints or try Mapiful" },
  { name: "Memory book or scrapbook kit", price: 25, type: "Physical gift", tags: ["sentimental", "creative", "nostalgic", "family"], occasions: ["Anniversary", "Wedding", "Baby shower", "Retirement"], ageRange: [20, 70], where: "Artifact Uprising, Papier, or local stationery shops" },
  { name: "Letter writing set with wax seal kit", price: 30, type: "Physical gift", tags: ["nostalgic", "romantic", "creative", "vintage", "writer"], occasions: ["Birthday", "Valentine's Day", "Holiday / Christmas", "Just because"], ageRange: [18, 60], where: "Search Etsy for wax seal kits or try Papier" },

  // ── Professional & Practical ───────────────────────────────────
  { name: "Premium notebook and pen set (Moleskine/Leuchtturm)", price: 40, type: "Physical gift", tags: ["professional", "organised", "practical", "minimalist"], occasions: ["Graduation", "Birthday", "Holiday / Christmas", "Thank you"], ageRange: [20, 60], where: "Moleskine, Leuchtturm1917, or local stationery shops" },
  { name: "Noise-cancelling earbuds", price: 80, type: "Physical gift", tags: ["tech", "music", "commuter", "practical", "introverted"], occasions: ["Birthday", "Graduation", "Holiday / Christmas"], ageRange: [16, 55], where: "Sony WF-1000XM5, AirPods Pro, or Samsung Galaxy Buds" },
  { name: "Personalised leather passport holder", price: 35, type: "Local craft", tags: ["traveler", "adventurous", "practical", "stylish"], occasions: ["Birthday", "Graduation", "Holiday / Christmas"], ageRange: [18, 60], where: "Search Etsy for personalised passport holders or local leather shops" },

  // ── Pet Owners ─────────────────────────────────────────────────
  { name: "Custom pet portrait (illustrated or painted)", price: 45, type: "Local craft", tags: ["dog", "cat", "pet", "animal-lover", "sentimental"], occasions: ["Birthday", "Holiday / Christmas", "Just because"], ageRange: [18, 70], where: "Search Etsy for custom pet portraits from independent artists" },
  { name: "Pet and owner matching accessory set", price: 30, type: "Physical gift", tags: ["dog", "cat", "pet", "fun", "quirky"], occasions: ["Birthday", "Holiday / Christmas", "Just because"], ageRange: [18, 50], where: "Search Etsy or check local pet boutiques" },

  // ── Subscription Gifts ─────────────────────────────────────────
  { name: "Streaming gift card (Spotify, Netflix, or similar)", price: 30, type: "Subscription", tags: ["music", "film", "practical", "tech"], occasions: ["Birthday", "Holiday / Christmas", "Graduation", "Thank you"], ageRange: [14, 55], where: "Buy gift cards directly from Spotify, Netflix, or Apple" },
  { name: "Meal kit subscription (1 month)", price: 60, type: "Subscription", tags: ["foodie", "cooking", "busy", "practical", "adventurous"], occasions: ["Birthday", "Housewarming", "Holiday / Christmas"], ageRange: [22, 55], where: "HelloFresh, Gousto, Blue Apron, or a local meal kit service" },
  { name: "Flower subscription (monthly delivery)", price: 40, type: "Subscription", tags: ["botanical", "nature", "elegant", "cozy", "aesthetic"], occasions: ["Birthday", "Mother's Day", "Anniversary", "Thank you", "Get well soon"], ageRange: [22, 75], where: "Bloom & Wild, The Bouqs Co, or a local florist with delivery" },

  // ── Newborns & Infants (0–1) ───────────────────────────────────
  { name: "Organic cotton muslin swaddle set", price: 30, type: "Physical gift", tags: ["cozy", "practical", "minimalist", "comfort"], occasions: ["Baby shower", "Birthday", "Just because", "New baby"], ageRange: [0, 1], where: "Local baby boutiques or search for organic muslin swaddles online" },
  { name: "Handmade baby rattle (wooden or crochet)", price: 18, type: "Local craft", tags: ["creative", "sentimental", "fun", "minimalist"], occasions: ["Baby shower", "Birthday", "New baby", "Just because"], ageRange: [0, 1], where: "Search for handmade baby rattles from local makers or on Etsy" },
  { name: "Baby footprint or handprint keepsake kit", price: 22, type: "Local craft", tags: ["sentimental", "family", "creative", "nostalgic"], occasions: ["Baby shower", "Birthday", "New baby", "Holiday / Christmas"], ageRange: [0, 1], where: "Local baby stores or search for baby keepsake kits online" },
  { name: "Black and white contrast cards for newborns", price: 12, type: "Physical gift", tags: ["educational", "curious", "minimalist"], occasions: ["Baby shower", "New baby", "Just because"], ageRange: [0, 1], where: "Local bookshops or search for high contrast baby cards online" },
  { name: "Personalised baby blanket with name", price: 35, type: "Local craft", tags: ["cozy", "sentimental", "comfort", "minimalist"], occasions: ["Baby shower", "Birthday", "New baby", "Holiday / Christmas"], ageRange: [0, 2], where: "Search for personalised baby blankets from independent makers" },
  { name: "Milestone card set (first year moments)", price: 15, type: "Physical gift", tags: ["sentimental", "family", "creative", "nostalgic"], occasions: ["Baby shower", "New baby", "Birthday"], ageRange: [0, 1], where: "Local stationery shops or search for baby milestone cards online" },
  { name: "Crinkle fabric soft book", price: 14, type: "Physical gift", tags: ["educational", "fun", "creative", "bookish"], occasions: ["Baby shower", "Birthday", "New baby", "Just because"], ageRange: [0, 1], where: "Local bookshops or baby stores, or search for baby crinkle books" },
  { name: "Organic baby skincare gift set", price: 28, type: "Physical gift", tags: ["practical", "self-care", "minimalist", "healthy"], occasions: ["Baby shower", "New baby", "Birthday"], ageRange: [0, 1], where: "Local pharmacies or search for organic baby skincare sets" },
  { name: "Silicone teething toy set", price: 16, type: "Physical gift", tags: ["practical", "fun", "comfort"], occasions: ["Baby shower", "Birthday", "New baby", "Just because"], ageRange: [0, 1], where: "Local baby stores or search for silicone teethers online" },
  { name: "Newborn baby photo session gift voucher", price: 50, type: "Experience", tags: ["sentimental", "creative", "family", "artsy"], occasions: ["Baby shower", "New baby", "Birthday"], ageRange: [0, 1], where: "Search for newborn photographers in their area" },
  { name: "Star map poster of baby's birth date", price: 30, type: "Local craft", tags: ["sentimental", "nerdy", "artsy", "nostalgic", "creative"], occasions: ["Baby shower", "New baby", "Birthday"], ageRange: [0, 2], where: "Search for custom star map prints from independent artists online" },
  { name: "Wooden baby gym (Montessori style)", price: 45, type: "Physical gift", tags: ["educational", "minimalist", "creative", "hands-on"], occasions: ["Baby shower", "New baby", "Birthday"], ageRange: [0, 1], where: "Local baby boutiques or search for wooden baby gyms online" },

  // ── Babies & Toddlers (0–3) ────────────────────────────────────
  { name: "Personalised name puzzle (wooden)", price: 25, type: "Local craft", tags: ["creative", "educational", "fun", "hands-on"], occasions: ["Birthday", "Holiday / Christmas", "Baby shower", "Just because"], ageRange: [1, 4], where: "Search for personalised wooden name puzzles at local toy shops or online" },
  { name: "Soft sensory play mat", price: 35, type: "Physical gift", tags: ["creative", "active", "fun", "educational"], occasions: ["Birthday", "Holiday / Christmas", "Baby shower"], ageRange: [0, 3], where: "Local baby stores or search for sensory play mats online" },
  { name: "Custom illustrated growth chart", price: 30, type: "Local craft", tags: ["sentimental", "artsy", "creative", "family"], occasions: ["Birthday", "Baby shower", "Holiday / Christmas"], ageRange: [0, 5], where: "Search for custom growth charts from independent artists online" },
  { name: "Wooden stacking toy set", price: 20, type: "Physical gift", tags: ["educational", "minimalist", "creative", "hands-on"], occasions: ["Birthday", "Holiday / Christmas", "Baby shower"], ageRange: [0, 4], where: "Local toy stores or search for Montessori stacking toys" },
  { name: "Musical instruments set for toddlers", price: 25, type: "Physical gift", tags: ["music", "creative", "fun", "active"], occasions: ["Birthday", "Holiday / Christmas", "Just because"], ageRange: [1, 5], where: "Local toy shops or search for toddler instrument sets online" },
  { name: "Soft plush toy with personalised name", price: 25, type: "Local craft", tags: ["cozy", "sentimental", "fun", "comfort"], occasions: ["Birthday", "Holiday / Christmas", "Baby shower", "Just because"], ageRange: [0, 5], where: "Search for personalised plush toys from local makers or online" },
  { name: "Baby memory book (first year journal)", price: 20, type: "Physical gift", tags: ["sentimental", "family", "creative", "nostalgic"], occasions: ["Baby shower", "Birthday", "Holiday / Christmas"], ageRange: [0, 2], where: "Local bookshops or search for baby memory journals online" },
  { name: "Wooden play kitchen accessories", price: 25, type: "Physical gift", tags: ["creative", "fun", "imaginative", "hands-on"], occasions: ["Birthday", "Holiday / Christmas", "Just because"], ageRange: [2, 6], where: "Local toy shops or search for wooden play food sets online" },
  { name: "Splash pad or water play table", price: 30, type: "Physical gift", tags: ["active", "outdoorsy", "fun", "nature"], occasions: ["Birthday", "Holiday / Christmas", "Just because"], ageRange: [1, 5], where: "Local toy or garden stores, or search for toddler water play tables" },
  { name: "Board books gift set (touch and feel)", price: 18, type: "Physical gift", tags: ["bookish", "educational", "creative", "imaginative"], occasions: ["Birthday", "Holiday / Christmas", "Baby shower", "Just because"], ageRange: [0, 3], where: "Local bookshops or search for baby board book gift sets online" },
  { name: "Kids music class or baby sensory session", price: 20, type: "Experience", tags: ["music", "creative", "social", "fun", "educational"], occasions: ["Birthday", "Just because", "Holiday / Christmas"], ageRange: [0, 5], where: "Search for baby music classes or sensory sessions in their area" },
  { name: "Ride-on toy or balance bike", price: 35, type: "Physical gift", tags: ["active", "outdoorsy", "fun", "adventurous"], occasions: ["Birthday", "Holiday / Christmas"], ageRange: [1, 4], where: "Local toy stores or search for toddler balance bikes online" },
  { name: "Play tent or teepee", price: 30, type: "Physical gift", tags: ["imaginative", "fun", "cozy", "creative"], occasions: ["Birthday", "Holiday / Christmas", "Just because"], ageRange: [1, 7], where: "Local home or toy stores, or search for kids play tents" },
  { name: "Personalised children's tableware set", price: 22, type: "Local craft", tags: ["practical", "sentimental", "minimalist", "fun"], occasions: ["Birthday", "Baby shower", "Holiday / Christmas"], ageRange: [0, 5], where: "Search for personalised kids plates and cups from independent makers" },

  // ── Kids (4–12) ────────────────────────────────────────────────
  { name: "Build-your-own robot or coding toy", price: 35, type: "Physical gift", tags: ["tech", "curious", "nerdy", "creative", "science"], occasions: ["Birthday", "Holiday / Christmas"], ageRange: [5, 12], where: "Local toy shops or search for kids coding toys online" },
  { name: "Outdoor explorer kit (binoculars, magnifying glass, compass)", price: 25, type: "Physical gift", tags: ["outdoorsy", "curious", "nature", "adventurous", "science"], occasions: ["Birthday", "Holiday / Christmas", "Just because"], ageRange: [4, 12], where: "Local toy or outdoor shops, or search for kids explorer kits" },
  { name: "Craft subscription box for kids", price: 25, type: "Subscription", tags: ["creative", "crafty", "artsy", "hands-on"], occasions: ["Birthday", "Holiday / Christmas"], ageRange: [4, 12], where: "Search for kids craft subscription boxes like KiwiCo or Toucan Box" },
  { name: "Kids cooking or baking set", price: 25, type: "Physical gift", tags: ["foodie", "creative", "hands-on", "fun"], occasions: ["Birthday", "Holiday / Christmas", "Just because"], ageRange: [4, 12], where: "Local kitchen shops or search for kids baking kits online" },
  { name: "Interactive world map or globe", price: 30, type: "Physical gift", tags: ["educational", "curious", "travel", "nerdy"], occasions: ["Birthday", "Holiday / Christmas"], ageRange: [4, 12], where: "Local bookshops or toy stores, or search for kids interactive globes" },
  { name: "Building blocks or construction set (LEGO, Magna-Tiles)", price: 35, type: "Physical gift", tags: ["creative", "hands-on", "curious", "engineering"], occasions: ["Birthday", "Holiday / Christmas"], ageRange: [3, 12], where: "Local toy shops or search for age-appropriate building sets" },
  { name: "Children's art easel and paint set", price: 30, type: "Physical gift", tags: ["artsy", "creative", "hands-on", "imaginative"], occasions: ["Birthday", "Holiday / Christmas", "Just because"], ageRange: [3, 10], where: "Local art or toy shops, or search for kids easels online" },
  { name: "Zoo, aquarium, or museum family pass", price: 40, type: "Experience", tags: ["curious", "nature", "educational", "fun", "family"], occasions: ["Birthday", "Holiday / Christmas", "Just because"], ageRange: [2, 14], where: "Search for family passes at local zoos, aquariums, or museums in their city" },
  { name: "Kids gardening kit with seeds and tools", price: 20, type: "Physical gift", tags: ["nature", "gardening", "outdoorsy", "hands-on", "science"], occasions: ["Birthday", "Holiday / Christmas", "Just because"], ageRange: [3, 10], where: "Local garden centres or search for children's gardening sets" },

  // ── Teens (13–17) ──────────────────────────────────────────────
  { name: "Instant camera (Fujifilm Instax Mini)", price: 55, type: "Physical gift", tags: ["photography", "creative", "social", "fun", "trendy"], occasions: ["Birthday", "Graduation", "Holiday / Christmas"], ageRange: [10, 20], where: "Local electronics shops or search for Instax Mini cameras" },
  { name: "Custom phone case with their artwork or photo", price: 20, type: "Local craft", tags: ["tech", "creative", "stylish", "fun"], occasions: ["Birthday", "Holiday / Christmas", "Just because"], ageRange: [10, 25], where: "Search for custom phone case makers online or at local print shops" },
  { name: "LED strip lights or room decor kit", price: 20, type: "Physical gift", tags: ["tech", "creative", "aesthetic", "fun", "trendy"], occasions: ["Birthday", "Holiday / Christmas", "Just because"], ageRange: [10, 20], where: "Local electronics or home decor stores" },
  { name: "Journaling or bullet journal starter kit", price: 22, type: "Physical gift", tags: ["creative", "mindful", "artsy", "organised"], occasions: ["Birthday", "Holiday / Christmas", "Just because"], ageRange: [11, 22], where: "Local stationery shops or search for bullet journal kits" },
];

/**
 * Score and recommend gifts based on form inputs.
 * Returns data in the same format as the API response.
 */
// Keywords in the "extra" field that signal preferences
const EXTRA_SIGNALS = {
  // Boost solo/calm gifts, penalize social/group
  anxiety:      { boost: ['introverted', 'mindful', 'cozy', 'creative', 'self-care', 'calm'], avoid: ['social', 'active', 'adventurous'] },
  introvert:    { boost: ['introverted', 'mindful', 'cozy', 'bookish', 'creative'], avoid: ['social'] },
  shy:          { boost: ['introverted', 'mindful', 'cozy', 'creative'], avoid: ['social', 'active'] },
  'social anxiety': { boost: ['introverted', 'mindful', 'cozy', 'self-care', 'calm', 'creative'], avoid: ['social', 'active', 'adventurous'] },
  homebody:     { boost: ['homebody', 'cozy', 'introverted', 'cooking', 'creative'], avoid: ['outdoorsy', 'active', 'adventurous'] },
  outdoor:      { boost: ['outdoorsy', 'nature', 'active', 'adventurous'], avoid: ['homebody'] },
  clutter:      { boost: ['minimalist', 'mindful'], avoid: ['collector', 'vintage'] },
  minimalist:   { boost: ['minimalist', 'practical'], avoid: ['collector', 'vintage', 'crafty'] },
  vegan:        { boost: ['healthy', 'nature', 'botanical'], avoid: ['cooking', 'foodie'] },
  pregnant:     { boost: ['self-care', 'cozy', 'mindful', 'relaxed'], avoid: ['active', 'spirits', 'beer', 'wine'] },
  dog:          { boost: ['dog', 'pet', 'outdoorsy', 'nature'], avoid: [] },
  cat:          { boost: ['cat', 'pet', 'cozy', 'introverted'], avoid: [] },
  stressed:     { boost: ['self-care', 'mindful', 'relaxed', 'calm', 'cozy'], avoid: [] },
  depressed:    { boost: ['self-care', 'mindful', 'cozy', 'creative', 'nature'], avoid: ['social'] },
  disability:   { boost: ['creative', 'cozy', 'mindful', 'bookish'], avoid: ['active', 'outdoorsy', 'sporty'] },
  moved:        { boost: ['homebody', 'cozy', 'practical', 'sentimental'], avoid: [] },
  broke:        { boost: ['practical'], avoid: [] },
  kids:         { boost: ['family', 'practical'], avoid: [] },
  ceramics:     { boost: ['creative', 'artsy', 'crafty', 'hands-on'], avoid: [] },
  cooking:      { boost: ['foodie', 'cooking', 'hands-on'], avoid: [] },
  fitness:      { boost: ['active', 'sporty', 'wellness', 'outdoorsy'], avoid: [] },
  reading:      { boost: ['bookish', 'reader', 'introverted'], avoid: [] },
};

function parseExtraSignals(extra) {
  if (!extra) return { boostTags: [], avoidTags: [] };
  const text = extra.toLowerCase();
  const boostTags = new Set();
  const avoidTags = new Set();

  // Check multi-word phrases first, then single words
  const sortedKeys = Object.keys(EXTRA_SIGNALS).sort((a, b) => b.length - a.length);
  for (const keyword of sortedKeys) {
    if (text.includes(keyword)) {
      EXTRA_SIGNALS[keyword].boost.forEach(t => boostTags.add(t));
      EXTRA_SIGNALS[keyword].avoid.forEach(t => avoidTags.add(t));
    }
  }
  return { boostTags: [...boostTags], avoidTags: [...avoidTags] };
}

export function getLocalRecommendations({ occasion, age, relationship, personality, budget, location, extra }) {
  const ageNum = parseInt(age) || 30;
  const personalityWords = personality.toLowerCase().split(/[,\s]+/).filter(Boolean);
  const budgetRange = parseBudget(budget);
  const { boostTags, avoidTags } = parseExtraSignals(extra);

  // Add randomness on regenerate to get different results
  const seed = window._giftLocalSeed || 0;

  const scored = GIFT_DB.map((gift, i) => {
    let score = 0;

    // Add deterministic randomness based on seed
    if (seed > 0) {
      score += ((i * 7 + seed * 13) % 5) - 2;
    }

    // Age — hard filter: skip gifts outside age range
    if (ageNum < gift.ageRange[0] || ageNum > gift.ageRange[1]) {
      return { ...gift, score: -100 };
    }

    // Occasion match
    if (gift.occasions.some(o => o.toLowerCase() === occasion.toLowerCase())) score += 3;

    // Personality tag match (strongest signal)
    const tagMatches = personalityWords.filter(word =>
      gift.tags.some(tag => tag.includes(word) || word.includes(tag))
    ).length;
    score += tagMatches * 4;

    // Extra context: boost matching tags
    const extraBoostMatches = boostTags.filter(bt =>
      gift.tags.some(tag => tag.includes(bt) || bt.includes(tag))
    ).length;
    score += extraBoostMatches * 3;

    // Extra context: penalize avoided tags
    const extraAvoidMatches = avoidTags.filter(at =>
      gift.tags.some(tag => tag.includes(at) || at.includes(tag))
    ).length;
    score -= extraAvoidMatches * 4;

    // Budget fit — hard filter: skip gifts way over budget
    if (budgetRange.max && gift.price > budgetRange.max * 1.5) {
      return { ...gift, score: -100 };
    }
    if (budgetRange.max && gift.price <= budgetRange.max) score += 3;
    if (budgetRange.min && gift.price >= budgetRange.min) score += 2;
    // Slight penalty for being over max but within 1.5x tolerance
    if (budgetRange.max && gift.price > budgetRange.max) score -= 3;

    // Small randomness for variety
    score += Math.random() * 1.5;

    return { ...gift, score };
  });

  // Remove gifts that are hard-filtered out
  const filtered = scored.filter(g => g.score > -100);

  // Sort by score descending
  filtered.sort((a, b) => b.score - a.score);

  // Pick 10 ensuring type diversity: at least 2 Experience, 2 Local craft, spread across categories
  const selected = selectDiverse(filtered, 10);

  // Format like API response
  const cityName = location.split(',')[0].trim();
  const currencySymbol = guessCurrency(budget, location);

  // Scale prices to fit within the user's budget range
  // Gift DB prices are in approximate USD — scale to user's actual range
  const userMid = ((budgetRange.min || 0) + (budgetRange.max || 100)) / 2;
  const dbMid = 45; // rough median of gift DB prices

  return {
    city_line: `Here are thoughtful gift ideas for someone special in ${cityName} — a mix of experiences, handmade finds, and things that feel personal.`,
    gifts: selected.map(gift => {
      // Scale price to user's budget range
      let scaledPrice = Math.round(gift.price * (userMid / dbMid));
      // Clamp within budget range
      if (budgetRange.min && scaledPrice < budgetRange.min) scaledPrice = budgetRange.min;
      if (budgetRange.max && scaledPrice > budgetRange.max) scaledPrice = budgetRange.max;
      // Vary slightly so not all same price
      const variance = Math.round(scaledPrice * (0.85 + Math.random() * 0.3));
      const finalPrice = Math.max(1, variance);

      return {
        name: gift.name,
        price: `${currencySymbol}${finalPrice}`,
        type: gift.type,
        why: buildWhyText(gift, personalityWords, occasion, relationship, boostTags),
        where: gift.where
      };
    }),
    star_pick: buildStarPick(selected[0], personalityWords, cityName, occasion)
  };
}

function selectDiverse(scored, count) {
  const result = [];
  const typeCounts = {};
  const maxPerType = Math.ceil(count / 3);

  // Guarantee at least 2 Experiences and 2 Local crafts
  const guaranteed = ['Experience', 'Experience', 'Local craft', 'Local craft'];
  for (const type of guaranteed) {
    const pick = scored.find(g => g.type === type && !result.includes(g));
    if (pick) {
      result.push(pick);
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    }
  }

  // Fill remaining with highest scored, capping each type
  for (const gift of scored) {
    if (result.length >= count) break;
    if (result.includes(gift)) continue;
    const tc = typeCounts[gift.type] || 0;
    if (tc >= maxPerType) continue;
    result.push(gift);
    typeCounts[gift.type] = tc + 1;
  }

  return result.slice(0, count);
}

function buildWhyText(gift, personalityWords, occasion, relationship, boostTags) {
  const matchedTraits = personalityWords.filter(word =>
    gift.tags.some(tag => tag.includes(word) || word.includes(tag))
  );
  const matchedBoosts = (boostTags || []).filter(bt =>
    gift.tags.some(tag => tag.includes(bt) || bt.includes(tag))
  );

  // Gift-specific descriptions based on type
  const typeReasons = {
    'Experience': [
      `This creates a memory, not more clutter`,
      `Experiences stick with people longer than things do`,
      `Something to look forward to and talk about after`,
    ],
    'Local craft': [
      `Handmade things carry a story that factory goods never will`,
      `Supporting a local maker adds meaning to the gift`,
      `There's something special about owning a one-of-a-kind piece`,
    ],
    'Physical gift': [
      `Something they'll actually reach for and use regularly`,
      `Practical but with a personal touch that elevates it`,
      `The kind of thing people love but rarely buy for themselves`,
    ],
    'Food & drink': [
      `Food is personal — it's about sharing a taste of something special`,
      `A delicious way to explore flavours they wouldn't pick themselves`,
      `Nothing brings people together quite like good food`,
    ],
    'Subscription': [
      `The gift that keeps arriving — a little joy every month`,
      `Spreads the excitement over weeks instead of one moment`,
      `Each delivery is a fresh surprise`,
    ],
  };

  // Pick a reason based on gift name hash to vary it
  const hash = gift.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const typeReasonsArr = typeReasons[gift.type] || typeReasons['Physical gift'];
  const typeReason = typeReasonsArr[hash % typeReasonsArr.length];

  let traitStr;
  if (matchedTraits.length > 0) {
    traitStr = `Perfect for someone who's ${matchedTraits.join(' and ')}. ${typeReason}`;
  } else if (matchedBoosts.length > 0) {
    const boostDescriptions = {
      introverted: 'enjoys their own space', mindful: 'values mindfulness', cozy: 'loves cozy comforts',
      'self-care': 'deserves some self-care', calm: 'appreciates calm moments', creative: 'has a creative side',
      homebody: 'loves being at home', sentimental: 'values meaningful gestures', practical: 'appreciates practical things'
    };
    const desc = matchedBoosts.map(b => boostDescriptions[b] || b).slice(0, 2).join(' and ');
    traitStr = `Great for someone who ${desc}. ${typeReason}`;
  } else {
    traitStr = typeReason;
  }

  const occasionPhrases = {
    'Birthday': 'Makes a birthday feel truly personal',
    'Anniversary': 'A meaningful way to mark the milestone',
    'Wedding': 'Stands out from the usual wedding gift pile',
    'Baby shower': 'Something the parents will genuinely appreciate',
    'New baby': 'Useful and sweet for the newest arrival',
    'First birthday': 'A lovely way to celebrate their very first year',
    'Holiday / Christmas': 'Feels festive without being generic',
    'Valentine\'s Day': 'Romantic without being cliché',
    'Mother\'s Day': 'Shows you really know her',
    'Father\'s Day': 'Beyond the usual socks and ties',
    'Graduation': 'Marks the start of something new',
    'Retirement': 'Celebrates the freedom ahead',
    'Housewarming': 'Helps make the new place feel like home',
    'Thank you': 'Goes beyond a simple thank-you card',
    'Just because': 'The best gifts are the unexpected ones',
  };

  const occasionStr = occasionPhrases[occasion] || '';
  return occasionStr ? `${traitStr}. ${occasionStr}.` : `${traitStr}.`;
}

function buildStarPick(gift, personalityWords, cityName, occasion) {
  if (!gift) return '';
  return `${gift.name} — because it connects who they are with something genuinely thoughtful for ${occasion ? 'their ' + occasion.toLowerCase() : 'the occasion'}.`;
}

function parseBudget(budget) {
  const numbers = budget.replace(/[^0-9.\-–—]/g, ' ').split(/[\s\-–—]+/).filter(Boolean).map(Number);
  if (numbers.length >= 2) return { min: numbers[0], max: numbers[1] };
  if (numbers.length === 1) return { min: numbers[0] * 0.5, max: numbers[0] * 1.2 };
  return { min: 0, max: 100 };
}

function guessCurrency(budget, location) {
  // Check budget string first for explicit currency
  if (/[£]/.test(budget)) return '£';
  if (/[€]/.test(budget)) return '€';
  if (/[¥]/.test(budget)) return '¥';
  if (/[₹]/.test(budget)) return '₹';
  if (/[R]/.test(budget) && /south\s*africa/i.test(location)) return 'R';
  if (/[$]/.test(budget)) return '$';

  // Guess from location
  const loc = location.toLowerCase();
  if (/uk|england|scotland|wales|britain|london/i.test(loc)) return '£';
  if (/europe|france|germany|spain|italy|portugal|netherlands|belgium|ireland|austria|greece/i.test(loc)) return '€';
  if (/japan/i.test(loc)) return '¥';
  if (/india/i.test(loc)) return '₹';
  return '$';
}
