const fs = require('fs');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Swagger definition
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Luxury E-Commerce API',
      version: '1.0.0',
      description: 'API documentation for the Luxury E-Commerce platform',
      contact: {
        name: 'API Support',
        email: 'support@luxuryecommerce.com'
      },
      license: {
        name: 'Proprietary',
        url: 'https://luxuryecommerce.com/license'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.luxuryecommerce.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './controllers/*.js',
    './routes/*.js',
    './models/*.js'
  ]
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Write to file
const outputPath = path.resolve(__dirname, '../public/docs/swagger.json');

// Ensure directory exists
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

console.log(`Swagger documentation generated at ${outputPath}`);

// Generate markdown documentation
const markdownPath = path.resolve(__dirname, '../public/docs/api-docs.md');

// Simple markdown generator
const generateMarkdown = (spec) => {
  let markdown = `# ${spec.info.title}\n\n`;
  markdown += `${spec.info.description}\n\n`;
  markdown += `**Version:** ${spec.info.version}\n\n`;
  
  // Add server information
  markdown += `## Servers\n\n`;
  spec.servers.forEach(server => {
    markdown += `- ${server.description}: \`${server.url}\`\n`;
  });
  
  markdown += `\n## Authentication\n\n`;
  markdown += `This API uses JWT Bearer token authentication.\n\n`;
  
  // Add paths
  markdown += `## Endpoints\n\n`;
  
  const paths = Object.keys(spec.paths).sort();
  
  paths.forEach(path => {
    markdown += `### ${path}\n\n`;
    
    const methods = spec.paths[path];
    const methodNames = Object.keys(methods).filter(m => !m.startsWith('x-'));
    
    methodNames.forEach(method => {
      const endpoint = methods[method];
      markdown += `#### \`${method.toUpperCase()}\`\n\n`;
      
      if (endpoint.summary) {
        markdown += `**Summary:** ${endpoint.summary}\n\n`;
      }
      
      if (endpoint.description) {
        markdown += `**Description:** ${endpoint.description}\n\n`;
      }
      
      if (endpoint.tags && endpoint.tags.length > 0) {
        markdown += `**Tags:** ${endpoint.tags.join(', ')}\n\n`;
      }
      
      // Parameters
      if (endpoint.parameters && endpoint.parameters.length > 0) {
        markdown += `**Parameters:**\n\n`;
        markdown += `| Name | In | Type | Required | Description |\n`;
        markdown += `| ---- | -- | ---- | -------- | ----------- |\n`;
        
        endpoint.parameters.forEach(param => {
          const type = param.schema ? param.schema.type : 'object';
          markdown += `| ${param.name} | ${param.in} | ${type} | ${param.required ? 'Yes' : 'No'} | ${param.description || ''} |\n`;
        });
        
        markdown += `\n`;
      }
      
      // Request body
      if (endpoint.requestBody) {
        markdown += `**Request Body:**\n\n`;
        
        const content = endpoint.requestBody.content;
        if (content && content['application/json']) {
          markdown += `Content-Type: \`application/json\`\n\n`;
          
          if (content['application/json'].schema) {
            if (content['application/json'].schema.example) {
              markdown += `Example:\n\`\`\`json\n${JSON.stringify(content['application/json'].schema.example, null, 2)}\n\`\`\`\n\n`;
            }
          }
        }
      }
      
      // Responses
      if (endpoint.responses) {
        markdown += `**Responses:**\n\n`;
        
        Object.keys(endpoint.responses).forEach(statusCode => {
          const response = endpoint.responses[statusCode];
          markdown += `**${statusCode}**: ${response.description}\n\n`;
          
          if (response.content && response.content['application/json'] && response.content['application/json'].schema) {
            if (response.content['application/json'].schema.example) {
              markdown += `Example:\n\`\`\`json\n${JSON.stringify(response.content['application/json'].schema.example, null, 2)}\n\`\`\`\n\n`;
            }
          }
        });
      }
      
      markdown += `---\n\n`;
    });
  });
  
  return markdown;
};

// Generate and write markdown
const markdownContent = generateMarkdown(swaggerSpec);
fs.writeFileSync(markdownPath, markdownContent);

console.log(`Markdown documentation generated at ${markdownPath}`);

// Generate HTML documentation
const htmlPath = path.resolve(__dirname, '../public/docs/index.html');

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${swaggerSpec.info.title}</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" />
  <style>
    body {
      margin: 0;
      background-color: #121212;
      color: #ffffff;
    }
    .swagger-ui {
      filter: invert(88%) hue-rotate(180deg);
    }
    .swagger-ui .topbar {
      background-color: #121212;
    }
    .topbar-wrapper img {
      content: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgNTAiPjx0ZXh0IHg9IjEwIiB5PSIzMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjRDRBRjM3Ij5MdXh1cnkgRS1Db21tZXJjZTwvdGV4dD48L3N2Zz4=');
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      window.ui = SwaggerUIBundle({
        url: "./swagger.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout",
        syntaxHighlight: {
          activated: true,
          theme: "monokai"
        },
        theme: "dark"
      });
    };
  </script>
</body>
</html>
`;

fs.writeFileSync(htmlPath, htmlContent);

console.log(`HTML documentation generated at ${htmlPath}`);
