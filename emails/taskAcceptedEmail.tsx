import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "react-email";

interface TaskAcceptedEmailProps {
  username: string;
  taskTitle: string;
}

export default function TaskAcceptedEmail({
  username,
  taskTitle,
}: TaskAcceptedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Your task application was accepted
      </Preview>

      <Body>
        <Container>
          <Heading>
            Application Accepted
          </Heading>

          <Text>Hello {username},</Text>

          <Text>
            Your application for:
          </Text>

          <Heading>{taskTitle}</Heading>

          <Text>
            has been accepted. You can now chat
            with the requester.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}