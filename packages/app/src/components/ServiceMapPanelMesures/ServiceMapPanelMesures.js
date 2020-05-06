import { useQuery } from "@apollo/react-hooks";
import { MesureListItem } from "@emjpm/ui";
import Router from "next/router";
import React, { Fragment, useMemo, useState } from "react";
import ReactPaginate from "react-paginate";
import { Scrollbar } from "react-scrollbars-custom";
import { Box, Flex } from "rebass";

import { formatMesureList } from "../../util/services";
import { MESURES } from "./queries";
import { ServiceMapPanelMesuresStyle } from "./style";
const RESULT_PER_PAGE = 20;

const ServiceMapPanelMesures = ({ mesuresIds }) => {
  const [currentOffset, setCurrentOffset] = useState(0);

  const queryVariables = {
    limit: RESULT_PER_PAGE,
    offset: currentOffset,
    ids: mesuresIds
  };

  const { data, error, loading } = useQuery(MESURES, {
    variables: queryVariables,
    fetchPolicy: "cache-and-network"
  });

  const selectMesure = ({ id }) => {
    Router.push("/services/mesures/[mesure_id]", `/services/mesures/${id}`, {
      shallow: true
    });
  };

  const mesures = useMemo(() => (data ? formatMesureList(data.mesures) : []), [data]);

  const count = useMemo(() => (data ? data.mesures_aggregate.aggregate.count : 0), [data]);
  const totalPage = useMemo(() => Math.ceil(count / RESULT_PER_PAGE), [count]);

  if (loading) {
    return <Box p="2">Chargement</Box>;
  }

  if (error) {
    return <div>Erreur</div>;
  }
  return (
    <Box sx={ServiceMapPanelMesuresStyle}>
      <Scrollbar style={{ width: "100%", height: "100%" }}>
        <Box p="2">
          {mesures.length > 0 ? (
            <Fragment>
              {mesures.map(mesure => {
                return (
                  <MesureListItem
                    key={mesure.id}
                    mesure={mesure}
                    hasLocation={false}
                    hasTribunal={false}
                    hasFolderNumber={false}
                    onClick={({ mesure }) => selectMesure(mesure)}
                  />
                );
              })}
            </Fragment>
          ) : (
            <div>Pas de donnée à afficher</div>
          )}
          {count > RESULT_PER_PAGE && (
            <Flex mb="2" alignItems="center" justifyContent="center">
              <ReactPaginate
                previousLabel={"Précédent"}
                nextLabel={"Suivant"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={totalPage}
                containerClassName={"react-paginate-top"}
                marginPagesDisplayed={1}
                forcePage={currentOffset / RESULT_PER_PAGE}
                pageRangeDisplayed={1}
                onPageChange={data => {
                  setCurrentOffset(data.selected * RESULT_PER_PAGE);
                }}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
              />
            </Flex>
          )}
        </Box>
      </Scrollbar>
    </Box>
  );
};

export { ServiceMapPanelMesures };
