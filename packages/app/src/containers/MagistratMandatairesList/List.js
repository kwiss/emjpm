import { useQuery } from "@apollo/client";
import ReactPaginate from "react-paginate";
import { useHistory } from "react-router-dom";
import { Flex } from "rebass";

import useUser from "~/hooks/useUser";
import MandataireListItem from "~/containers/MandataireListItem";

import useQueryReady from "~/hooks/useQueryReady";

import { GET_MANDATAIRES } from "./queries";
import { formatMandatairesList } from "./utils";

const RESULT_PER_PAGE = 20;

function getOrderByVariable(orderBy) {
  switch (orderBy) {
    case 0:
      return { gestionnaire: { remaining_capacity: "desc_nulls_last" } };
    case 1:
      return {
        name: "asc",
      };
    case 2:
      return {
        name: "desc",
      };
  }
}

function MagistratMandatairesListList(props) {
  const {
    orderBy,
    debouncedSearchText,
    setCurrentOffset,
    currentOffset,
    selectedType,
  } = props;
  const history = useHistory();
  const {
    magistrat: { ti_id },
  } = useUser();

  const { data, error, loading } = useQuery(GET_MANDATAIRES, {
    variables: {
      discriminator: selectedType ? selectedType.value : null,
      limit: RESULT_PER_PAGE,
      offset: currentOffset,
      orderBy: getOrderByVariable(orderBy),
      searchText: debouncedSearchText ? `%${debouncedSearchText}%` : null,
      tribunal: ti_id,
    },
  });

  if (!useQueryReady(loading, error)) {
    return null;
  }

  const { count } = data.count.aggregate;
  const totalPage = count / RESULT_PER_PAGE;
  const gestionnaires = formatMandatairesList(data.mandatairesList);

  return (
    <>
      {gestionnaires.map((gestionnaire) => {
        const to = `/magistrats/gestionnaires/${gestionnaire.id}`;
        const onItemClick = (e) => {
          if (e.ctrlKey) {
            return;
          }
          e.preventDefault();
          const selection = window.getSelection().toString();
          if (selection.length > 0) {
            return;
          }
          history.push(to);
        };
        return (
          <a
            key={gestionnaire.id}
            href={to}
            onClick={onItemClick}
            draggable="false"
          >
            <MandataireListItem gestionnaire={gestionnaire} />
          </a>
        );
      })}
      {count > RESULT_PER_PAGE && (
        <Flex alignItems="center" justifyContent="center">
          <ReactPaginate
            previousLabel={"Précédent"}
            nextLabel={"Suivant"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={totalPage}
            containerClassName={"react-paginate"}
            marginPagesDisplayed={2}
            forcePage={currentOffset / RESULT_PER_PAGE}
            pageRangeDisplayed={5}
            onPageChange={(data) => {
              setCurrentOffset(data.selected * RESULT_PER_PAGE);
            }}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        </Flex>
      )}
    </>
  );
}

export { MagistratMandatairesListList };
