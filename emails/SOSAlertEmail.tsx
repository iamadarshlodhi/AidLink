import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "react-email";

interface SOSAlertEmailProps {
  username: string;
  taskTitle: string;
}

export default function SOSAlertEmail({
  username,
  taskTitle,
}: SOSAlertEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Emergency Alert from AidLink
      </Preview>

      <Body>
        <Container>
          <Heading>
            SOS Alert Triggered
          </Heading>

          <Text>
            An SOS alert has been triggered by:
          </Text>

          <Heading>{username}</Heading>

          <Text>
            Related Task:
          </Text>

          <Heading>{taskTitle}</Heading>

          <Text>
            Please contact the user immediately.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}