const fs = require('fs-extra')
const path = require('path')

async function deployStandalone() {
    // Ensure directories exist
    await fs.ensureDir('.next/standalone/.next/static')
    await fs.ensureDir('.next/standalone/public')

    // Copy static files
    await fs.copy('.next/static', '.next/standalone/.next/static')
    await fs.copy('public', '.next/standalone/public')
    
    // Copy server file
    await fs.copy('server.js', '.next/standalone/server.js')

    console.log('✓ Deployment files prepared successfully!')
}

deployStandalone().catch(console.error)
