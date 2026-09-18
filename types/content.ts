export type ImageAspect = "4/3" | "3/4" | "3/2" | "1/1" | "16/9";
/** `focus` is an optional CSS object-position for crops, e.g. "50% 30%" to keep a face in a square. */
export interface ImageRef { url: string; alt: string; aspect?: ImageAspect; focus?: string; }
export interface CtaRef { label: string; link: string; }
export interface Seo { title: string; description: string; }

interface BlockBase {
  id: string;
  type: string;
  title?: string;
  subtitle?: string;
  content?: string;
  image?: ImageRef | null;
  cta?: CtaRef;
}

export interface HeroBlock extends BlockBase { type: "hero"; }
/** Editorial image + text row. `projects` lists related project slugs to link beneath the text. */
export interface ContentBlock extends BlockBase { type: "content"; projects?: string[]; }
export interface CardItem { title: string; description: string; link?: string; image?: ImageRef; }
export interface CardsBlock extends BlockBase { type: "cards"; items: CardItem[]; }
export interface ImpactItem { title: string; description: string; }
export interface ImpactBlock extends BlockBase { type: "impact"; items: ImpactItem[]; }
export interface TeamMember { name: string; role: string; bio: string; image: ImageRef; }
export interface TeamBlock extends BlockBase { type: "team"; items: TeamMember[]; }
/** `images`: two portrait photographs shown side by side beside the invitation. */
export interface CtaBlock extends BlockBase { type: "cta"; secondary?: CtaRef; images?: ImageRef[]; }
export interface ContactBlock extends BlockBase { type: "contact"; }
export interface ProjectsHeroBlock extends BlockBase { type: "projects-hero"; }
/** Strip of the most recent field projects, pulled from `projects` in the same data file. */
export interface ProjectsPreviewBlock extends BlockBase { type: "projects-preview"; count?: number; }
export interface StatementBlock extends BlockBase { type: "statement"; content: string; subtitle: string; }
export interface CommitmentBlock extends BlockBase { type: "commitment"; }
export interface EditorialBlock extends BlockBase { type: "editorial"; subtitle: string; content: string; title: string; }
export interface LuigiPanelBlock extends BlockBase { type: "luigi-panel"; content: string; subtitle: string; image: ImageRef; }
export interface TestimonialItem { quote: string; attribution: string; }
export interface TestimonialsBlock extends BlockBase { type: "testimonials"; items: TestimonialItem[]; }

export type Block =
  | HeroBlock
  | ContentBlock
  | CardsBlock
  | ImpactBlock
  | TeamBlock
  | CtaBlock
  | ContactBlock
  | ProjectsHeroBlock
  | ProjectsPreviewBlock
  | StatementBlock
  | CommitmentBlock
  | EditorialBlock
  | LuigiPanelBlock
  | TestimonialsBlock;

export interface Page { slug: string; title: string; seo: Seo; blocks: Block[]; }

/** Something a project needs that a gift can go towards. `estimate` marks a suggested amount the foundation has not yet confirmed. */
export interface GiftItem { id: string; title: string; description: string; amountUSD: number; estimate: boolean; plaque?: boolean; }
/** Progress the foundation has reported, in units: homes built of homes planned, say. */
export interface CauseProgress { done: number; total: number; unit: string; }
/** A project a gift can go to. The general fund has no `slug`, no page and no items. */
/** `itemsImage`: the photograph that stands beside the item ledger (the cause's own image when absent). */
export interface Cause { id: string; slug?: string; title: string; summary: string; image: ImageRef; itemsImage?: ImageRef; gallery?: ImageRef[]; link?: string; progress?: CauseProgress; items: GiftItem[]; }
/** `rates`: units per US dollar for any extra currency the account may charge; `presetsUSD`: suggested general gifts; `presets`: a currency's own list where round figures matter. */
export interface DonateData { rates: Record<string, number>; presetsUSD: number[]; presets?: Record<string, number[]>; causes: Cause[]; }

export interface SiteData { pages: Page[]; donate?: DonateData; }
