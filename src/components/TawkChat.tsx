"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export default function TawkChat() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <Script id="tawk-to" strategy="lazyOnload">
      {`
        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
        Tawk_API.customStyle = {
          visibility: {
            desktop: { position: 'br', xOffset: 20, yOffset: 92 },
            mobile: { position: 'br', xOffset: 8, yOffset: 92 }
          }
        };
        (function(){
          var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
          s1.async=true;
          s1.src='https://embed.tawk.to/6729e1794304e3196add5688/1k2dhq116';
          s1.charset='UTF-8';
          s1.setAttribute('crossorigin','*');
          s0.parentNode.insertBefore(s1,s0);
        })();
      `}
    </Script>
  );
}
