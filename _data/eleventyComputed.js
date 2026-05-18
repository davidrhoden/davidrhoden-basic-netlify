module.exports = {
  schemaorg: (data) => {
    const graph = [
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
        description: "David Rhoden is a painter, illustrator, animator, and musician based in New Orleans, Louisiana.",
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
    ];

    if (data.page && data.page.url === "/") {
      graph.push({
        "@type": "ProfilePage",
        "@id": `${data.metadata.url}/#webpage`,
        about: { "@id": `${data.metadata.url}#person` },
        description: data.excerpt || data.metadata.description,
        isPartOf: { "@id": `${data.metadata.url}#website` },
        name: data.metadata.title,
        url: data.metadata.url,
      });
    }

    return { "@context": "https://schema.org", "@graph": graph };
  },
};
