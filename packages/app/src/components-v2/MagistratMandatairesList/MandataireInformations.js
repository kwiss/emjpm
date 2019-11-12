import React, { useState, Fragment } from "react";
import { Heading3, Heading5, Card, Heading4, Spinner, Button } from "@socialgouv/emjpm-ui-core";
import { Box, Flex, Text } from "rebass";
import { MailOutline, Smartphone } from "styled-icons/material";
import { useQuery } from "@apollo/react-hooks";

import { MagistratMandataireCommentForm } from "./MagistratMandataireCommentForm";
import { topTextStyle, iconTextStyle, boxStyle, flexStyle } from "./style";
import { MANDATAIRE_COMMENTS } from "./queries";
import { MagistratMandataireComment } from "./MagistratMandataireComment";

const MandataireInformations = props => {
  const {
    antenneId,
    mandataireId,
    nom,
    prenom,
    telephone,
    email,
    ville,
    tis,
    adresse,
    codePostal,
    ti
  } = props;

  const [isOpen, toggleCommentForm] = useState(false);
  const [isEditOpen, toggleEditCommentForm] = useState(false);
  const [currentComment, setCurrentComment] = useState(false);

  const { data, error, loading } = useQuery(MANDATAIRE_COMMENTS, {
    variables: {
      antenne_id: antenneId,
      mandataire_id: mandataireId
    }
  });

  if (loading) {
    return (
      <Card width="100%">
        <Box my="5">
          <Spinner />
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <Card width="100%">
        <Heading4>erreur</Heading4>
      </Card>
    );
  }
  const { commentaires } = data;
  return (
    <div>
      <Heading3>{`${nom} ${prenom}`}</Heading3>
      <Flex sx={flexStyle}>
        {commentaires.length > 0 && (
          <Box width="100%">
            <Heading5 mt="3">Observations sur le mandataire</Heading5>
            {commentaires.map(commentaire => {
              return (
                <MagistratMandataireComment
                  key={commentaire.id}
                  toggleCommentForm={toggleCommentForm}
                  currentComment={currentComment}
                  setCurrentComment={setCurrentComment}
                  isEditOpen={isEditOpen}
                  toggleEditCommentForm={toggleEditCommentForm}
                  id={commentaire.id}
                  comment={commentaire.comment}
                />
              );
            })}
          </Box>
        )}
        {isOpen ? (
          <MagistratMandataireCommentForm
            toggleCommentForm={toggleCommentForm}
            ti={ti}
            antenneId={antenneId}
            mandataireId={mandataireId}
          />
        ) : (
          <Fragment>
            {!isEditOpen && (
              <Box mt="3" mb="3">
                <Button
                  variant="outline"
                  onClick={() => {
                    toggleCommentForm(true);
                  }}
                >
                  Ajouter une observation
                </Button>
              </Box>
            )}
          </Fragment>
        )}
        <Box sx={boxStyle}>
          <Heading5>Contact</Heading5>
          <Flex mt="2">
            <MailOutline size="16" />
            <Text sx={iconTextStyle}>{email}</Text>
          </Flex>
          <Flex mt="1">
            <Smartphone size="16" />
            <Text sx={iconTextStyle}>{telephone}</Text>
          </Flex>
          <Heading5 mt="5">Adresse d’activité</Heading5>
          <Text sx={topTextStyle}>
            {adresse} {codePostal} {ville}
          </Text>
        </Box>
        <Box sx={boxStyle}>
          <Heading5 mt="5">Tribunaux d’instance</Heading5>
          {tis.map(ti => {
            return (
              <Text key={ti.tis.id} sx={topTextStyle}>
                - {ti.tis.etablissement}
              </Text>
            );
          })}
        </Box>
      </Flex>
    </div>
  );
};

export { MandataireInformations };
