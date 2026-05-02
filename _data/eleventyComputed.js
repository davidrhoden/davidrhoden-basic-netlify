module.exports = {
  schemaorg: (data) => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${data.metadata.url}#website`,
        description: data.metadata.description,
        name: data.metadata.title,
        publisher: {
          "@type": "Person",
          "@id": `${data.metadata.url}#person`,
        },
        url: data.metadata.url,
      },
      {
        "@type": "Person",
        "@id": `${data.metadata.url}#person`,
        address: {
          "@type": "PostalAddress",
          addressCountry: "US",
          addressLocality: "New Orleans",
          addressRegion: "LA",
        },
        familyName: "Rhoden",
        givenName: "David",
        jobTitle: ["Painter", "Illustrator", "Animator", "Musician"],
        name: "David Rhoden",
        sameAs: [
          "https://github.com/davidrhoden",
          "https://bsky.app/profile/davidrhoden.com",
          "https://instagram.com/thedavidrhoden",
          "https://www.linkedin.com/in/davidrhoden/",
          "https://www.facebook.com/davidrhoden",
        ],
        url: data.metadata.url,
      },
    ],
  }),
};
