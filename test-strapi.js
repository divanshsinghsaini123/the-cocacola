const url = "https://jellyfish-app-4r55c.ondigitalocean.app/api/home-page?populate[hero][populate][0]=imageDesktop&populate[hero][populate][1]=imageMobile&populate[promosAndOffers][populate][items][populate]=image&populate[features][populate][items][populate]=image&populate[moreFromCloud9][populate][items][populate]=image&populate[socialLinks][populate][Instagram]=*&populate[socialLinks][populate][Youtube]=*&populate[socialLinks][populate][X]=*&populate[socialLinks][populate][Facebook]=*&populate[footer][populate][Section1][populate][links]=*&populate[footer][populate][Section2][populate][links]=*&populate[footer][populate][Section3][populate][links]=*&populate[footer][populate][FooterImage]=true&populate[NavbarImage]=true&populate[SEO][populate]=*&populate[PageButton]=*&populate[Favicon]=true";

fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log("DATA KEYS:", Object.keys(data.data || {}));
    if (data.data) {
      console.log("FAVICON FIELD:", data.data.Favicon);
      console.log("ATTRIBUTES FAVICON FIELD:", data.data.attributes ? data.data.attributes.Favicon : "no attributes");
    } else {
      console.log("NO DATA RECEIVED", data);
    }
  })
  .catch(err => console.error(err));
