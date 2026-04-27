import { serverClient } from "@/lib/supabase";

export default async function AnalyticsScripts() {
  try {
    const db = serverClient();
    const { data } = await db
      .from("site_config")
      .select("key,value")
      .in("key", ["analytics_ga4_id", "analytics_meta_pixel_id", "analytics_clarity_id"]);

    const cfg = Object.fromEntries((data || []).map((r: { key: string; value: string }) => [r.key, r.value?.trim()]));
    const ga4 = cfg.analytics_ga4_id;
    const pixel = cfg.analytics_meta_pixel_id;
    const clarity = cfg.analytics_clarity_id;

    return (
      <>
        {/* Google Analytics 4 */}
        {ga4 && (
          <>
            {/* eslint-disable-next-line @next/next/no-sync-scripts */}
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4}');`,
              }}
            />
          </>
        )}

        {/* Meta Pixel */}
        {pixel && (
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`,
            }}
          />
        )}

        {/* Microsoft Clarity */}
        {clarity && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${clarity}");`,
            }}
          />
        )}
      </>
    );
  } catch {
    return null;
  }
}
