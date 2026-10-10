import { Product } from "../types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    title: "Aura Premium Wireless Headphones",
    description: "Experience absolute acoustic bliss with our flagship active noise-canceling headphones. Featuring 40h battery life, plush memory foam ear cups, and high-fidelity 40mm dynamic drivers for rich bass and crystal-clear trebles.",
    price: 299,
    discountPrice: 249,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 12,
    category: "Electronics",
    isFeatured: true
  },
  {
    id: "prod-2",
    title: "Vanguard Classic Chronograph",
    description: "A timeless masterpiece engineered for precision. Surgical-grade stainless steel casing, premium full-grain Italian leather strap, and clean Japanese quartz movement. Water-resistant up to 50 meters.",
    price: 189,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 7,
    category: "Accessories",
    isFeatured: true
  },
  {
    id: "prod-3",
    title: "Apex Minimalist Leather Backpack",
    description: "The ultimate daily companion for professionals and explorers alike. Made from water-resistant top-grain leather, featuring a padded 16\" laptop sleeve, secret passport pocket, and premium YKK zippers.",
    price: 145,
    discountPrice: 120,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 15,
    category: "Accessories",
    isFeatured: true
  },
  {
    id: "prod-4",
    title: "Nordic Minimalist Oak Office Desk",
    description: "Crafted from sustainably sourced solid oak and industrial powder-coated metal legs. Integrates a hidden magnetic cable organizer and a seamless single drawer to keep your creative workspace absolutely pristine.",
    price: 450,
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 5,
    category: "Home & Living",
    isFeatured: false
  },
  {
    id: "prod-5",
    title: "Artisanal Ceramic Coffee Mug",
    description: "Hand-thrown ceramic mug finished in a gorgeous volcanic speckled reactive glaze. Each piece is entirely unique, microwave and dishwasher safe, holding up to 14oz of matching specialty coffee.",
    price: 28,
    discountPrice: 22,
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 45,
    category: "Home & Living",
    isFeatured: true
  },
  {
    id: "prod-6",
    title: "Apex Carbon Mechanical Keyboard",
    description: "Sleek, low-profile tenkeyless mechanical keyboard featuring hot-swappable tactile brown switches, aircraft-grade sandblasted aluminum plate, vibrant customizable amber backlighting, and dual USB-C/Bluetooth connectivity.",
    price: 160,
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33faf9c1?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 8,
    category: "Electronics",
    isFeatured: false
  },
  {
    id: "prod-7",
    title: "Organic Cotton Fitted Crewneck Tee",
    description: "Spun from 100% fine-gauge GOTS-certified organic cotton. Breathable, hypoallergenic, pre-shrunk, and tailormade in small batches. A cornerstone minimal basic that feels incredibly comfortable all year round.",
    price: 35,
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 30,
    category: "Fashion",
    isFeatured: false
  },
  {
    id: "prod-8",
    title: "Vibe Premium Ergo Office Chair",
    description: "Expertly contoured with breathable elastomeric mesh, featuring complete height-adjustable lumbar support, 3D armrests, dynamic recline tension, and premium silent-glide caster wheels to lock in ergonomics.",
    price: 380,
    discountPrice: 320,
    images: [
      "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 4,
    category: "Home & Living",
    isFeatured: false
  }
];
