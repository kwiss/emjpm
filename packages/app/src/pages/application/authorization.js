import { Box, Image } from "rebass";

import { AuthorizationLogin } from "~/containers/AuthorizationLogin";
import { Authorize } from "~/containers/Authorize";
import { HeadingTitle } from "~/containers/HeadingTitle";
import { LayoutPublic } from "~/containers/Layout";
import { BoxWrapper, FlexWrapper } from "~/components/Grid";

import useSearchParams from "~/hooks/useSearchParams";
import { useAuth } from "~/user/Auth";

export default function AuthorizationPage() {
  const {
    authStore: { token },
  } = useAuth();
  const {
    client_id: editorId,
    redirect_uri: redirectUrl,
    state = Math.random().toString(36).slice(2),
  } = useSearchParams();

  return (
    <LayoutPublic>
      <BoxWrapper>
        <HeadingTitle mt={"80px"} textAlign="center">
          Se connecter à une application métier
        </HeadingTitle>
      </BoxWrapper>
      <FlexWrapper my="50px">
        <Box
          sx={{
            flexBasis: ["100%", "50%"],
            p: "3",
          }}
        >
          <Image
            src="/images/login-application.png"
            sx={{
              mt: "80px",
              p: "3",
              width: ["100%"],
            }}
          />
        </Box>
        <Box
          sx={{
            flexBasis: ["100%", "50%"],
            p: "3",
          }}
        >
          {token ? (
            <Authorize
              state={state}
              token={token}
              editorId={editorId}
              redirectUrl={redirectUrl}
            />
          ) : (
            <AuthorizationLogin />
          )}
        </Box>
      </FlexWrapper>
    </LayoutPublic>
  );
}
