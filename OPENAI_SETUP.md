# OpenAI Setup Guide for NovaBudget Assistant

This guide will help you configure OpenAI API to power your NovaBudget AI assistant with intelligent, context-aware responses.

## Getting Your OpenAI API Key

1. **Create an OpenAI Account**
   - Visit [platform.openai.com](https://platform.openai.com)
   - Sign up or log in to your account

2. **Generate an API Key**
   - Navigate to [API Keys](https://platform.openai.com/api-keys)
   - Click "Create new secret key"
   - Give it a name (e.g., "NovaBudget Assistant")
   - Copy the key immediately (you won't be able to see it again!)

3. **Add Billing Information**
   - Go to [Billing](https://platform.openai.com/account/billing)
   - Add a payment method
   - Set up usage limits to control costs

## Configuring the App

1. **Install dependencies and start the server**
   - Copy `.env.example` to `.env`
   - Set `OPENAI_API_KEY` in `.env`
   - Run `npm install`
   - Run `npm start`
   - Open your browser to `http://localhost:3000/assistant.html`

2. **Select your model**
   - Click the ⚙️ settings icon in the top right
   - Choose your preferred model:
     - **GPT-3.5 Turbo**: Faster and cheaper (~$0.002 per 1K tokens)
     - **GPT-4**: Smarter but more expensive (~$0.03 per 1K tokens)

3. **Save Settings**
   - Click "Save Settings"
   - The app will show whether the server has a valid OpenAI key loaded
   - The header will show "OpenAI Powered" when ready

## Cost Estimates

### GPT-3.5 Turbo (Recommended)
- **Input**: $0.0015 per 1K tokens
- **Output**: $0.002 per 1K tokens
- **Average conversation**: ~500 tokens = $0.001
- **100 conversations**: ~$0.10

### GPT-4
- **Input**: $0.03 per 1K tokens
- **Output**: $0.06 per 1K tokens
- **Average conversation**: ~500 tokens = $0.02
- **100 conversations**: ~$2.00

> [!TIP]
> Start with GPT-3.5 Turbo for cost-effective testing. Upgrade to GPT-4 if you need more sophisticated responses.

## Features

### Intelligent Responses
- Context-aware budget advice
- Personalized recommendations based on your spending
- Natural conversation flow with memory

### Four Personality Modes
- **Helpful** 😊: Friendly and encouraging
- **Professional** 💼: Formal financial advisor
- **Sassy** 😎: Playful with tough love
- **Motivational** 🔥: Energetic coaching

### Conversation History
- Maintains context across messages
- Remembers previous questions and answers
- Provides coherent multi-turn conversations

## Troubleshooting

### "API request failed" Error
- **Check your API key**: Make sure it's entered correctly
- **Verify billing**: Ensure you have credits/payment method set up
- **Check rate limits**: You might have exceeded your quota

### "Not configured" Status
- Click the settings icon and enter your API key
- Make sure to click "Save Settings"
- Refresh the page if needed

### Slow Responses
- GPT-4 is slower than GPT-3.5 Turbo
- Check your internet connection
- OpenAI servers might be experiencing high load

### High Costs
- Switch to GPT-3.5 Turbo
- Set usage limits in OpenAI dashboard
- Monitor your usage at [platform.openai.com/usage](https://platform.openai.com/usage)

## Security Notes

> [!CAUTION]
> **Secure Server Storage**: The API key must be stored in the server environment and never exposed to the browser. Use `.env` and avoid committing `.env` to source control.

> [!WARNING]
> **Never Share Your API Key**: Treat it like a password. Don't commit it to version control or share it publicly.

## Fallback Mode

If OpenAI is not configured or encounters an error, the assistant automatically falls back to demo mode with pre-programmed responses. This ensures the app always works, even without an API key.

## Best Practices

1. **Set Usage Limits**: Configure monthly spending limits in OpenAI dashboard
2. **Monitor Usage**: Regularly check your usage and costs
3. **Start Small**: Test with GPT-3.5 Turbo before upgrading
4. **Clear History**: Conversation history is stored in memory and resets on page refresh
5. **Secure Your Key**: Never expose your API key in screenshots or recordings

## Support

For OpenAI-specific issues:
- [OpenAI Documentation](https://platform.openai.com/docs)
- [OpenAI Community](https://community.openai.com)
- [OpenAI Help Center](https://help.openai.com)

For NovaBudget app issues:
- Check the README.md in the project root
- Review the implementation_plan.md for technical details
