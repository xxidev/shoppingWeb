import app from 'app'
import config, { sequelize } from 'config'
import { setupAssociations } from 'config/associations'

const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Database connection has been established successfully.')
    await sequelize.sync()
    console.log('✅ All models were synchronized successfully.')
    setupAssociations()

    const port = config.port
    app.listen(port, () => {
      console.log(
        `🚀 Server is running on port ${port} in ${config.nodeEnv} mode`
      )
    })

    process.on('SIGTERM', () => {
      console.log('SIGTERM received: closing server')
      process.exit(0)
    })
  } catch (error) {
    console.error('❌ Unable to initialize the application:', error)
    process.exit(1)
  }
}

startServer().catch(error => {
  console.error('❌ An error occurred while starting the application:', error)
  process.exit(1)
})
