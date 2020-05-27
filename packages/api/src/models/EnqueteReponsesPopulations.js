const { Model } = require("objection");

const knexConnection = require("../db/knex");

Model.knex(knexConnection);

class EnqueteReponsesPopulations extends Model {
  static get tableName() {
    return "enquete_reponses_populations";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        tutelle_age_inf_25_ans_homme: { type: "number" },
        tutelle_age_inf_25_ans_femme: { type: "number" },
        tutelle_age_25_39_ans_homme: { type: "number" },
        tutelle_age_25_39_ans_femme: { type: "number" },
        tutelle_age_40_59_ans_homme: { type: "number" },
        tutelle_age_40_59_ans_femme: { type: "number" },
        tutelle_age_60_74_ans_homme: { type: "number" },
        tutelle_age_60_74_ans_femme: { type: "number" },
        tutelle_age_sup_75_ans_homme: { type: "number" },
        tutelle_age_sup_75_ans_femme: { type: "number" },
        curatelle_age_inf_25_ans_homme: { type: "number" },
        curatelle_age_inf_25_ans_femme: { type: "number" },
        curatelle_age_25_39_ans_homme: { type: "number" },
        curatelle_age_25_39_ans_femme: { type: "number" },
        curatelle_age_40_59_ans_homme: { type: "number" },
        curatelle_age_40_59_ans_femme: { type: "number" },
        curatelle_age_60_74_ans_homme: { type: "number" },
        curatelle_age_60_74_ans_femme: { type: "number" },
        curatelle_age_sup_75_ans_homme: { type: "number" },
        curatelle_age_sup_75_ans_femme: { type: "number" },
        maj_age_inf_25_ans_homme: { type: "number" },
        maj_age_inf_25_ans_femme: { type: "number" },
        maj_age_25_39_ans_homme: { type: "number" },
        maj_age_25_39_ans_femme: { type: "number" },
        maj_age_40_59_ans_homme: { type: "number" },
        maj_age_40_59_ans_femme: { type: "number" },
        maj_age_60_74_ans_homme: { type: "number" },
        maj_age_60_74_ans_femme: { type: "number" },
        maj_age_sup_75_ans_homme: { type: "number" },
        maj_age_sup_75_ans_femme: { type: "number" },
        sauvegarde_justice_age_inf_25_ans_homme: { type: "number" },
        sauvegarde_justice_age_inf_25_ans_femme: { type: "number" },
        sauvegarde_justice_age_25_39_ans_homme: { type: "number" },
        sauvegarde_justice_age_25_39_ans_femme: { type: "number" },
        sauvegarde_justice_age_40_59_ans_homme: { type: "number" },
        sauvegarde_justice_age_40_59_ans_femme: { type: "number" },
        sauvegarde_justice_age_60_74_ans_homme: { type: "number" },
        sauvegarde_justice_age_60_74_ans_femme: { type: "number" },
        sauvegarde_justice_age_sup_75_ans_homme: { type: "number" },
        sauvegarde_justice_age_sup_75_ans_femme: { type: "number" },
        autre_mesures_age_inf_25_ans_homme: { type: "number" },
        autre_mesures_age_inf_25_ans_femme: { type: "number" },
        autre_mesures_age_25_39_ans_homme: { type: "number" },
        autre_mesures_age_25_39_ans_femme: { type: "number" },
        autre_mesures_age_40_59_ans_homme: { type: "number" },
        autre_mesures_age_40_59_ans_femme: { type: "number" },
        autre_mesures_age_60_74_ans_homme: { type: "number" },
        autre_mesures_age_60_74_ans_femme: { type: "number" },
        autre_mesures_age_sup_75_ans_homme: { type: "number" },
        autre_mesures_age_sup_75_ans_femme: { type: "number" },
        tutelle_anciennete_inf_1_an: { type: "number" },
        tutelle_anciennete_1_3_ans: { type: "number" },
        tutelle_anciennete_3_5_ans: { type: "number" },
        tutelle_anciennete_5_10_ans: { type: "number" },
        tutelle_anciennete_sup_10_ans: { type: "number" },
        curatelle_anciennete_inf_1_an: { type: "number" },
        curatelle_anciennete_1_3_ans: { type: "number" },
        curatelle_anciennete_3_5_ans: { type: "number" },
        curatelle_anciennete_5_10_ans: { type: "number" },
        curatelle_anciennete_sup_10_ans: { type: "number" },
        maj_anciennete_inf_1_an: { type: "number" },
        maj_anciennete_1_3_ans: { type: "number" },
        maj_anciennete_3_5_ans: { type: "number" },
        maj_anciennete_5_10_ans: { type: "number" },
        maj_anciennete_sup_10_ans: { type: "number" },
        sauvegarde_justice_anciennete_inf_1_an: { type: "number" },
        sauvegarde_justice_anciennete_1_3_ans: { type: "number" },
        sauvegarde_justice_anciennete_3_5_ans: { type: "number" },
        sauvegarde_justice_anciennete_5_10_ans: { type: "number" },
        sauvegarde_justice_anciennete_sup_10_ans: { type: "number" },
        autre_mesures_anciennete_inf_1_an: { type: "number" },
        autre_mesures_anciennete_1_3_ans: { type: "number" },
        autre_mesures_anciennete_3_5_ans: { type: "number" },
        autre_mesures_anciennete_5_10_ans: { type: "number" },
        autre_mesures_anciennete_sup_10_ans: { type: "number" },
        tutelle_etablissement_personne_handicapee: { type: "number" },
        tutelle_service_personne_handicapee: { type: "number" },
        tutelle_ehpad: { type: "number" },
        tutelle_autre_etablissement_personne_agee: { type: "number" },
        tutelle_chrs: { type: "number" },
        tutelle_service_hospitalier_soins_longue_duree: { type: "number" },
        tutelle_service_psychiatrique: { type: "number" },
        tutelle_autre_service: { type: "number" },
        curatelle_etablissement_personne_handicapee: { type: "number" },
        curatelle_service_personne_handicapee: { type: "number" },
        curatelle_ehpad: { type: "number" },
        curatelle_autre_etablissement_personne_agee: { type: "number" },
        curatelle_chrs: { type: "number" },
        curatelle_service_hospitalier_soins_longue_duree: { type: "number" },
        curatelle_service_psychiatrique: { type: "number" },
        curatelle_autre_service: { type: "number" },
        maj_etablissement_personne_handicapee: { type: "number" },
        maj_service_personne_handicapee: { type: "number" },
        maj_ehpad: { type: "number" },
        maj_autre_etablissement_personne_agee: { type: "number" },
        maj_chrs: { type: "number" },
        maj_service_hospitalier_soins_longue_duree: { type: "number" },
        maj_service_psychiatrique: { type: "number" },
        maj_autre_service: { type: "number" },
        sauvegarde_justice_etablissement_personne_handicapee: {
          type: "number"
        },
        sauvegarde_justice_service_personne_handicapee: { type: "number" },
        sauvegarde_justice_ehpad: { type: "number" },
        sauvegarde_justice_autre_etablissement_personne_agee: {
          type: "number"
        },
        sauvegarde_justice_chrs: { type: "number" },
        sauvegarde_justice_service_hospitalier_soins_longue_duree: {
          type: "number"
        },
        sauvegarde_justice_service_psychiatrique: { type: "number" },
        sauvegarde_justice_autre_service: { type: "number" },
        autre_mesures_etablissement_personne_handicapee: { type: "number" },
        autre_mesures_service_personne_handicapee: { type: "number" },
        autre_mesures_ehpad: { type: "number" },
        autre_mesures_autre_etablissement_personne_agee: { type: "number" },
        autre_mesures_chrs: { type: "number" },
        autre_mesures_service_hospitalier_soins_longue_duree: {
          type: "number"
        },
        autre_mesures_service_psychiatrique: { type: "number" },
        autre_mesures_autre_service: { type: "number" }
      }
    };
  }
}

module.exports = { EnqueteReponsesPopulations };
