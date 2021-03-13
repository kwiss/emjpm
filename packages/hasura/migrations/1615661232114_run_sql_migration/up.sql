CREATE OR REPLACE VIEW "public"."view_mesure_gestionnaire_tis" AS 
 SELECT concat(users.type, '-', m.id) AS id,
    NULL::integer AS service_id,
    m.id AS mandataire_id,
        CASE
            WHEN ((users.type)::text = 'individuel'::text) THEN 'MANDATAIRE_IND'::text
            ELSE 'MANDATAIRE_PRE'::text
        END AS discriminator,
    mandataire_tis.ti_id,
    users.nom AS name
   FROM mandataires m
   LEFT JOIN users ON users.id = m.user_id
   LEFT JOIN mandataire_tis ON m.id = mandataire_tis.mandataire_id
UNION
 SELECT concat('service-', sti.service_id) AS id,
    sti.service_id,
    NULL::integer AS mandataire_id,
    'SERVICE'::text AS discriminator,
    sti.ti_id,
    s.etablissement AS name
   FROM services s
   LEFT JOIN service_tis sti ON (s.id = sti.service_id);
