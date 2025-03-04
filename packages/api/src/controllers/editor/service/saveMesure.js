const { Mesure, MesureEtat, MesureRessources } = require("~/models");

const getLastEtatDatas = require("./getLastEtatDatas");
const buildMesure = require("../helper/buildMesure");
const getGeoDatas = require("~/services/getGeoDatas");

async function saveMesures(allMesureDatas, trx) {
  const createdMesureIds = [];
  for (const mesureDatas of allMesureDatas) {
    const { datas, type, antenneId, serviceOrMandataire, ti, editorId } =
      mesureDatas;

    const lastEtatDatas = await getLastEtatDatas(datas.etats);
    const { lastEtat, departement } = lastEtatDatas;

    let { longitude, latitude } = lastEtatDatas;
    if (!(latitude && longitude)) {
      if (mesureDatas.latitude && mesureDatas.longitude) {
        latitude = mesureDatas.latitude;
        longitude = mesureDatas.longitude;
      } else if (datas.code_postal || datas.ville) {
        const geoloc = await getGeoDatas(datas.code_postal, datas.ville);
        latitude = geoloc.latitude;
        longitude = geoloc.longitude;
      }
    }

    const mesureToCreate = buildMesure({
      antenneId,
      datas,
      departement,
      editorId,
      lastEtat,
      latitude,
      longitude,
      serviceOrMandataire,
      ti,
      type,
    });
    const createdMesure = await persistMesure(mesureToCreate, datas, trx);
    createdMesureIds.push(createdMesure.id);
  }

  const mesuresQueryResult = await Mesure.query(trx)
    .withGraphFetched("[etats,ressources, tis]")
    .whereIn("id", createdMesureIds);
  return mesuresQueryResult;
}

async function saveMesure(
  { datas, type, antenneId, serviceOrMandataire, ti, editorId },
  trx
) {
  const { lastEtat, departement, longitude, latitude } = await getLastEtatDatas(
    datas.etats
  );

  const mesureToCreate = buildMesure({
    antenneId,
    datas,
    departement,
    editorId,
    lastEtat,
    latitude,
    longitude,
    serviceOrMandataire,
    ti,
    type,
  });

  const createdMesure = await persistMesure(mesureToCreate, datas, trx);

  const mesureQueryResult = await Mesure.query(trx)
    .withGraphFetched("[etats, ressources.[prestations_sociales], tis]")
    .where("id", createdMesure.id)
    .first();
  return mesureQueryResult;
}

module.exports = { saveMesure, saveMesures };

async function persistMesure(mesureToCreate, datas, trx) {
  const mesure = await Mesure.query(trx).insert(mesureToCreate);

  mesure.ressources = [];
  if (datas.ressources) {
    for (const ressource of datas.ressources) {
      const createdMesureRessource = await MesureRessources.query(
        trx
      ).insertGraph({
        annee: ressource.annee || null,
        mesure_id: mesure.id,

        mesure_ressources_prestations_sociales:
          ressource.prestations_sociales?.map((prestations_sociales) => ({
            prestations_sociales,
          })),
        niveau_ressource: ressource.niveau_ressource,
      });
      mesure.ressources.push(createdMesureRessource);
    }
  }

  mesure.etats = [];
  if (datas.etats) {
    const etatsByDateChangement = {};
    for (const etat of datas.etats) {
      const date = new Date(etat.date_changement_etat);
      const noTimeDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      etatsByDateChangement[noTimeDate.toISOString()] = etat;
    }
    const etats = Object.values(etatsByDateChangement);

    for (const etat of etats) {
      const mesureEtat = await MesureEtat.query(trx).insert({
        champ_mesure: etat.champ_mesure,
        code_postal: etat.code_postal,
        date_changement_etat: etat.date_changement_etat,
        lieu_vie: etat.lieu_vie,
        mesure_id: mesure.id,
        nature_mesure: etat.nature_mesure,
        pays: etat.pays,
        type_etablissement: etat.type_etablissement,
        ville: etat.ville,
      });
      mesure.etats.push(mesureEtat);
    }
  }
  return mesure;
}
