import React from "react";

const Hausordnung = () => {
  return (
    <>
      <div className=" bg-brand-colour-darker p-8 md:p-16 border-brand-border-orange border-2">
        <h2 className=" m-4 text-center text-brand-accent-4 text-4sc md:text-3sc font-carlson font-extrabold">
          Hausordnung
        </h2>
        <h3 className="mb-4 mt-6 text-xl font-semibold">Liebe Besucher</h3>
        <ol className="list-decimal ">
          <li className="m-3">
            Mitgebrachte Speisen & Getränke dürfen gern auf der Wiese verzehrt
            werden
          </li>
          <li className="m-3">
            Offenes Feuer & Grillen ist aus Sicherheitsgründen untersagt. Nutzen
            Sie unsere günstigen Miet-angebote u.a. für ihre Grillfeier!
          </li>
          <li className="m-3">Wir sind videoüberwacht!</li>
          <li className="m-3">Bitte leinen sie ihre Haustiere an</li>
          <li className="m-3">Nutzung der Anlagen auf eigene Gefahr!</li>
          <li className="m-3">
            Verlassen Sie ihren Platz so wie Sie ihn vorfinden möchten.
            respektvoller Umgang mit Umwelt & Mitmenschen beschert allen eine
            schöne Umgebung!
          </li>
        </ol>
        <p>Einen angenehmen Aufenthalt wünscht ihr Parkbad-team</p>
      </div>
    </>
  );
};

export default Hausordnung;
