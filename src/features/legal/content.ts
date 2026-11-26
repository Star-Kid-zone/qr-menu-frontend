import { APP_NAME, TENANT_ROOT_DOMAIN } from "@/config/app.constants";

/*
 * Legal copy. It describes what the product does today: check the code before changing a claim
 * (what is collected, which providers are used) and bump LEGAL_UPDATED when the text changes.
 */

/** Shown at the top of both pages. Update when either document changes. */
export const LEGAL_UPDATED = "25 November 2026";

/** Where users send privacy requests and legal questions. */
export const LEGAL_CONTACT_EMAIL = `support@${TENANT_ROOT_DOMAIN}`;

export interface LegalSection {
  id: string;
  title: string;
  /** Paragraphs, rendered in order. */
  body?: string[];
  /** A bulleted list shown after the paragraphs. */
  list?: string[];
}

export interface LegalDocument {
  title: string;
  description: string;
  intro: string;
  sections: LegalSection[];
}

export const PRIVACY: LegalDocument = {
  title: "Privacy Policy",
  description: `How ${APP_NAME} collects, uses and protects personal information for restaurant owners, their team and their guests.`,
  intro: `${APP_NAME} gives restaurants a QR code, a menu, a website and a dashboard. This policy explains what personal information we handle, why, who sees it and what choices you have. It covers ${TENANT_ROOT_DOMAIN}, the dashboard, and the restaurant websites we host at your-restaurant.${TENANT_ROOT_DOMAIN}.`,
  sections: [
    {
      id: "who",
      title: "Who this policy is for",
      body: [
        `There are two groups of people. Restaurant owners and their team members have an account with us. Guests are people who scan a restaurant's QR code and open its menu or website.`,
        `For account information, ${APP_NAME} decides how the data is used. For information collected from guests on a restaurant's website, the restaurant decides why it is collected and we process it on the restaurant's behalf.`,
      ],
    },
    {
      id: "collect",
      title: "What we collect",
      body: ["From restaurant owners and team members:"],
      list: [
        "Account details: your name, email address and a password. Passwords are stored only as a salted hash.",
        "Sign-up and reset codes: one-time codes sent to your email, kept only until they expire.",
        "Restaurant content you add: business details, dishes, prices, photos, offers, opening hours, website text, QR codes and reviews you choose to show.",
        "Team information: staff names, roles, shifts and checklists you enter in the dashboard.",
        "Connected accounts: if you connect Google Business Profile, Facebook, Instagram, X or LinkedIn, we store the access tokens those services give us, encrypted, along with the profile and review data needed for the features you use.",
        "Technical data: IP address, browser and device type, and security logs of sign-in activity.",
      ],
    },
    {
      id: "guests",
      title: "What we collect from guests",
      body: [
        "Guests do not need an account and install nothing. When a guest opens a restaurant's menu or website we record basic usage so the restaurant can see how it is used:",
      ],
      list: [
        "A random visitor ID, a browser fingerprint, IP address and user agent.",
        "The pages viewed, buttons tapped (such as Pay bill or Review), dishes searched for and the time of each event.",
      ],
    },
    {
      id: "use",
      title: "How we use information",
      list: [
        "To run the service: create your account, host your menu and website, generate QR codes and send the codes and notices you request.",
        "To show restaurants their own usage statistics.",
        "To publish posts and answer reviews on the accounts you connect, only when you ask us to or turn on automatic replies.",
        "To read a photographed menu with AI so you can check the dishes it found.",
        "To keep the service secure, prevent abuse and fix problems.",
        "To meet legal obligations.",
      ],
      body: ["We do not sell personal information and we do not show third-party advertising."],
    },
    {
      id: "share",
      title: "Who we share it with",
      body: [
        "We use a small number of providers to run the service. They may process data only to provide their service to us:",
      ],
      list: [
        "Cloud hosting and file storage for the application, database and uploaded images and videos.",
        "An email delivery provider for sign-up codes and notices.",
        "AI providers, such as Google Gemini, which receive a menu photo you submit for scanning, and the text of a review when you ask for a suggested reply.",
        "Google, Meta, X and LinkedIn, only for accounts you connect and only to deliver the features you use.",
      ],
    },
    {
      id: "payments",
      title: "Payments",
      body: [
        `${APP_NAME} does not process payments or store card details. The Pay bill button opens the restaurant's own payment link or shows its payment QR code, and the payment is handled by that provider under its own terms and privacy policy.`,
      ],
    },
    {
      id: "access",
      title: "When we may see your account",
      body: [
        `Authorised ${APP_NAME} staff can view an account to give support, investigate abuse or keep the service running. Access is limited to what the task needs.`,
        "We may also disclose information when the law requires it, or to protect the rights and safety of our users and the service.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies and similar storage",
      body: ["We use only what the service needs to work:"],
      list: [
        "Sign-in cookies that keep you logged in and protect requests from forgery.",
        "Local browser storage for preferences such as light or dark theme.",
        "An anonymous visitor ID on restaurant websites for the usage statistics described above.",
      ],
    },
    {
      id: "retention",
      title: "How long we keep it",
      body: [
        "We keep account and restaurant data while your account is active. When you ask us to delete your account we remove your personal information and restaurant content, except what we must keep to meet legal duties or resolve disputes.",
        "Guest usage records are kept as long as the restaurant's account exists, because they make up the restaurant's history of statistics.",
      ],
    },
    {
      id: "security",
      title: "Security",
      body: [
        "We protect data with encrypted connections, hashed passwords, encrypted storage of connected-account tokens, and separation between restaurants so one cannot see another's data. No system is perfectly secure, so please use a strong, unique password and tell us if you suspect a problem.",
      ],
    },
    {
      id: "rights",
      title: "Your choices and rights",
      body: [
        "You can view and edit most of your information in the dashboard. You can also ask us to access, correct, export or delete your personal information, to withdraw consent, or to raise a complaint. Where Indian data protection law applies, including the Digital Personal Data Protection Act, 2023, you have the rights it gives you.",
        "You can disconnect Google, Facebook, Instagram, X or LinkedIn at any time from the dashboard. Guests who want their usage records removed can contact the restaurant, or us, and we will help.",
      ],
    },
    {
      id: "children",
      title: "Children",
      body: [
        `${APP_NAME} is for businesses. We do not knowingly collect personal information from children under 18 for accounts. If you believe a child has given us information, contact us and we will delete it.`,
      ],
    },
    {
      id: "transfers",
      title: "Where data is processed",
      body: [
        "Our providers may process data in countries other than your own. When they do, we rely on the safeguards they offer and on our agreements with them.",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      body: [
        "When we change this policy we update the date at the top. For significant changes we will also tell account holders by email or in the dashboard.",
      ],
    },
    {
      id: "contact",
      title: "Contact us",
      body: [`Write to ${LEGAL_CONTACT_EMAIL} for any privacy question or request.`],
    },
  ],
};

export const TERMS: LegalDocument = {
  title: "Terms and Conditions",
  description: `The terms for using ${APP_NAME}: accounts, restaurant content, acceptable use, third-party services and liability.`,
  intro: `These terms are an agreement between you and ${APP_NAME} for using ${TENANT_ROOT_DOMAIN}, the dashboard and the restaurant websites we host. By creating an account or using the service you agree to them. If you use ${APP_NAME} for a business, you confirm you can bind that business to these terms.`,
  sections: [
    {
      id: "service",
      title: "The service",
      body: [
        `${APP_NAME} lets a restaurant create a QR code, a menu, a website, review and social tools, and manage its team. We may improve, change or remove features over time. We will try to give notice of a change that significantly affects you.`,
      ],
    },
    {
      id: "account",
      title: "Your account",
      list: [
        "You must give accurate details and keep them up to date.",
        "You are responsible for your password and for everything done through your account, including by team members you add.",
        "Tell us promptly if you think someone else has access to your account.",
        "You must be at least 18 years old and able to enter a contract.",
      ],
    },
    {
      id: "content",
      title: "Your content",
      body: [
        "You own the menus, photos, text, logos and other content you upload. You give us a licence to store, display, copy and process it only as needed to run the service for you, including showing it to guests on your website.",
        "You promise that you have the right to use your content, and that it does not infringe anyone's rights or break the law. This includes food descriptions, prices, allergen, veg or non-veg and other information that guests rely on. Keeping that information accurate is your responsibility.",
      ],
    },
    {
      id: "use",
      title: "Acceptable use",
      body: ["You agree not to:"],
      list: [
        "Break the law or use the service for anything unlawful, misleading or harmful.",
        "Upload content that is defamatory, hateful, sexually explicit or that infringes copyright or other rights.",
        "Try to access another restaurant's data, probe or disrupt the service, or bypass its security.",
        "Use bots or scripts to overload the service, or resell the service without our written permission.",
        "Send spam through the social posting or review features.",
      ],
    },
    {
      id: "thirdparty",
      title: "Connected services",
      body: [
        "Some features work with Google Business Profile, Facebook, Instagram, X, LinkedIn and AI providers. When you connect them you must follow their terms. We do not control those services, and they may change or stop working. Posts and review replies sent through your connected accounts are your responsibility.",
        "AI features, such as menu scanning and suggested review replies, can make mistakes. Check the result before you rely on it or publish it.",
      ],
    },
    {
      id: "payments",
      title: "Guest payments",
      body: [
        `${APP_NAME} does not process payments. The Pay bill button opens your own payment link or QR code. Money moves directly between your guest and your payment provider, and any dispute, refund or fee is between you, your guest and that provider.`,
      ],
    },
    {
      id: "domains",
      title: "Your website address",
      body: [
        `Each restaurant gets an address at your-restaurant.${TENANT_ROOT_DOMAIN}. We may refuse or reclaim a name that is misleading, infringes a trademark, or impersonates another business. If you connect your own domain, you are responsible for owning it and keeping its settings correct.`,
      ],
    },
    {
      id: "fees",
      title: "Fees",
      body: [
        "If we introduce paid plans, we will show the price and billing terms before you are charged, and you can choose whether to continue. Fees already paid are non-refundable unless the law requires otherwise or we state differently at purchase.",
      ],
    },
    {
      id: "ip",
      title: "Our rights",
      body: [
        `${APP_NAME}, its software, designs, templates, text and brand belong to us or our licensors. These terms do not give you any right to them except to use the service as intended.`,
      ],
    },
    {
      id: "suspension",
      title: "Suspension and ending",
      body: [
        "You can stop using the service and ask us to delete your account at any time. We may suspend or end an account if you break these terms, put the service or other users at risk, or if the law requires it. Where we reasonably can, we will tell you why and give you a chance to export your content.",
      ],
    },
    {
      id: "warranty",
      title: "No guarantee",
      body: [
        `We work to keep ${APP_NAME} available and accurate, but the service is provided "as is" and "as available". We do not promise it will be uninterrupted, error free or suited to a particular purpose. Plan for occasional downtime, for example by keeping a printed copy of your menu.`,
      ],
    },
    {
      id: "liability",
      title: "Limit of liability",
      body: [
        `To the extent the law allows, ${APP_NAME} is not liable for indirect or consequential losses, lost profits, lost sales or lost data, and our total liability for any claim relating to the service is limited to the amount you paid us in the 12 months before the claim, or INR 1,000 if you paid nothing.`,
        "Nothing in these terms limits liability that cannot be limited by law.",
      ],
    },
    {
      id: "indemnity",
      title: "Your responsibility for claims",
      body: [
        "You agree to cover us against claims, losses and costs that arise from your content, your use of the service in breach of these terms, or your dealings with your guests.",
      ],
    },
    {
      id: "privacy",
      title: "Privacy",
      body: [
        "Our Privacy Policy explains how we handle personal information. As a restaurant, you are responsible for how you use the guest information you see in your dashboard, and for any notices or consents the law requires of you.",
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      body: [
        "We may update these terms. We will change the date at the top and, for significant changes, tell account holders by email or in the dashboard. If you keep using the service after a change takes effect, you accept the new terms.",
      ],
    },
    {
      id: "law",
      title: "Governing law",
      body: [
        "These terms are governed by the laws of India. The courts of India have jurisdiction over any dispute, unless a different forum is required by law.",
      ],
    },
    {
      id: "contact",
      title: "Contact us",
      body: [`Write to ${LEGAL_CONTACT_EMAIL} with any question about these terms.`],
    },
  ],
};
