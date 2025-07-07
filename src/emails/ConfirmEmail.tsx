import { Html } from '@react-email/html';
import { Heading, Text, Button, Container } from '@react-email/components';

export function ConfirmEmail({ name, confirmationUrl }: { name: string; confirmationUrl: string }) {
  return (
    <Html>
      <Container style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <Heading>Welcome to Alsin, {name}!</Heading>
        <Text>Thanks for signing up. Please confirm your email address by clicking the link below:</Text>
        <Button href={confirmationUrl}>Confirm Email</Button>
        <Text>If you didn’t create this account, you can safely ignore this email.</Text>
      </Container>
    </Html>
  );
}
