export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__stars" />
      <div className="backdrop__sun" />
      <svg className="backdrop__cloud backdrop__cloud--a" viewBox="0 0 220 90">
        <title>Nube</title>
        <path d="M30 80a26 26 0 0 1 4-51 36 36 0 0 1 68-8 30 30 0 0 1 52 12 24 24 0 0 1 36 47z" />
      </svg>
      <svg className="backdrop__cloud backdrop__cloud--b" viewBox="0 0 220 90">
        <title>Nube</title>
        <path d="M30 80a26 26 0 0 1 4-51 36 36 0 0 1 68-8 30 30 0 0 1 52 12 24 24 0 0 1 36 47z" />
      </svg>
      <svg className="backdrop__cloud backdrop__cloud--c" viewBox="0 0 220 90">
        <title>Nube</title>
        <path d="M30 80a26 26 0 0 1 4-51 36 36 0 0 1 68-8 30 30 0 0 1 52 12 24 24 0 0 1 36 47z" />
      </svg>
      <svg className="backdrop__hills" viewBox="0 0 1440 300" preserveAspectRatio="none">
        <title>Colinas</title>
        <path
          className="backdrop__hill backdrop__hill--far"
          d="M0 150C180 60 330 60 520 130s380 40 520-20 260-40 400 20V300H0z"
        />
        <path
          className="backdrop__hill backdrop__hill--near"
          d="M0 210C200 130 360 150 560 200s360 30 520-30 240-20 360 20V300H0z"
        />
      </svg>
    </div>
  );
}
