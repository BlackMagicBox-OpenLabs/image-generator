# Image Generator

A web application that generates images using the Stability AI API based on user prompts.

## Features

- Generate images from text prompts
- Configure generation parameters (engine, CFG scale, steps)
- View generation history
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm
- A Stability AI API key

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/BlackMagicBox-OpenLabs/image-generator.git
   cd image-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```bash
   cp example.env .env
   ```

4. Add your Stability AI API key to the `.env` file:
   ```
   STABILITY_API_KEY=your_stability_api_key_here
   ```
   > **Important:** The application will not work without a valid API key. You can get a key from [Stability AI](https://platform.stability.ai/).

## Running Locally

Start the server:
```bash
node server.js
```

Or use npm:
```bash
npm start
```

The application will be available at http://localhost:3000

## Usage

1. Enter a prompt describing the image you want to generate
2. Adjust generation parameters if needed
3. Click "Generate Image"
4. View your generated image and generation history

## Technologies Used

- Express.js (Backend)
- Vanilla JavaScript (Frontend)
- Stability AI API
- Axios for API requests
- dotenv for environment variables

## License

AGPL-3.0