if(typeof document!=="undefined"){
  const manifest=document.createElement("link"); manifest.rel="manifest"; manifest.href="/manifest.webmanifest"; document.head.appendChild(manifest);
  const theme=document.createElement("meta"); theme.name="theme-color"; theme.content="#0e1a2b"; document.head.appendChild(theme);
  const mobile=document.createElement("meta"); mobile.name="mobile-web-app-capable"; mobile.content="yes"; document.head.appendChild(mobile);
  document.documentElement.lang="pt-BR";
}
