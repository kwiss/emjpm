import { useMutation, useQuery } from "@apollo/client";
import { useContext, useState } from "react";
import { Box, Flex, Text } from "rebass";

import useQueryReady from "~/hooks/useQueryReady";
import { Context as AdminFilterContext } from "~/containers/FilterWidgets/context";
import { Link } from "~/components/Link";
import { PaginatedList } from "~/containers/PaginatedList";
import { Button, Card } from "~/components";
import { captureException } from "~/user/sentry";

import useEffectObjectValuesChangeCallback from "~/hooks/useEffectObjectValuesChangeCallback";

import { REMOVE_EDITOR } from "./mutations";
import { EDITORS } from "./queries";
import { descriptionStyle, labelStyle } from "./style";

function RowItem({ item }) {
  const { id, name, api_token, redirect_uris } = item;
  const [removeEditor, { loading, error }] = useMutation(REMOVE_EDITOR);

  useQueryReady(loading, error);

  const removeEditorFromList = async (id) => {
    try {
      await removeEditor({
        refetchQueries: ["editors", "editorRequests"],
        variables: {
          id: id,
        },
      });
    } catch (error) {
      captureException(error);
      // TODO(plaunay) display "Une erreur est survenue, veuillez réessayer plus tard."
    }
  };

  return (
    <Card width="100%" mb="2">
      <Flex justifyContent="space-between">
        <Flex justifyContent="flex-start">
          <Flex width="100px" flexDirection="column">
            <Text sx={labelStyle}>ID</Text>
            <Text sx={descriptionStyle}>{id}</Text>
          </Flex>
          <Flex width="200px" flexDirection="column">
            <Text sx={labelStyle}>Name</Text>
            <Text sx={descriptionStyle}>{name}</Text>
          </Flex>
          <Flex width="100px" flexDirection="column">
            <Text sx={labelStyle}>API Token</Text>
            <Text sx={descriptionStyle}>{api_token}</Text>
          </Flex>
          <Flex width="400px" flexDirection="column">
            <Text sx={labelStyle}>URLs de redirection</Text>
            <Text sx={descriptionStyle}>{redirect_uris}</Text>
          </Flex>
        </Flex>

        <Box mr="1" width="220px">
          <Link to={`/admin/editors/${id}`}>
            <Button>Voir</Button>
          </Link>
          <Button ml="3" onClick={() => removeEditorFromList(id)}>
            supprimer
          </Button>
        </Box>
      </Flex>
    </Card>
  );
}

function AdminEditors() {
  const [currentOffset, setCurrentOffset] = useState(0);
  const resultPerPage = 10;
  const {
    debouncedFilters: { searchText },
  } = useContext(AdminFilterContext);

  useEffectObjectValuesChangeCallback({ searchText }, () => {
    if (currentOffset !== 0) {
      setCurrentOffset(0);
    }
  });

  const { data, error, loading } = useQuery(EDITORS, {
    fetchPolicy: "network-only",
    variables: {
      limit: resultPerPage,
      offset: currentOffset,
      searchText: searchText && searchText !== "" ? `%${searchText}%` : null,
    },
  });

  if (!useQueryReady(loading, error)) {
    return null;
  }

  const editors = data.editors;
  const count = editors.size;
  return (
    <PaginatedList
      entries={editors}
      RowItem={RowItem}
      count={count}
      resultPerPage={resultPerPage}
      currentOffset={currentOffset}
      setCurrentOffset={setCurrentOffset}
    />
  );
}

export { AdminEditors };
