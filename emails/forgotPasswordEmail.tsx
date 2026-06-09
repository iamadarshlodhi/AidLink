import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "react-email";


interface ForgotPasswordEmailProps {
  username: string;
  otp: string;
}

export default function ForgotPasswordEmail({
  username,
  otp,
}: ForgotPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Password Reset Code</Preview>

      <Body>
        <Container>
          <Heading>Password Reset</Heading>

          <Text>Hello {username},</Text>

          <Text>
            Use the following code to reset your
            password:
          </Text>

          <Heading>{otp}</Heading>

          <Text>
            This code expires in 10 minutes.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}