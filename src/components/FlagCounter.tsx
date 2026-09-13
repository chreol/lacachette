export default function FlagCounter() {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#C59A4A]">Trafic du site</p>
      <a
        href="https://info.flagcounter.com/fDlU"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-lg overflow-hidden border border-[#C59A4A]/40 bg-[#E8D8B8] p-1"
        aria-label="Statistiques de trafic Flag Counter"
      >
        {/* Compteur externe : <img> pour que Flag Counter enregistre les vues */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://s01.flagcounter.com/count2/fDlU/bg_E8D8B8/txt_171310/border_C59A4A/columns_3/maxflags_9/viewers_0/labels_1/pageviews_1/flags_0/percent_0/"
          alt="Flag Counter — visiteurs par pays"
          width={210}
          height={90}
          className="border-0 max-w-[210px] h-auto block"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </a>
    </div>
  );
}
