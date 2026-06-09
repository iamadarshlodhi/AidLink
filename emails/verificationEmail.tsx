import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "react-email";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your AidLink verification code</Preview>

      <Body>
        <Container>
          <Heading>Email Verification</Heading>

          <Text>Hello {username},</Text>

          <Text>
            Thank you for joining AidLink.
          </Text>

          <Text>
            Your verification code is:
          </Text>

          <Heading>{otp}</Heading>

          <Text>
            This code will expire in 10 minutes.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}