export interface ImageRef { url: string; alt: string; }
export interface CtaRef { label: string; link: string; }
export interface Seo { title: string; description: string; }

interface BlockBase { id: string; type: string; title?: string; subtitle?: string; content?: string; image?: ImageRef | null; cta?: CtaRef; }

export interface HeroBlock extends BlockBase { type: "hero"; }
export interface ContentBlock extends BlockBase { type: "content"; }
export interface CardItem { title: string; description: string; }
export interface CardsBlock extends BlockBase { type: "cards"; items: CardItem[]; }
export interface ImpactItem { title: string; description: string; }
export interface ImpactBlock extends BlockBase { type: "impact"; items: ImpactItem[]; }
export interface TeamMember { name: string; role: string; bio: string; image: ImageRef; }
export interface TeamBlock extends BlockBase { type: "team"; items: TeamMember[]; }
export interface CtaBlock extends BlockBase { type: "cta"; }
export interface ContactBlock extends BlockBase { type: "contact"; }
export interface ProjectsHeroBlock extends BlockBase { type: "projects-hero"; }
export interface CommitmentBlock extends BlockBase { type: "commitment"; }

export type Block = HeroBlock | ContentBlock | CardsBlock | ImpactBlock | TeamBlock | CtaBlock | ContactBlock | ProjectsHeroBlock | CommitmentBlock;
export interface Page { slug: string; title: string; seo: Seo; blocks: Block[]; }
export interface SiteData { pages: Page[]; }
