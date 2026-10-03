/**
 * Centralized Configuration and Content Architecture for OM Advertising.
 * Authoritative single source of truth for business data, navigation, services, portfolio, and copy.
 */

export interface ServiceItem {
  id: string;
  title: string;
  category: 'signage' | 'space-branding' | 'printing' | 'promotional';
  description: string;
  features: string[];
  image: string;
  badge?: string;
  popular?: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Signage' | 'Space Branding' | 'Printing' | 'Promotional';
  description: string;
  image: string;
  badge?: string;
  highlight?: boolean;
}

export const siteConfig = {
  brand: {
    name: 'OM Advertising',
    location: 'Chomu, Jaipur',
    tagline: 'Make Your Brand Impossible to Miss.',
    subTagline: 'Signage. Printing. Complete Brand Visibility.',
    mission:
      'Transforming physical spaces into iconic commercial brands through precision 3D signage, architectural ACP cladding, and high-definition digital printing.',
    logo: '/images/om-logo.jpg',
    facilityImage: '/images/om-facility.jpg',
    establishedNote: 'Renwal Road, Chomu Facility',
  },

  contact: {
    businessName: 'OM Advertising',
    address: 'Near Power House, Renwal Road, Chomu, Jaipur',
    phone1: {
      display: '+91 97998 52206',
      raw: '9799852206',
      name: 'Banti Kumawat',
      role: 'Owner',
    },
    phone2: {
      display: '+91 98295 37889',
      raw: '9829537889',
      name: 'Mukesh Kumawat',
      role: 'Contact',
    },
    email: 'omadvertisingchomu@gmail.com',
    whatsappNumber: '9799852206',
    whatsappLink: 'https://wa.me/919799852206?text=Hi%20OM%20Advertising%2C%20I%20would%20like%20to%20inquire%20about%20your%20signage%20and%20branding%20services.',
    googleMapsSearchUrl: 'https://maps.google.com/?q=Near+Power+House,+Renwal+Road,+Chomu,+Jaipur',
    workingHours: 'Contact us to arrange a visit',
  },

  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Our Work', href: '/work' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],

  categories: [
    {
      id: 'signage',
      name: 'Illuminated & 3D Signage',
      shortName: 'Signage',
      tagline: 'High-Impact Storefront Presence',
      description:
        'Dimensional acrylic letters, illuminated boards, and retro-reflective signs that give your business a visible identity.',
      image: '/images/products/acrylic-3d-ampersand.jpg',
      badge: 'Core Specialty',
      count: 'Signage',
    },
    {
      id: 'space-branding',
      name: 'Space Branding & Cladding',
      shortName: 'Space Branding',
      tagline: 'Architectural Storefront Transformation',
      description:
        'Bring your exterior and interior together with ACP cladding, PVC panels, and glass branding.',
      image: '/images/products/sunshine-city-arch.png',
      badge: 'Turnkey Solutions',
      count: 'Space Branding',
    },
    {
      id: 'printing',
      name: 'Large Format & Digital Printing',
      shortName: 'Printing',
      tagline: 'Vibrant, Weather-Resistant Media',
      description:
        'Eco-solvent, flex, vinyl, one-way-vision and digital printing for your space and promotional messages.',
      image: '/images/products/mor-mukut-storefront.jpg',
      badge: 'In-House Production',
      count: 'Printing',
    },
    {
      id: 'promotional',
      name: 'Business & Promotional Collateral',
      shortName: 'Promotional',
      tagline: 'Everyday Marketing & Stationery',
      description:
        'Premium visiting cards, corporate brochures, roll-up standees, laminated stickers, and promotional leaflets crafted to make lasting first impressions.',
      image: '/images/products/shri-ji-nivas.jpg',
      badge: 'Brand Essentials',
      count: 'Promotional',
    },
  ],

  coreServices: [
    {
      id: 'acrylic-3d-letters',
      title: 'Acrylic 3D Letter Sign Boards',
      category: 'signage',
      description:
        'Dimensional acrylic lettering for storefronts, interiors and business identities, with illuminated finishes to suit your space.',
      features: ['Dimensional lettering', 'Illuminated options', 'Custom brand typography', 'Finish choices'],
      image: '/images/products/acrylic-3d-ampersand.jpg',
      badge: 'Most Popular',
      popular: true,
    },
    {
      id: 'led-sign-boards',
      title: 'Storefront LED & Glow Sign Boards',
      category: 'signage',
      description:
        'Illuminated signboards and lettering that make your business visible from the street and give its entrance a distinct identity.',
      features: ['Illuminated name boards', 'Custom layouts', 'Storefront applications', 'Day and night presence'],
      image: '/images/products/mor-mukut-storefront.jpg',
      badge: 'High Visibility',
      popular: true,
    },
    {
      id: 'acp-cladding',
      title: 'Architectural ACP Facade Cladding',
      category: 'space-branding',
      description:
        'Aluminium composite panel cladding gives facades and entrance portals a coordinated, considered finish.',
      features: ['Facade finishes', 'Panel detailing', 'Entrance surrounds', 'Signage integration'],
      image: '/images/products/sunshine-city-arch.png',
      badge: 'Facade Elevation',
      popular: true,
    },
    {
      id: 'pvc-panel-interiors',
      title: 'Architectural Louvers & Space Branding',
      category: 'space-branding',
      description:
        'PVC panels and decorative louvers introduce texture and rhythm to interior and exterior branding surfaces.',
      features: ['Feature walls', 'Decorative paneling', 'Texture and colour options', 'Interior and exterior applications'],
      image: '/images/products/shri-ji-nivas.jpg',
      badge: 'Luxury Finish',
    },
    {
      id: 'commercial-entrance-portals',
      title: 'Commercial Gate & Entrance Portals',
      category: 'space-branding',
      description:
        'Cladding and signage treatments for entrance portals, using coordinated panels, name lettering and illumination.',
      features: ['Entrance cladding', 'Name lettering', 'Signage illumination', 'Coordinated graphics'],
      image: '/images/products/ashoka-enclave-arch.png',
      badge: 'Architectural Portal',
    },
    {
      id: 'eco-solvent-printing',
      title: 'Eco-Solvent & Flex Printing',
      category: 'printing',
      description:
        'Large-format flex, vinyl and eco-solvent prints for storefront campaigns, window graphics, banners and promotional displays.',
      features: ['Flex banners', 'Vinyl graphics', 'One-way-vision prints', 'Promotional displays'],
      image: '/images/products/mor-mukut-storefront.jpg',
      badge: 'Heavy Duty',
    },
    {
      id: 'digital-press-stationery',
      title: '12×18 Digital Color & Stationery',
      category: 'promotional',
      description:
        'Visiting cards, brochures, leaflets, stickers and digital printing that carry your identity into everyday business.',
      features: ['Visiting cards', 'Brochures and leaflets', 'Stickers', '12×18 digital printing'],
      image: '/images/om-facility.jpg',
      badge: 'Fast Turnaround',
    },
    { id: 'retro-reflective-signs', title: 'Retro-reflective Signs', category: 'signage', description: 'Reflective directional and information boards help people identify entrances and find their way.', features: ['Directional signs', 'Information boards', 'Reflective finish', 'Custom graphics'], image: '/images/products/mor-mukut-storefront.jpg', badge: 'Wayfinding' },
  ] as ServiceItem[],

  transformation: {
    headline: 'From an Empty Space to an Unforgettable Brand.',
    subheading: 'Architectural Storefront Elevation',
    description:
      'See how OM Advertising transforms raw, unfinished concrete structures into stunning, brightly illuminated retail landmarks with custom ACP cladding, CNC jali accents, and 3D glowing letters.',
    beforeImage: '/images/transformation-before.jpg',
    beforeLabel: 'Raw Unfinished Structure',
    afterImage: '/images/transformation-after-v2.jpg',
    afterLabel: 'Completed Storefront with ACP & 3D Letters',
    metrics: [
      { label: '3D Acrylic Letters', desc: 'Dimensional lettering with illumination' },
      { label: 'Metallic ACP Facade', desc: 'Weatherproof architectural composite paneling' },
      { label: 'Warm Spot Downlights', desc: 'Even ambient lighting for evening footfall' },
    ],
    ctaText: 'Transform My Space',
  },

  whyUs: [
    {
      number: '01',
      title: 'Designed to Stand Out',
      description:
        'Every sign board, cladding concept, and graphic wrap is tailored to maximize visual attraction from street traffic and footfall.',
      iconName: 'Sparkles',
    },
    {
      number: '02',
      title: 'Quality Materials',
      description:
        'We help select materials and finishes appropriate to your signage, printed graphics, and branded surfaces.',
      iconName: 'ShieldCheck',
    },
    {
      number: '03',
      title: 'Complete Branding Under One Roof',
      description:
        'Signage, cladding, graphics and printed collateral come together through one branding partner.',
      iconName: 'Layers',
    },
    {
      number: '04',
      title: 'Timely Delivery',
      description:
        'We plan production and installation around the requirements and schedule discussed for your project.',
      iconName: 'Clock',
    },
  ],

  portfolio: [
    {
      id: 'p-1',
      title: 'Shri Mor Mukut Commercial Storefront',
      category: 'Signage',
      description: 'Back-lit golden 3D acrylic channel letters, circular illuminated peacock logo emblem, and full ACP facade cladding.',
      image: '/images/products/mor-mukut-storefront.jpg',
      badge: 'Storefront Elevation',
      highlight: true,
    },
    {
      id: 'p-2',
      title: 'Titanium Gold 3D Illuminated Lettering',
      category: 'Signage',
      description: 'Sculptural titanium gold ampersand channel letter with warm perforated edge halo LED illumination.',
      image: '/images/products/acrylic-3d-ampersand.jpg',
      badge: 'Precision Craftsmanship',
      highlight: true,
    },
    {
      id: 'p-3',
      title: 'Sunshine City Gated Community Archway',
      category: 'Space Branding',
      description: 'Large-scale modern entrance archway with bronze & charcoal ACP cladding, green living walls, and 3D letters.',
      image: '/images/products/sunshine-city-arch.png',
      badge: 'Architectural Elevation',
      highlight: true,
    },
    {
      id: 'p-4',
      title: 'Shri Ji Nivas Architectural Villa Signage',
      category: 'Space Branding',
      description: 'Warm back-lit golden 3D lettering mounted on luxury architectural compound wall with composite panelling.',
      image: '/images/products/shri-ji-nivas.jpg',
      badge: 'Luxury Residential',
      highlight: true,
    },
    {
      id: 'p-5',
      title: 'Ashoka Enclave Teak & Charcoal ACP Gateway',
      category: 'Space Branding',
      description: 'Architectural entrance portal fabricated with teak woodgrain and charcoal metallic aluminium composite panels.',
      image: '/images/products/ashoka-enclave-arch.png',
      badge: 'Commercial Gateway',
    },
    {
      id: 'p-6',
      title: 'OM Advertising — Chomu Facility',
      category: 'Space Branding',
      description: 'The OM Advertising facility on Renwal Road, Chomu.',
      image: '/images/om-facility.jpg',
      badge: 'Chomu Facility',
    },
  ] as PortfolioItem[],

  process: [
    {
      step: '01',
      title: 'Tell Us What You Need',
      description:
        'Share your business type, site photos, approximate dimensions, and branding goals over a quick call or WhatsApp message.',
      highlight: 'Site Analysis & Brief',
    },
    {
      step: '02',
      title: 'We Design',
      description:
        'We work through the layout, graphics and finish direction for your business identity.',
      highlight: 'Visual Elevation Mockup',
    },
    {
      step: '03',
      title: 'We Make It',
      description:
        'We fabricate signage and produce the printed and branded elements agreed for your space.',
      highlight: 'Precision Fabrication',
    },
    {
      step: '04',
      title: 'We Deliver & Install',
      description:
        'We coordinate delivery and installation for the agreed signage and branding work.',
      highlight: 'Professional Fitting',
    },
  ],

  seo: {
    siteUrl: 'https://om-advertising-spaces.sandy-sky-7913.chatgpt.site',
    defaultTitle: 'OM Advertising | Signage, Printing & Space Branding in Chomu, Jaipur',
    titleTemplate: '%s | OM Advertising Chomu',
    description:
      'Make your brand impossible to miss. OM Advertising is your all-in-one physical branding partner in Chomu, Jaipur: Acrylic 3D Letters, LED Glow Boards, ACP Cladding, PVC Panels, and Large Format Printing.',
    keywords: [
      'OM Advertising',
      'Signage in Chomu',
      'LED sign board Jaipur',
      'Acrylic 3D letters Chomu',
      'ACP cladding contractor Chomu Jaipur',
      'Flex printing Chomu',
      'Eco solvent printing Jaipur',
      'Storefront branding Jaipur',
      'PVC panel interior Chomu',
      'Retro reflective boards',
    ],
  },
};

export const showroomConfig = {
  eyebrow: 'SPACES THAT SPEAK', concept: 'Illustrative customer space',
  intro: 'A name. A space. An unmistakable presence.', scroll: 'Scroll to step inside',
  skip: 'Explore services', staticLabel: 'Still view', motionLabel: 'Explore in 3D',
  quote: 'Get a Quote', explore: 'Explore Our Work', serviceCta: 'Make it yours', chapterLabel: 'Explore the space',
  // Offline design study. These are source assets, not approved runtime media.
  renderStudy: {
    directory: 'assets/showroom/review',
    plant: { path: 'assets/showroom/source/plant/plant.gltf', source: 'https://polyhaven.com/a/potted_plant_01', license: 'CC0', role: 'Illustrative retail context' },
    environment: { path: 'assets/showroom/source/environment.hdr', source: 'https://polyhaven.com/a/blue_photo_studio', license: 'CC0', role: 'Temporary material-lighting study; replace studio reflections with an exterior environment before release' },
    shots: [
      {name:'exterior',position:[11,3.7,18],target:[-2,2.4,-1],lens:35},
      {name:'entrance',position:[-2,2.4,6],target:[0,2,-2],lens:25},
      {name:'interior',position:[2.6,1.8,-3.8],target:[0,2,-8],lens:25},
      {name:'closing',position:[-4.2,2.4,-6.2],target:[.2,2.3,.5],lens:25},
    ],
  },
  scene: {
    font: '/fonts/helvetiker_regular.typeface.json', brand: 'YOUR BRAND', subline: 'A SPACE TO MAKE YOUR OWN',
    windowLeft: 'THOUGHTFULLY MADE', windowRight: 'STEP INSIDE', direction:'ENTRANCE', interiorTitle: 'MAKE ROOM', interiorSubtitle: 'FOR SOMETHING EXTRAORDINARY',
    posterTop: 'THE NEW', posterMiddle: 'EDIT', posterBottom: 'DISCOVER MORE', fallback: '/images/showroom/customer-space.webp',
  },
  chapters: [
    { id:'arrival', start:0, label:'First impressions', eyebrow:'01 / THE FIRST IMPRESSION', title:'Make your brand\nimpossible to miss.', description:'Signage. Printing. Complete Brand Visibility.' },
    { id:'possibilities', start:.12, label:'Complete branding', eyebrow:'02 / ONE COMPLETE IDENTITY', title:'Your brand\ndeserves to be seen.', description:'From the name above your door to the details within. Every surface, working together.' },
    { id:'details', start:.23, label:'What we create', eyebrow:'03 / LOOK A LITTLE CLOSER', title:'Presence is\nin the details.', description:'Explore the elements that turn an ordinary storefront into a destination.' },
    { id:'transformation', start:.40, label:'The transformation', eyebrow:'04 / FROM SPACE TO BRAND', title:'The same space.\nA whole new presence.', description:'Cladding, dimensional lettering and light. See an identity take shape.' },
    { id:'craft', start:.54, label:'Step inside', eyebrow:'05 / BEYOND THE FACADE', title:'The impression\ncontinues inside.', description:'Your identity, carried through materials, walls, glass and carefully finished details.' },
    { id:'work', start:.67, label:'Work & inspiration', eyebrow:'06 / IDEAS MADE VISIBLE', title:'A world of\npossibilities.', description:'Explore supplied project and design references. Find a direction for your own space.' },
    { id:'process', start:.80, label:'How it happens', eyebrow:'07 / YOUR IDEA, TAKING SHAPE', title:'From the first thought\nto the final fitting.', description:'One conversation starts the transformation.' },
    { id:'invitation', start:.91, label:'Your space, next', eyebrow:'08 / YOUR SPACE IS NEXT', title:'Imagine this\nfor your business.', description:'Tell us about your space. Let’s make your brand impossible to miss.' },
  ],
  services: [
    { title:'Acrylic 3D Letters', id:'acrylic-3d-letters', detail:'Real depth. A distinct silhouette. Dimensional lettering gives your name a physical presence.', tag:'SIGNAGE', anchor:[0,4.8,.7] },
    { title:'LED Sign Boards', id:'led-sign-boards', detail:'Illuminated lettering and boards keep your business visible as daylight fades.', tag:'LIGHT & VISIBILITY', anchor:[2,4.6,.7] },
    { title:'ACP Cladding', id:'acp-cladding', detail:'A considered facade frames your business with clean lines, panel detailing and a coordinated finish.', tag:'SPACE BRANDING', anchor:[-5.5,4.6,.5] },
    { title:'PVC Panels', id:'pvc-panel-interiors', detail:'Texture and rhythm carry your identity into the space, from feature walls to decorative panels.', tag:'INTERIOR & EXTERIOR', anchor:[4.5,3,-9.5] },
    { title:'Flex & Vinyl Printing', id:'eco-solvent-printing', detail:'Promotional displays, window graphics and large-format prints make every message part of the space.', tag:'PRINTING', anchor:[3,2,-1.9] },
    { title:'Retro-reflective Signs', id:'retro-reflective-signs', detail:'Reflective directional and information signs help people find their way.', tag:'WAYFINDING', anchor:[4,1.5,.2] },
  ],
  camera: [
    {at:0,position:[10,5.1,22],target:[-2.6,2.3,0]}, {at:.12,position:[6.5,3.8,15],target:[-1.1,2.6,-.5]},
    {at:.23,position:[3.8,3.1,8],target:[0,3.9,0]}, {at:.32,position:[-2.8,3.5,5.3],target:[0,4.5,.25]},
    {at:.40,position:[-7,4.1,12.5],target:[0,2.6,0]}, {at:.49,position:[-2,2.4,6],target:[0,2,-2]},
    {at:.54,position:[-.25,1.75,1.3],target:[.3,1.9,-4]}, {at:.57,position:[0,1.7,.25],target:[1,1.8,-5]},
    {at:.60,position:[.15,1.7,-.7],target:[2.5,1.9,-6]}, {at:.67,position:[2.6,1.8,-3.8],target:[3.8,2,-7.5]},
    {at:.75,position:[4.2,1.9,-6.2],target:[0,1.6,-7.5]}, {at:.80,position:[1,1.9,-7.8],target:[-3.4,1.4,-6]},
    {at:.91,position:[-2.8,2,-6.5],target:[-1,2,-1]}, {at:1,position:[-4.2,2.4,-6.2],target:[.2,2.3,.5]},
  ] as import('@/lib/showroom/timeline').CameraPoint[],
};

export const experienceCopy = {
  all:'All', serviceQuote:'Discuss this service',
  navigation:{skip:'Skip to content',home:'OM Advertising home',main:'Main navigation',talk:'Let’s talk',open:'Open navigation',close:'Close navigation'},
  inspect:'Inspect the detail', materialReference:'Material & design reference',
  inspectionMedia: ['/images/products/acrylic-3d-ampersand.jpg','/images/products/mor-mukut-storefront.jpg','/images/products/sunshine-city-arch.png','/images/showroom/customer-space.webp','/images/references/WhatsApp Image 2026-09-02 at 13.57.51.jpeg','/images/references/WhatsApp Image 2026-09-02 at 13.56.58.jpeg'],
  categories: ['Signage','Space Branding','Printing','Business & Promotional'],
  categoryDescriptions: ['A name that commands attention.','A facade and interior that belong together.','Messages made part of the environment.','Your identity in the details people take with them.'],
  before:'Bare space', after:'Branded space', comparison:'Explore the transformation', comparisonNote:'Concept build-up · drag to compare',
  inspiration:'Project & design references', reference:'Supplied reference · attribution unconfirmed', concept:'Concept visualization',
  galleryAction:'View the collection', viewImage:'Open image', previous:'Previous image', next:'Next image', close:'Close',
  call:'Call Now', whatsapp:'WhatsApp Chat', email:'Email us', location:'Find the workshop',
  staticIntro:'Explore the space at your pace.', fallbackNote:'A concept of what your business could become. Explore the services and ideas below.',
  sceneLabel:'Customer showroom in 3D', fullService:'Complete Storefront Branding', chooseService:'Choose a service',
  form:{title:'Tell us about your space.',description:'Share a few details to start a conversation about your project.',name:'Your name / business',phone:'Phone number',service:'What do you have in mind?',dimensions:'Approximate dimensions',message:'Your ideas & requirements',namePlaceholder:'Your name or business',phonePlaceholder:'Your contact number',dimensionsPlaceholder:'For example, a 12 × 4 ft sign',messagePlaceholder:'Your space, preferred finish, location or timing…',submit:'Continue on WhatsApp',email:'Send by email',note:'Your brief opens in WhatsApp or your email app. You review and send it there.',subject:'Project enquiry — OM Advertising'},
  pages:{
    services:{eyebrow:'WHAT WE CREATE',title:'Every surface.\nOne identity.',description:'From your first impression on the street to the details inside. Explore signage, space branding, printing and promotional work.'},
    work:{eyebrow:'WORK & INSPIRATION',title:'See the\npossibilities.',description:'A collection of supplied signage, facade and design references. Illustrative concepts and references are labeled; ask us about a similar direction for your business.'},
    about:{eyebrow:'OM ADVERTISING · CHOMU, JAIPUR',title:'We give your\nbrand a place.',description:'Your identity deserves a physical presence. OM Advertising brings together signage, printing and space branding in Chomu, Jaipur.',story:'From your name above the door to the message on a window, we help bring the elements of a business identity together. Our work includes acrylic lettering, illuminated boards, ACP cladding, PVC panels and printed graphics.',facility:'Visit us in Chomu.',facilityCaption:'OM Advertising facility · supplied photograph',cta:'Let’s talk about your space'},
    contact:{eyebrow:'YOUR SPACE IS NEXT',title:'Let’s make\nsomething visible.',description:'A storefront, a sign, or a complete branding idea. Tell us what you have in mind.'},
  },
  footer:{line:'Your brand. Out in the world.',navigation:'Explore',contact:'Start a conversation',address:'Visit us',credit:'Signage. Printing. Complete Brand Visibility.',rights:'OM Advertising',return:'Back to the space'},
};

export const storefrontConfig = {
  // Scroll-controlled frames extracted from the supplied 14.9-second WebP.
  // See docs/hero-frame-sequence.md for replacement and tuning notes.
  frameSequence: {
    enabled: true,
    desktop: {
      directory: '/frames', prefix: 'frame_', extension: 'webp',
      firstFrame: 1, frameCount: 240, padding: 4,
    },
    mobile: null,
    poster: '/frames/frame_0001.webp',
    portraitPoster: '/frames/frame_0001.webp',
    // Tuned to support high-density sequences up to 30 FPS without scroll stutter
    preloadRadius: 18,
    concurrency: 6,
    maxCachedFrames: 60,
    desktopCacheBytes: 384 * 1024 * 1024,
    mobileCacheBytes: 128 * 1024 * 1024,
    maxCanvasPixels: 1920 * 1080,
    maxDpr: 1.5,
  } as import('@/lib/showroom/frame-sequence').FrameSequenceConfig,
  model:'/models/showroom/storefront.glb',
  decoder:'/draco/',
  poster:'/images/showroom/storefront-poster.webp',
  portraitPoster:'/images/showroom/storefront-portrait.webp',
  label:'An illustrative customer storefront',
  scroll:'Scroll to discover the detail',
  navigation:'Explore the storefront',
  still:'Still view', play:'Explore in 3D',
  transition:'From a first impression to a complete identity.',
  loading:'Preparing the live view · scroll to explore',
  serviceDetails:'About this service',
  headings:['Make your brand\nimpossible to miss.','One space.\nEvery detail, connected.','The details\nthat make the difference.'],
  descriptions:['Signage. Printing. Complete Brand Visibility.','Signage, surfaces and print. One complete identity.','Explore what goes into a finished storefront.'],
  chapterStarts:[0,1/3,2/3],
  camera:[
    {at:0,position:[10,3.7,18],target:[-2,2.4,-1]},
    {at:.18,position:[8,4.5,16],target:[-.7,3.7,.2]},
    {at:.38,position:[3.8,4.7,9],target:[0,3.85,.4]},
    {at:.55,position:[-.3,4.8,6.6],target:[.2,3.95,.4]},
    {at:.7,position:[-3.8,4.5,10.6],target:[0,4.2,.1]},
    {at:.86,position:[-6.8,4.3,16],target:[0,3.2,0]},
    {at:1,position:[-9,4.2,21],target:[.5,2.7,-.4]},
  ] as import('@/lib/showroom/timeline').CameraPoint[],
  quality:{
    compact:{maxDpr:1,maxPixels:1050000},
    balanced:{maxDpr:1.35,maxPixels:2300000},
    low:{maxDpr:.8,maxPixels:650000},
  },
  later:{
    transformation:{eyebrow:'04 / FROM SPACE TO BRAND',title:'A different kind\nof first impression.',description:'Explore how cladding, dimensional lettering and light can transform the character of a storefront.',note:'Illustrative transformation · supplied design reference',hint:'Drag to compare',cta:'Transform My Space'},
    craft:{indexLabel:'Explore our approach',referenceLabel:'Signage & material reference',principles:[{label:'Form & light',image:'/images/products/acrylic-3d-ampersand.jpg',alt:'Close-up of an illuminated dimensional ampersand',note:'Depth. Contrast. A little brilliance.'},{label:'Material & finish',image:'/images/products/mor-mukut-storefront.jpg',alt:'Illuminated lettering against a dark storefront facade',note:'The surface makes the difference.'},{label:'One connected approach',image:'/images/om-facility.jpg',alt:'OM Advertising facility in Chomu',note:'From the first idea to the final fit.'},{label:'Planning & installation',image:'/images/products/ashoka-enclave-arch.png',alt:'Entrance arch and installed dimensional lettering',note:'Every detail, through to handover.'}],eyebrow:'05 / THE MAKING MATTERS',title:'Seen from a distance.\nConsidered up close.',description:'The finish, the material, the fit. Each choice contributes to the impression your business makes.',image:'/images/products/acrylic-3d-ampersand.jpg',caption:'Material and signage design reference'},
    work:{eyebrow:'06 / WORK & INSPIRATION',title:'Find your\nkind of presence.',description:'Explore supplied signage, facade and design references.',cta:'Explore the full collection'},
    process:{eyebrow:'07 / HOW IT COMES TOGETHER',title:'Your idea.\nOur next conversation.',description:'Four steps from the first brief to the finished installation.',cta:'Tell us what you have in mind'},
    closing:{eyebrow:'08 / YOUR BUSINESS, NEXT',title:'Make your brand\nimpossible to miss.',description:'A sign. A storefront. A complete physical identity. Let’s talk about your space.'},
  },
};
