import { formatMandataire } from "~/formatters/mandataires";

export function formatMandatairesList(mandatairesList) {
  return mandatairesList.map((row) => {
    const {
      remaining_capacity,
      discriminator,
      mesures_max,
      mesures_in_progress,
      mandataire,
      gestionnaire_tis,
      mesures_awaiting,
      service,
      id,
    } = row.gestionnaire;
    return formatMandataire(
      remaining_capacity,
      discriminator,
      mesures_max,
      mesures_in_progress,
      service,
      mandataire,
      mesures_awaiting,
      gestionnaire_tis,
      id
    );
  });
}
