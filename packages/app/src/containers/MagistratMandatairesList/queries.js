import gql from "graphql-tag";

export const MANDATAIRE_COMMENTS = gql`
  query MandataireComments($service_id: Int, $mandataire_id: Int) {
    commentaires(
      where: {
        service_id: { _eq: $service_id }
        mandataire_id: { _eq: $mandataire_id }
      }
    ) {
      comment
      service_id
      created_at
      id
      mandataire_id
      ti_id
    }
  }
`;

export const SERVICE_ANTENNES = gql`
  query ServiceAntennes($serviceId: Int) {
    service_antenne(where: { service_id: { _eq: $serviceId } }) {
      contact_email
      contact_firstname
      contact_lastname
      contact_phone
      mesures_awaiting
      mesures_max
      mesures_in_progress
      name
      id
      code_postal
      adresse
      ville
    }
  }
`;

export const GET_MANDATAIRES = gql`
  query view_mesure_gestionnaire(
    $tribunal: Int!
    $offset: Int!
    $discriminator: String
    $orderBy: [view_mesure_gestionnaire_tis_order_by!]
    $limit: Int
    $searchText: String
  ) {
    count: search_view_mesure_gestionnaire_tis_aggregate(
      args: { search: $searchText }
      where: {
        ti_id: { _eq: $tribunal }
        discriminator: { _eq: $discriminator }
      }
    ) {
      aggregate {
        count
      }
    }
    mandatairesList: search_view_mesure_gestionnaire_tis(
      limit: $limit
      offset: $offset
      order_by: $orderBy
      args: { search: $searchText }
      where: {
        discriminator: { _eq: $discriminator }
        ti_id: { _eq: $tribunal }
      }
    ) {
      gestionnaire {
        id
        discriminator
        mesures_awaiting
        mesures_in_progress
        mesures_max
        mandataire_id
        remaining_capacity
        service_id
        mandataire {
          telephone
          ville
          adresse
          commentaires {
            id
            comment
            ti_id
          }
          code_postal
          user {
            id
            nom
            prenom
            email
            last_login
          }
          genre
          id
        }
        gestionnaire_tis {
          tis {
            id
            etablissement
          }
        }
        service {
          id
          nom
          prenom
          ville
          adresse
          code_postal
          telephone
          email
          etablissement
          service_members {
            id
            user {
              id
              last_login
            }
          }
        }
      }
    }
  }
`;
