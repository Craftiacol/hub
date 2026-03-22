export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Craftia",
    url: "https://craftia.com.mx",
    logo: "https://craftia.com.mx/icon-512.png",
    description:
      "We build SaaS products and AI-powered software solutions.",
    founder: {
      "@type": "Person",
      name: "Alvaro Sepulveda",
    },
    sameAs: ["https://github.com/Craftiacol"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
