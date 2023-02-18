import { Body } from "@react-email/body";
import { Button } from "@react-email/button";
import { Container } from "@react-email/container";
import { Heading } from "@react-email/heading";
import { Hr } from "@react-email/hr";
import { Html } from "@react-email/html";
import { Link } from "@react-email/link";
import { render } from "@react-email/render";
import { Section } from "@react-email/section";
import { Tailwind } from "@react-email/tailwind";
import { Text } from "@react-email/text";

interface Props {
  url: string;
}

const EmailSignIn = ({ url }: Props) => {
  return (
    <Html>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                bg: {
                  300: "rgb(242 242 242 / <alpha-value>)",
                },
                fg: {
                  100: "rgb(60 60 60 / <alpha-value>)",
                },
                border: {
                  100: "rgb(225 225 225 / <alpha-value>)",
                },
              },
            },
          },
        }}
      >
        <Body className="bg-white font-sans">
          <Container className="mx-auto max-w-[42em] rounded-md border border-solid border-border-100 py-4 px-8">
            <Heading className="text-2xl">Sign in to USTimematch</Heading>

            <Text>
              Thanks for using USTimematch, you can sign in to your account with
              the button below.
            </Text>

            <Section className="my-8 text-center">
              <Button
                href={url}
                className="mx-auto rounded-md bg-black px-5 py-3 text-sm text-white"
              >
                <strong>Sign In</strong>
              </Button>
            </Section>

            <Text>Or, copy and paste the below link into your browser.</Text>

            <code className="mb-4 inline-block break-all rounded-md bg-bg-300 p-4 text-xs">
              <Link href={url}>{url}</Link>
            </code>

            <Hr className="border-dark border-border-100" />

            <Text className="text-fg-100">
              The sign in link will expire in 24 hours.
              <br />
              If you didn&apos;t request for the email, please safely ignore it.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

const renderEmailSignIn = {
  html: ({ url }: Props) => render(<EmailSignIn url={url} />),
  text: ({ url }: Props) =>
    render(<EmailSignIn url={url} />, { plainText: true }),
};

export default renderEmailSignIn;
