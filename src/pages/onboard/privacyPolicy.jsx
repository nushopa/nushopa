import OnboardLayout from "../../layouts/onboardLayout";
import BlockContent from "@sanity/block-content-to-react";
import { Helmet } from "react-helmet-async";

// Static privacy policy content, written as Portable Text blocks so it
// renders through the same <BlockContent /> component that CMS-driven
// content used to use.
let _key = 0;
const key = () => `fallback-${_key++}`;

const block = (text, style = "normal") => ({
  _type: "block",
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});

// Section headings carry a stable `sectionId` (outside the Portable Text
// spec, but harmless) so the same id can anchor both the heading and its
// table-of-contents link.
const h2 = (id, text) => ({
  _type: "block",
  _key: key(),
  style: "h2",
  sectionId: id,
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});

const bulletList = (items) =>
  items.map((text) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  }));

const linkBlock = (prefix, linkText, url) => ({
  _type: "block",
  _key: key(),
  style: "normal",
  markDefs: [{ _key: "link1", _type: "link", href: url }],
  children: [
    { _type: "span", _key: key(), text: prefix, marks: [] },
    { _type: "span", _key: key(), text: linkText, marks: ["link1"] },
  ],
});

// Table of contents — kept as a single source of truth alongside the
// section ids used in POLICY_CONTENT below.
const TOC = [
  { id: "info-we-collect", label: "Information We Collect" },
  { id: "info-by-account-type", label: "Information by Account Type" },
  { id: "how-we-use-info", label: "How We Use Information" },
  { id: "google-sign-in", label: "Signing In With Google" },
  { id: "apple-sign-in", label: "Signing In With Apple" },
  { id: "payments", label: "Payments" },
  { id: "cookies-tokens-consent", label: "Cookies, Tokens & Consent" },
  { id: "push-notifications", label: "Push Notifications" },
  { id: "how-we-share-info", label: "How We Share Information" },
  { id: "third-party-services", label: "Third-Party Services" },
  { id: "data-retention", label: "Data Retention" },
  { id: "data-security", label: "Data Security" },
  { id: "your-rights", label: "Your Rights & Choices" },
  { id: "childrens-privacy", label: "Children's Privacy" },
  { id: "international-transfers", label: "International Data Transfers" },
  { id: "changes-to-policy", label: "Changes to This Policy" },
  { id: "contact-us", label: "Contact Us" },
];

const POLICY_CONTENT = [
  block(
    "Protecting your privacy is our priority at Nushopa. This Privacy Policy explains how we collect, use, share, and protect your information as you shop farm-fresh produce, place orders, and connect with our network of market representatives, distributors, and delivery drivers on the Nushopa app.",
  ),

  h2("info-we-collect", "1. Information We Collect"),
  block(
    "We collect information you provide directly, information generated as you use the app, and information from third parties you choose to connect (like Google).",
  ),
  ...bulletList([
    "Account information — first and last name, email address, phone number, a securely hashed password, and your account type (customer, distributor/market representative, or driver)",
    "Verification & identity — city, address, state, ID type, date of birth, and a proof-of-identity image, collected from market representatives and distributors as part of onboarding and approval",
    "Delivery information — delivery addresses, an additional phone number, delivery directions, and one-time delivery confirmation codes",
    "Order & transaction data — products ordered, quantities, order status, amount paid, and payment references",
    "Device & push data — device identifiers, push notification tokens, platform, and your notification preferences",
    "Communications — in-app chat messages, contact/support form submissions, and reviews or ratings you submit",
    "Usage & log data — IP address, browser/app user agent, and timestamps, used for security and troubleshooting",
    "Cookies & session data — an authentication session token (a secure cookie on web, or a stored token on mobile) and your cookie-consent choices",
  ]),

  h2("info-by-account-type", "2. Information by Account Type"),
  block("Customers", "h3"),
  block(
    "We collect the account and order information above so you can browse products, place orders, track deliveries, and get order updates.",
  ),
  block("Market representatives & distributors", "h3"),
  block(
    "In addition to standard account details, we collect identity and address verification information (ID type, date of birth, proof of identity, business address) to review and approve your account for order fulfillment. This is reviewed by our team before your account is approved.",
  ),
  block("Delivery drivers", "h3"),
  block(
    "We collect the minimum information needed to assign you deliveries and let you know about assignment changes.",
  ),

  h2("how-we-use-info", "3. How We Use Information"),
  ...bulletList([
    "Create and manage your account, and verify identity where required",
    "Process orders, payments, and deliveries — including matching orders to nearby distributors and drivers",
    "Send transactional messages (order confirmations, status updates, delivery codes, account notices) by email, push notification, and in-app alert",
    "Send marketing messages (new products, promotions, newsletters) only where you haven't opted out",
    "Keep accounts and sessions secure, including blocking reuse of sessions after logout or account deletion",
    "Respond to support requests submitted through our contact form",
    "Understand aggregate usage trends to improve the app — this doesn't identify you individually",
    "Comply with legal obligations and enforce our terms",
  ]),

  h2("google-sign-in", "4. Signing In With Google"),
  block(
    "If you sign in with Google, we receive your name, email address, and profile information from Google to create or log you into your account. We never receive your Google password. You can review or revoke Nushopa's access anytime in your Google Account settings.",
  ),

  h2("apple-sign-in", "5. Signing In With Apple"),
  block(
    "If you sign in with Apple, Apple shares your name and a verified email address with us — or, if you choose to hide your email, a private relay address that forwards to you. We never receive your Apple ID password. You can review or revoke Nushopa's access anytime under Settings → Apple ID → Sign in with Apple on your device.",
  ),

  h2("payments", "6. Payments"),
  block(
    "Payments are processed by our payment partner, Squad. Your payment details (card or bank transfer information) go directly to Squad's secure systems — we never store your full card number. We receive a payment reference, status, and amount paid to confirm and fulfill your order.",
  ),

  h2("cookies-tokens-consent", "7. Cookies, Tokens & Consent"),
  block(
    "On the web app, we use an essential, secure, httpOnly authentication cookie to keep you logged in — it's required for the app to work. On mobile, an equivalent access token is stored securely on your device instead. Where we use optional analytics or marketing tracking, we ask for your consent first and record your choice, including the date and what you agreed to. You can change these preferences anytime in the app's privacy settings.",
  ),

  h2("push-notifications", "8. Push Notifications"),
  ...bulletList([
    "Transactional — order status, delivery, and assignment updates. These are part of using the app and can't be turned off individually.",
    "Marketing — new products, promotions, and announcements. Opt-in only, and can be disabled anytime in notification settings.",
  ]),

  h2("how-we-share-info", "9. How We Share Information"),
  ...bulletList([
    "Distributors and drivers receive the delivery address, contact details, and order contents needed to fulfill an order assigned to them",
    "Service providers (payments, image hosting, email, push delivery — see Section 10) process data on our behalf under contract",
    "Legal and safety — we may disclose information if required by law, or to protect the rights, safety, or property of Nushopa, our users, or the public",
    "Business transfers — if Nushopa is involved in a merger, acquisition, or asset sale, information may transfer as part of that deal, subject to this policy",
  ]),
  block("We do not sell your personal information."),

  h2("third-party-services", "10. Third-Party Services"),
  ...bulletList([
    "Squad — payment processing",
    "Cloudinary — hosting images (products, adverts, ID/verification uploads)",
    "Google — optional sign-in (OAuth)",
    "Apple — optional sign-in (Sign in with Apple)",
    "Email delivery provider — transactional emails such as OTP verification, order confirmations, and account notices",
    "Push notification provider — delivering push notifications to registered devices",
  ]),
  block(
    "Each provider processes data under its own privacy policy, and only receives what it needs to perform its role for us.",
  ),

  h2("data-retention", "11. Data Retention"),
  block(
    "We keep account information for as long as your account is active. Order records are kept for accounting, tax, and dispute-resolution purposes even after account deletion. Verification documents are retained as long as needed for compliance and fraud prevention. Deleting your account deactivates your profile, and any active login session is immediately blocked from further use.",
  ),

  h2("data-security", "12. Data Security"),
  block(
    "We use password hashing, encrypted authentication tokens, secure cookies, and signature-verified payment webhooks to protect your data. No method of transmission or storage is 100% secure, and we can't guarantee absolute security.",
  ),

  h2("your-rights", "13. Your Rights & Choices"),
  ...bulletList([
    "Access & correction — view and update your profile in the app anytime",
    "Deletion — request account deletion in the app or by contacting us",
    "Marketing opt-out — disable marketing push notifications and emails anytime in notification settings",
    "Cookie/consent preferences — update your analytics/marketing consent choices anytime",
  ]),
  block(
    "Depending on where you live, you may have additional rights under laws like Nigeria's Data Protection Act/NDPR, or the GDPR if you're in the EU/UK. Contact us below to exercise any of these.",
  ),

  h2("childrens-privacy", "14. Children's Privacy"),
  block(
    "Nushopa is not directed to children under 13 (or the minimum age required where you live), and we don't knowingly collect information from children. If you believe a child has given us information, please contact us so we can remove it.",
  ),

  h2("international-transfers", "15. International Data Transfers"),
  block(
    "Your information may be processed in countries other than your own, including where our service providers operate. Where required, we take steps to make sure such transfers comply with applicable data protection law.",
  ),

  h2("changes-to-policy", "16. Changes to This Policy"),
  block(
    'We may update this Privacy Policy from time to time. We\'ll update the "last updated" date shown on this page and, for material changes, notify you through the app or by email.',
  ),

  h2("contact-us", "17. Contact Us"),
  block(
    "If you have questions about this policy or want to exercise your data rights, reach us at Nushopa.",
  ),
  linkBlock("Email: ", "privacy@nushopa.com", "mailto:privacy@nushopa.com"),
  block("Support form: available in the app under Help & Support"),
];


const serializers = {
  types: {
    block: ({ node, children }) => {
      if (node.style === "h2") {
        return (
          <h2
            id={node.sectionId}
            className="scroll-mt-28 font-workSans text-[1.375rem] font-semibold tracking-tight text-neutral-900 mt-12 mb-4 pb-3 border-b border-neutral-200 first:mt-0"
          >
            {children}
          </h2>
        );
      }
      if (node.style === "h3") {
        return (
          <h3 className="font-workSans text-base font-semibold text-neutral-900 mt-6 mb-2">
            {children}
          </h3>
        );
      }
      return (
        <p className="font-workSans text-[15px] leading-7 text-neutral-600 mb-4 max-w-[68ch]">
          {children}
        </p>
      );
    },
  },
  list: ({ children }) => (
    <ul className="mb-5 space-y-2.5 max-w-[68ch]">{children}</ul>
  ),
  listItem: ({ children }) => (
    <li className="font-workSans text-[15px] leading-7 text-neutral-600 pl-5 relative before:content-[''] before:absolute before:left-0 before:top-[0.7em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-emerald-700/60">
      {children}
    </li>
  ),
  marks: {
    link: ({ mark, children }) => (
      <a
        href={mark.href}
        className="text-emerald-700 underline decoration-emerald-700/30 underline-offset-2 hover:decoration-emerald-700 transition-colors"
        target={mark.href?.startsWith("mailto:") ? undefined : "_blank"}
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
};

const PrivacyPolicy = () => {
 
  return (
    <OnboardLayout>
      <Helmet>
        <title>Nushopa | Privacy Policy</title>
        <meta
          name="description"
          content="Protecting your privacy is our priority at Nushopa. Learn about how we collect, use, and protect your personal information in our comprehensive Privacy Policy. We are committed to safeguarding your data and ensuring transparency in our practices as we strive for farm-to-table excellence together!"
        />
      </Helmet>

      <div className="bg-white px-5 pt-8 pb-14 md:px-12 md:pt-14 md:pb-24 rounded-lg">
       

        <div className="md:grid md:grid-cols-[200px_minmax(0,1fr)] md:gap-x-14">
          {/* Table of contents */}
          <nav
            aria-label="Table of contents"
            className="hidden md:block sticky top-24 self-start"
          >
            <p className="font-workSans text-xs font-semibold text-neutral-400 mb-3">
              On this page
            </p>
            <ol className="space-y-2 border-l border-neutral-200">
              {TOC.map((item, index) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="group flex gap-2 pl-4 -ml-px border-l border-transparent hover:border-emerald-700 py-0.5 font-workSans text-[13px] leading-5 text-neutral-500 hover:text-emerald-800 transition-colors"
                  >
                    <span className="tabular-nums text-neutral-300 group-hover:text-emerald-700">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Policy content */}
          <div>
            <BlockContent blocks={POLICY_CONTENT} serializers={serializers} />
          </div>
        </div>
      </div>
    </OnboardLayout>
  );
};

export default PrivacyPolicy;