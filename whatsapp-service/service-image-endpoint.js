
// Add this endpoint to service.js after the /send endpoint

// Send image endpoint
app.post('/send-image', async (req, res) => {
    const { target, imagePath, caption } = req.body;
    
    if (!target || !imagePath) {
        return res.status(400).json({
            error: 'Missing required fields: target, imagePath'
        });
    }
    
    if (!isReady) {
        return res.status(503).json({
            error: 'WhatsApp client not ready',
            status: 'initializing'
        });
    }
    
    try {
        // Check if image exists
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({
                error: 'Image file not found',
                imagePath
            });
        }
        
        // Format number
        let chatId = target;
        if (!chatId.includes('@')) {
            chatId = chatId.replace(/\D/g, '') + '@c.us';
        }
        
        // Create MessageMedia
        const MessageMedia = (await import('whatsapp-web.js')).MessageMedia;
        const media = MessageMedia.fromFilePath(imagePath);
        
        // Send image
        await whatsappClient.sendMessage(chatId, media, { caption: caption || '' });
        
        // Log
        logSent(target, `[IMAGE] ${imagePath} (${caption || 'no caption'})`, 'api-image');
        
        console.log(`✅ Sent image to ${target}: ${imagePath}`);
        
        res.json({
            success: true,
            target,
            imagePath,
            caption
        });
        
    } catch (error) {
        console.error('❌ Send image failed:', error.message);
        res.status(500).json({
            error: error.message,
            target,
            imagePath
        });
    }
});
