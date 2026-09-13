export default function FlagCounter() {
  return (
    <a
      href="https://info.flagcounter.com/fDlU"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block opacity-90 hover:opacity-100 transition-opacity"
      aria-label="Statistiques de trafic Flag Counter"
    >
      {/* Compteur externe : <img> volontaire pour que Flag Counter enregistre les vues */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://s01.flagcounter.com/count2/fDlU/bg_8F7614/txt_000000/border_292929/columns_2/maxflags_6/viewers_0/labels_1/pageviews_1/flags_0/percent_0/"
        alt="Flag Counter"
        className="border-0 max-w-full h-auto"
      />
    </a>
  );
}
