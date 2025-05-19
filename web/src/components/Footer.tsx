import React from 'react'
import {
  Box,
  Grid,
  Typography,
  Link as MuiLink,
  Container
} from '@mui/material'

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: 'primary.main', color: 'white', py: 6, mt: 8 }}>
      {/* Back to top */}
      <Box sx={{ textAlign: 'center', mb: 4, cursor: 'pointer' }}>
        <Typography variant='body2'>Back to top</Typography>
      </Box>
      <Container maxWidth='lg'>
        {/* Footer main content */}
        <Grid container spacing={4} justifyContent='center'>
          <Grid item xs={6} sm={3}>
            <Typography variant='h6' gutterBottom>
              Get to Know Us
            </Typography>
            <FooterLink text='Careers' />
            <FooterLink text='Amazon and Our Planet' />
            <FooterLink text='Modern Slavery Statement' />
            <FooterLink text='Investor Relations' />
            <FooterLink text='Press Releases' />
            <FooterLink text='Amazon Science' />
          </Grid>

          <Grid item xs={6} sm={3}>
            <Typography variant='h6' gutterBottom>
              Make Money with Us
            </Typography>
            <FooterLink text='Sell on Amazon' />
            <FooterLink text='Become an Affiliate' />
            <FooterLink text='Advertise Your Products' />
            <FooterLink text='Host an Amazon Hub' />
          </Grid>

          <Grid item xs={6} sm={3}>
            <Typography variant='h6' gutterBottom>
              Amazon Payment Products
            </Typography>
            <FooterLink text='Amazon Rewards Visa Card' />
            <FooterLink text='Gift Cards' />
            <FooterLink text='Reload Your Balance' />
            <FooterLink text='Shop with Points' />
          </Grid>

          <Grid item xs={6} sm={3}>
            <Typography variant='h6' gutterBottom>
              Let Us Help You
            </Typography>
            <FooterLink text='Your Account' />
            <FooterLink text='Shipping Rates & Policies' />
            <FooterLink text='Returns & Replacements' />
            <FooterLink text='Help' />
          </Grid>
        </Grid>

        {/* Footer bottom area */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant='body2' color='gray'>
            © 2025 MyStore. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

const FooterLink = ({ text }: { text: string }) => (
  <MuiLink
    href='#'
    color='inherit'
    underline='hover'
    display='block'
    sx={{ mt: 1 }}
  >
    {text}
  </MuiLink>
)

export default Footer
