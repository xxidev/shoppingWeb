import { Button, Container, Typography } from '@mui/material'

const ThankYouPage = () => (
  <Container maxWidth='sm' sx={{ mt: 8, textAlign: 'center' }}>
    <Typography variant='h4' gutterBottom>
      Thank you for your purchase!
    </Typography>
    <Typography>Your order has been placed successfully.</Typography>
    <Button variant='contained' sx={{ mt: 4 }} href='/'>
      Return to Home
    </Button>
  </Container>
)

export default ThankYouPage
